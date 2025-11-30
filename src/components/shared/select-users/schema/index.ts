import { z } from "zod";

export const userSearchSchema = z.object({
  userLoginName: z.string(),
  userName: z.string(),
});

export type UserSearchType = z.infer<typeof userSearchSchema>;
