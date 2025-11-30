// import { useLanguage } from "@/context/language";
// import { Dropdown, Card, Typography } from "antd";
// import React from "react";
// import { type Dropdown as DropdpwnType } from "../../../types";
// import { CaretDownFilled } from "@ant-design/icons";
// import { CounterAnimation } from "@/animations/counter";

// type Props = {
//   count: number;
//   label: string;
//   dropdown?: DropdpwnType[];
//   color?: string;
//   isPercent?: boolean;
//   Icon: React.ReactNode;
// };
// const CardCount = ({
//   count,
//   label,
//   dropdown,
//   color,
//   Icon,
//   isPercent = false,
// }: Props) => {
//   const { isEnglish } = useLanguage();
//   const menu = dropdown?.map((d, idx) => ({
//     label: (isEnglish ? d?.enLabel : d?.arLabel) || "",
//     key: idx?.toString(),
//     // onClick: () => d?.onClick(),
//   }));

//   return (
//     <Card
//       bodyStyle={{
//         display: "flex",
//         flexDirection: "column",
//         alignItems: "center",
//         justifyContent: "center",
//         height: 120,
//         position: "relative",
//         padding: 0,
//         paddingTop: 30,
//         gap: 10,
//       }}
//       style={{
//         textAlign: "center",
//         borderBottom: `2px solid ${color}`,
//         borderRadius: 2,
//       }}
//     >
//       {dropdown && dropdown?.length > 0 && (
//         <div
//           style={{
//             position: "absolute",
//             top: 4,
//             [!isEnglish ? "right" : "left"]: 12,
//             width: 8,
//             height: 8,
//             borderRadius: "50%",
//           }}
//         >
//           <Dropdown menu={{ items: menu }} trigger={["click"]}>
//             <CaretDownFilled
//               style={{
//                 fontSize: 16,
//               }}
//             />
//           </Dropdown>
//         </div>
//       )}

//       <div
//         style={{
//           fontSize: 36,
//           fontWeight: 600,
//           gap: 5,
//           display: "flex",
//           alignItems: "center",
//         }}
//       >
//         <CounterAnimation to={count} /> {isPercent ? " %" : ""}
//       </div>

//       <div
//         style={{
//           display: "flex",
//           justifyContent: "space-between",
//           // flexDirection: isEnglish ? "row" : "row-reverse",
//           width: "100%",
//           paddingInline: 8,
//         }}
//       >
//         <Typography
//           style={{
//             fontSize: 16,
//             fontWeight: "bold",
//             textTransform: "lowercase",
//             opacity: 0.7,
//           }}
//         >
//           {label}
//         </Typography>
//         <Typography style={{ color: color, fontSize: 16 }}>{Icon}</Typography>
//       </div>
//     </Card>
//   );
// };

// export default CardCount;

// import React, { useMemo } from "react";
// import { Card, Dropdown, Tooltip, Typography, Progress } from "antd";
// import { CaretDownFilled } from "@ant-design/icons";
// import { useLanguage } from "@/context/language";
// import { CounterAnimation } from "@/animations/counter";
// import type { Dropdown as DropdownType } from "../../../types";

// type Trend = { value: string; direction: "up" | "down" };
// type Variant = "minimal" | "trend" | "spark" | "ring" | "progress";

// type Props = {
//   count: number;
//   label: string;
//   dropdown?: DropdownType[];
//   color?: string;
//   isPercent?: boolean;
//   Icon?: React.ReactNode;
//   trend?: Trend;
//   history?: number[]; // optional for spark
//   variant?: Variant;
//   size?: "sm" | "md" | "lg";
//   className?: string;
//   ariaLabel?: string;
// };

// const hexToRgb = (hex = "#4f46e5") => {
//   const s = hex.replace("#", "");
//   const full =
//     s.length === 3
//       ? s
//           .split("")
//           .map((ch) => ch + ch)
//           .join("")
//       : s;
//   const num = parseInt(full, 16);
//   return { r: (num >> 16) & 255, g: (num >> 8) & 255, b: num & 255 };
// };
// const rgba = (hex: string, a = 1) => {
//   const { r, g, b } = hexToRgb(hex);
//   return `rgba(${r},${g},${b},${a})`;
// };

// const sparklinePath = (values: number[], w = 88, h = 28) => {
//   if (!values || values.length === 0) return "";
//   const min = Math.min(...values);
//   const max = Math.max(...values);
//   const range = max - min || 1;
//   const step = w / Math.max(1, values.length - 1);
//   return values
//     .map((v, i) => {
//       const x = Math.round(i * step);
//       const y = Math.round(h - ((v - min) / range) * h);
//       return `${i === 0 ? "M" : "L"} ${x} ${y}`;
//     })
//     .join(" ");
// };

// const CardCount = ({
//   count,
//   label,
//   dropdown,
//   color = "#4f46e5",
//   Icon,
//   isPercent = false,
//   trend,
//   history = [],
//   variant = "minimal",
//   size = "md",
//   className,
//   ariaLabel,
// }: Props) => {
//   const { isEnglish } = useLanguage();

//   const menuItems = dropdown?.map((d, idx) => ({
//     label: (isEnglish ? d?.enLabel : d?.arLabel) || "",
//     key: idx.toString(),
//     onClick: d?.onClick,
//   }));

//   const sizes = {
//     sm: { cardH: 96, icon: 18, title: 18 },
//     md: { cardH: 120, icon: 20, title: 24 },
//     lg: { cardH: 160, icon: 24, title: 36 },
//   } as const;
//   const s = sizes[size];

//   const hasHistory = Array.isArray(history) && history.length > 0;
//   const sparkD = useMemo(
//     () => (hasHistory ? sparklinePath(history, 88, 28) : ""),
//     [history, hasHistory]
//   );

//   const trendIsUp = trend?.direction === "up";
//   const chipBg = trendIsUp ? rgba("#16a34a", 0.12) : rgba("#ef4444", 0.08);
//   const chipColor = trendIsUp ? "#16a34a" : "#ef4444";

//   // percent display fallback for ring/progress (value 0-100)
//   const percentForProgress = Math.max(0, Math.min(100, Math.round(count)));

//   return (
//     <Card
//       hoverable
//       role="group"
//       aria-label={ariaLabel ?? label}
//       className={className}
//       bodyStyle={{
//         padding: 12,
//         display: "flex",
//         flexDirection: "column",
//         gap: 10,
//         alignItems: "stretch",
//         justifyContent: "center",
//         height: s.cardH,
//       }}
//       style={{
//         borderRadius: 12,
//         boxShadow: "0 6px 18px rgba(15,23,42,0.06)",
//         position: "relative",
//         overflow: "hidden",
//       }}
//     >
//       {/* top row: icon/label/dropdown */}
//       <div
//         style={{
//           display: "flex",
//           justifyContent: "space-between",
//           alignItems: "center",
//           gap: 8,
//         }}
//       >
//         <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
//           {Icon && (
//             <div
//               style={{
//                 width: 40,
//                 height: 40,
//                 borderRadius: 10,
//                 background: rgba(color, 0.1),
//                 color,
//                 display: "flex",
//                 alignItems: "center",
//                 justifyContent: "center",
//                 fontSize: s.icon,
//               }}
//               aria-hidden
//             >
//               {Icon}
//             </div>
//           )}

//           <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
//             <Typography.Text
//               style={{ fontSize: 12, color: "rgba(15,23,42,0.7)" }}
//             >
//               {label}
//             </Typography.Text>
//             {/* only show small subtitle for some variants */}
//             {(variant === "trend" ||
//               variant === "spark" ||
//               variant === "progress") && (
//               <Typography.Text
//                 style={{ fontSize: 11, color: "rgba(15,23,42,0.45)" }}
//               >
//                 {isEnglish ? "Overview" : "نظرة عامة"}
//               </Typography.Text>
//             )}
//           </div>
//         </div>

//         {/* dropdown */}
//         {dropdown?.length ? (
//           <Dropdown menu={{ items: menuItems ?? [] }} trigger={["click"]}>
//             <Tooltip title={isEnglish ? "Actions" : "إجراءات"}>
//               <CaretDownFilled
//                 style={{
//                   fontSize: 16,
//                   color: "rgba(15,23,42,0.6)",
//                   cursor: "pointer",
//                 }}
//               />
//             </Tooltip>
//           </Dropdown>
//         ) : null}
//       </div>

//       {/* main content area: switch by variant */}
//       <div
//         style={{
//           display: "flex",
//           alignItems: "center",
//           justifyContent: "space-between",
//           gap: 12,
//         }}
//       >
//         {/* left / center area */}
//         <div
//           style={{ display: "flex", alignItems: "center", gap: 12, flex: 1 }}
//         >
//           {/* numeric */}
//           <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
//             <div
//               style={{
//                 fontSize: s.title,
//                 fontWeight: 800,
//                 lineHeight: 1,
//                 color: "rgba(15,23,42,0.95)",
//               }}
//             >
//               <CounterAnimation to={count} />
//               {isPercent ? " %" : ""}
//             </div>

//             {variant === "minimal" && (
//               <Typography.Text
//                 style={{ fontSize: 12, color: "rgba(15,23,42,0.6)" }}
//               >
//                 {isEnglish ? "Current value" : "القيمة الحالية"}
//               </Typography.Text>
//             )}

//             {variant === "trend" && trend && (
//               <div
//                 style={{
//                   marginTop: 2,
//                   display: "inline-flex",
//                   alignItems: "center",
//                   gap: 8,
//                 }}
//               >
//                 <div
//                   style={{
//                     background: chipBg,
//                     color: chipColor,
//                     padding: "6px 8px",
//                     borderRadius: 999,
//                     fontSize: 12,
//                     fontWeight: 700,
//                     display: "inline-flex",
//                     alignItems: "center",
//                     gap: 6,
//                   }}
//                 >
//                   <span
//                     style={{ transform: `rotate(${trendIsUp ? 0 : 180}deg)` }}
//                   >
//                     ▲
//                   </span>
//                   <span>{trend.value}</span>
//                 </div>
//               </div>
//             )}

//             {variant === "spark" && (
//               <div style={{ marginTop: 6 }}>
//                 {hasHistory ? (
//                   <svg
//                     width="96"
//                     height="32"
//                     viewBox="0 0 96 32"
//                     preserveAspectRatio="none"
//                     aria-hidden
//                   >
//                     <path
//                       d={sparkD}
//                       fill="none"
//                       stroke={rgba(color, 0.95)}
//                       strokeWidth="2.2"
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                     />
//                   </svg>
//                 ) : (
//                   <Typography.Text
//                     style={{ fontSize: 12, color: "rgba(15,23,42,0.45)" }}
//                   >
//                     {isEnglish
//                       ? "No detailed history"
//                       : "لا توجد بيانات تاريخية"}
//                   </Typography.Text>
//                 )}
//               </div>
//             )}
//           </div>
//         </div>

//         {/* right area: visual accent by variant */}
//         <div
//           style={{
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "center",
//             width: variant === "ring" ? 64 : variant === "progress" ? 120 : 48,
//           }}
//         >
//           {variant === "ring" && (
//             <svg width="64" height="64" viewBox="0 0 36 36" aria-hidden>
//               <defs>
//                 <linearGradient id="g1" x1="0" x2="1">
//                   <stop offset="0" stopColor={rgba(color, 1)} />
//                   <stop offset="1" stopColor={rgba(color, 0.6)} />
//                 </linearGradient>
//               </defs>
//               <circle
//                 cx="18"
//                 cy="18"
//                 r="15.9155"
//                 fill="none"
//                 stroke="rgba(15,23,42,0.06)"
//                 strokeWidth="3.5"
//               />
//               <circle
//                 cx="18"
//                 cy="18"
//                 r="15.9155"
//                 fill="none"
//                 stroke="url(#g1)"
//                 strokeWidth="3.5"
//                 strokeLinecap="round"
//                 strokeDasharray={`${percentForProgress} ${
//                   100 - percentForProgress
//                 }`}
//                 transform="rotate(-90 18 18)"
//               />
//               <text
//                 x="18"
//                 y="20.6"
//                 textAnchor="middle"
//                 fontSize="6.5"
//                 fill="rgba(15,23,42,0.9)"
//                 fontWeight={700}
//               >
//                 {percentForProgress}%
//               </text>
//             </svg>
//           )}

//           {variant === "progress" && (
//             <div style={{ width: 120 }}>
//               <Progress
//                 percent={percentForProgress}
//                 showInfo={false}
//                 strokeColor={rgba(color, 1)}
//                 strokeLinecap="round"
//               />
//               <div
//                 style={{
//                   display: "flex",
//                   justifyContent: "space-between",
//                   marginTop: 6,
//                 }}
//               >
//                 <Typography.Text
//                   style={{ fontSize: 11, color: "rgba(15,23,42,0.45)" }}
//                 >
//                   {isEnglish ? "0" : "٠"}
//                 </Typography.Text>
//                 <Typography.Text
//                   style={{ fontSize: 11, color: "rgba(15,23,42,0.45)" }}
//                 >
//                   {isEnglish ? "Max" : "الحد الأقصى"}
//                 </Typography.Text>
//               </div>
//             </div>
//           )}

//           {/* small icon placeholder for minimal/trend/spark when Icon omitted */}
//           {(variant === "minimal" ||
//             variant === "trend" ||
//             variant === "spark") &&
//             !Icon && (
//               <div
//                 style={{
//                   width: 40,
//                   height: 40,
//                   borderRadius: 8,
//                   background: rgba(color, 0.06),
//                 }}
//               />
//             )}
//         </div>
//       </div>
//     </Card>
//   );
// };

// export default CardCount;

// import React, { useMemo } from "react";
// import { Card, Dropdown, Tooltip, Typography, Button, Progress } from "antd";
// import { CaretDownFilled, SettingOutlined } from "@ant-design/icons";
// import { useLanguage } from "@/context/language";
// import { CounterAnimation } from "@/animations/counter";
// import type { Dropdown as DropdownType } from "../../../types";

// type Trend = { value: string; direction: "up" | "down" };
// type EmptyMode = "icon" | "progress" | "cta";
// type Props = {
//   count: number;
//   label: string;
//   dropdown?: DropdownType[];
//   color?: string;
//   isPercent?: boolean;
//   Icon?: React.ReactNode;
//   trend?: Trend;
//   history?: number[]; // optional
//   variant?: "compact" | "detail";
//   size?: "sm" | "md";
//   emptyMode?: EmptyMode; // chosen fallback when no history
//   onConfigure?: () => void; // used by cta
//   ariaLabel?: string;
//   percent?: number; // for progress display when no history
//   showPercent?: boolean; // show % when no history
// };

// const hexToRgb = (hex = "#4f46e5") => {
//   const s = hex.replace("#", "");
//   const full =
//     s.length === 3
//       ? s
//           .split("")
//           .map((ch) => ch + ch)
//           .join("")
//       : s;
//   const num = parseInt(full, 16);
//   return { r: (num >> 16) & 255, g: (num >> 8) & 255, b: num & 255 };
// };
// const rgba = (hex: string, a = 1) => {
//   const { r, g, b } = hexToRgb(hex);
//   return `rgba(${r},${g},${b},${a})`;
// };

// const sparklinePath = (values: number[], w = 88, h = 28) => {
//   if (!values || values.length === 0) return "";
//   const min = Math.min(...values);
//   const max = Math.max(...values);
//   const range = max - min || 1;
//   const step = w / Math.max(1, values.length - 1);
//   return values
//     .map((v, i) => {
//       const x = Math.round(i * step);
//       const y = Math.round(h - ((v - min) / range) * h);
//       return `${i === 0 ? "M" : "L"} ${x} ${y}`;
//     })
//     .join(" ");
// };

// const CardCount = ({
//   count,
//   label,
//   dropdown,
//   color = "#2563eb",
//   Icon,
//   isPercent = false,
//   trend,
//   history = [],
//   variant = "compact",
//   size = "md",
//   ariaLabel,
//   percent = 0,
//   showPercent = false,
// }: Props) => {
//   const { isEnglish } = useLanguage();
//   const menuItems = dropdown?.map((d, idx) => ({
//     label: (isEnglish ? d?.enLabel : d?.arLabel) || "",
//     key: idx.toString(),
//     onClick: d?.onClick,
//   }));

//   const sizes = {
//     sm: { h: 128, title: 20, icon: 18 },
//     md: { h: 132, title: 28, icon: 20 },
//   } as const;
//   const s = sizes[size];

//   const trendIsUp = trend?.direction === "up";
//   const chipBg = trendIsUp ? rgba("#16a34a", 0.12) : rgba("#ef4444", 0.08);
//   const chipColor = trendIsUp ? "#16a34a" : "#ef4444";

//   return (
//     <Card
//       hoverable
//       role="group"
//       aria-label={ariaLabel ?? label}
//       bodyStyle={{
//         padding: 12,
//         display: "flex",
//         flexDirection: "column",
//         gap: 8,
//         height: s.h,
//       }}
//       style={{
//         borderRadius: 12,
//         boxShadow: "0 6px 18px rgba(15,23,42,0.06)",
//         overflow: "hidden",
//         minWidth: 0,
//         display: "flex",
//         flexDirection: "column",
//       }}
//     >
//       <div
//         style={{
//           display: "flex",
//           justifyContent: "space-between",
//           alignItems: "center",
//           gap: 8,
//         }}
//       >
//         <div
//           style={{
//             display: "flex",
//             alignItems: "center",
//             gap: 10,
//             minWidth: 0,
//           }}
//         >
//           {Icon ? (
//             <div
//               style={{
//                 width: 44,
//                 height: 44,
//                 borderRadius: 10,
//                 background: rgba(color, 0.1),
//                 color,
//                 display: "flex",
//                 alignItems: "center",
//                 justifyContent: "center",
//                 fontSize: s.icon,
//                 flex: "0 0 44px",
//               }}
//               aria-hidden
//             >
//               {Icon}
//             </div>
//           ) : null}

//           <div style={{ minWidth: 0 }}>
//             <Typography.Text
//               style={{
//                 display: "block",
//                 whiteSpace: "nowrap",
//                 overflow: "hidden",
//                 textOverflow: "ellipsis",
//                 fontSize: 13,
//                 color: "rgba(0,0,0,0.85)",
//               }}
//             >
//               {label}
//             </Typography.Text>
//             <Typography.Text
//               style={{ fontSize: 11, color: "rgba(0,0,0,0.45)" }}
//             >
//               {isEnglish ? "Updated just now" : "قبل دقيقة واحدة"}
//             </Typography.Text>
//           </div>
//         </div>

//         {dropdown?.length ? (
//           <Dropdown menu={{ items: menuItems ?? [] }} trigger={["click"]}>
//             <Tooltip title={isEnglish ? "Actions" : "إجراءات"}>
//               <CaretDownFilled
//                 style={{
//                   fontSize: 16,
//                   color: "rgba(0,0,0,0.45)",
//                   cursor: "pointer",
//                 }}
//               />
//             </Tooltip>
//           </Dropdown>
//         ) : null}
//       </div>

//       {/* main metric + right visual */}
//       <div
//         style={{
//           display: "flex",
//           alignItems: "center",
//           justifyContent: "space-between",
//           gap: 12,
//         }}
//       >
//         <div style={{ minWidth: 0 }}>
//           <div
//             style={{
//               fontSize: s.title,
//               fontWeight: 800,
//               color: "rgba(0,0,0,0.95)",
//               lineHeight: 1,
//               marginTop: 28,
//             }}
//           >
//             {!showPercent ? <CounterAnimation to={count} /> : count}

//             {isPercent ? " %" : ""}
//           </div>

//           {/* optional trend chip for detail variant */}
//           {variant === "detail" && trend && (
//             <div
//               style={{
//                 marginTop: 6,
//                 display: "inline-flex",
//                 gap: 8,
//                 alignItems: "center",
//               }}
//             >
//               <div
//                 style={{
//                   background: chipBg,
//                   color: chipColor,
//                   padding: "5px 8px",
//                   borderRadius: 999,
//                   fontWeight: 700,
//                   fontSize: 12,
//                 }}
//               >
//                 <span
//                   style={{ transform: `rotate(${trendIsUp ? 0 : 180}deg)` }}
//                 >
//                   ▲
//                 </span>{" "}
//                 <span>{trend.value}</span>
//               </div>
//             </div>
//           )}
//         </div>

//         {/* visual area: sparkline if present else chosen emptyMode */}
//         {showPercent && (
//           <div
//             style={{
//               width: 96,
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "center",
//               flex: "0 0 96px",
//             }}
//           >
//             {" "}
//             <AnimatedDashboardProgress
//               targetPercent={percent?.toFixed(1) as unknown as number}
//               color={rgba(color, 0.75)}
//             />
//           </div>
//         )}
//       </div>
//     </Card>
//   );
// };

// export default CardCount;

// import { useEffect, useRef, useState } from "react";

// type AnimatedDashboardProgressProps = {
//   targetPercent: number;
//   color?: string;
// };

// export function AnimatedDashboardProgress({
//   targetPercent,
//   color,
// }: AnimatedDashboardProgressProps) {
//   const [display, setDisplay] = useState(0);
//   const rafRef = useRef<number | null>(null);
//   const startRef = useRef<number | null>(null);
//   const duration = 1000;

//   useEffect(() => {
//     cancelAnimationFrame(rafRef.current ?? 0);
//     startRef.current = null;

//     const step = (timestamp: number) => {
//       if (!startRef.current) startRef.current = timestamp;
//       const elapsed = timestamp - startRef.current;
//       const t = Math.min(1, elapsed / duration);
//       // ease-out cubic
//       const eased = 1 - Math.pow(1 - t, 3);
//       const current = Math.round(eased * targetPercent);
//       setDisplay(current);
//       if (t < 1) {
//         rafRef.current = requestAnimationFrame(step);
//       }
//     };

//     rafRef.current = requestAnimationFrame(step);
//     return () => {
//       if (rafRef.current) cancelAnimationFrame(rafRef.current);
//     };
//   }, [targetPercent]);

//   return (
//     <Progress
//       type="dashboard"
//       percent={display}
//       width={56}
//       strokeWidth={8}
//       strokeColor={color}
//       trailColor="rgba(0,0,0,0.06)"
//       format={() => <Typography>{Math.round(display)}%</Typography>}
//     />
//   );
// }

import React, { useState } from "react";
import { Card, Dropdown, Typography, Progress, Tag, Space } from "antd";
import {
  RiseOutlined,
  FallOutlined,
  MoreOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";
import { useLanguage } from "@/context/language";
import { CounterAnimation } from "@/animations/counter";
import type { Dropdown as DropdownType } from "../../../types";
import { motion } from "framer-motion";

type Trend = { value: string; direction: "up" | "down" };
type EmptyMode = "icon" | "progress" | "cta";
type Props = {
  count: number;
  label: string;
  dropdown?: DropdownType[];
  color?: string;
  isPercent?: boolean;
  Icon?: React.ReactNode;
  trend?: Trend;
  history?: number[];
  variant?: "compact" | "detail" | "minimal";
  size?: "sm" | "md" | "lg";
  emptyMode?: EmptyMode;
  onConfigure?: () => void;
  ariaLabel?: string;
  percent?: number;
  showPercent?: boolean;
  description?: string;
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

const CardCount = ({
  count,
  label,
  dropdown,
  color = "#2563eb",
  Icon,
  isPercent = false,
  trend,
  size = "md",
  ariaLabel,
  percent = 0,
  showPercent = false,
  description,
}: Props) => {
  const { isEnglish } = useLanguage();
  const [isHovered, setIsHovered] = useState(false);

  const menuItems = dropdown?.map((d, idx) => ({
    label: (isEnglish ? d?.enLabel : d?.arLabel) || "",
    key: idx.toString(),
    onClick: d?.onClick,
  }));

  const sizes = {
    sm: { h: 140, title: 24, icon: 20, padding: 16 },
    md: { h: 160, title: 32, icon: 24, padding: 20 },
    lg: { h: 180, title: 36, icon: 28, padding: 24 },
  } as const;

  const s = sizes[size];

  const trendIsUp = trend?.direction === "up";
  const trendColor = trendIsUp ? "#10b981" : "#ef4444";
  const trendBg = trendIsUp
    ? "rgba(16, 185, 129, 0.1)"
    : "rgba(239, 68, 68, 0.1)";

  const getGradient = () => {
    return `linear-gradient(135deg, ${rgba(color, 0.1)} 0%, ${rgba(
      color,
      0.05
    )} 100%)`;
  };

  const renderTrend = () => {
    if (!trend) return null;

    return (
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <Tag
          color={trendBg}
          style={{
            color: trendColor,
            border: `1px solid ${rgba(trendColor, 0.2)}`,
            borderRadius: "12px",
            padding: "4px 8px",
            fontSize: "12px",
            fontWeight: 600,
            margin: 0,
          }}
        >
          {trendIsUp ? <RiseOutlined /> : <FallOutlined />}
          <span style={{ marginLeft: 4 }}>{trend.value}</span>
        </Tag>
      </motion.div>
    );
  };

  const renderVisualization = () => {
    if (showPercent) {
      return (
        <div style={{ width: 80, height: 80 }}>
          <AnimatedDashboardProgress
            targetPercent={percent}
            color={color}
            size={64}
          />
        </div>
      );
    }
  };

  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <Card
        hoverable
        role="group"
        aria-label={ariaLabel ?? label}
        bodyStyle={{
          padding: s.padding,
          height: s.h,
          background: getGradient(),
          borderRadius: "16px",
          border: `1px solid ${rgba(color, 0.1)}`,
          position: "relative",
          overflow: "hidden",
        }}
        style={{
          borderRadius: "16px",
          boxShadow: isHovered
            ? `0 20px 40px ${rgba(color, 0.15)}, 0 0 0 1px ${rgba(color, 0.1)}`
            : "0 8px 24px rgba(0, 0, 0, 0.08)",
          transition: "all 0.3s ease",
          backdropFilter: "blur(10px)",
        }}
      >
        {/* Header Section */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginBottom: 16,
          }}
        >
          <div
            style={{ display: "flex", alignItems: "center", gap: 12, flex: 1 }}
          >
            <motion.div
              whileHover={{ scale: 1.1, rotate: 5 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
              style={{
                width: 44,
                height: 44,
                borderRadius: "12px",
                background: `linear-gradient(135deg, ${color}, ${rgba(
                  color,
                  0.7
                )})`,
                color: "white",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: s.icon,
                boxShadow: `0 4px 12px ${rgba(color, 0.3)}`,
              }}
            >
              {Icon}
            </motion.div>

            <div style={{ flex: 1, minWidth: 0 }}>
              <Typography.Text
                style={{
                  display: "block",
                  fontSize: "14px",
                  fontWeight: 600,
                  color: "#64748b",
                  marginBottom: 4,
                }}
              >
                {label}
              </Typography.Text>

              {description && (
                <Typography.Text
                  style={{
                    fontSize: "12px",
                    color: "#94a3b8",
                    display: "block",
                  }}
                >
                  {description}
                </Typography.Text>
              )}
            </div>
          </div>

          <Space size={4}>
            {renderTrend()}

            {dropdown?.length ? (
              <Dropdown
                menu={{ items: menuItems ?? [] }}
                trigger={["click"]}
                placement="bottomRight"
              >
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  style={{
                    border: "none",
                    background: "transparent",
                    borderRadius: "8px",
                    width: 32,
                    height: 32,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    backdropFilter: "blur(10px)",

                    zIndex: 4,
                    position: "relative",
                  }}
                >
                  <MoreOutlined style={{ color: "#64748b", fontSize: 16 }} />
                </motion.button>
              </Dropdown>
            ) : null}
          </Space>
        </div>

        {/* Main Content */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flex: 1,
          }}
        >
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              style={{
                fontSize: s.title,
                fontWeight: 800,
                color: "#1e293b",
                lineHeight: 1.1,
                marginBottom: 8,
                background: `linear-gradient(135deg, #1e293b, ${color})`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                display: "flex",
                alignItems: "center",
              }}
            >
              <CounterAnimation to={count} />
              {isPercent ? "%" : ""}
            </motion.div>

            <Typography.Text
              style={{
                fontSize: "12px",
                color: "#64748b",
                display: "flex",
                alignItems: "center",
                gap: 4,
              }}
            >
              <InfoCircleOutlined />
              {isEnglish ? "Updated recently" : "تم التحديث مؤخراً"}
            </Typography.Text>
          </div>

          {renderVisualization()}
        </div>

        {/* Background Decorative Elements */}
        <div
          style={{
            position: "absolute",
            top: -20,
            right: isEnglish ? -20 : "unset",
            left: isEnglish ? "unset" : -20,
            width: 80,
            height: 80,
            borderRadius: "50%",
            background: rgba(color, 0.05),
            zIndex: 0,
          }}
        />
      </Card>
    </motion.div>
  );
};

// Enhanced Progress Component
const AnimatedDashboardProgress = ({
  targetPercent,
  color,
  size = 56,
}: {
  targetPercent: number;
  color?: string;
  size?: number;
}) => {
  const [display, setDisplay] = useState(0);

  React.useEffect(() => {
    const startTime = Date.now();
    const duration = 1200;

    const animate = () => {
      const now = Date.now();
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(eased * targetPercent);

      setDisplay(current);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [targetPercent]);

  return (
    <div style={{ position: "relative", width: size, height: size }}>
      <Progress
        type="circle"
        percent={display}
        width={size}
        strokeWidth={8}
        strokeColor={{
          "0%": color || "#2563eb",
          "100%": rgba(color || "#2563eb", 0.6),
        }}
        trailColor="rgba(255, 255, 255, 0.3)"
        format={() => (
          <div
            style={{
              fontSize: size * 0.2,
              fontWeight: 700,
              color: "#1e293b",
            }}
          >
            {display}%
          </div>
        )}
      />
    </div>
  );
};

export default CardCount;
