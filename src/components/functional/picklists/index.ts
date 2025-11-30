import { PickList, PickListType } from "@/components/services/picklist/type";
import PICK_LIST_NAME from "../../../constants/app-constants/pick-list-name";
import LOCALSTORAGE from "../../../constants/local-storage";
import Storage from "../../../lib/storage";
import {
  PickListItemType,
  getPickListsItems,
  getRoutingReqActions,
} from "../../../pages/pick-lists/service";

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
      LOCALSTORAGE.PL_CORRESPONDENCE_TYPES
    );

    if (plValue) {
      return plValue;
    } else {
      const response = await getPickListsItems(
        PICK_LIST_NAME.CORRESPONDENCE_TYPE,
        true
      );

      if (response) {
        Storage.setItem(LOCALSTORAGE.PL_CORRESPONDENCE_TYPES, response);
        return response;
      }

      return [];
    }
  }

  public static async securityLevels(): Promise<PickListItemType[]> {
    const plValue = Storage.getItem<PickListItemType[]>(
      LOCALSTORAGE.PL_SECURITY_LEVEL
    );

    if (plValue) {
      return plValue;
    } else {
      const response = await getPickListsItems(
        PICK_LIST_NAME.SECURITY_LEVEL,
        true
      );

      if (response) {
        Storage.setItem(LOCALSTORAGE.PL_SECURITY_LEVEL, response);
        return response;
      }

      return [];
    }
  }

  public static async urgencyLevel(): Promise<PickListItemType[]> {
    const plValue = Storage.getItem<PickListItemType[]>(
      LOCALSTORAGE.PL_URGENCY_LEVEL
    );

    if (plValue) {
      return plValue;
    } else {
      const response = await getPickListsItems(
        PICK_LIST_NAME.URGENCY_LEVEL,
        true
      );

      if (response) {
        Storage.setItem(LOCALSTORAGE.PL_URGENCY_LEVEL, response);
        return response;
      }

      return [];
    }
  }

  public static async documentType(): Promise<PickListItemType[]> {
    const plValue = Storage.getItem<PickListItemType[]>(
      LOCALSTORAGE.PL_DOCUMENT_TYPE
    );

    if (plValue) {
      return plValue;
    } else {
      const response = await getPickListsItems(
        PICK_LIST_NAME.DOCUMENT_TYPE,
        true
      );

      if (response) {
        Storage.setItem(LOCALSTORAGE.PL_DOCUMENT_TYPE, response);
        return response;
      }

      return [];
    }
  }

  public static async outboundType(): Promise<PickListItemType[]> {
    const plValue = Storage.getItem<PickListItemType[]>(
      LOCALSTORAGE.PL_OUTBOUND_TYPE
    );

    if (plValue) {
      return plValue;
    } else {
      const response = await getPickListsItems(
        PICK_LIST_NAME.OUTBOUND_TYPES,
        true
      );

      console.log("the response", response);

      if (response) {
        Storage.setItem(LOCALSTORAGE.PL_OUTBOUND_TYPE, response);
        return response;
      }

      return [];
    }
  }

  public static async physicalAttachmentType(): Promise<PickListItemType[]> {
    const plValue = Storage.getItem<PickListItemType[]>(
      LOCALSTORAGE.PL_PHYSICAL_ATTACHMENT_TYPE
    );

    if (plValue) {
      return plValue;
    } else {
      const response = await getPickListsItems(
        PICK_LIST_NAME.PHYSICAL_ATTACHMENT_TYPE,
        true
      );

      if (response) {
        Storage.setItem(LOCALSTORAGE.PL_PHYSICAL_ATTACHMENT_TYPE, response);
        return response;
      }

      return [];
    }
  }

  public static async language(): Promise<PickListItemType[]> {
    const plValue = Storage.getItem<PickListItemType[]>(
      LOCALSTORAGE.PL_LANGUAGE
    );

    if (plValue) {
      return plValue;
    } else {
      const response = await getPickListsItems(PICK_LIST_NAME.LANGUAGE, true);

      if (response) {
        Storage.setItem(LOCALSTORAGE.PL_LANGUAGE, response);
        return response;
      }

      return [];
    }
  }

  public static async stampOptions(): Promise<PickListItemType[]> {
    const plValue = Storage.getItem<PickListItemType[]>(
      LOCALSTORAGE.PL_STAMP_OPTIONS
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
      LOCALSTORAGE.PL_OUTBOUND_SENDING_TYPE
    );

    if (plValue) {
      return plValue;
    } else {
      const response = await getPickListsItems(
        PICK_LIST_NAME.OUTBOUND_SENDING_TYPE,
        true
      );

      if (response) {
        Storage.setItem(LOCALSTORAGE.PL_OUTBOUND_SENDING_TYPE, response);
        return response;
      }

      return [];
    }
  }

  public static async requiredActions(): Promise<PickListItemType[]> {
    const plValue = Storage.getItem<PickListItemType[]>(
      LOCALSTORAGE.PL_REQUIRED_ACTIONS
    );

    if (plValue) {
      return plValue;
    } else {
      const response = await getPickListsItems(
        PICK_LIST_NAME.REQUIRED_ACTION,
        true
      );

      if (response) {
        Storage.setItem(LOCALSTORAGE.PL_REQUIRED_ACTIONS, response);
        return response;
      }

      return [];
    }
  }

  public static async rejectStatusPL(): Promise<PickListItemType[]> {
    const plValue = Storage.getItem<PickListItemType[]>(
      LOCALSTORAGE.PL_REJECTION_REASON
    );

    if (plValue) {
      return plValue;
    } else {
      const response = await getPickListsItems(
        PICK_LIST_NAME.REJECTION_REASON,
        true
      );

      if (response) {
        Storage.setItem(LOCALSTORAGE.PL_REJECTION_REASON, response);
        return response;
      }

      return [];
    }
  }

  public static async routeRequiredActions(): Promise<PickListItemType[]> {
    const plValue = Storage.getItem<PickListItemType[]>(
      LOCALSTORAGE.PL_ROUTE_REQUIRED_ACTIONS
    );

    if (plValue) {
      return plValue;
    } else {
      const response = await getRoutingReqActions();

      if (response) {
        Storage.setItem(LOCALSTORAGE.PL_ROUTE_REQUIRED_ACTIONS, response);
        return response;
      }

      return [];
    }
  }

  public static async approvalSubType(): Promise<PickListItemType[]> {
    const plValue = Storage.getItem<PickListItemType[]>(
      LOCALSTORAGE.PL_APPROVAL_SUBTYPE
    );

    if (plValue) {
      return plValue;
    } else {
      const response = await getPickListsItems(
        PICK_LIST_NAME.APPROVAL_SUBTYPE,
        true
      );

      if (response) {
        Storage.setItem(LOCALSTORAGE.PL_APPROVAL_SUBTYPE, response);
        return response;
      }

      return [];
    }
  }
}

export const filterOutDisctinctPickListItems = (
  allItmes: PickList[]
): PickListType[] => {
  const seen = new Map<string, PickList>();

  allItmes.forEach((item) => {
    if (!seen.has(item.picklist_name)) {
      seen.set(item.picklist_name, item);
    }
  });

  const distinctPLS = Array.from(seen.values()).map((item) => {
    return {
      picklistName: item.picklist_name,
      picklistType: item.picklist_type,
    };
  });

  return distinctPLS;
};

export const getPickListsItemsByName = (
  allPLs: PickList[],
  plName: string
): PickList[] => {
  const filteredPLs = allPLs.filter((item) => item.picklist_name === plName);

  if (filteredPLs.length > 0) {
    return filteredPLs;
  } else {
    return [];
  }
};
