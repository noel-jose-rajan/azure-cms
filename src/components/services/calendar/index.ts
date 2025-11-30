import Storage from "../../../lib/storage";
import LOCALSTORAGE from "../../../constants/local-storage";
import ENV from "../../../constants/env";
import { HttpClient, ServiceResult } from "../../functional/httphelper";
import { z } from "zod";
import { SearchResultType } from "../inbound/types";
import { AxiosRequestConfig } from "axios";
import apiRequest from "@/lib/api";

export const holidaySchema = z.object({
  id: z.any().optional(),
  start_date: z.string().optional(),
  holiday_name: z.string(),
  end_date: z.string()?.optional(),
  dateRange: z.tuple([z.string(), z.string()])?.optional(),
});

export type Holiday = z.infer<typeof holidaySchema>;

export type WorkingDay = {
  day_id: number;
  time_from?: string;
  time_to?: string /* ... */;
};

export type setWorkingHoursBody = {
  working_days: WorkingDay[];
};
export const setWorkingHours = async (body: setWorkingHoursBody) => {
  const token = await Storage.getItem(LOCALSTORAGE.ACCESS_TOKEN);

  const headers: AxiosRequestConfig["headers"] = {
    Authorization: `Bearer ${token}`,
  };
  const response = await apiRequest(
    "POST",
    `/calendar/working-day`,
    body,
    { headers },
    ENV.API_URL
  );
  return response;
};

export const getWorkingHours = async (): Promise<WorkingDay[]> => {
  const token = await Storage.getItem(LOCALSTORAGE.ACCESS_TOKEN);

  const headers: AxiosRequestConfig["headers"] = {
    Authorization: `Bearer ${token}`,
  };
  const response = await apiRequest(
    "GET",
    `/calendar/working-day`,
    {},
    { headers },
    ENV.API_URL
  );
  return response?.working_days;
};

export interface getHolidayResponse {
  Page: number;
  PerPage: number;
  TotalPages: number;
  Total: number;
  Rows: Holiday[];
}

export const getAllHolidays = async (
  page: number
): Promise<getHolidayResponse> => {
  const token = await Storage.getItem(LOCALSTORAGE.ACCESS_TOKEN);

  const headers: AxiosRequestConfig["headers"] = {
    Authorization: `Bearer ${token}`,
  };
  const response = await apiRequest(
    "GET",
    `/calendar/holiday?page=${page}&perPage=10`,
    {},
    { headers },
    ENV.API_URL
  );
  return response;
};

export const addHoliday = async (body: Holiday) => {
  const token = await Storage.getItem(LOCALSTORAGE.ACCESS_TOKEN);

  const headers: AxiosRequestConfig["headers"] = {
    Authorization: `Bearer ${token}`,
  };
  const response = await apiRequest(
    "POST",
    `/calendar/holiday`,
    body,
    { headers },
    ENV.API_URL
  );
  return response;
};
export const editHoliday = async (id: string, body: Holiday) => {
  const token = await Storage.getItem(LOCALSTORAGE.ACCESS_TOKEN);

  const headers: AxiosRequestConfig["headers"] = {
    Authorization: `Bearer ${token}`,
  };
  const response = await apiRequest(
    "POST",
    `/calendar/holiday/${id}`,
    body,
    { headers },
    ENV.API_URL
  );
  return response;
};

export const deleteHoliday = async (id: string | number) => {
  const token = await Storage.getItem(LOCALSTORAGE.ACCESS_TOKEN);

  const headers: AxiosRequestConfig["headers"] = {
    Authorization: `Bearer ${token}`,
  };
  const response = await apiRequest(
    "DELETE",
    `/calendar/holiday/${id}`,
    {},
    { headers },
    ENV.API_URL
  );
  return response;
};
