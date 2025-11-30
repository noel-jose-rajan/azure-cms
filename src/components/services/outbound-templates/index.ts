import ENV from "../../../constants/env";
import LOCALSTORAGE from "../../../constants/local-storage";
import { HttpClient, ServiceResult } from "../../functional/httphelper";
import Storage from "../../../lib/storage";
import { GetAllOBTemplateType, GetOBTemplateType } from "./type";

export const getAllOutboundTemplate = async () => {
  try {
    const token = await Storage.getItem(LOCALSTORAGE.ACCESS_TOKEN);
    const httpClient = new HttpClient(ENV.API_URL);

    const response = await httpClient.get<GetAllOBTemplateType>(
      `/outbound-template/findAll`,
      {
        headers: {
          Authorization: token + "",
        },
      }
    );

    return response;
  } catch (error) {
    return ServiceResult.failed(null, "Something went wrong");
  }
};

export const uploadAnOBTemplate = async (payLoad: FormData) => {
  try {
    const token = await Storage.getItem(LOCALSTORAGE.ACCESS_TOKEN);
    const httpClient = new HttpClient(ENV.API_URL);

    const response = await httpClient.put<any, any>(
      `/outbound-template/create`,
      payLoad,
      {
        headers: {
          Authorization: token + "",
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return response;
  } catch (error) {
    return ServiceResult.failed(null, "Something went wrong");
  }
};

export const updateAnOBTemplateDoc = async (payLoad: FormData, id?: number) => {
  try {
    const token = await Storage.getItem(LOCALSTORAGE.ACCESS_TOKEN);
    const httpClient = new HttpClient(ENV.API_URL);

    const response = await httpClient.post<any, any>(
      `/outbound-template/${id}/update-content`,
      payLoad,
      {
        headers: {
          Authorization: token + "",
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return response;
  } catch (error) {
    return ServiceResult.failed(null, "Something went wrong");
  }
};

export const updateTheMetaDataOfTemplate = async (
  payLoad: {
    entityIdList: number[];
    isGeneralTemplate: boolean;
    templateName: string;
  },
  templateId: number
) => {
  try {
    const token = await Storage.getItem(LOCALSTORAGE.ACCESS_TOKEN);
    const httpClient = new HttpClient(ENV.API_URL);

    const response = await httpClient.post<any, any>(
      `/outbound-template/${templateId}/update-metadata`,
      payLoad,
      {
        headers: {
          Authorization: token + "",
        },
      }
    );

    return response;
  } catch (error) {
    return ServiceResult.failed(null, "Something went wrong");
  }
};

export const deleteAnOBTemplate = async (templateId: number) => {
  try {
    const token = await Storage.getItem(LOCALSTORAGE.ACCESS_TOKEN);
    const httpClient = new HttpClient(ENV.API_URL);

    const response = await httpClient.delete<any>(
      `/outbound-template/delete/${templateId}`,
      {
        headers: {
          Authorization: token + "",
        },
      }
    );

    return response;
  } catch (error) {
    return ServiceResult.failed(null, "Something went wrong");
  }
};

export async function downloadOBTemplate(
  templateId: number | string,
  onProgress?: (percent: number) => void
) {
  try {
    const token = Storage.getItem(LOCALSTORAGE.ACCESS_TOKEN);

    const headers: Record<string, string> = {
      Authorization: token + "",
      Accept: "*/*",
    };

    const request = await fetch(
      `${ENV.API_URL}/outbound-template/${templateId}/download`,
      {
        method: "GET",
        headers: headers,
      }
    );
    onProgress && onProgress(10);

    // Check response status
    if (!request.ok) {
      throw new Error(`Failed to download template. Status: ${request.status}`);
    }

    // Get the content type from the response headers
    const contentType = request.headers.get("Content-Type");

    if (!contentType) {
      throw new Error("No content type specified in the response.");
    }
    onProgress && onProgress(30);

    // Get the response as a Blob
    const rawBlob = await request.blob();

    // Determine the file extension based on content type
    let fileExtension = ".docx"; // default to binary if unknown
    if (contentType.includes("application/pdf")) {
      fileExtension = ".pdf";
    } else if (contentType.includes("application/msword")) {
      fileExtension = ".doc"; // Handle .doc files
    } else if (
      contentType.includes(
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      )
    ) {
      fileExtension = ".docx"; // Handle .docx files
    }
    onProgress && onProgress(50);

    // Create a new Blob with the detected content type
    const fileBlob = new Blob([rawBlob], { type: contentType });

    // Create a Blob URL
    const url = window.URL.createObjectURL(fileBlob);

    // Generate a filename based on the templateId and content type
    const filename = `template-${templateId}${fileExtension}`;

    // Create an anchor element to trigger the download
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    onProgress && onProgress(100);
    // Programmatically click the link to trigger the download
    link.click();

    // Clean up the Blob URL after a reasonable time
    setTimeout(() => window.URL.revokeObjectURL(url), 60000);

    return true;
  } catch (error) {
    console.error("Error downloading template:", error);
    return false;
  }
}

export const getOutboundTemplateOfOU = async (
  _orgUnitCode: string | number
) => {
  try {
    const token = await Storage.getItem(LOCALSTORAGE.ACCESS_TOKEN);
    const httpClient = new HttpClient(ENV.API_URL);

    const response = await httpClient.get<GetAllOBTemplateType>(
      `/outbound-template?PageNumber=1&Limit=100`,
      {
        headers: {
          Authorization: token + "",
        },
      }
    );

    return response;
  } catch (error) {
    return ServiceResult.failed(null, "Something went wrong");
  }
};

export const getOutboundTemplateById = async (id: number) => {
  try {
    const token = await Storage.getItem(LOCALSTORAGE.ACCESS_TOKEN);
    const httpClient = new HttpClient(ENV.API_URL);

    const response = await httpClient.get<GetOBTemplateType>(
      `/outbound-template/${id}`,
      {
        headers: {
          Authorization: token + "",
        },
      }
    );

    return response;
  } catch (error) {
    return ServiceResult.failed(null, "Something went wrong");
  }
};
