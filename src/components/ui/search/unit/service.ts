import { AxiosRequestConfig } from "axios";
import { OrganizationUnit, SearchResult } from "./types";
import Storage from "../../../../lib/storage";
import LOCALSTORAGE from "../../../../constants/local-storage";
import apiRequest from "../../../../lib/api";
import ENV from "../../../../constants/env";

export const advancedOrgUnitSearch = async (
    payload: any,
    size: number = 10,
    page: number = 0
): Promise<SearchResult | null> => {

    const token = Storage.getItem(LOCALSTORAGE.LEGACY_ACCESS_TOKEN)
    try {
        const headers: AxiosRequestConfig["headers"] = {
            Authorization: `Bearer ${token}`,
        };

        const response = await apiRequest(
            "POST",
            `/org-unit/search?page=${page}&size=${size}&sort=orgUnitCode,asc`,
            payload,
            { headers },
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

export const searchOrgUnit = async (
    searchText: string

): Promise<OrganizationUnit[] | null> => {
    try {
        const token = Storage.getItem(LOCALSTORAGE.LEGACY_ACCESS_TOKEN)

        const headers: AxiosRequestConfig["headers"] = {
            Authorization: `Bearer ${token}`,
        };

        const response = await apiRequest(
            "POST",
            `/org-unit/filter`,
            { orgUnitDesc: searchText },
            { headers },
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