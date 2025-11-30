import { z } from "zod";

export const SearchRelatedCorrespondenceSchema = z.object({
  corr_subject: z.string(),
  correspondence_no: z.string(),
});

export type SearchRelatedCorrespondenceType = z.infer<
  typeof SearchRelatedCorrespondenceSchema
>;
