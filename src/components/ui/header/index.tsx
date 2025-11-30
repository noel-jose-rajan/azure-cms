import { Col, Row } from "antd";
import { useLanguage } from "../../../context/language";
import { useTheme } from "../../../context/theme";
import Text from "../text/text";
import { CSSProperties, ReactNode } from "react";

interface HeaderProps {
  heading: string;
  style?: CSSProperties;
  icon?: ReactNode;
  applyReverse?: boolean;
}

export default function TitleHeader({
  heading,
  style,
  icon,
  applyReverse = true,
}: HeaderProps) {
  const { theme } = useTheme();
  const { isEnglish } = useLanguage();
  const reverseStyle: CSSProperties = applyReverse
    ? { flexDirection: isEnglish ? "row" : "row-reverse" }
    : { flexDirection: "row" };
  return (
    <Row
      style={{
        width: "100%",
        display: "flex",
        marginTop: 20,
        alignItems: "center",
        justifyContent: "start",
        padding: 0,
        ...style,
      }}
    >
      <Col
        style={{
          backgroundColor: theme.colors.primary,
          display: "flex",
          flex: 1,
          height: 50,
          alignItems: "center",
          borderRadius: 5,
          paddingLeft: 10,
          paddingRight: 10,
          ...reverseStyle,
        }}
      >
        {icon && (
          <span
            style={{
              display: "flex",
              alignItems: "center",
              color: "#fff",
            }}
          >
            {icon}
          </span>
        )}
        <Text
          ar={heading}
          en={heading}
          style={{
            color: "#fff",
            fontSize: 18,
            marginLeft: 10,
            marginRight: 10,
          }}
        />
      </Col>
    </Row>
  );
}
