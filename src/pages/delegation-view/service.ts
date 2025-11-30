import ENV from "@/constants/env";
import LOCALSTORAGE from "@/constants/local-storage";
import apiRequest from "@/lib/api";
import Storage from "@/lib/storage";
import { AxiosRequestConfig } from "axios";
export interface DelegationDetails {
  created_at: string;
  created_by_id: number;
  created_by_name: string;
  date_from: string;
  date_to: string;
  delegate_all: boolean;
  delegate_to: DelegateTo[];
  delegator_user_id: number;
  delegator_user_name: string;
  id: number;
  status_id: number;
}

export interface DelegateTo {
  delegate_to_user_id: number;
  delegate_to_user_name: string;
  entity_delegation: EntityDelegation[];
}

export interface EntityDelegation {
  entity_id: number;
  roles: number[];
}

export const getDelegationDetails = async (
  id: string,
  isArabic: boolean
): Promise<DelegationDetails> => {
  const token = await Storage.getItem(LOCALSTORAGE.ACCESS_TOKEN);

  const headers: AxiosRequestConfig["headers"] = {
    Authorization: `Bearer ${token}`,
  };
  const response = await apiRequest(
    "GET",
    `/delegation/${id}?is_arabic=${isArabic}`,
    {},
    { headers },
    ENV.API_URL
  );
  return response;
};
