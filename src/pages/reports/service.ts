import { AxiosRequestConfig } from "axios";
import apiRequest from "../../lib/api";
import Storage from "../../lib/storage";
import LOCALSTORAGE from "../../constants/local-storage";
import ENV from "../../constants/env";
import { ReportFilterState } from "./components/report-filter";

export type ReportExportTypes = "PDF" | "XLSX" | "DOCX" | "RTF";
export interface ReportName {
  reportName: string;
  reportCode:
    | "Repo-routing-to-chart"
    | "Repo-routing-from-chart"
    | "Repo-corres-statistics"
    | "Repo-all-corres-by-type-chart"
    | "Repo-general-corres";
  exportTypes: ReportExportTypes[];
}
export async function getAllReportsName(): Promise<ReportName[] | null> {
  const token = Storage.getItem(LOCALSTORAGE.LEGACY_ACCESS_TOKEN);
  const headers: AxiosRequestConfig["headers"] = {
    Authorization: `Bearer ${token}`,
  };

  try {
    const response = await apiRequest(
      "GET",
      "/reporting-server/api/report/get-all",
      {},
      { headers },
      ENV.API_URL_LEGACY_2
    );

    if (!Array.isArray(response)) return null;

    return response;
  } catch (error) {
    return null;
  }
}

export interface PicklistItem {
  pickListId?: number;
  picklistName?: string;
  picklistCode?: string;
  picklistEnLabel?: string;
  picklistArLabel?: string;
  abbreviation?: string | null;
  orgUnitRoot?: string;
  picklistType?: string;
  isSystem: "true" | "false";
  isActive: "true" | "false";
  links?: any[];
}

export const getPickListsItems = async (
  type: string
): Promise<PicklistItem[] | null> => {
  try {
    const token = await Storage.getItem(LOCALSTORAGE.LEGACY_ACCESS_TOKEN);

    const headers: AxiosRequestConfig["headers"] = {
      Authorization: `Bearer ${token}`,
    };

    const response = await apiRequest(
      "GET",
      `/pick-list/filter?name=${type}&isActive=false`,
      {},
      {
        headers,
      },
      ENV.API_URL_LEGACY
    );

    if (response) {
      return (response as any).content;
    }
    return null;
  } catch (error) {
    return null;
  }
};

export async function generateReport({
  filter,
  reportType,
  exportFileType = "pdf",
}: {
  filter: ReportFilterState | any;
  reportType: string;
  exportFileType?: "pdf" | "XLSX" | "DOCX" | "RTF";
}) {
  try {
    const token = await Storage.getItem(LOCALSTORAGE.LEGACY_ACCESS_TOKEN);

    const headers: AxiosRequestConfig["headers"] = {
      Authorization: `Bearer ${token}`,
    };

    const removeBrackets = (value: any) =>
      value?.toString().replace("[", "").replace("]", "");

    [
      "corrTypeDesc",
      "corrStatusDesc",
      "securityLevelDesc",
      "urgencyLevelDesc",
      "sendingEntityDesc",
      "receivingEntityDesc",
    ].forEach((key) => {
      if (filter[key]) {
        filter[key] = removeBrackets(filter[key]);
      }
    });

    const response = await apiRequest(
      "POST",
      `/reporting-server/api/report/generate?reportCode=${reportType}&exportFileType=${exportFileType}`,
      filter,
      { headers },
      ENV.API_URL_LEGACY_2
    );

    if (response) {
      return response as {
        id: number;
        resultCode: number;
        message: string;
      };
    }
    return null;
  } catch (error) {
    return null;
  }
}

export async function downloadReport({
  filter,
  reportType,
  exportFileType,
}: {
  filter: ReportFilterState | any;
  reportType: string;
  exportFileType: "XLSX" | "DOCX" | "RTF";
}): Promise<void | null> {
  try {
    const token = await Storage.getItem(LOCALSTORAGE.LEGACY_ACCESS_TOKEN);

    if (!token) {
      console.error("No access token found.");
      return null;
    }

    const headers: Record<string, string> = {
      Authorization: `Bearer ${token}`,
      Accept: "application/octet-stream", // Explicitly set for binary data
      "Content-Type": "application/json",
    };

    const removeBrackets = (value: any) =>
      value?.toString().replace("[", "").replace("]", "");

    [
      "corrTypeDesc",
      "corrStatusDesc",
      "securityLevelDesc",
      "urgencyLevelDesc",
      "sendingEntityDesc",
      "receivingEntityDesc",
    ].forEach((key) => {
      if (filter[key]) {
        filter[key] = removeBrackets(filter[key]);
      }
    });

    const response = await fetch(
      `${ENV.API_URL_LEGACY_2}/reporting-server/api/report/generate?reportCode=${reportType}&exportFileType=${exportFileType}`,
      {
        method: "POST",
        headers: headers,
        body: JSON.stringify(filter),
      }
    );

    if (!response.ok) {
      console.error(`Failed to fetch file: ${response.statusText}`);
      return null;
    }

    // Try to extract filename from content-disposition header
    let filename = `downloaded-file.${exportFileType.toLowerCase()}`;
    const contentDisposition = response.headers.get("Content-Disposition");
    if (contentDisposition) {
      const match = contentDisposition.match(/filename="?(.+)"?/);
      if (match) filename = match[1];
    }

    const blob = await response.blob();
    const blobUrl = window.URL.createObjectURL(blob);

    // Trigger file download
    const link = document.createElement("a");
    link.href = blobUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();

    // Cleanup
    document.body.removeChild(link);
    window.URL.revokeObjectURL(blobUrl);
  } catch (error) {
    console.error("Error downloading report:", error);
  }

  return null;
}
