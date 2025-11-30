import ENV from "../../../constants/env";
import LOCALSTORAGE from "../../../constants/local-storage";
import Storage from "../../../lib/storage";
import { HttpClient, ServiceResult } from "../../functional/httphelper";
import { SearchResultType } from "../inbound/types";
import { CorrespondenceSchemaType, SegmentType } from "./type";

export async function getSchemaDetails(schemaType: string) {
  try {
    const token = await Storage.getItem(LOCALSTORAGE.ACCESS_TOKEN);
    const httpClient = new HttpClient(ENV.API_URL);

    const response = await httpClient.get<
      SearchResultType<CorrespondenceSchemaType>
    >(
      `/correspondence-schema/view_by_type?type=${schemaType}&pageNumber=1&pageSize=20&sortOrder=ASC`,
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
}

export async function updateSchemaDetails(
  schema: CorrespondenceSchemaType,
  segments: SegmentType[]
) {
  try {
    const token = await Storage.getItem(LOCALSTORAGE.ACCESS_TOKEN);
    const httpClient = new HttpClient(ENV.API_URL);

    const parsedSchema: CorrespondenceSchemaType = {
      id: schema.id,
      segmentType: schema.segmentType,
      segments: segments,
    };

    const response = await httpClient.put<any, any>(
      `/correspondence-schema/update`,
      parsedSchema,
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
}
