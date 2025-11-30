import { z } from "zod";

export const delegationSearchSchema = z.object({
  date_from: z.string().optional(),
  date_to: z.string().optional(),
  delegate_to_user_id: z.number().optional(),
  delegator_user_id: z.number().optional(),
  is_arabic: z.boolean().optional(),
  status: z.number().optional(),
});

export type DelegationType = z.infer<typeof delegationSearchSchema>;

export const createDelegationSchema = z.object({
  delegate_to_user_id: z.number().optional(),
  delegator_user_id: z.number().min(1),
  delegate_all: z.boolean(),
  date_from: z.string().min(1),
  date_to: z.string().min(1),

  // orgs: z.array(z.number()),
  // security: z.array(z.number()),
  // docs: z.array(z.number()),
  // keywards: z.array(z.string()),
});

export type CreateDelegationAdminType = z.infer<typeof createDelegationSchema>;
