import { z } from "zod";
import { correspondenceDTOSchema } from "../../../pages/create-inbound/types";

export const correspondenceUploadResponseSchema = z.object({
  error: z.boolean(),
  messageType: z.string(),
  code: z.number(),
  status: z.string(),
  message: z.string(),
  timestamp: z.string(),
  data: z.array(correspondenceDTOSchema),
});

export type corrUploadResponseType = z.infer<
  typeof correspondenceUploadResponseSchema
>;

export const getCorrespondenceSchema = z.object({
  error: z.boolean(),
  messageType: z.string(),
  code: z.number(),
  status: z.string(),
  message: z.string(),
  timestamp: z.string(),
  data: z.array(correspondenceDTOSchema),
  pageDetails: z.object({
    pageNumber: z.number(),
    pageSize: z.number(),
    orderByColumn: z.string(),
    sortOrder: z.string(),
    totalCount: z.number(),
  }),
});

export type CorrespondenceSearchResultType = z.infer<
  typeof getCorrespondenceSchema
>;

export interface SearchResultType<T> {
  error: boolean;
  messageType: string;
  code: string;
  status: string;
  message: string;
  timestamp: string;
  data: T[];
  pageDetails: {
    pageNumber: number;
    pageSize: number;
    orderByColumn: string;
    sortOrder: string;
    totalCount: number;
  };
}
