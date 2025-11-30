import { Button, Col, Form, Row } from "antd";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ReloadOutlined, SearchOutlined } from "@ant-design/icons";
import { useEffect } from "react";
import {
  CreateExternalEntityType,
  createExternalEntitySchema,
} from "../../../../../pages/external-entity/service";
import { useLanguage } from "../../../../../context/language";
import { LANGUAGE } from "../../../../../constants/language";
import { englishLabels } from "../../../../../constants/app-constants/en";
import { arabicLabels } from "../../../../../constants/app-constants/ar";
import { MaterialInput } from "../../../material-input";
import { MaterialSelect } from "../../../dropdown/material-dropdown";
import { PickListItemType } from "../../../../services/picklist/type";

interface UserSearchFormProps {
  onSubmit: (item: CreateExternalEntityType) => void;
  searchValues?: CreateExternalEntityType;
  resetValues: () => void;
  entityClassification: PickListItemType[];
}

export default function EntitySearchForm({
  onSubmit,
  searchValues,
  resetValues,
  entityClassification,
}: UserSearchFormProps) {
  const { language } = useLanguage();
  const isEnglish = language === LANGUAGE.ENGLISH_INT;
  const labels = isEnglish ? englishLabels : arabicLabels;

  const { control, getValues, setValue, reset } =
    useForm<CreateExternalEntityType>({
      resolver: zodResolver(createExternalEntitySchema),
    });

  useEffect(() => {
    if (searchValues) {
      setValue("desc", searchValues.desc);
      setValue("phone", searchValues.phone);
      setValue("email", searchValues.email);
      setValue("fax", searchValues.fax);
      setValue("shortName", searchValues.shortName);
      setValue("classifyPickListCode", searchValues.classifyPickListCode);
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
              name="desc"
              control={control}
              render={({ field }) => (
                <MaterialInput label={labels.lbl.name} {...field} />
              )}
            />
          </Col>
          <Col span={8} style={{ marginTop: 20 }}>
            <Controller
              name="shortName"
              control={control}
              render={({ field }) => (
                <MaterialInput label={labels.lbl.short_number} {...field} />
              )}
            />
          </Col>
          <Col span={8} style={{ marginTop: 20 }}>
            <Controller
              name="classifyPickListCode"
              control={control}
              render={({ field }) => (
                <MaterialSelect
                  {...field}
                  label={labels.lbl.classification}
                  options={entityClassification.map(
                    (classification: PickListItemType) => {
                      return {
                        label: isEnglish
                          ? classification.picklistEnLabel
                          : classification.picklistArLabel,
                        value: classification.picklistCode,
                      };
                    }
                  )}
                />
              )}
            />
          </Col>
          <Col span={8} style={{ marginTop: 20 }}>
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
