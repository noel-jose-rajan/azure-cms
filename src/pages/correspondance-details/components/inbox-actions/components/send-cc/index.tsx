// import { Button, Col, Modal } from "antd";
// import { useLanguage } from "../../../../../../context/language";
// import { CloseOutlined, SendOutlined } from "@ant-design/icons";
// import { MaterialInput } from "../../../../../../components/ui/material-input";
// import { CSSProperties, ChangeEvent, useEffect, useState } from "react";
// import { PickListItemType } from "../../../../../pick-lists/service";
// import { PickListHelper } from "../../../../../../components/functional/picklists";
// import { MaterialSelect } from "../../../../../../components/ui/dropdown/material-dropdown";
// import {
//   CCUserCompleteUserType,
//   CCUserType,
//   CompleteTaskType,
//   CorrespondenceDetailType,
//   InboxTaskType,
// } from "../../../../types";
// import { getCCUsers } from "../../../../service";
// import { HttpStatus } from "../../../../../../components/functional/httphelper";
// import { MultiSelectDropdown } from "../../../../../../components/ui/dropdown/multi-select-dropdown";
// import Storage from "../../../../../../lib/storage";
// import LOCALSTORAGE from "../../../../../../constants/local-storage";
// import { useNavigate } from "react-router-dom";

// interface SendCCProps {
//   visible: boolean;
//   onClose: () => void;
//   details?: CorrespondenceDetailType;
//   task?: InboxTaskType;
// }

// export default function SendCC({
//   visible,
//   onClose,
//   details,
//   task,
// }: SendCCProps) {
//   const { labels, isEnglish } = useLanguage();
//   const [urgLevel, setUrgLevel] = useState<PickListItemType[]>([]);
//   const [ccUsers, setCCUsers] = useState<CCUserType[]>([]);
//   const [sendCCPayload, setSendCCPayload] = useState<{
//     urgLvlPickListCode: string;
//     ccList: string[];
//     comments: string;
//   }>({ urgLvlPickListCode: "", ccList: [], comments: "" });
//   const [loading, setLoading] = useState<boolean>(false);
//   const navigate = useNavigate();

//   useEffect(() => {
//     if (details) {
//       const cloned = { ...sendCCPayload };
//       cloned.urgLvlPickListCode = details.urgencyPickListCode;
//       setSendCCPayload(cloned);
//     }
//   }, [details]);

//   useEffect(() => {
//     init();
//   }, []);

//   const init = async () => {
//     await getCCUserList();
//     await getAllUrgLvlPickLists();
//   };

//   const getAllUrgLvlPickLists = async () => {
//     const response = await PickListHelper.urgencyLevel();

//     setUrgLevel(response);
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

//   const iconStyle: CSSProperties = {
//     marginLeft: isEnglish ? 0 : 10,
//     marginRight: isEnglish ? 10 : 0,
//   };

//   const completeTask = async () => {
//     setLoading(true);
//     const currenUserId = await Storage.getItem<string>(
//       LOCALSTORAGE.LEGACY_USER_ID
//     );

//     const filteredValue = sendCCPayload.ccList.map((userId) => {
//       const foundedUser = ccUsers.find((cc) => cc.assigneeIdOrCode === userId);

//       let theUser: CCUserCompleteUserType = {
//         routeFromUserId: currenUserId ?? "",
//         routeFromOrganizationUnitDTO: task?.inboundRecipientOrgUnitCode ?? "",
//         routingUrgnecyLevelPicklistCode: sendCCPayload.urgLvlPickListCode,
//         corrId: task?.corrId ?? "",
//         parentRoutingId: task?.parentRoutingId ? task.parentRoutingId : null,
//         requiredActionPicklistCode: "Req-Act For Info",
//         routeToUserId: null,
//         routeToOrganizationUnitDTO: null,
//         routingComment: sendCCPayload.comments,
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
//         action: "4",
//         ccUser: filteredValue,
//         changedUrgencyPicklistCode: sendCCPayload.urgLvlPickListCode,
//         readReceipt: false,
//         taskName: task?.taskKey ?? "",
//       },
//     };

//     console.log("the payLoad", payLoad);

//     // const response = await completeTaskAction(task?.taskId ?? "", payLoad);

//     // if (response.status === HttpStatus.SUCCESS) {
//     navigate(-2);
//     // } else {
//     //   // for failure
//     // }

//     setLoading(false);
//     onClose();
//   };

//   return (
//     <Modal
//       open={visible}
//       onCancel={onClose}
//       onClose={onClose}
//       title={
//         <>
//           <SendOutlined style={iconStyle} />
//           {labels.lbl.send_task_to_cc}
//         </>
//       }
//       centered
//       width={600}
//       footer={<></>}
//     >
//       <Col style={{ marginTop: 30 }}>
//         <MaterialSelect
//           label={labels.lbl.change_urgency + " *"}
//           value={sendCCPayload.urgLvlPickListCode}
//           options={urgLevel.map((pl) => {
//             return {
//               label: pl.picklistEnLabel,
//               value: pl.picklistCode,
//             };
//           })}
//           onChange={(value: string) => {
//             const cloned = { ...sendCCPayload };
//             cloned.urgLvlPickListCode = value;
//             setSendCCPayload(cloned);
//           }}
//         />
//       </Col>
//       <Col style={{ marginTop: 20 }}>
//         <MultiSelectDropdown
//           label={labels.lbl.cc_list + " *"}
//           options={ccUsers.map((res) => {
//             return {
//               label: res.enDescription,
//               value: res.assigneeIdOrCode,
//             };
//           })}
//           value={sendCCPayload.ccList}
//           onChange={(value) => {
//             const cloned = { ...sendCCPayload };
//             cloned.ccList = value;
//             setSendCCPayload(cloned);
//           }}
//         />
//       </Col>
//       <Col style={{ marginTop: 20 }}>
//         <MaterialInput
//           label={labels.lbl.comment + " *"}
//           value={sendCCPayload.comments}
//           onChange={(e: ChangeEvent<HTMLInputElement>) => {
//             const cloned = { ...sendCCPayload };
//             cloned.comments = e.target.value;
//             setSendCCPayload(cloned);
//           }}
//         />
//       </Col>
//       <Col
//         style={{
//           marginTop: 30,
//           marginBottom: 20,
//           display: "flex",
//           justifyContent: "flex-end",
//         }}
//       >
//         <Button style={{ marginLeft: 10, marginRight: 10 }} onClick={onClose}>
//           <CloseOutlined />
//           {labels.btn.cancel}
//         </Button>
//         <Button type="primary" onClick={completeTask} loading={loading}>
//           {!loading && <SendOutlined />}
//           {labels.btn.complete_task}
//         </Button>
//       </Col>
//     </Modal>
//   );
// }
