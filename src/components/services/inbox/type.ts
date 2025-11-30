import { CreateCorrespondenceType } from "../outbound/types";

export interface CorrespondenceType {
  correspondenceId: string;
  acceptanceDate: string;
  acceptedBy: string;
  aclId: string;
  agentFrom: string;
  agentPersonalId: string;
  agentPhone: string;
  agentTo: string;
  attachReceivedUserId: string;
  attachmentFolder: string;
  attachmentFound: string;
  auditUserId: string;
  barcodeFileTitle: string;
  barcodeUnit: string;
  boxId: string;
  contentChornicalId: string;
  contentRepositoryId: string;
  correspondenceDate: string;
  correspondenceLanguage: string;
  correspondenceNo: string;
  createdDate: string;
  custom1: string;
  custom2: string;
  custom3: string;
  custom4: string;
  custom5: string;
  custom6: string;
  custom7: string;
  documentBarcode: string;
  excpectedResponseDate: string;
  externalReferenceNo: string;
  fileCode: string;
  fileReference: string;
  fileYear: string;
  finalApproverUserId: string;
  indexUserId: string;
  isAnnouncement: string;
  isBacklog: string;
  isInternal: string;
  isMigrated: string;
  isNotify: string;
  lastChangedDate: string;
  locBarcode: string;
  modifiedBy: string;
  needResponse: string;
  outboundSignDate: string;
  ownerUserId: string;
  recieveDate: string;
  recievedStatus: string;
  remarks: string | null;
  replyCorrespondenceNo: string;
  responseDate: string;
  receiveAcknowledge: string;
  scanUserId: string;
  sentDate: string;
  shelfNo: string;
  signDate: string;
  subject: string;
  tempSignedId: string;
  corrStatusPickListCode: string;
  corrTypePickListCode: string;
  docTypePickListCode: string;
  externalSendingEntityCode: string;
  finalApproverOrgUnitID: string;
  inboundSourcePickListCode: string;
  internalSendingEntityCode: string;
  outboundSendingTypePickListCode: string;
  outboundTemplateName: string;
  outboundTypePickListCode: string;
  receivingAnnonucementEntityPickListCode: string;
  replyCorrespondenceID: string;
  securityLevelPickListCode: string;
  stampTypePickListCode: string;
  urgencyPickListCode: string;
  opentextIntegrated: string;
  ccUsers: string | null;
  ccUsersDto: string | null;
  isDeleted: string;
  hasApprovals: string;
  workFlowIntaited: string;
  receivingOrganizationUnitsCodes: string | null;
  receivingExternalEntitiesCodes: string | null;
  receivingDbGroupsCodes: string | null;
  receivingDbGroupsDto: string | null;
  relatedCorrespondenceIds: string | null;
  ccInternalCodes: string | null;
  ccExternalCodes: string | null;
  documentKeyword: string | null;
  referenceNo: string;
  corrTask: CorrTaskType;
  genericActionDTO: GenericActionDTO;
}

export interface CorrTaskType {
  parentCmsNo: string | null;
  readTag: string | null;
  workflowId: string | null;
  initiatorId: string | null;
  initiatorEntityId: string | null;
  initiationDate: string;
  reviewerId: string | null;
  reviewerEntityId: string | null;
  reviewerDate: string | null;
  approverId: string | null;
  approverEntityId: string | null;
  approverDate: string | null;
  modifierId: string | null;
  modifierEntityId: string | null;
  modifiedDate: string | null;
  cmsTaskStatusId: string | null;
  taskName: string;
  taskDescription: string | null;
  assigneeId: string | null;
  assigneeEntityId: string | null;
  assignedDate: string | null;
  dueDate: string | null;
  completionDate: string | null;
  estimatedTime: string | null;
  actualTimeSpent: string | null;
  progressPercentage: string | null;
}

export interface GenericActionDTO {
  ID: number;
  action: string;
  physicalAttachmentComment: string;
  isPhysicalAttachmentReceived: string;
  approveText: string;
  selectedUserTitleId: string;
  managerInitiator: string;
  readReceipt: string;
  resubmitToReviewer: string;
  ccUser: CCUser;
  changedUrgencyPicklistCode: string;
  rejectionReason: string;
  outboundSendingTypePicklistCode: string;
  externalEntityUpdatedEmail: string;
  rejectReactorOrgUnit: string;
  rejectReactorUser: string;
}

export interface CCUser {
  routeFromUserId: string;
  routeFromOrganizationUnitDTO: string;
  routingUrgnecyLevelPicklistCode: string;
  corrId: string;
  parentRoutingId: string | null;
  requiredActionPicklistCode: string;
  routeToUserId: string | null;
  routeToOrganizationUnitDTO: string;
  routingComment: string;
  loginName: string;
  userId: string;
  userDescription: string;
  language: string;
  isDelegator: boolean;
  delegatorUsername: string | null;
  delegationId: number;
  grantedAuthorityIDs: string | null;
  applicationProfiles: string | null;
}

export interface InboxActionType {
  by_user_id: string;
  comments: string;
  corr_id: string;
  from_state: string;
  id: number;
  is_current: boolean;
  role: string;
  timestamp: string;
  to_state: string;
  to_user_id: string;
  version: number;
}
//not used
export interface InboxCorresDetailType {
  correspondence: CreateCorrespondenceType;
  action: InboxActionType;
}
export interface InboxResponseType {
  message: string;
  error: boolean;
  data: InboxCorresDetailType[];
  pagination: {
    limit: number;
    page: number;
    total_count: number;
    total_pages: number;
  };
}
