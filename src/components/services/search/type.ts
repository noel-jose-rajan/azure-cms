import { z } from "zod";

export const searchCorrespondenceSchema = z.object({
  corr_language_id: z.number().optional(),
  corr_status_id: z.number().optional(),
  corr_subject: z.string().optional(),
  corr_type_id: z.number().optional(),
  correspondence_date_from: z.string().optional(),
  correspondence_date_to: z.string().optional(),
  correspondence_no: z.string().optional(),
  doc_type_id: z.number().optional(),
  external_reference_no: z.string().optional(),
  has_attachment: z.boolean().optional(),
  is_arabic: z.boolean().optional(),
  is_sort_desc: z.boolean().optional(),
  keywords: z.array(z.string()).optional(),
  owner_id: z.number().optional(),
  receiving_entity_id: z.number().optional(),
  remarks: z.string().optional(),
  security_level_id: z.number().optional(),
  sending_entity_id: z.number().optional(),
  sort_by: z.string().optional(),
  urgency_id: z.number().optional(),
});

export type SearchCorrespondenceType = z.infer<
  typeof searchCorrespondenceSchema
>;

export interface CorrespondenceType {
  id: number;
  correspondence_no: string | null;
  corr_subject: string;
  sending_entity_id: number;
  sending_entity: string;
  correspondence_date: string;
  corr_status_id: number;
  corr_type_id: number;
  security_level_id: number;
  urgency_id: number;
  owner_id: number;
  owner_name: string;
  created_at: string;
  has_attachment: boolean;
  receiving_entity_id: number;
  receiving_entity: string;
}

export interface CorrSearchResultType {
  data: CorrespondenceType[];
  page: number;
  total_pages: number;
  total_group_by: {
    [x: string]: number;
  };
  total_records: number;
  sort_by: string;
  is_sort_desc: boolean;
}
