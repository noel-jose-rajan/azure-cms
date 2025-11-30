export interface AppPrivilegeType {
  id: number;
  code: string;
  name_ar: string;
  name_en: string;
}

export interface CreateAppPrivilageType {
  code?: string;
  name_ar: string;
  name_en: string;
  views: number[];
}

export interface APIResponseType<T> {
  Data: T | null;
  Info: string;
  Message: string;
}
