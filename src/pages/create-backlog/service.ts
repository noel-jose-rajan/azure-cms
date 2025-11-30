import { z } from "zod";
import {
  HttpClient,
  ServiceResult,
} from "../../components/functional/httphelper";
import ENV from "../../constants/env";
import LOCALSTORAGE from "../../constants/local-storage";
import Storage from "../../lib/storage";
import { CorrespondenceDTOType, CorrespondenceType } from "./types";

export const multiInitiatorOUSchema = z.object({
  organizationUnitId: z.number(),
  orgUnitCode: z.string(),
  orgUnitDescAr: z.string(),
  orgUnitDescEn: z.string(),
});

export const multiInitiatorRoleSchema = z.object({
  shown: z.boolean(),
  OrgUnits: z.array(multiInitiatorOUSchema),
});

export type MultiInitiatorOUType = z.infer<typeof multiInitiatorOUSchema>;
export type MultiInitiatorRoleType = z.infer<typeof multiInitiatorRoleSchema>;

export const getMultiInitiatorRole = async () => {
  try {
    let token = await Storage.getItem(LOCALSTORAGE.LEGACY_ACCESS_TOKEN);
    const httpClient = new HttpClient(ENV.API_URL_LEGACY);
    const response = await httpClient.get<MultiInitiatorRoleType>(
      `/user/has-multi-initiation-role/inbound`,
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

export const getCorrespondenceDetails = async (id: string) => {
  try {
    let token = await Storage.getItem(LOCALSTORAGE.LEGACY_ACCESS_TOKEN);
    const httpClient = new HttpClient(ENV.API_URL_LEGACY);
    const response = await httpClient.get<CorrespondenceDTOType>(
      `/correspodence/${id}?isInCreateMode=true`,
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

export const updateDraftCorrespondence = async (
  payLoad: CorrespondenceType
) => {
  try {
    let token = await Storage.getItem(LOCALSTORAGE.LEGACY_ACCESS_TOKEN);
    const httpClient = new HttpClient(ENV.API_URL_LEGACY);
    const response = await httpClient.post<
      CorrespondenceDTOType,
      CorrespondenceType
    >(`/correspodence/in/update`, payLoad, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response;
  } catch (error) {
    return ServiceResult.failed(null, "Something went wrong");
  }
};

export const getAppParameterValues = async (key: string) => {
  try {
    const token = await Storage.getItem(LOCALSTORAGE.LEGACY_ACCESS_TOKEN);

    const httpClient = new HttpClient(ENV.API_URL_LEGACY);
    const response = await httpClient.get<{
      key: string;
      value: string;
    }>(`/application-parameters/get-by-key?key=${key}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response;
  } catch (error) {
    return ServiceResult.failed(null, "Something went wrong");
  }
};
