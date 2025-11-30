import React from "react";
import { Card, Row } from "antd";
import { useTheme } from "@/context/theme";
import WhileInViewWrapper from "@/animations/while-in-view-wrapper";

interface Props {
  isEnglish: boolean;
}

const taskSummary = {
  outbound: 26,
  inbound: 19,
  routing: 12,
};
const hexToRgb = (hex = "#4f46e5") => {
  const s = hex.replace("#", "");
  const full =
    s.length === 3
      ? s
          .split("")
          .map((ch) => ch + ch)
          .join("")
      : s;
  const num = parseInt(full, 16);
  return { r: (num >> 16) & 255, g: (num >> 8) & 255, b: num & 255 };
};
const rgba = (hex: string, a = 1) => {
  const { r, g, b } = hexToRgb(hex);
  return `rgba(${r},${g},${b},${a})`;
};
const getGradient = (color: string) => {
  return `linear-gradient(135deg, ${rgba(color, 0.1)} 0%, ${rgba(
    color,
    0.05
  )} 100%)`;
};
const TaskSummaryCards: React.FC<Props> = ({ isEnglish }) => {
  const { theme } = useTheme();

  const cards = [
    {
      key: "outbound",
      icon: "📤",
      enLabel: "Outbound Created",
      arLabel: "الصادر الذي أنشأته",
      count: taskSummary.outbound,
      color: "#1890ff",
    },
    {
      key: "inbound",
      icon: "📥",
      enLabel: "Inbound Created",
      arLabel: "الوارد الذي أنشأته",
      count: taskSummary.inbound,
      color: "#24523dff",
    },
    {
      key: "inbound",
      icon: "📥",
      enLabel: "Routes Received",
      arLabel: " التوجيهات التي استلمتها",
      count: taskSummary.inbound,
      color: "#13c2c2",
    },
    {
      key: "routing",
      icon: "🔁",
      enLabel: " Routes Sent",
      arLabel: " التوجيهات التي ارسلتها",
      count: taskSummary.routing,
      color: "#fa8c16",
    },
  ];

  return (
    <WhileInViewWrapper
      once={false}
      style={{
        direction: isEnglish ? "ltr" : "rtl",
        display: "flex",
        flexDirection: "row",
        flexWrap: "wrap",
        minWidth: "100%",
        gap: 8,
        justifyContent: "center",
        position: "sticky",
        top: 10,
      }}
    >
      {cards.map((card) => (
        <Card
          key={card.key}
          bordered={false}
          style={{
            background: getGradient(card.color),
            border: `1px solid ${theme.colors.border}`,
            borderRadius: 0,
            textAlign: "center",
            height: 150,
            flexBasis: 220,
            flex: 1,
            minWidth: 180,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div style={{ fontSize: 20 }}>{card.icon}</div>
          <div style={{ fontSize: 16, fontWeight: "bold" }}>
            {isEnglish ? card.enLabel : card.arLabel}
          </div>
          <div
            style={{
              fontSize: 28,
              fontWeight: "bold",
              color: card.color,
              marginTop: 4,
            }}
          >
            {card.count}
          </div>
        </Card>
      ))}
    </WhileInViewWrapper>
  );
};

export default TaskSummaryCards;
