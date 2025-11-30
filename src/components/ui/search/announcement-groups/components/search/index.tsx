import { Button, Col, Form, Row } from "antd";
import { Controller, useForm, UseFormReturn } from "react-hook-form";
import { MaterialInput } from "../../../../material-input";
import { useLanguage } from "../../../../../../context/language";
import { LANGUAGE } from "../../../../../../constants/language";
import { englishLabels } from "../../../../../../constants/app-constants/en";
import { arabicLabels } from "../../../../../../constants/app-constants/ar";
import { ReloadOutlined, SearchOutlined } from "@ant-design/icons";
import { SearchGroupsType } from "../../../../../services/announcement-groups/type";

interface UserSearchFormProps {
  onSubmit: (item: SearchGroupsType) => void;
  resetValues: () => void;
  form: UseFormReturn<SearchGroupsType, any, undefined>;
}

export default function GroupSearchForm({
  onSubmit,
  resetValues,
  form,
}: UserSearchFormProps) {
  const { language } = useLanguage();
  const isEnglish = language === LANGUAGE.ENGLISH_INT;
  const labels = isEnglish ? englishLabels : arabicLabels;

  const { control, reset, getValues } = form;

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
              name="name_en"
              control={control}
              render={({ field }) => (
                <MaterialInput
                  label={labels.lbl.announce_grp_name}
                  {...field}
                />
              )}
            />
          </Col>
          <Col span={8} style={{ marginTop: 20 }}>
            <Controller
              name="entity_code"
              control={control}
              render={({ field }) => (
                <MaterialInput
                  label={labels.lbl.announce_grp_code}
                  {...field}
                />
              )}
            />
          </Col>
          <Col span={8} style={{ marginTop: 20 }}>
            <Controller
              name="email"
              control={control}
              render={({ field }) => (
                <MaterialInput
                  label={labels.lbl.announce_grp_email}
                  {...field}
                />
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
