import { FilterTaskData, filterTasks } from "@/pages/dashboard_new/service";
import React, { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import {
  filterTasksFormSchema,
  FilterTasksFormType,
} from "./components/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import FilterForm from "./components/filter-form";
import TasksFilterTable from "./components/table";
import useHandleError from "@/components/hooks/useHandleError";
import { Pagination } from "./components/table/type";

type Props = {
  orgs: number[];
};
const FilterTasks = ({ orgs }: Props) => {
  const { handleError } = useHandleError();
  const [tasks, setTasks] = useState<FilterTaskData[]>([]);
  const methods = useForm<FilterTasksFormType>({
    resolver: zodResolver(filterTasksFormSchema),
    mode: "all",
  });
  const { getValues } = methods;
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    total: 10,
  });

  const handleFilter = async (page = 1) => {
    try {
      setLoading(true);
      const {
        is_task_breach = false,
        assignee,
        entity_id,
        process_type_id,
        task_type_id,
      } = getValues();
      const body = {
        is_task_breach,
        assignee,
        entity_id,
        process_type_id,
        task_type_id,
      };
      const res = await filterTasks(body, page);
      setPagination({
        page,
        total: res?.Total,
      });
      if (res) {
        setTasks(res?.Rows);
      } else {
        setTasks([]);
        setPagination({
          page: 1,
          total: 0,
        });
      }
    } catch (e) {
      handleError(e);
    } finally {
      setLoading(false);
    }
  };
  return (
    <FormProvider {...methods}>
      <FilterForm orgs={orgs} onSearch={handleFilter} />
      <TasksFilterTable
        data={tasks}
        onPagination={(page) => handleFilter(page)}
        pagination={pagination}
      />
    </FormProvider>
  );
};

export default FilterTasks;
