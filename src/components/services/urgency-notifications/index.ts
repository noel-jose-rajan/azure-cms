import ENV from "../../../constants/env";
import LOCALSTORAGE from "../../../constants/local-storage";
import Storage from "../../../lib/storage";
import { HttpClient, ServiceResult } from "../../functional/httphelper";
import { SearchResultType } from "../inbound/types";
import { UrgencyNotificationPickListType } from "./type";

export const UrgencyNotificationPeriodData = [
  {
    label: "Month",
    value: "Month",
  },
  {
    label: "Day",
    value: "Day",
  },
  {
    label: "Hour",
    value: "Hour",
  },
];

export const getAllNotificationPickList = async () => {
  try {
    const token = await Storage.getItem(LOCALSTORAGE.ACCESS_TOKEN);
    const httpClient = new HttpClient(ENV.API_URL);

    const response = await httpClient.get<
      SearchResultType<UrgencyNotificationPickListType>
    >(`/urgency-notification/search?pageNumber=1&pageSize=10&sortOrder=DESC`, {
      headers: {
        Authorization: token + "",
      },
    });

    return response;
  } catch (error) {
    return ServiceResult.failed(null, "Something went wrong");
  }
};

export const addANewUrgencyNotification = async (payLoad: any) => {
  try {
    const token = await Storage.getItem(LOCALSTORAGE.ACCESS_TOKEN);
    const httpClient = new HttpClient(ENV.API_URL);

    const response = await httpClient.post<any, any>(
      `/urgency-notification/create`,
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

export const updateUrgencyNotification = async (id: number, payload: any) => {
  try {
    const token = await Storage.getItem(LOCALSTORAGE.ACCESS_TOKEN);
    const httpClient = new HttpClient(ENV.API_URL);

    const response = await httpClient.put<any, any>(
      `/urgency-notification/update/${id}`,
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

export const deleteUrgencyNotification = async (id: number) => {
  try {
    const token = await Storage.getItem(LOCALSTORAGE.ACCESS_TOKEN);
    const httpClient = new HttpClient(ENV.API_URL);

    const response = await httpClient.delete<any>(
      `/urgency-notification/delete/${id}`,
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

export const getAllUrgencyUnits = async () => {
  try {
    const token = await Storage.getItem(LOCALSTORAGE.ACCESS_TOKEN);
    const httpClient = new HttpClient(ENV.API_URL);

    const response = await httpClient.get<any>(
      `/urgency-notification/duration-units`,
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
