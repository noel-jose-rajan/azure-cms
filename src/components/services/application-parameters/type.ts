export interface AppParameterType {
  param_key: string;
  param_value: string;
}

export interface GetAllParameterType {
  Info: string;
  Message: string;
  Data: AppParameterType[];
}
