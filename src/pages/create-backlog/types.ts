import { z } from "zod";

export const ccUserDTOSchema = z.object({
  loginName: z.string(),
  userId: z.string(),
  userDescription: z.string(),
  language: z.string(),
  isDelegator: z.boolean(),
  delegatorUsername: z.nullable(z.string()),
  delegationId: z.number(),
  grantedAuthorityIDs: z.nullable(z.string()),
  applicationProfiles: z.nullable(z.any()),
});

export const correspondenceDTOSchema = z.object({
  inbound_date: z.string(),
  correspondence_number: z.string(),
  related_reference_number: z.string(),
  sign_date: z.string(),
  acceptance_date: z.string(),
  correspondance_person: z.string(),
  receiving_group: z.string(),
  correspondanc_date: z.string(),
  urgency_level: z.string(),
  remarks: z.string(),
  subject: z.string(),
  document_type: z.string(),
  receiving_entity: z.string(),
  correspondance_creation_date: z.string(),
  cc_internal_entity: z.string(),
  receiving_entities: z.string(),
  external_reference_number: z.string(),
  sending_entity: z.string(),
  accepted_by: z.string(),
  correspondance_type: z.string(),
  language: z.string(),
  archieve_number: z.string(),
  document_title: z.string(),
  file_date: z.string(),
  file_type: z.string(),
  trading_id: z.string(),
  backlogNodeType: z.string(),
});

export const correspondenceSchema = z.object({
  correspondenceDTO: correspondenceDTOSchema,
  genericActionDTO: z.object({
    readReceipt: z.boolean(),
  }),
});

export type CorrespondenceDTOType = z.infer<typeof correspondenceDTOSchema>;

export type CorrespondenceType = z.infer<typeof correspondenceSchema>;

export const contractTypesSchema = z.object({
  entry: z.object({
    includedInSupertypeQuery: z.boolean(),
    isContainer: z.boolean(),
    model: z.object({
      id: z.string(),
      author: z.string(),
      description: z.string(),
      namespaceUri: z.string(),
      namespacePrefix: z.string(),
    }),
    id: z.string(),
    title: z.string().nullable(),
    parentId: z.string().nullable(),
  }),
});

export const contractDocumentTypeResponseSchema = z.object({
  list: z.object({
    pagination: z.object({
      count: z.number(),
      hasMoreItems: z.boolean(),
      totalItems: z.number(),
      skipCount: z.number(),
      maxItems: z.number(),
    }),
    entries: z.array(contractTypesSchema),
  }),
});

export type ContractDocumentType = z.infer<typeof contractTypesSchema>;

export type ContractDocumentResponseType = z.infer<
  typeof contractDocumentTypeResponseSchema
>;

export const contentSchema = z.object({
  mimeType: z.string(),
  mimeTypeName: z.string(),
  sizeInBytes: z.number(),
  encoding: z.string(),
});

export const modifiedUserSchema = z.object({
  id: z.string(),
  displayName: z.string(),
});

export const fileCreateResponseSchema = z.object({
  entry: z.object({
    isFile: z.boolean(),
    createdByUser: modifiedUserSchema,
    modifiedAt: z.string(),
    nodeType: z.string(),
    content: contentSchema,
    parentId: z.string(),
    aspectNames: z.array(z.string()),
    createdAt: z.string(),
    isFolder: z.boolean(),
    modifiedByUser: modifiedUserSchema,
    name: z.string(),
    id: z.string(),
    properties: z.object({
      "dms:file_type": z.string(),
      "dms:archieve_number": z.string(),
      "dms:file_date": z.string(),
      "dms:document_title": z.string(),
      "dms:trading_id": z.string(),
    }),
  }),
});

export type FileCreateResponseType = z.infer<typeof fileCreateResponseSchema>;

///////////------------- correspondence outbound

// cmd:keywords
// cmd:sending_entity
// cmd:subject
// cmd:urgency_level
// cmd:language
// cmd:external_reference_number
// cmd:receiving_entity
// cmd:received_date
// cmd:related_reference_number
// cmd:cc_internal_entity
// cmd:receiving_entities
// cmd:correspondanc_date
// cmd:document_type
// cmd:correspondence_number
// cmd:cc_external_entity
// cmd:inbound_date
// cmd:correspondance_creation_date
// cmd:sent_date
// cmd:sign_date
// cmd:accepted_by
// cmd:acceptance_date
// cmd:security_level
// cmd:correspondance_person
// cmd:receiving_group
// cmd:correspondance_type
// cmd:document_barcode
// cmd:remarks

///////////------------- correspondence inbouns

// cmd:inbound_date
// cmd:correspondence_number
// cmd:related_reference_number
// cmd:sign_date
// cmd:acceptance_date
// cmd:correspondance_person
// cmd:receiving_group
// cmd:correspondanc_date
// cmd:urgency_level
// cmd:remarks
// cmd:subject
// cmd:document_type
// cmd:receiving_entity
// cmd:correspondance_creation_date
// cmd:cc_internal_entity
// cmd:receiving_entities
// cmd:external_reference_number
// cmd:sending_entity
// cmd:accepted_by
// cmd:correspondance_type
// cmd:language
