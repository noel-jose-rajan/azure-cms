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
  accessRights: z.nullable(z.any()),
  corrId: z.string(),
  contentRepositoryId: z.string(),
  contentChornicalId: z.nullable(z.any()),
  docTypePickListCode: z.nullable(z.any()),
  securityLevelPickListCode: z.nullable(z.any()),
  urgencyPickListCode: z.nullable(z.any()),
  stampTypePickListCode: z.nullable(z.any()),
  outboundTypePickListCode: z.nullable(z.any()),
  corrStatusPickListCode: z.string(),
  corrTypePickListCode: z.string(),
  outboundTemplateName: z.nullable(z.any()),
  inboundSourcePickListCode: z.string(),
  receivingAnnonucementEntityPickListCode: z.nullable(z.any()),
  externalSendingEntityCode: z.string(),
  internalSendingEntityCode: z.nullable(z.any()),
  workFlowIntaited: z.boolean(),
  receivingOrganizationUnitsCodes: z.array(z.any()),
  receivingExternalEntitiesCodes: z.nullable(z.any()),
  receivingdbGroupsCodes: z.nullable(z.any()),
  receivingdbGroupsDto: z.nullable(z.any()),
  relatedCorrespondenceIds: z.array(z.any()),
  ccInternalCodes: z.array(z.string()),
  ccExternalCodes: z.nullable(z.any()),
  documentKeyword: z.array(z.string()),
  agentFrom: z.string(),
  agentPersonalId: z.string(),
  agentPhone: z.string(),
  agentTo: z.string(),
  attachmentFolder: z.string(),
  attachmentFound: z.boolean(),
  barcodeFileTitle: z.string(),
  barcodeUnit: z.string(),
  boxId: z.string(),
  correspondenceDate: z.nullable(z.any()),
  correspondenceLanguage: z.string(),
  correspondenceNo: z.string(),
  replyCorrespondenceId: z.nullable(z.any()),
  replyCorrespondenceNo: z.nullable(z.any()),
  intiator: z.nullable(z.any()),
  custom1: z.string(),
  custom2: z.string(),
  custom3: z.string(),
  custom4: z.string(),
  custom5: z.string(),
  custom6: z.string(),
  custom7: z.string(),
  documentBarcode: z.string(),
  subject: z.string(),
  excpectedResponseDate: z.nullable(z.any()),
  externalReferenceNo: z.string(),
  fileCode: z.string(),
  fileReference: z.string(),
  fileYear: z.string(),
  isAnnouncement: z.boolean(),
  isBacklog: z.boolean(),
  isInternal: z.boolean(),
  isDeleted: z.boolean(),
  recievedStatus: z.boolean(),
  isMigrated: z.boolean(),
  needResponse: z.boolean(),
  reveiveAcknowledge: z.boolean(),
  locBarcode: z.string(),
  attachReceivedUserId: z.string(),
  referenceNo: z.nullable(z.any()),
  remarks: z.array(z.string()),
  ccUsers: z.array(z.string()),
  ccUsersDto: z.nullable(z.array(ccUserDTOSchema)),
  finalApproverUserId: z.nullable(z.any()),
  finalApproverOrgUnit: z.nullable(z.any()),
  responseDate: z.nullable(z.any()),
  shelfNo: z.string(),
  signDate: z.nullable(z.any()),
  sentDate: z.nullable(z.any()),
  tempSignedId: z.string(),
  outboundSignDate: z.nullable(z.any()),
  acceptanceDate: z.nullable(z.any()),
  acceptedBy: z.string(),
  indexUserId: z.string(),
  recieveDate: z.nullable(z.any()),
  scanUserId: z.string(),
  auditUserId: z.nullable(z.any()),
  createdDate: z.string(),
  modifiedBy: z.string(),
  lastChangedDate: z.nullable(z.any()),
  ownerUserId: z.string(),
  aclId: z.number(),
  opentextIntegrated: z.boolean(),
  approvals: z.array(z.any()),
  hasApprovals: z.boolean(),
  notify: z.boolean(),
  backlog: z.boolean(),
  announcement: z.boolean(),
  internal: z.boolean(),
  migrated: z.boolean(),
  outboundSendingTypePickListCode: z.nullable(z.any()),
});

export const correspondenceSchema = z.object({
  correspondenceDTO: correspondenceDTOSchema,
  genericActionDTO: z.object({
    readReceipt: z.boolean(),
  }),
});

export type CorrespondenceDTOType = z.infer<typeof correspondenceDTOSchema>;

export type CorrespondenceType = z.infer<typeof correspondenceSchema>;

const accessRightsSchema = z.object({
  key: z.string(),
  description: z.string(),
});

const electronicsAttachmentSchema = z.object({
  accessRights: z.array(accessRightsSchema),
  electronicAttachmentId: z.number(),
  name: z.string(),
  description: z.string(),
  createdDate: z.string(),
  conentRepositoryId: z.string(),
  documentTypePickListCode: z.string(),
  ownerUser: z.string(),
  fileExtension: z.string(),
  corrId: z.string(),
  ownerDescription: z.string(),
  isDeleted: z.boolean(),
  links: z.array(z.any()),
});

const sortSchema = z.object({
  direction: z.string(),
  property: z.string(),
  ignoreCase: z.boolean(),
  nullHandling: z.string(),
  ascending: z.boolean(),
});

export const ElectronicAttachmentResponseSchema = z.object({
  content: z.array(electronicsAttachmentSchema),
  totalElements: z.number(),
  totalPages: z.number(),
  last: z.boolean(),
  size: z.number(),
  number: z.number(),
  sort: z.array(sortSchema),
  numberOfElements: z.number(),
  first: z.boolean(),
});

export type AccessRightsType = z.infer<typeof accessRightsSchema>;
export type ElectronicAttachmentType = z.infer<
  typeof electronicsAttachmentSchema
>;
export type SortType = z.infer<typeof sortSchema>;
export type ElectronicAttachmentResponseType = z.infer<
  typeof ElectronicAttachmentResponseSchema
>;

const physicalAttachmentSchema = z.object({
  accessRights: z.array(accessRightsSchema),
  physicalAttachmentId: z.number(),
  corrId: z.string(),
  description: z.string(),
  quantity: z.number(),
  physicalAttachmentTypePickListCode: z.string(),
  createdDate: z.string(),
  recievedStatus: z.boolean(),
  ownerId: z.string(),
  ownerDescription: z.string(),
  isDeleted: z.boolean(),
  links: z.array(z.any()),
});

export const PhysicalAttachmentResponseSchema = z.object({
  content: z.array(physicalAttachmentSchema),
  totalElements: z.number(),
  totalPages: z.number(),
  last: z.boolean(),
  size: z.number(),
  number: z.number(),
  sort: z.array(sortSchema),
  numberOfElements: z.number(),
  first: z.boolean(),
});

export type PhysicalAttachmentsType = z.infer<typeof physicalAttachmentSchema>;
export type PhysicalAttachmentResponseType = z.infer<
  typeof PhysicalAttachmentResponseSchema
>;

const attachmentHistorySchema = z.object({
  attachmentHistoryId: z.number(),
  attachmentId: z.number(),
  performerUserDescription: z.string(),
  performerUserId: z.string(),
  correspondenceId: z.string(),
  performerActionPickListLabel: z.string(),
  performerActionPickListCode: z.string(),
  performerComment: z.string(),
  lastRepositoryId: z.nullable(z.any()),
  lastName: z.nullable(z.any()),
  lastFileExtension: z.nullable(z.any()),
  actionDate: z.string(),
  isPhysical: z.boolean(),
});

export type AttachmentHistoryType = z.infer<typeof attachmentHistorySchema>;

export const createPhysicalAttachmentSchema = z.object({
  corrId: z.string(),
  description: z.string().min(2, "Please enter the description"),
  physicalAttachmentTypePickListCode: z.string({
    message: "Please select the attachmentType",
  }),
  quantity: z.string().regex(/^\d+$/, "Only numbers are allowed"),
});

export type CreatePhysicalAttachmentType = z.infer<
  typeof createPhysicalAttachmentSchema
>;

export const updateElectronicAttachmentSchema = z.object({
  description: z.string().nullable(),
  documentTypePickListCode: z.string({
    message: "Please select the document Type",
  }),
  name: z
    .string({
      message: "Please enter a valid name",
    })
    .min(5, "Please enter a valid name"),
});

export type UpdateElectronicAttachmentType = z.infer<
  typeof updateElectronicAttachmentSchema
>;
