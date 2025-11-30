import {
  HttpClient,
  ServiceResult,
} from "../../components/functional/httphelper";
import ENV from "../../constants/env";
import LOCALSTORAGE from "../../constants/local-storage";
import Storage from "../../lib/storage";

export interface InboundCorrListType {
  corrId: string;
  contentRepositoryId: string | null;
  custom6: string;
  custom7: string;
  subject: string;
  fileYear: string;
  createdDate: string;
}

export const getAllInbounds = async () => {
  try {
    let token = Storage.getItem(LOCALSTORAGE.LEGACY_ACCESS_TOKEN);
    const httpClient = new HttpClient(ENV.API_URL_LEGACY);
    const response = await httpClient.get<InboundCorrListType[]>(
      `/correspodence/in/draft`,
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

export const downloadCorrespondenceDoc = async (corrId: string) => {
  try {
    let token = Storage.getItem(LOCALSTORAGE.LEGACY_ACCESS_TOKEN);

    const response = await fetch(
      ENV.API_URL_LEGACY +
      `/correspodence/download?corrId=${corrId}&access_token=${token}`,
      {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    if (!response.ok) {
      return ServiceResult.failed(null, "Something went wrong");
    }
    const blob = await response.blob();

    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = corrId + "_corrId_inbound_document.tif";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    return ServiceResult.success({}, "Api call successfully completed");
  } catch (error) {
    return ServiceResult.failed(null, "Something went wrong");
  }
};

export const deleteADraft = async (payLoad: { corrId: string }[]) => {
  try {
    let token = Storage.getItem(LOCALSTORAGE.LEGACY_ACCESS_TOKEN);
    const httpClient = new HttpClient(ENV.API_URL_LEGACY);
    const response = await httpClient.put(
      `/correspodence/bulk-delete`,
      payLoad,
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
