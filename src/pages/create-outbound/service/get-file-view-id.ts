import { AxiosRequestConfig } from "axios";
import ENV from "../../../constants/env";
import LOCALSTORAGE from "../../../constants/local-storage";
import apiRequest from "../../../lib/api";
import Storage from "../../../lib/storage";
import { urlBuilder } from "../../../lib/helper/urlBuilder";

const legacyToken = Storage.getItem(LOCALSTORAGE.LEGACY_ACCESS_TOKEN);

interface Response {
  id: number;
  resultCode: number;
  message: string;
}

export async function getFileVIewId(
  corrId: string,
  contentRepositoryId: string,
  sendingEntity: string
): Promise<Response | null> {
  const query = urlBuilder({
    correspondenceId: corrId,
    contentRepositoryId,
    sendingEntity,
  });

  const url = `/document/view?` + query;

  const headers: AxiosRequestConfig["headers"] = {
    Authorization: `Bearer ${legacyToken}`,
  };

  try {
    const response = await apiRequest(
      "GET",
      url,
      {},
      { headers },
      ENV.API_URL_LEGACY
    );

    return response;
  } catch (error) {
    return null;
  }
}
