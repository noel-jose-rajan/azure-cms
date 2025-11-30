import ENV from "@/constants/env";
import LOCALSTORAGE from "@/constants/local-storage";
import apiRequest from "@/lib/api";
import Storage from "@/lib/storage";
import { AxiosRequestConfig } from "axios";

export type ViewsType = {
  code: string;
  id: number;
  name_ar: string;
  name_en: string;
};

export const getAllowedViews = async (): Promise<ViewsType[] | null> => {
  try {
    const token = await Storage.getItem(LOCALSTORAGE.ACCESS_TOKEN);
    const headers: AxiosRequestConfig["headers"] = {
      Authorization: `Bearer ${token}`,
    };

    const response = await apiRequest(
      "GET",
      `/app-views/current`,
      {},
      { headers },
      ENV.API_URL
    );
    return response || [];
  } catch (e: any) {
    console.log(e);
    return null;
  }
};
