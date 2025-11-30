import { z } from "zod";
import apiRequest from "../../lib/api";
import { AxiosRequestConfig } from "axios";
import ENV from "../../constants/env";
import LOCALSTORAGE from "../../constants/local-storage";
import Storage from "../../lib/storage";

export const picklistItemSchema = z.object({
  pickListId: z.number(),
  picklistName: z.string(),
  picklistCode: z.string(),
  picklistEnLabel: z.string(),
  picklistArLabel: z.string(),
  abbreviation: z.string().nullable(),
  orgUnitRoot: z.string(),
  picklistType: z.string(),
  isSystem: z.enum(["true", "false"]),
  isActive: z.enum(["true", "false"]),
  links: z.array(z.any()).optional(),
});

export const createPickListSchema = z.object({
  isSystem: z.enum(["true", "false"]),
  isActive: z.enum(["true", "false"]),
  picklistArLabel: z
    .string()
    .min(2, "Please enter your PickList Arabic Name!")
    .max(50, "The picklist english name is too long!"),
  picklistEnLabel: z
    .string()
    .min(2, "Please enter your PickList English Name!")
    .max(50, "The picklist arabic name is too long!"),
  picklistName: z.string(),
  picklistType: z.string(),
  pickListId: z.number().optional(),
});

export type CreatePickListItemType = z.infer<typeof createPickListSchema>;

export type PickListItemType = z.infer<typeof picklistItemSchema>;

export const getPickListsItems = async (
  type: string,
  status: boolean = false
): Promise<PickListItemType[] | null> => {
  let token = await Storage.getItem(LOCALSTORAGE.LEGACY_ACCESS_TOKEN);
  const headers: AxiosRequestConfig["headers"] = {
    Authorization: `Bearer ${token}`,
  };

  const response = await apiRequest(
    "GET",
    `/pick-list/filter?name=${type}&isActive=${status}`,
    {},
    { headers },
    ENV.API_URL_LEGACY
  );

  if (response) {
    return (response as any).content;
  }

  return null;
};

export const getRoutingReqActions = async () => {
  try {
    let token = await Storage.getItem(LOCALSTORAGE.LEGACY_ACCESS_TOKEN);

    const headers: AxiosRequestConfig["headers"] = {
      Authorization: `Bearer ${token}`,
    };

    const response = await apiRequest(
      "GET",
      `/required-action-picklist/list`,
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
