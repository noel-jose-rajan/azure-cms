// import TableComponent from "@/components/ui/table-component";
// import { CONST_DATA } from "@/constants/app";
// import { useLanguage } from "@/context/language";
// import {
//   EntityStatistics,
//   TransformedEntityStatistics,
// } from "@/pages/dashboard_new/service";
// import useGetAllOU from "@/store/orgs/use-get-all-ou";
// import usePicklist from "@/store/picklists/use-picklist";
// import { TableColumnsType } from "antd";

// type Props = {
//   data: TransformedEntityStatistics[];
// };
// const EntityStatisticsTable = ({ data }: Props) => {
//   const { labels, isEnglish } = useLanguage();
//   const { getOrgById } = useGetAllOU();
//   const { getPicklistById } = usePicklist();

//   const getProcessLabel = (id: string | number) => {
//     if (id === CONST_DATA.Outbound_Process_Id) {
//       return labels.til.outbound;
//     } else if (
//       id === CONST_DATA.Inbound_Process_Id ||
//       id === CONST_DATA.Route_Process_Id
//     ) {
//       return labels.til.inbound;
//     } else if (id === CONST_DATA.Adhoc_Process_Id) {
//       return labels.til.adhoc;
//     } else {
//       return "-";
//     }
//   };

//   const columns: TableColumnsType<TransformedEntityStatistics> = [
//     {
//       title: labels.lbl.org_unit,
//       dataIndex: "entity_id",
//       render: (id: number) => {
//         const ou = getOrgById(id);

//         return (
//           <span style={{ textWrap: "balance" }}>
//             {(isEnglish ? ou?.name_en : ou?.name_ar) || "-"}
//           </span>
//         );
//       },
//       onCell: (record, rowIndex) => {
//         const isFirst =
//           rowIndex === data?.findIndex((r) => r.entity_id === record.entity_id);

//         return {
//           rowSpan: isFirst ? record.col_counts : 0,
//         };
//       },
//       width: 100,
//       // ellipsis: true,
//     },
//     {
//       title: labels.lbl.corr_types,
//       dataIndex: "process_type_id",

//       render: (id: string) => {
//         const text = getProcessLabel(id);
//         return <span>{text}</span>;
//       },
//       width: 100,
//       ellipsis: true,
//     },
//     {
//       title: labels.lbl.task_name,
//       dataIndex: "task_type_id",
//       render: (id: string) => {
//         const p = getPicklistById("Task Subject", id);
//         return (
//           <span>
//             {(isEnglish ? p?.picklist_en_label : p?.picklist_ar_label) || "-"}
//           </span>
//         );
//       },
//       width: 100,
//       ellipsis: true,
//     },

//     {
//       title: labels.lbl.total_Breached,
//       dataIndex: "total_Bearched",
//       render: (_text: string) => {
//         return <span>{_text ?? "-"}</span>;
//       },
//       width: 100,
//       ellipsis: true,
//     },
//     {
//       title: labels.lbl.total,
//       dataIndex: "total",
//       render: (_text: string) => {
//         return <span>{_text || "-"}</span>;
//       },
//       width: 100,
//       ellipsis: true,
//     },
//   ];

//   return (
//     <TableComponent<TransformedEntityStatistics>
//       // isLoading={loading}
//       sortDirections={["ascend", "descend"]}
//       columns={columns}
//       dataSource={data}
//       scroll={{ x: "max-content" }}
//       size="small"
//       style={{ marginTop: 15, width: "fit-content" }}
//       rowKey="id"
//     />
//   );
// };

// export default EntityStatisticsTable;

// import { Bar } from "react-chartjs-2";
// import {
//   Chart as ChartJS,
//   CategoryScale,
//   LinearScale,
//   BarElement,
//   Tooltip,
//   Legend,
// } from "chart.js";
// import { useMemo } from "react";

// ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

// type ChartProps = {
//   data: TransformedEntityStatistics[];
// };

// export const EntityStatisticsBarChart = ({ data }: ChartProps) => {
//   const { isEnglish } = useLanguage();
//   const { getPicklistById } = usePicklist();

//   // 🧠 Memoize labels and datasets
//   const { labels, totalData, breachedData } = useMemo(() => {
//     const labels: string[] = [];
//     const totalData: number[] = [];
//     const breachedData: number[] = [];

//     data.forEach((item) => {
//       const label =
//         getPicklistById("Task Subject", item.task_type_id)?.[
//           isEnglish ? "picklist_en_label" : "picklist_ar_label"
//         ] ?? "-";

//       labels.push(label);
//       totalData.push(item.total);
//       breachedData.push(item.total_Bearched || 0);
//     });

//     return { labels, totalData, breachedData };
//   }, [data, isEnglish, getPicklistById]);

//   // 📊 Chart config
//   const chartData = {
//     labels,
//     datasets: [
//       {
//         label: isEnglish ? "Total" : "الإجمالي",
//         data: totalData,
//         backgroundColor: "#4CAF50",
//         barThickness: 10,
//       },
//       {
//         label: isEnglish ? "Breached" : "المتأخرة",
//         data: breachedData,
//         backgroundColor: "#F44336",
//         barThickness: 10,
//       },
//     ],
//   };

//   const options = {
//     responsive: true,
//     plugins: {
//       legend: { position: "top" },
//       tooltip: { mode: "index", intersect: false },
//     },
//     scales: {
//       x: {
//         stacked: false,
//         categoryPercentage: 0.6,
//         barPercentage: 0.9,
//       },
//       y: {
//         beginAtZero: true,
//       },
//     },
//   };

//   return (
//     <div style={{ height: 300, display: "flex", alignSelf: "center" }}>
//       <Bar data={chartData} options={options} />
//     </div>
//   );
// };
import { useMemo, useState } from "react";
import { Col, Select } from "antd";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";
import { CONST_DATA } from "@/constants/app";
import { useLanguage } from "@/context/language";
import usePicklist from "@/store/picklists/use-picklist";
import { TransformedEntityStatistics } from "@/pages/dashboard_new/service";
import WhileInViewWrapper from "@/animations/while-in-view-wrapper";
import SelectComponent from "@/components/ui/form/select";
import useGetAllOU from "@/store/orgs/use-get-all-ou";
import FadeInWrapperAnimation from "@/animations/fade-in-wrapper-animation";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

type Props = {
  data: TransformedEntityStatistics[];
};

const EntityStatisticsOrgDashboard = ({ data }: Props) => {
  const { isEnglish } = useLanguage();
  const { getPicklistById } = usePicklist();
  const { getOrgById, orgUnits } = useGetAllOU();
  // 🧠 Extract unique orgs
  const orgOptions = useMemo(() => {
    const map = new Map<number, string>();
    data.forEach((item) => {
      if (!map.has(item.entity_id)) {
        map.set(item.entity_id, item.entity_name);
      }
    });
    return Array.from(map.entries()).map(([id, name]) => {
      const ou = getOrgById(id);
      return {
        label: isEnglish ? ou?.name_en : ou?.name_ar,
        value: id,
      };
    });
  }, [data, isEnglish, orgUnits]);

  const [selectedOrgId, setSelectedOrgId] = useState<number | null>(
    orgOptions[0]?.value ?? null
  );

  // 🧠 Filter data by selected org
  const filtered = useMemo(() => {
    return data.filter((item) => item.entity_id === selectedOrgId);
  }, [data, selectedOrgId]);

  // 📊 Chart data
  const chartLabels: string[] = [];
  const totalData: number[] = [];
  const breachedData: number[] = [];

  const breakdownTasks: { en: string; ar: string; icon: string }[] = [];
  const status = { Executed: [] as number[], NotExecuted: [] as number[] };

  filtered.forEach((item) => {
    const label =
      getPicklistById("Task Subject", item.task_type_id)?.[
        isEnglish ? "picklist_en_label" : "picklist_ar_label"
      ] ?? "-";

    chartLabels.push(label);
    totalData.push(item.total || 0);
    breachedData.push(item.is_task_breach ? item.total : 0);

    breakdownTasks.push({
      en: label,
      ar: label,
      icon: "📄", // customize per task type if needed
    });

    status.Executed.push(item.is_task_breach ? 0 : item.total);
    status.NotExecuted.push(item.is_task_breach ? item.total : 0);
  });

  const chartData = {
    labels: chartLabels,
    datasets: [
      {
        label: isEnglish ? "Total" : "الإجمالي",
        data: totalData,
        backgroundColor: "#4CAF50",
        barThickness: 10,
      },
      {
        label: isEnglish ? "Breached" : "المتأخرة",
        data: breachedData,
        backgroundColor: "#F44336",
        barThickness: 10,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: { mode: "index" as const, intersect: false },
    },
    scales: {
      x: {
        stacked: false,
        categoryPercentage: 0.6,
        barPercentage: 0.9,
      },
      y: {
        beginAtZero: true,
      },
    },
  };

  // 🧾 Custom legend
  const renderBreakdown = (
    tasks: { en: string; ar: string; icon: string }[],
    status: { Executed: number[]; NotExecuted: number[] },
    isEnglish: boolean
  ) => (
    <WhileInViewWrapper
      once={false}
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(180px, 2fr))",
        gap: 10,
        direction: isEnglish ? "ltr" : "rtl",
        fontSize: 13,
        padding: 12,
        height: "fit-content",
        overflowY: "auto",
        alignContent: "start",
      }}
    >
      {tasks.map((task, i) => {
        const executed = status.Executed[i] ?? 0;
        const notExecuted = status.NotExecuted[i] ?? 0;
        const total = executed + notExecuted || 1;
        const pct = Math.round((executed / total) * 100);

        return (
          <div
            key={i}
            style={{
              background: "#fff",
              borderRadius: 10,
              padding: "10px",
              minWidth: 180,
              boxShadow: "0 6px 18px rgba(16,24,40,0.04)",
              display: "flex",
              flexDirection: "column",
              gap: 8,
            }}
          >
            <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 8,
                  background:
                    "linear-gradient(180deg, rgba(0,0,0,0.04), rgba(0,0,0,0.02))",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 18,
                }}
              >
                {task.icon}
              </div>
              <div
                style={{
                  overflow: "hidden",
                  textAlign: isEnglish ? "left" : "right",
                }}
              >
                <div
                  style={{
                    fontWeight: 700,
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {isEnglish ? task.en : task.ar}
                </div>
                <div style={{ fontSize: 12, color: "rgba(0,0,0,0.52)" }}>
                  {executed + notExecuted} {isEnglish ? "tasks" : "مهام"}
                </div>
              </div>
            </div>

            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <div
                style={{
                  flex: 1,
                  height: 8,
                  borderRadius: 6,
                  background: "#f0f0f0",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    width: `${pct}%`,
                    height: "100%",
                    background: "linear-gradient(90deg,#2fc25b,#1fa63a)",
                  }}
                />
              </div>
              <div
                style={{
                  minWidth: 44,
                  fontSize: 12,
                  textAlign: "right",
                  color: "rgba(0,0,0,0.65)",
                }}
              >
                {pct}%
              </div>
            </div>

            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <div
                style={{
                  display: "flex",
                  gap: 6,
                  alignItems: "center",
                  fontSize: 12,
                }}
              >
                <span
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: 2,
                    background: "#2fc25b",
                    display: "inline-block",
                  }}
                />
                <span style={{ color: "rgba(0,0,0,0.75)" }}>
                  {isEnglish ? "Executed" : "تم التنفيذ"}
                </span>
                <strong style={{ marginLeft: 6 }}>{executed}</strong>
              </div>

              <div
                style={{
                  display: "flex",
                  gap: 6,
                  alignItems: "center",
                  fontSize: 12,
                }}
              >
                <span
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: 2,
                    background: "red",
                    display: "inline-block",
                  }}
                />
                <span style={{ color: "rgba(0,0,0,0.75)" }}>
                  {isEnglish ? "Breached" : " متأخر  التنفذ"}
                </span>
                <strong style={{ marginLeft: 6 }}>{notExecuted}</strong>
              </div>
            </div>
          </div>
        );
      })}
    </WhileInViewWrapper>
  );

  return (
    <FadeInWrapperAnimation
      animateDelay={0.5}
      enableScaleAnimation={false}
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 20,
        direction: isEnglish ? "ltr" : "rtl",
      }}
    >
      <div style={{ maxWidth: 300 }}>
        <SelectComponent
          key={isEnglish + " manager orgs"}
          options={orgOptions}
          setFirstOptionAsDefault={true}
          showDefaultValueIfOneOption
          value={selectedOrgId}
          onChange={(val) => setSelectedOrgId(val)}
          style={{ width: 300 }}
          label={isEnglish ? "Select Organization" : "اختر الوحدة التنظيمية"}
        />
      </div>
      {selectedOrgId && (
        <div style={{ display: "flex", flexWrap: "wrap", width: "100%" }}>
          <Col xs={24} lg={13} xl={14}>
            <Bar data={chartData} options={chartOptions} />
          </Col>
          <Col xs={24} lg={11} xl={10}>
            {renderBreakdown(breakdownTasks, status, isEnglish)}
          </Col>
        </div>
      )}
    </FadeInWrapperAnimation>
  );
};

export default EntityStatisticsOrgDashboard;
