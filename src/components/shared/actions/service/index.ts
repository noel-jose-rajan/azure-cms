import ENV from "@/constants/env";
import LOCALSTORAGE from "@/constants/local-storage";
import apiRequest from "@/lib/api";
import Storage from "@/lib/storage";
import { AxiosRequestConfig } from "axios";

export type OutboundActionsPayload = {
  correspondence_type: number;
  receiving_Entity?: number;
  receiving_Entities?: number[];
  security_level: number;
  sending_entity: number;
};

export type ActionType = {
  ENTITY: string;
  ROLE: string;
  TYPE: string;
};
export type Actions = {
  ID: number;
  action: ActionType;
  comment_required: boolean;
};

export const getActions = async (
  body: OutboundActionsPayload
): Promise<Actions[] | null> => {
  const token = await Storage.getItem(LOCALSTORAGE.ACCESS_TOKEN);

  const headers: AxiosRequestConfig["headers"] = {
    Authorization: `Bearer ${token}`,
  };
  const response = await apiRequest(
    "POST",
    `/task/outbound/start/actions`,
    body,
    { headers },
    ENV.API_URL
  );
  return response?.Data;
};

export type SubActionDetails = {
  ID: number;
  name_ar: string;
  name_en: string;
  action: ActionType;
};

export type SubAction = {
  Message: string;
  Data: SubActionDetails[];
  Info: string;
};

export const getSubActions = async (
  id: string | number,
  body: Actions
): Promise<SubAction | null> => {
  const token = await Storage.getItem(LOCALSTORAGE.ACCESS_TOKEN);

  const headers: AxiosRequestConfig["headers"] = {
    Authorization: `Bearer ${token}`,
  };
  const response = await apiRequest(
    "POST",
    `/task/${id}/sub-actions`,
    body,
    { headers },
    ENV.API_URL
  );
  return response;
};

export type RouteSubActionDetails = {
  ROUTE_CC: SubActionDetails[];
  ROUTE_CC_USER: SubActionDetails[];
  ROUTE: SubActionDetails[];
  ROUTE_USER: SubActionDetails[];
};

export type RouteSubAction = {
  Message: string;
  Data: RouteSubActionDetails;
  Info: string;
};

export const getRouteSubActions = async (
  id: string | number,
  body: Actions
): Promise<RouteSubAction | null> => {
  const token = await Storage.getItem(LOCALSTORAGE.ACCESS_TOKEN);

  const headers: AxiosRequestConfig["headers"] = {
    Authorization: `Bearer ${token}`,
  };
  const response = await apiRequest(
    "POST",
    `/task/${id}/sub-actions`,
    body,
    { headers },
    ENV.API_URL
  );
  return response;
};

export const uploadNewTemplateVersion = async (
  id: string | number,
  formdata: FormData
): Promise<RouteSubAction | null> => {
  const token = await Storage.getItem(LOCALSTORAGE.ACCESS_TOKEN);

  const headers: AxiosRequestConfig["headers"] = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "multipart/form-data",
  };
  const response = await apiRequest(
    "POST",
    `/correspondence/content/${id}`,
    formdata,
    { headers },
    ENV.API_URL
  );
  return response;
};

export type TaskHistory = {
  task_subject: string;
  perfomer_id: number;
  action_id: number;
  status: number;
  entity_id: number;
  comments: string;
  created_at: string;
};
export const getTaskHistory = async (
  id: string | number
): Promise<TaskHistory[] | null> => {
  const token = await Storage.getItem(LOCALSTORAGE.ACCESS_TOKEN);

  const headers: AxiosRequestConfig["headers"] = {
    Authorization: `Bearer ${token}`,
  };
  const response = await apiRequest(
    "GET",
    `/correspondence/${id}/history`,
    {},
    { headers },
    ENV.API_URL
  );
  return response?.Data;
};
