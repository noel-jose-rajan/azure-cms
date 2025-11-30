export type CreateOrUpdate = {
  Message: string;
  ID: number;
};

export interface ApiResponseType<T> {
  Message: string;
  Data: T | null;
  Info: string;
}
