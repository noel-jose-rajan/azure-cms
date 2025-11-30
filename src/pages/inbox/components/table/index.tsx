// import {
//   ArrowLeftOutlined,
//   ArrowRightOutlined,
//   InsertRowBelowOutlined,
//   ReloadOutlined,
//   RetweetOutlined,
//   TableOutlined,
//   UserOutlined,
// } from "@ant-design/icons";
// import TitleHeader from "../../../../components/ui/header";
// import { useLanguage } from "../../../../context/language";
// import {
//   InboxCorrespondenceType,
//   SearchInboxCorrespondenceType,
// } from "../../types";
// import {
//   Avatar,
//   Checkbox,
//   Col,
//   Popover,
//   Radio,
//   Row,
//   Table,
//   TableColumnsType,
//   TableProps,
//   Tabs,
//   Typography,
//   message,
// } from "antd";
// import { useTheme } from "../../../../context/theme";
// import { useEffect, useState } from "react";
// import { PickListItemType } from "../../../pick-lists/service";
// import { DateHelper } from "../../../../components/functional/date";
// import { UserType } from "../../../../components/services/user-preference/type";
// import { OrganizationUnitType } from "../../../organization-units/service";
// import ActionMenuItem from "../../../../components/ui/menu-item";
// import { changeTaskColor, markCorrespondenceAsRead } from "../../service";
// import { HttpStatus } from "../../../../components/functional/httphelper";
// import TextWithValue from "../../../../components/ui/text-with-value";
// import TextWithTag from "../../../../components/ui/text-with-tag";
// import { useNavigate } from "react-router-dom";
// import TabPane from "antd/es/tabs/TabPane";
// import { getAppParameterValues } from "../../../create-inbound/service";
// import ColorGroupPicker from "../select-group-color";
// // import TaskInfoIcons from "../task-info-icons";

// interface InboxTableProps {
//   inbox: InboxCorrespondenceType[];
//   searchInbox: SearchInboxCorrespondenceType[];
//   users: UserType[];
//   orgUnits: OrganizationUnitType[];
//   setLoading: (loading: boolean) => void;
//   refreshInbox: () => void;
//   taskColors?: { [x: string]: string };
//   readStatus?: { [x: string]: boolean };
//   updateTaskColors?: (colors: { [x: string]: string }) => void;
//   updateReadStatus?: (status: { [x: string]: boolean }) => void;
// }

// const { Text } = Typography;

// export default function InboxTable({
//   inbox,
//   searchInbox,
//   users,
//   setLoading,
//   taskColors,
//   updateTaskColors,
//   readStatus,
//   updateReadStatus,
// }: InboxTableProps) {
//   const { labels, isEnglish } = useLanguage();
//   const { theme } = useTheme();
//   const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
//   const [_selectedTasks, setSelectedTasks] = useState<
//     InboxCorrespondenceType[]
//   >([]);
//   const [selectedSearchItem, setSelectedSearchItem] =
//     useState<SearchInboxCorrespondenceType>();
//   const [mode, setMode] = useState<boolean>(true);
//   const navigate = useNavigate();
//   const [activeKey, setActiveKey] = useState<string>("All");
//   const [enableAdhoc, setEnableAdhoc] = useState<boolean>(false);
//   const [tableTasks, setTableTasks] = useState<{
//     All: InboxCorrespondenceType[];
//     Inbound: InboxCorrespondenceType[];
//     Outbound: InboxCorrespondenceType[];
//     Adhoc: InboxCorrespondenceType[];
//   }>({ All: inbox, Inbound: [], Outbound: [], Adhoc: [] });
//   const [openGroup, setOpenGroup] = useState<boolean>(false);

//   useEffect(() => {
//     init();
//   }, []);

//   const init = async () => {
//     const response = await getAppParameterValues("AdhocEnabled");

//     if (response.status === HttpStatus.SUCCESS) {
//       if (response.data) {
//         setEnableAdhoc(response.data.value === "TRUE");
//       }
//     }
//   };

//   const getTaskWithProcess = (process: string) => {
//     let filtered = inbox.filter((value) => {
//       let typeOfCorres = searchInbox.find(
//         (item) => item.corrId === value.corrId
//       );
//       if (typeOfCorres) {
//         if (typeOfCorres.processName === process) {
//           return true;
//         }

//         return false;
//       } else {
//         return false;
//       }
//     });

//     return filtered;
//   };

//   useEffect(() => {
//     if (inbox && searchInbox) {
//       const clonedTasks = { ...tableTasks };

//       clonedTasks.All = inbox;
//       clonedTasks.Inbound = getTaskWithProcess("inboundProcess");
//       clonedTasks.Outbound = getTaskWithProcess("outboundProcess");
//       clonedTasks.Adhoc = getTaskWithProcess("adhocProcess");

//       setTableTasks(clonedTasks);
//     }
//   }, [inbox, searchInbox]);

//   const columns: TableColumnsType<InboxCorrespondenceType> = [
//     // {
//     //   title: "",
//     //   dataIndex: "corrId",
//     //   render: (text: string, record: InboxCorrespondenceType) => {
//     //     const corr = searchInbox.find((c) => c.corrId === text);
//     //     return (
//     //       <TaskInfoIcons
//     //         task={record}
//     //         correspondence={corr}
//     //         colorGroups={taskColors}
//     //       />
//     //     );
//     //   },
//     // },
//     {
//       title: labels.tbl.task_name,
//       dataIndex: "corrId",
//       render: (text: string) => {
//         const corr = searchInbox.find((c) => c.corrId === text);
//         const title = corr?.taskTitle;
//         return (
//           <a
//             style={{ color: theme.colors.accent, cursor: "pointer" }}
//             onClick={() => navigate(`${corr?.taskId}`)}
//           >
//             {title}
//           </a>
//         );
//       },
//     },
//     {
//       title: labels.lbl.subject,
//       dataIndex: "subject",
//       render: (text: string) => (
//         <a style={{ color: theme.colors.primary }}>{text}</a>
//       ),
//     },
//     {
//       title: labels.lbl.corr_number,
//       dataIndex: "correspondenceNo",
//       render: (text: string) => (
//         <a style={{ color: theme.colors.primary }}>{text}</a>
//       ),
//     },
//     {
//       title: labels.lbl.corr_types,
//       dataIndex: "corrTypePickList",
//       render: (text: PickListItemType) => (
//         <a style={{ color: theme.colors.primary }}>
//           {isEnglish ? text.picklistEnLabel : text.picklistArLabel}
//         </a>
//       ),
//     },
//     {
//       title: labels.lbl.sending_entity,
//       dataIndex: "corrId",
//       render: (_text: string, record: InboxCorrespondenceType) => {
//         const corrType = record.corrTypePickList.picklistCode;
//         let value = "";
//         if (corrType === "Corr-Type Int" || corrType === "Corr-Type Announ") {
//           value = isEnglish
//             ? record.internalSendingEntityDescEn ?? ""
//             : record.internalSendingEntityDescAr ?? "";
//         } else {
//           value = isEnglish
//             ? record.externalSendingEntityDescEn ?? "-"
//             : record.externalSendingEntityDescAr ?? "-";
//         }
//         return <a style={{ color: theme.colors.primary }}>{value}</a>;
//       },
//     },
//     {
//       title: labels.lbl.receiving_entity,
//       dataIndex: "corrId",
//       render: (_text: string, record: InboxCorrespondenceType) => {
//         let value = isEnglish
//           ? record.receivingOrganizationUnitsDescEn &&
//             record.receivingOrganizationUnitsDescEn.length > 0
//             ? record.receivingOrganizationUnitsDescEn[0]
//             : "-"
//           : record.receivingOrganizationUnitsDescAr &&
//             record.receivingOrganizationUnitsDescAr.length > 0
//           ? record.receivingOrganizationUnitsDescAr[0]
//           : "-";

//         return <a style={{ color: theme.colors.primary }}>{value}</a>;
//       },
//     },
//     {
//       title: labels.lbl.send_date,
//       dataIndex: "correspondenceDate",
//       render: (text: string) => (
//         <a style={{ color: theme.colors.primary }}>
//           {text ? DateHelper.convertDateFormat(text) : "-"}
//         </a>
//       ),
//     },
//     {
//       title: labels.lbl.sender_name,
//       dataIndex: "corrId",
//       render: (text: string) => {
//         const corr = searchInbox.find((c) => c.corrId === text);
//         const userId = corr?.previousPerformerId;
//         const userName = users.find((u) => u.userId === userId);
//         return (
//           <div style={{ display: "flex", alignItems: "center" }}>
//             <Avatar size="large" icon={<UserOutlined />} />
//             <a
//               style={{
//                 color: theme.colors.primary,
//                 marginLeft: 10,
//                 fontSize: 14,
//               }}
//             >
//               {userName?.username}
//             </a>
//           </div>
//         );
//       },
//     },
//   ];

//   const cardColumns: TableColumnsType<InboxCorrespondenceType> = [
//     {
//       title: labels.tbl.task,
//       dataIndex: "corrId",
//       render: (text: string, record: InboxCorrespondenceType) => {
//         const corr = searchInbox.find((c) => c.corrId === text);
//         const title = corr?.taskTitle;
//         const userId = corr?.previousPerformerId;
//         const userName = users.find((u) => u.userId === userId);
//         const corrType = record.corrTypePickList.picklistCode;
//         let value = "";
//         if (corrType === "Corr-Type Int" || corrType === "Corr-Type Announ") {
//           value = isEnglish
//             ? record.internalSendingEntityDescEn ?? ""
//             : record.internalSendingEntityDescAr ?? "";
//         } else {
//           value = isEnglish
//             ? record.externalSendingEntityDescEn ?? "-"
//             : record.externalSendingEntityDescAr ?? "-";
//         }

//         let receivingEntity = isEnglish
//           ? record.receivingOrganizationUnitsDescEn &&
//             record.receivingOrganizationUnitsDescEn.length > 0
//             ? record.receivingOrganizationUnitsDescEn
//             : []
//           : record.receivingOrganizationUnitsDescAr &&
//             record.receivingOrganizationUnitsDescAr.length > 0
//           ? record.receivingOrganizationUnitsDescAr
//           : [];

//         return (
//           <Row>
//             {/* <Col span={1}>
//               <TaskInfoIcons
//                 task={record}
//                 correspondence={corr}
//                 colorGroups={taskColors}
//                 verticalMode
//               />
//             </Col> */}
//             <Col span={11}>
//               <Text
//                 style={{ fontSize: 18, fontWeight: "600", cursor: "pointer" }}
//                 onClick={() => navigate(`${corr?.taskId}`)}
//               >
//                 {title}
//               </Text>
//               <TextWithValue
//                 primaryText={labels.lbl.corr_subject}
//                 secondaryText={record.subject}
//               />
//               <TextWithTag
//                 primaryText={labels.lbl.sending_entity}
//                 secondaryText={[value]}
//               />
//               <TextWithTag
//                 primaryText={labels.lbl.receiving_entity}
//                 secondaryText={receivingEntity}
//               />
//               <TextWithValue
//                 primaryText={labels.lbl.previous_comment}
//                 secondaryText={corr?.previousComment ?? "-"}
//               />
//             </Col>
//             <Col span={12}>
//               <Col
//                 style={{
//                   display: "flex",
//                   alignItems: "center",
//                   marginBottom: 15,
//                   marginLeft: 10,
//                 }}
//               >
//                 <Avatar size={50} icon={<UserOutlined />} />
//                 <a
//                   style={{
//                     color: theme.colors.primary,
//                     marginLeft: 10,
//                     fontSize: 14,
//                   }}
//                 >
//                   {userName?.username}
//                 </a>
//               </Col>
//               <TextWithValue
//                 primaryText={labels.lbl.send_date}
//                 secondaryText={
//                   isEnglish
//                     ? record.corrTypePickList.picklistEnLabel
//                     : record.corrTypePickList.picklistArLabel
//                 }
//               />
//               <TextWithValue
//                 primaryText={labels.lbl.correspondence_type}
//                 secondaryText={DateHelper.convertDateFormat(
//                   record.correspondenceDate
//                 )}
//               />
//               <TextWithValue
//                 primaryText={labels.lbl.corr_number}
//                 secondaryText={record.correspondenceNo}
//               />
//             </Col>
//           </Row>
//         );
//       },
//     },
//   ];

//   const rowSelection: TableProps<InboxCorrespondenceType>["rowSelection"] = {
//     type: "checkbox",
//     selectedRowKeys,
//     onChange: (keys: React.Key[], rows: InboxCorrespondenceType[]) => {
//       const [selectedKey] = keys;
//       const [selectedStamp] = rows;
//       setSelectedRowKeys(selectedKey ? [selectedKey] : []);
//       setSelectedTasks(selectedStamp ? [selectedStamp] : []);
//       const corr = searchInbox.find((c) => c.corrId === selectedStamp.corrId);

//       if (corr) {
//         setSelectedSearchItem(corr);
//       }
//     },
//     renderCell: (checked, record) => {
//       return (
//         <Checkbox
//           checked={checked}
//           onChange={() => {
//             const isSelected = selectedRowKeys.includes(record.corrId);

//             if (isSelected) {
//               setSelectedRowKeys([]);
//               setSelectedTasks([]);
//               setSelectedSearchItem(undefined);
//             } else {
//               setSelectedRowKeys([record.corrId]);
//               setSelectedTasks([record]);
//               const corr = searchInbox.find((c) => c.corrId === record.corrId);

//               if (corr) {
//                 setSelectedSearchItem(corr);
//               }
//             }
//           }}
//         />
//       );
//     },
//   };

//   const updateMailRead = async (status: boolean) => {
//     if (selectedRowKeys.length === 0) return;
//     setLoading(true);
//     const corr = searchInbox.find((c) => c.corrId === selectedRowKeys[0]);
//     const taskId = corr?.taskId ?? "";

//     const response = await markCorrespondenceAsRead(
//       status,
//       taskId,
//       selectedRowKeys[0] as string
//     );

//     if (response.status === HttpStatus.SUCCESS) {
//       const clonedTaskColors = { ...readStatus };
//       if (selectedSearchItem?.taskId) {
//         clonedTaskColors[selectedSearchItem?.taskId] = status;
//       }

//       updateReadStatus && updateReadStatus(clonedTaskColors);
//     } else {
//       message.error(
//         isEnglish ? "Failed to get Users" : "فشل في الحصول على المستخدمين"
//       );
//     }
//     setLoading(false);
//   };

//   const tabStyle = (key: string) => ({
//     padding: "8px 16px",
//     backgroundColor: activeKey === key ? theme.colors.primary : "unset",
//     color: activeKey === key ? theme.colors.backgroundText : "inherit",
//     display: "flex",
//     alignItems: "center",
//     borderRadius: "5px",
//   });

//   const numberStyle = (key: string) => ({
//     backgroundColor:
//       activeKey === key ? theme.colors.accent : theme.colors.backgroundText,
//     color: activeKey === key ? "#fff" : theme.colors.accent,
//     padding: "2px 9px",
//     borderRadius: "12px",
//     marginLeft: "8px",
//   });

//   const renderTab = (icon: any, text: string, number: number, key: string) => (
//     <span style={tabStyle(key)}>
//       {icon}
//       <span style={{ marginLeft: 8 }}>{text}</span>
//       <span style={numberStyle(key)}>{number}</span>
//     </span>
//   );

//   const onChangeColorGroupOfTask = async (color: string | null) => {
//     if (!selectedSearchItem) return;

//     console.log("the color", color);
//     const response = await changeTaskColor(
//       selectedSearchItem.taskId,
//       color ?? ""
//     );

//     if (response.status !== HttpStatus.SUCCESS) {
//       // error message shows
//     } else {
//       const clonedTaskColors = { ...taskColors };

//       if (color) {
//         clonedTaskColors[selectedSearchItem.taskId] = color;
//       } else {
//         delete clonedTaskColors[selectedSearchItem.taskId];
//       }

//       updateTaskColors && updateTaskColors(clonedTaskColors);
//     }
//     setOpenGroup(false);
//   };

//   return (
//     <>
//       <TitleHeader
//         heading={labels.til.tasks}
//         icon={<TableOutlined style={{ color: "#fff" }} />}
//       />
//       <Col
//         style={{
//           display: "flex",
//           justifyContent: "flex-end",
//           marginRight: 10,
//           marginTop: 10,
//         }}
//       >
//         <Radio.Group
//           defaultValue={mode}
//           buttonStyle="solid"
//           onChange={(e) => setMode(e.target.value)}
//         >
//           <Radio.Button value={true}>
//             <TableOutlined style={{ marginRight: 10 }} />
//             Table
//           </Radio.Button>
//           <Radio.Button value={false}>
//             <InsertRowBelowOutlined style={{ marginRight: 10 }} />
//             Card
//           </Radio.Button>
//         </Radio.Group>
//       </Col>
//       <Tabs
//         defaultActiveKey={activeKey}
//         onChange={(key) => {
//           setActiveKey(key);
//         }}
//       >
//         <TabPane
//           tab={renderTab(
//             <RetweetOutlined />,
//             labels.til.all,
//             inbox.length,
//             "All"
//           )}
//           key="All"
//         />
//         <TabPane
//           tab={renderTab(
//             <ArrowLeftOutlined />,
//             labels.til.inbound,
//             tableTasks.Inbound.length,
//             "Inbound"
//           )}
//           key="Inbound"
//         />
//         <TabPane
//           tab={renderTab(
//             <ArrowRightOutlined />,
//             labels.til.outbound,
//             tableTasks.Outbound.length,
//             "Outbound"
//           )}
//           key="Outbound"
//         />
//         <TabPane
//           tab={renderTab(
//             <ReloadOutlined />,
//             labels.til.adhoc,
//             tableTasks.Adhoc.length,
//             "Adhoc"
//           )}
//           key="Adhoc"
//           disabled={enableAdhoc === false}
//         />
//       </Tabs>
//       <div style={{ padding: 10 }}>
//         <div
//           style={{
//             borderRadius: "2px",
//             marginTop: 20,
//             border: "1px solid #cbcbcb",
//           }}
//         >
//           <div
//             style={{
//               flexDirection: isEnglish ? "row" : "row-reverse",
//               display: "flex",
//               flexWrap: "wrap",
//             }}
//           >
//             <ActionMenuItem
//               onClick={() => updateMailRead(true)}
//               isActive={
//                 !(
//                   selectedRowKeys.length !== 1 ||
//                   readStatus?.[selectedSearchItem?.taskId as string] ||
//                   selectedSearchItem?.taskHasError
//                 )
//               }
//               label={labels.btn.read}
//               type="mailOpened"
//             />
//             <ActionMenuItem
//               onClick={() => updateMailRead(false)}
//               isActive={
//                 !(
//                   selectedRowKeys.length !== 1 ||
//                   !readStatus?.[selectedSearchItem?.taskId as string] ||
//                   selectedSearchItem?.taskHasError
//                 )
//               }
//               label={labels.btn.notread}
//               type="mail"
//             />
//             <Popover
//               placement="bottom"
//               open={openGroup}
//               content={
//                 <ColorGroupPicker onSelectColor={onChangeColorGroupOfTask} />
//               }
//             >
//               <ActionMenuItem
//                 onClick={() => setOpenGroup(!openGroup)}
//                 isActive={selectedRowKeys.length === 1}
//                 label={labels.btn.group}
//                 type="list"
//               />
//             </Popover>
//           </div>
//           <Table<InboxCorrespondenceType>
//             rowSelection={{ type: "checkbox", ...rowSelection }}
//             showSorterTooltip
//             sortDirections={["ascend", "descend"]}
//             columns={mode ? columns : cardColumns}
//             dataSource={
//               tableTasks[activeKey as "All" | "Inbound" | "Outbound" | "Adhoc"]
//             }
//             rowKey="corrId"
//             scroll={{ x: "max-content" }}
//             rowClassName={(record) => {
//               const corr = searchInbox.find((c) => c.corrId === record.corrId);
//               if (corr && readStatus?.[corr?.taskId as string]) {
//                 return "";
//               }
//               return "inbox-table-unread";
//             }}
//             pagination={{
//               size: "small",
//               total:
//                 tableTasks[
//                   activeKey as "All" | "Inbound" | "Outbound" | "Adhoc"
//                 ].length,
//               defaultPageSize: 10,
//               showTotal: () =>
//                 `${isEnglish ? "Total" : "المجموع"} ${
//                   tableTasks[
//                     activeKey as "All" | "Inbound" | "Outbound" | "Adhoc"
//                   ].length
//                 } ${isEnglish ? "items" : "أغراض"}`,
//               showSizeChanger: true,
//               pageSizeOptions: [5, 10, 20],
//               style: { marginRight: 10, marginLeft: 10 },
//               showQuickJumper: true,
//               locale: {
//                 jump_to: isEnglish ? "Go to" : "اذهب الى",
//                 page: isEnglish ? "Page" : "صفحة",
//                 prev_page: isEnglish ? "Previous" : "خلف",
//                 next_page: isEnglish ? "Next" : "التالي",
//                 items_per_page: isEnglish ? "/ Page" : "/ صفحة",
//               },
//             }}
//           />
//         </div>
//       </div>
//     </>
//   );
// }
