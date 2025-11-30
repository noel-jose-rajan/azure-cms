import { Button, Col, Form, Row, message } from "antd";
import { MaterialInput } from "../../../../components/ui/material-input";
import { useLanguage } from "../../../../context/language";
import { LANGUAGE } from "../../../../constants/language";
import { englishLabels } from "../../../../constants/app-constants/en";
import { arabicLabels } from "../../../../constants/app-constants/ar";
import { CloseOutlined, SaveFilled } from "@ant-design/icons";
import { z } from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { OrganizationUnitType } from "../../../../components/services/organization-units/type";
import { updateOUDetails } from "../../../../components/services/organization-units";
import { HttpStatus } from "../../../../components/functional/httphelper";

interface OrgUnitOpenTextProps {
  orgUnit?: OrganizationUnitType;
  activateLoader: (loading: boolean) => void;
}

export const updateOrgUnitOpenTextSchema = z.object({
  opentextInboundExternalFolderId: z
    .string()
    .regex(/^\d+$/, "Only numeric values are allowed"),
  opentextInboundInternalFolderId: z
    .string()
    .regex(/^\d+$/, "Only numeric values are allowed"),
  opentextOutboundExternalFolderId: z
    .string()
    .regex(/^\d+$/, "Only numeric values are allowed"),
  opentextOutboundInternalFolderId: z
    .string()
    .regex(/^\d+$/, "Only numeric values are allowed"),
});

export type UpdateOUOpenTextType = z.infer<typeof updateOrgUnitOpenTextSchema>;

export default function OrgUnitOpenText({
  orgUnit,
  activateLoader,
}: OrgUnitOpenTextProps) {
  const { language } = useLanguage();
  const isEnglish = language === LANGUAGE.ENGLISH_INT;
  const labels = isEnglish ? englishLabels : arabicLabels;
  const [messageApi, contextHolder] = message.useMessage();

  const {
    control,
    handleSubmit,
    formState: { errors },
    // setValue,
  } = useForm<UpdateOUOpenTextType>({
    resolver: zodResolver(updateOrgUnitOpenTextSchema),
    mode: "all",
  });

  useEffect(() => {
    resetToDefault();
  }, [orgUnit]);

  const resetToDefault = () => {
    if (orgUnit) {
      // setValue(
      //   "opentextInboundExternalFolderId",
      //   orgUnit.opentextInboundExternalFolderId?.toString() ?? ""
      // );
      // setValue(
      //   "opentextInboundInternalFolderId",
      //   orgUnit.opentextInboundInternalFolderId?.toString() ?? ""
      // );
      // setValue(
      //   "opentextOutboundExternalFolderId",
      //   orgUnit.opentextOutboundExternalFolderId?.toString() ?? ""
      // );
      // setValue(
      //   "opentextOutboundInternalFolderId",
      //   orgUnit.opentextOutboundInternalFolderId?.toString() ?? ""
      // );
    }
  };

  const updateOUOpenTextData = async (values: UpdateOUOpenTextType) => {
    if (!orgUnit?.entity_id) {
      return;
    }

    activateLoader(true);

    const jsonData = {
      opentextInboundExternalFolderId: Number(
        values.opentextInboundExternalFolderId
      ),
      opentextInboundInternalFolderId: Number(
        values.opentextInboundInternalFolderId
      ),
      opentextOutboundExternalFolderId: Number(
        values.opentextOutboundExternalFolderId
      ),
      opentextOutboundInternalFolderId: Number(
        values.opentextOutboundInternalFolderId
      ),
    };

    const response = await updateOUDetails(jsonData, orgUnit?.entity_id);

    activateLoader(false);

    if (response.status === HttpStatus.SUCCESS) {
      messageApi.success(
        isEnglish ? "Successfully updated" : "تم التحديث بنجاح"
      );
    } else {
      messageApi.error(
        isEnglish
          ? "Something went wrong! Please contact your system administrator"
          : "حدث خطأ ما، يرجى الاتصال بمسؤول النظام"
      );
    }
  };

  return (
    <Col>
      {contextHolder}
      <Form
        name="create-org-unit-data"
        onFinish={() => {}}
        onFinishFailed={() => {}}
        layout="vertical"
      >
        <Row
          gutter={10}
          style={{ marginTop: 10, padding: 10, width: "90%", minWidth: 600 }}
        >
          <Col span={12} style={{ marginTop: 20 }}>
            <Controller
              name="opentextInboundExternalFolderId"
              control={control}
              render={({ field }) => (
                <MaterialInput
                  label={
                    labels.lbl.org_unit_opentextInboundExternalFolderId + " *"
                  }
                  {...field}
                  error={errors.opentextInboundExternalFolderId?.message}
                />
              )}
            />
          </Col>
          <Col span={12} style={{ marginTop: 20 }}>
            <Controller
              name="opentextInboundInternalFolderId"
              control={control}
              render={({ field }) => (
                <MaterialInput
                  label={
                    labels.lbl.org_unit_opentextInboundInternalFolderId + " *"
                  }
                  {...field}
                  error={errors.opentextInboundInternalFolderId?.message}
                />
              )}
            />
          </Col>
          <Col span={12} style={{ marginTop: 30 }}>
            <Controller
              name="opentextOutboundExternalFolderId"
              control={control}
              render={({ field }) => (
                <MaterialInput
                  label={
                    labels.lbl.org_unit_opentextOutboundExternalFolderId + " *"
                  }
                  {...field}
                  error={errors.opentextOutboundExternalFolderId?.message}
                />
              )}
            />
          </Col>
          <Col span={12} style={{ marginTop: 30 }}>
            <Controller
              name="opentextOutboundInternalFolderId"
              control={control}
              render={({ field }) => (
                <MaterialInput
                  label={
                    labels.lbl.org_unit_opentextOutboundInternalFolderId + " *"
                  }
                  {...field}
                  error={errors.opentextOutboundInternalFolderId?.message}
                />
              )}
            />
          </Col>
        </Row>
        <Col style={{ marginTop: 40, paddingLeft: 10 }}>
          <Button type="primary" onClick={handleSubmit(updateOUOpenTextData)}>
            <SaveFilled />
            {labels.btn.save}
          </Button>
          <Button
            style={{ marginLeft: 10, marginRight: 10 }}
            onClick={resetToDefault}
          >
            <CloseOutlined />
            {labels.btn.reset}
          </Button>
        </Col>
      </Form>
    </Col>
  );
}
