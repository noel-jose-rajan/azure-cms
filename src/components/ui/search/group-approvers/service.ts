import { AxiosRequestConfig } from "axios";
import ENV from "../../../../constants/env";
import LOCALSTORAGE from "../../../../constants/local-storage";
import apiRequest from "../../../../lib/api";
import Storage from "../../../../lib/storage";
import { ApproverUser, ApproverUserOugUnit } from "./types";

export async function getApproverOrgUnits(
  sendingOrgCode: string
): Promise<ApproverUserOugUnit[] | null> {
  try {
    const token = await Storage.getItem(LOCALSTORAGE.LEGACY_ACCESS_TOKEN);
    const headers: AxiosRequestConfig["headers"] = {
      Authorization: `Bearer ${token}`,
    };

    const response = await apiRequest(
      "GET",
      "/approve-outbound/approver-org-units?sendingOrgCode=" + sendingOrgCode,
      {},
      { headers },
      ENV.API_URL_LEGACY
    );

    return response;
  } catch (error) {
    return null;
  }
}

export async function getApproverUsers(
  sendingOrgCode: string,
  securityLevelCode: string
): Promise<ApproverUser[] | null> {
  try {
    const token = await Storage.getItem(LOCALSTORAGE.LEGACY_ACCESS_TOKEN);
    const headers: AxiosRequestConfig["headers"] = {
      Authorization: `Bearer ${token}`,
    };

    const response = await apiRequest(
      "GET",
      `/approve-outbound/approver-users?orgUnitCode=${sendingOrgCode}&securityLevelCode=${securityLevelCode}`,
      {},
      { headers },
      ENV.API_URL_LEGACY
    );

    return response;
  } catch (error) {
    return null;
  }
}
