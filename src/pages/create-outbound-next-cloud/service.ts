import axios, { AxiosRequestConfig } from "axios";
import ENV from "../../constants/env";
import LOCALSTORAGE from "../../constants/local-storage";
import Storage from "../../lib/storage";
import { CountResultStatistics, PickListItemType, SearchQuery, SearchResultContent, UserTitle } from "./types";
import apiRequest from "../../lib/api";

export interface QueryParams {
    criteriaValue?: string;
    correspondenceTypeCode?: string;
    receivingEntityType?: number;
    sendingEntityType?: number;
    page?: number;
    size?: number;
    sort?: string;
}

interface GetSearchCountProps {
    query?: QueryParams;
    requestBody?: SearchQuery;
    correspondenceTypeCode?: "Corr-Type Ext Inc" | "Corr-Type Ext Out" | "Corr-Type Int" | "" | string

}

export async function getSearchCount({
    query = {
        criteriaValue: "",
        correspondenceTypeCode: "all",
        receivingEntityType: 0,
        sendingEntityType: 0,
        page: 0,
        size: 10,
        sort: "creationDate,desc",
    },
    requestBody = {
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
            outboundTypePicklistIDs: [],
        },

    }
}: GetSearchCountProps): Promise<CountResultStatistics> {
    let url = `${ENV.API_URL_LEGACY}/correspodence/search-count?criteriaValue=${encodeURIComponent(query.criteriaValue || "")}&correspondenceTypeCode=${encodeURIComponent(query.correspondenceTypeCode || "all")}&receivingEntityType=${query.receivingEntityType || 0}&sendingEntityType=${query.sendingEntityType || 0}`

    // &page=${query.page || 0}&size=${query.size || 10}&sort=${encodeURIComponent(query.sort || "creationDate,desc")}`


    const token = Storage.getItem(LOCALSTORAGE.LEGACY_ACCESS_TOKEN);
    const headers: AxiosRequestConfig['headers'] = {
        Authorization: `Bearer ${token}`,
        Accept: "application/json, text/plain, */*"
    };

    try {
        const response = await axios.post(url, requestBody, { headers });
        return response.data;
    } catch (error) {
        console.error('Error fetching search count:', error);
        throw error;
    }
}


interface SearchProps {
    query: QueryParams;
    requestBody: SearchQuery;
    correspondenceTypeCode?: "Corr-Type Ext Inc" | "Corr-Type Ext Out" | "Corr-Type Int" | "" | string
}

export async function search({
    query,
    requestBody

}: SearchProps): Promise<SearchResultContent> {
    const url = `${ENV.API_URL_LEGACY}/correspodence/search?criteriaValue=${encodeURIComponent(query.criteriaValue || "")}&correspondenceTypeCode=${encodeURIComponent(query.correspondenceTypeCode || "all")}&receivingEntityType=${query.receivingEntityType || 0}&sendingEntityType=${query.sendingEntityType || 0}&page=${query.page || 0}&size=${query.size || 10}&sort=${encodeURIComponent(query.sort || "creationDate,desc")}`;


    const token = Storage.getItem(LOCALSTORAGE.LEGACY_ACCESS_TOKEN);
    const headers: AxiosRequestConfig['headers'] = {
        Authorization: `Bearer ${token}`,
        Accept: "application/json, text/plain, */*"
    };

    try {
        const response = await axios.post(url, requestBody, { headers });
        return response.data;
    } catch (error) {
        console.error('Error fetching search count:', error);
        throw error;
    }
}



export async function getCanUploadNewVersionPermission(correspodence_id: string): Promise<boolean | undefined> {

    try {

        const token = Storage.getItem(LOCALSTORAGE.LEGACY_ACCESS_TOKEN);
        const headers: AxiosRequestConfig['headers'] = {
            Authorization: `Bearer ${token}`,
            Accept: "application/json, text/plain, */*"
        };

        const request = await apiRequest(
            'GET',
            `/correspodence/can-upload-new-version?correspondenceId=${correspodence_id}`,
            {},
            { headers },
            ENV.API_URL_LEGACY

        )
        return request?.canUploadNewVersion

    } catch (error) { return undefined }
}


export async function getCanDeletePermission(correspodence_id: string): Promise<boolean | undefined> {

    try {

        const token = Storage.getItem(LOCALSTORAGE.LEGACY_ACCESS_TOKEN);
        const headers: AxiosRequestConfig['headers'] = {
            Authorization: `Bearer ${token}`,
            Accept: "application/json, text/plain, */*"
        };

        const request = await apiRequest(
            'GET',
            `/correspodence/can-delete-correspondence?correspondenceId=${correspodence_id}`,
            {},
            { headers },
            ENV.API_URL_LEGACY

        )
        return request?.canDelete

    } catch (error) { return undefined }
}



export async function createComment(
    {
        description,
        correspondenceId,
        ownerUser
    }:
        {
            description: string,
            correspondenceId: string,
            ownerUser: string
        }
): Promise<boolean | undefined> {

    try {

        const token = Storage.getItem(LOCALSTORAGE.LEGACY_ACCESS_TOKEN);
        const headers: AxiosRequestConfig['headers'] = {
            Authorization: `Bearer ${token}`
        };

        const request = await apiRequest<{ "resultCode": number, "errorMsgs": string | null, "message": string }>(
            'POST',
            `/correspondence-note/create`,
            {
                description,
                correspondenceId,
                ownerUser
            },
            { headers },
            ENV.API_URL_LEGACY
        )

        if (request?.resultCode === 200) return true

        return false

    } catch (error) { return false }
}


export async function downloadCorrespondence(correspodence_id: number | string) {
    try {
        const token = Storage.getItem(LOCALSTORAGE.LEGACY_ACCESS_TOKEN);

        const headers: Record<string, string> = {
            Authorization: `Bearer ${token}`,
            Accept: '*/*',
        };

        const request = await fetch(`${ENV.API_URL_LEGACY}/correspodence/download?corrId=${correspodence_id}`, {
            method: "GET",
            headers: headers,
        });

        // Check response status
        if (!request.ok) {
            throw new Error(`Failed to download template. Status: ${request.status}`);
        }

        // Get the content type from the response headers
        const contentType = request.headers.get("Content-Type");

        if (!contentType) {
            throw new Error("No content type specified in the response.");
        }

        // Get the response as a Blob
        const rawBlob = await request.blob();

        // Determine the file extension based on content type
        let fileExtension = '.docx'; // default to binary if unknown
        if (contentType.includes('application/pdf')) {
            fileExtension = '.pdf';
        } else if (contentType.includes('application/msword')) {
            fileExtension = '.doc'; // Handle .doc files
        } else if (contentType.includes('application/vnd.openxmlformats-officedocument.wordprocessingml.document')) {
            fileExtension = '.docx'; // Handle .docx files
        }

        // Create a new Blob with the detected content type
        const fileBlob = new Blob([rawBlob], { type: contentType });

        // Create a Blob URL
        const url = window.URL.createObjectURL(fileBlob);

        // Generate a filename based on the templateId and content type
        const filename = `template-${correspodence_id}${fileExtension}`;

        // Create an anchor element to trigger the download
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;

        // Programmatically click the link to trigger the download
        link.click();

        // Clean up the Blob URL after a reasonable time
        setTimeout(() => window.URL.revokeObjectURL(url), 60000);

        return true;
    } catch (error) {
        console.error("Error downloading template:", error);
        return false;
    }
}




export const getPickListsItems = async (
    type: string
): Promise<PickListItemType[] | null> => {

    try {
        const token = await Storage.getItem(LOCALSTORAGE.LEGACY_ACCESS_TOKEN);

        const headers: AxiosRequestConfig["headers"] = {
            Authorization: `Bearer ${token}`,
        };

        const response = await apiRequest(
            "GET",
            `/pick-list/filter?name=${type}&isActive=false`, {}, {
            headers
        },
            ENV.API_URL_LEGACY
        );

        if (response) {
            return (response as any).content as any[];
        }
        return null;

    } catch (error) {

        return null;

    }

};


export const getTitles = async (): Promise<UserTitle[] | null> => {

    try {
        const token = await Storage.getItem(LOCALSTORAGE.LEGACY_ACCESS_TOKEN);

        const headers: AxiosRequestConfig["headers"] = {
            Authorization: `Bearer ${token}`,
        };

        const response = await apiRequest(
            "GET",
            `/user/user-preferences/all-titles`, {}, {
            headers
        },
            ENV.API_URL_LEGACY
        );

        if (response) {
            return response;
        }
        return null;

    } catch (error) {

        return null;

    }

};