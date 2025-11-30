import { useLanguage } from "@/context/language";
import { Col, Row } from "antd";
import { CSSProperties } from "react";

interface TextWithValueProps {
  primaryText: string;
  secondaryText?: string;
  primaryTextStyle?: CSSProperties;
  secondaryTextStyle?: CSSProperties;
  applyReverse?: boolean;
}

export default function TextWithValue({
  primaryText,
  secondaryText,
  primaryTextStyle,
  secondaryTextStyle,
  applyReverse = false,
}: TextWithValueProps) {
  const { isEnglish } = useLanguage();
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

  const reverseStyles: CSSProperties = {
    flexDirection: isEnglish ? "row" : "row-reverse",
    justifyContent: isEnglish ? "start" : "end",
    display: "flex",
  };
  return (
    <Row
      gutter={10}
      style={{ padding: 10, ...(applyReverse ? reverseStyles : {}) }}
    >
      <Col>
        <p
          style={{
            ...text1Style,
            ...primaryTextStyle,
            ...(applyReverse ? reverseStyles : {}),
          }}
        >
          {primaryText}
          <span style={dividerText}>{" : "}</span>
        </p>
      </Col>
      <Col style={{ display: "flex", alignItems: "center", ...marginLess }}>
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
