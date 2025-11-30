import { UnorderedListOutlined } from "@ant-design/icons";
import { useLanguage } from "../../../../context/language";
import { LANGUAGE } from "../../../../constants/language";
import { englishLabels } from "../../../../constants/app-constants/en";
import { arabicLabels } from "../../../../constants/app-constants/ar";
import Text from "../../../../components/ui/text/text";
import { useTheme } from "../../../../context/theme";

export default function EmptyPickListItems() {
  const { theme } = useTheme();
  const { language } = useLanguage();

  const labels =
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
          en={labels.msg.select_picklist_type}
          ar={labels.msg.select_picklist_type}
        />
      </div>
    </div>
  );
}
