// notifications.context.tsx
import React, { createContext, useState, useEffect } from "react";

import { useLanguage } from "@/context/language";
import { getNotificationsList, NotificationType } from "../service";

interface NotificationsContextType {
  notifications: NotificationType[];
  loading: boolean;
  isMore: boolean;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  handleIncrementPage: () => void;
  handleMarkNotificationsAsRead: (id: number) => void;
  reset: () => void;
}

export const NotificationsContext = createContext<
  NotificationsContextType | undefined
>(undefined);

export const NotificationsProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { isEnglish } = useLanguage();
  const [open, setOpen] = useState<boolean>(false);

  const [notifications, setNotifications] = useState<NotificationType[]>([]);
  const [loading, setLoading] = useState(true);
  const [isMore, setIsMore] = useState(true);
  const [page, setPage] = useState(1);
  const perPage = 10;

  const reset = () => {
    setPage(1);
    setNotifications([]);
    setIsMore(true);
  };

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;
    if (!open) {
      timeout = setTimeout(() => {
        reset();
      }, 200);
    }
    return () => clearTimeout(timeout);
  }, [open]);
  const getNotifications = async () => {
    try {
      setLoading(true);
      const response = await getNotificationsList(page, !isEnglish, perPage);
      if (response && response.length > 0) {
        setNotifications((prev) => [...prev, ...response]);
        setIsMore(true);
      } else {
        setIsMore(false);
      }
    } catch (err) {
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open) {
      getNotifications();
    }
  }, [page, isEnglish, open]);
  const handleIncrementPage = () => {
    setPage((prevPage) => prevPage + 1);
  };

  const handleMarkNotificationsAsRead = async (id: number) => {
    setNotifications((prev = []) => [
      ...prev.map((n) => (n?.id === id ? { ...n, is_read: true } : n)),
    ]);
  };
  return (
    <NotificationsContext.Provider
      value={{
        notifications,
        loading,
        isMore,
        reset,
        handleIncrementPage,
        open,
        setOpen,
        handleMarkNotificationsAsRead,
      }}
    >
      {children}
    </NotificationsContext.Provider>
  );
};
