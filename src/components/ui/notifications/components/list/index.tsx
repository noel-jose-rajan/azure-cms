import { CSSProperties, useCallback, useEffect, useRef } from "react";
import { Row } from "antd";
import { useLanguage } from "../../../../../context/language";
import { MessageOutlined } from "@ant-design/icons";
import moment from "moment";
import LoaderComponent from "@/components/ui/loader";
import Spinner from "@/components/ui/spinner";
import { useTheme } from "@/context/theme";
import WhileInViewWrapper from "@/animations/while-in-view-wrapper";
import { hexToRGBA } from "@/lib/colors";
import { MarkNotificationsAsRead, NotificationType } from "../../service";
import { useNotifications } from "../../hooks/use-get-notifications";
import { motion } from "framer-motion";
export default function ListNotification({
  handleRefreshCount,
}: {
  handleRefreshCount: () => void;
}) {
  const {
    isMore,
    handleIncrementPage,
    notifications,
    loading,
    handleMarkNotificationsAsRead,
  } = useNotifications();

  const { isEnglish } = useLanguage();

  const observer = useRef<IntersectionObserver | null>(null);
  const lastEle = useCallback((node: HTMLDivElement) => {
    if (isMore) {
      if (!node) return;
      if (observer.current) observer?.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          handleIncrementPage();
        }
      });
      observer.current.observe(node);
    }
  }, []);

  useEffect(() => {
    if (notifications.length > 0) {
      handleRefreshCount();
    }
  }, [notifications]);

  const handleMarksAsRead = async (id: number) => {
    await MarkNotificationsAsRead([id]);
    handleRefreshCount();
    handleMarkNotificationsAsRead(id);
  };

  return (
    <div
      style={{
        display: "flex",
        height: 320,
        overflowY: "auto",
        borderTop: "1px solid #d3d3d3",
      }}
    >
      {notifications?.length === 0 && !loading && (
        <div style={styles.container}>
          <MessageOutlined style={{ fontSize: 30 }} />
          <span>
            {isEnglish ? "No notifications found" : "لا توجد إشعارات"}
          </span>
        </div>
      )}

      {notifications.length === 0 && loading && (
        <div style={styles.container}>
          <LoaderComponent fullscreen={false} delay={0} loading />
        </div>
      )}
      {notifications && notifications.length > 0 && (
        <div style={{ display: "flex", flexDirection: "column" }}>
          {notifications?.map((item, index) => (
            <motion.span
              key={index}
              ref={index === notifications.length - 1 ? lastEle : null}
              onViewportEnter={() => {
                if (!item.is_read) {
                  handleMarksAsRead(item.id);
                }
              }}
            >
              <Notification item={item} />
            </motion.span>
          ))}

          <>{<Loading loading={loading && isMore} />}</>
        </div>
      )}
    </div>
  );
}

const styles: { [x: string]: CSSProperties } = {
  container: {
    height: 120,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    flexDirection: "column",
  },
};

const Notification = ({ item }: { item: NotificationType }) => {
  const { theme } = useTheme();
  const { isEnglish } = useLanguage();
  return (
    <WhileInViewWrapper
      style={{
        background: item?.is_read
          ? theme.colors.background
          : hexToRGBA(theme.colors.primaryDark, 0.15),
        padding: 10,
        cursor: "pointer",
        minHeight: 60,
        marginBlock: 5,
        boxShadow: "0 1px 2px rgba(0,0,0,0.1)",
        direction: isEnglish ? "ltr" : "rtl",
      }}
    >
      <Row>{item.content}</Row>
      <Row>{moment(item.created_at).format("YYYY-MM-DD HH:mm:ss")}</Row>
    </WhileInViewWrapper>
  );
};

const Loading = ({ loading }: { loading: boolean }) => {
  return (
    <Row
      style={{
        padding: 10,
        cursor: "pointer",
        minHeight: 60,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {loading && <Spinner size="small" />}
    </Row>
  );
};
