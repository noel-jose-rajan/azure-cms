import { AxiosRequestConfig } from "axios";

let token = Storage.getItem(LOCALSTORAGE.LEGACY_ACCESS_TOKEN);

import { z } from "zod";
import LOCALSTORAGE from "../../constants/local-storage";
import Storage from "../../lib/storage";
import apiRequest from "../../lib/api";
import ENV from "../../constants/env";

const OrganizationUnitSchema = z.object({
  organizationUnitId: z.number(),
  orgUnitCode: z.string().nullable(),
  orgUnitAbbreviation: z.string().nullable(),
  orgUnitDescAr: z.string(),
  orgUnitDescEn: z.string(),
  orgUnitEmail: z.string().nullable(),
  orgUnitManager: z.string(),
  orgUnitLevel: z.string(),
  escalatedPerformer: z.string(),
  parentOrgUnit: z.string().nullable(),
  grantAccessToParentOrgUnit: z.boolean(),
  isActive: z.string(),
  listOrgUnitRoles: z.null(),
  listOrgUnitGroups: z.null(),
  listOrganizationUnitDTO: z.null(),
  orgUnitManagerid: z.string(),
  opentextInboundExternalFolderId: z.number(),
  opentextInboundInternalFolderId: z.number(),
  opentextOutboundExternalFolderId: z.number(),
  opentextOutboundInternalFolderId: z.number(),
  enableG2g: z.boolean(),
  g2gCode: z.number(),
  links: z.array(z.any()),
});

const SearchResultStatisticsSchema = z.object({
  resultStatistics: z.object({
    "Result Count": z.number(),
  }),
});

export const searchOUSchema = z.object({
  orgUnitCode: z.string(),
  orgUnitDesc: z.string(),
  parentOrgunit: z.string(),
  orgUnitManagerName: z.string(),
  isActive: z.string(),
});

const SearchResultContentSchema = z.object({
  searchResultStatistics: SearchResultStatisticsSchema,
  searchResultContent: z.array(OrganizationUnitSchema),
});

export type SearchOUType = z.infer<typeof searchOUSchema>;
export type OrganizationUnitType = z.infer<typeof OrganizationUnitSchema>;
export type OUSearchResultType = z.infer<typeof SearchResultContentSchema>;

export interface OUFastAddType {
  roleIds: string[];
  roleNames: string[];
  orgunitCodes: string[];
  userId: string[];
  roleOrgUnitCodes: string[];
}

export const getAllOrgUnits = async (
  searchItem?: SearchOUType,
  perNum: number = 0,
  pageSize: number = 10
): Promise<OUSearchResultType | null> => {
  try {
    const headers: AxiosRequestConfig["headers"] = {
      Authorization: `Bearer ${token}`,
    };

    const response = await apiRequest(
      "POST",
      `/org-unit/search?page=${perNum}&size=${pageSize}&sort=orgUnitCode,asc`,
      searchItem ?? {},
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

export const updateOrgUnitStatus = async (payLoad: any[]) => {
  try {
    const headers: AxiosRequestConfig["headers"] = {
      Authorization: `Bearer ${token}`,
    };

    const response = await apiRequest(
      "PUT",
      `/org-unit/bulk-active-status`,
      payLoad,
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

export const ouFastAdd = async (payLoad: OUFastAddType) => {
  try {
    const headers: AxiosRequestConfig["headers"] = {
      Authorization: `Bearer ${token}`,
    };

    const response = await apiRequest(
      "POST",
      `/org-unit-role/add-roles-users-orgunit`,
      payLoad,
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
