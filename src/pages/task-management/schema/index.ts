import { z } from "zod";

export const searchTaskManagementSchema = z.object({
  from: z.number(),
  to: z.number(),
  correspondenceNo: z.string(),
  currentUser: z.number(),
  isDelegatedBefore: z.boolean(),
  isPostponedBefore: z.boolean(),
});

export type SearchTaskManagementType = z.infer<
  typeof searchTaskManagementSchema
> & {
  taskName: string;
  taskStateDate: string;
  taskDueDate: string;
  postponedToDate: string;
  postponedEndDate: string;
  id: number;
};
