import { Col, Row, Tag } from "antd";
import { CSSProperties } from "react";
import { useTheme } from "../../../../context/theme";

interface TextWithValueProps {
  primaryText: string;
  secondaryText?: string[];
  primaryTextStyle?: CSSProperties;
  secondaryTextStyle?: CSSProperties;
}

export default function TextWithTag({
  primaryText,
  secondaryText = [],
  primaryTextStyle,
}: TextWithValueProps) {
  const { theme } = useTheme();
  const marginLess: CSSProperties = {
    padding: 0,
    margin: 0,
  };
  const text1Style: CSSProperties = {
    fontWeight: "700",
    ...marginLess,
  };

  const dividerText: CSSProperties = {
    ...marginLess,
    marginLeft: 4,
    marginRight: 4,
  };

  return (
    <Row gutter={10} style={{ padding: 10 }}>
      <Col span={10}>
        <p
          style={{
            ...text1Style,
            ...primaryTextStyle,
          }}
        >
          {primaryText}
        </p>
      </Col>
      <Col
        span={14}
        style={{ display: "flex", alignItems: "center", ...marginLess }}
      >
        <p style={dividerText}>{" : "}</p>
        {secondaryText.map((text) => {
          return <Tag color={theme.colors.accent}>{text}</Tag>;
        })}
      </Col>
    </Row>
  );
}
