import { z } from "zod";

export interface UserType {
  userId: string;
  username: string;
  email: string;
  nameEng: string;
  nameAr: string;
  userDescription: string;
  birthDate: string;
  civilId: number;
  isTwoFactorAuthEnabled: boolean;
  isActiveUser: boolean;
  roles: any;
  language: string;
  isDelegator: boolean;
  delegationId: number;
}

export const userSearchSchema = z.object({
  orgUnit: z.number(),
  userLoginName: z.string(),
  userName: z.string(),
});

export type UserSearchType = z.infer<typeof userSearchSchema>;

export interface UserTitleType {
  id: number;
  user_id: number;
  title_ar: string;
  title_en: string;
  isdefault: boolean;
}

export interface UserPreferenceEntityType {
  entityId: number;
  entityCode: string;
  entityDescAr: string;
  entityDescEn: string;
  entityEmail: string;
  managerId: number;
  entityLevel: string;
  isActive: string;
  rolesList: any;
  userId: string;
}
export interface UserPreferenceType {
  id: number;
  user_id: number;
  user_name_ar: string;
  user_name_eng: string;
  is_two_factor_auth_enabled: boolean;
  is_active: boolean;
  is_inline: boolean;
  inbound_receive_final_route: boolean;
  inbound_receive_route_notification: boolean;
  inbound_routing_to_user: boolean;
  outbound_receive_final_notification: boolean;
  last_changed_date: string;
  created_at: string;
  modified_at: string;
  created_by: string;
  modified_by: string;
}

export interface GetUserPreferenceType {
  error: boolean;
  message: string;
  data: UserPreferenceType;
}

export interface AddTitleResponseType {
  error: boolean;
  message: string;
  data: UserTitleType;
}

export interface NotificationPreferencesType {
  id: number;
  code: string;
  type_code: "UI_NOTIFICATION" | "EMAIL";
  name_ar: string;
  name_en: string;
}

export interface UsersOrgUnitRolesType {
  entity_id: number;
  roles: number[];
}

export interface UserRoleType {
  id: number;
  role_name: string;
  role_type: string;
}
