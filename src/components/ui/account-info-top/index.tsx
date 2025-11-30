import {
  CheckOutlined,
  LogoutOutlined,
  RetweetOutlined,
  SettingFilled,
  SettingOutlined,
  UserOutlined,
  UserSwitchOutlined,
} from "@ant-design/icons";
import { Avatar, Button, Dropdown, MenuProps } from "antd";
import { CSSProperties, useEffect, useState } from "react";
import { useLanguage } from "../../../context/language";
import { useNavigate } from "react-router-dom";
import Storage from "../../../lib/storage";
import LOCALSTORAGE from "../../../constants/local-storage";
import { useAuth } from "../../../context/auth";
import { useTheme } from "../../../context/theme";
import { useAllowedViews } from "@/context/allowed-views";
import { views_const } from "@/constants/app-constants/views";

export default function AccountOptions() {
  const { canAccess } = useAllowedViews();
  const { labels, changeLanguage, isEnglish } = useLanguage();
  const navigate = useNavigate();
  const {
    theme: { colors },
  } = useTheme();
  const { user, logout } = useAuth();
  const [username, setUsername] = useState<string>(user?.uid ?? "");

  useEffect(() => {
    const getNotificationCount = setInterval(() => {
      init();
    }, 120000);

    init();

    return () => clearInterval(getNotificationCount);
  }, []);

  const init = async () => {
    const response = await Storage.getItem<any>(LOCALSTORAGE.USER);

    if (response) {
      setUsername(response.uid);
    }
  };

  const styles: { [x: string]: CSSProperties } = {
    englishText: {
      color: isEnglish ? "#fff" : colors.primary,
      fontWeight: isEnglish ? "600" : "500",
    },
    arabicText: {
      color: !isEnglish ? "#fff" : colors.primary,
      fontWeight: !isEnglish ? "600" : "500",
    },
    whiteText: {
      color: "#fff",
    },
  };

  const items: MenuProps["items"] = [
    {
      key: "1",
      label: <a>{labels.til.user_preferences}</a>,
      icon: <SettingFilled />,
      onClick: () => navigate("/user/my-preferences"),
    },
    {
      key: "2",
      label: <a>{labels.pk.language}</a>,
      icon: <RetweetOutlined />,
      children: [
        {
          key: "2-1",
          label: <a style={styles.englishText}>{labels.global_language_en}</a>,
          icon: (
            <CheckOutlined
              style={{ ...styles.whiteText, opacity: isEnglish ? 1 : 0 }}
            />
          ),
          onClick: () => changeLanguage("en-INT"),
          style: {
            backgroundColor: isEnglish ? colors.primary : "inherit",
          },
        },
        {
          key: "2-2",
          label: <a style={styles.arabicText}>{labels.global_language_ar}</a>,
          icon: (
            <CheckOutlined
              style={{ ...styles.whiteText, opacity: !isEnglish ? 1 : 0 }}
            />
          ),
          onClick: () => changeLanguage("ar-KW"),
          style: {
            backgroundColor: !isEnglish ? colors.primary : "inherit",
          },
        },
      ],
    },
    ...(canAccess(views_const.user_delegation)
      ? [
          {
            key: "delegation",
            label: <a>{labels.mnu.delegation}</a>,
            icon: <UserSwitchOutlined />,
            onClick: () => navigate("/user/delegation"),
          },
        ]
      : []),

    {
      key: "4",
      label: <a>{isEnglish ? "Theme Editor" : "محرر السمات"}</a>,
      icon: <SettingOutlined />,
      onClick: () => navigate("/user/theme-editor"),
    },
    {
      key: "3",
      label: <a>{labels.btn.logout}</a>,
      icon: <LogoutOutlined />,
      onClick: () => {
        logout(navigate);
      },
    },
  ];

  return (
    <>
      <Dropdown menu={{ items }}>
        <Button type="text">
          <Avatar icon={<UserOutlined />} />
          <p style={{ color: colors.primary }}>{username}</p>
        </Button>
      </Dropdown>
    </>
  );
}
