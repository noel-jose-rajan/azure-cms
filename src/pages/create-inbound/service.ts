import { z } from "zod";
import {
  HttpClient,
  ServiceResult,
} from "../../components/functional/httphelper";
import ENV from "../../constants/env";
import LOCALSTORAGE from "../../constants/local-storage";
import Storage from "../../lib/storage";
import {
  AttachmentHistoryType,
  CorrespondenceDTOType,
  CorrespondenceType,
  CreatePhysicalAttachmentType,
  ElectronicAttachmentType,
  PhysicalAttachmentsType,
  UpdateElectronicAttachmentType,
} from "./types";
import { AxiosRequestConfig } from "axios";
import apiRequest from "../../lib/api";

export const multiInitiatorOUSchema = z.object({
  organizationUnitId: z.number(),
  orgUnitCode: z.string(),
  orgUnitDescAr: z.string(),
  orgUnitDescEn: z.string(),
});

export const multiInitiatorRoleSchema = z.object({
  shown: z.boolean(),
  OrgUnits: z.array(multiInitiatorOUSchema),
});

export type MultiInitiatorOUType = z.infer<typeof multiInitiatorOUSchema>;
export type MultiInitiatorRoleType = z.infer<typeof multiInitiatorRoleSchema>;

let token = Storage.getItem(LOCALSTORAGE.LEGACY_ACCESS_TOKEN);

export const getMultiInitiatorRole = async () => {
  try {
    let token = Storage.getItem(LOCALSTORAGE.LEGACY_ACCESS_TOKEN);
    const httpClient = new HttpClient(ENV.API_URL_LEGACY);
    const response = await httpClient.get<MultiInitiatorRoleType>(
      `/user/has-multi-initiation-role/inbound`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response;
  } catch (error) {
    return ServiceResult.failed(null, "Something went wrong");
  }
};

export const getCorrespondenceDetails = async (id: string) => {
  try {
    let token = Storage.getItem(LOCALSTORAGE.LEGACY_ACCESS_TOKEN);
    const httpClient = new HttpClient(ENV.API_URL_LEGACY);
    const response = await httpClient.get<CorrespondenceDTOType>(
      `/correspodence/${id}?isInCreateMode=true`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response;
  } catch (error) {
    return ServiceResult.failed(null, "Something went wrong");
  }
};

export const updateDraftCorrespondence = async (
  payLoad: CorrespondenceType
) => {
  try {
    let token = Storage.getItem(LOCALSTORAGE.LEGACY_ACCESS_TOKEN);
    const httpClient = new HttpClient(ENV.API_URL_LEGACY);
    const response = await httpClient.post<
      CorrespondenceDTOType,
      CorrespondenceType
    >(`/correspodence/in/update`, payLoad, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response;
  } catch (error) {
    return ServiceResult.failed(null, "Something went wrong");
  }
};

export const getPhysicalAttachmentsOfCorrespondence = async (id: string) => {
  try {
    let token = Storage.getItem(LOCALSTORAGE.LEGACY_ACCESS_TOKEN);

    const headers: AxiosRequestConfig["headers"] = {
      Authorization: `Bearer ${token}`,
    };
    const response = await apiRequest(
      "GET",
      `/p-attachment/filter-by-corrid?correspondenceId=${id}&page=0&size=1000&isCreateMode=false&sort=createdDate,desc`,
      {},
      { headers },
      ENV.API_URL_LEGACY
    );

    if (response) {
      return response.content;
    }

    return null;
  } catch (error) {
    return null;
  }
};

export const getElectronicAttachmentsOfCorrespondence = async (
  id: string
): Promise<ElectronicAttachmentType[] | null> => {
  try {
    let token = Storage.getItem(LOCALSTORAGE.LEGACY_ACCESS_TOKEN);

    const headers: AxiosRequestConfig["headers"] = {
      Authorization: `Bearer ${token}`,
    };
    const response = await apiRequest(
      "GET",
      `/e-attachment/filter-by-corrid?correspondenceId=${id}&isCreateMode=false&page=0&size=1000&sort=createdDate,desc`,
      {},
      { headers },
      ENV.API_URL_LEGACY
    );

    if (response) {
      return response.content;
    }

    return null;
  } catch (error) {
    return null;
  }
};

export const downloadElectronicAttachment = async (
  attId: string,
  attachment: ElectronicAttachmentType
): Promise<any | null> => {
  try {
    let token = Storage.getItem(LOCALSTORAGE.LEGACY_ACCESS_TOKEN);

    const response = await fetch(
      ENV.API_URL_LEGACY +
        `/e-attachment/download-e-attachment?attachId=${attId}&access_token=${token}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      return null;
    }

    const blob = await response.blob();
    let fileName = attachment.name;
    let extension = attachment.fileExtension;

    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = fileName + "." + extension;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    return blob;
  } catch (error) {
    return null;
  }
};

export const downloadAllElectronicAttachment = async (
  corrId: string
): Promise<any | null> => {
  try {
    if (token) {
      token = Storage.getItem(LOCALSTORAGE.LEGACY_ACCESS_TOKEN);
    }

    const response = await fetch(
      ENV.API_URL_LEGACY +
        `/e-attachment/download-all?correspondenceId=${corrId}&access_token=${token}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      return null;
    }

    const blob = await response.blob();
    let fileName = "Correspondence_attachments.zip";

    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    return blob;
  } catch (error) {
    return null;
  }
};

export const getAttachmentHistory = async (
  attId: string,
  corrId: string
): Promise<AttachmentHistoryType[] | null> => {
  try {
    if (token) {
      token = Storage.getItem(LOCALSTORAGE.LEGACY_ACCESS_TOKEN);
    }

    const headers: AxiosRequestConfig["headers"] = {
      Authorization: `Bearer ${token}`,
    };
    const response = await apiRequest(
      "GET",
      `/attachment/get-history?attachmentId=${attId}&correspondenceId=${corrId}`,
      {},
      { headers },
      ENV.API_URL_LEGACY
    );

    if (response) {
      return response;
    }

    return null;
  } catch (error) {
    return null;
  }
};

export const downloadHistoryDoc = async (
  attHistoryId: string,
  attachment: ElectronicAttachmentType
): Promise<any | null> => {
  try {
    if (token) {
      token = Storage.getItem(LOCALSTORAGE.LEGACY_ACCESS_TOKEN);
    }

    const response = await fetch(
      ENV.API_URL_LEGACY +
        `/e-attachment/download-version?attachmentHistoryId=${attHistoryId}&contentRepositoryId=${attachment.conentRepositoryId}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      return null;
    }

    const blob = await response.blob();
    let fileName = attachment.name;
    let extension = attachment.fileExtension;

    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = fileName + "." + extension;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    return blob;
  } catch (error) {
    return null;
  }
};

export const addPhysicalAttachment = async (
  payLoad: CreatePhysicalAttachmentType
) => {
  try {
    let token = Storage.getItem(LOCALSTORAGE.LEGACY_ACCESS_TOKEN);
    const httpClient = new HttpClient(ENV.API_URL_LEGACY);
    const response = await httpClient.post<any, any>(
      `/p-attachment/create?corrId=${payLoad.corrId}&description=${payLoad.description}&quantity=${payLoad.quantity}&physicalAttachmentTypePickListCode=${payLoad.physicalAttachmentTypePickListCode}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response;
  } catch (error) {
    return ServiceResult.failed(null, "Something went wrong");
  }
};

export const editPhysicalAttachment = async (
  payLoad: CreatePhysicalAttachmentType,
  attachment: PhysicalAttachmentsType
) => {
  try {
    let token = Storage.getItem(LOCALSTORAGE.LEGACY_ACCESS_TOKEN);
    const httpClient = new HttpClient(ENV.API_URL_LEGACY);
    const response = await httpClient.put<any, any>(
      "/p-attachment/update?corrId=" +
        payLoad.corrId +
        "&description=" +
        payLoad.description +
        "&quantity=" +
        payLoad.quantity +
        "&physicalAttachmentTypePickListCode=" +
        payLoad.physicalAttachmentTypePickListCode +
        "&id=" +
        attachment.physicalAttachmentId +
        "&recievedStatus=" +
        attachment.recievedStatus,
      null,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response;
  } catch (error) {
    return ServiceResult.failed(null, "Something went wrong");
  }
};

export const deletePhysicalAttachment = async (
  corrId: string,
  attachmentId: string | number
) => {
  try {
    let token = Storage.getItem(LOCALSTORAGE.LEGACY_ACCESS_TOKEN);
    const httpClient = new HttpClient(ENV.API_URL_LEGACY);
    const response = await httpClient.delete<any>(
      `/p-attachment/delete/v1.1?correspondenceId=${corrId}&physicalAttachId=${attachmentId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response;
  } catch (error) {
    return ServiceResult.failed(null, "Something went wrong");
  }
};

export const updateElectronicAttachment = async (
  attachId: string | number,
  payLoad: UpdateElectronicAttachmentType
) => {
  try {
    let token = Storage.getItem(LOCALSTORAGE.LEGACY_ACCESS_TOKEN);
    const httpClient = new HttpClient(ENV.API_URL_LEGACY);
    const response = await httpClient.post<any, any>(
      `/e-attachment/update-attachment?isCreateMode=false&electronicAttachmentId=${attachId}`,
      payLoad,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response;
  } catch (error) {
    return ServiceResult.failed(null, "Something went wrong");
  }
};

export const deleteElectronicAttachment = async (
  corrId: string,
  attachmentId: string | number
) => {
  try {
    let token = Storage.getItem(LOCALSTORAGE.LEGACY_ACCESS_TOKEN);
    const httpClient = new HttpClient(ENV.API_URL_LEGACY);
    const response = await httpClient.delete<any>(
      `/e-attachment/delete/v1.1?correspondenceId=${corrId}&attachId=${attachmentId}&allVersion=false`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response;
  } catch (error) {
    return ServiceResult.failed(null, "Something went wrong");
  }
};

export const uploadNewVerSionOfDocument = async (
  attachment: ElectronicAttachmentType,
  payLoad: FormData
) => {
  try {
    let token = Storage.getItem(LOCALSTORAGE.LEGACY_ACCESS_TOKEN);
    const httpClient = new HttpClient(ENV.API_URL_LEGACY);
    const response = await httpClient.post<any, any>(
      `/e-attachment/newversion?attachmentId=${attachment.electronicAttachmentId}&fileName=${attachment.name}`,
      payLoad,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return response;
  } catch (error) {
    return ServiceResult.failed(null, "Something went wrong");
  }
};

export const getAppParameterValues = async (key: string) => {
  try {
    const token = await Storage.getItem(LOCALSTORAGE.LEGACY_ACCESS_TOKEN);

    const httpClient = new HttpClient(ENV.API_URL_LEGACY);
    const response = await httpClient.get<{
      key: string;
      value: string;
    }>(`/application-parameters/get-by-key?key=${key}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response;
  } catch (error) {
    return ServiceResult.failed(null, "Something went wrong");
  }
};

export const createEAttachmentFile = async (payLoad: FormData) => {
  try {
    const token = await Storage.getItem(LOCALSTORAGE.LEGACY_ACCESS_TOKEN);

    const httpClient = new HttpClient(ENV.API_URL_LEGACY);
    const response = await httpClient.post<any, any>(
      `/e-attachment/create`,
      payLoad,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return response;
  } catch (error) {
    return ServiceResult.failed(null, "Something went wrong");
  }
};

export const downloadFileFromContentServer = async (editUrl: string) => {
  try {
    const downloadUrl = `${editUrl}/download`;

    const responseDownload = await fetch(downloadUrl);

    if (!responseDownload.ok)
      return ServiceResult.failed(null, "Something went wrong");

    const blob = await responseDownload.blob();
    const fileName = "uploaded_file";
    const file = new File([blob], fileName, { type: blob.type });

    const formData = new FormData();
    formData.append("file", file);

    const httpClient = new HttpClient("http://37.34.239.150:8003");

    const response = await httpClient.post<any, any>(
      `/v2/file/convert/docx/tiff`,
      formData
    );

    return response;
  } catch (error) {
    return ServiceResult.failed(null, "Something went wrong");
  }
};
// not used
export const convertToTiffFormat = async (file: File) => {
  try {
    const formData = new FormData();
    formData.append("file", file);

    const httpClient = new HttpClient(ENV.NODE_API_URL);

    const response = await httpClient.post<any, any>(
      `/v2/file/convert/docx/tiff`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          responseType: "blob",
        },
      }
    );

    return response;
  } catch (error) {
    return ServiceResult.failed(null, "Something went wrong");
  }
};

export const uploadDocToServer = async (payLoad: FormData) => {
  try {
    const token = await Storage.getItem(LOCALSTORAGE.LEGACY_ACCESS_TOKEN);

    const httpClient = new HttpClient(ENV.API_URL_LEGACY);
    const response = (await httpClient.post)<CorrespondenceDTOType, any>(
      `/correspodence/in/upload?filename=imageData.tif`,
      payLoad,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return response;
  } catch (error) {
    return ServiceResult.failed(null, "Something went wrong");
  }
};
