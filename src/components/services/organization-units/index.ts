import { AxiosRequestConfig } from "axios";
import {
  AllowedValueType,
  AnnouncementType,
  CanReviewCorrespondenceType,
  CreateOrgUnitUserRoles,
  CreateOrgUnitUserRolesPayLoadType,
  OUFastAddType,
  OrgUnitAllowedDataType,
  OrgUnitBasicInfoType,
  OrgUnitOptionsInfoType,
  OrgUnitType,
  OrganizationUnitRoles,
  OrganizationUnitType,
  RoleDataResponse,
  SearchOUType,
  UpdateOUType,
  updateOrgUnitAllowedValuesPayloadType,
  updateOrgUnitRolesPayloadType,
} from "./type";
import LOCALSTORAGE from "@/constants/local-storage";
import Storage from "@/lib/storage";
import apiRequest from "@/lib/api";
import ENV from "@/constants/env";
import { CreateOrUpdate } from "@/components/shared/types/api";
import { OUSearchResultType } from "@/pages/organization-units/service";
import {
  HttpClient,
  HttpStatus,
  ServiceResult,
} from "@/components/functional/httphelper";
import { API_URL } from "@/constants/api";
import { SearchResultType } from "../inbound/types";

export const getAllOrganizationUnits = async (
  searchItem?: SearchOUType,
  pageNum: number = 1,
  pageSize: number = 10
): Promise<
  ServiceResult<{
    data: OrganizationUnitType[];
    error: boolean;
    total_pages: number;
    total_records: number;
  } | null>
> => {
  try {
    const token = await Storage.getItem(LOCALSTORAGE.ACCESS_TOKEN);
    const httpClient = new HttpClient(API_URL);

    const searchParams = new URLSearchParams({
      pageNumber: String(pageNum),
      pageSize: String(pageSize),
      orderByColumn: "entity_code",
      sortOrder: "DESC",
    });

    if (searchItem) {
      Object.entries(searchItem).forEach(([key, value]) => {
        if (value) {
          searchParams.append(key, value.toString());
        }
      });
    }

    const queryUrl = `/org/search?${searchParams.toString()}`;

    const response = await httpClient.get<
      SearchResultType<{
        data: OrganizationUnitType[];
        error: boolean;
        total_pages: number;
        total_records: number;
      }>
    >(queryUrl, {
      headers: {
        Authorization: token + "",
      },
    });

    if (response.status === HttpStatus.SUCCESS && response.data) {
      let respData = response.data;
      if (respData.data.length > 0 && respData.data[0]?.data) {
        return ServiceResult.success(respData.data[0], "Api call success");
      }
    } else if (response.status === HttpStatus.NOTFOUND) {
      return ServiceResult.notFound("Something went wrong");
    } else if (response.status === HttpStatus.UNAUTHORIZED) {
      return ServiceResult.unAuthorized("Something went wrong");
    } else {
      return ServiceResult.failed(null, "Something went wrong");
    }
    return ServiceResult.failed(null, "Something went wrong");
  } catch (error) {
    return ServiceResult.failed(null, "Something went wrong");
  }
};

export const getAllOU = async (): Promise<OrgUnitType[]> => {
  const token = await Storage.getItem(LOCALSTORAGE.ACCESS_TOKEN);

  const headers: AxiosRequestConfig["headers"] = {
    Authorization: `Bearer ${token}`,
  };

  const response = await apiRequest(
    "GET",
    "/entity/org/findAll",
    {},
    { headers },
    ENV.API_URL
  );

  return response.Data;
};

export const createNewOrgUnit = async (
  payload: OrgUnitType
): Promise<CreateOrUpdate | null> => {
  const token = await Storage.getItem(LOCALSTORAGE.ACCESS_TOKEN);

  const headers: AxiosRequestConfig["headers"] = {
    Authorization: `Bearer ${token}`,
  };

  const response = await apiRequest(
    "PUT",
    "/entity/org",
    payload,
    { headers },
    ENV.API_URL
  );
  return response;
};

export const updateOUDetails = async (payLoad: any, id: string | number) => {
  console.log("Updating OU Details with payload:", payLoad, "and ID:", id);

  try {
    const token = await Storage.getItem(LOCALSTORAGE.ACCESS_TOKEN);
    const httpClient = new HttpClient(API_URL);
    const response = await httpClient.put<any, any>(
      `/org/update/${id}`,
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

export const getOrgUnitById = async (
  id: string
): Promise<OrgUnitOptionsInfoType | null> => {
  const token = await Storage.getItem(LOCALSTORAGE.ACCESS_TOKEN);

  try {
    const headers: AxiosRequestConfig["headers"] = {
      Authorization: `Bearer ${token}`,
    };

    const response = await apiRequest(
      "GET",
      "/entity/org/" + id,
      {},
      { headers },
      ENV.API_URL
    );
    return response?.Data;
  } catch (error) {
    console.log(error);

    return null;
  }
};

export const getOrgUnitBasicInfoById = async (
  id: string
): Promise<OrgUnitBasicInfoType | null> => {
  const token = await Storage.getItem(LOCALSTORAGE.ACCESS_TOKEN);

  try {
    const headers: AxiosRequestConfig["headers"] = {
      Authorization: `Bearer ${token}`,
    };

    const response = await apiRequest(
      "GET",
      "/entity/" + id,
      {},
      { headers },
      ENV.API_URL
    );
    return response;
  } catch (error) {
    console.log(error);

    return null;
  }
};

export const updateOrgUnit = async (
  id: number | string,
  payload: UpdateOUType
): Promise<CreateOrUpdate | null> => {
  const token = await Storage.getItem(LOCALSTORAGE.ACCESS_TOKEN);

  try {
    const headers: AxiosRequestConfig["headers"] = {
      Authorization: `Bearer ${token}`,
    };

    const response = await apiRequest(
      "POST",
      // "/entity/" + id,
      "/entity/org/" + id,

      payload,
      { headers },
      ENV.API_URL
    );
    return response;
  } catch (error) {
    return null;
  }
};

export const updateOrgUnitOptions = async (
  id: number | string,
  payload: UpdateOUType
): Promise<CreateOrUpdate | null> => {
  const token = await Storage.getItem(LOCALSTORAGE.ACCESS_TOKEN);

  try {
    const headers: AxiosRequestConfig["headers"] = {
      Authorization: `Bearer ${token}`,
    };

    const response = await apiRequest(
      "POST",
      "/entity/org/" + id,
      payload,
      { headers },
      ENV.API_URL
    );
    return response;
  } catch (error) {
    return null;
  }
};
export const getAllOrgUnitRoles = async (): Promise<
  OrganizationUnitRoles[] | null
> => {
  const token = await Storage.getItem(LOCALSTORAGE.ACCESS_TOKEN);

  try {
    const headers: AxiosRequestConfig["headers"] = {
      Authorization: `Bearer ${token}`,
    };

    const response = await apiRequest(
      "GET",
      "/entity/roles",
      {},
      { headers },
      ENV.API_URL
    );
    return response?.Data;
  } catch (error) {
    console.log(error);

    return null;
  }
};

export const getOrgUnitRoles = async (
  id: number | string
): Promise<RoleDataResponse | null> => {
  const token = await Storage.getItem(LOCALSTORAGE.ACCESS_TOKEN);

  try {
    const headers: AxiosRequestConfig["headers"] = {
      Authorization: `Bearer ${token}`,
    };

    const response = await apiRequest(
      "GET",
      `/entity/org/${id}/roles`,
      {},
      { headers },
      ENV.API_URL
    );
    return response?.Data;
  } catch (error) {
    console.log(error);

    return null;
  }
};

export const getAllAnnouncements = async (): Promise<
  AnnouncementType[] | null
> => {
  const token = await Storage.getItem(LOCALSTORAGE.ACCESS_TOKEN);

  try {
    const headers: AxiosRequestConfig["headers"] = {
      Authorization: `Bearer ${token}`,
    };

    const response = await apiRequest(
      "GET",
      `/entity/announcement/findAll`,
      {},
      { headers },
      ENV.API_URL
    );
    return response?.Data;
  } catch (error) {
    console.log(error);

    return null;
  }
};
export const getAllAllowedValues = async (
  id: string
): Promise<AllowedValueType[] | null> => {
  const token = await Storage.getItem(LOCALSTORAGE.ACCESS_TOKEN);

  const headers: AxiosRequestConfig["headers"] = {
    Authorization: `Bearer ${token}`,
  };

  const response = await apiRequest(
    "GET",
    `/entity/org/${id}/allowed`,
    {},
    { headers },
    ENV.API_URL
  );
  return response?.Data;
};

export const updateOrgUnitRoles = async (
  id: number | string,
  payload: updateOrgUnitRolesPayloadType
): Promise<CreateOrUpdate | null> => {
  const token = await Storage.getItem(LOCALSTORAGE.ACCESS_TOKEN);

  try {
    const headers: AxiosRequestConfig["headers"] = {
      Authorization: `Bearer ${token}`,
    };

    const response = await apiRequest(
      "POST",
      `/entity/org/${id}/roles`,
      payload,
      { headers },
      ENV.API_URL
    );
    return response;
  } catch (error) {
    return null;
  }
};

export const updateOrgUnitAllowedValues = async (
  id: number | string,
  payload: updateOrgUnitAllowedValuesPayloadType
): Promise<CreateOrUpdate | null> => {
  const token = await Storage.getItem(LOCALSTORAGE.ACCESS_TOKEN);

  try {
    const headers: AxiosRequestConfig["headers"] = {
      Authorization: `Bearer ${token}`,
    };

    const response = await apiRequest(
      "POST",
      `/entity/org/${id}/allowed`,
      payload,
      { headers },
      ENV.API_URL
    );
    return response;
  } catch (error) {
    console.log(error);
    return null;
  }
};

// not used from here
export const updateOUStatus = async (payLoad: any) => {
  try {
    const token = await Storage.getItem(LOCALSTORAGE.ACCESS_TOKEN);
    const httpClient = new HttpClient(API_URL);
    const response = await httpClient.put<any, any>(
      `/org/bulk-active-status`,
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

export const ouFastAddUsers = async (payLoad: OUFastAddType) => {
  console.log("Fast adding users with payload:", payLoad);

  try {
    const token = await Storage.getItem(LOCALSTORAGE.ACCESS_TOKEN);
    const httpClient = new HttpClient(API_URL);
    const response = await httpClient.post<any, any>(
      `/org/users/roles`,
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

export const fetchOrgUnitUsers = async (code: string, permission: string) => {
  console.log(
    "Fetching Org Unit Users with code:",
    code,
    "and permission:",
    permission
  );
  try {
    const token = await Storage.getItem(LOCALSTORAGE.ACCESS_TOKEN);
    const httpClient = new HttpClient(API_URL);
    const response = await httpClient.get<any>(
      `/org/filter?pageNumber=1&pageSize=100&orderByColumn=entity_code&sortOrder=DESC&entity_code=${code}&role_type=${permission}`,
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

export const createOrgUnitUserRole = async (
  payLoad: CreateOrgUnitUserRoles[]
) => {
  console.log("Creating Org Unit User Roles with payload:", payLoad);
  try {
    const jsonPayLoad: CreateOrgUnitUserRolesPayLoadType = {
      listUsersOrgUnitRoles: payLoad,
    };
    const token = await Storage.getItem(LOCALSTORAGE.ACCESS_TOKEN);
    const httpClient = new HttpClient(API_URL);
    const response = await httpClient.put<any, any>(
      `/org/org-unit/roles/update`,
      jsonPayLoad,
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

export const getOrgUnitAllowedValues = async (id?: string | number) => {
  console.log("Fetching Org Unit Allowed Values for ID:", id);
  try {
    const token = await Storage.getItem(LOCALSTORAGE.ACCESS_TOKEN);
    const httpClient = new HttpClient(API_URL);
    const response = await httpClient.get<
      SearchResultType<OrgUnitAllowedDataType>
    >(
      `/org/get-allowed-values?pageNumber=1&pageSize=10&orderByColumn=entity_code&sortOrder=DESC&entity_id=${id}`,
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

export const orgUnitUpdateAllowedValues = async (payLoad: any) => {
  try {
    const token = await Storage.getItem(LOCALSTORAGE.ACCESS_TOKEN);
    const httpClient = new HttpClient(API_URL);
    const response = await httpClient.put<any, any>(
      `/org/update-allowed-values`,
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

export const getReviewEnabledForCorrespondence = async (
  id: string | number
) => {
  console.log("Fetching Review Enabled for Correspondence with ID:", id);
  try {
    const token = await Storage.getItem(LOCALSTORAGE.ACCESS_TOKEN);
    const httpClient = new HttpClient(API_URL);
    const response = await httpClient.get<
      SearchResultType<CanReviewCorrespondenceType>
    >(
      `/org/get-reviewer?pageNumber=1&pageSize=10&orderByColumn=entity_code&sortOrder=DESC&entity_id=${id}`,
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

export const orgUnitReviewEnableUpdate = async (id: any, flag: boolean) => {
  console.log(
    "Updating Org Unit Review Enable for ID:",
    id,
    "with flag:",
    flag
  );
  try {
    const token = await Storage.getItem(LOCALSTORAGE.ACCESS_TOKEN);
    const httpClient = new HttpClient(API_URL);
    const response = await httpClient.put<any, any>(
      `/org/update-reviewer`,
      {
        organizationUnitId: id,
        canReviewCorrespondences: flag ? "true" : "false",
      },
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

export const fastAddOrgUnits = async (payLoad: OUFastAddType) => {
  console.log("Fast adding Org Units with payload:", payLoad);
  try {
    const token = await Storage.getItem(LOCALSTORAGE.ACCESS_TOKEN);
    const httpClient = new HttpClient(API_URL);
    const response = await httpClient.post<any, any>(
      `/org/org-unit/roles`,
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

export const getUserByOrgCodeAndRole = async (code: string, role: string) => {
  console.log(
    "Fetching User by Org Code and Role with code:",
    code,
    "and role:",
    role
  );
  try {
    const token = await Storage.getItem(LOCALSTORAGE.LEGACY_ACCESS_TOKEN);
    const httpClient = new HttpClient(ENV.API_URL_LEGACY);
    const response = await httpClient.get<any>(
      `/org-unit/filterByCodeAndRoleName?orgUnitCode=${code}&roleName=${role}`,
      {
        headers: {
          Authorization: "Bearer " + token,
        },
      }
    );
    return response;
  } catch (error) {
    return ServiceResult.failed(null, "Something went wrong");
  }
};

export const getCorrespondenceIssuerPerformer = async (id?: string) => {
  console.log("Fetching Correspondence Issuer Performer with ID:", id);
  try {
    const token = await Storage.getItem(LOCALSTORAGE.LEGACY_ACCESS_TOKEN);
    const httpClient = new HttpClient(ENV.API_URL_LEGACY);
    const response = await httpClient.get<any>(
      `/correspodence/out/history/issuer-prev-approver?correspondenceId=${id}`,
      {
        headers: {
          Authorization: "Bearer " + token,
        },
      }
    );
    return response;
  } catch (error) {
    return ServiceResult.failed(null, "Something went wrong");
  }
};

export const getReviewersFromOU = async (
  _ouCode: string,
  _securityLevel: string
) => {
  console.log(
    "Fetching Reviewers from OU with code:",
    _ouCode,
    "and security level:",
    _securityLevel
  );
  try {
    // const token = await Storage.getItem(LOCALSTORAGE.LEGACY_ACCESS_TOKEN);
    // const httpClient = new HttpClient(ENV.API_URL_LEGACY);
    // const response = await httpClient.get<any>(
    //   `/correspodence/out/history/issuer-prev-approver?correspondenceId=${id}`,
    //   {
    //     headers: {
    //       Authorization: "Bearer " + token,
    //     },
    //   }
    // );
    // return response;
    return ServiceResult.success(
      [
        {
          userId: "6",
          username: "bala",
          email: "dummy@example.com",
          nameEng: "Dummy Name EN",
          nameAr: "اسم وهمي",
          userDescription: "وصف عربي",
          birthDate: "2025-03-20T10:54:50Z",
          civilId: 123456789,
          isTwoFactorAuthEnabled: false,
          isActiveUser: true,
          roles: null,
          language: "",
          isDelegator: false,
          delegationId: 0,
        },
        {
          userId: "2",
          username: "jiju.v",
          email: "dummy@example.com",
          nameEng: "Dummy Name EN",
          nameAr: "اسم وهمي",
          userDescription: "وصف عربي",
          birthDate: "2025-03-20T10:54:50Z",
          civilId: 123456789,
          isTwoFactorAuthEnabled: false,
          isActiveUser: true,
          roles: null,
          language: "",
          isDelegator: false,
          delegationId: 0,
        },
      ],
      "Api call successfull"
    );
  } catch (error) {
    return ServiceResult.failed(null, "Something went wrong");
  }
};

export const getApproversFromOU = async (
  id: string,
  _securityLevel: string
) => {
  try {
    const token = await Storage.getItem(LOCALSTORAGE.LEGACY_ACCESS_TOKEN);
    const httpClient = new HttpClient(ENV.API_URL_LEGACY);
    const response = await httpClient.get<any>(
      `/correspodence/out/history/issuer-prev-approver?correspondenceId=${id}`,
      {
        headers: {
          Authorization: "Bearer " + token,
        },
      }
    );
    return response;
    return ServiceResult.success(
      [
        {
          userId: "6",
          username: "jiju.v",
          email: "dummy@example.com",
          nameEng: "Dummy Name EN",
          nameAr: "اسم وهمي",
          userDescription: "وصف عربي",
          birthDate: "2025-03-20T10:54:50Z",
          civilId: 123456789,
          isTwoFactorAuthEnabled: false,
          isActiveUser: true,
          roles: null,
          language: "",
          isDelegator: false,
          delegationId: 0,
        },
        {
          userId: "2",
          username: "noel",
          email: "dummy@example.com",
          nameEng: "Dummy Name EN",
          nameAr: "اسم وهمي",
          userDescription: "وصف عربي",
          birthDate: "2025-03-20T10:54:50Z",
          civilId: 123456789,
          isTwoFactorAuthEnabled: false,
          isActiveUser: true,
          roles: null,
          language: "",
          isDelegator: false,
          delegationId: 0,
        },
      ],
      "Api call successfull"
    );
  } catch (error) {
    return ServiceResult.failed(null, "Something went wrong");
  }
};
