import { useLanguage } from "../../../../../../context/language";
import KeywordInput from "../../../../../../components/ui/form/KeyWordInput";
import { Card, Col } from "antd";
import TitleHeader from "../../../../../../components/ui/header";
import { TableOutlined } from "@ant-design/icons";
import { CreateCorrespondenceType } from "../../../../../../components/services/outbound/types";
import { MaterialInput } from "../../../../../../components/ui/material-input";
import { Controller, useFormContext } from "react-hook-form";
import Picklist from "@/components/shared/picklist";
import SelectExternalEntity from "@/components/shared/select-external-entity";
import SelectOU from "@/components/shared/select-org-units";
import SelectUsers from "@/components/shared/select-users";
import ReceivingEntitySelect from "../receiving-entity-select";
import RelatedCorrSelect from "@/components/shared/related-corr-select";
import { useParams } from "react-router-dom";
import { CONST_DATA } from "@/constants/app";

export default function FormComponents() {
  const {
    formState: { errors },
    watch,
    control,
    setValue,
  } = useFormContext<CreateCorrespondenceType>();
  const { labels } = useLanguage();
  const { id } = useParams<{ id: string }>();
  const { sending_entity_id, outbound_type_id } = watch();
  const isInternal = outbound_type_id == CONST_DATA.Internal_outbound_Id;
  return (
    <Card>
      <TitleHeader
        applyReverse={false}
        heading={labels.til.outbound_form}
        icon={<TableOutlined style={{ color: "#fff" }} />}
      />

      <Col span={24} style={{ marginTop: 20 }}>
        <Controller
          name="corr_subject"
          control={control}
          render={({ field }) => (
            <MaterialInput label={labels.lbl.subject} {...field} />
          )}
        />
      </Col>

      <Col span={24} style={{ marginTop: 20 }}>
        <Controller
          name="outbound_type_id"
          disabled
          control={control}
          render={({ field }) => (
            <Picklist
              label={labels.lbl.outbound_type}
              {...field}
              code="outbound types"
              // onChange={(val) => {
              //   field.onChange(val);

              //   if (val == CONST_DATA.Internal_outbound_Id) {
              //     setValue("cc_external", []);
              //   }
              // }}
            />
          )}
        />
      </Col>
      <Col span={24} style={{ marginTop: 20 }}>
        <Controller
          name="receiving_entities_id"
          disabled
          control={control}
          render={({ field }) => (
            <ReceivingEntitySelect
              {...field}
              multiSelect
              sending_entity={sending_entity_id}
              outbound_type={outbound_type_id || ""}
            />
          )}
        />
      </Col>

      <Col span={24} style={{ marginTop: 20 }}>
        <Controller
          name="security_level_id"
          control={control}
          render={({ field }) => (
            <Picklist
              {...field}
              code="Security Level"
              label={labels.lbl.security_level}
            />
          )}
        />
      </Col>

      <Col span={24} style={{ marginTop: 20 }}>
        <Controller
          name="urgency_id"
          control={control}
          render={({ field }) => (
            <Picklist
              {...field}
              code="Urgency Level"
              label={labels.lbl.urgency_level}
            />
          )}
        />
      </Col>

      <Col span={24} style={{ marginTop: 20 }}>
        <Controller
          name="doc_type_id"
          control={control}
          render={({ field }) => (
            <Picklist
              {...field}
              code="Document Type"
              label={labels.lbl.document_type}
            />
          )}
        />
      </Col>
      <Col span={24} style={{ marginTop: 20 }}>
        <Controller
          name="corr_language_id"
          control={control}
          render={({ field }) => (
            <Picklist {...field} code="Language" label={labels.lbl.language} />
          )}
        />
      </Col>
      <Col span={24} style={{ marginTop: 20 }}>
        <Controller
          name="stamp_type_id"
          control={control}
          render={({ field }) => (
            <Picklist
              {...field}
              code="Stamp Options"
              label={labels.lbl.stamp_type}
            />
          )}
        />
      </Col>
      <Col span={24} style={{ marginTop: 20 }}>
        <Controller
          name="external_reference_no"
          control={control}
          render={({ field }) => (
            <MaterialInput label={labels.lbl.ext_ref_num} {...field} />
          )}
        />
      </Col>
      {!isInternal && (
        <Col span={24} style={{ marginTop: 20 }}>
          <Controller
            name="cc_external"
            control={control}
            render={({ field }) => (
              <SelectExternalEntity
                {...field}
                multiSelect
                value={field.value || []}
                label={labels.lbl.cc_external}
              />
            )}
          />
        </Col>
      )}
      <Col span={24} style={{ marginTop: 20 }}>
        <Controller
          name="cc_internal"
          control={control}
          render={({ field }) => (
            <SelectOU
              {...field}
              multiSelect
              label={labels.lbl.cc_internal}
              value={field.value || []}
            />
          )}
        />
      </Col>
      <Col span={24} style={{ marginTop: 20 }}>
        <Controller
          name="cc_users"
          control={control}
          render={({ field }) => (
            <SelectUsers
              {...field}
              multiSelect
              label={labels.lbl.cc_user}
              value={field.value || []}
            />
          )}
        />
      </Col>
      <Col span={24} style={{ marginTop: 20 }}>
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
      <Col span={24} style={{ marginTop: 20 }}>
        <Controller
          name="keywords"
          control={control}
          render={({ field }) => (
            <KeywordInput
              values={field.value ?? []}
              handleValuesChange={(keywords) => {
                field.onChange(keywords);
              }}
            />
          )}
        />
      </Col>
      <Col span={24} style={{ marginTop: 20 }}>
        <Controller
          name="remarks"
          control={control}
          render={({ field }) => (
            <MaterialInput
              label={labels.lbl.remarks}
              {...field}
              error={errors.remarks?.message}
            />
          )}
        />
      </Col>
    </Card>
  );
}
