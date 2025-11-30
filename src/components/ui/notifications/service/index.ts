import ENV from "@/constants/env";
import LOCALSTORAGE from "@/constants/local-storage";
import apiRequest from "@/lib/api";
import Storage from "@/lib/storage";
import { AxiosRequestConfig } from "axios";

export const getNotificationCount = async (): Promise<number> => {
  const token = await Storage.getItem(LOCALSTORAGE.ACCESS_TOKEN);

  const headers: AxiosRequestConfig["headers"] = {
    Authorization: `Bearer ${token}`,
  };
  const response = await apiRequest(
    "GET",
    `/notification/count`,
    {},
    { headers },
    ENV.API_URL
  );
  return response?.Data || 0;
};

export const getNotificationsTypes = async (): Promise<any> => {
  const token = await Storage.getItem(LOCALSTORAGE.ACCESS_TOKEN);

  const headers: AxiosRequestConfig["headers"] = {
    Authorization: `Bearer ${token}`,
  };
  const response = await apiRequest(
    "GET",
    `/notification/types`,
    {},
    { headers },
    ENV.API_URL
  );
  return response?.Data || 0;
};

export type NotificationType = {
  id: number;
  is_read: boolean;
  created_at: string;
  content: string;
};
export const getNotificationsList = async (
  page: number,
  isArabic: boolean = false,
  perPage = 10
): Promise<NotificationType[]> => {
  const token = await Storage.getItem(LOCALSTORAGE.ACCESS_TOKEN);

  const headers: AxiosRequestConfig["headers"] = {
    Authorization: `Bearer ${token}`,
  };
  const response = await apiRequest(
    "GET",
    `/notification/list?page=${page}&perPage=${perPage}&is_arabic=${isArabic}`,
    {},
    { headers },
    ENV.API_URL
  );
  return response;
};

export const MarkNotificationsAsRead = async (body: number[]) => {
  const token = await Storage.getItem(LOCALSTORAGE.ACCESS_TOKEN);

  const headers: AxiosRequestConfig["headers"] = {
    Authorization: `Bearer ${token}`,
  };
  const response = await apiRequest(
    "POST",
    `/notification/read`,
    body,
    { headers },
    ENV.API_URL
  );
  return response || 0;
};
