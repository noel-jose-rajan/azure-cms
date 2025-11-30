import { useEffect, useState } from "react";
import { Button } from "antd";
import { MenuOutlined } from "@ant-design/icons";
import { useTheme } from "../../../../context/theme";
import { NavLink, useLocation } from "react-router-dom";
import { useLanguage } from "../../../../context/language";
import { useAllowedViews } from "@/context/allowed-views";
import FadeInWrapperAnimation from "@/animations/fade-in-wrapper-animation";

const AdminSidebar = () => {
  const { theme } = useTheme();
  const { isEnglish } = useLanguage();
  const { allowedRoutes } = useAllowedViews();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState<boolean>(false);
  const [selectedPath, setSelectedPath] = useState<string>(location.pathname);
  const handleCollapse = () => {
    setCollapsed(!collapsed);
  };
  useEffect(() => {
    setSelectedPath(location.pathname);
  }, [location]);
  return (
    <div style={{ width: "100%", height: "100%" }}>
      <Button
        type="text"
        onClick={handleCollapse}
        style={{
          color: theme.colors.text,
          width: "100%",
          textAlign: collapsed ? "center" : "left",
          display: "flex",
          alignItems: "center",
          justifyContent: isEnglish ? "left" : "right",
          direction: isEnglish ? "ltr" : "rtl",
        }}
      >
        <MenuOutlined />
        {!collapsed && (isEnglish ? "Collapse Menu" : "إخفاء القائمة")}
      </Button>
      <br />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          overflowY: "auto",
          height: "calc(100vh - 150px)",
          width: "100%",
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >
        {allowedRoutes?.map((item, idx) => {
          return (
            <FadeInWrapperAnimation
              key={item?.path}
              enableScaleAnimation={false}
              animateDelay={idx * 0.075}
              animateDuration={0.15}
              style={{
                width: "100%",
                backgroundColor:
                  selectedPath == item.path ? theme.colors.primary : "unset",
                borderRadius: "5px",
                transition: ".3s",
              }}
              onClick={() => setSelectedPath(item.path)}
            >
              <NavLink
                to={item.path}
                style={{
                  width: "100%",
                  height: 40,
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <Button
                  type="text"
                  icon={
                    <item.icon
                      style={{
                        transition: ".15s",
                        color:
                          selectedPath === item.path
                            ? theme.colors.backgroundText
                            : theme.colors.text,
                      }}
                    />
                  }
                  style={{
                    width: "100%",
                    textAlign: collapsed ? "center" : "left",
                    display: "flex",
                    alignItems: "center",

                    // flexDirection: isEnglish ? "row" : "row-reverse",
                    justifyContent: collapsed ? "center" : "start",
                    gap: 8,
                    color:
                      selectedPath == item.path
                        ? theme.colors.backgroundText
                        : theme.colors.text,
                  }}
                >
                  {!collapsed && item.name}
                </Button>
              </NavLink>
            </FadeInWrapperAnimation>
          );
        })}
      </div>
      <br />
    </div>
  );
};

export default AdminSidebar;
