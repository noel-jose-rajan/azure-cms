import ENV from "../../../constants/env";
import LOCALSTORAGE from "../../../constants/local-storage";
import { HttpClient, ServiceResult } from "../../functional/httphelper";
import Storage from "../../../lib/storage";
import { CreateResponse, DraftCorrespondenceType } from "../outbound/types";

export const uploadOutboundDocument = async (file: File) => {
  try {
    const token = await Storage.getItem(LOCALSTORAGE.ACCESS_TOKEN);
    const httpClient = new HttpClient(ENV.API_URL);

    const formData = new FormData();
    formData.append("file", file as Blob);

    const response = await httpClient.post<
      CreateResponse<DraftCorrespondenceType>,
      any
    >(`/correspondence/create`, formData, {
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

export const uploadNewCorresDocVersion = async (file: File, id: string) => {
  try {
    const token = await Storage.getItem(LOCALSTORAGE.ACCESS_TOKEN);
    const httpClient = new HttpClient(ENV.API_URL);

    const formData = new FormData();
    formData.append("file", file as Blob);
    formData.append("corr_id", id);

    const response = await httpClient.post<
      CreateResponse<DraftCorrespondenceType>,
      any
    >(`/correspondence/create`, formData, {
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
