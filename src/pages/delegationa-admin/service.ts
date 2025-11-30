import ENV from "@/constants/env";
import LOCALSTORAGE from "@/constants/local-storage";
import apiRequest from "@/lib/api";
import Storage from "@/lib/storage";
import { AxiosRequestConfig } from "axios";

export type UserRole = {
  entity_id: number;
  roles: number[];
};

export const getUserRoles = async (
  userId: number | string
): Promise<UserRole[]> => {
  const token = await Storage.getItem(LOCALSTORAGE.ACCESS_TOKEN);

  const headers: AxiosRequestConfig["headers"] = {
    Authorization: `Bearer ${token}`,
  };
  const response = await apiRequest(
    "GET",
    `/entity/roles/${userId}`,
    {},
    { headers },
    ENV.API_URL
  );
  return response?.Data;
};
export const getCurrentUserRoles = async (): Promise<UserRole[]> => {
  const token = await Storage.getItem(LOCALSTORAGE.ACCESS_TOKEN);

  const headers: AxiosRequestConfig["headers"] = {
    Authorization: `Bearer ${token}`,
  };
  const response = await apiRequest(
    "GET",
    `/entity/roles/current`,
    {},
    { headers },
    ENV.API_URL
  );
  return response?.Data;
};
export interface createAdminDelegationBody {
  date_from: string;
  date_to: string;
  delegate_all: boolean;
  delegate_to: DelegateTo[];
  delegator_user_id: number;
}

export interface DelegateTo {
  delegate_to_user_id: number;
  entity_delegation?: EntityDelegation[];
}

export interface EntityDelegation {
  entity_id: number;
  roles: number[];
}

export const createAdminDelegation = async (
  body: createAdminDelegationBody
) => {
  const token = await Storage.getItem(LOCALSTORAGE.ACCESS_TOKEN);

  const headers: AxiosRequestConfig["headers"] = {
    Authorization: `Bearer ${token}`,
  };
  const response = await apiRequest(
    "PUT",
    `/delegation/admin/create`,
    body,
    { headers },
    ENV.API_URL
  );
  return response;
};

export interface AdminSearchDelegationPayload {
  date_from?: string;
  date_to?: string;
  delegate_to_user_id?: number;
  delegator_user_id?: number;
  is_arabic?: boolean;
  status?: number;
}

export interface AdminDelegationSearch {
  id: number;
  created_by_id: number;
  creator_name: string;
  delegator_user_id: number;
  delegator_user_name: string;
  date_from: string;
  date_to: string;
  status_id: number;
  delegate_all: boolean;
  delegate_to: string[];
  created_at: string;
}
export interface AdminDelegationResponse {
  Page: number;
  PerPage: number;
  TotalPages: number;
  Total: number;
  Rows: AdminDelegationSearch[];
}

export const searchAdminDelegation = async (
  page: number,
  body?: Partial<AdminSearchDelegationPayload>
): Promise<AdminDelegationResponse> => {
  const token = await Storage.getItem(LOCALSTORAGE.ACCESS_TOKEN);

  const headers: AxiosRequestConfig["headers"] = {
    Authorization: `Bearer ${token}`,
  };
  const response = await apiRequest(
    "POST",
    `/delegation/admin/search?page=${page}&perPage=10`,
    body,
    { headers },
    ENV.API_URL
  );
  return response;
};

export type CancelAdminPayload = {
  comments: string;
  id: number;
};
export const adminCancelDelegation = async (
  body: CancelAdminPayload
): Promise<AdminDelegationResponse> => {
  const token = await Storage.getItem(LOCALSTORAGE.ACCESS_TOKEN);

  const headers: AxiosRequestConfig["headers"] = {
    Authorization: `Bearer ${token}`,
  };
  const response = await apiRequest(
    "POST",
    "/delegation/admin/cancel",
    body,
    { headers },
    ENV.API_URL
  );
  return response;
};
