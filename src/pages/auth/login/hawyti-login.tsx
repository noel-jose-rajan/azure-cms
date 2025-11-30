import useCustomMessage from "@/components/hooks/use-message";
import ButtonComponent from "@/components/ui/button";
import { MaterialInput } from "@/components/ui/material-input";
import { useLanguage } from "@/context/language";
import { UserOutlined, LoginOutlined } from "@ant-design/icons";
import { Col, Form } from "antd";
import React, { ChangeEvent, CSSProperties, useEffect, useState } from "react";

const HawytiLogin = () => {
  const { showMessage } = useCustomMessage();
  const { labels, isEnglish } = useLanguage();
  const [loading, setLoading] = useState<boolean>(false);
  const [val, setVal] = useState("");
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

  useEffect(() => {
    if (!loading) return;
    showMessage("info", "يرجي فتح برنامج هويتي وعمل مصادقة");
  }, [loading]);

  return (
    <Form name="hawyti-login" layout="vertical" style={{ width: "100%" }}>
      <Col style={styles.inputSeparator}>
        <UserOutlined style={styles.icons} />
        <Col style={{ flex: 1 }}>
          <MaterialInput
            value={val}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setVal(e.target.value)
            }
            label={labels.lbl.civil_id}
            style={{ marginTop: 20 }}
            enableTranscript={false}
          />
        </Col>
      </Col>

      <Form.Item>
        <ButtonComponent
          type="primary"
          htmlType="submit"
          style={{ width: "100%", marginTop: 40, height: 40 }}
          spinning={loading}
          buttonLabel={labels.btn.login_with_hawyti}
          icon={<LoginOutlined />}
          onClick={() => {
            setLoading(!loading);
          }}
        />
      </Form.Item>
    </Form>
  );
};

export default HawytiLogin;
