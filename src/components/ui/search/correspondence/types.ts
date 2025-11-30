import { CorrespondenceType } from "../../../../types/correspondence"

export interface CorrespondenceSearchQuery {
    criteriaValue: string
    correspondenceTypeCode: string
    receivingEntityType: number
    sendingEntityType: number
    page: number
    size: number
    sort: string
}
export interface CorrespondenceSearchSingleCriteria {
    finalApproverOrgUnitId: number;
    correspondenceNo: string;
    subject: string;
    createdByMe: boolean;
    isDeleted: boolean;
    contentSearch: boolean;
    externalReferenceNo: string;
    barcode: string;
    inboundSenderName: string;
    correspondenceDateFrom: string;
    correspondenceDateTo: string;
    recieveDateFrom: string;
    recieveDateTo: string;
    createdDateFrom: string;
    createdDateTo: string;
    signDateFrom: string;
    signDateTo: string;
    sentDateFrom: string;
    sentDateTo: string;
}

export interface CorrespondenceSearchMultiCriteria {
    statusPicklistIDs: number[];
    securityPicklistIDs: number[];
    urgencyPicklistIDs: number[];
    documentTypePicklistIDs: number[];
    keywords: string[];
    recievingEntityIDs: number[];
    sendingEntityIDs: number[];
    relatedCorrespondenceIDs: number[];
}



export interface CorrespondenceSearchCriteria {

    query: CorrespondenceSearchQuery
    singleCriteria: CorrespondenceSearchSingleCriteria
    multiCriteria: CorrespondenceSearchMultiCriteria

}



export interface SearchResultContent {
    content: CorrespondenceType[];
    totalElements: number;
    totalPages: number;
    last: boolean;
    size: number;
    number: number;
    sort: any;
    numberOfElements: number;
    first: boolean;
}




export interface StatisticsResponse {
    resultStatistics: {
        externalOutboundCount: number;
        allResultCount: number;
        "all Result Count": number
        announcementCount: number;
        externalInboundCount: number;
        internalCount: number;
    }
}
