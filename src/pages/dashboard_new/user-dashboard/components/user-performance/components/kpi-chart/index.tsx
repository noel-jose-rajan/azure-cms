import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
  TooltipItem,
} from "chart.js";
import { PieChartData } from "@/pages/dashboard_new/types";
import { useLanguage } from "@/context/language";
import { Card } from "antd";
import { useInView } from "framer-motion";
import { Fragment, useRef } from "react";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

type Props = {
  kpiChartData: PieChartData[];
};

function KpiChart({ kpiChartData }: Props) {
  const { isEnglish } = useLanguage();
  const labels = kpiChartData?.map((d) =>
    isEnglish ? d?.enLabel : d?.arLabel
  );
  const values = kpiChartData?.map((d) =>
    typeof d.kpi === "number" ? d.kpi : 0
  );

  const data = {
    labels,
    datasets: [
      {
        // label: false,

        data: values,
        // backgroundColor: kpiChartData?.map((d) => d?.color),
        backgroundColor: ["#0EA5E9", "#34D399", "#F4A261", "#F43F5E"],
        // borderRadius: 6,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
      },
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (ctx: TooltipItem<"bar">) =>
            ctx.raw === 0 ? "No Data" : `KPI: ${ctx.raw}`,
        },
      },
    },
  };

  return (
    <>
      <h3 style={{ textAlign: "center" }}>
        {!isEnglish ? "تقييم الأداء" : "KPI"}
      </h3>
      <Bar data={data} options={options} />
    </>
  );
}

export default function KPIBarChart({ kpiChartData }: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const inView = useInView(containerRef, { once: false, margin: "-50px" });

  return (
    <div
      style={{
        padding: 16,
        height: "80%",
        marginTop: 8,
      }}
      ref={containerRef}
    >
      {inView && <KpiChart kpiChartData={kpiChartData} />}
    </div>
  );
}
