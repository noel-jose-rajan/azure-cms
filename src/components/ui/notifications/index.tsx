import { BellFilled } from "@ant-design/icons";
import { Badge, Dropdown } from "antd";
import { useEffect, useState } from "react";
import { useLanguage } from "../../../context/language";
import { useTheme } from "../../../context/theme";
import ListNotification from "./components/list";
import { getNotificationCount } from "./service";
import { useNotifications } from "./hooks/use-get-notifications";

export default function Notifications() {
  const { labels, isEnglish } = useLanguage();
  const { theme } = useTheme();
  const [count, setCount] = useState<number>(0);
  const { open, setOpen } = useNotifications();
  const [refreshCount, setRefreshCount] = useState<number>(0);
  useEffect(() => {
    const getNotificationCount = setInterval(() => {
      init();
    }, 15000);

    return () => clearInterval(getNotificationCount);
  }, []);

  useEffect(() => {
    init();
  }, [refreshCount]);

  const init = async () => {
    const response = await getNotificationCount();
    if (response || response == 0) {
      setCount(response);
    }
  };

  const handleRefreshCount = () => {
    setRefreshCount((c) => c + 1);
  };

  const menu = () => (
    <div
      style={{
        position: "absolute",
        width: 400,
        maxHeight: 400,
        backgroundColor: "white",
        border: "1px solid #ccc",
        borderRadius: "4px",
        zIndex: 1000,
        marginTop: 10,
        padding: 0,
        right: 0,
      }}
    >
      <div
        style={{
          display: "flex",
          width: "100%",
          height: "100%",
          flexDirection: "column",
        }}
      >
        <p
          style={{
            fontSize: 16,
            color: theme.colors.primary,
            fontWeight: "700",
            textAlign: isEnglish ? "start" : "end",
            padding: 8,
          }}
        >
          {labels.lbl.notifications}
        </p>

        {open && <ListNotification handleRefreshCount={handleRefreshCount} />}
      </div>
    </div>
  );

  return (
    <div style={{ position: "relative" }}>
      <Dropdown
        dropdownRender={menu}
        trigger={["click"]}
        onOpenChange={(bool) => {
          setOpen(bool);
        }}
        open={open}
      >
        <Badge count={count} offset={[0, 0]} overflowCount={99}>
          <BellFilled
            style={{
              fontSize: 20,
              marginLeft: 5,
              color: theme.colors.primary,
            }}
          />
        </Badge>
      </Dropdown>
    </div>
  );
}
