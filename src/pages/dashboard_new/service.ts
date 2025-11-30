import ENV from "@/constants/env";
import LOCALSTORAGE from "@/constants/local-storage";
import apiRequest from "@/lib/api";
import Storage from "@/lib/storage";
import { AxiosRequestConfig } from "axios";
import { FilterTasksFormType } from "./manager-dashboard/components/filter-tasks/components/schema";

export interface StatisticsType {
  is_task_breach: boolean;
  process_type_id: number;
  task_type_id: number;
  total: number;
}

export const getCurrentTasksStatistics = async (): Promise<
  StatisticsType[]
> => {
  const token = await Storage.getItem(LOCALSTORAGE.ACCESS_TOKEN);

  const headers: AxiosRequestConfig["headers"] = {
    Authorization: `Bearer ${token}`,
  };
  const response = await apiRequest(
    "GET",
    `/kpi/task/statistics`,
    {},
    { headers },
    ENV.API_URL
  );
  return response;
};

export interface Performance {
  kpi: number;
  process_kpi: ProcessKpi[];
  tasks: StatisticsType[];
  week_tasks: StatisticsType[];
}

export interface ProcessKpi {
  process_id: number;
  kpi?: number;
}

export const getUserPerformance = async (): Promise<Performance> => {
  const token = await Storage.getItem(LOCALSTORAGE.ACCESS_TOKEN);

  const headers: AxiosRequestConfig["headers"] = {
    Authorization: `Bearer ${token}`,
  };
  const response = await apiRequest(
    "GET",
    `/kpi/task/performance`,
    {},
    { headers },
    ENV.API_URL
  );
  return response;
};
export const hasOrgUnits = async (): Promise<number[] | null> => {
  const token = await Storage.getItem(LOCALSTORAGE.ACCESS_TOKEN);

  const headers: AxiosRequestConfig["headers"] = {
    Authorization: `Bearer ${token}`,
  };
  const response = await apiRequest(
    "GET",
    "/role/has-org-unit-manager",
    {},
    { headers },
    ENV.API_URL
  );
  return response;
};

export interface EntityStatistics {
  entity_id: number;
  entity_name: string;
  is_task_breach: boolean;
  process_type_id: number;
  task_type_id: number;
  total: number;
}
export type TransformedEntityStatistics = {
  col_counts?: number;
  total_Bearched?: number;
} & EntityStatistics;

export const getCurrentTasksStatisticsForEntities = async (): Promise<
  EntityStatistics[]
> => {
  const token = await Storage.getItem(LOCALSTORAGE.ACCESS_TOKEN);

  const headers: AxiosRequestConfig["headers"] = {
    Authorization: `Bearer ${token}`,
  };
  const response = await apiRequest(
    "GET",
    "/kpi/task/manager/statistics",
    {},
    { headers },
    ENV.API_URL
  );
  return response;
};

export interface EmployeePerformance {
  assignee: number;
  assignee_name: string;
  kpi: number;
  total: number;
  total_breach: number;
}

export const gelAllEmployeePerformance = async (): Promise<
  EmployeePerformance[]
> => {
  const token = await Storage.getItem(LOCALSTORAGE.ACCESS_TOKEN);

  const headers: AxiosRequestConfig["headers"] = {
    Authorization: `Bearer ${token}`,
  };
  const response = await apiRequest(
    "GET",
    "/kpi/task/performance/manager",
    {},
    { headers },
    ENV.API_URL
  );
  return response;
};

export type EmployeeType = {
  id: number;
  name: string;
};
export const getEmployeeList = async (): Promise<EmployeeType[]> => {
  const token = await Storage.getItem(LOCALSTORAGE.ACCESS_TOKEN);

  const headers: AxiosRequestConfig["headers"] = {
    Authorization: `Bearer ${token}`,
  };
  const response = await apiRequest(
    "GET",
    "/role/manager/list-employees",
    {},
    { headers },
    ENV.API_URL
  );
  return response;
};

export interface FilterTaskData {
  ID: number;
  ProcessTypeID: number;
  TaskTypeID: number;
  IsUser: boolean;
  AcquiredDate: string;
  TaskDueDate: string;
  TaskDate: string;
  CorrespondenceId: number;
  CorrSubject: string;
  CorrespondenceNo: string;
  Assignee: number;
}

export interface DashboardFilterTasks {
  Page: number;
  PerPage: number;
  TotalPages: number;
  Total: number;
  Rows: FilterTaskData[];
}

export const filterTasks = async (
  body: FilterTasksFormType,
  page: number
): Promise<DashboardFilterTasks> => {
  const token = await Storage.getItem(LOCALSTORAGE.ACCESS_TOKEN);

  const headers: AxiosRequestConfig["headers"] = {
    Authorization: `Bearer ${token}`,
  };
  const response = await apiRequest(
    "POST",
    `/kpi/task/manager/filter?perPage=10&page=${page}`,
    body,
    { headers },
    ENV.API_URL
  );
  return response;
};

export const getUsersByRoleId = async (
  id: string | number,
  isArabic: boolean
): Promise<EmployeeType[]> => {
  const token = await Storage.getItem(LOCALSTORAGE.ACCESS_TOKEN);

  const headers: AxiosRequestConfig["headers"] = {
    Authorization: `Bearer ${token}`,
  };
  const response = await apiRequest(
    "GET",
    `/role/${id}/list-user?is_arabic=${isArabic}`,
    {},
    { headers },
    ENV.API_URL
  );
  return response;
};
export type ApiEntry = { month: string; total: number };
export type ApiResponse = { total?: ApiEntry[]; complete?: ApiEntry[] };

export const getMonthlyKpi = async (): Promise<ApiResponse> => {
  const token = await Storage.getItem(LOCALSTORAGE.ACCESS_TOKEN);

  const headers: AxiosRequestConfig["headers"] = {
    Authorization: `Bearer ${token}`,
  };
  const response = await apiRequest(
    "GET",
    `/kpi/task/monthly`,
    {},
    { headers },
    ENV.API_URL
  );
  return response;
};
