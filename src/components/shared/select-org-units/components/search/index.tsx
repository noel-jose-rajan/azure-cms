import { Col, Form, Row } from "antd";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLanguage } from "../../../../../context/language";
import {
  orgUnitSearchSchema,
  OUSearchModelType,
} from "../../../../services/organization-units/type";
import { MaterialInput } from "../../../../ui/material-input";
import { useEffect } from "react";

interface OrgUnitSearchFormProps {
  onSubmit: (item: OUSearchModelType) => void;

  // onResetSearch: () => void;
}

export default function OrgUnitSearchForm({
  onSubmit,
}: // onResetSearch,
OrgUnitSearchFormProps) {
  const { labels } = useLanguage();

  const { control, getValues, watch } = useForm<OUSearchModelType>({
    resolver: zodResolver(orgUnitSearchSchema),
  });
  const { entity_desc_en, entity_code, entity_email } = watch();
  // const onSubmitForm = () => {
  //   onSubmit(getValues());
  // };

  // const resetCurrentValues = async () => {
  //   reset();
  //   onResetSearch();
  // };

  useEffect(() => {
    onSubmit(getValues());
  }, [entity_desc_en, entity_code, entity_email]);
  return (
    <Col>
      <Form name="search-user" layout="vertical">
        <Row gutter={10}>
          <Col span={8} style={{ marginTop: 20 }}>
            <Controller
              name="entity_desc_en"
              control={control}
              render={({ field }) => (
                <MaterialInput label={labels.lbl.org_unit} {...field} />
              )}
            />
          </Col>
          <Col span={8} style={{ marginTop: 20 }}>
            <Controller
              name="entity_code"
              control={control}
              render={({ field }) => (
                <MaterialInput label={labels.lbl.org_unit_code} {...field} />
              )}
            />
          </Col>
          <Col span={8} style={{ marginTop: 20 }}>
            <Controller
              name="entity_email"
              control={control}
              render={({ field }) => (
                <MaterialInput label={labels.lbl.org_unit_email} {...field} />
              )}
            />
          </Col>
        </Row>
      </Form>
      {/* <Col
        style={{
          display: "flex",
          justifyContent: isEnglish ? "flex-end" : "flex-start",
          marginTop: 20,
        }}
      >
        <Button
          type="default"
          style={{ marginLeft: 10, marginRight: 10 }}
          onClick={resetCurrentValues}
        >
          <ReloadOutlined />
          {labels.btn.reset}
        </Button>
        <Button type="primary" onClick={onSubmitForm}>
          <SearchOutlined />
          {labels.btn.search}
        </Button>
      </Col> */}
    </Col>
  );
}
