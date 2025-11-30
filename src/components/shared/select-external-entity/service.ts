import { AxiosRequestConfig } from "axios";
import LOCALSTORAGE from "@/constants/local-storage";
import Storage from "@/lib/storage";
import apiRequest from "@/lib/api";
import ENV from "@/constants/env";
import { ExternalEntity } from "@/pages/external-entity/service";
import { CreateOrUpdate } from "../types/api";

export const getAllExternalEntities = async (): Promise<ExternalEntity[]> => {
  const token = await Storage.getItem(LOCALSTORAGE.ACCESS_TOKEN);

  const headers: AxiosRequestConfig["headers"] = {
    Authorization: `Bearer ${token}`,
  };
  const response = await apiRequest(
    "GET",
    "/entity/external/findAll",
    {},
    { headers },
    ENV.API_URL
  );
  return response?.Data;
};

export const getExternalEntityById = async (
  id: number | string
): Promise<ExternalEntity | null> => {
  const token = await Storage.getItem(LOCALSTORAGE.ACCESS_TOKEN);

  const headers: AxiosRequestConfig["headers"] = {
    Authorization: `Bearer ${token}`,
  };
  const response = await apiRequest(
    "GET",
    `/entity/external/${id}`,
    {},
    { headers },
    ENV.API_URL
  );
  return response?.Data;
};

export const createExternalEntity = async (
  payload: ExternalEntity
): Promise<CreateOrUpdate | null> => {
  const token = await Storage.getItem(LOCALSTORAGE.ACCESS_TOKEN);

  const headers: AxiosRequestConfig["headers"] = {
    Authorization: `Bearer ${token}`,
  };
  const response = await apiRequest(
    "PUT",
    `/entity/external`,
    payload,
    { headers },
    ENV.API_URL
  );
  return response;
};

export type UpdateExternalEntityPayload = Partial<ExternalEntity>;
export const editExternalEntity = async (
  id: string | number,
  payload: UpdateExternalEntityPayload
): Promise<CreateOrUpdate | null> => {
  const token = await Storage.getItem(LOCALSTORAGE.ACCESS_TOKEN);

  const headers: AxiosRequestConfig["headers"] = {
    Authorization: `Bearer ${token}`,
  };
  const response = await apiRequest(
    "POST",
    `/entity/external/${id}`,
    payload,
    { headers },
    ENV.API_URL
  );
  return response;
};
