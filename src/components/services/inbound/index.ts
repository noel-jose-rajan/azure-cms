import ENV from "../../../constants/env";
import LOCALSTORAGE from "../../../constants/local-storage";
import Storage from "../../../lib/storage";
import { CorrespondenceDTOType } from "../../../pages/create-inbound/types";
import { HttpClient, ServiceResult } from "../../functional/httphelper";
import {
  CorrespondenceSearchResultType,
  SearchResultType,
  corrUploadResponseType,
} from "./types";

export const uploadDocToServer = async (payLoad: FormData) => {
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
//not used
export const updateDraftCorrespondence = async (
  payLoad: CorrespondenceDTOType
) => {
  try {
    let token = Storage.getItem(LOCALSTORAGE.ACCESS_TOKEN);
    const httpClient = new HttpClient(ENV.API_URL);
    const response = await httpClient.put<
      CorrespondenceDTOType,
      CorrespondenceDTOType
    >(`/correspondence/in/update/${payLoad.correspondenceId}`, payLoad, {
      headers: {
        Authorization: token + "",
      },
    });

    return response;
  } catch (error) {
    return ServiceResult.failed(null, "Something went wrong");
  }
};

export const getCorrespondenceDetails = async (id: string) => {
  try {
    let token = Storage.getItem(LOCALSTORAGE.ACCESS_TOKEN);
    const httpClient = new HttpClient(ENV.API_URL);
    const response = await httpClient.get<CorrespondenceSearchResultType>(
      `/correspondence/in/search?pageNumber=1&pageSize=10&sortOrder=DESC&searchCriteria={"id": "${id}"}`,
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

export const deleteADraft = async (corrId: string) => {
  try {
    let token = Storage.getItem(LOCALSTORAGE.ACCESS_TOKEN);
    const httpClient = new HttpClient(ENV.API_URL);

    const response = await httpClient.delete(
      `/correspondence/delete/${corrId}`,
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

export const getAllInbounds = async (pageNumber: number, pageSize: number) => {
  try {
    let token = Storage.getItem(LOCALSTORAGE.ACCESS_TOKEN);
    const httpClient = new HttpClient(ENV.API_URL);
    const response = await httpClient.get<
      SearchResultType<CorrespondenceDTOType>
    >(
      `/correspondence/in/search?pageNumber=${pageNumber}&pageSize=${pageSize}&sortOrder=DESC`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response;
  } catch (error) {
    return ServiceResult.failed(null, "Something went wrong");
  }
};
