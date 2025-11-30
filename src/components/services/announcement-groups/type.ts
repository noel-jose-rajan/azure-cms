export interface AnnouncementGroupsType {
  id: number;
  entity_type_id?: number;
  entity_code: string;
  name_ar: string;
  name_en: string;
  email: string;
  is_active: boolean;
}

export interface CreateAnnouncementGroupType {
  code: string;
  email: string;
  is_active: boolean;
  name_ar: string;
  name_en: string;
}

export interface UpdateAnnouncementGroupType {
  code?: string;
  email: string;
  name_ar: string;
  name_en: string;
}

export interface GroupUserAddType {
  is_all_users: boolean;
  users: number[];
}

export interface SearchGroupsType {
  name_en: string;
  entity_code: string;
  email: string;
  is_active?: boolean;
}
