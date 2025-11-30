import { useLanguage } from "@/context/language";
import { Performance } from "../../../service";
import KPIBarChart from "./components/kpi-chart";
import { arabicLabels } from "@/constants/app-constants/ar";
import { englishLabels } from "@/constants/app-constants/en";
import { useMemo } from "react";
import usePicklist from "@/store/picklists/use-picklist";
import { CONST_DATA } from "@/constants/app";
import { PieChartData } from "../../../types";
import { useTheme } from "@/context/theme";
import {
  TasksPieChart,
  TasksPolarAreaChart,
  TasksRadarChart,
} from "./components/overall-tasks-chart";

import QuickActions from "./components/quick-actions";
import { Col, Row } from "antd";
import MonthlyKpi from "./montlhy-kpi";
import KpiDoughnutCharts from "./components/kpi-chart/kpi-details-chart";
import KpiChartsWithCustomLegend from "./components/kpi-chart/kpi-details-chart";
import KpiDashboard from "./components/tasks-details";
import DetailedKpiChartsWithCustomLegend from "./components/tasks-details";
const defaultTasks = [
  {
    process_type_id: 1,
    task_type_id: 105,
    is_task_breach: false,
    total: 2,
  },
  {
    process_type_id: 1,
    task_type_id: 105,
    is_task_breach: true,
    total: 1,
  },
  {
    process_type_id: 1,
    task_type_id: 106,
    is_task_breach: false,
    total: 4,
  },
  {
    process_type_id: 1,
    task_type_id: 106,
    is_task_breach: true,
    total: 0,
  },
  {
    process_type_id: 2,
    task_type_id: 110,
    is_task_breach: false,
    total: 2,
  },
];
type Props = {
  performance: Performance | null;
};
const UserPerformance = ({ performance }: Props) => {
  const { picklists } = usePicklist();
  const { isEnglish } = useLanguage();
  const { theme } = useTheme();
  const kpiChartData: PieChartData[] = useMemo(() => {
    const outboundKPI =
      performance?.process_kpi?.find(
        (t) => t.process_id == CONST_DATA.Outbound_Process_Id
      )?.kpi || 0;
    const adhocKPI =
      performance?.process_kpi?.find(
        (t) => t.process_id == CONST_DATA.Adhoc_Process_Id
      )?.kpi || 0;

    const selectedKpis =
      performance?.process_kpi?.filter(
        (p) =>
          [CONST_DATA.Inbound_Process_Id, CONST_DATA.Route_Process_Id].includes(
            p.process_id
          ) && typeof p.kpi === "number"
      ) || [];

    const inboundKPI =
      selectedKpis?.reduce((sum, p) => sum + (p?.kpi ?? 0), 0) /
      selectedKpis?.length;
    return [
      {
        arLabel: arabicLabels.til.all,
        enLabel: englishLabels.til.all,
        process_id: 5,
        kpi: performance?.kpi || 70,
        color: theme.colors.primary,
      },
      {
        arLabel: arabicLabels.til.outbound,
        enLabel: englishLabels.til.outbound,
        process_id: 5,
        kpi: outboundKPI || 20,
        color: theme.colors.accent,
      },
      {
        arLabel: arabicLabels.til.inbound,
        enLabel: englishLabels.til.inbound,
        process_id: 5,
        kpi: inboundKPI || 67,
        color: theme.colors.success,
      },
      {
        arLabel: arabicLabels.til.adhoc,
        enLabel: englishLabels.til.adhoc,
        process_id: 5,
        kpi: adhocKPI || 30,
        color: "#F4A261",
      },
    ];
  }, [performance, picklists]);

  return (
    <div style={{ direction: isEnglish ? "ltr" : "rtl" }}>
      <Row
        gutter={[8, 8]}
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "row",
          flexWrap: "wrap",
          direction: isEnglish ? "ltr" : "rtl",
        }}
      >
        <Col
          xl={8}
          md={11}
          xs={24}
          sm={24}
          style={{
            minHeight: "100%",
            border: `1px solid ${theme.colors.border}`,
            background: theme.colors.backgroundText,
            borderRadius: 0,
            overflow: "hidden",
            paddingInline: 24,
          }}
        >
          <KPIBarChart kpiChartData={kpiChartData} />
        </Col>

        <KpiChartsWithCustomLegend isEnglish={isEnglish} />
      </Row>
      <Row
        gutter={[8, 8]}
        style={
          {
            // width: "100%",
            // display: "flex",
            // flexDirection: "row",
            // flexWrap: "wrap",
            // direction: isEnglish ? "ltr" : "rtl",
            // marginTop: 8,
          }
        }
      >
        <Col lg={16} md={12} xs={24}>
          <div
            style={{
              marginTop: 8,
              display: "flex",
              flexWrap: "wrap",
              gap: 8,
            }}
          >
            <div
              style={{
                maxHeight: 450,
                border: `1px solid ${theme.colors.border}`,
                background: theme.colors.backgroundText,
                borderRadius: 0,
                overflow: "hidden",
                paddingInline: 24,
                flex: 1,
                minWidth: 320,
                paddingBlock: 8,
              }}
            >
              <TasksPieChart
                type="Doughnut"
                arr={performance?.tasks || []}
                label={
                  isEnglish
                    ? "Overall Completed Tasks"
                    : "المهام المكتملة الكلية"
                }
              />
            </div>
            <div
              style={{
                maxHeight: 450,

                background: theme.colors.backgroundText,
                border: `1px solid ${theme.colors.border}`,
                borderRadius: 0,
                paddingInline: 24,
                // boxShadow: "0 6px 18px rgba(15,23,42,0.06)",
                overflow: "hidden",
                flex: 1,
                minWidth: 320,
                paddingBlock: 8,
              }}
            >
              <TasksPolarAreaChart
                arr={performance?.week_tasks || defaultTasks}
                label={
                  isEnglish
                    ? "Weekly Completed Tasks"
                    : "المهام المكتملة الاسبوعية"
                }
              />
            </div>
          </div>
        </Col>

        <Col
          md={12}
          lg={8}
          xs={24}
          style={{
            position: "relative",
          }}
        >
          <QuickActions />
        </Col>
      </Row>

      <DetailedKpiChartsWithCustomLegend isEnglish={isEnglish} />
      <MonthlyKpi />
    </div>
  );
};

export default UserPerformance;
