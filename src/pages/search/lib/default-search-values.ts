import { SearchQuery } from "../types";

const DEFAULT_SEARCH_VALUES: SearchQuery = {
    singleCriteria: {
        finalApproverOrgUnitId: -1,
        correspondenceNo: "",
        subject: "",
        createdByMe: false,
        isDeleted: false,
        contentSearch: false,
        externalReferenceNo: "",
        barcode: "",
        inboundSenderName: "",
        correspondenceDateFrom: "",
        correspondenceDateTo: "",
        recieveDateFrom: "",
        recieveDateTo: "",
        createdDateFrom: "",
        createdDateTo: "",
        signDateFrom: "",
        signDateTo: "",
        sentDateFrom: "",
        sentDateTo: "",
        remarks: ""
    },
    multiCriteria: {
        statusPicklistIDs: [],
        securityPicklistIDs: [],
        urgencyPicklistIDs: [],
        documentTypePicklistIDs: [],
        keywords: [],
        recievingEntityIDs: [],
        sendingEntityIDs: [],
        relatedCorrespondenceIDs: [],
        outboundTypePicklistIDs: []
    }
} as const

export default DEFAULT_SEARCH_VALUES