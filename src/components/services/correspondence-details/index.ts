// import ENV from "../../../constants/env";
// import LOCALSTORAGE from "../../../constants/local-storage";
// import Storage from "../../../lib/storage";
// import { HttpClient, ServiceResult } from "../../functional/httphelper";
// import { InboxActionType } from "../inbox/type";
// import { CreateCorrespondenceType } from "../outbound/types";

// export const getOneCorrespondence = async (corrId: string) => {
//   try {
//     const token = await Storage.getItem(LOCALSTORAGE.ACCESS_TOKEN);

//     const httpClient = new HttpClient(ENV.API_URL);
//     const response = await httpClient.get<{ data: CreateCorrespondenceType[] }>(
//       `/correspondence/fetch/${corrId}`,
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
// };

// export const getDecisions = async (corrId: string, username: string) => {
//   try {
//     const token = await Storage.getItem(LOCALSTORAGE.ACCESS_TOKEN);

//     const httpClient = new HttpClient(ENV.API_URL);
//     const response = await httpClient.get<any>(
//       `/correspondence/decision/${corrId}/${username}`,
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
// };

// export const updateDecision = async (payLoad: any) => {
//   try {
//     const token = await Storage.getItem(LOCALSTORAGE.ACCESS_TOKEN);

//     const httpClient = new HttpClient(ENV.API_URL);
//     const response = await httpClient.post<any, any>(
//       `/correspondence/take-decision`,
//       payLoad,
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
// };

// export const getHistoryOfCorrespondence = async (id: string) => {
//   try {
//     const token = await Storage.getItem(LOCALSTORAGE.ACCESS_TOKEN);

//     const httpClient = new HttpClient(ENV.API_URL);
//     const response = await httpClient.get<{
//       error: boolean;
//       message: string;
//       data: InboxActionType[];
//     }>(`/correspondence/history/${id}`, {
//       headers: {
//         Authorization: token + "",
//       },
//     });

//     return response;
//   } catch (error) {
//     return ServiceResult.failed(null, "Something went wrong");
//   }
// };
