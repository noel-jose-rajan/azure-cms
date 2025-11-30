import { arabicLabels } from "@/constants/app-constants/ar";
import { englishLabels } from "@/constants/app-constants/en";
import {
  EntityStatistics,
  TransformedEntityStatistics,
} from "@/pages/dashboard_new/service";
import React, { useMemo, useState } from "react";
import EntityStatisticsTable from "./components/table";
import { CONST_DATA } from "@/constants/app";
import { useLanguage } from "@/context/language";
import HeightAnimationWrapper from "@/animations/height-wrapper-animation";
import FadeInWrapperAnimation from "@/animations/fade-in-wrapper-animation";
import CurrentTasksCards from "./components/current-tasks-cards";
import EntityStatisticsOrgDashboard from "./components/table";

function transformData(data: EntityStatistics[]) {
  const tempMap: { [key: string]: EntityStatistics[] } = {};

  for (const item of data) {
    const key = `${item?.entity_id}-${item?.task_type_id}`;
    if (!tempMap[key]) tempMap[key] = [];
    tempMap[key].push(item);
  }

  const reduced: any[] = [];

  for (const group of Object.values(tempMap)) {
    const breached = group.find((i) => i.is_task_breach);
    const regular = group.find((i) => !i.is_task_breach);

    if (breached && regular) {
      reduced.push({
        ...regular,
        total_Bearched: breached.total,
      });
    } else {
      const solo = breached || regular;
      reduced?.push({
        ...solo,
        total_Bearched: breached ? breached.total : 0,
      });
    }
  }

  const entityCount: { [key: number]: number } = {};
  for (const item of reduced) {
    entityCount[item.entity_id] = (entityCount[item.entity_id] || 0) + 1;
  }

  return reduced?.map((item) => ({
    ...item,
    col_counts: entityCount[item.entity_id],
    total: item.total,
  }));
}
type Props = {
  statistics: EntityStatistics[];
  orgs: number[];
};
const EntityCurrentTasks = ({ statistics = [], orgs }: Props) => {
  const { isEnglish } = useLanguage();
  const [mode, setMode] = useState<"table" | "card">("table");

  const transformedData = transformData(statistics);

  return (
    <div>
      {/* <Col
        style={{
          display: "flex",
          justifyContent: !isEnglish ? "flex-end" : "flex-start",
          marginRight: 10,
          marginBlock: 10,
        }}
      >
        <Radio.Group
          defaultValue={mode}
          buttonStyle="solid"
          onChange={(e) => {
            setMode(e.target.value);
            localStorage.setItem("inbox-view-mode", e.target.value);
          }}
        >
          <Radio.Button value={"table"}>
            <TableOutlined style={{ marginInline: 10 }} />
            {isEnglish ? "Table" : "جدول"}
          </Radio.Button>
          <Radio.Button value={"card"}>
            <BarChartOutlined style={{ marginInline: 10 }} />
            {isEnglish ? "card" : "بطاقة"}
          </Radio.Button>
        </Radio.Group>
      </Col> */}
      <HeightAnimationWrapper>
        {mode === "table" ? (
          <FadeInWrapperAnimation
            key="EntityStatisticsTable"
            enableScaleAnimation={false}
            animateDelay={0.3}
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(500px, 1fr))",
              gap: "20px",
              width: "100%",
              alignItems: "start",
            }}
          >
            <EntityStatisticsTable data={transformedData || []} />
            {/* <EntityStatisticsBarChart data={transformedData || []} /> */}
          </FadeInWrapperAnimation>
        ) : (
          <FadeInWrapperAnimation
            key="CurrentTasksCards"
            enableScaleAnimation={false}
            animateDelay={0.3}
          >
            {/* <CurrentTasksCards orgs={orgs} statistics={statistics} /> */}
            <EntityStatisticsOrgDashboard data={transformedData || []} />
          </FadeInWrapperAnimation>
        )}
      </HeightAnimationWrapper>
    </div>
  );
};

export default EntityCurrentTasks;
