import { HttpClient, ServiceResult } from "@/components/functional/httphelper";
import ENV from "@/constants/env";
import LOCALSTORAGE from "@/constants/local-storage";
import Storage from "@/lib/storage";
import { UploadResponseType } from "./type";

const API_URL = "http://122.165.127.146:8000";

export const uploadNewDocumentToChat = async (payLoad: FormData) => {
  try {
    const token = await Storage.getItem(LOCALSTORAGE.ACCESS_TOKEN);
    const httpClient = new HttpClient(API_URL);

    const response = await httpClient.post<UploadResponseType, FormData>(
      `/upload`,
      payLoad,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return response;
  } catch (error) {
    return ServiceResult.failed(null, "Something went wrong");
  }
};

export async function downloadCorrespondenceDocument(corrId: string) {
  try {
    const token = await Storage.getItem(LOCALSTORAGE.ACCESS_TOKEN);
    const request = await fetch(
      ENV.API_URL + `/correspondence/content/${corrId}`,
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
    const blob = await request.blob();

    let filename = "document";
    const disposition = request.headers.get("Content-Disposition");
    if (disposition && disposition.indexOf("filename=") !== -1) {
      const match = disposition.match(/filename="?([^";]+)"?/);
      if (match && match[1]) filename = match[1];
    }

    // Trigger download in browser
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    }, 100);

    return ServiceResult.success(blob, "Document downloaded successfully");
  } catch (error) {
    return ServiceResult.failed(null, "Failed to download document: " + error);
  }
}

export async function downloadCorrespondencePDF(
  corrId: string | number,
  isPDF = true
) {
  try {
    const token = await Storage.getItem(LOCALSTORAGE.ACCESS_TOKEN);
    const request = await fetch(
      ENV.API_URL + `/correspondence/content/${corrId}/download`,

      {
        method: "POST",
        headers: {
          // "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `${token}`,
          // Accept: "application/pdf",
        },
      }
    );

    if (!request.ok) {
      throw new Error(`Failed to download template. Status: ${request.status}`);
    }

    const rawBlob = await request.blob();
    const fileWithName = new File(
      [rawBlob],
      `${corrId}.${isPDF ? "pdf" : "docx"}`,
      {
        type: isPDF
          ? "application/pdf"
          : "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      }
    );

    return fileWithName;
  } catch (error) {
    return null;
  }
}
