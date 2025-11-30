import { CreateOrUpdate } from "@/components/shared/types/api";
import ENV from "@/constants/env";
import LOCALSTORAGE from "@/constants/local-storage";
import apiRequest from "@/lib/api";
import Storage from "@/lib/storage";
import { AxiosRequestConfig } from "axios";
import { CreatePhysicalAttachmentType } from "../schema";
import {
  getContentTypeFromExtension,
  getExtensionFromContentType,
} from "@/lib/file/get-file-extention";

export const getAttachmentById = async (id: string | number): Promise<any> => {
  const token = await Storage.getItem(LOCALSTORAGE.ACCESS_TOKEN);

  const headers: AxiosRequestConfig["headers"] = {
    Authorization: `Bearer ${token}`,
  };
  const response = await apiRequest(
    "GET",
    `/correspondence/${id}/attachments`,
    {},
    { headers },
    ENV.API_URL
  );
  return response?.Data;
};

export const addElectronicAttachment = async (
  id: string | number,
  formdata: FormData
): Promise<CreateOrUpdate | null> => {
  const token = await Storage.getItem(LOCALSTORAGE.ACCESS_TOKEN);

  const headers: AxiosRequestConfig["headers"] = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "multipart/form-data",
  };
  const response = await apiRequest(
    "PUT",
    `/correspondence/${id}/attachment`,
    formdata,
    { headers },
    ENV.API_URL
  );
  return response;
};

export const deleteElectronicAttachment = async (
  id: string | number
): Promise<CreateOrUpdate | null> => {
  const token = await Storage.getItem(LOCALSTORAGE.ACCESS_TOKEN);

  const headers: AxiosRequestConfig["headers"] = {
    Authorization: `Bearer ${token}`,
  };
  const response = await apiRequest(
    "DELETE",
    `/correspondence/attachment/${id}`,
    {},
    { headers },
    ENV.API_URL
  );
  return response;
};

export async function downloadElectronicAttachment(
  id: number | string,
  filename: string,
  fileExtension: string
) {
  try {
    const token = await Storage.getItem(LOCALSTORAGE.ACCESS_TOKEN);
    const request = await fetch(
      ENV.API_URL + `/correspondence/attachment/${id}/content`,
      {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    if (!request.ok) {
      throw new Error(`Failed to download template. Status: ${request.status}`);
    }

    const contentType = getContentTypeFromExtension(fileExtension);
    // Get the response as a Blob
    const rawBlob = await request.blob();

    const fileBlob = new Blob([rawBlob], { type: contentType });

    const url = window.URL.createObjectURL(fileBlob);

    const link = document.createElement("a");
    link.href = url;
    link.download = filename + fileExtension;

    link.click();

    setTimeout(() => window.URL.revokeObjectURL(url), 60000);

    return fileBlob;
  } catch (error) {
    console.error("Error downloading template:", error);
    return false;
  }
}

export const getPhysicalAttachmentById = async (
  id: string | number
): Promise<any> => {
  const token = await Storage.getItem(LOCALSTORAGE.ACCESS_TOKEN);

  const headers: AxiosRequestConfig["headers"] = {
    Authorization: `Bearer ${token}`,
  };
  const response = await apiRequest(
    "GET",
    `/correspondence/${id}/physical-attachments`,
    {},
    { headers },
    ENV.API_URL
  );
  return response?.Data;
};

export const addNewPhysicalAttachment = async (
  id: string | number,
  body: Partial<CreatePhysicalAttachmentType>
): Promise<CreateOrUpdate | null> => {
  const token = await Storage.getItem(LOCALSTORAGE.ACCESS_TOKEN);

  const headers: AxiosRequestConfig["headers"] = {
    Authorization: `Bearer ${token}`,
  };
  const response = await apiRequest(
    "PUT",
    `/correspondence/${id}/physical-attachment`,
    { ...body, quantity: Number(body.quantity) },
    { headers },
    ENV.API_URL
  );
  return response;
};

export const deletePhysicalAttachment = async (
  id: string | number
): Promise<CreateOrUpdate | null> => {
  const token = await Storage.getItem(LOCALSTORAGE.ACCESS_TOKEN);

  const headers: AxiosRequestConfig["headers"] = {
    Authorization: `Bearer ${token}`,
  };
  const response = await apiRequest(
    "DELETE",
    `/correspondence/physical-attachment/${id}`,
    {},
    { headers },
    ENV.API_URL
  );
  return response;
};
