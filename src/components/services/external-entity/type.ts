import { z } from "zod";

export const phoneNumberRegex = /^\+?\d{1,3}(\(?\d{1,4}\)?\d{6,10})$/;

export const numberOnlyRegex = /^\d{2,10}$/;

const searchResultStatisticsSchema = z.object({
  resultStatistics: z.object({
    "Result Count": z.number(),
  }),
});

const externalEntitySchema = z.object({
  externalEntityId: z.number(),
  code: z.string(),
  email: z.string().nullable(),
  fax: z.string().nullable(),
  desc: z.string().nullable(),
  phone: z.string().nullable(),
  isActive: z.boolean(),
  descAr: z.string(),
  descEn: z.string(),
  shortName: z.string().nullable(),
  classifyPickListCode: z.string(),
  g2gCode: z.string().nullable(),
  g2gBranch: z.string().nullable(),
  links: z.array(z.any()),
});

const searchResultContentSchema = z.array(externalEntitySchema);

const entitySearchResultSchema = z.object({
  searchResultStatistics: searchResultStatisticsSchema,
  searchResultContent: searchResultContentSchema,
});

export const createExternalEntitySchema = z.object({
  classifyPickListCode: z.string({
    message: "Please select a External entity type",
  }),
  descAr: z
    .string()
    .min(2, "The External entity Arabic value is too short")
    .max(50, "The External entity Arabic value is too long"),
  descEn: z
    .string()
    .min(2, "The External entity english value is too short")
    .max(50, "The External entity english value is too long"),
  email: z.string().email().optional(),
  fax: z
    .string()
    .regex(phoneNumberRegex, {
      message: "Wrong phone format, use 0-9 + - . space",
    })
    .optional(),
  g2gCode: z.string().max(100, "Phone give code is too long").optional(),
  g2gBranch: z.string().optional(),
  shortName: z
    .string()
    .regex(numberOnlyRegex, {
      message: "Wrong Short number format, use 0-9",
    })
    .optional(),
  phone: z
    .string()
    .regex(phoneNumberRegex, {
      message: "Wrong phone format, use 0-9 + - . space",
    })
    .min(5, "Please enter valid number")
    .max(20, "Phone number is too long")
    .optional(),
  isActive: z.boolean().optional(),
  desc: z.string().optional(),
  externalEntityId: z.string().optional(),
});

export const fileUploadStatusSchema = z.object({
  failedRowsErrors: z.array(z.any()),
  logFileName: z.string(),
  noOfRows: z.number(),
  resultCode: z.number(),
  successfullyRows: z.number(),
});

const searchContentSchema = z.object({
  exact_match: z.array(externalEntitySchema),
  semi_match: z.array(externalEntitySchema),
});

const fieldValidationResultSchema = z.object({
  searchContent: searchContentSchema,
});

export type EntityFieldValidationType = z.infer<
  typeof fieldValidationResultSchema
>;

export type CreateExternalEntityType = z.infer<
  typeof createExternalEntitySchema
>;

export type ExternalEntityType = z.infer<typeof externalEntitySchema>;
export type EntitySearchResultType = z.infer<typeof entitySearchResultSchema>;
export type TemplateUploadStatusType = z.infer<typeof fileUploadStatusSchema>;

export interface DuplicateExternalEntityType {
  classify_pick_list_code: string;
  code: string;
  created_at: string;
  created_by: string;
  desc_ar: string;
  desc_en: string;
  description: string;
  email: string;
  fax: string;
  g2g_branch: string | null;
  g2g_code: string | null;
  id: number;
  is_active: boolean;
  phone: string;
  short_name: string;
}

export interface DuplicateSearchResultType<T> {
  error: boolean;
  code: number;
  status: string;
  message: string;
  timestamp: string;
  details_en: [
    {
      desc: string;
      language: string;
      exactMatches: T[];
      likeMatches: T[];
    }
  ];
  details_ar: [
    {
      desc: string;
      language: string;
      exactMatches: T[];
      likeMatches: T[];
    }
  ];
}
