import { useLanguage } from "@/context/language";
import {
  EntityStatistics,
  StatisticsType,
} from "@/pages/dashboard_new/service";
import ManagerSelectOrgs from "@/pages/dashboard_new/shared/manager-select-orgs";
import CurrentTasks from "@/pages/dashboard_new/user-dashboard/components/current-tasks";
import { Col } from "antd";
import React, { useState } from "react";

type Props = {
  orgs: number[];
  statistics: EntityStatistics[] | null;
};
const CurrentTasksCards = ({ orgs = [], statistics }: Props) => {
  const { isEnglish } = useLanguage();
  const [selectedOU, setSelectedOU] = useState<number | null>(orgs[0]);

  const filteredStatistics: StatisticsType[] =
    statistics
      ?.filter((st) => st.entity_id == selectedOU)
      ?.map((st) => ({
        is_task_breach: st?.is_task_breach,
        process_type_id: st?.process_type_id,
        task_type_id: st?.task_type_id,
        total: st?.total,
      })) || [];

  return (
    <div style={{ direction: isEnglish ? "ltr" : "rtl" }}>
      <Col xs={24} md={12} lg={8} style={{ marginBlock: 4 }}>
        <ManagerSelectOrgs
          value={selectedOU}
          onChange={(val) => setSelectedOU(val)}
          orgs={orgs}
        />
      </Col>

      <CurrentTasks statistics={filteredStatistics} key={selectedOU} />
    </div>
  );
};

export default CurrentTasksCards;
