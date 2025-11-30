import ENV from "../../../constants/env";
import apiRequest from "../../../lib/api";
import { Correspondence, CorrespondenceDTOOutbound } from "../types";
import { AxiosRequestConfig } from "axios";
import Storage from "../../../lib/storage";
import LOCALSTORAGE from "../../../constants/local-storage";
import {
  HttpClient,
  ServiceResult,
} from "../../../components/functional/httphelper";

export class OutboundCorrespondencesUtils {
  static create() {}

  static async createOrUpdateWithTemplate(
    templateId: string,
    token: string,
    corrId?: string
  ): Promise<CorrespondenceDTOOutbound | null> {
    try {
      let url =
        "/correspodence/out/upload-from-templateid?outboundTemplateId=" +
        templateId;

      if (corrId) {
        url += `&corrId=${corrId}`;
      }

      const headers: AxiosRequestConfig["headers"] = {
        Authorization: "Bearer " + token,
      };

      const response = await apiRequest(
        "POST",
        url,
        {},
        { headers },
        ENV.API_URL_LEGACY
      );

      return response;
    } catch (error: unknown) {
      return null;
    }
  }

  static getCorrespondenceDetails = async (id: string) => {
    try {
      const token = await Storage.getItem(LOCALSTORAGE.ACCESS_TOKEN);
      const httpClient = new HttpClient(ENV.API_URL);

      const response = await httpClient.get<any>(
        `/correspondence/fetch/${id}`,
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

  static async update(
    correspodence: Correspondence,
    token: string
  ): Promise<CorrespondenceDTOOutbound | null> {
    try {
      let url = "/correspodence/out/update";

      const headers: AxiosRequestConfig["headers"] = {
        Authorization: "Bearer " + token,
      };

      const response = await apiRequest(
        "POST",
        url,
        {
          ...correspodence,
          correspondenceDTO: {
            ...correspodence.correspondenceDTO,
            remarks: Array.isArray(correspodence.correspondenceDTO.remarks)
              ? correspodence.correspondenceDTO.remarks
              : [correspodence.correspondenceDTO.remarks],
          },
        },
        { headers },
        ENV.API_URL_LEGACY
      );

      return response;
    } catch (error: unknown) {
      return null;
    }
  }

  static async deleteCorresponcence(correspodenceId: string, token: string) {
    try {
      let url = "/correspodence/bulk-delete";

      const headers: AxiosRequestConfig["headers"] = {
        Authorization: "Bearer " + token,
      };

      const response = await apiRequest(
        "PUT",
        url,
        [{ corrId: correspodenceId }],
        { headers },
        ENV.API_URL_LEGACY
      );

      return response;
    } catch (error: unknown) {
      return null;
    }
  }
}
