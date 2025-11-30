import apiRequest from "../../../lib/api";
import {
  CorrespondenceDTOType,
  FileCreateResponseType,
} from "../../../pages/create-backlog/types";
import { HttpClient, ServiceResult } from "../../functional/httphelper";

export const ALFRESCO_API_URL =
  "http://37.34.239.150:8980/alfresco/api/-default-/public/alfresco/versions/1";

export const encodeToBase64 = (value: string) => {
  return btoa(value);
};

export const getContractDocumentTypes = async () => {
  try {
    const encodedValue = encodeToBase64("admin:admin");

    const response = await apiRequest(
      "GET",
      `/types`,
      {
        query: {
          language: "CMIS",
          query: "SELECT * FROM dms:invoice_details",
        },
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ${encodedValue}`,
        },
      },
      ALFRESCO_API_URL
    );

    if (response) {
      return response;
    }

    return null;
  } catch (error) {
    return null;
  }
};

export const createAContractDocument = async (file: File, payLoad?: any) => {
  try {
    const encodedValue = encodeToBase64("admin:admin");
    const fileExtension = file.name.split(".").pop();

    const jsonPayload = {
      name: fileExtension
        ? payLoad?.archieve_number + "." + fileExtension
        : "contract2.pdf",
      nodeType:
        payLoad.backlogNodeType === "contract"
          ? "dms:Contract"
          : payLoad.backlogNodeType === "memo"
          ? "gen:memo"
          : payLoad.backlogNodeType === "mom"
          ? "gen:mom"
          : "",
      properties: {
        "dms:archieve_number": payLoad?.archieve_number,
        "dms:document_title": payLoad?.document_title,
        "dms:file_date": payLoad?.file_date
          ? new Date(payLoad?.file_date).toISOString()
          : new Date().toISOString(),
        "dms:file_type": payLoad?.file_type,
        "dms:trading_id": payLoad?.trading_id,
      },
      permissions: {
        isInheritanceEnabled: true,
      },
    };

    const httpClient = new HttpClient(ALFRESCO_API_URL);
    const response = await httpClient.post<FileCreateResponseType, any>(
      `/nodes/-shared-/children`,
      jsonPayload,
      {
        headers: {
          Authorization: `Basic ${encodedValue}`,
        },
      }
    );

    return response;
  } catch (error) {
    return ServiceResult.failed(null, "Something went wrong");
  }
};

export const uploadAContractDocument = async (file: File, id: string) => {
  try {
    const encodedValue = encodeToBase64("admin:admin");
    const fileData = await file.arrayBuffer();

    const httpClient = new HttpClient(ALFRESCO_API_URL);
    const response = await httpClient.put<FileCreateResponseType, any>(
      `/nodes/${id}/content`,
      fileData,
      {
        headers: {
          Authorization: `Basic ${encodedValue}`,
        },
      }
    );

    return response;
  } catch (error) {
    return ServiceResult.failed(null, "Something went wrong");
  }
};

export const createACorrespondenceDocument = async (
  file: File,
  folderId: string,
  metaData?: CorrespondenceDTOType
) => {
  try {
    const encodedValue = encodeToBase64("admin:admin");
    const fileExtension = file.name.split(".").pop();
    const rawBody = {
      name: fileExtension
        ? `${
            metaData?.correspondence_number ?? "correspondence"
          }.${fileExtension}`
        : "correspondence.pdf",
      nodeType: "cmd:Inbound",
      aspectNames: [],
      properties: {
        "cmd:subject": metaData?.subject,
        "cmd:sending_entity": metaData?.sending_entity,
        "cmd:urgency_level": metaData?.urgency_level,
        "cmd:document_type": metaData?.document_type,
        "cmd:language": metaData?.language,
        "cmd:correspondance_type": metaData?.correspondance_type,
      },
      permissions: {
        isInheritanceEnabled: true,
      },
    };

    const httpClient = new HttpClient(ALFRESCO_API_URL);
    const response = await httpClient.post<FileCreateResponseType, any>(
      `/nodes/${folderId}/children`,
      rawBody,
      {
        headers: {
          Authorization: `Basic ${encodedValue}`,
        },
      }
    );

    return response;
  } catch (error) {
    return ServiceResult.failed(null, "Something went wrong");
  }
};