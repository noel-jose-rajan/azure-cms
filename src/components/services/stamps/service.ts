import { HttpClient, ServiceResult } from "@/components/functional/httphelper";
import ENV from "@/constants/env";
import LOCALSTORAGE from "@/constants/local-storage";
import Storage from "@/lib/storage";
import { StampItemType } from "./type";

export const getAllStamps = async () => {
  try {
    const token = await Storage.getItem(LOCALSTORAGE.ACCESS_TOKEN);
    const httpClient = new HttpClient(ENV.API_URL);
    const response = await httpClient.get<StampItemType[]>("/stamps", {
      headers: {
        Authorization: token + "",
      },
    });

    return response;
  } catch (error) {
    return ServiceResult.failed(null, "Something went wrong");
  }
};

export const createNewOrgStamp = async (payLoad: FormData) => {
  try {
    const token = await Storage.getItem(LOCALSTORAGE.ACCESS_TOKEN);
    const httpClient = new HttpClient(ENV.API_URL);
    const response = await httpClient.put<any, any>("/stamps", payLoad, {
      headers: {
        Authorization: token + "",
        "Content-Type": "multipart/form-data",
      },
    });

    return response;
  } catch (error) {
    return ServiceResult.failed(null, "Something went wrong");
  }
};

export const downloadAStampDoc = async (
  stamp: StampItemType,
  onProgress?: (percent: number) => void
) => {
  try {
    const token = await Storage.getItem(LOCALSTORAGE.ACCESS_TOKEN);
    const response = await fetch(ENV.API_URL + `/stamps/${stamp.ID}/content`, {
      method: "GET",
      headers: {
        Authorization: token + "",
      },
    });

    onProgress && onProgress(10);
    if (!response.ok) {
      return null;
    }
    onProgress && onProgress(50);
    const blob = await response.blob();

    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    onProgress && onProgress(70);
    link.download = stamp.Description + ".png";
    document.body.appendChild(link);
    onProgress && onProgress(100);
    link.click();
    document.body.removeChild(link);

    return blob;
  } catch (error) {
    return ServiceResult.failed(null, "Something went wrong");
  }
};

export const updateAStamp = async (payload: FormData, id: number) => {
  try {
    const token = await Storage.getItem(LOCALSTORAGE.ACCESS_TOKEN);
    const httpClient = new HttpClient(ENV.API_URL);
    const response = await httpClient.post(`/stamps/${id}/content`, payload, {
      headers: {
        Authorization: token + "",
        "Content-Type": "multipart/form-data",
      },
    });

    return response;
  } catch (error) {
    return ServiceResult.failed(null, "Something went wrong");
  }
};

export const deleteStamp = async (id?: number) => {
  try {
    const token = await Storage.getItem(LOCALSTORAGE.ACCESS_TOKEN);
    const httpClient = new HttpClient(ENV.API_URL);
    const response = await httpClient.delete<any>(`/stamps/${id}`, {
      headers: {
        Authorization: token + "",
      },
    });

    return response;
  } catch (error) {
    return ServiceResult.failed(null, "Something went wrong");
  }
};
