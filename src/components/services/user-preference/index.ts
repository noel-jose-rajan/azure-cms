import { TitleSchemaType } from "@/pages/users-preferences/components/user-preferences/add-edit-title";
import ENV from "../../../constants/env";
import LOCALSTORAGE from "../../../constants/local-storage";
import Storage from "../../../lib/storage";
import { HttpClient, ServiceResult } from "../../functional/httphelper";
import { SearchResultType } from "../inbound/types";
import {
  AddTitleResponseType,
  GetUserPreferenceType,
  NotificationPreferencesType,
  UserPreferenceType,
  UserRoleType,
  UsersOrgUnitRolesType,
  UserType,
} from "./type";
import { ApiResponseType } from "@/components/shared/types/api";
import apiRequest from "@/lib/api";
import { AxiosRequestConfig } from "axios";

export const getAllUsers = async () => {
  try {
    const token = await Storage.getItem(LOCALSTORAGE.ACCESS_TOKEN);
    const httpClient = new HttpClient(ENV.API_URL);

    const response = await httpClient.get<SearchResultType<UserType>>(
      `/users/get-all`,
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

export const advancedUserSearch = async (
  page: number = 1,
  size: number = 10,
  _searchCriteria: any
) => {
  try {
    const token = await Storage.getItem(LOCALSTORAGE.ACCESS_TOKEN);
    const httpClient = new HttpClient(ENV.API_URL);

    const response = await httpClient.get<SearchResultType<UserType>>(
      `/users/get-all?pageSize=${size}&pageNumber=${page}`,
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

// export async function syncUsers() {
//   try {
//     const token = await Storage.getItem(LOCALSTORAGE.ACCESS_TOKEN);
//     const httpClient = new HttpClient(ENV.API_URL);

//     const response = await httpClient.get<SearchResultType<UserType>>(
//       `/user/sync`,
//       {
//         headers: {
//           Authorization: token + "",
//         },
//       }
//     );

//     return response;
//   } catch (error) {
//     return ServiceResult.failed(null, "Something went wrong");
//   }
// }

export interface SyncedUser {
  cn: string;
  uid: string;
  mail?: string;
  description?: string;
}
export const syncUsers = async (): Promise<SyncedUser[]> => {
  const token = await Storage.getItem(LOCALSTORAGE.ACCESS_TOKEN);

  const headers: AxiosRequestConfig["headers"] = {
    Authorization: `Bearer ${token}`,
  };

  const response = await apiRequest(
    "GET",
    `/user/fetch/sync`,
    {},
    { headers },
    ENV.API_URL
  );
  return response?.users || [];
};

export type AddUserBody = {
  email: string;
  name_en: string;
  username: string;
};
export const addUsers = async (body: AddUserBody): Promise<{ id: number }> => {
  const token = await Storage.getItem(LOCALSTORAGE.ACCESS_TOKEN);

  const headers: AxiosRequestConfig["headers"] = {
    Authorization: `Bearer ${token}`,
  };

  const response = await apiRequest(
    "PUT",
    `/user/user-preferences`,
    body,
    { headers },
    ENV.API_URL
  );
  return response;
};
export const getFullUserInformation = async (userId: string | number) => {
  try {
    const token = await Storage.getItem(LOCALSTORAGE.ACCESS_TOKEN);
    const httpClient = new HttpClient(ENV.API_URL);

    const response = await httpClient.get<GetUserPreferenceType>(
      `/user/user-preferences/get/${userId}`,
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

export const saveUserInformation = async (
  user: UserPreferenceType,
  userId?: number
) => {
  try {
    const token = await Storage.getItem(LOCALSTORAGE.ACCESS_TOKEN);
    const httpClient = new HttpClient(ENV.API_URL);

    const response = await httpClient.put<any, any>(
      `/user/user-preferences/${userId}`,
      user,
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

export const addUserTitle = async (payload: TitleSchemaType) => {
  try {
    const token = await Storage.getItem(LOCALSTORAGE.ACCESS_TOKEN);
    const httpClient = new HttpClient(ENV.API_URL);

    const response = await httpClient.post<
      AddTitleResponseType,
      TitleSchemaType
    >(`/users/title`, payload, {
      headers: {
        Authorization: token + "",
      },
    });

    return response;
  } catch (error) {
    return ServiceResult.failed(null, "Something went wrong");
  }
};

export const updateUserTitle = async (payload: TitleSchemaType) => {
  try {
    const token = await Storage.getItem(LOCALSTORAGE.ACCESS_TOKEN);
    const httpClient = new HttpClient(ENV.API_URL);

    const response = await httpClient.put<any, TitleSchemaType>(
      `/users/title`,
      payload,
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

export const deleteUserTitle = async (id: number) => {
  try {
    const token = await Storage.getItem(LOCALSTORAGE.ACCESS_TOKEN);
    const httpClient = new HttpClient(ENV.API_URL);

    const response = await httpClient.delete<any>(`/users/title/${id}`, {
      headers: {
        Authorization: token + "",
      },
    });

    return response;
  } catch (error) {
    return ServiceResult.failed(null, "Something went wrong");
  }
};

export const setDefaultUserTitle = async (
  userId: number,
  titleId: number,
  defaultTitle: boolean
) => {
  try {
    const token = await Storage.getItem(LOCALSTORAGE.ACCESS_TOKEN);
    const httpClient = new HttpClient(ENV.API_URL);

    const response = await httpClient.put<any, any>(
      `/users/title/default/${userId}/${titleId}/${defaultTitle}`,
      {},
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

export async function getUserOrgUnitRoles(userId: string | number) {
  try {
    const token = await Storage.getItem(LOCALSTORAGE.ACCESS_TOKEN);
    const httpClient = new HttpClient(ENV.API_URL);

    const response = (await httpClient.get)<
      ApiResponseType<UsersOrgUnitRolesType[]>
    >(`/entity/roles/${userId}`, {
      headers: {
        Authorization: token + "",
      },
    });

    return response;
  } catch (error) {
    return ServiceResult.failed(null, "Something went wrong");
  }
}

export const getAllTitles = async (userId: number) => {
  try {
    const token = await Storage.getItem(LOCALSTORAGE.ACCESS_TOKEN);
    const httpClient = new HttpClient(ENV.API_URL);

    const response = await httpClient.get<any>(`/users/title/${userId}`, {
      headers: {
        Authorization: token + "",
      },
    });

    return response;
  } catch (error) {
    return ServiceResult.failed(null, "Something went wrong");
  }
};

export const uploadUserImage = async (
  payload: FormData,
  type: "profile" | "signature",
  id?: number
) => {
  try {
    const token = await Storage.getItem(LOCALSTORAGE.ACCESS_TOKEN);
    const httpClient = new HttpClient(ENV.API_URL);

    const response = await httpClient.put<any, FormData>(
      `/users/file/${id}/${type}`,
      payload,
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

export const getAllNotificationPreferences = async () => {
  try {
    const token = await Storage.getItem(LOCALSTORAGE.ACCESS_TOKEN);
    const httpClient = new HttpClient(ENV.API_URL);

    const response = await httpClient.get<NotificationPreferencesType[]>(
      `/notification/types`,
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

export const getUserOptedotifications = async (userId: number) => {
  try {
    const token = await Storage.getItem(LOCALSTORAGE.ACCESS_TOKEN);
    const httpClient = new HttpClient(ENV.API_URL);

    const response = await httpClient.get<number[]>(
      `/notification/${userId}/types`,
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

export const updateUserNotifiactionPermissions = async (
  payLoad: number[],
  userId?: number
) => {
  try {
    const token = await Storage.getItem(LOCALSTORAGE.ACCESS_TOKEN);
    const httpClient = new HttpClient(ENV.API_URL);

    const response = await httpClient.post<any, number[]>(
      `/notification/${userId}/types`,
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

export const getAllOrgUnitRoles = async () => {
  try {
    const token = await Storage.getItem(LOCALSTORAGE.ACCESS_TOKEN);
    const httpClient = new HttpClient(ENV.API_URL);

    const response = await httpClient.get<ApiResponseType<UserRoleType[]>>(
      `/entity/roles`,
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

export const updateUserOrgUnitRoles = async (
  payLoad: { entity_id?: number; roles: number[] },
  userId?: number | string
) => {
  try {
    const token = await Storage.getItem(LOCALSTORAGE.ACCESS_TOKEN);
    const httpClient = new HttpClient(ENV.API_URL);

    const response = await httpClient.post<any, any>(
      `/entity/roles/${userId}`,
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

export const removeUserOrgUnitRoles = async (
  payLoad: { entity_id?: number; roles: number[] },
  userId?: number | string
) => {
  try {
    const token = await Storage.getItem(LOCALSTORAGE.ACCESS_TOKEN);

    const headers: AxiosRequestConfig["headers"] = {
      Authorization: `Bearer ${token}`,
    };

    const response = await apiRequest(
      "DELETE",
      `/entity/roles/${userId}`,
      payLoad,
      { headers },
      ENV.API_URL
    );

    if (response) {
      return ServiceResult.success(response.data, "Roles removed successfully");
    } else {
      return ServiceResult.failed(null, "Failed to remove roles");
    }
  } catch (error) {
    return ServiceResult.failed(null, "Something went wrong");
  }
};
