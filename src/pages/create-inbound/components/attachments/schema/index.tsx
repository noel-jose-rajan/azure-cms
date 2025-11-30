import { z } from "zod";

export const createElectronicAttachmentListSchema = z.object({
  description: z.string(),
  document_type_id: z.number(),
  id: z.number(),
  attachment_name: z.string(),
  fileSize: z.number(),
  file: z.any(),
});

export type CreateElectronicAttachmentType = z.infer<
  typeof createElectronicAttachmentListSchema
>;

export type ElectronicAttachment = {
  ID: number;
  CorrID: number;
  DocumentTypeID: number;
  AttachmentName: string;
  Description: string;
  FileExtension: string;
  CreatedBy: string;
  CreatedAt: string;
};

const attachmentMessages = {
  en: {
    attachmentName: "Attachment name is required",
    description: "Description is required",
    attachmentTypeID: "Please select an attachment type",
    quantity: "Only numbers are allowed",
  },
  ar: {
    attachmentName: "اسم المرفق مطلوب",
    description: "الوصف مطلوب",
    attachmentTypeID: "يرجى اختيار نوع المرفق",
    quantity: "يُسمح بالأرقام فقط",
  },
};

export const getPhysicalAttachmentSchema = (lang: "en" | "ar") => {
  const t = attachmentMessages[lang];

  return z.object({
    attachmentName: z
      .string({ message: t.attachmentName })
      .min(1, { message: t.attachmentName }),
    description: z
      .string({ message: t.description })
      .min(1, { message: t.description }),
    attachmentTypeID: z
      .number({ message: t.attachmentTypeID })
      .min(1, { message: t.attachmentTypeID }),
    quantity: z
      .string()
      .regex(/^\d+$/, { message: t.quantity })
      .min(1, { message: t.quantity }),
  });
};

const createPhysicalAttachmentSchema = getPhysicalAttachmentSchema("en");

// export const createPhysicalAttachmentSchema = z.object({
//   attachmentName: z.string(),
//   description: z.string(),
//   attachmentTypeID: z.number(),
//   quantity: z.string().regex(/^\d+$/, "Only numbers are allowed"),
// });

export type CreatePhysicalAttachmentType = z.infer<
  typeof createPhysicalAttachmentSchema
>;

export type PhysicalAttachment = {
  ID: number;
  CorrID: number;
  AttachmentTypeID: number;
  AttachmentName: string;
  Description: string;
  Quantity: number;
  CreatedBy: string;
  CreatedAt: string;
  IsDeleted: any;
};
