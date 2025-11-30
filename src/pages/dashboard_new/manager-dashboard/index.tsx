import React, { useEffect, useState } from "react";
import {
  EntityStatistics,
  getCurrentTasksStatisticsForEntities,
} from "../service";
import EntityCurrentTasks from "./components/current-tasks";
import TitleHeader from "@/components/ui/header";
import { LineChartOutlined, SearchOutlined } from "@ant-design/icons";
import { useLanguage } from "@/context/language";
import EmployeePerformanceComponent from "./components/Employee-Performance";
import FilterTasks from "./components/filter-tasks";

type Props = {
  orgs: number[];
};
const ManagerDashboard = ({ orgs }: Props) => {
  const { labels } = useLanguage();
  const [entityStatistics, setEntityStatistics] =
    useState<EntityStatistics[]>();

  const getEntitiesStatistics = async () => {
    const res = await getCurrentTasksStatisticsForEntities();
    if (res) {
      setEntityStatistics(res);
    }
  };

  useEffect(() => {
    getEntitiesStatistics();
  }, []);
  return (
    <div style={{ width: "100%" }}>
      <TitleHeader
        style={{ marginBottom: 20 }}
        heading={labels.lbl.currnet_tasks_st}
        icon={<LineChartOutlined style={{ color: "#fff" }} />}
      />
      <EntityCurrentTasks statistics={entityStatistics || []} orgs={orgs} />
      <TitleHeader
        style={{ marginBottom: 20 }}
        heading={labels.til.performance}
        icon={<LineChartOutlined style={{ color: "#fff" }} />}
      />

      <EmployeePerformanceComponent />

      <TitleHeader
        style={{ marginBottom: 20 }}
        heading={labels.til.search_criteria}
        icon={<SearchOutlined style={{ color: "#fff" }} />}
      />

      <FilterTasks orgs={orgs} />
    </div>
  );
};

export default ManagerDashboard;
