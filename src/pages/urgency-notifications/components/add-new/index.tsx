import {
  CloseOutlined,
  EditFilled,
  FolderAddFilled,
  PlusOutlined,
} from "@ant-design/icons";
import { Button, Col, Form, Modal, Row } from "antd";
import { useLanguage } from "../../../../context/language";
import { LANGUAGE } from "../../../../constants/language";
import { englishLabels } from "../../../../constants/app-constants/en";
import { arabicLabels } from "../../../../constants/app-constants/ar";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { MaterialInput } from "../../../../components/ui/material-input";
import { MaterialSelect } from "../../../../components/ui/dropdown/material-dropdown";
import { useEffect } from "react";
import {
  CreateUrgencyType,
  UrgencyNotificationPickListType,
  createUrgencySchema,
} from "../../../../components/services/urgency-notifications/type";
import { UrgencyNotificationPeriodData } from "../../../../components/services/urgency-notifications";

interface CreateNewUrgencyProps {
  visible: boolean;
  onCancel: () => void;
  pickList?: UrgencyNotificationPickListType;
  fullLists: UrgencyNotificationPickListType[];
  onSubmit: (item: CreateUrgencyType) => void;
}

export default function CreateNewUrgencyNotification({
  pickList,
  onCancel,
  visible,
  fullLists,
  onSubmit,
}: CreateNewUrgencyProps) {
  const { language } = useLanguage();
  const isEnglish = language === LANGUAGE.ENGLISH_INT;
  const labels = isEnglish ? englishLabels : arabicLabels;

  const {
    control,
    handleSubmit,
    setError,
    formState: { errors },
    // getValues,
    setValue,
  } = useForm<CreateUrgencyType>({
    resolver: zodResolver(createUrgencySchema),
    mode: "all",
    defaultValues: {
      isActive: true,
      isSystem: true,
      picklistName: "Urgency Level",
      picklistType: "system",
    },
  });

  useEffect(() => {
    if (pickList) {
      setValue("actionDuration", pickList.actionDuration.toString());
      setValue("durationUnit", pickList.durationUnit);
      setValue("isActive", pickList.isActive === true ? true : false);
      setValue("isSystem", pickList.isSystem === true ? true : false);
      setValue(
        "notificationFrequency",
        pickList.notificationFrequency.toString()
      );
      setValue("picklistArLabel", pickList.picklistArLabel);
      setValue("picklistEnLabel", pickList.picklistEnLabel);
      setValue("picklistName", pickList.picklistName);
      setValue("picklistType", pickList.picklistType);
    }
  }, [pickList]);

  const onBlurDescAr = (text: string) => {
    let found = fullLists.find((list) => list.picklistArLabel.includes(text));

    if (found) {
      return setError("picklistArLabel", {
        type: "api",
        message: "Picklist Arabic name already exist",
      });
    }
  };

  const onBlurDescEn = (text: string) => {
    let found = fullLists.find((list) => list.picklistEnLabel.includes(text));

    if (found) {
      return setError("picklistEnLabel", {
        type: "api",
        message: "Picklist English name already exist",
      });
    }
  };

  return (
    <Modal
      title={
        <>
          {pickList ? (
            <EditFilled
              style={{
                marginLeft: isEnglish ? 0 : 10,
                marginRight: isEnglish ? 10 : 0,
              }}
            />
          ) : (
            <FolderAddFilled
              style={{
                marginLeft: isEnglish ? 0 : 10,
                marginRight: isEnglish ? 10 : 0,
              }}
            />
          )}

          {pickList
            ? labels.btn.edit + " " + labels.mnu.urgency_notification
            : labels.btn.create + " " + labels.mnu.urgency_notification}
        </>
      }
      centered
      open={visible}
      zIndex={10}
      width={700}
      onCancel={onCancel}
      afterClose={onCancel}
      footer={
        <div style={{ marginTop: 25 }}>
          <Button onClick={onCancel} style={{ margin: "0 15px" }}>
            <CloseOutlined />
            {labels.btn.cancel}
          </Button>
          <Button type="primary" onClick={handleSubmit(onSubmit)}>
            {pickList?.id ? <EditFilled /> : <PlusOutlined />}
            {pickList?.id ? labels.btn.edit : labels.btn.create}
          </Button>
        </div>
      }
    >
      <Form
        name="create-edit-entity"
        onFinish={() => {}}
        onFinishFailed={() => {}}
        layout="vertical"
      >
        <Row gutter={10} style={{ marginTop: 20 }}>
          <Col span={12} style={{ marginTop: 20 }}>
            <Controller
              name="picklistArLabel"
              control={control}
              render={({ field }) => (
                <MaterialInput
                  label={labels.lbl.picklist_ar_label + " *"}
                  {...field}
                  onBlur={(e: React.FocusEvent<HTMLInputElement>) => {
                    field.onBlur();
                    onBlurDescAr(e.target.value);
                  }}
                  error={errors.picklistArLabel?.message}
                />
              )}
            />
          </Col>
          <Col span={12} style={{ marginTop: 20 }}>
            <Controller
              name="picklistEnLabel"
              control={control}
              render={({ field }) => (
                <MaterialInput
                  label={labels.lbl.picklist_en_label + " *"}
                  {...field}
                  onBlur={(e: React.FocusEvent<HTMLInputElement>) => {
                    field.onBlur();
                    onBlurDescEn(e.target.value);
                  }}
                  error={errors.picklistEnLabel?.message}
                />
              )}
            />
          </Col>
          <Col span={12} style={{ marginTop: 20 }}>
            <Controller
              name="actionDuration"
              control={control}
              render={({ field }) => (
                <MaterialInput
                  label={labels.lbl.period_unit + " *"}
                  {...field}
                  error={errors.actionDuration?.message}
                />
              )}
            />
          </Col>
          <Col span={12} style={{ marginTop: 20 }}>
            <Controller
              name="durationUnit"
              control={control}
              render={({ field }) => (
                <MaterialSelect
                  {...field}
                  label={labels.lbl.duration_unit + " *"}
                  error={errors.durationUnit?.message}
                  options={UrgencyNotificationPeriodData}
                />
              )}
            />
          </Col>
          <Col span={12} style={{ marginTop: 20 }}>
            <Controller
              name="notificationFrequency"
              control={control}
              render={({ field }) => (
                <MaterialInput
                  label={labels.lbl.escalation_after_how_many_reminders + " *"}
                  {...field}
                  error={errors.notificationFrequency?.message}
                />
              )}
            />
          </Col>
        </Row>
      </Form>
    </Modal>
  );
}
