// import { Col, Row, Table, TableColumnsType, TableProps } from "antd";
// import { useEffect, useState } from "react";
// import { FileTextOutlined } from "@ant-design/icons";
// import {
//   CorrespondenceDetailType,
//   ElectronicAttachmentType,
// } from "../../../../types";
// import { useLanguage } from "../../../../../../context/language";
// import { useTheme } from "../../../../../../context/theme";
// import {
//   downloadAllElectronicAttachment,
//   downloadElectronicAttachment,
//   getElectronicAttachmentsOfCorrespondence,
// } from "../../../../service";
// import TitleHeader from "../../../../../../components/ui/header";
// import { PickListItemType } from "../../../../../pick-lists/service";
// import { PickListHelper } from "../../../../../../components/functional/picklists";
// import ActionMenuItem from "../../../../../../components/ui/menu-item";
// import HistoryModal from "../history";
// import LoaderComponent from "../../../../../../components/ui/loader";

// interface CorrespondenceAttachmentsProps {
//   details?: CorrespondenceDetailType;
//   canView: boolean;
// }

// export default function ElectronicAttachments({
//   details,
//   canView,
// }: CorrespondenceAttachmentsProps) {
//   const [electronicAttachment, setElectronicAttachments] = useState<
//     ElectronicAttachmentType[]
//   >([]);
//   const { labels, isEnglish } = useLanguage();
//   const { theme } = useTheme();
//   const [loading, setLoading] = useState<boolean>(false);
//   const [docTypes, setDocTypes] = useState<PickListItemType[]>([]);
//   const [visibleHistory, setVisibleHistory] = useState<boolean>(false);
//   const [selectRows, setSelectedRows] = useState<ElectronicAttachmentType[]>(
//     []
//   );
//   const [fullPageLoading, setFullPageLoading] = useState<boolean>(false);

//   useEffect(() => {
//     init();
//   }, [details]);

//   const init = async () => {
//     if (details) {
//       await fetchCorrespondenceHistory(details.corrId);
//     }

//     await getPickListValues();
//   };

//   const getPickListValues = async () => {
//     const plVal = await PickListHelper.documentType();

//     setDocTypes(plVal);
//   };

//   const getDocTypeValue = (value: string) => {
//     const val = docTypes.find((pl) => pl.picklistCode === value);

//     if (val) {
//       return isEnglish ? val.picklistEnLabel : val.picklistArLabel;
//     }

//     return "-";
//   };

//   const fetchCorrespondenceHistory = async (id: string) => {
//     setLoading(true);
//     const response = await getElectronicAttachmentsOfCorrespondence(id);

//     if (response) {
//       setElectronicAttachments(response);
//     }
//     setLoading(false);
//   };

//   const rowSelection: TableProps<ElectronicAttachmentType>["rowSelection"] = {
//     onChange: (_: React.Key[], _selectedRows: ElectronicAttachmentType[]) => {
//       setSelectedRows(_selectedRows);
//     },
//   };

//   const columns: TableColumnsType<ElectronicAttachmentType> = [
//     {
//       title: labels.tbl.name,
//       dataIndex: "name",
//       render: (text: string) => (
//         <a style={{ color: theme.colors.primary }}>{text}</a>
//       ),
//     },
//     {
//       title: labels.tbl.document_type,
//       dataIndex: "documentTypePickListCode",
//       render: (text: string) => (
//         <a style={{ color: theme.colors.primary }}>
//           {text ? getDocTypeValue(text) : "-"}
//         </a>
//       ),
//       sorter: {
//         compare: (a, b) =>
//           b.documentTypePickListCode.localeCompare(a.documentTypePickListCode),
//         multiple: 3,
//       },
//     },
//     {
//       title: labels.tbl.description,
//       dataIndex: "description",
//       render: (text: string) => (
//         <a style={{ color: theme.colors.primary }}>{text ?? "-"}</a>
//       ),
//       sorter: {
//         compare: (a, b) => b.description.localeCompare(a.description),
//         multiple: 3,
//       },
//     },
//     {
//       title: labels.tbl.att_last_modifier,
//       dataIndex: "ownerDescription",
//       render: (text) => (
//         <a style={{ color: theme.colors.primary }}>{text ?? "-"}</a>
//       ),
//       sorter: {
//         compare: (a, b) => b.ownerDescription.localeCompare(a.ownerDescription),
//         multiple: 3,
//       },
//     },
//     {
//       title: labels.tbl.att_last_modify_date,
//       dataIndex: "createdDate",
//       render: (text) => (
//         <a style={{ color: theme.colors.primary }}>
//           {text ? text.replaceAll("-", "/") : "-"}
//         </a>
//       ),
//       sorter: {
//         compare: (a, b) => b.createdDate.localeCompare(a.createdDate),
//         multiple: 3,
//       },
//     },
//   ];

//   const downloadHistory = async () => {
//     setFullPageLoading(true);
//     if (selectRows.length === 0) return;
//     const response = await downloadElectronicAttachment(
//       selectRows[0].electronicAttachmentId.toString(),
//       selectRows[0]
//     );

//     if (!response) {
//     }
//     setFullPageLoading(false);
//   };

//   const downLoadAllDocuments = async () => {
//     setFullPageLoading(true);

//     if (!details) return;

//     const response = await downloadAllElectronicAttachment(details.corrId);

//     if (!response) {
//     }
//     setFullPageLoading(false);
//   };

//   return (
//     <Row style={{ width: "100%" }}>
//       <TitleHeader
//         heading={labels.til.electronic_attachment}
//         icon={<FileTextOutlined />}
//       />
//       <Col
//         span={24}
//         style={{
//           borderRadius: "2px",
//           marginTop: 20,
//           border: "1px solid #cbcbcb",
//         }}
//       >
//         <div
//           style={{
//             flexDirection: isEnglish ? "row" : "row-reverse",
//             display: "flex",
//             flexWrap: "wrap",
//           }}
//         >
//           <ActionMenuItem
//             onClick={downloadHistory}
//             isActive={selectRows.length === electronicAttachment.length}
//             label={labels.btn.download}
//             type="download"
//           />
//           <ActionMenuItem
//             onClick={downLoadAllDocuments}
//             isActive={selectRows.length !== 0}
//             label={labels.btn.downloadAll}
//             type="download"
//           />

//           <ActionMenuItem
//             onClick={() => setVisibleHistory(true)}
//             isActive={selectRows.length === 1 && canView}
//             label={labels.btn.viewHistory}
//             type="history"
//           />
//         </div>
//         <Table<ElectronicAttachmentType>
//           showSorterTooltip
//           sortDirections={["ascend", "descend"]}
//           columns={columns}
//           dataSource={electronicAttachment}
//           style={{ marginTop: 15, width: "100%" }}
//           loading={loading}
//           rowKey="electronicAttachmentId"
//           pagination={false}
//           scroll={{ x: "max-content" }}
//           rowSelection={{ type: "checkbox", ...rowSelection }}
//         />
//       </Col>
//       {visibleHistory && (
//         <HistoryModal
//           visible={visibleHistory}
//           onClose={() => setVisibleHistory(false)}
//           correspondenceId={details?.corrId}
//           attachmentId={
//             selectRows.length > 0
//               ? selectRows[0].electronicAttachmentId.toString()
//               : ""
//           }
//           attachment={selectRows.length > 0 ? selectRows[0] : undefined}
//           needDownload
//         />
//       )}
//       <LoaderComponent loading={fullPageLoading} text={"Downloading..."} />
//     </Row>
//   );
// }
