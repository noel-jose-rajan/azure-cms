// import React from "react";
// import { Doughnut, Radar } from "react-chartjs-2";
// import {
//   Chart as ChartJS,
//   ArcElement,
//   RadialLinearScale,
//   PointElement,
//   LineElement,
//   Tooltip,
//   Legend,
// } from "chart.js";

// ChartJS.register(
//   ArcElement,
//   RadialLinearScale,
//   PointElement,
//   LineElement,
//   Tooltip,
//   Legend
// );

// interface Props {
//   isEnglish: boolean;
// }

// // Labels for each chart
// const outboundLabels = {
//   en: [
//     "Approve Outbound",
//     "Review Outbound",
//     "Send Outbound",
//     "Rejected Outbound",
//   ],
//   ar: ["اعتماد الصادر", "مراجعة الصادر", "إرسال الصادر", "رفض الصادر"],
// };

// const inboundLabels = {
//   en: [
//     "New Inbound",
//     "Rejected Inbound",
//     "Reply Routing",
//     "View Routing",
//     "Rejected Routing",
//   ],
//   ar: ["وارد جديد", "رفض الوارد", "رد التوجيه", "عرض التوجيه", "رفض التوجيه"],
// };

// // KPI values (e.g. performance scores out of 100)
// const outboundKpis = [85, 92, 78, 60];
// const inboundKpis = [88, 55, 70, 80, 45];

// const KpiCharts: React.FC<Props> = ({ isEnglish }) => {
//   const outboundChart = {
//     labels: outboundLabels[isEnglish ? "en" : "ar"],
//     datasets: [
//       {
//         label: isEnglish ? "Outbound KPIs" : "مؤشرات الصادر",
//         data: outboundKpis,
//         backgroundColor: ["#1890ff", "#13c2c2", "#2fc25b", "#f04864"],
//         borderWidth: 1,
//       },
//     ],
//   };

//   const inboundChart = {
//     labels: inboundLabels[isEnglish ? "en" : "ar"],
//     datasets: [
//       {
//         label: isEnglish ? "Inbound KPIs" : "مؤشرات الوارد",
//         data: inboundKpis,
//         backgroundColor: "rgba(24, 144, 255, 0.2)",
//         borderColor: "#1890ff",
//         pointBackgroundColor: "#1890ff",
//         fill: true,
//       },
//     ],
//   };

//   const doughnutOptions = {
//     responsive: true,
//     plugins: {
//       legend: {
//         position: "bottom" as const,
//         labels: {
//           font: { size: 14 },
//         },
//       },
//     },
//   };

//   const radarOptions = {
//     responsive: true,
//     scales: {
//       r: {
//         beginAtZero: true,
//         max: 100,
//         ticks: {
//           stepSize: 20,
//         },
//         pointLabels: {
//           font: {
//             size: 14,
//           },
//         },
//       },
//     },
//     plugins: {
//       legend: {
//         position: "bottom" as const,
//         labels: {
//           font: { size: 14 },
//         },
//       },
//     },
//   };

//   return (
//     <div
//       style={{
//         display: "flex",
//         gap: "40px",
//         flexWrap: "wrap",
//         justifyContent: "center",
//         direction: isEnglish ? "ltr" : "rtl",
//       }}
//     >
//       <div style={{ width: "300px" }}>
//         <h3 style={{ textAlign: "center" }}>
//           {isEnglish ? "Outbound KPIs" : "مؤشرات الصادر"}
//         </h3>
//         <Doughnut data={outboundChart} options={doughnutOptions} />
//       </div>
//       <div style={{ width: "400px" }}>
//         <h3 style={{ textAlign: "center" }}>
//           {isEnglish ? "Inbound KPIs" : "مؤشرات الوارد"}
//         </h3>
//         <Radar data={inboundChart} options={radarOptions} />
//       </div>
//     </div>
//   );
// };

// export default KpiCharts;

// import React from "react";
// import { Doughnut, Radar } from "react-chartjs-2";
// import {
//   Chart as ChartJS,
//   ArcElement,
//   RadialLinearScale,
//   PointElement,
//   LineElement,
//   Tooltip,
//   Legend,
// } from "chart.js";
// import { useTheme } from "@/context/theme";
// import { Col } from "antd";

// ChartJS.register(
//   ArcElement,
//   RadialLinearScale,
//   PointElement,
//   LineElement,
//   Tooltip,
//   Legend
// );

// interface Props {
//   isEnglish: boolean;
// }

// const outboundChartData = [
//   {
//     enLabel: "Approve Outbound",
//     arLabel: "اعتماد الصادر",
//     count: 85,
//     color: "#1890ff",
//     icon: "✔️",
//   },
//   {
//     enLabel: "Review Outbound",
//     arLabel: "مراجعة الصادر",
//     count: 92,
//     color: "#13c2c2",
//     icon: "🔍",
//   },
//   {
//     enLabel: "Send Outbound",
//     arLabel: "إرسال الصادر",
//     count: 78,
//     color: "#2fc25b",
//     icon: "📤",
//   },
//   {
//     enLabel: "Rejected Outbound",
//     arLabel: "رفض الصادر",
//     count: 60,
//     color: "#f04864",
//     icon: "❌",
//   },
// ];

// const inboundChartData = [
//   {
//     enLabel: "New Inbound",
//     arLabel: "وارد جديد",
//     count: 88,
//     color: "#9254de",
//     icon: "📥",
//   },
//   {
//     enLabel: "Rejected Inbound",
//     arLabel: "رفض الوارد",
//     count: 55,
//     color: "#f6c022",
//     icon: "🚫",
//   },
//   {
//     enLabel: "Reply Routing",
//     arLabel: "رد التوجيه",
//     count: 70,
//     color: "#fa8c16",
//     icon: "🔁",
//   },
//   {
//     enLabel: "View Routing",
//     arLabel: "عرض التوجيه",
//     count: 80,
//     color: "#a0d911",
//     icon: "👁️",
//   },
//   {
//     enLabel: "Rejected Routing",
//     arLabel: "رفض التوجيه",
//     count: 45,
//     color: "#ff4d4f",
//     icon: "⛔",
//   },
// ];

// const KpiChartsWithCustomLegend: React.FC<Props> = ({ isEnglish }) => {
//   const { theme } = useTheme();
//   const outboundChart = {
//     labels: outboundChartData.map((item) =>
//       isEnglish ? item.enLabel : item.arLabel
//     ),
//     datasets: [
//       {
//         label: isEnglish ? "Outbound KPIs" : "مؤشرات الصادر",
//         data: outboundChartData.map((item) => item.count),
//         backgroundColor: outboundChartData.map((item) => item.color),
//         borderWidth: 1,
//       },
//     ],
//   };

//   const inboundChart = {
//     labels: inboundChartData.map((item) =>
//       isEnglish ? item.enLabel : item.arLabel
//     ),
//     datasets: [
//       {
//         label: isEnglish ? "Inbound KPIs" : "مؤشرات الوارد",
//         data: inboundChartData.map((item) => item.count),
//         backgroundColor: "rgba(24, 144, 255, 0.2)",
//         borderColor: "#1890ff",
//         pointBackgroundColor: "#1890ff",
//         fill: true,
//       },
//     ],
//   };

//   const doughnutOptions = {
//     responsive: true,
//     plugins: { legend: { display: false } },
//   };

//   const radarOptions = {
//     responsive: true,
//     scales: {
//       r: {
//         beginAtZero: true,
//         max: 100,
//         ticks: { stepSize: 20 },
//         pointLabels: {
//           font: { size: 14 },
//         },
//       },
//     },
//     plugins: { legend: { display: false } },
//   };

//   const renderLegend = (
//     chartData: typeof outboundChartData,
//     isEnglish: boolean
//   ) => {
//     return (
//       <div
//         style={{
//           display: "grid",
//           gridTemplateColumns: "repeat(2, auto)",
//           gap: 6,
//           direction: isEnglish ? "ltr" : "rtl",
//           textWrap: "nowrap",
//           alignContent: "space-between",
//           paddingBlock: 8,
//         }}
//       >
//         {chartData.map((item, index) => (
//           <div key={index}>
//             <div
//               style={{
//                 fontSize: 12,
//                 display: "flex",
//                 alignItems: "flex-start",
//                 gap: 4,
//               }}
//             >
//               <span>{item.icon}</span>
//               <span>{(isEnglish ? item.enLabel : item.arLabel) + "  "}</span>
//               <strong>({item.count})</strong>
//             </div>
//           </div>
//         ))}
//       </div>
//     );
//   };

//   return (
//     <>
//       <Col
//         md={8}
//         xs={24}
//         style={{
//           paddingInline: 8,
//         }}
//       >
//         <div
//           style={{
//             flex: 1,
//             height: 500,
//             marginBottom: 8,
//             border: `1px solid ${theme.colors.border}`,
//             background: theme.colors.backgroundText,
//             borderRadius: 0,
//             overflow: "hidden",
//             paddingInline: 24,
//             paddingBlock: 8,
//             display: "flex",
//             flexDirection: "column",
//             alignItems: "center",
//             justifyContent: "space-between",
//           }}
//         >
//           <h3 style={{ textAlign: "center" }}>
//             {isEnglish ? "Outbound KPIs" : "مؤشرات الصادر"}
//           </h3>
//           <div
//             style={{
//               height: 250,
//             }}
//           >
//             <Doughnut data={outboundChart} options={doughnutOptions} />
//           </div>
//           <div style={{ marginTop: 16 }}>
//             {renderLegend(outboundChartData, isEnglish)}
//           </div>
//         </div>
//       </Col>
//       <Col md={8} xs={24}>
//         <div
//           style={{
//             height: 500,
//             marginBottom: 8,
//             border: `1px solid ${theme.colors.border}`,
//             background: theme.colors.backgroundText,
//             borderRadius: 0,
//             overflow: "hidden",

//             display: "flex",
//             flexDirection: "column",
//             alignItems: "center",
//             justifyContent: "space-between",
//           }}
//         >
//           <h3 style={{ textAlign: "center" }}>
//             {isEnglish ? "Inbound KPIs" : "مؤشرات الوارد"}
//           </h3>
//           <div style={{ height: 350 }}>
//             <Radar data={inboundChart} options={radarOptions} />
//           </div>
//           <div>{renderLegend(inboundChartData, isEnglish)}</div>
//         </div>
//       </Col>
//     </>
//   );
// };

// export default KpiChartsWithCustomLegend;

import React from "react";
import { Doughnut, Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { useTheme } from "@/context/theme";
import { Col } from "antd";
import WhileInViewWrapper from "@/animations/while-in-view-wrapper";
import FadeInWrapperAnimation from "@/animations/fade-in-wrapper-animation";

ChartJS.register(ArcElement, Tooltip, Legend);

interface Props {
  isEnglish: boolean;
}

const outboundChartData = [
  {
    enLabel: "Approve Outbound",
    arLabel: "اعتماد الصادر",
    count: 85,
    color: "#1890ff",
    icon: "✔️",
  },
  {
    enLabel: "Review Outbound",
    arLabel: "مراجعة الصادر",
    count: 92,
    color: "#13c2c2",
    icon: "🔍",
  },
  {
    enLabel: "Send Outbound",
    arLabel: "إرسال الصادر",
    count: 78,
    color: "#2fc25b",
    icon: "📤",
  },
  {
    enLabel: "Rejected Outbound",
    arLabel: "رفض الصادر",
    count: 60,
    color: "#f04864",
    icon: "❌",
  },
];
const inboundChartData = [
  {
    enLabel: "New Inbound",
    arLabel: "وارد جديد",
    count: 88,
    color: "#1890ff",

    icon: "📥",
  },
  {
    enLabel: "Rejected Inbound",
    arLabel: "رفض الوارد",
    count: 55,
    color: "#00A6A3", // teal
    icon: "🚫",
  },
  {
    enLabel: "Reply Routing",
    arLabel: "رد التوجيه",
    count: 70,
    color: "#FF7A29", // warm orange
    icon: "🔁",
  },
  {
    enLabel: "View Routing",
    arLabel: "عرض التوجيه",
    count: 20,
    color: "#31C48D", // bright green (replaced purple)
    icon: "👁️",
  },
  {
    enLabel: "Rejected Routing",
    arLabel: "رفض التوجيه",
    count: 10,
    color: "#E53935", // vivid red
    icon: "⛔",
  },
];

const KpiChartsWithCustomLegend: React.FC<Props> = ({ isEnglish }) => {
  const { theme } = useTheme();

  const outboundChart = {
    labels: outboundChartData.map((it) =>
      isEnglish ? it.enLabel : it.arLabel
    ),
    datasets: [
      {
        label: isEnglish ? "Outbound KPIs" : "مؤشرات الصادر",
        data: outboundChartData.map((it) => it.count),
        backgroundColor: outboundChartData.map((it) => it.color),
        borderWidth: 0,
      },
    ],
  };

  const inboundChart = {
    labels: inboundChartData.map((it) => (isEnglish ? it.enLabel : it.arLabel)),
    datasets: [
      {
        label: isEnglish ? "Inbound KPIs" : "مؤشرات الوارد",
        data: inboundChartData.map((it) => it.count),
        backgroundColor: inboundChartData.map((it) => it.color),
        borderWidth: 0,
      },
    ],
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false as const,
    plugins: {
      legend: {
        display: false,
        labels: {
          boxWidth: 0,
          padding: 0,
        },
      },
      tooltip: {
        callbacks: { label: (ctx: any) => `${ctx.label}: ${ctx.raw}` },
      },
    },
  };

  const renderLegend = (
    chartData: typeof outboundChartData,
    isEnglish: boolean
  ) => (
    <WhileInViewWrapper
      once={false}
      className="chart-card"
      style={{
        display: "flex",
        flexWrap: "wrap",
        flexDirection: "row",
        // gridTemplateColumns: "repeat(2, auto)",
        gap: 4,
        direction: isEnglish ? "ltr" : "rtl",
        alignContent: "start",
        padding: 8,
        height: "fit-content",
      }}
    >
      {chartData.map((item, index) => (
        <div
          key={index}
          style={{
            background: theme?.colors?.backgroundText,
            width: "160px",
            display: "flex",
            flex: 1,
            gap: 8,
            alignItems: "center",
            minWidth: 160,
            padding: "6px 8px",
            borderRadius: 8,
            boxShadow: "0 4px 10px rgba(16,24,40,0.04)",
          }}
        >
          <div
            aria-hidden
            style={{
              width: 12,
              height: 12,
              borderRadius: 4,
              background: item.color,
              flexShrink: 0,
            }}
          />
          <div style={{ minWidth: 0 }}>
            <div
              style={{
                fontSize: 13,
                fontWeight: 700,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                textAlign: isEnglish ? "left" : "right",
              }}
            >
              {isEnglish ? item.enLabel : item.arLabel}
            </div>
            <div style={{ fontSize: 12, color: "rgba(0,0,0,0.55)" }}>
              <span style={{ marginInlineEnd: 6 }}>{item.icon}</span>
              <strong style={{ fontWeight: 700 }}>{item.count}</strong>
            </div>
          </div>
        </div>
      ))}
    </WhileInViewWrapper>
  );

  return (
    <>
      <Col xl={8} md={13} xs={24} sm={24}>
        <div
          style={{
            minHeight: "100%",
            border: `1px solid ${theme.colors.border}`,
            background: theme.colors.backgroundText,
            overflow: "hidden",
            paddingBlock: 12,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 16,
            containerType: "inline-size",
            containerName: "chart-container",
            // paddingLeft: isEnglish ? 8 : 0,
            // paddingRight: isEnglish ? 0 : 8,
          }}
        >
          <h3 style={{ textAlign: "center" }}>
            {isEnglish ? "Outbound KPIs" : "مؤشرات الصادر"}
          </h3>
          <div
            style={{
              flexDirection: "row",
              flexWrap: "wrap",
              display: "flex",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                height: 260,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Doughnut data={outboundChart} options={doughnutOptions} />
            </div>

            {renderLegend(outboundChartData, isEnglish)}
          </div>
        </div>
      </Col>

      <Col xl={8} md={24} xs={24} sm={24}>
        <div
          style={{
            minHeight: "100%",
            border: `1px solid ${theme.colors.border}`,
            background: theme.colors.backgroundText,
            overflow: "hidden",
            paddingBlock: 12,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 16,
            containerType: "inline-size",
            containerName: "chart-container",
            // paddingLeft: isEnglish ? 8 : 0,
            // paddingRight: isEnglish ? 0 : 8,
          }}
        >
          <h3 style={{ textAlign: "center" }}>
            {isEnglish ? "Inbound KPIs" : "مؤشرات الوارد"}
          </h3>
          <div
            style={{
              flexDirection: "row",
              flexWrap: "wrap",
              display: "flex",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                height: 260,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Doughnut data={inboundChart} options={doughnutOptions} />
            </div>

            {renderLegend(inboundChartData, isEnglish)}
          </div>
        </div>
      </Col>
    </>
  );
};

export default KpiChartsWithCustomLegend;
