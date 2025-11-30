import ENV from "../../../constants/env";
import LOCALSTORAGE from "../../../constants/local-storage";
import Storage from "../../../lib/storage";
import { HttpClient, ServiceResult } from "../../functional/httphelper";
import { SearchResultType, corrUploadResponseType } from "../inbound/types";
import { CreateCorrespondenceType, ListCorrespondenceType } from "./types";

export const uploadOutboundDocToServer = async (payLoad: FormData) => {
  try {
    const token = await Storage.getItem(LOCALSTORAGE.ACCESS_TOKEN);

    const httpClient = new HttpClient(ENV.API_URL);
    const response = await httpClient.post<corrUploadResponseType, any>(
      `/correspondence/in/upload`,
      payLoad,
      {
        headers: {
          Authorization: token + "",
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return response;
  } catch (error) {
    return ServiceResult.failed(null, "Something went wrong");
  }
};

export const updateDraftCorrespondence = async (
  payLoad: CreateCorrespondenceType
) => {
  try {
    let token = Storage.getItem(LOCALSTORAGE.ACCESS_TOKEN);
    const httpClient = new HttpClient(ENV.API_URL);
    const response = await httpClient.put<
      CreateCorrespondenceType,
      CreateCorrespondenceType
    >(`/correspondence/update/${payLoad.id}`, payLoad, {
      headers: {
        Authorization: token + "",
      },
    });

    return response;
  } catch (error) {
    return ServiceResult.failed(null, "Something went wrong");
  }
};

export const getAllDrafts = async (
  pagination: {
    page: number;
    total: number;
    size: number;
  },
  userId: string
) => {
  try {
    let token = Storage.getItem(LOCALSTORAGE.ACCESS_TOKEN);
    const httpClient = new HttpClient(ENV.API_URL);
    const response = await httpClient.get<
      SearchResultType<ListCorrespondenceType[]>
    >(
      `/correspondence/search?initiator=${userId}&pageNumber=${
        pagination.page - 1
      }&pageSize=${pagination.size}`,
      {
        headers: {
          Authorization: token + "",
        },
      }
    );

    return response;
  } catch (error) {
    return ServiceResult.failed(null, "Something went wrong");
  }
};

export const submitCorrespondence = async (payLoad: any) => {
  try {
    let token = Storage.getItem(LOCALSTORAGE.ACCESS_TOKEN);
    const httpClient = new HttpClient(ENV.API_URL);
    const response = await httpClient.put<any, any>(
      `/correspondence/submit`,
      payLoad,
      {
        headers: {
          Authorization: token + "",
        },
      }
    );

    return response;
  } catch (error) {
    return ServiceResult.failed(null, "Something went wrong");
  }
};
