import { AxiosRequestConfig } from "axios";
import LOCALSTORAGE from "../../constants/local-storage";
import Storage from "../../lib/storage";
import apiRequest from "../../lib/api";
import ENV from "../../constants/env";
import {
  AttachmentHistoryType,
  CCUserType,
  CompleteTaskType,
  CorrespondenceCommentsType,
  CorrespondenceDetailType,
  CreateRouteType,
  ElectronicAttachmentType,
  HistoryRecordType,
  PrintTaskType,
  RelatedCorrespondenceResponseType,
  RelatedCorrespondenceType,
  RoutingDetailsType,
  RoutingResponse,
  RoutingType,
  TaskDetailType,
  UpdateRoutingType,
} from "./types";
import { z } from "zod";
import {
  HttpClient,
  ServiceResult,
} from "../../components/functional/httphelper";
//not used
let token = Storage.getItem(LOCALSTORAGE.LEGACY_ACCESS_TOKEN);

const itemsCountSchema = z.object({
  electronicAttachments: z.number(),
  physicalAttachments: z.number(),
  histoy: z.number(),
  routings: z.number(),
  relatedCorrespondences: z.number(),
  notes: z.number(),
  followupTasks: z.number(),
});

export type CorrespondenceItemsCountType = z.infer<typeof itemsCountSchema>;

export const getCorrespondenceDetails = async (
  id?: string
): Promise<CorrespondenceDetailType | null> => {
  try {
    if (!token) {
      token = await Storage.getItem(LOCALSTORAGE.LEGACY_ACCESS_TOKEN);
    }

    const headers: AxiosRequestConfig["headers"] = {
      Authorization: `Bearer ${token}`,
    };

    const response = await apiRequest(
      "GET",
      `/correspodence/${id}`,
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

export const getCountOfEachItems = async (
  id?: string
): Promise<CorrespondenceItemsCountType | null> => {
  try {
    if (!token) {
      token = await Storage.getItem(LOCALSTORAGE.LEGACY_ACCESS_TOKEN);
    }

    const headers: AxiosRequestConfig["headers"] = {
      Authorization: `Bearer ${token}`,
    };

    const response = await apiRequest(
      "GET",
      `/correspodence/counts/${id}`,
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

export const getCorrespondenceAttachmentString = async (
  id: string,
  repId: string
) => {
  try {
    if (!token) {
      token = await Storage.getItem(LOCALSTORAGE.LEGACY_ACCESS_TOKEN);
    }

    const headers: AxiosRequestConfig["headers"] = {
      Authorization: `Bearer ${token}`,
    };

    const response = await apiRequest(
      "GET",
      `/document/view?contentRepositoryId=${repId}&correspondenceId=${id}`,
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

export const getRelatedCorrespondenceDetails = async (
  ids: string[]
): Promise<RelatedCorrespondenceType[] | null> => {
  try {
    if (!token) {
      token = Storage.getItem(LOCALSTORAGE.LEGACY_ACCESS_TOKEN);
    }

    const headers: AxiosRequestConfig["headers"] = {
      Authorization: `Bearer ${token}`,
    };
    const response = await apiRequest<RelatedCorrespondenceResponseType>(
      "POST",
      `/correspodence/related-corr-details?page=0&size=1000`,
      ids,
      { headers },
      ENV.API_URL_LEGACY
    );

    if (response) {
      return response.content ?? [];
    }

    return null;
  } catch (error) {
    return null;
  }
};

// export const getFollowUpCorrespondence = async (
//   id: string
// ): Promise<FollowUpCorrespondenceType[] | null> => {
//   try {
//     if (!token) {
//       token = Storage.getItem(LOCALSTORAGE.LEGACY_ACCESS_TOKEN);
//     }

//     const headers: AxiosRequestConfig["headers"] = {
//       Authorization: `Bearer ${token}`,
//     };
//     const response = await apiRequest(
//       "GET",
//       `/correspodence/related-tasks/${id}?page=0&size=1000&sort=sentDate,desc`,
//       {},
//       { headers },
//       ENV.API_URL_LEGACY
//     );

//     if (response) {
//       return response;
//     }

//     return null;
//   } catch (error) {
//     return null;
//   }
// };

// export const getHistoryOfCorrespondence = async (
//   id: string
// ): Promise<CorrespondenceHistoryType[] | null> => {
//   try {
//     if (!token) {
//       token = await Storage.getItem(LOCALSTORAGE.LEGACY_ACCESS_TOKEN);
//     }

//     const headers: AxiosRequestConfig["headers"] = {
//       Authorization: `Bearer ${token}`,
//     };
//     const response = await apiRequest(
//       "GET",
//       `/correspodence/history/${id}?page=0&size=1000&sort=actionDate,desc`,
//       {},
//       { headers },
//       ENV.API_URL_LEGACY
//     );

//     if (response) {
//       return response.content;
//     }

//     return null;
//   } catch (error) {
//     return null;
//   }
// };

// export const getVersionsOfCorrespondence = async (
//   repId: string
// ): Promise<CorrespondenceVersionsType[] | null> => {
//   try {
//     if (!token) {
//       token = await Storage.getItem(LOCALSTORAGE.LEGACY_ACCESS_TOKEN);
//     }

//     const headers: AxiosRequestConfig["headers"] = {
//       Authorization: `Bearer ${token}`,
//     };
//     const response = await apiRequest(
//       "GET",
//       `/correspodence/out/history/allversions?corrRepId=${repId}&page=0&size=1000&sort=modifiedDate,desc`,
//       {},
//       { headers },
//       ENV.API_URL_LEGACY
//     );

//     if (response) {
//       return response.content;
//     }

//     return null;
//   } catch (error) {
//     return null;
//   }
// };

export const getCorrespondenceComments = async (
  id: string
): Promise<CorrespondenceCommentsType[] | null> => {
  try {
    if (!token) {
      token = await Storage.getItem(LOCALSTORAGE.LEGACY_ACCESS_TOKEN);
    }

    const headers: AxiosRequestConfig["headers"] = {
      Authorization: `Bearer ${token}`,
    };
    const response = await apiRequest(
      "GET",
      `/correspondence-note/get-corr-notes?page=0&size=1000&correspondenceId=${id}`,
      {},
      { headers },
      ENV.API_URL_LEGACY
    );

    if (response) {
      return response.content;
    }

    return null;
  } catch (error) {
    return null;
  }
};

// export const getCanUploadNewVersion = async (
//   id: string
// ): Promise<{ canUploadNewVersion: boolean } | null> => {
//   try {
//     if (!token) {
//       token = await Storage.getItem(LOCALSTORAGE.LEGACY_ACCESS_TOKEN);
//     }

//     const headers: AxiosRequestConfig["headers"] = {
//       Authorization: `Bearer ${token}`,
//     };
//     const response = await apiRequest(
//       "GET",
//       `/correspodence/can-upload-new-version?correspondenceId=${id}`,
//       {},
//       { headers },
//       ENV.API_URL_LEGACY
//     );

//     if (response) {
//       return response;
//     }

//     return null;
//   } catch (error) {
//     return null;
//   }
// };

// export const downloadAVersionDocument = async (
//   item: CorrespondenceVersionsType
// ) => {
//   try {
//     if (!token) {
//       token = await Storage.getItem(LOCALSTORAGE.LEGACY_ACCESS_TOKEN);
//     }

//     const response = await fetch(
//       ENV.API_URL_LEGACY +
//         `/correspodence/download-version?contentRepositoryId=${item.contentRepositoryId}`,
//       {
//         method: "GET",
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       }
//     );

//     if (!response.ok) {
//       return null;
//     }
//     const blob = await response.blob();

//     const link = document.createElement("a");
//     link.href = URL.createObjectURL(blob);
//     link.download = item.name + item.fileExtension;
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);

//     return blob;
//   } catch (error) {
//     return null;
//   }
// };
//not used
// export const downloadLatestVersionOfDocument = async (
//   correspodence: CorrespondenceDetailType
// ) => {
//   try {
//     if (!token) {
//       token = await Storage.getItem(LOCALSTORAGE.LEGACY_ACCESS_TOKEN);
//     }

//     const response = await fetch(
//       ENV.API_URL_LEGACY +
//         `/correspodence/download?corrId=${correspodence.corrId}`,
//       {
//         method: "GET",
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       }
//     );

//     if (!response.ok) {
//       return null;
//     }

//     const blob = await response.blob();
//     const fileContentName =
//       response.headers.get("Content-Disposition") ?? ".pdf";
//     let fileName = StringHelper.replaceSpecialCharacters(correspodence.subject);
//     let extension = StringHelper.getExtension(fileContentName);

//     const link = document.createElement("a");
//     link.href = URL.createObjectURL(blob);
//     link.download = fileName + "." + extension;
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);

//     return blob;
//   } catch (error) {
//     return null;
//   }
// };

export const addNewCommentOnCorrespondence = async (payLoad: any) => {
  try {
    if (!token) {
      token = await Storage.getItem(LOCALSTORAGE.LEGACY_ACCESS_TOKEN);
    }

    const headers: AxiosRequestConfig["headers"] = {
      Authorization: `Bearer ${token}`,
    };
    const response = await apiRequest(
      "POST",
      `/correspondence-note/create`,
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

export const getPhysicalAttachmentsOfCorrespondence = async (id: string) => {
  try {
    if (!token) {
      token = await Storage.getItem(LOCALSTORAGE.LEGACY_ACCESS_TOKEN);
    }

    const headers: AxiosRequestConfig["headers"] = {
      Authorization: `Bearer ${token}`,
    };
    const response = await apiRequest(
      "GET",
      `/p-attachment/filter-by-corrid?correspondenceId=${id}&page=0&size=1000&isCreateMode=false&sort=createdDate,desc`,
      {},
      { headers },
      ENV.API_URL_LEGACY
    );

    if (response) {
      return response.content;
    }

    return null;
  } catch (error) {
    return null;
  }
};

export const getElectronicAttachmentsOfCorrespondence = async (
  id: string
): Promise<ElectronicAttachmentType[] | null> => {
  try {
    if (!token) {
      token = await Storage.getItem(LOCALSTORAGE.LEGACY_ACCESS_TOKEN);
    }

    const headers: AxiosRequestConfig["headers"] = {
      Authorization: `Bearer ${token}`,
    };
    const response = await apiRequest(
      "GET",
      `/e-attachment/filter-by-corrid?correspondenceId=${id}&isCreateMode=false&page=0&size=1000&sort=createdDate,desc`,
      {},
      { headers },
      ENV.API_URL_LEGACY
    );

    if (response) {
      return response.content;
    }

    return null;
  } catch (error) {
    return null;
  }
};

export const canDeleteCorrespondence = async (
  id: string
): Promise<{ canDelete: boolean } | null> => {
  try {
    if (!token) {
      token = await Storage.getItem(LOCALSTORAGE.LEGACY_ACCESS_TOKEN);
    }

    const headers: AxiosRequestConfig["headers"] = {
      Authorization: `Bearer ${token}`,
    };
    const response = await apiRequest(
      "GET",
      `/correspodence/can-delete-correspondence?correspondenceId=${id}`,
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
//not used
export const getRoutingTree = async (
  id: string
): Promise<RoutingType | null> => {
  try {
    if (!token) {
      token = await Storage.getItem(LOCALSTORAGE.LEGACY_ACCESS_TOKEN);
    }

    const headers: AxiosRequestConfig["headers"] = {
      Authorization: `Bearer ${token}`,
    };
    const response = await apiRequest(
      "GET",
      `/routing/tree?correspondenceId=${id}&taskId`,
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

export const filterAndGetRouting = async (
  id: string
): Promise<RoutingDetailsType | null> => {
  try {
    if (!token) {
      token = await Storage.getItem(LOCALSTORAGE.LEGACY_ACCESS_TOKEN);
    }

    const headers: AxiosRequestConfig["headers"] = {
      Authorization: `Bearer ${token}`,
    };
    const response = await apiRequest(
      "GET",
      `/routing/filter-by-routeid?routingId=${id}`,
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

export const getTheHistoryOfRouting = async (
  id: string
): Promise<HistoryRecordType[] | null> => {
  try {
    if (!token) {
      token = await Storage.getItem(LOCALSTORAGE.LEGACY_ACCESS_TOKEN);
    }

    const headers: AxiosRequestConfig["headers"] = {
      Authorization: `Bearer ${token}`,
    };
    const response = await apiRequest(
      "GET",
      `/routing/history?routingId=${id}`,
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

export const canAbleToAccessAttachmentHistory = async (
  id: string
): Promise<{ canRead: string } | null> => {
  try {
    if (!token) {
      token = await Storage.getItem(LOCALSTORAGE.LEGACY_ACCESS_TOKEN);
    }

    const headers: AxiosRequestConfig["headers"] = {
      Authorization: `Bearer ${token}`,
    };
    const response = await apiRequest(
      "GET",
      `/user/can-view-history?correspondenceId=${id}`,
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

export const getAttachmentHistory = async (
  attId: string,
  corrId: string
): Promise<AttachmentHistoryType[] | null> => {
  try {
    if (!token) {
      token = await Storage.getItem(LOCALSTORAGE.LEGACY_ACCESS_TOKEN);
    }

    const headers: AxiosRequestConfig["headers"] = {
      Authorization: `Bearer ${token}`,
    };
    const response = await apiRequest(
      "GET",
      `/attachment/get-history?attachmentId=${attId}&correspondenceId=${corrId}`,
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

export const downloadHistoryDoc = async (
  attHistoryId: string,
  attachment: ElectronicAttachmentType
): Promise<any | null> => {
  try {
    if (!token) {
      token = await Storage.getItem(LOCALSTORAGE.LEGACY_ACCESS_TOKEN);
    }

    const response = await fetch(
      ENV.API_URL_LEGACY +
        `/e-attachment/download-version?attachmentHistoryId=${attHistoryId}&contentRepositoryId=${attachment.conentRepositoryId}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      return null;
    }

    const blob = await response.blob();
    let fileName = attachment.name;
    let extension = attachment.fileExtension;

    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = fileName + "." + extension;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    return blob;
  } catch (error) {
    return null;
  }
};

export const downloadElectronicAttachment = async (
  attId: string,
  attachment: ElectronicAttachmentType
): Promise<any | null> => {
  try {
    if (!token) {
      token = await Storage.getItem(LOCALSTORAGE.LEGACY_ACCESS_TOKEN);
    }

    const response = await fetch(
      ENV.API_URL_LEGACY +
        `/e-attachment/download-e-attachment?attachId=${attId}&access_token=${token}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      return null;
    }

    const blob = await response.blob();
    let fileName = attachment.name;
    let extension = attachment.fileExtension;

    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = fileName + "." + extension;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    return blob;
  } catch (error) {
    return null;
  }
};

export const downloadAllElectronicAttachment = async (
  corrId: string
): Promise<any | null> => {
  try {
    if (!token) {
      token = await Storage.getItem(LOCALSTORAGE.LEGACY_ACCESS_TOKEN);
    }

    const response = await fetch(
      ENV.API_URL_LEGACY +
        `/e-attachment/download-all?correspondenceId=${corrId}&access_token=${token}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      return null;
    }

    const blob = await response.blob();
    let fileName = "Correspondence_attachments.zip";

    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    return blob;
  } catch (error) {
    return null;
  }
};

export const printTaskInfos = async (
  payLoad: PrintTaskType
): Promise<any | null> => {
  try {
    if (!token) {
      token = await Storage.getItem(LOCALSTORAGE.LEGACY_ACCESS_TOKEN);
    }

    const headers: AxiosRequestConfig["headers"] = {
      Authorization: `Bearer ${token}`,
    };
    const response = await apiRequest(
      "POST",
      `/reporting-server/api/report/generate?reportCode=Repo-corres-details&exportFileType=PDF`,
      payLoad,
      { headers },
      "http://192.168.1.107:9008"
    );

    if (response) {
      return response;
    }

    return null;
  } catch (error) {
    return null;
  }
};

export const getTheCorrDetailsFromInbox = async (id: string) => {
  try {
    const token = await Storage.getItem(LOCALSTORAGE.LEGACY_ACCESS_TOKEN);

    const httpClient = new HttpClient(ENV.API_URL_LEGACY);
    const response = await httpClient.get<TaskDetailType>(
      `/user/inbox/show-task/${id}`,
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

export const checkIsAcquired = async (id: string) => {
  try {
    token = await Storage.getItem(LOCALSTORAGE.LEGACY_ACCESS_TOKEN);

    const httpClient = new HttpClient(ENV.API_URL_LEGACY);
    const response = await httpClient.post<{ result: boolean }, any>(
      `/task/isTaskAcquired/${id}`,
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

export const acquireATask = async (id: string) => {
  try {
    if (!token) {
      token = await Storage.getItem(LOCALSTORAGE.LEGACY_ACCESS_TOKEN);
    }
    const httpClient = new HttpClient(ENV.API_URL_LEGACY);
    const response = await httpClient.post<{ result: boolean }, any>(
      `/task/acquire/${id}`,
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

export const getCCUsers = async (orgId: string, plCode: string) => {
  try {
    if (!token) {
      token = Storage.getItem(LOCALSTORAGE.LEGACY_ACCESS_TOKEN);
    }
    const httpClient = new HttpClient(ENV.API_URL_LEGACY);
    const response = await httpClient.get<CCUserType[]>(
      `/routing/list-of-cc?orgUnitCode=${orgId}&securityLevelPickListCode=${plCode}`,
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

export const getRoutingLists = async (
  ouCode: string,
  securityLevel: string
) => {
  try {
    if (!token) {
      token = Storage.getItem(LOCALSTORAGE.LEGACY_ACCESS_TOKEN);
    }
    const httpClient = new HttpClient(ENV.API_URL_LEGACY);
    const response = await httpClient.get<CCUserType[]>(
      `/routing/routing-list?orgUnitCode=${ouCode}&securityLevelPickListCode=${securityLevel}`,
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

export const createRouteForCorrespondence = async (
  payLoad: CreateRouteType
) => {
  try {
    if (!token) {
      token = Storage.getItem(LOCALSTORAGE.LEGACY_ACCESS_TOKEN);
    }
    const httpClient = new HttpClient(ENV.API_URL_LEGACY);
    const response = await httpClient.post<any, any>(
      `/routing/create`,
      payLoad,
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

export const getCorrespondenceRoutings = async (corrId: string) => {
  try {
    if (!token) {
      token = Storage.getItem(LOCALSTORAGE.LEGACY_ACCESS_TOKEN);
    }
    const httpClient = new HttpClient(ENV.API_URL_LEGACY);
    const response = await httpClient.get<RoutingResponse>(
      `/routing/filter-by-corrid?correspondenceId=${corrId}`,
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

export const deleteARoute = async (id: string | number) => {
  try {
    if (!token) {
      token = Storage.getItem(LOCALSTORAGE.LEGACY_ACCESS_TOKEN);
    }
    const httpClient = new HttpClient(ENV.API_URL_LEGACY);
    const response = await httpClient.delete<RoutingResponse>(
      `/routing/delete?routingId=${id}`,
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

export const checkIsRoutedBefore = async (to: string, corrId?: string) => {
  try {
    if (!token) {
      token = Storage.getItem(LOCALSTORAGE.LEGACY_ACCESS_TOKEN);
    }
    const httpClient = new HttpClient(ENV.API_URL_LEGACY);
    const response = await httpClient.get<{ result: boolean }>(
      `/routing/is-routed-before?routedTo=${to}&correspondenceId=${corrId}`,
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

export const updateTheRoutingWithId = async (
  id: string | number,
  payLoad: UpdateRoutingType
) => {
  try {
    if (!token) {
      token = Storage.getItem(LOCALSTORAGE.LEGACY_ACCESS_TOKEN);
    }
    const httpClient = new HttpClient(ENV.API_URL_LEGACY);
    const response = await httpClient.post<any, any>(
      `/routing/update?routingId=${id}`,
      payLoad,
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

export const updateTaskDelayComment = async (payLoad: any) => {
  try {
    if (!token) {
      token = Storage.getItem(LOCALSTORAGE.LEGACY_ACCESS_TOKEN);
    }
    const httpClient = new HttpClient(ENV.API_URL_LEGACY);
    const response = await httpClient.post<any, any>(
      `/task/send-delay-comment`,
      payLoad,
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

export const markCorrespondenceAsRead = async (
  read: boolean,
  taskId: string,
  corrId: string
) => {
  try {
    const token = Storage.getItem(LOCALSTORAGE.LEGACY_ACCESS_TOKEN);

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

//not used
export const completeTaskAction = async (
  id: string,
  payLoad: CompleteTaskType
) => {
  try {
    const token = await Storage.getItem(LOCALSTORAGE.LEGACY_ACCESS_TOKEN);

    const httpClient = new HttpClient(ENV.API_URL_LEGACY);
    const response = await httpClient.post<any, any>(
      `/task/complete/${id}`,
      payLoad,
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
