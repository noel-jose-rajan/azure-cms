import React from "react";
import { Breadcrumb } from "antd";
import { Link, useLocation } from "react-router-dom";
import { useTheme } from "../../../../context/theme";
import { useLanguage } from "../../../../context/language";
import { LANGUAGE } from "../../../../constants/language";

interface TitleBarProps {
  title?: {
    en: string;
    ar: string;
  };

  headerText?: string;
}

const arabicTranslations: any = {
  home: "الرئيسية",
  dashboard: "لوحة التحكم",
  users: "المستخدمين",
  settings: "الإعدادات",
  profile: "الملف الشخصي",
  reports: "التقارير",
  barcode: "باركود",
  inbox: "صندوق المهام",
  inbound: "وارد",
  outbound: "صادر",
  create: "إنشاء",
  edit: "تعديل",
  calendar: "التقويم",
  stamps: "الأختام",
  search: "بحث",
  delegation: "التفويض",
  "organization-units": "الوحدات التنظيمية",
  "application-parameters": "معايير التطبيق",
  "external-entity": "الجهات الخارجية",
  "users-preferences": "اعدادات المستخدمين",
  "urgency-notifications": "الاشعارات العاجلة",
  "outbound-template": "قوالب الصادر",
  "application-privileges": "صلاحيات التطبيق",
  "announcements-groups": "مجموعات التعاميم",
  sla: "اتفاقية مستوى الخدمة",
  "translation-manager": "إدارة الترجمة",
};
const TitleBar: React.FC<TitleBarProps> = ({ title, headerText }) => {
  const location = useLocation();
  const { theme } = useTheme();
  const { language, isEnglish } = useLanguage();
  const first_part = location.pathname.split("/")[1];
  // Dynamically generate breadcrumb items
  let breadcrumbItems = location.pathname
    .split("/")
    .slice(2) // Split path and remove leading empty string
    .filter((path) => path) // Remove empty strings
    .map((path, index, array) => {
      const url = `/${array.slice(0, index + 1).join("/")}`;
      const translated = arabicTranslations[path.toLowerCase()] || path;
      return {
        href: url,
        title: isEnglish ? path?.replace(/-/g, " ") : translated,
      };
    });
  breadcrumbItems = [
    { href: "/home", title: isEnglish ? "Home" : "الرئيسية" },

    ...breadcrumbItems,
  ];
  // Determine text direction based on language
  const isRTL = language !== LANGUAGE.ENGLISH_INT;

  return (
    <div
      style={{
        width: "100%",
        display: "flex",
        justifyContent: isRTL ? "flex-end" : "space-between",
        alignItems: "center",
        backgroundColor: theme.colors.background,
        borderBottom: `1px solid ${theme.colors.border}`,
      }}
    >
      <div
        style={{
          padding: "1rem",
        }}
      >
        <h1
          style={{
            margin: 0,
            color: theme.colors.primaryDark,
            textAlign: isRTL ? "right" : "left",
          }}
        >
          {title && language === LANGUAGE.ENGLISH_INT ? title?.en : title?.ar}
          {headerText}
        </h1>
        <Breadcrumb
          style={{
            direction: language === LANGUAGE.ENGLISH_INT ? "ltr" : "rtl",
          }}
          items={breadcrumbItems}
          itemRender={(item) => {
            return (
              <Link
                style={{ textTransform: "capitalize" }}
                to={`/${first_part}${item.href}`}
              >
                {item.title}
              </Link>
            );
          }}
        />
      </div>
    </div>
  );
};

export default TitleBar;
