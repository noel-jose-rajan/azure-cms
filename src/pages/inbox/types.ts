import { z } from "zod";
import { PickListItemType } from "../pick-lists/service";

export const searchInboxSchema = z.object({
  arabic: z.boolean().optional(),
  corr_type_id: z.number().optional(),
  corr_subject: z.string().optional(),
  correspondence_no: z.string().optional(),
  receiving_entity_id: z.number().optional(),
  security_level_id: z.number().optional(),
  senderId: z.number().optional(),
  sending_entity_id: z.number().optional(),
  task_date_from: z.string().optional(),
  task_date_to: z.string().optional(),
  urgency_id: z.number().optional(),
  process_type_id: z.number().optional(),
  sort_by: z.string().optional(),
  is_sort_desc: z.boolean().optional(),
  delegation_id: z.number().optional(),
});

export type SearchInboxType = z.infer<typeof searchInboxSchema>;

export interface SearchInboxCorrespondenceType {
  taskId: string;
  taskHasError: boolean;
  taskTitle: string;
  taskKey: string;
  corrId: string;
  previousPerformer: string;
  previousPerformerId: string;
  processName: string;
  sentDate: string;
  taskDueDate: string;
  taskOverDue: boolean;
  taskColor: string | null;
  taskStatus: string;
  initiator: string;
  initiatorId: string | null;
  previousComment: string;
  rejectType: string | null;
  rejectionReason: string | null;
  requiredAction: string | null;
  inboundRecipientOrgUnitCode: string;
  enableG2G: boolean;
  parentRoutingId: string | null;
  viewRepliesTask: boolean;
  previousPerformerOrgUnit: string;
  isRouting: boolean;
  route: string | null;
  zeroRoutingLevel: boolean;
  hasApproval: boolean;
  userAction: string | null;
  correspondenceApprovalsDTO: any | null;
  readReceipt: boolean;
  readStatus: boolean;
}

interface SortOption {
  direction: "ASC" | "DESC";
  property: string;
  ignoreCase: boolean;
  nullHandling: "NATIVE" | "NULLS_FIRST" | "NULLS_LAST";
  ascending: boolean;
}

export interface InboxResponse {
  content: SearchInboxCorrespondenceType[];
  totalElements: number;
  totalPages: number;
  last: boolean;
  size: number;
  number: number;
  sort: SortOption[];
  numberOfElements: number;
  first: boolean;
}

export interface InboxCorrespondenceType {
  corrId: string;
  correspondenceDate: string;
  correspondenceNo: string;
  subject: string;
  corrTypePickList: PickListItemType;
  corrStatusPickList: PickListItemType;
  urgencyPickList: PickListItemType;
  securityLevelPickList: PickListItemType;
  outboundTypePickList: PickListItemType | null;
  internalSendingEntityDescEn: string | null;
  internalSendingEntityDescAr: string | null;
  externalSendingEntityDescEn: string | null;
  externalSendingEntityDescAr: string | null;
  receivingOrganizationUnitsDescEn: string[];
  receivingOrganizationUnitsDescAr: string[];
  receivingExternalEntitiesDescEn: string[] | null;
  receivingExternalEntitiesDescAr: string[] | null;
  receivingDbGroupsDescEn: string[] | null;
  receivingDbGroupsDescAr: string[] | null;
  attachmentFound: boolean;
}
