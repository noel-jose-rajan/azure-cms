import { Checkbox, Col, Form } from "antd";
import { MaterialInput } from "../../../../../../components/ui/material-input";
import { useLanguage } from "../../../../../../context/language";
import { Controller, useFormContext } from "react-hook-form";
import { ChangeEvent } from "react";
import { InboundType } from "@/pages/create-inbound/schema";
import SelectUsers from "@/components/shared/select-users";
import SelectOU from "@/components/shared/select-org-units";
import KeywordInput from "@/components/ui/form/KeyWordInput";
import RelatedCorrSelect from "@/components/shared/related-corr-select";
import { useParams } from "react-router-dom";

export default function MoreInfo() {
  const { id } = useParams();
  const { labels } = useLanguage();
  const { control } = useFormContext<InboundType>();
  return (
    <>
      <Form name="basic-info" layout="vertical">
        <Col style={{ marginTop: 20 }}>
          <Controller
            name="agent_from"
            control={control}
            render={({ field }) => (
              <MaterialInput label={labels.lbl.sender_name} {...field} />
            )}
          />
        </Col>
        <Col style={{ marginTop: 20 }}>
          <Controller
            name="agent_personal_id"
            control={control}
            render={({ field }) => (
              <MaterialInput label={labels.lbl.sender_id} {...field} />
            )}
          />
        </Col>
        <Col style={{ marginTop: 20 }}>
          <Controller
            name="agent_phone"
            control={control}
            render={({ field }) => (
              <MaterialInput label={labels.lbl.sender_phone} {...field} />
            )}
          />
        </Col>
        <Col style={{ marginTop: 20 }}>
          <Controller
            name="document_barcode"
            control={control}
            render={({ field }) => (
              <MaterialInput label={labels.lbl.barcode} {...field} />
            )}
          />
        </Col>

        <Col style={{ marginTop: 20 }}>
          <Controller
            name="related_details"
            control={control}
            render={({ field }) => (
              <RelatedCorrSelect
                {...field}
                value={field.value || []}
                corrId={id || ""}
              />
            )}
          />
        </Col>
        <Col style={{ marginTop: 20 }}>
          <Controller
            name="cc_users"
            control={control}
            render={({ field }) => (
              <SelectUsers
                multiSelect
                label={labels.lbl.cc_user}
                value={field.value}
                onChange={field.onChange}
              />
            )}
          />
        </Col>
        <Col style={{ marginTop: 20 }}>
          <Controller
            name="cc_internal"
            control={control}
            render={({ field }) => (
              <SelectOU
                multiSelect
                label={labels.lbl.cc_internal}
                value={field.value}
                onChange={field.onChange}
              />
            )}
          />
        </Col>
        <Col style={{ marginTop: 20 }}>
          <Controller
            name="keywords"
            control={control}
            render={({ field }) => (
              <KeywordInput
                values={field.value}
                handleValuesChange={(values: string[]) =>
                  field.onChange(values)
                }
              />
            )}
          />
        </Col>
        <Col style={{ marginTop: 20 }}>
          <Controller
            name="remarks"
            control={control}
            render={({ field }) => (
              <MaterialInput label={labels.lbl.remarks} {...field} />
            )}
          />
        </Col>
        <Col style={{ marginTop: 20 }}>
          <Controller
            name="notify_me"
            control={control}
            render={({ field }) => (
              <Checkbox
                checked={field.value}
                onChange={(e) => field.onChange(e.target.checked)}
              >
                {labels.lbl.read_receipt}
              </Checkbox>
            )}
          />
        </Col>
      </Form>
    </>
  );
}
