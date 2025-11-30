import { Col, Form, Row } from "antd";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import {
  ExternalEntity,
  createExternalEntitySchema,
} from "@/pages/external-entity/service";
import Picklist from "@/components/shared/picklist";
import { useLanguage } from "@/context/language";
import { MaterialInput } from "@/components/ui/material-input";

interface UserSearchFormProps {
  onSearch: (item: ExternalEntity) => void;
  // resetValues: () => void;
}

export default function EntitySearchForm({
  onSearch,
}: // resetValues,

UserSearchFormProps) {
  const { labels } = useLanguage();

  const { control, getValues, watch } = useForm<ExternalEntity>({
    resolver: zodResolver(createExternalEntitySchema),
  });

  const {
    classify_id = -1,
    abbr = "",
    name = "",
    // g2g_code = "",
    phone = "",
    fax = "",
    email = "",
    entity_code,
  } = watch();

  useEffect(() => {
    onSearch(getValues());
  }, [classify_id, abbr, name, phone, fax, email, entity_code]);

  // const resetCurrentValues = async () => {
  //   reset();
  //   resetValues();
  // };

  return (
    <Col>
      <Form name="search-user" layout="vertical">
        <Row gutter={10}>
          <Col span={8} style={{ marginTop: 20 }}>
            <Controller
              name="name"
              control={control}
              render={({ field }) => (
                <MaterialInput label={labels.lbl.name} {...field} />
              )}
            />
          </Col>
          <Col span={8} style={{ marginTop: 20 }}>
            <Controller
              name="entity_code"
              control={control}
              render={({ field }) => (
                <MaterialInput label={labels.lbl.short_number} {...field} />
              )}
            />
          </Col>
          <Col span={8} style={{ marginTop: 20 }}>
            <Controller
              name="classify_id"
              control={control}
              render={({ field }) => (
                <Picklist
                  {...field}
                  label={labels.lbl.classification}
                  code="External Entity Classification"
                  isRequired={false}
                  onChange={(value) => {
                    field.onChange(value);
                  }}
                  value={field.value}
                />
              )}
            />
          </Col>
          {/* <Col span={8} style={{ marginTop: 20 }}>
            <Controller
              name="phone"
              control={control}
              render={({ field }) => (
                <MaterialInput label={labels.lbl.phone} {...field} />
              )}
            />
          </Col>
          <Col span={8} style={{ marginTop: 20 }}>
            <Controller
              name="fax"
              control={control}
              render={({ field }) => (
                <MaterialInput label={labels.lbl.fax_number} {...field} />
              )}
            />
          </Col>
          <Col span={8} style={{ marginTop: 20 }}>
            <Controller
              name="email"
              control={control}
              render={({ field }) => (
                <MaterialInput label={labels.lbl.email} {...field} />
              )}
            />
          </Col> */}
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
