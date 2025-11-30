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
    "resultStatistics": {
        "External Outbound Count": number,
        "all Result Count": number,
        "Announcement Count": number,
        "External Inbound Count": number,
        "Internal Count": number
    }
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
    isSystem: z.enum(["true", "false"]).default('true'),
    isActive: z.enum(["true", "false"]).default('true'),
    links: z.array(z.any()).optional().optional(),
});

export const createPickListSchema = z.object({
    isSystem: z.enum(["true", "false"]).default('true'),
    isActive: z.enum(["true", "false"]).default('true'),
    picklistArLabel: z
        .string().optional(),
    picklistEnLabel: z
        .string().optional(),
    picklistName: z.string().optional(),
    picklistType: z.string().optional(),
    pickListId: z.number().optional(),
});

// Inferred Types
export type CreatePickListItemType = z.infer<typeof createPickListSchema>;

export type PickListType = z.infer<typeof pickListSchema>;
export type PickListItemType = z.infer<typeof picklistItemSchema>;