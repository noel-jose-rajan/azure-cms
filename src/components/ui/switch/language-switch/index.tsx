import { Radio } from "antd";
import { LANGUAGE } from "../../../../constants/language";
import { useLanguage } from "../../../../context/language";
import { useTheme } from "../../../../context/theme";

export default function LanguageSwitch() {
  const { language, changeLanguage } = useLanguage();
  const { theme } = useTheme();

  const activeStyle = {
    borderColor: theme.colors.border,
    color: theme.colors.backgroundText,
    backgroundColor: theme.colors.primary,
  };

  const inActiveStyle = {
    borderColor: theme.colors.border,
    color: theme.colors.text,
    backgroundColor: theme.colors.background,
  };

  return (
    <div style={{ display: "flex", alignItems: "center", flexWrap: "nowrap" }}>
      {/* <span style={{ marginInlineEnd: 16 }}>
                {language === LANGUAGE.ARABIC_KW ? "Change language" : "تغيير اللغة"}:
            </span> */}
      <Radio.Group
        value={language}
        onChange={({ target: { value } }) => changeLanguage(value)}
        style={{ display: "flex" }}
      >
        <Radio.Button
          key="en"
          value={LANGUAGE.ENGLISH_INT}
          style={
            language === LANGUAGE.ENGLISH_INT ? activeStyle : inActiveStyle
          }
        >
          E
        </Radio.Button>
        <Radio.Button
          key="ar"
          value={LANGUAGE.ARABIC_KW}
          style={
            language !== LANGUAGE.ENGLISH_INT ? activeStyle : inActiveStyle
          }
        >
          ع
        </Radio.Button>
      </Radio.Group>
    </div>
  );
}
