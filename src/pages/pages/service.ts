import ENV from "@/constants/env";
import LOCALSTORAGE from "@/constants/local-storage";
import apiRequest from "@/lib/api";
import Storage from "@/lib/storage";
import { AxiosRequestConfig } from "axios";
import { z } from "zod";

// filepath: d:\cms\react cms cg\cms-cg-react-web\src\pages\pages\sla\components\table\schema.ts
export const slaSchema = z.object({
  corr_no: z.string().optional(),
  corr_subject: z.string().optional(),
  corr_type: z.number().optional(),
  id: z.number().optional(),
  name: z.string().min(1),
  order_by: z.coerce.number().int().min(1),
  org_unit: z.number().optional(),
  security_level: z.number().optional(),
  sla_time: z.coerce.number().int().min(1),
  sla_time_type: z.number().min(1),
  urgency_level: z.number().optional(),
});
export type SlaType = z.infer<typeof slaSchema>;
export const fetchSlaList = async (): Promise<SlaType[]> => {
  const token = await Storage.getItem(LOCALSTORAGE.ACCESS_TOKEN);

  const headers: AxiosRequestConfig["headers"] = {
    Authorization: `Bearer ${token}`,
  };
  const response = await apiRequest(
    "GET",
    `/sla`,
    {},
    { headers },
    ENV.API_URL
  );
  return response;
};
export const createSla = async (body: SlaType) => {
  const token = await Storage.getItem(LOCALSTORAGE.ACCESS_TOKEN);

  const headers: AxiosRequestConfig["headers"] = {
    Authorization: `Bearer ${token}`,
  };
  const response = await apiRequest(
    "PUT",
    `/sla`,
    body,
    { headers },
    ENV.API_URL
  );
  return response;
};
export const updateSla = async (id: string | number, body: SlaType) => {
  const token = await Storage.getItem(LOCALSTORAGE.ACCESS_TOKEN);

  const headers: AxiosRequestConfig["headers"] = {
    Authorization: `Bearer ${token}`,
  };
  const response = await apiRequest(
    "POST",
    `/sla/${id}`,
    body,
    { headers },
    ENV.API_URL
  );
  return response;
};
export const deleteSla = async (id: string | number) => {
  const token = await Storage.getItem(LOCALSTORAGE.ACCESS_TOKEN);

  const headers: AxiosRequestConfig["headers"] = {
    Authorization: `Bearer ${token}`,
  };
  const response = await apiRequest(
    "DELETE",
    `/sla/${id}`,
    {},
    { headers },
    ENV.API_URL
  );
  return response;
};
