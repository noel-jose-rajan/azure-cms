import { LockFilled } from "@ant-design/icons";
import { Col, Typography } from "antd";
import { CSSProperties } from "react";
import { useLanguage } from "../../../context/language";

interface NotAccessibleProps {
  style?: CSSProperties;
}

export default function NotAccessible({ style }: NotAccessibleProps) {
  const { labels } = useLanguage();

  return (
    <Col
      span={24}
      style={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#0000001a",
        ...style,
      }}
    >
      <Typography style={{ marginBottom: 20, textAlign: "center" }}>
        {labels.msg.upload_first}
      </Typography>
      <LockFilled style={{ fontSize: 25 }} />
    </Col>
  );
}
