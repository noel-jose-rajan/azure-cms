import { Col, Row, Tag, Typography } from "antd";
import { CSSProperties } from "react";
import { useTheme } from "../../../context/theme";
import { useLanguage } from "@/context/language";

interface TextWithValueProps {
  primaryText: string;
  secondaryText?: string[];
  primaryTextStyle?: CSSProperties;
  secondaryTextStyle?: CSSProperties;
  applyReverse?: boolean;
}

export default function TextWithTag({
  primaryText,
  secondaryText = [],
  primaryTextStyle,
  applyReverse = false,
}: TextWithValueProps) {
  const { isEnglish } = useLanguage();
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
        {secondaryText.length === 0 ? (
          <Typography>-</Typography>
        ) : (
          <>
            {secondaryText?.map((text, index) => {
              return <Tag key={index} color={theme.colors.accent}>{text}</Tag>;
            })}
          </>
        )}
      </Col>
    </Row>
  );
}
