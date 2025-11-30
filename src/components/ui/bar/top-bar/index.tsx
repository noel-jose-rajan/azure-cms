import { Dropdown, MenuProps, Button, Col } from "antd";
import { CaretDownOutlined } from "@ant-design/icons";
import { useTheme } from "../../../../context/theme";
import Text from "../../text/text";
import themes, { ThemeName } from "../../../../configs/theme/register-theme";
import LanguageSwitch from "../../switch/language-switch";
import { useAuth } from "../../../../context/auth";
// import QuickSearchBar from "../../search/quick-search-bar";
import Notifications from "../../notifications";
import AccountOptions from "../../account-info-top";
import { NotificationsProvider } from "../../notifications/context";

const TopBar: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const { isAuthenticated } = useAuth();

  // Menu items for theme selection
  const menu: MenuProps["items"] = Object.keys(themes).map((item) => ({
    key: item,
    label: (
      <Text
        style={{ color: theme.colors.primary, textTransform: "capitalize" }}
        ar={`${item} السمة`}
        en={`${item} Theme`}
      />
    ),
    onClick: () => toggleTheme(item as ThemeName),
  }));

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "0 16px",
        height: "48px",
        background: theme.colors.background,
        color: theme.colors.text,
        borderBottom: `1px solid ${theme.colors.border}`,
      }}
    >
      {/* Theme Switcher */}
      <Col xs={0} sm={0} md={0} xl={5} lg={5}>
        <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
          <Dropdown menu={{ items: menu }} trigger={["click"]}>
            <Button type="text">
              <Text
                style={{ textTransform: "capitalize" }}
                ar={`تبديل السمة (${theme.name})`}
                en={`Toggle Theme (${theme.name})`}
              />
              <CaretDownOutlined />
            </Button>
          </Dropdown>
        </div>
      </Col>
      <Col
        xs={24}
        sm={24}
        md={24}
        xl={19}
        lg={19}
        style={{
          display: "flex",
          justifyContent: "end",
          alignItems: "center",
        }}
      >
        {/* <div style={{ minWidth: 300, maxWidth: 700 }}>
          {isAuthenticated && <QuickSearchBar />}
        </div> */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
          }}
        >
          {!isAuthenticated && <LanguageSwitch />}
          {isAuthenticated && (
            <>
              <NotificationsProvider>
                <Notifications />
              </NotificationsProvider>
              <div style={{ width: 10 }}></div>
              <AccountOptions />
            </>
          )}
        </div>
      </Col>
    </div>
  );
};

export default TopBar;
