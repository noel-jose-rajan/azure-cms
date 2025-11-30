import { HttpClient, ServiceResult } from "@/components/functional/httphelper";
import ENV from "@/constants/env";
import LOCALSTORAGE from "@/constants/local-storage";
import Storage from "@/lib/storage";
import { CorrSearchResultType, SearchCorrespondenceType } from "./type";

export const searchCorrespondence = async (
  page: number,
  perPage: number,
  payload: SearchCorrespondenceType
) => {
  try {
    const token = await Storage.getItem(LOCALSTORAGE.ACCESS_TOKEN);
    const httpClient = new HttpClient(ENV.API_URL);

    const jsonPayLoad: any = { ...payload };

    const response = await httpClient.post<CorrSearchResultType, any>(
      `/correspondence/filter?page=${page}&perPage=${perPage}`,
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
