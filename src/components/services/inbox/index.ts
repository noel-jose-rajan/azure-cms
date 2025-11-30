import { AxiosRequestConfig } from "axios";
import ENV from "../../../constants/env";
import LOCALSTORAGE from "../../../constants/local-storage";
import Storage from "../../../lib/storage";
import apiRequest from "@/lib/api";
import { SearchInboxType } from "@/pages/inbox/types";
import { CreateOrUpdate } from "@/components/shared/types/api";
import {
  getContentTypeFromExtension,
  getExtensionFromContentType,
} from "@/lib/file/get-file-extention";

export type InboxTask = {
  delegation_id: number;
  acquired_date: string;
  assignee: number;
  assignee_entity: number;
  corr_subject: string;
  correspondence_id: number;
  correspondence_no: string;
  correspondence_type: number;
  direct_to_user: boolean;
  from_entity_id: number;
  from_entity_name: string;
  from_user_id: number;
  from_user_name: string;
  id: number;
  comments: string;
  process_type_id: number;
  routing_id: null;
  security_level_id: number;
  status: number;
  task_date: string;
  task_due_date: string;
  task_flag: null;
  task_status_id: number;
  task_type_id: number;
  to_entity_id: number;
  to_entity_name: string;
  to_user_id: null;
  urgency_id: number;
  is_acquired: boolean;
  corr_sending_id: number;
  corr_receiving_id: number;
  corr_sending_name: string;
  corr_receiving_name: string;
};

export type InboxResponseType = {
  data: InboxTask[];
  total_records: number;
  total_group_by: Record<number, number>;
};

export const getAllInboxCorrespondences = async (
  page: string | number,
  body: SearchInboxType
): Promise<InboxResponseType> => {
  const token = await Storage.getItem(LOCALSTORAGE.ACCESS_TOKEN);
  const lang = await Storage.getItem(LOCALSTORAGE.LANGUAGE);

  const headers: AxiosRequestConfig["headers"] = {
    Authorization: `Bearer ${token}`,
  };

  console.log({ lang });
  const response = await apiRequest(
    "POST",
    `/task/inbox?page=${page}&page_size=10`,
    {
      is_sort_desc: true,
      ...body,
      arabic: lang != "en-INT",
    } as SearchInboxType,
    { headers },
    ENV.API_URL
  );
  return response;
};

export const getTaskDetailsById = async (
  id: string | number
): Promise<InboxTask> => {
  const token = await Storage.getItem(LOCALSTORAGE.ACCESS_TOKEN);

  const headers: AxiosRequestConfig["headers"] = {
    Authorization: `Bearer ${token}`,
  };

  const response = await apiRequest(
    "GET",
    `/task/${id}`,
    {},
    { headers },
    ENV.API_URL
  );
  return response;
};

export type ActionType = {
  ENTITY: string;
  ROLE: string;
  TYPE: string;
};
export type Actions = {
  ID: number;
  action: ActionType;
  comment_required: boolean;
};

export const getTaskActions = async (
  id: string | number
): Promise<Actions[]> => {
  const token = await Storage.getItem(LOCALSTORAGE.ACCESS_TOKEN);

  const headers: AxiosRequestConfig["headers"] = {
    Authorization: `Bearer ${token}`,
  };

  const response = await apiRequest(
    "GET",
    `/task/${id}/actions`,
    {},
    { headers },
    ENV.API_URL
  );
  return response?.Data || [];
};

export type CompleteTaskPayload = {
  comments: string;
  data: Record<string, any>;
  id: number;
  user_selected?: number;
};

export const completeTask = async (
  id: string | number,
  payload: CompleteTaskPayload
): Promise<CreateOrUpdate> => {
  const token = await Storage.getItem(LOCALSTORAGE.ACCESS_TOKEN);

  const headers: AxiosRequestConfig["headers"] = {
    Authorization: `Bearer ${token}`,
  };

  const response = await apiRequest(
    "POST",
    `/task/complete/${id}`,
    payload,
    { headers },
    ENV.API_URL
  );
  return response || [];
};

export const acquireTask = async (
  id: string | number
): Promise<CreateOrUpdate> => {
  const token = await Storage.getItem(LOCALSTORAGE.ACCESS_TOKEN);

  const headers: AxiosRequestConfig["headers"] = {
    Authorization: `Bearer ${token}`,
  };

  const response = await apiRequest(
    "GET",
    `/task/acquire/${id}`,
    {},
    { headers },
    ENV.API_URL
  );
  return response || [];
};

export type VersionDocType = {
  id: string;
  modified_at: string;
  name: string;
};
export const getAllCorrespondenceVersions = async (
  id: string | number
): Promise<VersionDocType[]> => {
  const token = await Storage.getItem(LOCALSTORAGE.ACCESS_TOKEN);

  const headers: AxiosRequestConfig["headers"] = {
    Authorization: `Bearer ${token}`,
  };

  const response = await apiRequest(
    "GET",
    `/correspondence/${id}/versions`,
    {},
    { headers },
    ENV.API_URL
  );
  return response || [];
};

export async function downloadCorrespondenceVersion(
  corrId: string | number,
  id: string,
  filename: string
) {
  try {
    const token = await Storage.getItem(LOCALSTORAGE.ACCESS_TOKEN);
    const request = await fetch(
      ENV.API_URL + `/correspondence/content/${corrId}?version_id=${id}`,
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
    const contentType = getContentTypeFromExtension(
      filename.split(".").pop() || ""
    );

    const fileBlob = new Blob([rawBlob], { type: contentType });
    const url = window.URL.createObjectURL(fileBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;

    link.click();

    setTimeout(() => window.URL.revokeObjectURL(url), 60000);

    return fileBlob;
  } catch (error) {
    console.error("Error downloading template:", error);
    return false;
  }
}

export type FollowUpType = {
  process_type_id: number;
  task_type_id: number;
  task_date: string;
  from_user_id: number;
  from_user_name: string;
  assignee_entity: number;
  assignee_name: string;
  task_due_date: string;
};
export const getCorrespondenceFollowUp = async (
  id: string | number
): Promise<FollowUpType[]> => {
  const token = await Storage.getItem(LOCALSTORAGE.ACCESS_TOKEN);

  const headers: AxiosRequestConfig["headers"] = {
    Authorization: `Bearer ${token}`,
  };

  const response = await apiRequest(
    "GET",
    `/correspondence/${id}/followup`,
    {},
    { headers },
    ENV.API_URL
  );
  return response || [];
};

export interface Routes {
  id: number;
  corr_id: number;
  perfomer_id: number;
  route_date: string;
  type_id: number;
  urgency_level_id: number;
  status_id: number;
  reply_date: any;
  reply_comment: any;
  comments: string;
  parent_id: number;
  from_entity_id: number;
  to_entity_id: number;
  to_user_id: number;
  created_at: string;
  reply_performer: string;
  required_action: number;
  is_to_entity: boolean;
  performer_name: string;
  from_entity_name: string;
  to_entity_name: string;
  children: Routes[];
}

export const getCorrespondenceRoutes = async (
  id: string | number
): Promise<Routes[] | undefined> => {
  const token = await Storage.getItem(LOCALSTORAGE.ACCESS_TOKEN);

  const headers: AxiosRequestConfig["headers"] = {
    Authorization: `Bearer ${token}`,
  };

  const response = await apiRequest(
    "GET",
    `/correspondence/${id}/routes`,
    {},
    { headers },
    ENV.API_URL
  );

  if (response && Array.isArray(response)) {
    return treeify(response);
  }
  return response || [];
};

function treeify(data: Routes[]) {
  const map = new Map();
  const roots: Routes[] = [];

  data.forEach((item) => {
    map.set(item.id, { ...item, children: [] });
  });

  data.forEach((item) => {
    if (item.parent_id === null) {
      roots.push(map.get(item.id));
    } else {
      const parent = map.get(item.parent_id);
      if (parent) {
        parent.children.push(map.get(item.id));
      }
    }
  });
  return roots;
}

export interface InboxDelegation {
  date_from: string;
  date_to: string;
  delegate_from_name: string;
  delegate_from_user_id: number;
  id: number;
}

export const checkHasDelegation = async (
  is_arabic: boolean
): Promise<InboxDelegation[]> => {
  const token = await Storage.getItem(LOCALSTORAGE.ACCESS_TOKEN);

  const headers: AxiosRequestConfig["headers"] = {
    Authorization: `Bearer ${token}`,
  };

  const response = await apiRequest(
    "GET",
    `/delegation/in-progress?is_arabic=${is_arabic}`,
    {},
    { headers },
    ENV.API_URL
  );
  return response || [];
};

export interface InboxDelegationDetailsType {
  ID: number;
  DelegationId: number;
  CreatedByID: number;
  DelegatorUserID: number;
  DelegatorUserName: string;
  DateFrom: string;
  DateTo: string;
  StatusID: number;
  DelegateAll: boolean;
  DelegationToId: number;
  DelegationToName: string;
}

export const getInboxDelegationDetails = async (
  id: string | number,
  isArabic: boolean
): Promise<InboxDelegationDetailsType> => {
  const token = await Storage.getItem(LOCALSTORAGE.ACCESS_TOKEN);

  const headers: AxiosRequestConfig["headers"] = {
    Authorization: `Bearer ${token}`,
  };

  const response = await apiRequest(
    "GET",
    `/delegation/user/${id}?is_arabic=${isArabic}`,
    {},
    { headers },
    ENV.API_URL
  );
  return response;
};
