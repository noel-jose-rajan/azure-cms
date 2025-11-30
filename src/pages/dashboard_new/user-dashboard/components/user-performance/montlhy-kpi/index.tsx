import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";
import { getMonthlyKpi, ApiEntry } from "@/pages/dashboard_new/service";
import { useLanguage } from "@/context/language";
import { useTheme } from "@/context/theme";

type Props = { height?: number | string };

export default function MonthlyKpi({ height = 320 }: Props) {
  const { isEnglish } = useLanguage();
  const { theme } = useTheme();

  const containerRef = useRef<HTMLDivElement | null>(null);
  const inView = useInView(containerRef, { once: false });

  const [totalPoints, setTotalPoints] = useState<number[] | null>(null);
  const [completePoints, setCompletePoints] = useState<number[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // const buildFromEntries = (arr?: ApiEntry[]) => {
  //   const out = new Array(12).fill(0);
  //   if (!Array.isArray(arr)) return out;
  //   for (const item of arr) {
  //     const d = new Date(item.month);
  //     if (isNaN(d.getTime())) continue;
  //     const monthIndex = d.getUTCMonth();
  //     const v = Number(item.total ?? 0);
  //     out[monthIndex] = Number.isFinite(v) ? v : 0;
  //   }
  //   return out;
  // };
  const buildFromEntries = (arr?: ApiEntry[]) => {
    const out = new Array(12).fill(0);
    if (!Array.isArray(arr)) return out;

    for (const item of arr) {
      const d = new Date(item.month);
      if (isNaN(d.getTime())) continue;

      d.setUTCDate(d.getUTCDate() + 1); // Add one day in UTC
      const monthIndex = d.getUTCMonth();
      const v = Number(item.total ?? 0);
      out[monthIndex] = Number.isFinite(v) ? v : 0;
    }

    return out;
  };

  useEffect(() => {
    let mounted = true;

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await getMonthlyKpi();
        if (!mounted) return;
        setTotalPoints(buildFromEntries(res?.total));
        setCompletePoints(buildFromEntries(res?.complete));
      } catch (e) {
        if (!mounted) return;
        setError(
          isEnglish
            ? "Failed to load monthly KPI"
            : "فشل تحميل مؤشر الأداء الشهري"
        );
      } finally {
        if (mounted) setLoading(false);
      }
    };

    if (!completePoints || !totalPoints) {
      fetchData();
    }

    return () => {
      mounted = false;
    };
  }, [inView, isEnglish]);

  return (
    <div ref={containerRef}>
      {loading && (
        <div
          style={{
            minHeight: typeof height === "number" ? `${height}px` : height,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div style={{ color: "#6b7280" }}>
            {isEnglish ? "Loading chart…" : "جاري تحميل الرسم البياني…"}
          </div>
        </div>
      )}

      {error && (
        <div
          style={{
            minHeight: typeof height === "number" ? `${height}px` : height,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div style={{ textAlign: "center", color: "#dc2626" }}>
            <div style={{ fontWeight: 600 }}>
              {isEnglish ? "Unable to load data" : "تعذر تحميل البيانات"}
            </div>
            <div style={{ marginTop: 6 }}>{error}</div>
          </div>
        </div>
      )}

      {inView && totalPoints && completePoints && (
        <MonthlyKpiChart
          totalPoints={totalPoints}
          completePoints={completePoints}
          isEnglish={isEnglish}
          height={height}
          theme={theme}
        />
      )}

      {!loading && !error && !inView && (
        <div
          style={{
            minHeight: typeof height === "number" ? `${height}px` : height,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div style={{ textAlign: "center", color: "#6b7280" }}>
            <div style={{ fontWeight: 600 }}>
              {isEnglish ? "Monthly KPI" : "مؤشر الأداء الشهري"}
            </div>
            <div style={{ marginTop: 6 }}>
              {isEnglish ? "Scroll to load chart" : "مرر لتحميل الرسم البياني"}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
// MonthlyKpiChart.tsx
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

type ChartProps = {
  totalPoints: number[];
  completePoints: number[];
  isEnglish: boolean;
  height?: number | string;
  theme: any;
};

function MonthlyKpiChart({
  totalPoints,
  completePoints,
  isEnglish,
  height = 320,
  theme,
}: ChartProps) {
  const EN_MONTHS = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const AR_MONTHS = [
    "يناير",
    "فبراير",
    "مارس",
    "أبريل",
    "مايو",
    "يونيو",
    "يوليو",
    "أغسطس",
    "سبتمبر",
    "أكتوبر",
    "نوفمبر",
    "ديسمبر",
  ];
  const monthLabels = isEnglish ? EN_MONTHS : AR_MONTHS;

  const chartData = {
    labels: monthLabels,
    datasets: [
      {
        label: isEnglish ? "Total" : "الإجمالي",
        data: totalPoints,
        fill: true,
        backgroundColor: "rgba(59,130,246,0.12)",
        borderColor: "rgba(59,130,246,1)",
        tension: 0.3,
        pointRadius: 3,
        pointHoverRadius: 6,
      },
      {
        label: isEnglish ? "Complete" : "مكتمل",
        data: completePoints,
        fill: false,
        borderColor: "rgba(16,185,129,1)",
        backgroundColor: "rgba(16,185,129,0.08)",
        tension: 0.3,
        pointRadius: 3,
        pointHoverRadius: 6,
      },
    ],
  };

  const chartOptions: any = {
    animation: { duration: 800 },
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: "top",
        labels: { boxWidth: 12, padding: 8 },
      },
      tooltip: {
        callbacks: {
          label: (context: any) =>
            `${isEnglish ? "Value" : "القيمة"}: ${
              context.formattedValue ?? context.raw
            }`,
        },
      },
      title: {
        display: true,
        text: isEnglish ? "Monthly KPI" : "مؤشر الأداء الشهري",
        align: "center",
        padding: { top: 20, bottom: 20 },
        font: {
          size: 18,
          weight: "600",
          family: "'Inter','Helvetica','Arial',sans-serif",
        },
        color: theme?.colors?.text ?? "#0f172a",
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { maxRotation: 0, autoSkip: true },
      },
      y: { beginAtZero: true, grid: { color: "rgba(15,23,42,0.06)" } },
    },
  };

  return (
    <div
      style={{
        minHeight: typeof height === "number" ? `${height}px` : height,
        background: theme.colors.backgroundText,
        border: `1px solid ${theme.colors.border}`,
        borderRadius: 0,
        paddingInline: 24,
        marginTop: 8,
      }}
    >
      <div style={{ height }}>
        <Line data={chartData} options={chartOptions} />
      </div>
    </div>
  );
}
