// import React, { useCallback, useEffect } from "react";
// import { Card, Grid, Typography, Tooltip, Space } from "antd";
// import {
//   UserAddOutlined,
//   RiseOutlined,
//   ArrowUpOutlined,
//   SearchOutlined,
// } from "@ant-design/icons";
// import { useLanguage } from "@/context/language";
// import { useNavigate } from "react-router-dom";

// type Action = {
//   key: string;
//   enTitle: string;
//   arTitle: string;
//   description?: string;
//   icon?: React.ReactNode;
//   href: string;
//   shortcut?: string; // e.g. "Ctrl+N"
// };

// type Props = {
//   actions?: Action[];
//   dir?: "ltr" | "rtl";
//   className?: string;
//   "aria-label"?: string;
// };

// const defaultActions: Action[] = [
//   {
//     key: "create-outbound",
//     enTitle: "Create Outbound",
//     arTitle: "إنشاء مراسلة خارجية",
//     icon: <ArrowUpOutlined />,
//     href: "/correspondence/outbound",
//   },
//   {
//     key: "create-inbound",
//     enTitle: "Create Inbound",
//     arTitle: "إنشاء مراسلة واردة",
//     icon: <RiseOutlined />,
//     href: "/correspondence/inbound",
//   },
//   {
//     key: "search",
//     enTitle: "Search",
//     arTitle: "بحث",
//     icon: <SearchOutlined />,
//     href: "/correspondence/search",
//   },
//   //   {
//   //     key: "add-user",
//   //     enTitle: "Add New User",
//   //     arTitle: "إضافة مستخدم",
//   //     icon: <UserAddOutlined />,
//   //     href: "/users/create",

//   //   },
// ];

// const styles = {
//   grid: {
//     display: "flex",
//     flexDirection: "column",
//     gap: 12,
//     width: "100%",
//   } as const,
//   card: {
//     borderRadius: 10,
//     padding: 12,
//     height: 96,
//     display: "flex",
//     alignItems: "center",
//     gap: 12,
//     cursor: "pointer",
//     transition: "transform 160ms ease, box-shadow 160ms ease",
//     boxShadow: "0 4px 10px rgba(15,23,42,0.04)",
//   } as const,
//   cardHover: {
//     transform: "translateY(-4px)",
//     boxShadow: "0 8px 24px rgba(15,23,42,0.08)",
//   } as const,
//   iconShell: (color = "#2563eb") =>
//     ({
//       width: 48,
//       height: 48,
//       borderRadius: 10,
//       display: "grid",
//       placeItems: "center",
//       background: `${color}22`,
//       color,
//       fontSize: 18,
//       flex: "0 0 48px",
//     } as const),
//   title: { fontSize: 14, fontWeight: 700, lineHeight: 1 } as const,
//   desc: { fontSize: 12, color: "rgba(0,0,0,0.55)" } as const,
//   shortcut: {
//     fontSize: 11,
//     background: "rgba(0,0,0,0.04)",
//     padding: "4px 6px",
//     borderRadius: 6,
//     color: "rgba(0,0,0,0.7)",
//     fontWeight: 700,
//   } as const,
// };

// export default function QuickActions({
//   actions = defaultActions,
//   className,
//   "aria-label": ariaLabel,
//   dir,
// }: Props) {
//   const navigate = useNavigate();
//   const { isEnglish } = useLanguage();
//   const rtl = dir ? dir === "rtl" : !isEnglish;

//   const handleNavigate = useCallback(
//     (href: string) => {
//       navigate(href);
//     },
//     [navigate]
//   );

//   const normalize = (e: KeyboardEvent) => {
//     const parts = [];
//     if (e.ctrlKey || e.metaKey) parts.push("Ctrl");
//     if (e.altKey) parts.push("Alt");
//     if (e.shiftKey) parts.push("Shift");
//     const key = e.key.length === 1 ? e.key.toUpperCase() : e.key;
//     parts.push(key);
//     return parts.join("+");
//   };

//   useEffect(() => {
//     const onKey = (e: KeyboardEvent) => {
//       const pressed = normalize(e);
//       for (const a of actions) {
//         if (!a.shortcut) continue;
//         if (pressed.toLowerCase() === a.shortcut.toLowerCase()) {
//           e.preventDefault();
//           handleNavigate(a.href);
//         }
//       }
//     };
//     window.addEventListener("keydown", onKey);
//     return () => window.removeEventListener("keydown", onKey);
//   }, [actions, handleNavigate]);

//   return (
//     <Card
//       title={
//         <Typography style={{ margin: 0 }}>
//           {rtl ? "الإجراءات السريعة" : "Quick Actions"}
//         </Typography>
//       }
//       bodyStyle={{ padding: 12 }}
//       style={{ borderRadius: 12, marginInline: 8, height: 400 }}
//       className={className}
//       aria-label={ariaLabel}
//       dir={rtl ? "rtl" : "ltr"}
//     >
//       <div style={styles.grid}>
//         {actions.map((action, idx) => {
//           const color = action.key.includes("outbound")
//             ? "#0ea5e9"
//             : action.key.includes("inbound")
//             ? "#10b981"
//             : action.key.includes("user")
//             ? "#7c3aed"
//             : "#2563eb";
//           return (
//             <div
//               key={action.key}
//               role="button"
//               tabIndex={0}
//               aria-label={rtl ? action.arTitle : action.enTitle}
//               onClick={() => handleNavigate(action.href)}
//               onKeyDown={(e) => {
//                 if (e.key === "Enter" || e.key === " ") {
//                   e.preventDefault();
//                   handleNavigate(action.href);
//                 }
//               }}
//               style={styles.card}
//               onMouseEnter={(ev) =>
//                 (ev.currentTarget.style.transform = styles.cardHover.transform)
//               }
//               onMouseLeave={(ev) => (ev.currentTarget.style.transform = "none")}
//             >
//               <div style={styles.iconShell(color)} aria-hidden>
//                 {action.icon}
//               </div>

//               <div style={{ flex: 1, minWidth: 0 }}>
//                 <Space
//                   style={{
//                     width: "100%",
//                     justifyContent: "space-between",
//                     alignItems: "start",
//                   }}
//                 >
//                   <div style={{ minWidth: 0 }}>
//                     <Typography>
//                       {rtl ? action.arTitle : action.enTitle}
//                     </Typography>
//                     {action.description ? (
//                       <div>
//                         <Typography>{action.description}</Typography>
//                       </div>
//                     ) : null}
//                   </div>
//                 </Space>
//               </div>
//             </div>
//           );
//         })}
//       </div>
//     </Card>
//   );
// }

// import React from "react";
// import { Card, Table, Tag, Typography } from "antd";
// import type { ColumnsType } from "antd/es/table";
// import { useLanguage } from "@/context/language";
// import TableComponent from "@/components/ui/table-component";

// interface ActionRecord {
//   key: string;
//   action: string;
//   arAction: string;
//   enAction: string;
//   date: string;
// }

// const data: ActionRecord[] = [
//   {
//     key: "-1",
//     action: "Review Outbound",
//     arAction: "مراجعة الصادر",
//     enAction: "Review Outbound",
//     date: "2025-10-20 14:30",
//   },
//   {
//     key: "-2",
//     action: "Review Outbound",
//     arAction: "مراجعة الصادر",
//     enAction: "Review Outbound",
//     date: "2025-10-20 14:30",
//   },
//   {
//     key: "0",
//     action: "Review Outbound",
//     arAction: "مراجعة الصادر",
//     enAction: "Review Outbound",
//     date: "2025-10-20 14:30",
//   },
//   {
//     key: "1",
//     action: "Review Outbound",
//     arAction: "مراجعة الصادر",
//     enAction: "Review Outbound",
//     date: "2025-10-20 14:30",
//   },
//   {
//     key: "2",
//     action: "Approve Outbound",
//     arAction: "اعتماد الصادر",
//     enAction: "Approve Outbound",
//     date: "2025-10-20 15:00",
//   },
//   {
//     key: "3",
//     action: "Send Task",
//     arAction: "إرسال المهمة",
//     enAction: "Send Task",
//     date: "2025-10-20 15:30",
//   },
//   {
//     key: "4",
//     action: "Rejected Outbound",
//     arAction: "رفض الصادر",
//     enAction: "Rejected Outbound",
//     date: "2025-10-21 09:00",
//   },
//   {
//     key: "5",
//     action: "Review Outbound",
//     arAction: "مراجعة الصادر",
//     enAction: "Review Outbound",
//     date: "2025-10-21 11:15",
//   },
//   {
//     key: "6",
//     action: "Rejected Outbound",
//     arAction: "رفض الصادر",
//     enAction: "Rejected Outbound",
//     date: "2025-10-21 13:15",
//   },
// ]?.reverse();

// const LastActionsTable: React.FC = () => {
//   const { isEnglish, labels } = useLanguage();
//   const columns: ColumnsType<ActionRecord> = [
//     {
//       title: labels.tbl.action,
//       dataIndex: "action",
//       key: "action",
//       render: (_, record) => {
//         let text = isEnglish ? record.enAction : record.arAction;
//         return <span>{text}</span>;
//       },
//     },
//     {
//       title: labels.tbl.date_created,
//       dataIndex: "date",
//       key: "date",
//     },
//   ];
//   return (
//     <Card
//       style={{
//         borderRadius: 0,
//         height: 450,
//         marginInline: 8,
//         flexBasis: 450,
//         overflowY: "auto",
//       }}
//       dir={!isEnglish ? "rtl" : "ltr"}
//     >
//       <Typography style={{ margin: 0, fontWeight: "bold", marginBottom: 20 }}>
//         {isEnglish ? "Latest Actions" : "اخر الإجراءات"}
//       </Typography>
//       <TableComponent columns={columns} dataSource={data} pagination={false} />
//     </Card>
//   );
// };

// export default LastActionsTable;

// with  cards

import React from "react";
import { Card, Typography, Button, Tag } from "antd";
import { EyeOutlined } from "@ant-design/icons";
import { useLanguage } from "@/context/language";
import { useTheme } from "@/context/theme";
import { useNavigate } from "react-router-dom";
import usePicklist from "@/store/picklists/use-picklist";
import useGetAllOU from "@/store/orgs/use-get-all-ou";
import useExternalEntities from "@/store/external-entities/use-external-entities";

interface CorrespondenceItem {
  correspondence_id: number;
  corr_subject: string;
  correspondence_no: string;
  task_type_id: number;
  from_entity_id: number;
  to_entity_id: number;
  task_due_date: string;
}

const actionTypes: Record<
  number,
  { color: string; label: string; arLabel: string }
> = {
  105: { color: "blue", label: "Review", arLabel: "مراجعة" },
  110: { color: "green", label: "Approve", arLabel: "اعتماد" },
  // 113: { color: "purple", label: "Send", arLabel: "إرسال" },
};

// const data: CorrespondenceItem[] = [
//   {
//     id: 219,
//     task_type_id: 110,
//     corr_subject: "اختبار مراسلة داخلية 001",
//     correspondence_no: "INT-GM-GM-00025-2025",
//     corr_sending_name: "General Manager",
//     corr_receiving_name: "General Manager",
//     task_date: "2025-09-29T10:32:26.676305Z",
//   },
//   {
//     id: 211,
//     task_type_id: 110,
//     corr_subject: "Test1122334455",
//     correspondence_no: "INT-FIN-GM-00002-2025",
//     corr_sending_name: "Finance Sector",
//     corr_receiving_name: "General Manager",
//     task_date: "2025-09-20T20:58:35.832633Z",
//   },
//   {
//     id: 163,
//     task_type_id: 105,
//     corr_subject: "oo23uuuuyuy",
//     correspondence_no: "",
//     corr_sending_name: "General Manager",
//     corr_receiving_name: "General Manager",
//     task_date: "2025-08-19T09:01:07.672197Z",
//   },
//   {
//     id: 157,
//     task_type_id: 113,
//     corr_subject: "Test Multi Internal Outbund 001",
//     correspondence_no: "INT-GM-GM-00024-2025",
//     corr_sending_name: "General Manager",
//     corr_receiving_name: "General Manager",
//     task_date: "2025-08-16T15:15:04.463542Z",
//   },
//   {
//     id: 154,
//     task_type_id: 113,
//     corr_subject: "Test Multi Internal Outbund 001",
//     correspondence_no: "INT-GM-GM-00024-2025",
//     corr_sending_name: "General Manager",
//     corr_receiving_name: "General Manager",
//     task_date: "2025-08-16T15:15:04.410411Z",
//   },
//   {
//     id: 116,
//     task_type_id: 110,
//     corr_subject: "app6",
//     correspondence_no: "INT-GM-GM-00022-2025",
//     corr_sending_name: "General Manager",
//     corr_receiving_name: "General Manager",
//     task_date: "2025-08-11T12:22:27.132336Z",
//   },
//   {
//     id: 115,
//     task_type_id: 110,
//     corr_subject: "app5",
//     correspondence_no: "INT-GM-GM-00021-2025",
//     corr_sending_name: "General Manager",
//     corr_receiving_name: "General Manager",
//     task_date: "2025-08-11T12:21:04.528926Z",
//   },
//   {
//     id: 114,
//     task_type_id: 110,
//     corr_subject: "ap2",
//     correspondence_no: "INT-GM-GM-00020-2025",
//     corr_sending_name: "General Manager",
//     corr_receiving_name: "General Manager",
//     task_date: "2025-08-11T12:20:00.000000Z",
//   },
// ];

const data: CorrespondenceItem[] = [
  // {
  //   correspondence_id: 686786,
  //   corr_subject: "Test Legal Tasks",
  //   correspondence_no: "",
  //   task_type_id: 105,
  //   from_entity_id: 730,
  //   to_entity_id: 730,
  //   task_due_date: "2025-11-17T10:09:29.695969Z",
  // },
  {
    correspondence_id: 686785,
    corr_subject: "Provision of Consulting Services",
    correspondence_no: "IN-EXT-23-00004-2025-12345",
    task_type_id: 105,
    from_entity_id: 724,
    to_entity_id: 656,
    task_due_date: "2025-10-30T14:56:51.75592Z",
  },
  {
    correspondence_id: 686767,
    corr_subject: "اختبار مراسلة صادرة داخلية",
    correspondence_no: "INT-FIN-FIN-00002-2025",
    task_type_id: 110,
    from_entity_id: 656,
    to_entity_id: 656,
    task_due_date: "2025-10-27T16:00:00Z",
  },
  {
    correspondence_id: 686765,
    corr_subject: "اختبار مراسلة صادرة داخلية",
    correspondence_no: "INT-FIN-FIN-00001-2025",
    task_type_id: 105,
    from_entity_id: 656,
    to_entity_id: 656,
    task_due_date: "2025-10-27T16:00:00Z",
  },
  {
    correspondence_id: 686760,
    corr_subject: "Test Signature",
    correspondence_no: "INT-GM-FIN-00014-2025",
    task_type_id: 110,
    from_entity_id: 622,
    to_entity_id: 656,
    task_due_date: "2025-10-23T08:33:40.467438Z",
  },
  {
    correspondence_id: 686753,
    corr_subject: "Provision of Consulting Services",
    correspondence_no: "IN-EXT-23-00002-2025-12345",
    task_type_id: 105,
    from_entity_id: 724,
    to_entity_id: 656,
    task_due_date: "2025-10-16T10:44:38.639115Z",
  },
  {
    correspondence_id: 686719,
    corr_subject: "AppTest29_4",
    correspondence_no: "INT-GM-FIN-00012-2025",
    task_type_id: 105,
    from_entity_id: 622,
    to_entity_id: 656,
    task_due_date: "2025-10-14T11:56:03.546299Z",
  },
  {
    correspondence_id: 686710,
    corr_subject: "TestApp29_1",
    correspondence_no: "INT-GM-FIN-00009-2025",
    task_type_id: 110,
    from_entity_id: 622,
    to_entity_id: 656,
    task_due_date: "2025-10-14T11:23:46.272586Z",
  },
];

const CorrespondenceCards: React.FC = () => {
  const { isEnglish } = useLanguage();
  const { theme } = useTheme();
  const navigate = useNavigate();

  const { getPicklistById } = usePicklist();
  const { getOrgById } = useGetAllOU();
  const { getExternalEntityById } = useExternalEntities();
  return (
    <Card
      className="latest-actions "
      style={{
        maxHeight: "450px",
        borderRadius: 0,
        flexBasis: 450,
        overflowY: "scroll",
        position: "sticky",
        top: 10,
        padding: 0,
        paddingBottom: 8,
        marginTop: 8,
        background: theme?.colors?.backgroundText,
      }}
      bodyStyle={{ paddingBlock: 0, paddingInline: 8 }}
      dir={!isEnglish ? "rtl" : "ltr"}
    >
      <h3
        style={{
          fontWeight: "bold",

          position: "sticky",
          top: 0,
          background: theme?.colors?.backgroundText,
          // height: 32,
          display: "flex",
          alignItems: "center",
          zIndex: 1,
        }}
      >
        {isEnglish ? "Latest Actions" : "اخر الإجراءات"}
      </h3>

      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {data.map((item) => {
          const type = actionTypes[item.task_type_id] || {
            color: "default",
            label: "Action",
            arLabel: "إجراء",
          };
          const taskSub = getPicklistById("Task Subject", item?.task_type_id);
          const sending =
            getOrgById(item?.from_entity_id) ||
            getExternalEntityById(item?.from_entity_id);
          const receiving =
            getOrgById(item?.to_entity_id) ||
            getExternalEntityById(item?.to_entity_id);
          return (
            <Card
              key={item.correspondence_id}
              size="small"
              bodyStyle={{ padding: 8 }}
              style={{
                borderRadius: 6,
                boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
                background: "#fff",
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "start",
                  textAlign: isEnglish ? "left" : "right",
                }}
              >
                <div style={{ flex: 1 }}>
                  <div
                    style={{ display: "flex", alignItems: "center", gap: 8 }}
                  >
                    <Tag color={type.color} style={{ margin: 0 }}>
                      {isEnglish ? type.label : type.arLabel}
                    </Tag>
                    <Typography
                      style={{ fontWeight: 600, fontSize: 13, margin: 0 }}
                    >
                      {item.correspondence_no ||
                        (isEnglish ? "No Number" : "بدون رقم")}
                    </Typography>
                  </div>

                  <Typography
                    style={{ fontSize: 12, color: "#555", marginTop: 2 }}
                  >
                    {new Date(item.task_due_date).toLocaleString()}
                  </Typography>

                  <Typography style={{ fontSize: 12, marginTop: 4 }}>
                    <strong>{isEnglish ? "Subject:" : "الموضوع:"}</strong>{" "}
                    {item.corr_subject}
                  </Typography>

                  <Typography style={{ fontSize: 12 }}>
                    <strong>{isEnglish ? "From:" : "من:"}</strong>{" "}
                    {(isEnglish ? sending?.name_en : sending?.name_ar) || "-"}
                  </Typography>

                  <Typography style={{ fontSize: 12 }}>
                    <strong>{isEnglish ? "To:" : "إلى:"}</strong>{" "}
                    {(isEnglish ? receiving?.name_en : receiving?.name_ar) ||
                      "-"}
                  </Typography>
                </div>

                <Button
                  type="text"
                  icon={<EyeOutlined />}
                  style={{ marginInlineStart: "auto" }}
                  onClick={() =>
                    navigate("/correspondence/" + item.correspondence_id)
                  }
                />
              </div>
            </Card>
          );
        })}
      </div>
    </Card>
  );
};

export default CorrespondenceCards;
