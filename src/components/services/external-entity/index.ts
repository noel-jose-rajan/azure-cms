import ENV from "../../../constants/env";
import LOCALSTORAGE from "../../../constants/local-storage";
import Storage from "../../../lib/storage";
import { HttpClient, ServiceResult } from "../../functional/httphelper";
import { SearchResultType } from "../inbound/types";
import {
  CreateExternalEntityType,
  DuplicateExternalEntityType,
  DuplicateSearchResultType,
  ExternalEntityType,
} from "./type";

export const getAllExternalEntities = async (
  payLoad?: CreateExternalEntityType,
  perPage: number = 10,
  pageNumber: number = 1
) => {
  try {
    const token = await Storage.getItem(LOCALSTORAGE.ACCESS_TOKEN);
    const httpClient = new HttpClient(ENV.API_URL);

    const searchParams = new URLSearchParams({
      pageNumber: String(pageNumber),
      pageSize: String(perPage),
      orderByColumn: "desc_en",
      sortOrder: "DESC",
    });

    const optionalParams = {
      desc_en: payLoad?.descEn,
      id: payLoad?.externalEntityId,
      email: payLoad?.email,
      is_active:
        payLoad?.isActive === true
          ? "true"
          : payLoad?.isActive === false
          ? "false"
          : undefined,
      fax: payLoad?.fax,
      phone: payLoad?.phone,
      short_name: payLoad?.shortName,
      classify_pick_list_code: payLoad?.classifyPickListCode,
    };

    Object.entries(optionalParams).forEach(([key, value]) => {
      if (value) {
        searchParams.append(key, value);
      }
    });

    const url = `/external-entity/search?${searchParams.toString()}`;

    const response = await httpClient.get<SearchResultType<ExternalEntityType>>(
      url,
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

export const createNewExternalEntity = async (
  payLoad: CreateExternalEntityType
): Promise<any | null> => {
  try {
    const token = await Storage.getItem(LOCALSTORAGE.ACCESS_TOKEN);
    const httpClient = new HttpClient(ENV.API_URL);

    const response = await httpClient.post<any, any>(
      `/external-entity/create`,
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

export const updateExternalEntity = async (
  id: string | number,
  payLoad: CreateExternalEntityType
) => {
  try {
    const token = await Storage.getItem(LOCALSTORAGE.ACCESS_TOKEN);
    const httpClient = new HttpClient(ENV.API_URL);

    const response = await httpClient.put<any, any>(
      `/external-entity/update/${id}`,
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

export const deleteAExternalEntity = async (id: number) => {
  try {
    const token = await Storage.getItem(LOCALSTORAGE.ACCESS_TOKEN);
    const httpClient = new HttpClient(ENV.API_URL);

    const response = await httpClient.delete<any>(
      `/external-entity/delete/${id}`,
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

export const updateTheStatusOfExternalEntity = async (payLoad: any) => {
  try {
    const token = await Storage.getItem(LOCALSTORAGE.ACCESS_TOKEN);
    const httpClient = new HttpClient(ENV.API_URL);

    const response = await httpClient.put<any, any>(
      `/external-entity/update-status`,
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

export const checkIfAlreadyExist = async (key: string, value: string) => {
  try {
    const token = await Storage.getItem(LOCALSTORAGE.ACCESS_TOKEN);
    const httpClient = new HttpClient(ENV.API_URL);

    const response = await httpClient.get<
      DuplicateSearchResultType<DuplicateExternalEntityType>
    >(`/external-entity/check_duplicate?${key}=${value}`, {
      headers: {
        Authorization: token + "",
      },
    });

    return response;
  } catch (error) {
    return ServiceResult.failed(null, "Something went wrong");
  }
};

export const bulkCreateExternalEntity = async (file: File) => {
  try {
    const token = await Storage.getItem(LOCALSTORAGE.ACCESS_TOKEN);
    const httpClient = new HttpClient(ENV.API_URL);

    const formData = new FormData();
    formData.append("file", file);

    const response = await httpClient.post<any, any>(
      `/external-entity/upload`,
      formData,
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

export const downloadEntityTemplate = async () => {
  try {
    const token = await Storage.getItem(LOCALSTORAGE.ACCESS_TOKEN);

    const response = await fetch(
      ENV.API_URL + "/external-entity/download-template?format=xlsx",
      {
        method: "GET",
        headers: {
          Authorization: token + "",
        },
      }
    );

    if (!response.ok) {
      return null;
    }
    const blob = await response.blob();

    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "external_entity.xlsx";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    return blob;
  } catch (error) {
    console.error("Error:", error);
    return null;
  }
};

export const downloadLogFile = async (filename: string) => {
  try {
    const token = await Storage.getItem(LOCALSTORAGE.ACCESS_TOKEN);

    const url =
      ENV.API_URL + `/external-entity/download-log?fileName=${filename}`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: token + "",
      },
    });

    if (!response.ok) {
      return null;
    }
    const textContent = await response.text();

    const blob = new Blob([textContent], { type: "text/plain" });

    const fileURL = window.URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = fileURL;
    link.setAttribute("download", filename);
    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);
    window.URL.revokeObjectURL(fileURL);

    return blob;
  } catch (error) {
    return null;
  }
};
