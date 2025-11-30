import { AxiosRequestConfig } from "axios";
import ENV from "../../../constants/env";
import LOCALSTORAGE from "../../../constants/local-storage";
import apiRequest from "../../../lib/api";
import Storage from "../../../lib/storage";

export type UserType = {
  id: number;
  name_ar: string;
  name_en: string;
  username: string;
};
export const getUsers = async (): Promise<UserType[]> => {
  const token = await Storage.getItem(LOCALSTORAGE.ACCESS_TOKEN);

  const headers: AxiosRequestConfig["headers"] = {
    Authorization: `Bearer ${token}`,
  };
  const response = await apiRequest(
    "GET",
    "/users/get-all",
    {},
    { headers },
    ENV.API_URL
  );
  return response?.Data;
};
