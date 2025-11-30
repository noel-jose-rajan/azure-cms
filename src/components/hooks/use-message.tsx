import { useLanguage } from "@/context/language";
import { useTheme } from "@/context/theme";
import { message, Typography } from "antd";
import { NoticeType } from "antd/es/message/interface";

const useCustomMessage = () => {
  const { theme } = useTheme();
  const { isEnglish } = useLanguage();
  // message.config({
  //   duration: 2,
  //   maxCount: 3,
  //   rtl: true,

  // });
  const showMessage = (type: NoticeType, text = "") => {
    message.open({
      type,
      style: {
        direction: isEnglish ? "ltr" : "rtl",
        backgroundColor: theme.colors.background,
        width: "fit-content",
        marginInline: "auto",
        borderRadius: "8px",
      },
      content: (
        <Typography style={{ color: theme.colors.text }}>{text}</Typography>
      ),
    });
  };

  return { showMessage };
};

export default useCustomMessage;
