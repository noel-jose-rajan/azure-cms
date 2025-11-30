import { RelatedCorrSchema } from "@/components/services/outbound/types";
import { z } from "zod";

export const InboundSchema = z.object({
  cc_internal: z.array(z.number()),
  cc_users: z.array(z.number()),
  corr_language_id: z.number(),
  corr_subject: z.string(),
  corr_type_id: z.number(),
  doc_type_id: z.number(),
  indexUserID: z.number(),
  keywords: z.array(z.string()),
  receiving_entity_id: z.number(),
  remarks: z.string(),
  scanUserID: z.number(),
  security_level_id: z.number(),
  urgency_id: z.number(),
  sending_entity_id: z.number(),
  related: z.array(z.number()).optional(),
  related_details: z.array(RelatedCorrSchema).optional(),

  inbound_source_id: z.number(),
  agent_from: z.string(),
  agent_personal_id: z.string(),
  agent_phone: z.string(),
  agent_to: z.string(),
  scan_user_id: z.number(),
  audit_user_id: z.number(),
  index_user_id: z.number(),
  document_barcode: z.string(),
  notify_me: z.boolean().optional(),
});
export type InboundType = z.infer<typeof InboundSchema>;
