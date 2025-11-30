import {
  HttpClient,
  ServiceResult,
} from "../../components/functional/httphelper";
import ENV from "../../constants/env";
import LOCALSTORAGE from "../../constants/local-storage";
import Storage from "../../lib/storage";
//not used
export const markCorrespondenceAsRead = async (
  read: boolean,
  taskId: string,
  corrId: string
) => {
  try {
    const token = await Storage.getItem(LOCALSTORAGE.LEGACY_ACCESS_TOKEN);

    const httpClient = new HttpClient(ENV.API_URL_LEGACY);
    const response = await httpClient.put<any, any>(
      `/task/change-task-read-status?isReadStatus=${read}&taskId=${taskId}&correspondenceId=${corrId}`,
      null,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response;
  } catch (error) {
    return ServiceResult.failed(null, "Something went wrong");
  }
};

export const changeTaskColor = async (
  taskId: string | number,
  selectedColor: string
) => {
  try {
    const token = await Storage.getItem(LOCALSTORAGE.LEGACY_ACCESS_TOKEN);
    const httpClient = new HttpClient(ENV.API_URL_LEGACY);
    const color = selectedColor.replace("#", "");

    const response = await httpClient.post<any, any>(
      `/task/change-task-color?taskId=${taskId}&color=${color}`,
      null,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response;
  } catch (error) {
    return ServiceResult.failed(null, "Something went wrong");
  }
};

// export const getTaskColorGroups = async (taskIds: string[]) => {
//   try {
//     const token = await Storage.getItem(LOCALSTORAGE.LEGACY_ACCESS_TOKEN);
//     const httpClient = new HttpClient(ENV.API_URL_LEGACY);

//     const response = await httpClient.post<any, any>(
//       `/user/inbox/get-tasks-group-color`,
//       taskIds,
//       {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       }
//     );

//     return response;
//   } catch (error) {
//     return ServiceResult.failed(null, "Something went wrong");
//   }
// };

// export const getTaskReadStatus = async (taskIds: string[]) => {
//   try {
//     const token = await Storage.getItem(LOCALSTORAGE.LEGACY_ACCESS_TOKEN);
//     const httpClient = new HttpClient(ENV.API_URL_LEGACY);

//     const response = await httpClient.post<any, any>(
//       `/user/inbox/get-tasks-read-status`,
//       taskIds,
//       {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       }
//     );

//     return response;
//   } catch (error) {
//     return ServiceResult.failed(null, "Something went wrong");
//   }
// };
