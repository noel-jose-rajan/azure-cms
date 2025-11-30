import {
  Button,
  Col,
  Row,
  Table,
  TableColumnsType,
  TableProps,
  message,
} from "antd";
import { CSSProperties, useEffect, useState } from "react";
import {
  DeleteFilled,
  DownloadOutlined,
  FileExcelFilled,
  FileImageOutlined,
  FilePdfFilled,
  FileTextOutlined,
  FileUnknownOutlined,
  FileWordFilled,
  FileZipOutlined,
} from "@ant-design/icons";
import { useLanguage } from "../../../../../../context/language";
import { useTheme } from "../../../../../../context/theme";
import TitleHeader from "../../../../../../components/ui/header";

import ActionMenuItem from "../../../../../../components/ui/menu-item";
import ModalComponent from "../../../../../../components/ui/modal";
import UpdateElectronicAttachment from "./components/edit-electronic-attachment";
import UploadNewVersion from "./components/upload-new-version";
import CreateElectronicAttachment from "./components/create-electronic-attachment";
import {
  deleteElectronicAttachment,
  downloadElectronicAttachment,
  getAttachmentById,
} from "../../service";
import usePicklist from "@/store/picklists/use-picklist";
import { ElectronicAttachment } from "../../schema";
import moment from "moment";
import TableComponent from "@/components/ui/table-component";

const getFileIcon = (ext: string) => {
  switch (ext?.toLowerCase()) {
    case ".pdf":
      return <FilePdfFilled style={{ color: "#e74c3c" }} />; // Red
    case ".doc":
    case ".docx":
      return <FileWordFilled style={{ color: "#2b579a" }} />; // Blue
    case ".xls":
    case ".xlsx":
      return <FileExcelFilled style={{ color: "#217346" }} />; // Green
    case ".txt":
      return <FileTextOutlined style={{ color: "#616161" }} />; // Gray
    case ".jpg":
    case ".jpeg":
    case ".png":
    case ".gif":
    case ".bmp":
    case ".webp":
      return <FileImageOutlined style={{ color: "blue" }} />; // Yellow
    case ".zip":
    case ".rar":
    case ".7z":
      return <FileZipOutlined style={{ color: "#f39c12" }} />; // Orange
    default:
      return <FileUnknownOutlined style={{ color: "#bdbdbd" }} />; // Light gray
  }
};
interface CorrespondenceAttachmentsProps {
  corrId?: string;
  canEdit?: boolean;
  fromTab?: boolean;
  isInbound?: boolean;
}

export default function ElectronicAttachments({
  corrId,
  canEdit = false,
  fromTab = false,
  isInbound = false,
}: CorrespondenceAttachmentsProps) {
  const { getPicklistById } = usePicklist();
  const [electronicAttachment, setElectronicAttachments] = useState<
    ElectronicAttachment[]
  >([]);
  const { labels, isEnglish } = useLanguage();
  const { theme } = useTheme();
  const [loading, setLoading] = useState<boolean>(false);
  const [visibleHistory, setVisibleHistory] = useState<boolean>(false);
  const [selectRows, setSelectedRows] = useState<ElectronicAttachment[]>([]);
  const [openAdd, setOpenAdd] = useState<boolean>(false);
  const [openEdit, setOpenEdit] = useState<boolean>(false);
  const [deletedID, setDeletedID] = useState<number | null>(null);
  // const [openNewVersion, setOpenNewVersion] = useState<boolean>(false);
  // const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  useEffect(() => {
    init();
  }, [corrId]);

  const init = async () => {
    if (corrId) {
      await fetchAllElectronicsAttachments(corrId);
    }
  };

  const fetchAllElectronicsAttachments = async (id: string) => {
    setLoading(true);
    const response = await getAttachmentById(id);

    if (response) {
      setElectronicAttachments(response);
    } else {
      setElectronicAttachments([]);
    }
    setLoading(false);
  };

  // const rowSelection: TableProps<ElectronicAttachment>["rowSelection"] = {
  //   type: "radio",
  //   selectedRowKeys,
  //   onChange: (keys: React.Key[], rows: ElectronicAttachment[]) => {
  //     const [selectedKey] = keys;
  //     const [selectedStamp] = rows;
  //     setSelectedRowKeys(selectedKey ? [selectedKey] : []);
  //     setSelectedRows(selectedStamp ? [selectedStamp] : []);
  //   },
  // renderCell: (checked, record) => {
  //   return (
  //     <Checkbox
  //       checked={checked}
  //       onChange={() => {
  //         const isSelected = selectedRowKeys.includes(
  //           record.electronicAttachmentId
  //         );

  //         if (isSelected) {
  //           setSelectedRowKeys([]);
  //           setSelectedRows([]);
  //         } else {
  //           setSelectedRowKeys([record.electronicAttachmentId]);
  //           setSelectedRows([record]);
  //         }
  //       }}
  //     />
  //   );
  // },
  // };

  const columns: TableColumnsType<ElectronicAttachment> = [
    {
      ellipsis: true,
      title: labels.tbl.name,
      dataIndex: "AttachmentName",
      render: (text: string) => (
        <a style={{ color: theme.colors.primary, maxWidth: 200 }}>{text}</a>
      ),
      width: 200,
      sorter: {
        compare: (a, b) =>
          (b.AttachmentName ?? "")
            .toLowerCase()
            .localeCompare((a.AttachmentName ?? "").toLowerCase()),
        multiple: 3,
      },
    },
    {
      title: isEnglish ? "File Extension" : "امتداد الملف",
      dataIndex: "FileExtension",
      render: (text: string) => (
        <a style={{ color: theme.colors.primary, maxWidth: 200 }}>
          {getFileIcon(text)}
        </a>
      ),
      width: 120,
    },
    {
      title: labels.tbl.document_type,
      dataIndex: "DocumentTypeID",
      render: (id: string) => {
        const p = getPicklistById("Document Type", id);

        return (
          <a style={{ color: theme.colors.primary }}>
            {(isEnglish ? p?.picklist_en_label : p?.picklist_ar_label) || "-"}
          </a>
        );
      },
      // sorter: {
      //   compare: (a, b) =>
      //     b.documentTypePickListCode.localeCompare(a.documentTypePickListCode),
      //   multiple: 3,
      // },
      width: 120,
    },
    {
      title: labels.tbl.description,
      dataIndex: "Description",
      render: (text: string) => (
        <a style={{ color: theme.colors.primary }}>{text || "-"}</a>
      ),
      // sorter: {
      //   compare: (a, b) => b.description.localeCompare(a.description),
      //   multiple: 3,
      // },
      width: 120,
    },
    {
      title: labels.tbl.att_last_modifier,
      dataIndex: "CreatedBy",
      render: (text) => (
        <a style={{ color: theme.colors.primary }}>{text ?? "-"}</a>
      ),
      // sorter: {
      //   compare: (a, b) => b.ownerDescription.localeCompare(a.ownerDescription),
      //   multiple: 3,
      // },
      width: 120,
    },
    {
      width: 200,
      title: labels.tbl.att_last_modify_date,
      dataIndex: "CreatedAt",
      render: (text) => (
        <a style={{ color: theme.colors.primary }}>
          {moment(text).format("MM-DD-YYYY HH:mm:ss") ?? "-"}
        </a>
      ),
      sorter: {
        compare: (a, b) => b.CreatedAt.localeCompare(a.CreatedAt),
        multiple: 3,
      },
    },
    {
      title: labels.tbl.action,
      dataIndex: "ID",
      width: canEdit ? 100 : 75,
      render: (id, record) => (
        <div style={{ display: "flex", gap: 0 }}>
          {canEdit && !isInbound && (
            <Button
              type="link"
              size="small"
              danger
              onClick={() => setDeletedID(id)}
            >
              <DeleteFilled />
            </Button>
          )}
          <Button
            type="link"
            size="small"
            onClick={() => handleDownloadElectronicAttachment(record)}
          >
            <DownloadOutlined />
          </Button>
        </div>
      ),
      // sorter: {
      //   compare: (a, b) =>
      //     DateHelper.getTime(b.createdDate) - DateHelper.getTime(a.createdDate),
      //   multiple: 3,
      // },
    },
  ];
  const handleDownloadElectronicAttachment = async (
    attachment: ElectronicAttachment
  ) => {
    if (!attachment) return;
    try {
      await downloadElectronicAttachment(
        attachment.ID.toString(),
        attachment.AttachmentName,
        attachment.FileExtension
      );
    } catch (error) {
      message.error(
        isEnglish
          ? "Something went wrong! Please contact your system administrator"
          : "حدث خطأ ما، يرجى الاتصال بمسؤول النظام"
      );
    }
  };

  // const downLoadAllDocuments = async () => {
  //   // setFullPageLoading(true);
  //   // if (!corrId) return;
  //   // const response = await downloadAllElectronicAttachment(corrId);
  //   // if (!response) {
  //   // }
  //   // setFullPageLoading(false);
  // };

  const deleteAttachment = async () => {
    try {
      if (!deletedID) return;
      setLoading(true);
      if (!corrId) return;
      const response = await deleteElectronicAttachment(deletedID ?? 0);
      if (response) {
        await fetchAllElectronicsAttachments(corrId);

        setDeletedID(null);
        // setSelectedRowKeys([]);
        // setSelectedRows([]);
      } else {
        message.error(
          isEnglish
            ? "Something went wrong! Please contact your system administrator"
            : "حدث خطأ ما، يرجى الاتصال بمسؤول النظام"
        );
      }
    } catch (error) {
      message.error(
        isEnglish
          ? "Something went wrong! Please contact your system administrator"
          : "حدث خطأ ما، يرجى الاتصال بمسؤول النظام"
      );
    } finally {
      setLoading(false);
    }
  };

  const iconStyle: CSSProperties = {
    marginRight: isEnglish ? 10 : 0,
    marginLeft: isEnglish ? 0 : 10,
  };

  const fromTabStyle: CSSProperties = !fromTab
    ? {
        flexDirection: isEnglish ? "row" : "row-reverse",
      }
    : {
        flexDirection: "row",
        justifyContent: "start",
      };
  return (
    <Row style={{ width: "100%" }}>
      <TitleHeader
        heading={labels.til.electronic_attachment}
        icon={<FileTextOutlined />}
        applyReverse={!fromTab}
      />
      <Col
        span={24}
        style={{
          borderRadius: "2px",
          marginTop: 20,
          border: "1px solid #cbcbcb",
        }}
      >
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            ...fromTabStyle,
          }}
        >
          {canEdit && (
            <>
              <ActionMenuItem
                onClick={() => setOpenAdd(true)}
                isActive
                label={labels.btn.create}
                type="add"
              />

              {/* <ActionMenuItem
                onClick={() => setOpenEdit(true)}
                // isActive={selectRows.length === 1}
                label={labels.btn.edit}
                type="edit"
              /> */}

              {/* <ActionMenuItem
                onClick={() => setOpenDelete(true)}
                isActive={selectedRowKeys.length === 1}
                label={labels.btn.delete}
                type="delete"
              /> */}

              {/* <ActionMenuItem
                onClick={() => setOpenNewVersion(true)}
                // isActive={
                //   selectRows.length === 1 && selectRows[0].isDeleted === false
                // }
                label={labels.btn.uploadNewVersion}
                type="upload"
              /> */}
            </>
          )}
          {/* <ActionMenuItem
            onClick={downloadHistory}
            isActive={selectRows.length === 1}
            label={labels.btn.download}
            type="download"
          /> */}
          {/* <ActionMenuItem
            onClick={downLoadAllDocuments}
            // isActive
            label={labels.btn.downloadAll}
            type="download"
          /> */}
          {/* <ActionMenuItem
            onClick={() => setVisibleHistory(true)}
            // isActive={selectRows.length === 1 && canView}
            label={labels.btn.viewHistory}
            type="history"
          /> */}
        </div>

        <TableComponent<ElectronicAttachment>
          sortDirections={["ascend", "descend"]}
          columns={columns}
          dataSource={electronicAttachment}
          style={{ marginTop: 15, width: "100%" }}
          loading={loading}
          rowKey="ID"
          // rowSelection={rowSelection}
          scroll={{ x: "max-content" }}
          // rowClassName={(record) =>
          //   record.isDeleted ? "deleted-e-attachment-row" : ""
          // }
          // pagination={{
          //   size: "small",
          //   showTotal: () =>
          //     `${isEnglish ? "Total" : "المجموع"} ${
          //       electronicAttachment?.length
          //     } ${isEnglish ? "items" : "أغراض"}`,
          //   showSizeChanger: true,
          //   defaultPageSize: 5,
          //   pageSizeOptions: [5, 10],
          //   style: { marginRight: 10 },
          //   showQuickJumper: true,
          //   total: electronicAttachment?.length,
          //   locale: {
          //     jump_to: isEnglish ? "Go to" : "اذهب الى",
          //     page: isEnglish ? "Page" : "صفحة",
          //     prev_page: isEnglish ? "Previous" : "خلف",
          //     next_page: isEnglish ? "Next" : "التالي",
          //     items_per_page: isEnglish ? "/ Page" : "/ صفحة",
          //   },
          // }}
          pageSize={5}
        />
      </Col>
      {/* {visibleHistory && (
        <HistoryModal
          visible={visibleHistory}
          onClose={() => setVisibleHistory(false)}
          correspondenceId={corrId}
          attachmentId={
            selectRows.length > 0
              ? selectRows[0].ID.toString()
              : ""
          }
          attachment={selectRows.length > 0 ? selectRows[0] : undefined}
          needDownload
        />
      )} */}
      {openAdd && (
        <CreateElectronicAttachment
          open={openAdd}
          onClose={() => setOpenAdd(false)}
          corrId={corrId}
          onSubmit={async () => {
            await fetchAllElectronicsAttachments(corrId ?? "");
            setOpenAdd(false);
          }}
        />
      )}
      {/* //{openEdit && (
        // <UpdateElectronicAttachment
        //   open={openEdit}
        //   onClose={() => setOpenEdit(false)}
        //   corrId={corrId}
        //   onSubmit={async () => {
        //     if (corrId) {
        //       await fetchAllElectronicsAttachments(corrId);
        //     }
        //     setOpenEdit(false);
        //   }}
        //   attachment={selectRows[0]}
        // />
     // )} */}
      <ModalComponent
        title={
          <>
            <DeleteFilled style={iconStyle} />
            {labels.btn.delete}
          </>
        }
        loading={loading}
        description={labels.msg.if_delete_attachment}
        visible={deletedID !== null}
        onClose={() => setDeletedID(null)}
        onSubmit={deleteAttachment}
        okText={labels.btn.delete}
      />
      {/* {openNewVersion && (
        <UploadNewVersion
          visible={openNewVersion}
          onClose={() => setOpenNewVersion(false)}
          activateLoader={setFullPageLoading}
          attachment={selectRows[0]}
        />
      )}  */}
    </Row>
  );
}
