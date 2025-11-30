import { z } from "zod";
import { CONST_DATA } from "../../../constants/app";

export const searchOUSchema = z.object({
  is_active: z.string().nullish(),
  manager_id: z.number(),
  entity_code: z.string(),
  parent_id: z.number().nullish(),
  name: z.string(),
});

export type SearchOUType = z.infer<typeof searchOUSchema>;

export const orgUnitSearchSchema = z.object({
  entity_desc_en: z.string().optional(),
  entity_code: z.string().optional(),
  entity_email: z.string().optional(),
  isActive: z.enum(["true", "false"]).default("true"),
});

export type OUSearchModelType = z.infer<typeof orgUnitSearchSchema>;

export interface OUFastAddType {
  roleIds: string[];
  roleNames: string[];
  orgunitCodes: string[];
  userId: string[];
  roleOrgUnitCodes: string[];
}
//not used
export const OrganizationUnitSchema = z.object({
  // organizationUnitId: z.number(),
  // orgUnitCode: z.string(),
  // orgUnitDescAr: z.string(),
  // orgUnitDescEn: z.string(),

  entity_code: z.string(),
  entity_id: z.string(),
  entity_desc_ar: z.string(),
  entity_desc_en: z.string(),
  enable_g2g: z.string(),
  orgUnitAbbreviation: z.string().nullable(),
  orgUnitEmail: z.string().nullable(),
  orgUnitManager: z.string(),
  orgUnitLevel: z.string(),
  escalatedPerformer: z.string(),
  parentOrgUnit: z.string().nullable(),
  grantAccessToParentOrgUnit: z.boolean(),
  isActive: z.enum(["true", "false"]),
  listOrgUnitRoles: z.array(z.any()),
  listOrgUnitGroups: z.array(z.any()),
  listOrganizationUnitDTO: z.array(z.any()),
  orgUnitManagerid: z.string(),
  opentextInboundExternalFolderId: z.number().nullable(),
  opentextInboundInternalFolderId: z.number().nullable(),
  opentextOutboundExternalFolderId: z.number().nullable(),
  opentextOutboundInternalFolderId: z.number().nullable(),
  enableG2g: z.boolean().nullable(),
  g2gCode: z.number().nullable(),
  links: z.array(z.any()).nullable(),
});
export type OrganizationUnitType = z.infer<typeof OrganizationUnitSchema>;

//used
export const OUschema = z.object({
  abbr: z.string().min(1),
  email: z.string().email(),
  entity_code: z.string().min(1),
  entity_level_id: z.number().min(1),
  escalated_performer_id: z.number().min(1),
  is_active: z.boolean().nullish(),
  manager_id: z.number().min(1),
  name_ar: z.string().min(1),
  name_en: z.string().min(1),
  parent_code: z.string().nullish(),
  parent_id: z.number().nullish(),
  id: z.number().nullish(),
});
export type OrgUnitType = z.infer<typeof OUschema>;

export interface RoleDetails {
  orgUnitRoleId: number;
  roleName: string;
  listOrgUnitUsers: any[];
  listOrganizationUnitDTO: any[];
  listOrgUnitGroups: any[];
}

export interface CreateOrgUnitUserRoles {
  orgUnitRoleId: number;
  orgUnitCode: string[];
  userId: string[];
  deletedUserId: string[];
  deletedOrgUnitCode: string[];
  groups?: number[];
  deletedGroups?: number[];
}

export interface OrganizationUnitRoleType {
  organizationUnitId: number;
  orgUnitCode: string;
  orgUnitAbbreviation: string;
  orgUnitDescAr: string;
  orgUnitDescEn: string;
  orgUnitEmail: string | null;
  orgUnitManager: string;
  orgUnitLevel: string;
  escalatedPerformer: string;
  parentOrgunit: string | null;
  grantAccessToParentOrgUnit: boolean;
  isActive: string;
  listOrgUnitRoles: RoleDetails[];
  listOrgUnitGroups: null;
  listOrganizationUnitDTO: null;
  orgUnitManagerid: string;
  opentextInboundExternalFolderId: number;
  opentextInboundInternalFolderId: number;
  opentextOutboundExternalFolderId: number;
  opentextOutboundInternalFolderId: number;
  enableG2g: boolean;
  g2gCode: number;
}

export interface CreateOrgUnitUserRolesPayLoadType {
  listUsersOrgUnitRoles: CreateOrgUnitUserRoles[];
}

export interface AllowedCodeType {
  enName: string;
  arName: string;
  allowedCode: string;
  links: any[];
}

export interface AllowedValuesType {
  flag: boolean;
  type: string;
  allowedCodes?: AllowedCodeType[];
  links?: any[];
}

export interface OrgUnitAllowedDataType {
  orgunitId: number;
  allowedValues: AllowedValuesType[];
}

export interface CanReviewCorrespondenceType {
  organizationUnitId: number;
  canReviewCorrespondences: string;
  listOrgUnitGroups: any;
  listOrganizationUnitDTO: any;
}

export const EntitySchema = z.object({
  entity_id: z.number(),
  entity_code: z.string(),
  entity_abbr: z.string(),
  entity_desc_ar: z.string(),
  entity_desc_en: z.string(),
  entity_level: z.string(),
  escalated_performer: z.string(),
  parent_id: z.number(),
  is_active: z.string(),
  enable_g2g: z.string(),
  can_final_approve_externals: z.string(),
  can_final_approve_internals: z.string(),
  can_send_to_all_receiving: z.string(),
  can_review_correspondences: z.string(),
  g2g_code: z.string(),
  listOrgUnitGroups: z.any(),
  listOrganizationUnitDTO: z.any(),
});

export type OUEntityType = z.infer<typeof EntitySchema>;

export type OrgUnitRoleType = {
  id: string;
  role_name: string;
  role_type: string;
  role_map_id: number;
  users: number[];
};
export type AllowedValueType = {
  allowed_type: number;
  entities: number[];
};

export type OrganizationUnitRoles = {
  id: string;
  role_name: string;
  role_type: string;
};

export interface RoleDataItem {
  role_map_id: number;
  users: number[]; // or specify the user type if known
}

export interface RoleDataResponse {
  [id: string]: RoleDataItem;
}

export type OrgUnitOptionsInfoType = {
  id: number;
  entity_level_id: number;
  escalated_performer_id: number;
  parent_id: number;
  grant_access_to_parent: boolean;
  manager_id: number;
  enable_g2g: boolean;
  enable_final_approve_any_announcements: boolean;
  enable_final_approve_any_externals: boolean;
  enable_final_approve_any_internals: boolean;
  enable_send_to_any_receiving: boolean;
  enable_review_correspondences: boolean;
};

export type OrgUnitBasicInfoType = {
  abbr: string;
  created_at: string;
  created_by: string;
  deleted_at: string;
  deleted_by: string;
  email: string;
  entity_code: string;
  entity_type_id: number;
  g2g_code: string;
  id: number;
  is_active: boolean;
  is_deleted: boolean;
  modified_at: string;
  modified_by: string;
  name_ar: string;
  name_en: string;
};

export type OrgUnitMergedDataType = OrgUnitBasicInfoType &
  OrgUnitOptionsInfoType;

export type UpdateOUType = Partial<OrgUnitMergedDataType>;

export type updateOrgUnitRolesPayloadType = {
  role_map_id: number;
  users: number[];
}[];

export type updateOrgUnitAllowedValuesPayloadType = {
  allowed_type: number;
  entities: number[];
}[];

export type AnnouncementType = {
  email: string;
  entity_code: string;
  entity_type_id: number;
  id: number;
  is_active: true;
  name_ar: string;
  name_en: string;
};
