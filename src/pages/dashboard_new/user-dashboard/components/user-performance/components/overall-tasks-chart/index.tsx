import React, { useMemo, useRef } from "react";
import { Doughnut, Pie, PolarArea, Radar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  RadialLinearScale,
  Filler,
  LineElement,
  PointElement,
} from "chart.js";
import { useLanguage } from "@/context/language";
import { CONST_DATA } from "@/constants/app";
import { englishLabels } from "@/constants/app-constants/en";
import { arabicLabels } from "@/constants/app-constants/ar";
import { StatisticsType } from "@/pages/dashboard_new/service";
import WhileInViewWrapper from "@/animations/while-in-view-wrapper";
import { useInView } from "framer-motion";

type Props = {
  arr: StatisticsType[];
  label: string;
  type?: "Pie" | "Doughnut";
};
ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
  ArcElement
);
export function TasksPieChart({ arr, label, type = "Pie" }: Props) {
  const { isEnglish } = useLanguage();

  const ref = useRef(null);
  const isInView = useInView(ref, { once: false });

  const chartData = useMemo(() => {
    const outboundArr = arr?.filter(
      (st) => st.process_type_id == CONST_DATA.Outbound_Process_Id
    );

    const inboundArr = arr?.filter(
      (st) =>
        st.process_type_id == CONST_DATA.Route_Process_Id ||
        st.process_type_id == CONST_DATA.Inbound_Process_Id
    );
    const bearchedArr = arr?.filter((st) => st?.is_task_breach);
    return [
      {
        icon: <ArrowUpOutlined size={12} />,

        color: "#34D399",
        enLabel: englishLabels.til.outbound,
        arLabel: arabicLabels.til.outbound,
        count: outboundArr?.reduce((sum, item) => sum + item.total, 0),
      },
      {
        color: "#F4A261",
        enLabel: englishLabels.til.inbound,
        arLabel: arabicLabels.til.inbound,
        icon: <RollbackOutlined size={12} />,

        count: inboundArr?.reduce((sum, item) => sum + item.total, 0),
      },
      {
        icon: <AlertOutlined size={12} />,
        color: "#E11D48",

        enLabel: englishLabels.lbl.over_due,
        arLabel: arabicLabels.lbl.over_due,
        count: bearchedArr?.reduce((sum, item) => sum + item.total, 0),
      },
    ];
  }, [arr]);
  const checkNoData = chartData?.every((d) => d?.count == 0);
  console.log({ checkNoData });

  const data = checkNoData
    ? {
        labels: [""],
        datasets: [{ data: [2], backgroundColor: ["#00000030"] }],
      }
    : {
        labels: chartData?.map((item) => item.enLabel),
        datasets: [
          {
            label: "Tasks",
            data: chartData?.map((item) => item.count),
            backgroundColor: chartData?.map((item) => item.color),
            borderWidth: 1,
          },
        ],
      };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "right",
        labels: {
          boxWidth: 20,
          padding: 15,
          usePointStyle: true,
        },
      },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            const label = context.label || "";
            const value = context.raw || 0;
            return `${label}: ${value}`;
          },
        },
      },
    },
  };

  return (
    <div ref={ref} style={{ maxHeight: "100%" }}>
      {isInView && (
        <WhileInViewWrapper
          once={false}
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            width: "100%",
            maxHeight: "100%",
          }}
        >
          <h3>{label}</h3>
          <div style={{ height: 250 }}>
            {type == "Pie" ? (
              <Pie
                data={data}
                options={{
                  ...options,
                  plugins: { ...options.plugins, legend: { display: false } },
                }}
              />
            ) : (
              <Doughnut
                data={data}
                options={{
                  ...options,
                  plugins: { ...options.plugins, legend: { display: false } },
                }}
              />
            )}
          </div>
          <div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(2, auto)", // ➗ Two items per row
                gap: "16px 24px",
                marginTop: 20,
                direction: isEnglish ? "ltr" : "rtl",
              }}
            >
              {chartData?.map((item, index) => (
                <div
                  key={index}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                  }}
                >
                  <span style={{ fontSize: 14 }}>
                    <span
                      style={{
                        backgroundColor: item.color,
                        width: 12,
                        height: 12,
                        borderRadius: "50%",
                        flexShrink: 0,
                        padding: 3,
                        marginInline: 4,
                        color: "#e0ddddff",
                      }}
                    >
                      {item.icon}
                    </span>
                    {(isEnglish ? item.enLabel : item.arLabel) + " "}
                    <strong>({item.count})</strong>
                  </span>
                </div>
              ))}
            </div>
          </div>{" "}
        </WhileInViewWrapper>
      )}
    </div>
  );
}

export function TasksRadarChart({ arr, label }: Props) {
  const { isEnglish } = useLanguage();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false });

  const chartData = useMemo(() => {
    const outboundArr = arr?.filter(
      (st) => st.process_type_id === CONST_DATA.Outbound_Process_Id
    );
    const inboundArr = arr?.filter(
      (st) =>
        st.process_type_id === CONST_DATA.Route_Process_Id ||
        st.process_type_id === CONST_DATA.Inbound_Process_Id
    );
    const breachedArr = arr?.filter((st) => st?.is_task_breach);

    return [
      {
        color: "#34D399",
        enLabel: englishLabels.til.outbound,
        arLabel: arabicLabels.til.outbound,
        count: outboundArr?.reduce((sum, item) => sum + item.total, 0),
      },
      {
        color: "#F4A261",
        enLabel: englishLabels.til.inbound,
        arLabel: arabicLabels.til.inbound,
        count: inboundArr?.reduce((sum, item) => sum + item.total, 0),
      },
      {
        color: "#E11D48",
        enLabel: englishLabels.lbl.over_due,
        arLabel: arabicLabels.lbl.over_due,
        count: breachedArr?.reduce((sum, item) => sum + item.total, 0),
      },
    ];
  }, [arr]);

  const checkNoData = chartData.every((d) => d.count === 0);

  const data = useMemo(() => {
    return {
      labels: chartData.map((item) =>
        isEnglish ? item.enLabel : item.arLabel
      ),
      datasets: [
        {
          label: isEnglish ? "Tasks" : "المهام",
          data: chartData.map((item) => item.count || 0),
          backgroundColor: "#6366F180",
          borderColor: "#6366F1",
          pointBackgroundColor: "#6366F1",
          borderWidth: 2,
        },
      ],
    };
  }, [chartData, isEnglish]);

  const options = useMemo(() => {
    return {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        r: {
          beginAtZero: true,
          ticks: {
            stepSize: 1,
          },
        },
      },
      plugins: {
        legend: {
          display: false,
        },
        tooltip: {
          callbacks: {
            label: (context: any) => {
              const label = context.label || "";
              const value = context.raw || 0;
              return `${label}: ${value}`;
            },
          },
        },
      },
    };
  }, []);

  return (
    <div ref={ref}>
      {isInView && (
        <WhileInViewWrapper
          once={false}
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            width: "100%",
          }}
        >
          <h3>{label}</h3>
          <div style={{ height: 300 }}>
            <Radar
              key={`radar-${label}-${chartData.map((d) => d.count).join("-")}`}
              data={data}
              options={{
                ...options,
                plugins: { ...options.plugins, legend: { display: false } },
              }}
            />
          </div>
          <div style={{ marginTop: 20 }}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(2, auto)",
                gap: "16px 24px",
              }}
            >
              {chartData.map((item, index) => (
                <div
                  key={index}
                  style={{ display: "flex", alignItems: "center", gap: 10 }}
                >
                  <span
                    style={{
                      width: 12,
                      height: 12,
                      backgroundColor: item.color,
                      borderRadius: "50%",
                      flexShrink: 0,
                    }}
                  />
                  <span style={{ fontSize: 14 }}>
                    <strong>({item.count})</strong>{" "}
                    {isEnglish ? item.enLabel : item.arLabel}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </WhileInViewWrapper>
      )}
    </div>
  );
}

import {
  AlertOutlined,
  ArrowUpOutlined,
  RollbackOutlined,
  UserAddOutlined,
} from "@ant-design/icons";

export function TasksPolarAreaChart({ arr, label }: Props) {
  const { isEnglish } = useLanguage();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: "some" });

  const chartData = useMemo(() => {
    const outboundArr = arr?.filter(
      (st) => st.process_type_id === CONST_DATA.Outbound_Process_Id
    );
    const inboundArr = arr?.filter(
      (st) =>
        st.process_type_id === CONST_DATA.Route_Process_Id ||
        st.process_type_id === CONST_DATA.Inbound_Process_Id
    );
    const breachedArr = arr?.filter((st) => st?.is_task_breach);

    return [
      {
        color: "#34D399",
        enLabel: englishLabels.til.outbound,
        arLabel: arabicLabels.til.outbound,
        count: outboundArr?.reduce((sum, item) => sum + item.total, 0),
      },
      {
        color: "#F4A261",
        enLabel: englishLabels.til.inbound,
        arLabel: arabicLabels.til.inbound,
        count: inboundArr?.reduce((sum, item) => sum + item.total, 0),
      },
      {
        color: "#E11D48",
        enLabel: englishLabels.lbl.over_due,
        arLabel: arabicLabels.lbl.over_due,
        count: breachedArr?.reduce((sum, item) => sum + item.total, 0),
      },
    ];
  }, [arr]);

  const checkNoData = chartData.every((d) => d.count === 0);

  const data = useMemo(() => {
    return checkNoData
      ? {
          labels: [""],
          datasets: [
            {
              data: [1],
              backgroundColor: ["#00000030"],
            },
          ],
        }
      : {
          labels: chartData.map((item) =>
            isEnglish ? item.enLabel : item.arLabel
          ),
          datasets: [
            {
              label: isEnglish ? "Tasks" : "المهام",
              data: chartData.map((item) => item.count),
              backgroundColor: chartData.map((item) => item.color),
              borderWidth: 1,
            },
          ],
        };
  }, [chartData, isEnglish, checkNoData]);

  const options = useMemo(() => {
    return {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: "right",
          labels: {
            boxWidth: 20,
            padding: 15,
            usePointStyle: true,
          },
        },
        tooltip: {
          callbacks: {
            label: (context: any) => {
              const label = context.label || "";
              const value = context.raw || 0;
              return `${label}: ${value}`;
            },
          },
        },
      },
    };
  }, []);

  return (
    <div ref={ref} style={{ height: "100%" }}>
      {isInView && (
        <WhileInViewWrapper
          once={false}
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            width: "100%",
            height: 450,
          }}
        >
          <h3>{label}</h3>
          <div style={{ height: 250 }}>
            <PolarArea
              key={`polar-${label}-${chartData.map((d) => d.count).join("-")}`}
              data={data}
              options={{
                ...options,
                plugins: { ...options.plugins, legend: { display: false } },
              }}
            />
          </div>
          <div style={{ marginTop: 20 }}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(2, auto)",
                gap: "16px 24px",
                direction: isEnglish ? "ltr" : "rtl",
              }}
            >
              {chartData.map((item, index) => (
                <div
                  key={index}
                  style={{ display: "flex", alignItems: "center", gap: 10 }}
                >
                  <span
                    style={{
                      width: 12,
                      height: 12,
                      backgroundColor: item.color,
                      borderRadius: "50%",
                      flexShrink: 0,
                    }}
                  />
                  <span style={{ fontSize: 14 }}>
                    <strong>({item.count})</strong>{" "}
                    {isEnglish ? item.enLabel : item.arLabel}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </WhileInViewWrapper>
      )}
    </div>
  );
}
