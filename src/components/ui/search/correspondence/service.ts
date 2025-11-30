import axios, { AxiosRequestConfig } from "axios";
import ENV from "../../../../constants/env";
import Storage from "../../../../lib/storage";
import { CorrespondenceSearchCriteria, SearchResultContent, StatisticsResponse } from "./types";
import LOCALSTORAGE from "../../../../constants/local-storage";
import apiRequest from "../../../../lib/api";




export async function search({
    query,
    singleCriteria,
    multiCriteria

}: CorrespondenceSearchCriteria): Promise<SearchResultContent | null> {

    let params: string = ""

    Object.entries(query).map(item => params += `${item[0]}=${encodeURIComponent(item[1])}&`)

    const url = `${ENV.API_URL_LEGACY}/correspodence/search-related-corres?${params}`
    const token = Storage.getItem(LOCALSTORAGE.LEGACY_ACCESS_TOKEN);
    const headers: AxiosRequestConfig['headers'] = {
        Authorization: `Bearer ${token}`,
        Accept: "application/json, text/plain, */*"
    };

    try {
        const response = await axios.post(url, { singleCriteria, multiCriteria }, { headers });
        return response.data.searchResultContent;
    } catch (error) {
        console.error('Error fetching search count:', error);
        return null
    }
}


export async function searchCount({
    query,
    singleCriteria,
    multiCriteria

}: CorrespondenceSearchCriteria): Promise<StatisticsResponse | null> {

    let params: string = ""

    Object.entries(query).map(item => params += `${item[0]}=${encodeURIComponent(item[1])}&`)

    const url = `${ENV.API_URL_LEGACY}/correspodence/search-related-corres-count?${params}`
    const token = Storage.getItem(LOCALSTORAGE.LEGACY_ACCESS_TOKEN);
    const headers: AxiosRequestConfig['headers'] = {
        Authorization: `Bearer ${token}`,
        Accept: "application/json, text/plain, */*"
    };

    try {
        const response = await axios.post(url, { singleCriteria, multiCriteria }, { headers });
        return response.data;
    } catch (error) {
        console.error('Error fetching search count:', error);
        return null
    }
}

export const getPickListsItems = async (
    type: string
): Promise<any[] | null> => {

    try {
        const token = Storage.getItem(LOCALSTORAGE.LEGACY_ACCESS_TOKEN);

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
            return (response as any).content;
        }
        return null;

    } catch (error) {

        return null;

    }

};