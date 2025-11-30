import { useTheme } from "../../../context/theme";
import TopBar from "../../ui/bar/top-bar";
import { Card } from "antd";
import AdminSidebar from "../../ui/navigation/admin-side-bar";
import { useAuth } from "../../../context/auth";
import { useLanguage } from "../../../context/language";
import { Outlet } from "react-router-dom";

export default function PrimaryLayout() {
  const { theme } = useTheme();
  const { isAuthenticated } = useAuth();
  const { isEnglish } = useLanguage();
  return (
    <main
      style={{
        all: "unset",
        display: "block",
        minHeight: "100vh",
        width: "100%",
        backgroundColor: theme.colors.background,
      }}
    >
      <TopBar />
      <div
        style={{
          display: "flex",
          minHeight: "calc(100vh - 48px)",
        }}
      >
        {isAuthenticated ? (
          <>
            <Card
              style={{
                height: "calc(100vh - 48px)",
                backgroundColor: theme.colors.background,
                display: "inline-flex",
                justifyContent: "flex-start",
                flexShrink: 0,
                borderColor: theme.colors.border,
                order: isEnglish ? 1 : 2,
              }}
              bodyStyle={{
                padding: 10,
              }}
            >
              <AdminSidebar />
            </Card>
            <Card
              style={{
                order: 1,
                flexGrow: isEnglish ? 2 : 1,
                backgroundColor: theme.colors.background,
                height: "calc(100vh - 48px)",
                overflow: "auto",
                margin: 0,
                padding: 0,
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                border: "none",
              }}
            >
              <div
                style={{
                  minHeight: "calc(100vh - 78px)",
                  direction: "ltr",
                }}
              >
                <Outlet />
              </div>
              <div
                style={{
                  height: 30,
                  width: "100%",
                  display: "flex",
                  backgroundColor: theme.colors.primary,
                  alignItems: "center",
                  marginBottom: -15,
                  marginTop: 10,
                }}
              >
                <p style={{ color: "#fff", marginLeft: 15, fontSize: 13 }}>
                  Copy Right © 2024
                </p>
              </div>
            </Card>
          </>
        ) : (
          <div style={{ width: "100%", height: "calc(100vh - 48px)" }}>
            <Outlet />
          </div>
        )}
      </div>
    </main>
  );
}
