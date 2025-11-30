import ENV from "../../../constants/env";
import LOCALSTORAGE from "../../../constants/local-storage";
import Storage from "../../../lib/storage";
import { HttpClient, ServiceResult } from "../../functional/httphelper";
import { ApiResponseType, CreateOrUpdate } from "@/components/shared/types/api";
import {
  AnnouncementGroupsType,
  CreateAnnouncementGroupType,
  GroupUserAddType,
  UpdateAnnouncementGroupType,
} from "./type";

export const getAllAnnouncementGroups = async () => {
  try {
    const token = await Storage.getItem(LOCALSTORAGE.ACCESS_TOKEN);
    const httpClient = new HttpClient(ENV.API_URL);

    const response = await httpClient.get<
      ApiResponseType<AnnouncementGroupsType[]>
    >(`/entity/announcement/findAll`, {
      headers: {
        Authorization: token + "",
      },
    });

    return response;
  } catch (error) {
    return ServiceResult.failed(null, "Something went wrong");
  }
};

export const createAnnouncementGroup = async (
  payload: CreateAnnouncementGroupType
) => {
  try {
    const token = await Storage.getItem(LOCALSTORAGE.ACCESS_TOKEN);
    const httpClient = new HttpClient(ENV.API_URL);

    const response = await httpClient.put<
      CreateOrUpdate,
      CreateAnnouncementGroupType
    >(`/entity/announcement`, payload, {
      headers: {
        Authorization: token + "",
      },
    });

    return response;
  } catch (error) {
    return ServiceResult.failed(null, "Something went wrong");
  }
};

export const updateAnnouncementGroup = async (
  id: number,
  payload: UpdateAnnouncementGroupType
) => {
  try {
    const token = await Storage.getItem(LOCALSTORAGE.ACCESS_TOKEN);
    const httpClient = new HttpClient(ENV.API_URL);

    const response = await httpClient.post<any, UpdateAnnouncementGroupType>(
      `/entity/announcement/${id}`,
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

export const updateStatusOfAnnouncementGroup = async (
  id: number,
  status: boolean
) => {
  try {
    const token = await Storage.getItem(LOCALSTORAGE.ACCESS_TOKEN);
    const httpClient = new HttpClient(ENV.API_URL);

    const response = await httpClient.post<any, any>(
      `/entity/announcement/${id}/${status}`,
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

export const getDBGroupUsers = async (id: number) => {
  try {
    const token = await Storage.getItem(LOCALSTORAGE.ACCESS_TOKEN);
    const httpClient = new HttpClient(ENV.API_URL);

    const response = await httpClient.get<GroupUserAddType>(
      `/entity/announcement/${id}/users`,
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

export const updateDBGroupUsers = async (
  id: number,
  payLoad: GroupUserAddType
) => {
  try {
    const token = await Storage.getItem(LOCALSTORAGE.ACCESS_TOKEN);
    const httpClient = new HttpClient(ENV.API_URL);

    const response = await httpClient.post<any, any>(
      `/entity/announcement/${id}/users`,
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
