import { AxiosRequestConfig } from "axios";
import ENV from "../../../constants/env";
import LOCALSTORAGE from "../../../constants/local-storage";
import apiRequest from "../../../lib/api";
import Storage from "../../../lib/storage";

const legacyToken = Storage.getItem(LOCALSTORAGE.LEGACY_ACCESS_TOKEN);

interface Template {
  outboundTemplateId: number;
  outboundTemplateName: string;
  outboundFileName: string;
  links: unknown[];
}

export async function getOrgTemplates(
  orgCode: string
): Promise<Template[] | null> {
  const url = `/outbound-template/filter-by-code?orgUnitCode=${orgCode}`;

  const headers: AxiosRequestConfig["headers"] = {
    Authorization: `Bearer ${legacyToken}`,
  };

  try {
    const response = await apiRequest(
      "GET",
      url,
      {},
      { headers },
      ENV.API_URL_LEGACY
    );

    return response;
  } catch (error) {
    return null;
  }
}
