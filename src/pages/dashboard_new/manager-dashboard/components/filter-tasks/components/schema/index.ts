import { z } from "zod";

export const filterTasksFormSchema = z.object({
  assignee: z.number().int().optional(),
  entity_id: z.number().int().optional(),
  is_task_breach: z.boolean(),
  process_type_id: z.number().int().optional(),
  task_type_id: z.number().int().optional(),
});
export type FilterTasksFormType = z.infer<typeof filterTasksFormSchema>;
