import { CreateOrUpdate } from "./../types/api/index";
import { AxiosRequestConfig } from "axios";
import LOCALSTORAGE from "@/constants/local-storage";
import Storage from "@/lib/storage";
import apiRequest from "@/lib/api";
import ENV from "@/constants/env";
import {
  CreateCorrespondenceType,
  DraftCorrespondenceType,
} from "@/components/services/outbound/types";
import {
  getContentTypeFromExtension,
  getExtensionFromContentType,
} from "@/lib/file/get-file-extention";

export type SendingEntity = {
  entity_code: string;
  id: number;
  name_ar: string;
  name_en: string;
};

export const getSendingEntities = async (): Promise<SendingEntity[] | null> => {
  const token = await Storage.getItem(LOCALSTORAGE.ACCESS_TOKEN);

  const headers: AxiosRequestConfig["headers"] = {
    Authorization: `Bearer ${token}`,
  };
  const response = await apiRequest(
    "GET",
    `/entity/org/sending-entity-list`,
    {},
    { headers },
    ENV.API_URL
  );
  return response?.Data;
};

export type OutboundTemplateType = {
  id: number;
  template_name: string;
};
export const getOutboundTemplates = async (
  id: string | number
): Promise<OutboundTemplateType[] | null> => {
  const token = await Storage.getItem(LOCALSTORAGE.ACCESS_TOKEN);

  const headers: AxiosRequestConfig["headers"] = {
    Authorization: `Bearer ${token}`,
  };
  const response = await apiRequest(
    "GET",
    `/entity/org/templates-list?entity_id=${id}`,
    {},
    { headers },
    ENV.API_URL
  );
  return response?.Data;
};

export const createOutboundDraft = async (
  formdata: FormData
): Promise<CreateOrUpdate | null> => {
  const token = await Storage.getItem(LOCALSTORAGE.ACCESS_TOKEN);

  const headers: AxiosRequestConfig["headers"] = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "multipart/form-data",
  };
  const response = await apiRequest(
    "PUT",
    `/correspondence/outbound/create`,
    formdata,
    { headers },
    ENV.API_URL
  );
  return response;
};

export const createInBoundDraft = async (
  formdata: FormData
): Promise<CreateOrUpdate | null> => {
  const token = await Storage.getItem(LOCALSTORAGE.ACCESS_TOKEN);

  const headers: AxiosRequestConfig["headers"] = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "multipart/form-data",
  };
  const response = await apiRequest(
    "PUT",
    `/correspondence/inbound/create`,
    formdata,
    { headers },
    ENV.API_URL
  );
  return response;
};

export type DraftType = {
  id: number;
  corr_subject: string;
  created_at: string;
};
export type OutboundDraftResponse = {
  Message: string;
  Data: {
    Page: number;
    PerPage: number;
    TotalPages: number;
    Total: number;
    Rows: DraftType[];
  };
  Info: string;
};

export const getDrafts = async (
  type: 1 | 3,
  page: number
): Promise<OutboundDraftResponse> => {
  const token = await Storage.getItem(LOCALSTORAGE.ACCESS_TOKEN);

  const headers: AxiosRequestConfig["headers"] = {
    Authorization: `Bearer ${token}`,
  };
  const response = await apiRequest(
    "GET",
    `/entity/draft?page=${page}&perPage=10&type=${type}`,
    {},
    { headers },
    ENV.API_URL
  );
  return response;
};
export const deleteDraft = async (
  id: string | number
): Promise<CreateOrUpdate> => {
  const token = await Storage.getItem(LOCALSTORAGE.ACCESS_TOKEN);

  const headers: AxiosRequestConfig["headers"] = {
    Authorization: `Bearer ${token}`,
  };
  const response = await apiRequest(
    "DELETE",
    `/correspondence/${id}`,
    null,
    { headers },
    ENV.API_URL
  );
  return response;
};

export const getOutboundDraftById = async (
  id: string | number
): Promise<DraftCorrespondenceType> => {
  const token = await Storage.getItem(LOCALSTORAGE.ACCESS_TOKEN);

  const headers: AxiosRequestConfig["headers"] = {
    Authorization: `Bearer ${token}`,
  };
  const response = await apiRequest(
    "GET",
    `/correspondence/${id}`,
    {},
    { headers },
    ENV.API_URL
  );
  return response;
};

export async function downloadCorrespondenceDocument(
  corrId: string,
  extention: string
) {
  const token = await Storage.getItem(LOCALSTORAGE.ACCESS_TOKEN);
  const request = await fetch(
    ENV.API_URL + `/correspondence/content/${corrId}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!request.ok) {
    throw new Error(`Failed to download template. Status: ${request.status}`);
  }

  const rawBlob = await request.blob();
  const contentType = getContentTypeFromExtension(extention);
  const fileExtension = getExtensionFromContentType(contentType);

  const fileBlob = new Blob([rawBlob], { type: contentType });

  // Create a Blob URL
  const url = window.URL.createObjectURL(fileBlob);

  // Generate a filename based on the templateId and content type
  const filename = `corr document-${corrId}${fileExtension}`;

  // Create an anchor element to trigger the download
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;

  // Programmatically click the link to trigger the download
  link.click();

  // Clean up the Blob URL after a reasonable time
  setTimeout(() => window.URL.revokeObjectURL(url), 60000);

  return fileBlob;
}
export const editDraft = async (
  id: string | number,
  body: Partial<CreateCorrespondenceType>
): Promise<CreateOrUpdate | null> => {
  const token = await Storage.getItem(LOCALSTORAGE.ACCESS_TOKEN);

  const headers: AxiosRequestConfig["headers"] = {
    Authorization: `Bearer ${token}`,
  };
  const response = await apiRequest(
    "POST",
    `/correspondence/outbound/${id}`,
    body,
    { headers },
    ENV.API_URL
  );
  return response;
};

export const editInboundDraft = async (
  id: string | number,
  body: Partial<CreateCorrespondenceType>
): Promise<CreateOrUpdate | null> => {
  const token = await Storage.getItem(LOCALSTORAGE.ACCESS_TOKEN);

  const headers: AxiosRequestConfig["headers"] = {
    Authorization: `Bearer ${token}`,
  };
  const response = await apiRequest(
    "POST",
    `/correspondence/inbound/${id}`,
    body,
    { headers },
    ENV.API_URL
  );
  return response;
};

export type ReceivingEntity = {
  entity_code: string;
  id: number;
  name_ar: string;
  name_en: string;
};
export const getOutboundReceivingEntities = async (
  outbound_type: string | number,
  sending_entity: string | number
): Promise<ReceivingEntity[] | null> => {
  const token = await Storage.getItem(LOCALSTORAGE.ACCESS_TOKEN);

  const headers: AxiosRequestConfig["headers"] = {
    Authorization: `Bearer ${token}`,
  };
  const response = await apiRequest(
    "GET",
    `/entity/org/receiving-entity-list?outbound_type=${outbound_type}&sending_entity_id=${sending_entity}`,
    {},
    { headers },
    ENV.API_URL
  );
  return response?.Data;
};

export type SubmitOutboundPayload = {
  comments?: string;
  data: {
    title_id?: number;
    entity_id?: number;
    notify_me?: boolean;
  };
  id: number;
  user_selected?: number;
};

export const submitOutbound = async (
  id: string | number,
  body: SubmitOutboundPayload
): Promise<CreateOrUpdate | null> => {
  const token = await Storage.getItem(LOCALSTORAGE.ACCESS_TOKEN);

  const headers: AxiosRequestConfig["headers"] = {
    Authorization: `Bearer ${token}`,
  };
  const response = await apiRequest(
    "POST",
    `/task/outbound/start/${id}`,
    body,
    { headers },
    ENV.API_URL
  );
  return response;
};
export const submitInbound = async (
  id: string | number,
  body: SubmitOutboundPayload
): Promise<CreateOrUpdate | null> => {
  const token = await Storage.getItem(LOCALSTORAGE.ACCESS_TOKEN);

  const headers: AxiosRequestConfig["headers"] = {
    Authorization: `Bearer ${token}`,
  };
  const response = await apiRequest(
    "POST",
    `/task/inbound/start/${id}`,
    body,
    { headers },
    ENV.API_URL
  );
  return response;
};
export interface UserTitle {
  id: number;
  user_id: number;
  title_ar: string;
  title_en: string;
  is_default: boolean;
}
export const getUserTitles = async (): Promise<UserTitle[] | null> => {
  const token = await Storage.getItem(LOCALSTORAGE.ACCESS_TOKEN);

  const headers: AxiosRequestConfig["headers"] = {
    Authorization: `Bearer ${token}`,
  };
  const response = await apiRequest(
    "GET",
    `/users/titles`,
    {},
    { headers },
    ENV.API_URL
  );
  return response;
};

export type MultiCorr = {
  id: number;
  correspondence_no: string;
  corr_subject: string;
  receiving_entity_id: number;
  receiving_entity_name: string;
  content_type: string;
  outbound_type_id: number;
};

export const getMultiCorrespondence = async (
  id: string | number
): Promise<MultiCorr[]> => {
  const token = await Storage.getItem(LOCALSTORAGE.ACCESS_TOKEN);
  const lang = await Storage.getItem(LOCALSTORAGE.LANGUAGE);
  const isArabic = lang != "en-INT";
  const headers: AxiosRequestConfig["headers"] = {
    Authorization: `Bearer ${token}`,
  };
  const response = await apiRequest(
    "GET",
    `/correspondence/${id}/children?is_arabic=${isArabic}`,
    {},
    { headers },
    ENV.API_URL
  );
  return response;
};

export const getInboundReceivingEntities = async (): Promise<
  ReceivingEntity[] | null
> => {
  const token = await Storage.getItem(LOCALSTORAGE.ACCESS_TOKEN);

  const headers: AxiosRequestConfig["headers"] = {
    Authorization: `Bearer ${token}`,
  };
  const response = await apiRequest(
    "GET",
    `/correspondence/inbound/create/receiving-list`,
    {},
    { headers },
    ENV.API_URL
  );
  return response?.Data;
};
