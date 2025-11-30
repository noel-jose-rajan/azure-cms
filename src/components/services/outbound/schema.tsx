import { z } from "zod";

export const createDraftOutboundSchema = z.object({
  corr_subject: z.string().min(1),
  sending_entity: z.number().min(1),
  outbound_type: z.number().min(1),
  template_id: z.number().nullish(),
  file: z.any(),
});

export type DraftOutboundType = z.infer<typeof createDraftOutboundSchema>;

export const createDraftInboundSchema = z.object({
  corr_subject: z.string().min(1),
  sending_entity: z.number().min(1),
  receiving_entity: z.number().nullish(),
  file: z.any(),
});

export type DraftInboundType = z.infer<typeof createDraftInboundSchema>;

export type ReplyCorrespondenceType = {
  id: number;
  corr_subject: string;
  sending_entity: number;
  outbound_type: number;
};
