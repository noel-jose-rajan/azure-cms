import PICK_LIST_NAME from "../../../constants/app-constants/pick-list-name";
import ENV from "../../../constants/env";
import LOCALSTORAGE from "../../../constants/local-storage";
import Storage from "../../../lib/storage";
import { getRoutingReqActions } from "../../../pages/pick-lists/service";
import {
  HttpClient,
  HttpStatus,
  ServiceResult,
} from "../../functional/httphelper";
import { SearchResultType } from "../inbound/types";
import { CreatePickListItemType, PickList, PickListItemType } from "./type";

export class PickListHelper {
  public static async correspondenceStatus(): Promise<PickListItemType[]> {
    const plValue = Storage.getItem<PickListItemType[]>(
      LOCALSTORAGE.CORRESPONDENCE_STATUS
    );

    if (plValue) {
      return plValue;
    } else {
      const response = await getPickListsItems(PICK_LIST_NAME.STATUS, true);

      if (response) {
        Storage.setItem(LOCALSTORAGE.CORRESPONDENCE_STATUS, response);
        return response;
      }

      return [];
    }
  }

  public static async correspondenceTypes(): Promise<PickListItemType[]> {
    const plValue = Storage.getItem<PickListItemType[]>(
      LOCALSTORAGE.CORRESPONDENCE_TYPES
    );

    if (plValue) {
      return plValue;
    } else {
      const response = await getPickListsItems(
        PICK_LIST_NAME.CORRESPONDENCE_TYPE,
        true
      );

      if (response) {
        Storage.setItem(LOCALSTORAGE.CORRESPONDENCE_TYPES, response);
        return response;
      }

      return [];
    }
  }

  public static async securityLevels(): Promise<PickListItemType[]> {
    const plValue = Storage.getItem<PickListItemType[]>(
      LOCALSTORAGE.SECURITY_LEVEL
    );

    if (plValue) {
      return plValue;
    } else {
      const response = await getPickListsItems(
        PICK_LIST_NAME.SECURITY_LEVEL,
        true
      );

      if (response) {
        Storage.setItem(LOCALSTORAGE.SECURITY_LEVEL, response);
        return response;
      }

      return [];
    }
  }

  public static async urgencyLevel(): Promise<PickListItemType[]> {
    const plValue = Storage.getItem<PickListItemType[]>(
      LOCALSTORAGE.URGENCY_LEVEL
    );

    if (plValue) {
      return plValue;
    } else {
      const response = await getPickListsItems(
        PICK_LIST_NAME.URGENCY_LEVEL,
        true
      );

      if (response) {
        Storage.setItem(LOCALSTORAGE.URGENCY_LEVEL, response);
        return response;
      }

      return [];
    }
  }

  public static async documentType(): Promise<PickListItemType[]> {
    const plValue = Storage.getItem<PickListItemType[]>(
      LOCALSTORAGE.DOCUMENT_TYPE
    );

    if (plValue) {
      return plValue;
    } else {
      const response = await getPickListsItems(
        PICK_LIST_NAME.DOCUMENT_TYPE,
        true
      );

      if (response) {
        Storage.setItem(LOCALSTORAGE.DOCUMENT_TYPE, response);
        return response;
      }

      return [];
    }
  }

  public static async outboundType(): Promise<PickListItemType[]> {
    const plValue = Storage.getItem<PickListItemType[]>(
      LOCALSTORAGE.OUTBOUND_TYPE
    );

    if (plValue) {
      return plValue;
    } else {
      const response = await getPickListsItems(
        PICK_LIST_NAME.OUTBOUND_TYPES,
        true
      );

      if (response) {
        Storage.setItem(LOCALSTORAGE.OUTBOUND_TYPE, response);
        return response;
      }

      return [];
    }
  }

  public static async physicalAttachmentType(): Promise<PickListItemType[]> {
    const plValue = Storage.getItem<PickListItemType[]>(
      LOCALSTORAGE.PHYSICAL_ATTACHMENT_TYPE
    );

    if (plValue) {
      return plValue;
    } else {
      const response = await getPickListsItems(
        PICK_LIST_NAME.PHYSICAL_ATTACHMENT_TYPE,
        true
      );

      if (response) {
        Storage.setItem(LOCALSTORAGE.PHYSICAL_ATTACHMENT_TYPE, response);
        return response;
      }

      return [];
    }
  }

  public static async language(): Promise<PickListItemType[]> {
    const plValue = Storage.getItem<PickListItemType[]>(LOCALSTORAGE.LANGUAGES);

    if (plValue) {
      return plValue;
    } else {
      const response = await getPickListsItems(PICK_LIST_NAME.LANGUAGE, true);

      if (response) {
        Storage.setItem(LOCALSTORAGE.LANGUAGES, response);
        return response;
      }

      return [];
    }
  }

  public static async ouLevels(): Promise<PickListItemType[]> {
    const plValue = Storage.getItem<PickListItemType[]>(LOCALSTORAGE.OU_LEVELS);

    if (plValue) {
      return plValue;
    } else {
      const response = await getPickListsItems(
        PICK_LIST_NAME.ORG_UNIT_LEVEL,
        true
      );

      if (response) {
        Storage.setItem(LOCALSTORAGE.OU_LEVELS, response);
        return response;
      }

      return [];
    }
  }

  public static async escalationPerformer(): Promise<PickListItemType[]> {
    const plValue = Storage.getItem<PickListItemType[]>(
      LOCALSTORAGE.ESCALATION_PERFORMER
    );

    if (plValue) {
      return plValue;
    } else {
      const response = await getPickListsItems(
        PICK_LIST_NAME.ESCALATION_PERFORMER,
        true
      );

      if (response) {
        Storage.setItem(LOCALSTORAGE.ESCALATION_PERFORMER, response);
        return response;
      }

      return [];
    }
  }

  public static async stampOptions(): Promise<PickListItemType[]> {
    const plValue = Storage.getItem<PickListItemType[]>(
      LOCALSTORAGE.STAMP_OPTIONS
    );

    if (plValue) {
      return plValue;
    } else {
      const response = await getPickListsItems(
        PICK_LIST_NAME.STAMP_OPTIONS,
        true
      );

      if (response) {
        Storage.setItem(LOCALSTORAGE.PL_STAMP_OPTIONS, response);
        return response;
      }

      return [];
    }
  }

  public static async outboundSendingType(): Promise<PickListItemType[]> {
    const plValue = Storage.getItem<PickListItemType[]>(
      LOCALSTORAGE.OUTBOUND_SENDING_TYPE
    );

    if (plValue) {
      return plValue;
    } else {
      const response = await getPickListsItems(
        PICK_LIST_NAME.OUTBOUND_SENDING_TYPE,
        true
      );

      if (response) {
        Storage.setItem(LOCALSTORAGE.OUTBOUND_SENDING_TYPE, response);
        return response;
      }

      return [];
    }
  }

  public static async requiredActions(): Promise<PickListItemType[]> {
    const plValue = Storage.getItem<PickListItemType[]>(
      LOCALSTORAGE.REQUIRED_ACTIONS
    );

    if (plValue) {
      return plValue;
    } else {
      const response = await getPickListsItems(
        PICK_LIST_NAME.REQUIRED_ACTION,
        true
      );

      if (response) {
        Storage.setItem(LOCALSTORAGE.REQUIRED_ACTIONS, response);
        return response;
      }

      return [];
    }
  }

  public static async rejectStatusPL(): Promise<PickListItemType[]> {
    const plValue = Storage.getItem<PickListItemType[]>(
      LOCALSTORAGE.REJECTION_REASON
    );

    if (plValue) {
      return plValue;
    } else {
      const response = await getPickListsItems(
        PICK_LIST_NAME.REJECTION_REASON,
        true
      );

      if (response) {
        Storage.setItem(LOCALSTORAGE.REJECTION_REASON, response);
        return response;
      }

      return [];
    }
  }

  public static async routeRequiredActions(): Promise<PickListItemType[]> {
    const plValue = Storage.getItem<PickListItemType[]>(
      LOCALSTORAGE.ROUTE_REQUIRED_ACTIONS
    );

    if (plValue) {
      return plValue;
    } else {
      const response = await getRoutingReqActions();

      if (response) {
        Storage.setItem(LOCALSTORAGE.ROUTE_REQUIRED_ACTIONS, response);
        return response;
      }

      return [];
    }
  }
}

export const getAllPickLists = async () => {
  try {
    const token = await Storage.getItem(LOCALSTORAGE.ACCESS_TOKEN);
    const httpClient = new HttpClient(ENV.API_URL);

    const response = await httpClient.get<PickList[]>(`/picklist/findAll`, {
      headers: {
        Authorization: token + "",
      },
    });

    return response;
  } catch (error) {
    return ServiceResult.failed(null, "Something went wrong");
  }
};

export const getDistinctPickLists = async (): Promise<any | null> => {
  try {
    const token = await Storage.getItem(LOCALSTORAGE.ACCESS_TOKEN);
    const httpClient = new HttpClient(ENV.API_URL);

    const response = await httpClient.get<any>(
      `/picklist/get-distinct?pageNumber=1&pageSize=100&orderByColumn=picklist_name&sortOrder=ASC&searchCriteria={"is_distinct":%20"true"}`,
      {
        headers: {
          Authorization: token + "",
        },
      }
    );

    if (response.status === HttpStatus.SUCCESS && response.data) {
      return response.data.data;
    } else {
      return null;
    }
  } catch (error) {
    return null;
  }
};

export const getPickListsItems = async (
  plName: string,
  status: boolean = false
) => {
  try {
    const token = await Storage.getItem(LOCALSTORAGE.ACCESS_TOKEN);
    const httpClient = new HttpClient(ENV.API_URL);

    const queryUrl =
      status === false
        ? `/picklist/search?pageNumber=1&pageSize=100&orderByColumn=id&sortOrder=ASC&picklist_name=${plName}`
        : `/picklist/search?pageNumber=1&pageSize=100&orderByColumn=id&sortOrder=ASC&picklist_name=${plName}&is_active=${status}`;

    const response = await httpClient.get<SearchResultType<PickListItemType>>(
      queryUrl,
      {
        headers: {
          Authorization: token + "",
        },
      }
    );

    if (response.status === HttpStatus.SUCCESS && response.data) {
      return response.data.data;
    } else {
      return null;
    }
  } catch (error) {
    return null;
  }
};

export const createNewPickListItem = async (item: CreatePickListItemType) => {
  try {
    const token = await Storage.getItem(LOCALSTORAGE.ACCESS_TOKEN);
    const httpClient = new HttpClient(ENV.API_URL);

    const response = await httpClient.put<any, any>(`/picklist`, item, {
      headers: {
        Authorization: token + "",
      },
    });

    return response;
  } catch (error) {
    return ServiceResult.failed(null, "Something went wrong");
  }
};

export const updateAPickListById = async (payload: CreatePickListItemType) => {
  try {
    const token = await Storage.getItem(LOCALSTORAGE.ACCESS_TOKEN);
    
    const httpClient = new HttpClient(ENV.API_URL);
    const response = await httpClient.post<any, any>(
      `/picklist/edit`,
      {
        picklist_ar_label: payload.picklist_ar_label,
        picklist_en_label: payload.picklist_en_label,
        picklist_code: payload.picklist_code,
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

export const activateDeactivatePL = async (code: string, status: boolean) => {
  try {
    const token = await Storage.getItem(LOCALSTORAGE.ACCESS_TOKEN);
    const httpClient = new HttpClient(ENV.API_URL);

    const response = await httpClient.get<any>(
      `/picklist/enable?picklist_code=${code}&is_enable=${status}`,
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

export const deleteAPickList = async (id: number) => {
  try {
    const token = await Storage.getItem(LOCALSTORAGE.ACCESS_TOKEN);
    const httpClient = new HttpClient(ENV.API_URL);

    const response = await httpClient.delete<any>(`/picklist/delete/${id}`, {
      headers: {
        Authorization: token + "",
      },
    });

    return response;
  } catch (error) {
    return ServiceResult.failed(null, "Something went wrong");
  }
};
