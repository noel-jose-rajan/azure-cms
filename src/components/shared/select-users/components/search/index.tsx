import { Col, Form, Row } from "antd";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLanguage } from "../../../../../context/language";
import { MaterialInput } from "../../../../ui/material-input";
import { userSearchSchema, UserSearchType } from "../../schema";
import { useEffect } from "react";

interface UserSearchFormProps {
  onSubmit: (item: UserSearchType) => void;
  // onResetSearch: () => void;
}

export default function UserSearchForm({
  onSubmit,
}: // onResetSearch,
UserSearchFormProps) {
  const { labels } = useLanguage();
  const { control, getValues, watch } = useForm<UserSearchType>({
    resolver: zodResolver(userSearchSchema),
  });
  const { userLoginName, userName } = watch();
  useEffect(() => {
    onSubmit(getValues());
  }, [userLoginName, userName]);

  return (
    <Col>
      <Form name="search-user" layout="vertical">
        <Row gutter={10}>
          <Col span={12} style={{ marginTop: 20 }}>
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
          <Col span={12} style={{ marginTop: 20 }}>
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
          onClick={handleReset}
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
