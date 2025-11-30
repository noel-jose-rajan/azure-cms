import axios, {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
} from "axios";

export enum HttpStatus {
  SUCCESS,
  FAILED,
  UNAUTHORIZED,
  NOTFOUND,
  FORBIDDEN,
  CONFLICT,
}

export class ServiceResult<T> {
  data: T | null;
  message: string;
  status: HttpStatus;

  constructor(data: T | null, message: string, status: HttpStatus) {
    this.data = data;
    this.message = message;
    this.status = status;
  }
  public static success<T>(data: T | null, message: string): ServiceResult<T> {
    return new ServiceResult<T>(data, message, HttpStatus.SUCCESS);
  }

  public static unAuthorized<T>(message: string): ServiceResult<T> {
    return new ServiceResult<T>(null, message, HttpStatus.UNAUTHORIZED);
  }

  public static notFound<T>(message: string): ServiceResult<T> {
    return new ServiceResult<T>(null, message, HttpStatus.NOTFOUND);
  }

  public static forbidden<T>(
    data: T | null,
    message: string
  ): ServiceResult<T> {
    return new ServiceResult<T>(data, message, HttpStatus.FORBIDDEN);
  }

  public static conflict<T>(data: T | null, message: string): ServiceResult<T> {
    return new ServiceResult<T>(data, message, HttpStatus.CONFLICT);
  }

  public static failed<T>(data: T | null, message: string): ServiceResult<T> {
    return new ServiceResult<T>(data, message, HttpStatus.FAILED);
  }
}

export class HttpClient {
  private axiosInstance: AxiosInstance;

  constructor(baseURL: string) {
    this.axiosInstance = axios.create({
      baseURL,
      headers: { "Content-Type": "application/json" },
    });
  }

  get = async <T>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<ServiceResult<T>> => {
    try {
      const response: AxiosResponse<T> = await this.axiosInstance.get(
        url,
        config
      );
      return this.handleResponse(response);
    } catch (error: any) {
      return this.handleError<T>(error);
    }
  };

  post = async <T, D>(
    url: string,
    data: D,
    config?: AxiosRequestConfig
  ): Promise<ServiceResult<T>> => {
    try {
      const response: AxiosResponse<T> = await this.axiosInstance.post(
        url,
        data,
        config
      );
      return this.handleResponse(response);
    } catch (error: any) {
      return this.handleError<T>(error);
    }
  };

  put = async <T, D>(
    url: string,
    data: D,
    config?: AxiosRequestConfig
  ): Promise<ServiceResult<T>> => {
    try {
      const response: AxiosResponse<T> = await this.axiosInstance.put(
        url,
        data,
        config
      );
      return this.handleResponse(response);
    } catch (error: any) {
      return this.handleError<T>(error);
    }
  };

  delete = async <T>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<ServiceResult<T>> => {
    try {
      const response: AxiosResponse<T> = await this.axiosInstance.delete(
        url,
        config
      );
      return this.handleResponse(response);
    } catch (error: any) {
      return this.handleError<T>(error);
    }
  };

  private handleResponse<T>(response: AxiosResponse<T>): ServiceResult<T> {
    if (response.status >= 200 && response.status <= 299) {
      return ServiceResult.success(
        response.data,
        "API call successfully completed"
      );
    } else if (response.status === 404) {
      return ServiceResult.notFound("Your search item not found");
    } else if (response.status === 401) {
      return ServiceResult.unAuthorized(
        "You no longer have permission to be here"
      );
    } else if (response.status === 403) {
      return ServiceResult.forbidden(
        response.data,
        "You no longer have access to this"
      );
    } else if (response.status === 409) {
      return ServiceResult.conflict(response.data, "Something already exists");
    } else {
      return ServiceResult.failed(response.data, "Unexpected error occurred");
    }
  }

  private handleError<T>(error: AxiosError<T>): ServiceResult<T> {
    if (error.response?.status === 404) {
      return ServiceResult.notFound("Your search item not found");
    } else if (error.response?.status === 401) {
      return ServiceResult.unAuthorized(
        "You no longer have permission to be here"
      );
    } else if (error.response?.status === 403) {
      return ServiceResult.forbidden(
        error.response.data,
        "You no longer have access to this"
      );
    } else if (error.response?.status === 409) {
      return ServiceResult.conflict(error.response.data, "Conflict detected");
    } else {
      return ServiceResult.failed(
        error.response?.data ?? null,
        "Unexpected error occurred"
      );
    }
  }
}
