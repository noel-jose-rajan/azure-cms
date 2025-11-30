import { z } from "zod";
//not used
const accessRightSchema = z.object({
  key: z.string(),
  description: z.string(),
});

export const correspondenceSchema = z.object({
  accessRights: z.array(accessRightSchema).nullable(),
  corrId: z.string(),
  contentRepositoryId: z.string(),
  contentChornicalId: z.string(),
  docTypePickListCode: z.string(),
  securityLevelPickListCode: z.string(),
  urgencyPickListCode: z.string(),
  stampTypePickListCode: z.any(),
  outboundTypePickListCode: z.any(),
  corrStatusPickListCode: z.string(),
  corrTypePickListCode: z.string(),
  outboundTemplateName: z.any(),
  inboundSourcePickListCode: z.string(),
  receivingAnnonucementEntityPickListCode: z.any(),
  externalSendingEntityCode: z.string(),
  internalSendingEntityCode: z.any(),
  workFlowIntaited: z.boolean(),
  receivingOrganizationUnitsCodes: z.array(z.string()),
  receivingExternalEntitiesCodes: z.any(),
  receivingdbGroupsCodes: z.any(),
  receivingdbGroupsDto: z.any(),
  relatedCorrespondenceIds: z.any(),
  ccInternalCodes: z.any(),
  ccExternalCodes: z.any(),
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
  correspondenceDate: z.string(),
  correspondenceLanguage: z.string(),
  correspondenceNo: z.string(),
  replyCorrespondenceId: z.any(),
  replyCorrespondenceNo: z.string(),
  intiator: z.any(),
  custom1: z.string(),
  custom2: z.string(),
  custom3: z.string(),
  custom4: z.string(),
  custom5: z.string(),
  custom6: z.string(),
  custom7: z.string(),
  documentBarcode: z.string(),
  subject: z.string(),
  excpectedResponseDate: z.any(),
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
  referenceNo: z.any(),
  remarks: z.any(),
  ccUsers: z.any(),
  ccUsersDto: z.any(),
  finalApproverUserId: z.any(),
  finalApproverOrgUnit: z.any(),
  responseDate: z.any(),
  shelfNo: z.string(),
  signDate: z.any(),
  sentDate: z.any(),
  tempSignedId: z.string(),
  outboundSignDate: z.any(),
  acceptanceDate: z.string(),
  acceptedBy: z.string(),
  indexUserId: z.string(),
  recieveDate: z.any(),
  scanUserId: z.string(),
  auditUserId: z.any(),
  createdDate: z.string(),
  modifiedBy: z.string(),
  lastChangedDate: z.any(),
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
  outboundSendingTypePickListCode: z.any(),
});

export type CorrespondenceDetailType = z.infer<typeof correspondenceSchema>;

export const relatedCorrespondenceSchema = z.object({
  corrId: z.string(),
  contentRepositoryId: z.string(),
  corrStatusPickListCode: z.string(),
  corrStatusPickListArDesc: z.string(),
  corrStatusPickListEnDesc: z.string(),
  corrTypePickListCode: z.string(),
  corrTypePickListArDesc: z.string(),
  corrTypePickListEnDesc: z.string(),
  correspondenceDate: z.string(),
  correspondenceNo: z.string(),
  subject: z.string(),
});
//not used
export const relatedCorrespondenceResponseSchema = z.object({
  content: z.array(relatedCorrespondenceSchema),
  totalElements: z.number(),
  totalPages: z.number(),
  last: z.boolean(),
  size: z.number(),
  number: z.number(),
  sort: z.string().nullable(),
  numberOfElements: z.number(),
  first: z.boolean(),
});

export type RelatedCorrespondenceType = z.infer<
  typeof relatedCorrespondenceSchema
>;

export type RelatedCorrespondenceResponseType = z.infer<
  typeof relatedCorrespondenceResponseSchema
>;

// export const followUpCorrespondenceSchema = z.object({
//   taskTitle: z.string(),
//   corrSubject: z.string(),
//   taskStatus: z.string(),
//   sentDate: z.string(),
//   taskDueDate: z.string(),
//   previousPerformer: z.string(),
//   pendingUserOrOrgunit: z.string(),
// });

// export type FollowUpCorrespondenceType = z.infer<
//   typeof followUpCorrespondenceSchema
// >;

export const historyCorrespondenceSchema = z.object({
  actionDate: z.string(),
  performerComment: z.string(),
  performerActionPickListDTO: z.object({
    pickListId: z.number(),
    picklistName: z.string(),
    picklistCode: z.string(),
    picklistEnLabel: z.string(),
    picklistArLabel: z.string(),
    abbreviation: z.string(),
    orgUnitRoot: z.string(),
    picklistType: z.string(),
    isSystem: z.any().nullable(),
    isActive: z.any().nullable(),
    links: z.array(z.any()).nullable(),
  }),
  performerUserDescription: z.string(),
  performerOrganizationUnitDTO: z
    .object({
      organizationUnitId: z.number(),
      orgUnitCode: z.string(),
      orgUnitAbbreviation: z.any().nullable(),
      orgUnitDescAr: z.string(),
      orgUnitDescEn: z.string(),
      orgUnitEmail: z.string(),
      orgUnitManager: z.string(),
      orgUnitLevel: z.string(),
      escalatedPerformer: z.string(),
      parentOrgunit: z.string(),
      grantAccessToParentOrgUnit: z.boolean(),
      isActive: z.string(),
      listOrgUnitRoles: z.any().nullable(),
      listOrgUnitGroups: z.any().nullable(),
      listOrganizationUnitDTO: z.any().nullable(),
      orgUnitManagerid: z.string(),
      opentextInboundExternalFolderId: z.number(),
      opentextInboundInternalFolderId: z.number(),
      opentextOutboundExternalFolderId: z.number(),
      opentextOutboundInternalFolderId: z.number(),
      enableG2g: z.boolean(),
      g2gCode: z.number(),
      links: z.array(z.any()).nullable(),
    })
    .nullable(),
});

export const correspondenceHistoryResponseSchema = z.object({
  content: z.array(historyCorrespondenceSchema),
  totalElements: z.number(),
  totalPages: z.number(),
  last: z.boolean(),
  size: z.number(),
  number: z.number(),
  sort: z.array(
    z.object({
      direction: z.string(),
      property: z.string(),
      ignoreCase: z.boolean(),
      nullHandling: z.string(),
      ascending: z.boolean(),
    })
  ),
  numberOfElements: z.number(),
  first: z.boolean(),
});

export type CorrespondenceHistoryType = z.infer<
  typeof historyCorrespondenceSchema
>;

export type CorrespondenceHistoryResponseType = z.infer<
  typeof correspondenceHistoryResponseSchema
>;

export const correspondenceVersionsSchema = z.object({
  type: z.string(),
  contentRepositoryId: z.string(),
  name: z.string(),
  latestVersion: z.boolean(),
  createdDate: z.string(),
  modifiedDate: z.string(),
  editorName: z.string(),
  fileExtension: z.string(),
});
//not used
// export const correspondenceVersionsResponseSchema = z.object({
//   content: z.array(correspondenceVersionsSchema),
//   totalElements: z.number(),
//   totalPages: z.number(),
//   last: z.boolean(),
//   size: z.number(),
//   number: z.number(),
//   sort: z.array(
//     z.object({
//       direction: z.string(),
//       property: z.string(),
//       ignoreCase: z.boolean(),
//       nullHandling: z.string(),
//       ascending: z.boolean(),
//     })
//   ),
//   numberOfElements: z.number(),
//   first: z.boolean(),
// });
//not used
// export type CorrespondenceVersionsType = z.infer<
//   typeof correspondenceVersionsSchema
// >;

// export type CorrespondenceVersionsResponseType = z.infer<
//   typeof correspondenceVersionsResponseSchema
// >;

export const correspondenceCommentsSchema = z.object({
  correspondenceNoteId: z.number(),
  description: z.string(),
  createdDate: z.string(),
  performerUser: z.string(),
  correspondence: z.string(),
});

export const correspondenceCommentsResponseSchema = z.object({
  content: z.array(correspondenceCommentsSchema),
  totalElements: z.number(),
  totalPages: z.number(),
  last: z.boolean(),
  size: z.number(),
  number: z.number(),
  sort: z.any().nullable(),
  numberOfElements: z.number(),
  first: z.boolean(),
});

export type CorrespondenceCommentsType = z.infer<
  typeof correspondenceCommentsSchema
>;

export type CorrespondenceCommentsResponseType = z.infer<
  typeof correspondenceCommentsResponseSchema
>;

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

const OrganizationUnitDTOSchema = z.object({
  organizationUnitId: z.number(),
  orgUnitCode: z.string(),
  orgUnitAbbreviation: z.string().nullable(),
  orgUnitDescAr: z.string(),
  orgUnitDescEn: z.string(),
  orgUnitEmail: z.string().nullable(),
  orgUnitManager: z.string(),
  orgUnitLevel: z.string(),
  escalatedPerformer: z.string(),
  parentOrgunit: z.string().nullable(),
  grantAccessToParentOrgUnit: z.boolean(),
  isActive: z.string(),
  listOrgUnitRoles: z.any().nullable(),
  listOrgUnitGroups: z.any().nullable(),
  listOrganizationUnitDTO: z.any().nullable(),
  orgUnitManagerid: z.string(),
  opentextInboundExternalFolderId: z.number(),
  opentextInboundInternalFolderId: z.number(),
  opentextOutboundExternalFolderId: z.number(),
  opentextOutboundInternalFolderId: z.number(),
  enableG2g: z.boolean(),
  g2gCode: z.number(),
  links: z.array(z.any()),
});

const RoutingDetailsSchema = z.object({
  routeDelegateeUserId: z.string().nullable(),
  routeToUserId: z.string().nullable(),
  routeToOrganizationUnitDTO: OrganizationUnitDTOSchema,
  routeFromUserId: z.string(),
  routeFromOrganizationUnitDTO: OrganizationUnitDTOSchema,
  routingComment: z.string(),
  replyComment: z.string().nullable(),
  parentRoutingId: z.number(),
  routingId: z.number(),
  timeOut: z.number(),
  creationDate: z.string(),
  replyDate: z.string().nullable(),
  routeDate: z.string(),
  routingPerformerUserId: z.string(),
  corrId: z.string(),
  requiredActionPicklistCode: z.string(),
  routingUrgnecyLevelPicklistCode: z.string(),
  routingStatusPicklistCode: z.string(),
  routeToUserDesc: z.string().nullable(),
  routeFromUserDesc: z.string(),
  routingPerformerUserDesc: z.string(),
  routeDelegateeUserDesc: z.string().nullable(),
});

export const MainRoutingDetailsSchema = RoutingDetailsSchema;
export type RoutingDetailsType = z.infer<typeof MainRoutingDetailsSchema>;

const PerformerActionPickListDTOSchema = z.object({
  pickListId: z.number(),
  picklistName: z.string(),
  picklistCode: z.string(),
  picklistEnLabel: z.string(),
  picklistArLabel: z.string(),
  abbreviation: z.string(),
  orgUnitRoot: z.string(),
  picklistType: z.string(),
  isSystem: z.boolean().nullable(),
  isActive: z.boolean().nullable(),
  links: z.array(z.any()),
});

const HistoryRecordSchema = z.object({
  actionDate: z.string(),
  performerComment: z.string(),
  performerActionPickListDTO: PerformerActionPickListDTOSchema,
  performerUserDescription: z.string(),
  performerOrganizationUnitDTO: z.any().nullable(),
});

export const HistoryRecordsSchema = z.array(HistoryRecordSchema);
export type HistoryRecordType = z.infer<typeof HistoryRecordSchema>;

//not used
export interface RoutingType {
  routingId: number;
  statusCode: string | null;
  routingTo: string | null;
  routingToId: string | null;
  routingDelegatee: string | null;
  routingDelegateeId: string | null;
  parentRoutingId: number;
  routingChildren: RoutingType[];
  routeToUser: boolean;
}

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

export const printTaskSchema = z.object({
  corrId: z.string(),
  corrStatusPicklistsDesc: z.string(),
  corrType: z.string(),
  corrSubject: z.string(),
  corrNo: z.string(),
  correspondenceDate: z.string(),
  sendingEntity: z.string(),
  receivingEntity: z.string(),
  isContentRequired: z.boolean(),
  PDFContentFileName: z.string(),
  isMainDetailsRequired: z.boolean(),
  isMoreDetailsRequired: z.boolean(),
  isHistoryRequired: z.boolean(),
  isElectAttachmentsRequired: z.boolean(),
  isPhyAttachmentsRequired: z.boolean(),
  isRoutingRequired: z.boolean(),
  isDocumentVersionRequired: z.boolean(),
  hasElecAttachments: z.boolean(),
  hasPhyAttachments: z.boolean(),
  hasHistory: z.boolean(),
  hasRoutings: z.boolean(),
  hasDocumentVersions: z.boolean(),
  hasFollowUp: z.boolean(),
  isFollowUpRequired: z.boolean(),
  documentVersions: z.array(z.any()),
});

export type PrintTaskType = z.infer<typeof printTaskSchema>;

const UserActionSchema = z.object({
  key: z.string(),
  description: z.string(),
});

const TaskItemSchema = z.object({
  taskId: z.string(),
  taskHasError: z.boolean(),
  taskTitle: z.string(),
  taskKey: z.string(),
  corrId: z.string(),
  previousPerformer: z.string(),
  previousPerformerId: z.string(),
  processName: z.string(),
  sentDate: z.string(),
  taskDueDate: z.string(),
  taskOverDue: z.boolean(),
  taskColor: z.string().nullable(),
  taskStatus: z.string(),
  initiator: z.string(),
  initiatorId: z.string(),
  previousComment: z.string(),
  rejectType: z.string(),
  rejectionReason: z.string().nullable(),
  requiredAction: z.string().nullable(),
  inboundRecipientOrgUnitCode: z.string(),
  enableG2G: z.boolean(),
  parentRoutingId: z.string().nullable(),
  viewRepliesTask: z.boolean(),
  previousPerformerOrgUnit: z.string(),
  isRouting: z.boolean(),
  route: z.any().nullable(),
  zeroRoutingLevel: z.boolean(),
  hasApproval: z.boolean(),
  userAction: z.array(UserActionSchema),
  correspondenceApprovalsDTO: z.null(),
  readReceipt: z.boolean(),
  readStatus: z.boolean(),
});

export const MainSchema = z.object({
  taskItem: TaskItemSchema,
  correspondenceDTO: correspondenceSchema,
});

export type InboxTaskType = z.infer<typeof TaskItemSchema>;

export type TaskDetailType = z.infer<typeof MainSchema>;

export const ccUserSchema = z.object({
  assigneeIdOrCode: z.string(),
  orgunitPrincipal: z.boolean(),
  enDescription: z.string(),
  arDescription: z.string(),
  selectionRank: z.number(),
  links: z.array(z.any()),
});

export type CCUserType = z.infer<typeof ccUserSchema>;

export const createRouteSchema = z.object({
  routeFromUserId: z.string(),
  routeFromOrganizationUnitDTO: z.string(),
  routingUrgnecyLevelPicklistCode: z.string(),
  corrId: z.string(),
  parentRoutingId: z.string(),
  requiredActionPicklistCode: z.string(),
  routeToUserId: z.string().nullable(),
  routeToOrganizationUnitDTO: z.any().nullable(),
  routingComment: z.string(),
});

export type CreateRouteType = z.infer<typeof createRouteSchema>;

const RoutingSchema = z.object({
  routeDelegateeUserId: z.string().nullable(),
  routeToUserId: z.string().nullable(),
  routeToOrganizationUnitDTO: z.string().nullable(),
  routeToOrganizationUnitEn: z.string().nullable(),
  routeToOrganizationUnitAr: z.string().nullable(),
  routeFromUserId: z.string(),
  routeFromOrganizationUnitDTO: z.string(),
  routeFromOrganizationUnitEn: z.string(),
  routeFromOrganizationUnitAr: z.string(),
  routingComment: z.string(),
  replyComment: z.string().nullable(),
  delayComment: z.string().nullable(),
  parentRoutingId: z.number(),
  routingId: z.number(),
  timeOut: z.number(),
  creationDate: z.string(),
  replyDate: z.string().nullable(),
  routeDate: z.string().nullable(),
  routingPerformerUserId: z.string(),
  corrId: z.string(),
  requiredActionPicklistCode: z.string(),
  routingUrgnecyLevelPicklistCode: z.string(),
  routingStatusPicklistCode: z.string(),
  routeToUserDesc: z.string().nullable(),
  routeFromUserDesc: z.string(),
  routingPerformerUserDesc: z.string(),
  routeDelegateeUserDesc: z.string().nullable(),
  executionId: z.string().nullable(),
});

const ResponseSchema = z.object({
  content: z.array(RoutingSchema),
  totalElements: z.number(),
  totalPages: z.number(),
  last: z.boolean(),
  size: z.number(),
  number: z.number(),
  sort: z.any().nullable(),
  numberOfElements: z.number(),
  first: z.boolean(),
});

export type RoutingListType = z.infer<typeof RoutingSchema>;
export type RoutingResponse = z.infer<typeof ResponseSchema>;

const DescriptionSchema = z.object({
  enDescription: z.string().nullable(),
  arDescription: z.string().nullable(),
});

const UpdateRoutingSchema = z.object({
  routeDelegateeUserId: z.string().nullable(),
  routeToUserId: z.string().nullable(),
  routeToOrganizationUnitDTO: z.string().nullable(),
  routeToOrganizationUnitEn: z.string().nullable(),
  routeToOrganizationUnitAr: z.string().nullable(),
  routeFromUserId: z.string(),
  routeFromOrganizationUnitDTO: z.string(),
  routeFromOrganizationUnitEn: z.string(),
  routeFromOrganizationUnitAr: z.string(),
  routingComment: z.string(),
  replyComment: z.string().nullable(),
  delayComment: z.string().nullable(),
  parentRoutingId: z.any(),
  routingId: z.number(),
  timeOut: z.number(),
  creationDate: z.string(),
  replyDate: z.string().nullable(),
  routeDate: z.string().nullable(),
  routingPerformerUserId: z.string(),
  corrId: z.string(),
  requiredActionPicklistCode: z.string(),
  routingUrgnecyLevelPicklistCode: z.string(),
  routingStatusPicklistCode: z.string(),
  routeToUserDesc: z.string().nullable(),
  routeFromUserDesc: z.string(),
  routingPerformerUserDesc: z.string(),
  routeDelegateeUserDesc: z.string().nullable(),
  executionId: z.string().nullable(),
  description: DescriptionSchema,
  requiredActionPicklist: z.any().nullable(),
});

export type UpdateRoutingType = z.infer<typeof UpdateRoutingSchema>;

export interface CCUserCompleteUserType {
  routeFromUserId: string;
  routeFromOrganizationUnitDTO: string;
  routingUrgnecyLevelPicklistCode: string;
  corrId: string;
  parentRoutingId: any;
  requiredActionPicklistCode: string;
  routeToUserId: string | null;
  routeToOrganizationUnitDTO: string | null;
  routingComment: string;
}
export interface CompleteTaskType {
  genericActionDTO: {
    taskName?: string;
    action?: string;
    changedUrgencyPicklistCode?: string;
    ccUser?: CCUserCompleteUserType[];
    readReceipt?: boolean;
    comment?: string;
    rejectionReason?: string;
  };
  correspondenceDTO: CorrespondenceDetailType;
}
