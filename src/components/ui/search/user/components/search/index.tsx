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
import OrgUnitSearchOption from "../../../ou-search-actions";
import { UserSearchType, userSearchSchema } from "../../../../../services/user-preference/type";

interface UserSearchFormProps {
  onSubmit: (item: UserSearchType) => void;
  searchValues?: UserSearchType;
  resetValues: () => void;
}

export default function UserSearchForm({
  onSubmit,
  searchValues,
  resetValues,
}: UserSearchFormProps) {
  const { language } = useLanguage();
  const isEnglish = language === LANGUAGE.ENGLISH_INT;
  const labels = isEnglish ? englishLabels : arabicLabels;

  const { control, getValues, setValue, reset } = useForm<UserSearchType>({
    resolver: zodResolver(userSearchSchema),
  });

  useEffect(() => {
    if (searchValues) {
      setValue("orgUnit", searchValues.orgUnit);
      setValue("userLoginName", searchValues.userLoginName);
      setValue("userName", searchValues.userName);
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
              name="userName"
              control={control}
              render={({ field }) => (
                <MaterialInput
                  label={labels.lbl.user_name}
                  {...field}
                  style={{ height: 60 }}
                />
              )}
            />
          </Col>
          <Col span={8} style={{ marginTop: 20 }}>
            <Controller
              name="userLoginName"
              control={control}
              render={({ field }) => (
                <MaterialInput
                  label={labels.lbl.user_login_name}
                  {...field}
                  style={{ height: 60 }}
                />
              )}
            />
          </Col>
          <Col span={8} style={{ marginTop: 20 }}>
            <Controller
              name="orgUnit"
              control={control}
              render={({ field }) => (
                <OrgUnitSearchOption
                  label={labels.lbl.org_unit}
                  enableSearch
                  value={field.value ? [field.value.toString()] : []}
                  onChange={(values: string[]) => {
                    if (values.length > 0) {
                      field.onChange(values[0]);
                    } else {
                      field.onChange([]);
                    }
                  }}
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
