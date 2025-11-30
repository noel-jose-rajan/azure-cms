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
export interface createUserDelegationBody {
  date_from: string;
  date_to: string;
  delegate_all: boolean;
  delegate_to: DelegateTo[];
}

export interface DelegateTo {
  delegate_to_user_id: number;
  entity_delegation?: EntityDelegation[];
}

export interface EntityDelegation {
  entity_id: number;
  roles: number[];
}

export const createUserDelegation = async (body: createUserDelegationBody) => {
  const token = await Storage.getItem(LOCALSTORAGE.ACCESS_TOKEN);

  const headers: AxiosRequestConfig["headers"] = {
    Authorization: `Bearer ${token}`,
  };
  const response = await apiRequest(
    "PUT",
    `/delegation/create`,
    body,
    { headers },
    ENV.API_URL
  );
  return response;
};

export interface UserSearchDelegationPayload {
  date_from?: string;
  date_to?: string;
  delegate_to_user_id?: number;
  delegator_user_id?: number;
  is_arabic?: boolean;
  status?: number;
}

export interface UserDelegationSearch {
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
export interface UserDelegationResponse {
  Page: number;
  PerPage: number;
  TotalPages: number;
  Total: number;
  Rows: UserDelegationSearch[];
}

export const searchUserDelegation = async (
  page: number,
  body?: Partial<UserSearchDelegationPayload>
): Promise<UserDelegationResponse> => {
  const token = await Storage.getItem(LOCALSTORAGE.ACCESS_TOKEN);

  const headers: AxiosRequestConfig["headers"] = {
    Authorization: `Bearer ${token}`,
  };
  const response = await apiRequest(
    "POST",
    `/delegation/search?page=${page}&perPage=10`,
    body,
    { headers },
    ENV.API_URL
  );
  return response;
};

export type CancelUserPayload = {
  comments: string;
  id: number;
};
export const userCancelDelegation = async (
  body: CancelUserPayload
): Promise<UserDelegationResponse> => {
  const token = await Storage.getItem(LOCALSTORAGE.ACCESS_TOKEN);

  const headers: AxiosRequestConfig["headers"] = {
    Authorization: `Bearer ${token}`,
  };
  const response = await apiRequest(
    "POST",
    "/delegation/cancel",
    body,
    { headers },
    ENV.API_URL
  );
  return response;
};
