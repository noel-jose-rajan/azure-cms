import { z } from "zod";

export const pickListSchema = z.object({
  picklistName: z.string().min(1, "Please enter your PickList Name!"),
  picklistType: z
    .string()
    .min(1, "Please select a PickList Type")
    .max(50, "The picklist name is too long!"),
});

export const picklistSchema = z.object({
  picklist_code: z.string(),
  picklist_type: z.string(),
  picklist_id: z.number(),
  picklist_en_label: z.string(),
  picklist_ar_label: z.string(),
  is_enable: z.boolean(),
  enable_change: z.boolean(),
  picklist_name: z.string(),
});

export type PickList = z.infer<typeof picklistSchema>;

export const picklistItemSchema = z.object({
  pickListId: z.number(),
  picklistName: z.string(),
  picklistCode: z.string(),
  picklistEnLabel: z.string(),
  picklistArLabel: z.string(),
  abbreviation: z.string().nullable(),
  orgUnitRoot: z.string(),
  picklistType: z.string(),
  isSystem: z.any(),
  isActive: z.any(),
  links: z.array(z.any()).optional(),
});

export const createPickListSchema = z.object({
  picklist_ar_label: z
    .string()
    .min(2, "Please enter your PickList Arabic Name!")
    .max(50, "The picklist english name is too long!"),
  picklist_en_label: z
    .string()
    .min(2, "Please enter your PickList English Name!")
    .max(50, "The picklist arabic name is too long!"),
  picklist_code: z.string().min(1, "Please enter your PickList Code!"),
  picklist_name: z.string(),
  picklist_id: z.number().optional(),
});

export type CreatePickListItemType = z.infer<typeof createPickListSchema>;
export type PickListType = z.infer<typeof pickListSchema>;
export type PickListItemType = z.infer<typeof picklistItemSchema>;
