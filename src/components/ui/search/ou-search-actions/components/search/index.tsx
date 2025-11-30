import { Button, Col, Form, Row } from "antd";
import { Controller, useForm } from "react-hook-form";
import { MaterialInput } from "../../../../material-input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLanguage } from "../../../../../../context/language";
import { LANGUAGE } from "../../../../../../constants/language";
import { englishLabels } from "../../../../../../constants/app-constants/en";
import { arabicLabels } from "../../../../../../constants/app-constants/ar";
import { ReloadOutlined, SearchOutlined } from "@ant-design/icons";
import { useEffect } from "react";
import {
  OUSearchModelType,
  orgUnitSearchSchema,
} from "../../../../../services/organization-units/type";

interface OrgUnitSearchFormProps {
  onSubmit: (item: OUSearchModelType) => void;
  searchValues?: OUSearchModelType;
  resetValues: () => void;
}

export default function OrgUnitSearchForm({
  onSubmit,
  searchValues,
  resetValues,
}: OrgUnitSearchFormProps) {
  const { language } = useLanguage();
  const isEnglish = language === LANGUAGE.ENGLISH_INT;
  const labels = isEnglish ? englishLabels : arabicLabels;

  const { control, getValues, setValue, reset } = useForm<OUSearchModelType>({
    resolver: zodResolver(orgUnitSearchSchema),
  });

  useEffect(() => {
    if (searchValues) {
      setValue("entity_code", searchValues.entity_code);
      setValue("entity_desc_en", searchValues.entity_desc_en);
      setValue("entity_email", searchValues.entity_email);
    }
  }, [searchValues]);

  const onSubmitForm = () => {
    onSubmit(getValues());
  };

  const resetCurrentValues = async () => {
    reset();
    resetValues();
  };

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
      <Col
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
      </Col>
    </Col>
  );
}
