// import { Button, Col, Form, Row } from "antd";
// import { ChangeEvent, useEffect, useState } from "react";

// import { MaterialSelect } from "../../../../../../../../components/ui/dropdown/material-dropdown";
// import { MultiSelectDropdown } from "../../../../../../../../components/ui/dropdown/multi-select-dropdown";
// import { Control, Controller, UseFormReset, useWatch } from "react-hook-form";
// import { MaterialInput } from "../../../../../../../../components/ui/material-input";
// import { CloseOutlined, EditFilled, PlusOutlined } from "@ant-design/icons";
// import { useLanguage } from "../../../../../../../../context/language";
// import {
//   CCUserType,
//   CreateRouteType,
//   RoutingListType,
// } from "../../../../../../types";
// import { PickListItemType } from "../../../../../../../pick-lists/service";
// import { PickListHelper } from "../../../../../../../../components/functional/picklists";
// import { RouteItemTypes } from "../..";

// interface CreateRouteProps {
//   route?: RoutingListType;
//   routingList: CCUserType[];
//   ccUsers: CCUserType[];
//   control: Control<CreateRouteType>;
//   reqActions: PickListItemType[];
//   reset: UseFormReset<CreateRouteType>;
//   sendCCPayload: RouteItemTypes;
//   updateSendCCPayLoad: (value: RouteItemTypes) => void;
//   submitClicked: () => void;
//   cancelClicked: () => void;
//   lockUrgencyLevel?: boolean;
//   urgencyLevel?: string;
// }

// export default function CreateRoute({
//   route,
//   ccUsers,
//   routingList,
//   control,
//   reqActions,
//   reset,
//   sendCCPayload,
//   updateSendCCPayLoad,
//   submitClicked,
//   cancelClicked,
//   lockUrgencyLevel = false,
//   urgencyLevel,
// }: CreateRouteProps) {
//   const { labels } = useLanguage();
//   const [urgLevel, setUrgLevel] = useState<PickListItemType[]>([]);
//   const formValues = useWatch({ control });

//   useEffect(() => {
//     init();
//   }, []);

//   const init = async () => {
//     await getAllUrgLvlPickLists();
//   };

//   const getAllUrgLvlPickLists = async () => {
//     const response = await PickListHelper.urgencyLevel();

//     setUrgLevel(response);
//   };

//   useEffect(() => {
//     reset({
//       requiredActionPicklistCode: route?.requiredActionPicklistCode,
//       routingComment: route?.routingComment,
//       routingUrgnecyLevelPicklistCode:
//         urgencyLevel ?? route?.routingUrgnecyLevelPicklistCode,
//     });
//     const cloned = { ...sendCCPayload };
//     // cloned.ccList = route.;
//     cloned.routeTo = route?.routeToOrganizationUnitDTO
//       ? [route?.routeToOrganizationUnitDTO]
//       : route?.routeToUserId
//       ? [route?.routeToUserId]
//       : [];

//     updateSendCCPayLoad(cloned);
//   }, [route]);

//   return (
//     <Form name="create-route" layout="vertical">
//       <Col style={{ marginTop: 30, position: "relative" }}>
//         <Controller
//           name="routingUrgnecyLevelPicklistCode"
//           control={control}
//           render={({ field }) => (
//             <>
//               <MaterialSelect
//                 label={labels.lbl.change_urgency + " *"}
//                 value={field.value ?? urgencyLevel}
//                 options={urgLevel.map((pl) => {
//                   return {
//                     label: pl.picklistEnLabel,
//                     value: pl.picklistCode,
//                   };
//                 })}
//                 onChange={(value: string) => field.onChange(value)}
//               />
//               {lockUrgencyLevel && (
//                 <Col
//                   style={{
//                     height: "100%",
//                     width: "100%",
//                     position: "absolute",
//                     top: 0,
//                     left: 0,
//                     cursor: "not-allowed",
//                   }}
//                 ></Col>
//               )}
//             </>
//           )}
//         />
//       </Col>
//       <Col style={{ marginTop: 20 }}>
//         <MultiSelectDropdown
//           label={labels.lbl.cc_list}
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
//             updateSendCCPayLoad(cloned);
//           }}
//         />
//       </Col>
//       <Row gutter={10}>
//         <Col span={8} style={{ marginTop: 20 }}>
//           <MultiSelectDropdown
//             label={labels.lbl.route_to + " *"}
//             options={routingList.map((res) => {
//               return {
//                 label: res.enDescription,
//                 value: res.assigneeIdOrCode,
//               };
//             })}
//             value={sendCCPayload.routeTo}
//             onChange={(value) => {
//               const cloned = { ...sendCCPayload };
//               cloned.routeTo = value;
//               updateSendCCPayLoad(cloned);
//             }}
//           />
//         </Col>
//         <Col span={8} style={{ marginTop: 25 }}>
//           <Controller
//             name="requiredActionPicklistCode"
//             control={control}
//             render={({ field }) => (
//               <MaterialSelect
//                 label={labels.lbl.reqired_action + " *"}
//                 value={field.value}
//                 options={reqActions.map((pl) => {
//                   return {
//                     label: pl.picklistEnLabel,
//                     value: pl.picklistCode,
//                   };
//                 })}
//                 onChange={(value: string) => {
//                   field.onChange(value);
//                 }}
//               />
//             )}
//           />
//         </Col>
//         <Col span={8} style={{ marginTop: 25 }}>
//           <Controller
//             name="routingComment"
//             control={control}
//             render={({ field }) => (
//               <MaterialInput
//                 label={labels.lbl.route_comment}
//                 value={field.value}
//                 onChange={(e: ChangeEvent<HTMLInputElement>) => {
//                   field.onChange(e.target.value);
//                 }}
//               />
//             )}
//           />
//         </Col>
//       </Row>
//       <Col
//         style={{
//           marginTop: 30,
//           marginBottom: 20,
//           display: "flex",
//           justifyContent: "flex-end",
//         }}
//       >
//         {route ? (
//           <>
//             <Button
//               type="text"
//               onClick={cancelClicked}
//               disabled={
//                 !(
//                   formValues.requiredActionPicklistCode &&
//                   sendCCPayload.routeTo.length > 0
//                 )
//               }
//             >
//               <CloseOutlined />
//               {labels.btn.cancel}
//             </Button>
//             <Button
//               type="primary"
//               onClick={submitClicked}
//               disabled={
//                 !(
//                   formValues.requiredActionPicklistCode &&
//                   sendCCPayload.routeTo.length > 0
//                 )
//               }
//             >
//               <EditFilled />
//               {labels.btn.edit}
//             </Button>
//           </>
//         ) : (
//           <Button
//             type="primary"
//             onClick={submitClicked}
//             disabled={
//               !(
//                 formValues.requiredActionPicklistCode &&
//                 sendCCPayload.routeTo.length > 0
//               )
//             }
//           >
//             <PlusOutlined />
//             {labels.btn.add_new}
//           </Button>
//         )}
//       </Col>
//     </Form>
//   );
// }
