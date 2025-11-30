import useHandleError from "@/components/hooks/useHandleError";
import Picklist from "@/components/shared/picklist";
import SelectOU from "@/components/shared/select-org-units";
import ButtonComponent from "@/components/ui/button";
import SelectComponent from "@/components/ui/form/select";
import { MaterialInput } from "@/components/ui/material-input";
import { useLanguage } from "@/context/language";
import {
  createSla,
  slaSchema,
  SlaType,
  updateSla,
} from "@/pages/pages/service";
import { CloseOutlined, EditFilled, PlusOutlined } from "@ant-design/icons";
import { zodResolver } from "@hookform/resolvers/zod";
import { Col, Modal, Row, Typography } from "antd";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { getSlaTypes } from "../../consts/sla";
import useCustomMessage from "@/components/hooks/use-message";

type Props = {
  onCancel: () => void;
  refreshData: () => Promise<void>;
  editedCol: SlaType | null;
};
const CreateSlaModal = ({ onCancel, refreshData, editedCol }: Props) => {
  const { showMessage } = useCustomMessage();
  const isEditMode = Boolean(editedCol);
  const { handleError } = useHandleError();
  const { labels, isEnglish } = useLanguage();
  const [loading, setLoading] = useState(false);
  const {
    control,
    watch,
    getValues,
    reset,
    formState: { errors, isValid },
  } = useForm<SlaType>({
    resolver: zodResolver(slaSchema),
    mode: "all",
  });

  useEffect(() => {
    if (isEditMode) {
      reset({
        ...editedCol,
        org_unit: editedCol?.org_unit || undefined,
      });
    }
  }, [isEditMode]);
  const {
    corr_no = "",
    corr_subject = "",
    corr_type = undefined,
    security_level = undefined,
    urgency_level = undefined,
    org_unit = undefined,
  } = watch();

  const corrValidiation =
    Boolean(corr_no) ||
    Boolean(corr_subject) ||
    Boolean(corr_type) ||
    Boolean(security_level) ||
    Boolean(urgency_level) ||
    Boolean(org_unit);

  const onSubmit = async () => {
    if (isEditMode) {
      handleUpdate();
    } else {
      handleCreate();
    }
  };

  const handleCreate = async () => {
    const { order_by, sla_time, ...data } = getValues();
    try {
      setLoading(true);
      const body: SlaType = {
        ...data,
        sla_time: Number(sla_time),
        order_by: Number(order_by),
      };
      const res = await createSla(body);

      if (res) {
        onCancel();
        showMessage("success", labels.msg.create_success);
        await refreshData();
      }
    } catch (e) {
      handleError(e);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    const { order_by, sla_time, ...data } = getValues();
    try {
      setLoading(true);
      const body: SlaType = {
        ...data,
        sla_time: Number(sla_time),
        order_by: Number(order_by),
      };
      const res = await updateSla(editedCol?.id || "", body);

      if (res) {
        onCancel();
        showMessage("success", labels.msg.create_success);
        await refreshData();
      }
    } catch (e) {
      handleError(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title={
        <Typography>
          {isEditMode
            ? isEnglish
              ? "Edit SLA"
              : "تعديل إتفاقية"
            : isEnglish
            ? "Create SLA"
            : "إنشاء إتفاقية"}
        </Typography>
      }
      centered
      open={true}
      onCancel={onCancel}
      zIndex={10}
      width={600}
      footer={
        <div style={{ marginTop: 25 }}>
          <ButtonComponent
            buttonLabel={labels.btn.cancel}
            onClick={() => {
              onCancel();
            }}
            icon={<CloseOutlined />}
            style={{ margin: "0 15px" }}
          />

          <ButtonComponent
            icon={isEditMode ? <EditFilled /> : <PlusOutlined />}
            buttonLabel={isEditMode ? labels.btn.edit : labels.btn.create}
            spinning={loading}
            type="primary"
            disabled={!isValid || !corrValidiation}
            onClick={onSubmit}
          />
        </div>
      }
    >
      <Row gutter={10}>
        <Col span={12} style={{ marginTop: 20 }}>
          <Controller
            name="name"
            control={control}
            render={({ field }) => (
              <MaterialInput
                label={labels.lbl.name + " * "}
                {...field}
                value={field?.value?.toString()}
                error={
                  errors?.name?.message
                    ? isEnglish
                      ? "this field is required"
                      : "هذا الحقل مطلوب"
                    : ""
                }
              />
            )}
          />
        </Col>
        <Col span={12} style={{ marginTop: 20 }}>
          <Controller
            name="org_unit"
            control={control}
            render={({ field }) => (
              <SelectOU
                multiSelect={false}
                canClear={true}
                label={labels.lbl.org_unit}
                {...field}
              />
            )}
          />
        </Col>
        <Col span={12} style={{ marginTop: 20 }}>
          <Controller
            name="corr_type"
            control={control}
            render={({ field }) => (
              <Picklist
                canClear={true}
                code="Correspondence Type"
                label={labels.lbl.corr_types}
                {...field}
              />
            )}
          />
        </Col>
        <Col span={12} style={{ marginTop: 20 }}>
          <Controller
            name="corr_subject"
            control={control}
            render={({ field }) => (
              <MaterialInput label={labels.lbl.subject} {...field} />
            )}
          />
        </Col>
        <Col span={12} style={{ marginTop: 20 }}>
          <Controller
            name="corr_no"
            control={control}
            render={({ field }) => (
              <MaterialInput label={labels.lbl.corr_number} {...field} />
            )}
          />
        </Col>

        <Col span={12} style={{ marginTop: 20 }}>
          <Controller
            name="urgency_level"
            control={control}
            render={({ field }) => (
              <Picklist
                canClear={true}
                code="Urgency Level"
                label={labels.lbl.urgency_level}
                {...field}
              />
            )}
          />
        </Col>

        <Col span={12} style={{ marginTop: 20 }}>
          <Controller
            name="security_level"
            control={control}
            render={({ field }) => (
              <Picklist
                canClear={true}
                code="Security Level"
                label={labels.lbl.security_level}
                {...field}
              />
            )}
          />
        </Col>

        <Col span={12} style={{ marginTop: 20 }}>
          <Controller
            name="sla_time_type"
            control={control}
            render={({ field }) => (
              <SelectComponent
                canClear={true}
                label={labels.lbl.sla_type + " * "}
                value={field.value}
                onChange={(val) => field.onChange(val)}
                mode={undefined}
                options={getSlaTypes(isEnglish)}
              />
            )}
          />
        </Col>
        <Col span={12} style={{ marginTop: 20 }}>
          <Controller
            name="sla_time"
            control={control}
            render={({ field }) => (
              <MaterialInput
                label={labels.lbl.sla_time + " * "}
                {...field}
                value={field?.value?.toString()}
                error={
                  errors?.sla_time?.message
                    ? isEnglish
                      ? "you should add an integer"
                      : "يجب إضافة أرقام صحيحة"
                    : ""
                }
              />
            )}
          />
        </Col>
        <Col span={12} style={{ marginTop: 20 }}>
          <Controller
            name="order_by"
            control={control}
            render={({ field }) => (
              <MaterialInput
                {...field}
                value={field?.value?.toString()}
                error={
                  errors?.order_by?.message
                    ? isEnglish
                      ? "you should add an integer"
                      : "يجب إضافة أرقام صحيحة"
                    : ""
                }
                label={
                  (isEnglish ? "Priority Order" : "ترتيب الأولوية") + " * "
                }
              />
            )}
          />
        </Col>
      </Row>
    </Modal>
  );
};

export default CreateSlaModal;
