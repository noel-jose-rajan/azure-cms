export interface OrganizationUnit {
    organizationUnitId?: number | null;
    orgUnitCode?: string | null;
    orgUnitAbbreviation?: string | null;
    orgUnitDescAr?: string | null;
    orgUnitDescEn?: string | null;
    orgUnitEmail?: string | null;
    orgUnitManager?: string | null;
    orgUnitLevel?: string | null;
    escalatedPerformer?: string | null;
    parentOrgunit?: string | null;
    grantAccessToParentOrgUnit?: boolean;
    isActive?: string | null;
    listOrgUnitRoles?: unknown | null;
    listOrgUnitGroups?: unknown | null;
    listOrganizationUnitDTO?: unknown | null;
    orgUnitManagerid?: string | null;
    opentextInboundExternalFolderId?: number | null;
    opentextInboundInternalFolderId?: number | null;
    opentextOutboundExternalFolderId?: number | null;
    opentextOutboundInternalFolderId?: number | null;
    enableG2g?: boolean;
    g2gCode?: number | null;
    links?: unknown[];
}


export interface SearchResult {
    searchResultStatistics: {
        resultStatistics: {
            "Result Count": number;
        };
    };
}


export interface OrgUnitSearch {
    orgUnitDesc?: string;
    orgUnitCode?: string;
    orgUnitEmail?: string;
    isActive?: string; // Default value is "1" in the schema
}
