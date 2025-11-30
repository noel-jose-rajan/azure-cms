import ENV from "../../../constants/env";
import LOCALSTORAGE from "../../../constants/local-storage";
import Storage from "../../../lib/storage";
import {
  HttpClient,
  HttpStatus,
  ServiceResult,
} from "../../functional/httphelper";
import { AppParameterType, GetAllParameterType } from "./type";

export const getAllAppParameters = async () => {
  try {
    const token = await Storage.getItem(LOCALSTORAGE.ACCESS_TOKEN);
    const httpClient = new HttpClient(ENV.API_URL);

    const response = await httpClient.get<GetAllParameterType>(
      `/application-parameters/findAll`,
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

export const updateApplicationParameters = async (
  parameter: AppParameterType[]
) => {
  try {
    const token = await Storage.getItem(LOCALSTORAGE.ACCESS_TOKEN);
    const httpClient = new HttpClient(ENV.API_URL);
    const response = await httpClient.post(
      `/application-parameters/update`,
      parameter,
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

export const getAppParameterValueByKey = async (
  key: string
): Promise<ServiceResult<AppParameterType | null>> => {
  try {
    const response = await getAllAppParameters();

    if (response.status !== HttpStatus.SUCCESS || !response.data) {
      return ServiceResult.failed(null, "Failed to fetch parameters");
    }

    const parameter = response.data.Data.find(
      (param) => param.param_key === key
    );

    if (!parameter) {
      return ServiceResult.notFound(`Parameter with key ${key} not found`);
    }
    return ServiceResult.success(parameter, `Api call success`);
  } catch (error) {
    return ServiceResult.failed(null, "Something went wrong");
  }
};
