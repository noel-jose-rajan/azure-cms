import { Button, Col, Row, TableColumnsType } from "antd";
import { CSSProperties, useEffect, useState } from "react";
import { useLanguage } from "../../../../../../context/language";
import { useTheme } from "../../../../../../context/theme";
import TitleHeader from "../../../../../../components/ui/header";
import { DeleteFilled, FileTextOutlined } from "@ant-design/icons";
import ActionMenuItem from "../../../../../../components/ui/menu-item";
import CreateNewPhysicalAttachment from "./components/create-new";
import ModalComponent from "../../../../../../components/ui/modal";
import {
  deletePhysicalAttachment,
  getPhysicalAttachmentById,
} from "../../service";
import { PhysicalAttachment } from "../../schema";
import moment from "moment";
import TableComponent from "@/components/ui/table-component";
import usePicklist from "@/store/picklists/use-picklist";

interface CorrespondenceAttachmentsProps {
  corrId?: string;
  canEdit?: boolean;
  fromTab?: boolean;
  isInbound?: boolean;
}

export default function PhysicalAttachments({
  corrId,
  canEdit,
  isInbound,
  fromTab = false,
}: CorrespondenceAttachmentsProps) {
  const [physicalAttachments, setPhysicalAttachments] = useState<
    PhysicalAttachment[]
  >([]);
  const { labels, isEnglish } = useLanguage();
  const { theme } = useTheme();
  const { getPicklistById } = usePicklist();
  const [loading, setLoading] = useState<boolean>(false);
  // const [visibleHistory, setVisibleHistory] = useState<boolean>(false);
  // const [selectRows, setSelectedRows] = useState<PhysicalAttachment[]>([]);
  const [openAdd, setOpenAdd] = useState<boolean>(false);
  // const [openEdit, setOpenEdit] = useState<boolean>(false);
  const [deletedID, setDeletedID] = useState<string | null>(null);
  // const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  useEffect(() => {
    if (corrId) {
      fetchAttachments(corrId);
    }
  }, [corrId]);

  const fetchAttachments = async (id: string) => {
    const response = await getPhysicalAttachmentById(id);

    if (response) {
      setPhysicalAttachments(response);
    }
  };

  const tableColumns: TableColumnsType<PhysicalAttachment> = [
    {
      width: 200,
      title: labels.tbl.name,
      ellipsis: true,
      dataIndex: "AttachmentName",
      render: (text: string) => (
        <a style={{ color: theme.colors.primary }}>{text}</a>
      ),
      sorter: {
        compare: (a, b) =>
          (b.AttachmentName ?? "")
            .toLowerCase()
            .localeCompare((a.AttachmentName ?? "").toLowerCase()),
        multiple: 3,
      },
    },
    {
      width: 150,
      ellipsis: true,
      title: labels.tbl.type,
      dataIndex: "AttachmentTypeID",
      render: (text: string) => {
        const p = getPicklistById("Physical Attachment Type", text);
        return (
          <a style={{ color: theme.colors.primary }}>
            {(isEnglish ? p?.picklist_en_label : p?.picklist_ar_label) || "-"}
          </a>
        );
      },
    },
    {
      width: 200,
      ellipsis: true,
      title: labels.tbl.description,
      dataIndex: "Description",
      render: (text: string) => (
        <a style={{ color: theme.colors.primary }}>{text}</a>
      ),
    },
    {
      width: 100,
      title: labels.tbl.quantity,
      dataIndex: "Quantity",
      render: (text: number) => (
        <a style={{ color: theme.colors.primary }}>{text ?? "-"}</a>
      ),
    },
    {
      title: labels.tbl.att_last_modifier,
      dataIndex: "CreatedBy",
      width: 150,
      ellipsis: true,
      render: (text) => (
        <a style={{ color: theme.colors.primary }}>{text ?? "-"}</a>
      ),
    },
    {
      title: labels.tbl.att_last_modify_date,
      dataIndex: "CreatedAt",
      width: 200,

      render: (text) => (
        <a style={{ color: theme.colors.primary }}>
          {moment(text).format("DD/MM/YYYY HH:mm:ss")}
        </a>
      ),
      sorter: {
        compare: (a, b) =>
          moment(b.CreatedAt).unix() - moment(a.CreatedAt).unix(),
        multiple: 3,
      },
    },
    {
      title: labels.tbl.action,
      dataIndex: "ID",
      width: 75,
      render: (id) => (
        <Button
          type="link"
          size="small"
          danger
          onClick={() => setDeletedID(id)}
        >
          <DeleteFilled />
        </Button>
      ),
      // sorter: {
      //   compare: (a, b) =>
      //     DateHelper.getTime(b.createdDate) - DateHelper.getTime(a.createdDate),
      //   multiple: 3,
      // },
    },
  ];

  // const rowSelection: TableProps<PhysicalAttachment>["rowSelection"] = {
  //   columnWidth: 50,
  //   type: "radio",
  //   selectedRowKeys,
  //   onChange: (keys: React.Key[], rows: PhysicalAttachment[]) => {
  //     const [selectedKey] = keys;
  //     const [selectedStamp] = rows;
  //     setSelectedRowKeys(selectedKey ? [selectedKey] : []);
  //     setSelectedRows(selectedStamp ? [selectedStamp] : []);
  //   },
  //   // renderCell: (checked, record) => {
  //   //   return (
  //   //     <Checkbox
  //   //       checked={checked}
  //   //       onChange={() => {
  //   //         const isSelected = selectedRowKeys.includes(
  //   //           record.physicalAttachmentId
  //   //         );

  //   //         if (isSelected) {
  //   //           setSelectedRowKeys([]);
  //   //           setSelectedRows([]);
  //   //         } else {
  //   //           setSelectedRowKeys([record.physicalAttachmentId]);
  //   //           setSelectedRows([record]);
  //   //         }
  //   //       }}
  //   //     />
  //   //   );
  //   // },
  // };
  const columns =
    canEdit && !isInbound ? tableColumns : tableColumns.slice(0, -1);
  const deleteAttachment = async () => {
    try {
      setLoading(true);
      if (corrId === undefined || !deletedID) return;
      const response = await deletePhysicalAttachment(deletedID);
      await fetchAttachments(corrId);
      setDeletedID(null);
    } catch (error) {
      console.error("Error deleting attachment:", error);
    } finally {
      setLoading(false);
    }
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
        applyReverse={!fromTab}
        heading={labels.til.physical_attachment}
        icon={<FileTextOutlined />}
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
            ...fromTabStyle,
            display: "flex",
            flexWrap: "wrap",
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
                // isActive={
                //   selectRows.length === 1
                // }
                label={labels.btn.attachment_edit}
                type="edit"
              /> */}

              {/* <ActionMenuItem
                onClick={() => setOpenDelete(true)}
                isActive={selectRows.length === 1}
                label={labels.btn.delete}
                type="delete"
              /> */}
            </>
          )}
          {/* <ActionMenuItem
            onClick={() => setVisibleHistory(true)}
            // isActive={selectRows.length === 1 && canView}
            label={labels.btn.viewHistory}
            type="history"
          /> */}
        </div>
        <TableComponent<PhysicalAttachment>
          sortDirections={["ascend", "descend"]}
          columns={columns}
          dataSource={physicalAttachments}
          style={{ marginTop: 15, width: "100%" }}
          loading={loading}
          rowKey="ID"
          // rowSelection={rowSelection}
          scroll={{ x: "max-content" }}
          pageSize={5}
          // pagination={{
          //   size: "small",
          //   showTotal: () =>
          //     `${isEnglish ? "Total" : "المجموع"} ${
          //       physicalAttachments?.length
          //     } ${isEnglish ? "items" : "أغراض"}`,
          //   showSizeChanger: true,
          //   defaultPageSize: 5,
          //   pageSizeOptions: [5, 10],
          //   style: { marginRight: 10 },
          //   showQuickJumper: true,
          //   total: physicalAttachments?.length,
          //   locale: {
          //     jump_to: isEnglish ? "Go to" : "اذهب الى",
          //     page: isEnglish ? "Page" : "صفحة",
          //     prev_page: isEnglish ? "Previous" : "خلف",
          //     next_page: isEnglish ? "Next" : "التالي",
          //     items_per_page: isEnglish ? "/ Page" : "/ صفحة",
          //   },
          // }}
        />
        {/* {visibleHistory && (
          <HistoryModal
            visible={visibleHistory}
            onClose={() => setVisibleHistory(false)}
            correspondenceId={corrId}
            attachmentId={
              selectRows.length > 0 ? selectRows[0]?.ID.toString() : ""
            }
          />
        )} */}
        {openAdd && (
          <CreateNewPhysicalAttachment
            open={openAdd}
            onClose={() => setOpenAdd(false)}
            corrId={corrId}
            onSubmit={async () => {
              if (corrId) {
                await fetchAttachments(corrId);
              }
              setOpenAdd(false);
            }}
          />
        )}
        {/* {openEdit && (
          <CreateNewPhysicalAttachment
            open={openEdit}
            onClose={() => setOpenEdit(false)}
            attachment={selectRows[0]}
            corrId={corrId}
            onSubmit={async () => {
              if (corrId) {
                await fetchAttachments(corrId);
              }
              setOpenEdit(false);
            }}
          />
        )} */}
        <ModalComponent
          title={
            <>
              <DeleteFilled />
              {labels.btn.delete}
            </>
          }
          description={labels.msg.if_delete_attachment}
          visible={deletedID !== null}
          onClose={() => setDeletedID(null)}
          onSubmit={deleteAttachment}
          okText={labels.btn.delete}
          loading={loading}
        />
      </Col>
    </Row>
  );
}
