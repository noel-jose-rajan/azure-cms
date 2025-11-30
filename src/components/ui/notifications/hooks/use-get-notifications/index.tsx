// import { useLanguage } from "@/context/language";

// import { useEffect, useState } from "react";
// import {
//   getNotificationsList,
//   MarkNotificationsAsRead,
//   NotificationType,
// } from "../../service";

// const useGetNotifications = (perPage = 10) => {
//   const { isEnglish } = useLanguage();
//   const [notifications, setNotifications] = useState<NotificationType[]>([]);

//   const [loading, setLoading] = useState(true);
//   const [isMore, setIsMore] = useState(true);
//   const [page, setPage] = useState(1);

//   const reset = () => {
//     setPage(1);
//     setNotifications([]);
//     setIsMore(true);
//     setLoading(true);
//   };

//   const getNotifications = async () => {
//     try {
//       setNotifications((prev = []) => [
//         ...prev.map((n) => ({ ...n, is_read: true })),
//       ]);
//       setLoading(true);
//       const response = await getNotificationsList(page, !isEnglish, perPage);
//       if (response && response.length > 0) {
//         setNotifications((prev) => [...prev, ...response]);
//         setIsMore(true);
//       } else {
//         setIsMore(false);
//       }
//       await handleMarksAsRead();
//     } catch (err) {
//       setLoading(false);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleMarksAsRead = async () => {
//     const ids = notifications
//       .filter((notification) => !notification.is_read)
//       .map((notification) => notification.id);
//     if (ids.length > 0) {
//       await MarkNotificationsAsRead(ids);
//     }
//   };

//   useEffect(() => {
//     getNotifications();
//   }, [page, isEnglish]);
//   return { loading, setPage, isMore, setLoading, notifications, reset };
// };

// export default useGetNotifications;

import { useContext } from "react";
import { NotificationsContext } from "../../context";

export const useNotifications = () => {
  const context = useContext(NotificationsContext);
  if (!context) {
    throw new Error(
      "useNotifications must be used within a NotificationsProvider"
    );
  }
  return context;
};
