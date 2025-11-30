import { Col, Form } from "antd";
import { MaterialInput } from "../../../../../../components/ui/material-input";
import { useLanguage } from "../../../../../../context/language";
import { Controller, useFormContext } from "react-hook-form";
import { InboundType } from "@/pages/create-inbound/schema";
import SelectExternalEntity from "@/components/shared/select-external-entity";
import Picklist from "@/components/shared/picklist";
import InboundReceivingEntity from "@/pages/inbounds/components/reciving-entity";

export default function BasicInfo() {
  const { labels } = useLanguage();

  const { control } = useFormContext<InboundType>();

  return (
    <>
      <Form name="basic-info" layout="vertical">
        <Col style={{ marginTop: 20 }}>
          <Controller
            name="corr_subject"
            control={control}
            render={({ field }) => (
              <MaterialInput label={labels.lbl.corr_subject} {...field} />
            )}
          />
        </Col>
        <Col style={{ marginTop: 12 }}>
          <Controller
            name="sending_entity_id"
            control={control}
            render={({ field }) => (
              <SelectExternalEntity
                disabled
                multiSelect={false}
                label={labels.lbl.sending_entity}
                {...field}
              />
            )}
          />
        </Col>
        <Col style={{ marginTop: 12 }}>
          <Controller
            name="receiving_entity_id"
            control={control}
            render={({ field }) => (
              <InboundReceivingEntity
                disabled
                value={field.value as number}
                onChange={(value: number) => {
                  field.onChange(value as number);
                }}
              />
            )}
          />
        </Col>
        <Col style={{ marginTop: 20 }}>
          <Controller
            name="doc_type_id"
            control={control}
            render={({ field }) => (
              <Picklist
                label={labels.lbl.document_type}
                code="Document Type"
                {...field}
                onChange={(value: string) => {
                  field.onChange(value);
                }}
              />
            )}
          />
        </Col>
        <Col style={{ marginTop: 20 }}>
          <Controller
            name="urgency_id"
            control={control}
            render={({ field }) => (
              <Picklist
                label={labels.lbl.urgency_level}
                code="Urgency Level"
                {...field}
                onChange={(value: string) => {
                  field.onChange(value);
                }}
              />
            )}
          />
        </Col>
        <Col style={{ marginTop: 20 }}>
          <Controller
            name="security_level_id"
            control={control}
            render={({ field }) => (
              <Picklist
                label={labels.lbl.security_level}
                code="Security Level"
                {...field}
                onChange={(value: string) => {
                  field.onChange(value);
                }}
              />
            )}
          />
        </Col>
        <Col style={{ marginTop: 20 }}>
          <Controller
            name="corr_language_id"
            control={control}
            render={({ field }) => (
              <Picklist
                label={labels.lbl.language}
                code="Language"
                {...field}
                onChange={(value: string) => {
                  field.onChange(value);
                }}
              />
            )}
          />
        </Col>

        {/* <Col style={{ marginTop: 30, marginBottom: 30 }}>
          <Controller
            name="genericActionDTO.readReceipt"
            control={control}
            render={({ field }) => (
              <Col style={{ display: "flex" }}>
                <Checkbox
                  checked={field.value}
                  onChange={(e: CheckboxChangeEvent) => {
                    field.onChange(e.target.checked);
                  }}
                />
                <Typography style={{ marginLeft: 20, marginRight: 20 }}>
                  {labels.tbl.task_read_receipt}
                </Typography>
                <Tooltip title={labels.msg.hint_readReceipt}>
                  <InfoCircleFilled />
                </Tooltip>
              </Col>
            )}
          />
        </Col> */}
      </Form>
    </>
  );
}
