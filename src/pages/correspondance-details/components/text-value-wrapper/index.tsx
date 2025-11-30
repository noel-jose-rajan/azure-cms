import { Col, Row } from "antd";
import { CSSProperties } from "react";

interface TextWithValueProps {
  primaryText: string;
  secondaryText?: string;
  primaryTextStyle?: CSSProperties;
  secondaryTextStyle?: CSSProperties;
}

export default function TextWithValue({
  primaryText,
  secondaryText,
  primaryTextStyle,
  secondaryTextStyle,
}: TextWithValueProps) {
  const marginLess: CSSProperties = {
    padding: 0,
    margin: 0,
  };
  const text1Style: CSSProperties = {
    fontWeight: "700",
    ...marginLess,
  };

  const text2Style: CSSProperties = {
    fontWeight: "500",
    ...marginLess,
  };

  const dividerText: CSSProperties = {
    ...marginLess,
    marginLeft: 4,
    marginRight: 4,
  };

  return (
    <Row gutter={10} style={{ padding: 10 }}>
      <Col>
        <p
          style={{
            ...text1Style,
            ...primaryTextStyle,
          }}
        >
          {primaryText}
        </p>
      </Col>
      <Col style={{ display: "flex", alignItems: "center", ...marginLess }}>
        <p style={dividerText}>{" : "}</p>
        <p
          style={{
            ...secondaryTextStyle,
            ...text2Style,
          }}
        >
          {secondaryText || "-"}
        </p>
      </Col>
    </Row>
  );
}
