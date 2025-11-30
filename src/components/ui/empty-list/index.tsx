import { UnorderedListOutlined } from "@ant-design/icons";
import { useTheme } from "../../../context/theme";
import Text from "../text/text";
import { useLanguage } from "../../../context/language";
import { LANGUAGE } from "../../../constants/language";
import { englishLabels } from "../../../constants/app-constants/en";
import { arabicLabels } from "../../../constants/app-constants/ar";

interface EmptyListItemsProps {
  text?: string;
}

export default function EmptyListItems({ text }: EmptyListItemsProps) {
  const { theme } = useTheme();
  const { language } = useLanguage();
  const label =
    language === LANGUAGE.ENGLISH_INT ? englishLabels : arabicLabels;

  return (
    <div style={{ padding: 15 }}>
      <div
        style={{
          height: 200,
          width: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          backgroundColor: theme.colors.background,
          borderRadius: "8px",
        }}
      >
        <UnorderedListOutlined
          size={50}
          style={{ fontSize: 40, marginBottom: 10 }}
        />
        <Text
          style={{ fontSize: 32 }}
          en={text ?? label.msg.no_data}
          ar={text ?? label.msg.no_data}
        />
      </div>
    </div>
  );
}
