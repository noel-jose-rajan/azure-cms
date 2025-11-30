import { Form, Input, Col, Divider } from "antd";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import { loginSchema, LoginType, useAuth } from "../../../context/auth";
import { MaterialInput } from "../../../components/ui/material-input";
import MaterialStyleInput from "../../../components/ui/material-style-input";
import { useLanguage } from "../../../context/language";
import { LockOutlined, LoginOutlined, UserOutlined } from "@ant-design/icons";
import { CSSProperties, useState } from "react";
import ButtonComponent from "../../../components/ui/button";
import { useNavigate } from "react-router-dom";

export default function LoginForm() {
  const auth = useAuth();
  const { labels, isEnglish } = useLanguage();
  const [loading, setLoading] = useState<boolean>(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginType>({
    resolver: zodResolver(loginSchema),
  });

  const navigate = useNavigate();
  const onFinish = async (values: LoginType) => {
    setLoading(true);
    await auth.login(values, navigate);
    setLoading(false);
  };

  const onFinishFailed = () => {};

  const styles: { [x: string]: CSSProperties } = {
    icons: {
      fontSize: 20,
      marginRight: isEnglish ? 10 : 0,
      marginLeft: isEnglish ? 0 : 10,
      marginTop: 35,
    },
    inputSeparator: {
      marginTop: 20,
      display: "flex",
      alignItems: "flex-start",
    },
  };

  return (
    <Form
      name="login"
      onFinish={handleSubmit(onFinish)}
      onFinishFailed={onFinishFailed}
      // autoComplete="off"
      layout="vertical"
      style={{ width: "100%" }}
    >
      <Col style={styles.inputSeparator}>
        <UserOutlined style={styles.icons} />
        <Col style={{ flex: 1 }}>
          <Controller
            name="username"
            control={control}
            render={({ field }) => (
              <MaterialInput
                label={labels.lbl.user_name}
                {...field}
                style={{ marginTop: 20 }}
                error={errors.username?.message}
                enableTranscript={false}
              />
            )}
          />
        </Col>
      </Col>
      <Col style={styles.inputSeparator}>
        <LockOutlined style={styles.icons} />
        <Col style={{ marginTop: 15, flex: 1 }}>
          <Controller
            name="password"
            control={control}
            render={({ field }) => (
              <MaterialStyleInput
                InputComponent={Input.Password}
                label={labels.lbl.user_pass}
                style={{ marginTop: 30 }}
                {...field}
                error={errors.password?.message}
              />
            )}
          />
        </Col>
      </Col>
      <Form.Item>
        <ButtonComponent
          type="primary"
          htmlType="submit"
          style={{ width: "100%", marginTop: 40, height: 40 }}
          spinning={loading}
          buttonLabel={labels.btn.login}
          icon={<LoginOutlined />}
        />
      </Form.Item>
    </Form>
  );
}
