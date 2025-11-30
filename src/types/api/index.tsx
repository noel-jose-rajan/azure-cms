export interface APIResponse<T> {
    "error": boolean,
    "messageType": string,
    "code": number,
    "status": string,
    "message": string,
    "timestamp": string,
    "details_en"?: {
        "id"?: number,
        "language"?: "en"
    }[]
    ,
    "details_ar"?: {
        "id"?: number,
        "language"?: "ar"
    }[],

    data?: T,

    "pageDetails": {
        "pageNumber": number,
        "pageSize": number,
        "orderByColumn": string,
        "sortOrder": "DESC" | "ASC",
        "totalCount": number
    }
}

interface ErrorDescriptionType {
    desc: string;
    language: string;
}
  
export interface GenericApiResponseType<T> {
    error: boolean;
    messageType: string;
    code: number;
    status: string;
    message: string;
    timestamp: string;
    data?: T[];
    details_en: ErrorDescriptionType[];
    details_ar: ErrorDescriptionType[];
}
  