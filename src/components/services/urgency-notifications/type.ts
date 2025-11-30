import { z } from "zod";

const urgencyNotificationPickListSchema = z.object({
  id: z.number(),
  pickListId: z.number(),
  picklistName: z.string(),
  picklistCode: z.string(),
  picklistEnLabel: z.string(),
  picklistArLabel: z.string(),
  abbreviation: z.string().nullable(),
  orgUnitRoot: z.string().nullable(),
  picklistType: z.string(),
  isSystem: z.boolean(),
  isActive: z.boolean(),
  actionDuration: z.number(),
  durationUnit: z.string(),
  notificationFrequency: z.number(),
});

export type UrgencyNotificationPickListType = z.infer<
  typeof urgencyNotificationPickListSchema
>;

export const createUrgencySchema = z.object({
  picklistArLabel: z.string(),
  picklistEnLabel: z.string(),
  isActive: z.boolean().optional(),
  isSystem: z.boolean().optional(),
  picklistName: z.string().optional(),
  picklistType: z.string().optional(),
  actionDuration: z
    .string()
    .regex(/^[0-9]$/, "Enter digits only")
    .min(1, "At least one digits should be there")
    .max(2, "The length of value to too long"),
  durationUnit: z.string(),
  notificationFrequency: z
    .string()
    .regex(/^[0-9]$/, "Enter digits only")
    .min(1, "At least one digits should be there")
    .max(2, "The length of value to too long"),
});

export type CreateUrgencyType = z.infer<typeof createUrgencySchema>;
