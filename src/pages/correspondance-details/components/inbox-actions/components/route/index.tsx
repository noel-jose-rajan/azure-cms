// import {
//   Button,
//   Checkbox,
//   Col,
//   Modal,
//   Table,
//   TableColumnsType,
//   // TableProps,
//   Tooltip,
//   message,
// } from "antd";
// import { useLanguage } from "../../../../../../context/language";
// import {
//   DeleteFilled,
//   EditFilled,
//   InfoCircleFilled,
//   SendOutlined,
// } from "@ant-design/icons";
// import { CSSProperties, useEffect, useState } from "react";
// import { PickListItemType } from "../../../../../pick-lists/service";
// import { PickListHelper } from "../../../../../../components/functional/picklists";
// import {
//   CCUserCompleteUserType,
//   CCUserType,
//   CompleteTaskType,
//   CorrespondenceDetailType,
//   CreateRouteType,
//   InboxTaskType,
//   RoutingListType,
//   UpdateRoutingType,
//   createRouteSchema,
// } from "../../../../types";
// import {
//   checkIsRoutedBefore,
//   completeTaskAction,
//   createRouteForCorrespondence,
//   deleteARoute,
//   getCCUsers,
//   getCorrespondenceRoutings,
//   getRoutingLists,
//   updateTheRoutingWithId,
// } from "../../../../service";
// import { HttpStatus } from "../../../../../../components/functional/httphelper";
// import { useForm, useWatch } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// // import ActionMenuItem from "../../../../../../components/ui/menu-item";
// import { useTheme } from "../../../../../../context/theme";
// import CreateRoute from "./component/create-route";
// import Storage from "../../../../../../lib/storage";
// import LOCALSTORAGE from "../../../../../../constants/local-storage";
// import { useNavigate } from "react-router-dom";

// interface SendCCProps {
//   visible: boolean;
//   onClose: () => void;
//   details?: CorrespondenceDetailType;
//   task?: InboxTaskType;
// }

// export interface RouteItemTypes {
//   ccList: string[];
//   routeTo: string[];
// }

// export default function RouteCorrespondence({
//   visible,
//   onClose,
//   details,
//   task,
// }: SendCCProps) {
//   const { labels, isEnglish } = useLanguage();
//   const { theme } = useTheme();
//   const [ccUsers, setCCUsers] = useState<CCUserType[]>([]);
//   const [reqActions, setReqActions] = useState<PickListItemType[]>([]);
//   const [routingList, setRoutingList] = useState<CCUserType[]>([]);
//   const [routings, setRoutings] = useState<RoutingListType[]>([]);
//   const [sendCCPayload, setSendCCPayload] = useState<RouteItemTypes>({
//     ccList: [],
//     routeTo: [],
//   });
//   const [selectedRouting, setSelectedRouting] = useState<RoutingListType>();
//   const [loading, setLoading] = useState<boolean>(false);
//   const [userId, setCurrentUserId] = useState<string>(
//     Storage.getItem(LOCALSTORAGE.LEGACY_USER_ID) ?? ""
//   );
//   const [lockUrgencyLevel, setLockUrgencyLevel] = useState<boolean>(false);
//   const [loadAction, setLoadAction] = useState<boolean>(false);
//   const [readReceipt, setReadReceipt] = useState<boolean>(false);
//   const navigate = useNavigate();
//   const { control, reset, getValues } = useForm<CreateRouteType>({
//     resolver: zodResolver(createRouteSchema),
//     defaultValues: {
//       corrId: details?.corrId,
//       routeFromUserId: userId,
//     },
//   });

//   const formValues = useWatch({ control });

//   useEffect(() => {
//     init();
//     setCurrentUserId(Storage.getItem(LOCALSTORAGE.LEGACY_USER_ID) ?? "");
//   }, []);

//   const init = async () => {
//     await getCCUserList();
//     await getRoutingToLists();
//     await fetchThePreviousRoutings();
//     await getRequiredActions();
//   };

//   const getRequiredActions = async () => {
//     const response = await PickListHelper.routeRequiredActions();

//     setReqActions(response);
//   };

//   const fetchThePreviousRoutings = async () => {
//     if (!details?.corrId) return;
//     setLoading(true);
//     const response = await getCorrespondenceRoutings(details?.corrId);

//     if (response.status === HttpStatus.SUCCESS) {
//       if (response.data) {
//         setRoutings(response.data.content);
//         if (response.data.content.length > 0) {
//           setLockUrgencyLevel(true);
//           reset({
//             routingUrgnecyLevelPicklistCode:
//               response.data.content[0].routingUrgnecyLevelPicklistCode,
//           });
//         }
//       }
//     }
//     setLoading(false);
//   };

//   const getCCUserList = async () => {
//     if (task?.inboundRecipientOrgUnitCode && details) {
//       const response = await getCCUsers(
//         task.inboundRecipientOrgUnitCode,
//         details?.securityLevelPickListCode
//       );

//       if (response.status === HttpStatus.SUCCESS) {
//         if (response.data) {
//           setCCUsers(response.data);
//         }
//       }
//     }
//   };

//   const getRoutingToLists = async () => {
//     const userId = await Storage.getItem(LOCALSTORAGE.LEGACY_USER_ID);
//     if (task?.inboundRecipientOrgUnitCode && details) {
//       const response = await getRoutingLists(
//         task.inboundRecipientOrgUnitCode,
//         details?.securityLevelPickListCode
//       );

//       if (response.status === HttpStatus.SUCCESS) {
//         if (response.data) {
//           setRoutingList(
//             response.data.filter((u) => u.assigneeIdOrCode !== userId)
//           );
//         }
//       }
//     }
//   };

//   const iconStyle: CSSProperties = {
//     marginLeft: isEnglish ? 0 : 10,
//     marginRight: isEnglish ? 10 : 0,
//   };

//   const getThePickListValue = (code: string): string => {
//     if (!code) return "";
//     const pickList = reqActions.find((pl) => pl.picklistCode === code);

//     if (pickList) {
//       return isEnglish ? pickList.picklistEnLabel : pickList.picklistArLabel;
//     }

//     return "";
//   };

//   const columns: TableColumnsType<RoutingListType> = [
//     {
//       title: labels.lbl.route_to,
//       dataIndex: "routeToOrganizationUnitEn",
//       render: (_text: string, record: RoutingListType) => (
//         <a style={{ color: theme.colors.primary }}>
//           {record.routeToUserDesc
//             ? record.routeToUserDesc
//             : isEnglish
//             ? record.routeToOrganizationUnitEn
//             : record.routeToOrganizationUnitAr}
//         </a>
//       ),
//     },
//     {
//       title: labels.lbl.reqired_action,
//       dataIndex: "requiredActionPicklistCode",
//       render: (text: string) => (
//         <a style={{ color: theme.colors.primary }}>
//           {getThePickListValue(text)}
//         </a>
//       ),
//     },
//     {
//       title: labels.lbl.route_comment,
//       dataIndex: "routingComment",
//       render: (text: string) => (
//         <a style={{ color: theme.colors.primary }}>
//           {text === null || text === "null" ? "-" : text}
//         </a>
//       ),
//     },
//     {
//       dataIndex: "routingComment",
//       render: (_text: string, record: RoutingListType) => (
//         <>
//           <Button
//             type="primary"
//             style={{ marginRight: 10 }}
//             onClick={() => {
//               setSelectedRouting(record);
//             }}
//           >
//             <EditFilled />
//           </Button>
//           <Button type="link" onClick={() => deleteARouting(record)}>
//             <DeleteFilled />
//           </Button>
//         </>
//       ),
//     },
//   ];

//   const deleteARouting = async (record: RoutingListType) => {
//     setLoading(true);
//     const response = await deleteARoute(record.routingId);

//     if (response.status === HttpStatus.SUCCESS) {
//       const filtered = routings.filter(
//         (route) => route.routingId !== record.routingId
//       );

//       setRoutings(filtered);
//     }
//     setLoading(false);
//   };

//   const submitClicked = async () => {
//     if (selectedRouting) {
//       await editExistingRoute();
//     } else {
//       await createNewRoute();
//     }
//   };

//   const createNewRoute = async () => {
//     if (sendCCPayload.routeTo.length === 0) return;
//     sendCCPayload.routeTo.map(async (id: string) => {
//       await checkAndCreateRoute(id);
//     });
//   };

//   const checkAndCreateRoute = async (id: string) => {
//     const isRoutedTo = await checkIsRoutedBefore(id, details?.corrId);
//     const routeTo = routingList.find((rl) => rl.assigneeIdOrCode === id);

//     if (isRoutedTo.status === HttpStatus.SUCCESS) {
//       if (isRoutedTo.data && isRoutedTo.data.result === false) {
//         const payLoad: CreateRouteType = {
//           corrId: details?.corrId ?? "",
//           parentRoutingId: task?.parentRoutingId ? task.parentRoutingId : "",
//           requiredActionPicklistCode: getValues().requiredActionPicklistCode,
//           routingComment: getValues().routingComment,
//           routeFromUserId: userId,
//           routeToOrganizationUnitDTO:
//             routeTo?.orgunitPrincipal === true ? id : null,
//           routeToUserId: routeTo?.orgunitPrincipal === false ? id : null,
//           routeFromOrganizationUnitDTO: task?.inboundRecipientOrgUnitCode ?? "",
//           routingUrgnecyLevelPicklistCode:
//             getValues().routingUrgnecyLevelPicklistCode,
//         };

//         const response = await createRouteForCorrespondence(payLoad);

//         if (response.status === HttpStatus.SUCCESS) {
//           message.success(labels.msg.route_added);
//           await fetchThePreviousRoutings();
//         }
//       }
//     }
//   };

//   const editExistingRoute = async () => {
//     if (!selectedRouting) return;
//     setLoading(true);
//     const requiredActions = reqActions.find(
//       (reqAc) => reqAc.picklistCode === formValues.requiredActionPicklistCode
//     );

//     const routeTo = routingList.find(
//       (rl) => rl.assigneeIdOrCode === sendCCPayload.routeTo[0]
//     );

//     const payLoad: UpdateRoutingType = {
//       ...selectedRouting,
//       requiredActionPicklistCode: formValues.requiredActionPicklistCode ?? "",
//       routingComment: formValues.routingComment ?? "",
//       routeToUserId: routeTo?.orgunitPrincipal
//         ? null
//         : sendCCPayload.routeTo[0],
//       routeToOrganizationUnitDTO: routeTo?.orgunitPrincipal
//         ? sendCCPayload.routeTo[0]
//         : null,
//       description: {
//         arDescription: routeTo?.arDescription ?? "",
//         enDescription: routeTo?.enDescription ?? "",
//       },
//       requiredActionPicklist: requiredActions ?? "",
//     };

//     const response = await updateTheRoutingWithId(
//       selectedRouting?.routingId,
//       payLoad
//     );

//     if (response.status === HttpStatus.SUCCESS) {
//       message.success(isEnglish ? "Successfully updated" : "تم التحديث بنجاح");
//       const clonedValue = { ...sendCCPayload };
//       clonedValue.routeTo = [];
//       setSendCCPayload(clonedValue);
//       setSelectedRouting(undefined);

//       await fetchThePreviousRoutings();
//     } else {
//       message.error(
//         isEnglish
//           ? "Something went wrong! Please contact your system administrator"
//           : "حدث خطأ ما، يرجى الاتصال بمسؤول النظام"
//       );
//     }
//     setLoading(false);
//   };

//   const completeTask = async () => {
//     setLoadAction(true);

//     const currenUserId = await Storage.getItem<string>(
//       LOCALSTORAGE.LEGACY_USER_ID
//     );

//     const filteredValue = sendCCPayload.ccList.map((userId) => {
//       const foundedUser = ccUsers.find((cc) => cc.assigneeIdOrCode === userId);

//       let theUser: CCUserCompleteUserType = {
//         routeFromUserId: currenUserId ?? "",
//         routeFromOrganizationUnitDTO: task?.inboundRecipientOrgUnitCode ?? "",
//         routingUrgnecyLevelPicklistCode:
//           formValues.routingUrgnecyLevelPicklistCode ?? "",
//         corrId: task?.corrId ?? "",
//         parentRoutingId: task?.parentRoutingId ? task.parentRoutingId : null,
//         requiredActionPicklistCode: "Req-Act For Info",
//         routeToUserId: null,
//         routeToOrganizationUnitDTO: null,
//         routingComment: "",
//       };

//       if (foundedUser) {
//         if (foundedUser.orgunitPrincipal) {
//           theUser.routeToOrganizationUnitDTO = foundedUser.assigneeIdOrCode;
//         } else {
//           theUser.routeToUserId = foundedUser.assigneeIdOrCode;
//         }
//       }

//       return theUser;
//     });

//     const payLoad: CompleteTaskType = {
//       correspondenceDTO: details as CorrespondenceDetailType,
//       genericActionDTO: {
//         taskName: task?.taskKey ?? "",
//         action: "1",
//         readReceipt: readReceipt,
//         ccUser: filteredValue,
//         changedUrgencyPicklistCode: formValues.routingUrgnecyLevelPicklistCode,
//       },
//     };

//     const response = await completeTaskAction(task?.taskId ?? "", payLoad);

//     if (response.status === HttpStatus.SUCCESS) {
//       setLoadAction(false);
//       message.success(labels.msg.task_completed);
//       navigate(-2);
//     } else {
//       // for failure
//     }
//     setLoadAction(false);
//   };

//   return (
//     <Modal
//       open={visible}
//       onCancel={onClose}
//       onClose={onClose}
//       title={
//         <>
//           <SendOutlined style={iconStyle} />
//           {labels.lbl.route}
//         </>
//       }
//       centered
//       width={900}
//       footer={<></>}
//     >
//       <CreateRoute
//         ccUsers={ccUsers}
//         control={control}
//         reqActions={reqActions}
//         routingList={routingList}
//         reset={reset}
//         route={selectedRouting}
//         sendCCPayload={sendCCPayload}
//         updateSendCCPayLoad={setSendCCPayload}
//         submitClicked={submitClicked}
//         cancelClicked={() => {
//           setSelectedRouting(undefined);
//           if (routings.length > 0) {
//             reset({
//               routingUrgnecyLevelPicklistCode:
//                 routings[0].routingUrgnecyLevelPicklistCode,
//             });
//           }
//         }}
//         lockUrgencyLevel={lockUrgencyLevel}
//         urgencyLevel={formValues.routingUrgnecyLevelPicklistCode}
//       />
//       <Col
//         span={24}
//         style={{
//           borderRadius: "2px",
//           marginTop: 20,
//           border: "1px solid #cbcbcb",
//         }}
//       >
//         <Table<RoutingListType>
//           showSorterTooltip
//           sortDirections={["ascend", "descend"]}
//           columns={columns}
//           dataSource={routings}
//           style={{ marginTop: 15, width: "100%" }}
//           loading={loading}
//           rowKey="routingId"
//           pagination={false}
//           scroll={{ x: "max-content" }}
//         />
//       </Col>
//       <Col
//         span={24}
//         style={{ marginTop: 20, display: "flex", alignItems: "center" }}
//       >
//         <Checkbox
//           checked={readReceipt}
//           onChange={(e) => setReadReceipt(e.target.checked)}
//         >
//           {labels.lbl.read_receipt}
//         </Checkbox>
//         <Tooltip title={labels.msg.hint_readReceipt}>
//           <InfoCircleFilled />
//         </Tooltip>
//       </Col>
//       <Col
//         style={{
//           marginTop: 30,
//           marginBottom: 20,
//           display: "flex",
//           justifyContent: "flex-end",
//         }}
//       >
//         <Button type="primary" onClick={completeTask} loading={loadAction}>
//           {!loadAction && <SendOutlined />}
//           {labels.btn.complete_task}
//         </Button>
//       </Col>
//     </Modal>
//   );
// }
