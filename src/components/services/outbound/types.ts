import { z } from "zod";

export const RelatedCorrSchema = z.object({
  id: z.number(),
  corr_subject: z.string(),
  correspondence_no: z.string(),
});
export interface DraftCorrespondenceType {
  agent_from: string;
  agent_personal_id: string;
  agent_phone: string;
  agent_to: string;
  audit_user_id: number;
  content_type: string;
  corr_language_id: number;
  corr_status_id: number;
  corr_subject: string;
  corr_type_id: number;
  correspondence_date: string;
  correspondence_no: string;
  doc_type_id: number;
  document_barcode: string;
  external_reference_no: string;
  final_approval_entity_id: number;
  final_approval_sign_date: string;
  final_approval_user_id: number;
  has_attachment: true;
  id: number;
  inbound_source_id: number;
  index_user_id: number;
  is_final_approva: true;
  keywords: string[];
  outbound_sending_type_id: number;
  outbound_template_id: number;
  outbound_type_id: number;
  owner_id: number;
  receiving_entity_id: number;
  remarks: string;
  reply_correspondence_no: string;
  scan_user_id: number;
  security_level_id: number;
  sending_entity_id: number;
  sent_date: string;
  stamp_type_id: number;
  urgency_id: number;
  user_cc: number[];
  internal_cc: number[];
  external_cc: number[];
  is_multi_receiving: boolean;
  receiving_entities: number[];
}

export interface ListCorrespondenceType {
  CorrId: string;
  Version: number;
  Subject: string | null;
  CorrespondenceNo: string | null;
  TotalCount: number;
  CreatedDate: string;
}

export interface DraftCorrespondenceDataType {
  items: DraftCorrespondenceType[];
  limit: number;
  page: number;
  total: number;
}

export interface CreateResponse<T> {
  messageType: string;
  code: number;
  status: string;
  message: string;
  timestamp: string;
  data: T[];
  details_en: ErrorMessageType[];
  details_ar: ErrorMessageType[];
}

export interface ErrorMessageType {
  desc: string;
  language: string;
}

export const correspondenceCreateSchema = z.object({
  id: z.number().optional(),
  corr_subject: z.string().min(1, "Subject is required"),
  sending_entity_id: z.number().min(1, "Outbound sending type is required"),
  // Required ID fields (assuming they come from a select/picklist)
  corr_language_id: z.number().min(1, "Language is required"),
  outbound_type_id: z.number().min(1, "Correspondence type is required"),
  stamp_type_id: z.number().min(1, "Stamp type is required"),
  doc_type_id: z.number().min(1, "Document type is required"),
  receiving_entity_id: z.number().min(1, "Receiving entity is required"),
  receiving_entities_id: z.array(z.number()),
  security_level_id: z.number().min(1, "Security level is required"),
  urgency_id: z.number().min(1, "Urgency is required"),
  // Optional string fields
  external_reference_no: z.string().optional(),
  remarks: z.string().optional(),
  // Arrays for CC's and keywords, can be optional
  cc_external: z.array(z.number()).optional(),
  cc_internal: z.array(z.number()).optional(),
  cc_users: z.array(z.number()).optional(),
  keywords: z.array(z.string()).optional(),
  related: z.array(z.number()).optional(),
  related_details: z.array(RelatedCorrSchema).optional(),
});

export type CreateCorrespondenceType = z.infer<
  typeof correspondenceCreateSchema
>;

export type RelatedCorr = z.infer<typeof RelatedCorrSchema>;
