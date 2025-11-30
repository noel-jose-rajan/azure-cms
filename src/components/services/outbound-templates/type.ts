export interface OutboundTemplateType {
  id: number;
  file_name: string;
  is_general_template?: boolean;
  template_name: string;
  created_at: string;
  updated_at: string;
  entities: any[];
}

export interface GetAllOBTemplateType {
  Message: string;
  Data: OutboundTemplateType[];
  Info: string;
}

export interface OBTemplateType {
  ID?: number;
  FileName: string;
  IsGeneralTemplate: boolean;
  ContentID: string;
  TemplateName: string;
  CreatedBy?: string;
  EntityIdList: number[];
}

export interface GetOBTemplateType {
  Message: string;
  Data: OBTemplateType;
  Info: string;
}
