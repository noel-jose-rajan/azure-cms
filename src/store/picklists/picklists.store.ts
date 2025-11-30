export type PicklistKeys =
  | "Correspondence Type"
  | "Status"
  | "History Status"
  | "Security Level"
  | "Urgency Level"
  | "Required Action"
  | "External Entity Classification"
  | "Document Type"
  | "Physical Attachment Type"
  | "Escalation Performer"
  | "outbound sending type"
  | "Approval subtype"
  | "outbound types"
  | "Stamp Options"
  | "Inbound Source"
  | "Rejection Reason"
  | "Language"
  | "Task Subject"
  | "Org Unit Level"
  | "Entity Type"
  | "ORG ALLOW"
  | "ORG ALLOW ALL"
  | "ORG ALLOW NONE"
  | "ORG ALLOW SELECTIVE"
  | "ACTIONS"
  | "PROCESS_TYPE"
  | "DelegationStatus";

import { create } from "zustand";
import { PickList } from "@/components/services/picklist/type";
import LOCALSTORAGE from "@/constants/local-storage";
import Storage from "@/lib/storage";
import { AxiosRequestConfig } from "axios";
import apiRequest from "@/lib/api";
import ENV from "@/constants/env";
type PicklistGrouped = Record<PicklistKeys, PickList[] | null>;
interface PicklistsState {
  picklists: PicklistGrouped;
  loading: boolean;
  error: string | null;
  isFetched: boolean;
  fetchAllPicklists: () => Promise<void>;
  refreshAllPicklists: () => Promise<void>;
  setGroupedPicklists: (data: PickList[]) => void;
  getPicklistById: (
    picklistName: PicklistKeys,
    id: string | number
  ) => PickList | null;
}
export const usePicklistStore = create<PicklistsState>((set, get) => ({
  picklists: {
    "Correspondence Type": null,
    Status: null,
    "History Status": null,
    "Security Level": null,
    "Urgency Level": null,
    "Required Action": null,
    "External Entity Classification": null,
    "Document Type": null,
    "Physical Attachment Type": null,
    "Escalation Performer": null,
    "outbound sending type": null,
    "Approval subtype": null,
    "outbound types": null,
    "Stamp Options": null,
    "Inbound Source": null,
    "Rejection Reason": null,
    Language: null,
    "Task Subject": null,
    "Org Unit Level": null,
    "Entity Type": null,
    "ORG ALLOW": null,
    "ORG ALLOW ALL": null,
    "ORG ALLOW NONE": null,
    "ORG ALLOW SELECTIVE": null,
    ACTIONS: null,
    PROCESS_TYPE: null,
    DelegationStatus: null,
  },
  loading: false,
  error: null,
  isFetched: false,
  picklistsGrouped: {},
  fetchAllPicklists: async () => {
    if (get().isFetched) return;
    set({ loading: true, error: null, isFetched: true });
    try {
      const res = await getAllPicklist();
      get().setGroupedPicklists(res);
      set({ loading: false, error: null, isFetched: false });
    } catch (error) {
      console.error("Error fetching picklists:", error);
      set({
        loading: false,
        error: "Failed to fetch picklists",
        isFetched: false,
      });
    }
  },
  setGroupedPicklists: (data) => {
    const grouped = data.reduce((acc, item) => {
      const key = item.picklist_name as PicklistKeys;
      if (!acc[key]) acc[key] = [];
      acc[key].push(item);
      return acc;
    }, {} as PicklistGrouped);

    set({ picklists: grouped });
  },
  refreshAllPicklists: async () => {
    set({ loading: true, error: null, isFetched: false });
    await get().fetchAllPicklists();
  },
  getPicklistById: (picklistName, id) => {
    if (!id) return null;
    const picklists = get().picklists[picklistName];
    return (
      picklists?.find((item) => item?.picklist_id?.toString() == id) || null
    );
  },
}));

const getAllPicklist = async (): Promise<PickList[]> => {
  const token = await Storage.getItem(LOCALSTORAGE.ACCESS_TOKEN);

  const headers: AxiosRequestConfig["headers"] = {
    Authorization: `Bearer ${token}`,
  };

  const response = await apiRequest(
    "GET",
    "/picklist/findAll",
    {},
    { headers },
    ENV.API_URL
  );
  return response;
};
