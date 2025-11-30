import { Col, Form, Row } from "antd";
import { Controller, useForm, useWatch } from "react-hook-form";
import { MaterialInput } from "@/components/ui/material-input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLanguage } from "@/context/language";
import { useEffect, useState } from "react";
import { EditFilled, PlusOutlined } from "@ant-design/icons";
import { createNewOrgUnit } from "@/components/services/organization-units";
import {
  OUschema,
  OrgUnitType,
  OrgUnitMergedDataType,
  UpdateOUType,
} from "@/components/services/organization-units/type";
import Picklist from "@/components/shared/picklist";
import SelectUsers from "@/components/shared/select-users";
import SelectOU from "@/components/shared/select-org-units";
import { CONST_DATA } from "@/constants/app";
import { useNavigate, useParams } from "react-router-dom";
import ButtonComponent from "@/components/ui/button";
import useUpdateOrgUnit from "../../../organization-units/hooks/use-update-ou";
import { ApiErrorResponse } from "@/types/error";
import useGetAllOU from "@/store/orgs/use-get-all-ou";
import WhileInViewWrapper from "@/animations/while-in-view-wrapper";
import useHandleError from "@/components/hooks/useHandleError";
import useCustomMessage from "@/components/hooks/use-message";
interface OrgUnitDataComponentProps {
  orgUnit?: OrgUnitMergedDataType;
}

export default function AddEditOrgUnit({ orgUnit }: OrgUnitDataComponentProps) {
  const { showMessage } = useCustomMessage();
  const { handleError } = useHandleError();
  const { id } = useParams();
  const { labels } = useLanguage();
  const [createLoading, setCreateLoading] = useState<boolean>(false);
  const navigate = useNavigate();
  const { refreshAllOrgs } = useGetAllOU();
  const { handleUpdateOrgUnit, loading: updateLoading } = useUpdateOrgUnit();
  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
    setValue,
    getValues,
    setError,
    clearErrors,
    reset,
  } = useForm<OrgUnitType>({
    resolver: zodResolver(OUschema),
  });
  const orgUnitLevel = useWatch({ control, name: "entity_level_id" });
  const parentId = useWatch({ control, name: "parent_id" });

  useEffect(() => {
    if (orgUnit) {
      reset({
        entity_code: orgUnit?.entity_code || "",
        name_en: orgUnit?.name_en || "",
        name_ar: orgUnit?.name_ar || "",
        entity_level_id: orgUnit?.entity_level_id,
        parent_id: orgUnit?.parent_id,
        manager_id: orgUnit?.manager_id,
        escalated_performer_id: orgUnit?.escalated_performer_id,
        email: orgUnit?.email || "",
        abbr: orgUnit?.abbr || "",
      });
    }
  }, [orgUnit]);

  const handleCreate = async () => {
    try {
      setCreateLoading(true);
      const values = getValues();
      const payload = {
        ...values,
        is_active: true,
      };
      const res = await createNewOrgUnit(payload);
      if (res) {
        await refreshAllOrgs();
        showMessage("success", labels.msg.orgunit_create);
        navigate(`/admin/organization-units/${res?.ID}`, {
          replace: true,
        });
      }
    } catch (error: unknown) {
      handleError(error as ApiErrorResponse);
    } finally {
      setCreateLoading(false);
    }
  };

  const handleUpdate = async () => {
    const values = getValues();

    const res = await handleUpdateOrgUnit(id || "", values as UpdateOUType);
    if (res?.ID) {
      showMessage("success", labels.msg.orgunit_updated);
    }
    await refreshAllOrgs();
  };

  const handleSubmitForm = () => {
    if (id) {
      handleUpdate();
    } else {
      handleCreate();
    }
  };

  useEffect(() => {
    if (parentId) {
      clearErrors("parent_id");
    }
  }, [parentId]);
  return (
    <WhileInViewWrapper once={false}>
      <Form
        name="create-org-unit-data"
        onFinish={() => {}}
        onFinishFailed={() => {}}
        layout="vertical"
      >
        <Row
          gutter={[10, 30]}
          style={{ marginTop: 20, padding: 10, width: "60%", minWidth: 650 }}
        >
          <Col span={24}>
            <Controller
              name="entity_code"
              control={control}
              render={({ field }) => (
                <MaterialInput
                  label={labels.lbl.org_unit_code + " *"}
                  {...field}
                  error={errors.entity_code?.message}
                  allowEdit={orgUnit?.id ? false : true}
                />
              )}
            />
          </Col>
          <Col span={12}>
            <Controller
              name="name_en"
              control={control}
              render={({ field }) => (
                <MaterialInput
                  label={labels.lbl.english_name + " *"}
                  {...field}
                  error={errors.name_en?.message}
                />
              )}
            />
          </Col>
          <Col span={12}>
            <Controller
              name="name_ar"
              control={control}
              render={({ field }) => (
                <MaterialInput
                  label={labels.lbl.arabic_name + " *"}
                  {...field}
                  error={errors.name_ar?.message}
                />
              )}
            />
          </Col>
          <Col span={12}>
            <Controller
              name="entity_level_id"
              control={control}
              render={({ field }) => (
                <Picklist
                  disabled={Boolean(orgUnit?.id)}
                  code="Org Unit Level"
                  {...field}
                  label={labels.lbl.org_unit_level + " *"}
                  error={errors.entity_level_id?.message}
                  onChange={(value) => {
                    field.onChange(value);
                    if (value === CONST_DATA.level_One_Id) {
                      setValue("parent_id", undefined);
                      clearErrors("parent_id");
                    } else {
                      if (!parentId) {
                        setError("parent_id", {
                          type: "required",
                          message: "error",
                        });
                      }
                    }
                  }}
                />
              )}
            />
          </Col>
          <Col span={12}>
            <Controller
              name="parent_id"
              control={control}
              render={({ field }) => (
                <SelectOU
                  {...field}
                  isRequired
                  disabled={
                    orgUnitLevel == CONST_DATA.level_One_Id ||
                    Boolean(orgUnit?.id)
                  }
                  multiSelect={false}
                  label={labels.lbl.org_unit_parent}
                  error={errors.parent_id?.message}
                />
              )}
            />
          </Col>
          <Col span={12}>
            <Controller
              name="manager_id"
              control={control}
              render={({ field }) => (
                <>
                  <SelectUsers
                    {...field}
                    isRequired
                    error={errors.manager_id?.message}
                    multiSelect={false}
                    label={labels["Org Unit Manager"]}
                  />
                </>
              )}
            />
          </Col>
          <Col span={12}>
            <Controller
              name="escalated_performer_id"
              control={control}
              render={({ field }) => (
                <Picklist
                  code="Escalation Performer"
                  {...field}
                  label={labels.lbl.escalation_performer + " *"}
                  error={errors.escalated_performer_id?.message}
                  onChange={(value) => {
                    field.onChange(value);
                  }}
                />
              )}
            />
          </Col>
          <Col span={12}>
            <Controller
              name="email"
              control={control}
              render={({ field }) => (
                <MaterialInput
                  label={labels.lbl.email}
                  {...field}
                  error={errors.email?.message}
                />
              )}
            />
          </Col>
          <Col span={12}>
            <Controller
              name="abbr"
              control={control}
              render={({ field }) => (
                <MaterialInput
                  label={labels.lbl.orgUnitAbbreviation + " *"}
                  {...field}
                  error={errors.abbr?.message}
                />
              )}
            />
          </Col>
        </Row>
        <Col
          style={{
            padding: 10,
          }}
        >
          <ButtonComponent
            icon={id ? <EditFilled /> : <PlusOutlined />}
            type="primary"
            spinning={createLoading || updateLoading}
            onClick={handleSubmit(handleSubmitForm)}
            buttonLabel={id ? labels.btn.edit : labels.btn.create}
            disabled={
              !isValid ||
              (orgUnitLevel !== CONST_DATA.level_One_Id &&
                !Number.isInteger(parentId))
            }
          />
        </Col>
      </Form>
    </WhileInViewWrapper>
  );
}
