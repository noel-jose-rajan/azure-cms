import { z } from "zod";

export interface SearchQuery {
  singleCriteria?: {
    finalApproverOrgUnitId?: number;
    correspondenceNo?: string;
    subject?: string;
    createdByMe?: boolean;
    isDeleted?: boolean;
    contentSearch?: boolean;
    externalReferenceNo?: string;
    barcode?: string;
    inboundSenderName?: string;
    correspondenceDateFrom?: string;
    correspondenceDateTo?: string;
    recieveDateFrom?: string;
    recieveDateTo?: string;
    createdDateFrom?: string;
    createdDateTo?: string;
    signDateFrom?: string;
    signDateTo?: string;
    sentDateFrom?: string;
    sentDateTo?: string;
    remarks?: string;
  };
  multiCriteria?: {
    statusPicklistIDs?: number[];
    securityPicklistIDs?: number[];
    urgencyPicklistIDs?: number[];
    documentTypePicklistIDs?: number[];
    keywords?: string[];
    recievingEntityIDs?: any[];
    sendingEntityIDs?: any[];
    relatedCorrespondenceIDs?: any[];
    outboundTypePicklistIDs?: number[];
  };
}

export interface ResultStatistics {
  resultStatistics: {
    ExternalOutboundCount: number;
    allResultCount: number;
    AnnouncementCount: number;
    ExternalInboundCount: number;
    InternalCount: number;
  };
}

export interface CountResultStatistics {
  resultStatistics: {
    "External Outbound Count": number;
    "all Result Count": number;
    "Announcement Count": number;
    "External Inbound Count": number;
    "Internal Count": number;
  };
}

export interface CorrespondenceType {
  corrId: string;
  contentRepositoryId: string | null;
  corrStatusPickListCode: string;
  corrStatusPickListDescription: string;
  corrTypePickListDescription: string;
  corrTypePickListCode: string;
  outboundTypePickListCode: string | null;
  outboundTypePickListDescription: string | null;
  correspondenceDate: string | null;
  creationDate: string;
  correspondenceNo: string;
  subject: string;
  sendingEntityDescription: string;
  hasAttachement: boolean;
  isDeleted: boolean;
  receivingEntityDescription: string[];
  receivingGroupDescription: string | null;
}

export interface SearchResultContent {
  searchResultContent: {
    content: CorrespondenceType[];
    totalElements: number;
    totalPages: number;
    last: boolean;
    size: number;
    number: number;
    sort: string | null;
    numberOfElements: number;
    first: boolean;
  };
}

export const pickListSchema = z.object({
  picklistName: z.string().min(1, "Please enter your PickList Name!"),
  picklistType: z
    .string()
    .min(1, "Please select a PickList Type")
    .max(50, "The picklist name is too long!"),
});

export const picklistItemSchema = z.object({
  pickListId: z.number().optional(),
  picklistName: z.string().optional(),
  picklistCode: z.string().optional(),
  picklistEnLabel: z.string().optional(),
  picklistArLabel: z.string().optional(),
  abbreviation: z.string().nullable().optional(),
  orgUnitRoot: z.string().optional(),
  picklistType: z.string().optional(),
  isSystem: z.enum(["true", "false"]).default("true"),
  isActive: z.enum(["true", "false"]).default("true"),
  links: z.array(z.any()).optional().optional(),
});

export const createPickListSchema = z.object({
  isSystem: z.enum(["true", "false"]).default("true"),
  isActive: z.enum(["true", "false"]).default("true"),
  picklistArLabel: z.string().optional(),
  picklistEnLabel: z.string().optional(),
  picklistName: z.string().optional(),
  picklistType: z.string().optional(),
  pickListId: z.number().optional(),
});

export const correspondenceDTOSchema = z.object({
  aclId: z.number(),
  acceptanceDate: z.nullable(z.any()),
  acceptedBy: z.string(),
  accessRights: z.nullable(z.any()),
  agentFrom: z.string(),
  agentPersonalId: z.string(),
  agentPhone: z.string(),
  agentTo: z.string(),
  announcement: z.boolean(),
  approvals: z.array(z.any()),
  attachmentFolder: z.string(),
  attachmentFound: z.boolean(),
  attachReceivedUserId: z.string(),
  auditUserId: z.nullable(z.any()),

  backlog: z.boolean(),
  barcodeFileTitle: z.string(),
  barcodeUnit: z.string(),
  boxId: z.string(),

  ccExternalCodes: z.nullable(z.any()),
  ccInternalCodes: z.array(z.any()),
  ccUsers: z.array(z.string()),
  ccUsersDto: z.nullable(z.array(z.any())),
  contentChornicalId: z.nullable(z.any()),
  contentRepositoryId: z.string(),
  corrId: z.string(),
  correspondenceDate: z.nullable(z.any()),
  correspondenceLanguage: z.string(),
  correspondenceNo: z.string(),
  corrStatusPickListCode: z.string(),
  corrTypePickListCode: z.string(),
  createdDate: z.string(),
  custom1: z.string(),
  custom2: z.string(),
  custom3: z.string(),
  custom4: z.string(),
  custom5: z.string(),
  custom6: z.string(),
  custom7: z.string(),

  docTypePickListCode: z.nullable(z.any()),
  documentBarcode: z.string(),
  documentKeyword: z.array(z.string()),

  excpectedResponseDate: z.nullable(z.any()),
  externalReferenceNo: z.string(),
  externalSendingEntityCode: z.string(),

  fileCode: z.string(),
  fileReference: z.string(),
  fileYear: z.string(),
  finalApproverOrgUnit: z.nullable(z.any()),
  finalApproverUserId: z.nullable(z.any()),

  hasApprovals: z.boolean(),

  inboundSourcePickListCode: z.string(),
  indexUserId: z.string(),
  intiator: z.nullable(z.any()),
  internal: z.boolean(),
  internalSendingEntityCode: z.nullable(z.any()),
  isAnnouncement: z.boolean(),
  isBacklog: z.boolean(),
  isDeleted: z.boolean(),
  isInternal: z.boolean(),
  isMigrated: z.boolean(),

  lastChangedDate: z.nullable(z.any()),
  locBarcode: z.string(),

  migrated: z.boolean(),
  modifiedBy: z.string(),

  needResponse: z.boolean(),
  notify: z.boolean(),

  opentextIntegrated: z.boolean(),
  outboundSendingTypePickListCode: z.nullable(z.any()),
  outboundSignDate: z.nullable(z.any()),
  outboundTemplateName: z.nullable(z.any()),
  outboundTypePickListCode: z.nullable(z.any()),
  ownerUserId: z.string(),

  recievedStatus: z.boolean(),
  receiveAcknowledge: z.boolean(),
  receivedOrganizationUnitsCodes: z.array(z.any()),
  receivingAnnonucementEntityPickListCode: z.nullable(z.any()),
  receivingExternalEntitiesCodes: z.nullable(z.any()),
  receivingdbGroupsCodes: z.nullable(z.any()),
  receivingdbGroupsDto: z.nullable(z.any()),
  referenceNo: z.nullable(z.any()),
  relatedCorrespondenceIds: z.array(z.any()),
  remarks: z.array(z.string()),
  replyCorrespondenceId: z.nullable(z.any()),
  replyCorrespondenceNo: z.nullable(z.any()),
  responseDate: z.nullable(z.any()),

  scanUserId: z.string(),
  securityLevelPickListCode: z.nullable(z.any()),
  sentDate: z.nullable(z.any()),
  shelfNo: z.string(),
  signDate: z.nullable(z.any()),
  stampTypePickListCode: z.nullable(z.any()),
  subject: z.string(),

  tempSignedId: z.string(),

  urgencyPickListCode: z.nullable(z.any()),

  workFlowIntaited: z.boolean(),
});

export const correspondenceSchema = z.object({
  correspondenceDTO: correspondenceDTOSchema,
  genericActionDTO: z.object({
    approveAndForwardUser: z.nullable(z.any()),
    reviewerUser: z.string(),
    comment: z.string(),
    mangerInitiator: z.boolean(),
    readReceipt: z.boolean(),
    sendForReviewer: z.string(),
  }),
});

// Inferred Types
export type CreatePickListItemType = z.infer<typeof createPickListSchema>;

export type PickListType = z.infer<typeof pickListSchema>;
export type PickListItemType = z.infer<typeof picklistItemSchema>;

export type CorrespondenceDTOOutbound = z.infer<typeof correspondenceDTOSchema>;
export type Correspondence = z.infer<typeof correspondenceSchema>;

export type UserTitle = {
  userTitleId: number;
  arUserTitle: string;
  enUserTitle: string;
  isDefault: boolean;
};
