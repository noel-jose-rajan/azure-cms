import { AxiosRequestConfig } from "axios";
import { z } from "zod";

import LOCALSTORAGE from "../../constants/local-storage";
import apiRequest from "../../lib/api";
import Storage from "../../lib/storage";
import ENV from "../../constants/env";

export const createOrgUnitDataSchema = z.object({
  orgUnitCode: z.string(),
  orgUnitAbbreviation: z.string().min(1, "This field required"),
  orgUnitDescAr: z.string(),
  orgUnitDescEn: z.string(),
  orgUnitEmail: z.string().email("Wrong email format").optional(),
  orgUnitManager: z.string(),
  orgUnitLevel: z.string(),
  escalatedPerformer: z.string(),
  parentOrgunit: z.string().optional(),
});

export const orgUnitPermissionUserSchema = z.object({
  loginName: z.string(),
  userId: z.string(),
  userDescription: z.string(),
  language: z.string(),
  isDelegator: z.boolean(),
  delegatorUsername: z.string().nullable(),
  delegationId: z.number(),
  grantedAuthorityIDs: z.string().nullable(),
  applicationProfiles: z.string().nullable(),
});

export const listOrgUnitUnitsSchema = z.object({
  content: z.array(orgUnitPermissionUserSchema),
  last: z.boolean(),
  totalElements: z.number(),
  totalPages: z.number(),
  size: z.number(),
  number: z.number(),
  sort: z.array(
    z.object({
      direction: z.string(),
      property: z.string(),
      ignoreCase: z.boolean(),
      nullHandling: z.string(),
      ascending: z.boolean(),
    })
  ),
  numberOfElements: z.number(),
  first: z.boolean(),
});

export const listOrgUnitRolesSchema = z.object({
  roleId: z.number(),
  roleName: z.string(),
  listOrgUnitUsers: listOrgUnitUnitsSchema,
  listOrgUnits: z.any().nullable(),
  listGroups: z.any().nullable(),
});

export const listOrgUnitRolesMapSchema = z.object({
  CONSUMER_NORMAL: listOrgUnitRolesSchema,
  CONSUMER_SECRET: listOrgUnitRolesSchema,
  CONSUMER_TOP_SECRET: listOrgUnitRolesSchema,
  CONTRIBUTOR_NORMAL: listOrgUnitRolesSchema,
  CONTRIBUTOR_SECRET: listOrgUnitRolesSchema,
  CONTRIBUTOR_TOP_SECRET: listOrgUnitRolesSchema,
  ADMIN_NORMAL: listOrgUnitRolesSchema,
  ADMIN_SECRET: listOrgUnitRolesSchema,
  ADMIN_TOP_SECRET: listOrgUnitRolesSchema,
});

export const filterByCodeSchema = z.object({
  organizationUnitId: z.number(),
  orgUnitCode: z.string(),
  orgUnitAbbreviation: z.string(),
  orgUnitDescAr: z.string(),
  orgUnitDescEn: z.string(),
  orgUnitEmail: z.string().nullable(),
  orgUnitManager: z.string(),
  orgUnitLevel: z.string(),
  escalatedPerformer: z.string(),
  parentOrgunit: z.string().nullable(),
  grantAccessToParentOrgUnit: z.boolean(),
  isActive: z.string(),
  listOrgUnitRoles: z.array(listOrgUnitRolesMapSchema),
  listOrgUnitGroups: z.number().nullable(),
  listOrganizationUnitDTO: z.number().nullable(),
  orgUnitManagerid: z.string(),
  opentextInboundExternalFolderId: z.number(),
  opentextInboundInternalFolderId: z.number(),
  opentextOutboundExternalFolderId: z.number(),
  opentextOutboundInternalFolderId: z.number(),
  enableG2g: z.boolean(),
  g2gCode: z.number(),
});

export type CreateOrgUnitDataType = z.infer<typeof createOrgUnitDataSchema>;

export type filterByCodeType = z.infer<typeof filterByCodeSchema>;

export interface OrgUnitRole {
  [roleName: string]: RoleDetails | undefined;
}

interface RoleDetails {
  roleId: number;
  roleName: string;
  listOrgUnitUsers: ListOrgUnitUsers<User>;
  listOrgUnits: ListOrgUnitUsers<OrgUnitType>;
  listGroups: ListOrgUnitUsers<OrgUnitGroupType>;
}

export interface OrgUnitType {
  organizationUnitId: number;
  orgUnitCode: string;
  orgUnitAbbreviation: any;
  orgUnitDescAr: string;
  orgUnitDescEn: string;
  orgUnitEmail: string;
  orgUnitManager: string | null;
  orgUnitLevel: string | null;
  escalatedPerformer: string | null;
  parentOrgunit: string | null;
  grantAccessToParentOrgUnit: boolean;
  isActive: string | null;
  listOrgUnitRoles: any;
  listOrgUnitGroups: any;
  listOrganizationUnitDTO: any;
  orgUnitManagerid: string | null;
  opentextInboundExternalFolderId: number;
  opentextInboundInternalFolderId: number;
  opentextOutboundExternalFolderId: number;
  opentextOutboundInternalFolderId: number;
  enableG2g: boolean;
  g2gCode: number;
}

export interface OrgUnitGroupType {
  groupId: string;
  name: string;
  nameAr: string;
  type: string;
  email: string;
  active: boolean;
  allUsers: boolean;
  desc: string | null;
  isactive: string | null;
  usersIdsList: any | null;
}

interface ListOrgUnitUsers<R> {
  content: R[];
  last: boolean;
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  sort: Sort[];
  numberOfElements: number;
  first: boolean;
}

interface User {
  loginName: string;
  userId: string;
  userDescription: string;
  language: string;
  isDelegator: boolean;
  delegatorUsername: string | null;
  delegationId: number;
  grantedAuthorityIDs: null;
  applicationProfiles: null;
}

interface Sort {
  direction: "ASC" | "DESC";
  property: string;
  ignoreCase: boolean;
  nullHandling: "NATIVE" | string;
  ascending: boolean;
}

export interface OrganizationUnitRoleType {
  organizationUnitId: number;
  orgUnitCode: string;
  orgUnitAbbreviation: string;
  orgUnitDescAr: string;
  orgUnitDescEn: string;
  orgUnitEmail: string | null;
  orgUnitManager: string;
  orgUnitLevel: string;
  escalatedPerformer: string;
  parentOrgunit: string | null;
  grantAccessToParentOrgUnit: boolean;
  isActive: string;
  listOrgUnitRoles: OrgUnitRole[];
  listOrgUnitGroups: null;
  listOrganizationUnitDTO: null;
  orgUnitManagerid: string;
  opentextInboundExternalFolderId: number;
  opentextInboundInternalFolderId: number;
  opentextOutboundExternalFolderId: number;
  opentextOutboundInternalFolderId: number;
  enableG2g: boolean;
  g2gCode: number;
}

export interface CreateOrgUnitUserRoles {
  orgUnitRoleId: number;
  orgUnitCode: string[];
  userId: string[];
  deletedUserId: string[];
  deletedOrgUnitCode: string[];
  groups?: string[];
  deletedGroups?: string[];
}

export interface CreateOrgUnitUserRolesPayLoadType {
  listUsersOrgUnitRoles: CreateOrgUnitUserRoles[];
}

export interface AllowedCodeType {
  enName: string;
  arName: string;
  allowedCode: string;
  links: any[];
}

export interface AllowedValuesType {
  flag: boolean;
  type: string;
  allowedCodes: AllowedCodeType[] | null;
  links: any[];
}

export interface OrgUnitAllowedDataType {
  orgunitId: number;
  allowedValues: AllowedValuesType[];
}

let token = Storage.getItem(LOCALSTORAGE.LEGACY_ACCESS_TOKEN);

export const createNewOrgUnit = async (payLoad: CreateOrgUnitUserRoles[]) => {
  try {
    const headers: AxiosRequestConfig["headers"] = {
      Authorization: `Bearer ${token}`,
    };

    const response = await apiRequest(
      "POST",
      `/org-unit/create`,
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

export const updateOrgUnitDetails = async (id: number, payLoad: any) => {
  try {
    const headers: AxiosRequestConfig["headers"] = {
      Authorization: `Bearer ${token}`,
    };

    const response = await apiRequest(
      "PUT",
      `/org-unit/update?id=${id}`,
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

export const getOrgUnitDetailsWithCode = async (code: string) => {
  try {
    let token = Storage.getItem(LOCALSTORAGE.LEGACY_ACCESS_TOKEN);

    const headers: AxiosRequestConfig["headers"] = {
      Authorization: `Bearer ${token}`,
    };

    const response = await apiRequest(
      "GET",
      `/org-unit/filter?orgUnitCode=${code}`,
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

export const fetchOrgUnitUsers = async (
  code: string,
  roleType: string
): Promise<OrganizationUnitRoleType | null> => {
  try {
    const headers: AxiosRequestConfig["headers"] = {
      Authorization: `Bearer ${token}`,
    };

    const response = await apiRequest(
      "GET",
      `/org-unit/filterByCodeAndType?orgUnitCode=${code}&roleType=${roleType}`,
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

export const createOrgUnitUserRole = async (
  payLoad: CreateOrgUnitUserRoles[]
) => {
  try {
    const jsonPayLoad: CreateOrgUnitUserRolesPayLoadType = {
      listUsersOrgUnitRoles: payLoad,
    };
    const headers: AxiosRequestConfig["headers"] = {
      Authorization: `Bearer ${token}`,
    };

    const response = await apiRequest(
      "POST",
      `/org-unit-role/create`,
      jsonPayLoad,
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

export const getReviewEnabledForCorrespondence = async (
  id: number
): Promise<boolean | null> => {
  try {
    if (token) {
      token = Storage.getItem(LOCALSTORAGE.LEGACY_ACCESS_TOKEN);
    }

    const headers: AxiosRequestConfig["headers"] = {
      Authorization: `Bearer ${token}`,
    };

    const response = await apiRequest(
      "GET",
      `/org-unit/get-reviewer?id=${id}`,
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

export const getOrgUnitAllowedValues = async (
  id?: number
): Promise<OrgUnitAllowedDataType | null> => {
  try {
    if (token) {
      token = Storage.getItem(LOCALSTORAGE.LEGACY_ACCESS_TOKEN);
    }

    const headers: AxiosRequestConfig["headers"] = {
      Authorization: `Bearer ${token}`,
    };

    const response = await apiRequest(
      "GET",
      `/org-unit/get-allowed-values?orgunitId=${id}`,
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

export const checkOUCodeExist = async (code: string) => {
  try {
    if (token) {
      token = Storage.getItem(LOCALSTORAGE.LEGACY_ACCESS_TOKEN);
    }

    const headers: AxiosRequestConfig["headers"] = {
      Authorization: `Bearer ${token}`,
    };

    const response = await apiRequest(
      "GET",
      `/org-unit/check_is_duplicate?code=${code}`,
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

export const orgUnitUpdateAllowedValues = async (payLoad: any) => {
  try {
    if (token) {
      token = Storage.getItem(LOCALSTORAGE.LEGACY_ACCESS_TOKEN);
    }

    const headers: AxiosRequestConfig["headers"] = {
      Authorization: `Bearer ${token}`,
    };

    const response = await apiRequest(
      "POST",
      `/org-unit/update-allowed-values`,
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

export const orgUnitReviewEnableUpdate = async (id: any, flag: boolean) => {
  try {
    if (token) {
      token = Storage.getItem(LOCALSTORAGE.LEGACY_ACCESS_TOKEN);
    }

    const headers: AxiosRequestConfig["headers"] = {
      Authorization: `Bearer ${token}`,
    };

    const response = await apiRequest(
      "POST",
      `/org-unit/update-reviewer?id=${id}&flag=${flag}`,
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
