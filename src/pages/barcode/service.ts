import { AxiosRequestConfig } from "axios";
import ENV from "../../constants/env";
import apiRequest from "../../lib/api";
import Storage from "../../lib/storage";
import LOCALSTORAGE from "../../constants/local-storage";

export interface ResetBarcodeProps {
  customYear?: string | number;
  customValue?: string | number;
}

interface APIResponse {
  resultCode: number;
  errorMsgs: null | unknown;
  message: string;
  id?: string | number;
}

export async function resetBarcode(
  props: ResetBarcodeProps
): Promise<APIResponse> {
  const token = Storage.getItem(LOCALSTORAGE.ACCESS_TOKEN);

  const queryString = Object.entries(props)
    .filter(([_, value]) => value !== undefined && value !== null)
    .map(
      ([key, value]) =>
        `${encodeURIComponent(key)}=${encodeURIComponent(value as string)}`
    )
    .join("&");

  const headers: AxiosRequestConfig["headers"] = {
    Authorization: `Bearer ${token}`,
  };

  const response = await apiRequest(
    "POST",
    `/barcode/reset-barcode?${queryString}`,
    {},
    { headers }
  );

  return response;
}

export interface GenerateBarcodePDFProps {
  customYear?: string | number;
  valueFrom?: string | number;
  valueTo?: string | number;
  customValue?: string | number;
}

export async function generateBarcodePDF(
  props: GenerateBarcodePDFProps
): Promise<boolean> {
  try {
    const token = Storage.getItem(LOCALSTORAGE.ACCESS_TOKEN);

    const queryString = Object.entries({ ...props, access_token: token })
      .filter(([_, value]) => value !== undefined && value !== null)
      .map(
        ([key, value]) =>
          `${encodeURIComponent(key)}=${encodeURIComponent(value as string)}`
      )
      .join("&");

    const headers: Record<string, string> = {
      Authorization: `Bearer ${token}`,
      Accept: "*/*",
    };

    const request = await fetch(
      `${ENV.API_URL}/barcode/generate-barcode?${queryString}`,
      {
        method: "GET",
        headers: headers,
      }
    );

    // Check response type
    if (!request.ok) {
      throw new Error(
        `Failed to generate barcode PDF. Status: ${request.status}`
      );
    }

    // Get the response as a Blob
    const rawBlob = await request.blob();

    // Create a new Blob with the content type explicitly set to application/pdf
    const pdfBlob = new Blob([rawBlob], { type: "application/pdf" });

    // Create a Blob URL
    const url = window.URL.createObjectURL(pdfBlob);

    // Open the Blob URL in a new window/tab
    const newWindow = window.open(url, "_blank");
    if (!newWindow) {
      throw new Error(
        "Failed to open the PDF in a new tab. Please check popup blocker settings."
      );
    }

    // Clean up the Blob URL after a reasonable time
    setTimeout(() => window.URL.revokeObjectURL(url), 60000);

    return true;
  } catch (error) {
    return false;
  }
}
