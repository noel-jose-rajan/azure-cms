import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";
import { useTheme } from "@/context/theme";
import { Col, Row } from "antd";
import TaskSummaryCards from "../summary-card";
import WhileInViewWrapper from "@/animations/while-in-view-wrapper";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

interface Props {
  isEnglish: boolean;
}

const outboundTasks = [
  { en: "Approve Outbound", ar: "اعتماد الصادر", icon: "✔️" },
  { en: "Review Outbound", ar: "مراجعة الصادر", icon: "🔍" },
  { en: "Send Outbound", ar: "إرسال الصادر", icon: "📤" },
  { en: "Rejected Outbound", ar: "رفض الصادر", icon: "❌" },
];

const outboundStatusSeries = {
  Executed: [40, 50, 30, 20],
  NotExecuted: [10, 15, 8, 5],
};

const inboundTasks = [
  { en: "New Inbound", ar: "وارد جديد", icon: "📥" },
  { en: "Rejected Inbound", ar: "رفض الوارد", icon: "🚫" },
  { en: "Reply Routing", ar: "رد التوجيه", icon: "🔁" },
  { en: "View Routing", ar: "عرض التوجيه", icon: "👁️" },
  { en: "Rejected Routing", ar: "رفض التوجيه", icon: "⛔" },
];

const inboundStatusSeries = {
  Executed: [20, 15, 18, 10, 12],
  NotExecuted: [5, 8, 6, 4, 3],
};

const DetailedKpiChartsWithStatusBreakdown: React.FC<Props> = ({
  isEnglish,
}) => {
  const { theme } = useTheme();

  const maxY = Math.max(
    ...outboundStatusSeries.Executed,
    ...outboundStatusSeries.NotExecuted,
    ...inboundStatusSeries.Executed,
    ...inboundStatusSeries.NotExecuted
  );

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false as const,
    plugins: {
      legend: { display: false },
      tooltip: { mode: "index" as const, intersect: false },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: Math.ceil(maxY / 10) * 10,
        title: {
          display: true,
          text: isEnglish ? "Task Count" : "عدد المهام",
        },
        ticks: { precision: 0 },
      },
      x: {
        title: {
          display: true,
          text: isEnglish ? "Task Type" : "نوع المهمة",
        },
      },
    },
    layout: { padding: { top: 8, bottom: 8 } },
  };

  const outboundBarData = {
    labels: outboundTasks.map((t) => (isEnglish ? t.en : t.ar)),
    datasets: [
      {
        label: isEnglish ? "Executed" : "تم التنفيذ",
        data: outboundStatusSeries.Executed,
        backgroundColor: "#2fc25b",
        borderRadius: 6,
        barThickness: 14,
      },
      {
        label: isEnglish ? "Not Executed" : "لم ينفذ",
        data: outboundStatusSeries.NotExecuted,
        backgroundColor: "#f6c022",
        borderRadius: 6,
        barThickness: 14,
      },
    ],
  };

  const inboundBarData = {
    labels: inboundTasks.map((t) => (isEnglish ? t.en : t.ar)),
    datasets: [
      {
        label: isEnglish ? "Executed" : "تم التنفيذ",
        data: inboundStatusSeries.Executed,
        backgroundColor: "#2fc25b",
        borderRadius: 6,
        barThickness: 14,
      },
      {
        label: isEnglish ? "Not Executed" : "لم ينفذ",
        data: inboundStatusSeries.NotExecuted,
        backgroundColor: "#f6c022",
        borderRadius: 6,
        barThickness: 14,
      },
    ],
  };

  const renderBreakdown = (
    tasks: { en: string; ar: string; icon: string }[],
    status: { Executed: number[]; NotExecuted: number[] },
    isEnglish: boolean
  ) => (
    <WhileInViewWrapper
    once={false}
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
        gap: 10,
        direction: isEnglish ? "ltr" : "rtl",
        fontSize: 13,
        padding: 8,
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
              background: theme?.colors?.backgroundText ?? "#fff",
              borderRadius: 10,
              padding: "10px",
              minWidth: 180,
              boxShadow: "0 6px 18px rgba(16,24,40,0.04)",
              display: "flex",
              flexDirection: "column",
              gap: 8,
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                gap: 8,
                alignItems: "center",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  minWidth: 0,
                }}
              >
                <div
                  aria-hidden
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
                    {total} {isEnglish ? "tasks" : "مهام"}
                  </div>
                </div>
              </div>

              {/* <div style={{ textAlign: "right", minWidth: 56 }}>
                <div style={{ fontSize: 16, fontWeight: 800 }}>{executed}</div>
                <div style={{ fontSize: 11, color: "rgba(0,0,0,0.45)" }}>
                  {isEnglish ? "done" : "منفذ"}
                </div>
              </div> */}
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

            <div
              style={{
                display: "flex",
                gap: 8,
                justifyContent: "flex-start",
                flexWrap: "wrap",
              }}
            >
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
                    background: "#f6c022",
                    display: "inline-block",
                  }}
                />
                <span style={{ color: "rgba(0,0,0,0.75)" }}>
                  {isEnglish ? "Not Executed" : "لم ينفذ"}
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
    <Row gutter={[8, 8]} style={{ marginTop: 8 }}>
      <Col lg={18} xl={20} md={16} xs={24}>

      <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
        <WhileInViewWrapper once={false}
          style={{
       minHeight:"100%",
          
            border: `1px solid ${theme.colors.border}`,
            background: theme.colors.backgroundText,
            padding: 24,
            display: "flex",
            flexDirection: "column",
            flex:1,width:360,


          }}
        >
          <h3 style={{ textAlign: "center" }}>
            {isEnglish ? "Outbound Task Status" : "حالة مهام الصادر"}
          </h3>
          <div style={{ height: 320 }}>
            <Bar data={outboundBarData} options={barOptions} />
          </div>
          {renderBreakdown(outboundTasks, outboundStatusSeries, isEnglish)}
        </WhileInViewWrapper>
  

   
        <WhileInViewWrapper once={false  }
          style={{
       minHeight:"100%",
            border: `1px solid ${theme.colors.border}`,
            background: theme.colors.backgroundText,
            padding: 24,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
                       flex:1,width:360,
          }}
        >
          <h3 style={{ textAlign: "center" }}>
            {isEnglish ? "Inbound Task Status" : "حالة مهام الوارد"}
          </h3>
          <div style={{ height: 320 }}>
            <Bar data={inboundBarData} options={barOptions} />
          </div>
          {renderBreakdown(inboundTasks, inboundStatusSeries, isEnglish)}
        </WhileInViewWrapper>
</div>
      </Col>
      <Col md={8} lg={6}  xl={4} xs={24}>
        <TaskSummaryCards isEnglish={isEnglish} />
      </Col>
    </Row>
  );
};

export default DetailedKpiChartsWithStatusBreakdown;
