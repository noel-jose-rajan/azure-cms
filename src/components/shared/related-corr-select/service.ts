import { RelatedCorr } from "@/components/services/outbound/types";
import ENV from "@/constants/env";
import LOCALSTORAGE from "@/constants/local-storage";
import apiRequest from "@/lib/api";
import Storage from "@/lib/storage";
import { AxiosRequestConfig } from "axios";

export interface FilterCorrespondencePayload {
  corr_language_id: number;
  corr_status_id: number;
  corr_subject: string;
  corr_type_id: number;
  correspondence_date_from: string;
  correspondence_date_to: string;
  correspondence_no: string;
  doc_type_id: number;
  external_reference_no: string;
  has_attachment: boolean;
  is_arabic: boolean;
  is_sort_desc: boolean;
  keywords: string[];
  owner_id: number;
  receiving_entity_id: number;
  remarks: string;
  security_level_id: number;
  sending_entity_id: number;
  sort_by: string;
  urgency_id: number;
  approved_only?: boolean; // for related corr
}

export interface CorrespondenceFilterResponse {
  data: CorrespondenceFilterResult[];
  is_sort_desc: boolean;
  page: number;
  sort_by: string;
  total_group_by: TotalGroupBy;
  total_pages: number;
  total_records: number;
}

export interface CorrespondenceFilterResult {
  corr_status_id: number;
  corr_subject: string;
  corr_type_id: number;
  correspondence_date: string;
  correspondence_no: string;
  created_at: string;
  has_attachment: boolean;
  id: number;
  is_multi_receiving: boolean;
  owner_id: number;
  owner_name: string;
  receiving_entities: string[];
  receiving_entities_id: number[];
  receiving_entity: string;
  receiving_entity_id: number;
  security_level_id: number;
  sending_entity: string;
  sending_entity_id: number;
  urgency_id: number;
}

export interface TotalGroupBy {
  additionalProp1: number;
  additionalProp2: number;
  additionalProp3: number;
}

export const filterCorrespondence = async (
  body: Partial<FilterCorrespondencePayload>,
  page: number,
  perPage = 4
): Promise<CorrespondenceFilterResponse> => {
  const token = await Storage.getItem(LOCALSTORAGE.ACCESS_TOKEN);

  const headers: AxiosRequestConfig["headers"] = {
    Authorization: `Bearer ${token}`,
  };

  const response = await apiRequest(
    "POST",
    "/correspondence/filter?page=" + page + "&perPage=" + perPage,
    body,
    { headers },
    ENV.API_URL
  );
  return response;
};

export const getRelatedCorrespondence = async (
  id: number | string
): Promise<RelatedCorr[]> => {
  const token = await Storage.getItem(LOCALSTORAGE.ACCESS_TOKEN);

  const headers: AxiosRequestConfig["headers"] = {
    Authorization: `Bearer ${token}`,
  };

  const response = await apiRequest(
    "GET",
    `/correspondence/${id}/related`,
    {},
    { headers },
    ENV.API_URL
  );
  return response;
};
