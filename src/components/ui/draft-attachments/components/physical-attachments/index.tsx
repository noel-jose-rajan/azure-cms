import {
  Checkbox,
  Col,
  Row,
  Table,
  TableColumnsType,
  TableProps,
  message,
} from "antd";
import { useEffect, useState } from "react";
import { PhysicalAttachmentsType } from "../../../../../pages/create-inbound/types";
import { useTheme } from "../../../../../context/theme";
import { DeleteFilled, FileTextOutlined } from "@ant-design/icons";
import { useLanguage } from "../../../../../context/language";
import TitleHeader from "../../../header";
import ActionMenuItem from "../../../menu-item";
import ModalComponent from "../../../modal";
import { PickListItemType } from "../../../../../pages/pick-lists/service";
import {
  deletePhysicalAttachment,
  getPhysicalAttachmentsOfCorrespondence,
} from "../../service";
import { PickListHelper } from "../../../../functional/picklists";
import { HttpStatus } from "../../../../functional/httphelper";
import CreateNewPhysicalAttachment from "./components/create-new";
import HistoryModal from "../history";
import { DateHelper } from "../../../../functional/date";
// import { PickListHelper } from "../../../../../../components/functional/picklists";
// import { PickListItemType } from "../../../../../pick-lists/service";
// import ActionMenuItem from "../../../../../../components/ui/menu-item";
// import HistoryModal from "../history";
// import { PhysicalAttachmentsType } from "../../../../types";
// import {
//   deletePhysicalAttachment,
//   getPhysicalAttachmentsOfCorrespondence,
// } from "../../../../service";
// import { DateHelper } from "../../../../../../components/functional/date";
// import CreateNewPhysicalAttachment from "./components/create-new";
// import ModalComponent from "../../../../../../components/ui/modal";
// import { HttpStatus } from "../../../../../../components/functional/httphelper";

interface CorrespondenceAttachmentsProps {
  corrId?: string;
  canView: boolean;
  activateLoader?: (loading: boolean) => void;
}

export default function PhysicalAttachments({
  corrId,
  canView,
  activateLoader,
}: CorrespondenceAttachmentsProps) {
  const [physicalAttachments, setPhysicalAttachments] = useState<
    PhysicalAttachmentsType[]
  >([]);
  const [types, setTypes] = useState<PickListItemType[]>([]);
  const { labels, isEnglish } = useLanguage();
  const { theme } = useTheme();
  const [loading, setLoading] = useState<boolean>(false);
  const [visibleHistory, setVisibleHistory] = useState<boolean>(false);
  const [selectRows, setSelectedRows] = useState<PhysicalAttachmentsType[]>([]);
  const [openAdd, setOpenAdd] = useState<boolean>(false);
  const [openEdit, setOpenEdit] = useState<boolean>(false);
  const [openDelete, setOpenDelete] = useState<boolean>(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  useEffect(() => {
    getPhysicalAttachmentTypes();
    if (corrId) {
      fetchAttachments(corrId);
    }
  }, [corrId]);

  const fetchAttachments = async (id: string) => {
    setLoading(true);
    const response = await getPhysicalAttachmentsOfCorrespondence(id);

    if (response) {
      setPhysicalAttachments(response);
    }
    setLoading(false);
  };

  const getPhysicalAttachmentTypes = async () => {
    const res = await PickListHelper.physicalAttachmentType();

    setTypes(res);
  };

  const getDocTypeValue = (value: string) => {
    const val = types.find((pl) => pl.picklistCode === value);

    if (val) {
      return isEnglish ? val.picklistEnLabel : val.picklistArLabel;
    }

    return "-";
  };

  const columns: TableColumnsType<PhysicalAttachmentsType> = [
    {
      title: labels.tbl.type,
      dataIndex: "physicalAttachmentTypePickListCode",
      render: (text: string) => (
        <a style={{ color: theme.colors.primary }}>{getDocTypeValue(text)}</a>
      ),
    },
    {
      title: labels.tbl.description,
      dataIndex: "description",
      render: (text: string) => (
        <a style={{ color: theme.colors.primary }}>{text}</a>
      ),
    },
    {
      title: labels.tbl.quantity,
      dataIndex: "quantity",
      render: (text: number) => (
        <a style={{ color: theme.colors.primary }}>{text ?? "-"}</a>
      ),
    },
    {
      title: labels.tbl.att_last_modifier,
      dataIndex: "ownerDescription",
      render: (text) => (
        <a style={{ color: theme.colors.primary }}>{text ?? "-"}</a>
      ),
    },
    {
      title: labels.tbl.att_last_modify_date,
      dataIndex: "createdDate",
      render: (text) => (
        <a style={{ color: theme.colors.primary }}>
          {text ? text.replaceAll("-", "/") : "-"}
        </a>
      ),
      sorter: {
        compare: (a, b) =>
          DateHelper.getTime(b.createdDate) - DateHelper.getTime(a.createdDate),
        multiple: 3,
      },
    },
  ];

  const rowSelection: TableProps<PhysicalAttachmentsType>["rowSelection"] = {
    type: "checkbox",
    selectedRowKeys,
    onChange: (keys: React.Key[], rows: PhysicalAttachmentsType[]) => {
      const [selectedKey] = keys;
      const [selectedStamp] = rows;
      setSelectedRowKeys(selectedKey ? [selectedKey] : []);
      setSelectedRows(selectedStamp ? [selectedStamp] : []);
    },
    renderCell: (checked, record) => {
      return (
        <Checkbox
          checked={checked}
          onChange={() => {
            const isSelected = selectedRowKeys.includes(
              record.physicalAttachmentId
            );

            if (isSelected) {
              setSelectedRowKeys([]);
              setSelectedRows([]);
            } else {
              setSelectedRowKeys([record.physicalAttachmentId]);
              setSelectedRows([record]);
            }
          }}
        />
      );
    },
  };

  const deleteAttachment = async () => {
    if (corrId === undefined || selectRows.length === 0) return;
    activateLoader && activateLoader(true);
    const response = await deletePhysicalAttachment(
      corrId,
      selectRows[0].physicalAttachmentId
    );

    if (response.status === HttpStatus.SUCCESS) {
      const filtered = [...physicalAttachments].filter(
        (phyAtt) =>
          phyAtt.physicalAttachmentId !== selectRows[0].physicalAttachmentId
      );

      setPhysicalAttachments(filtered);
      setOpenDelete(false);
    } else {
      message.error(
        isEnglish
          ? "Something went wrong! Please contact your system administrator"
          : "حدث خطأ ما، يرجى الاتصال بمسؤول النظام"
      );
    }
    activateLoader && activateLoader(false);
  };

  return (
    <Row style={{ width: "100%" }}>
      <TitleHeader
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
            flexDirection: isEnglish ? "row" : "row-reverse",
            display: "flex",
            flexWrap: "wrap",
          }}
        >
          <ActionMenuItem
            onClick={() => setOpenAdd(true)}
            isActive
            label={labels.btn.create}
            type="add"
          />
          <ActionMenuItem
            onClick={() => setOpenEdit(true)}
            isActive={
              selectRows.length === 1 && selectRows[0].isDeleted === false
            }
            label={labels.btn.attachment_edit}
            type="edit"
          />
          <ActionMenuItem
            onClick={() => setOpenDelete(true)}
            isActive={
              selectRows.length === 1 && selectRows[0].isDeleted === false
            }
            label={labels.btn.delete}
            type="delete"
          />
          <ActionMenuItem
            onClick={() => setVisibleHistory(true)}
            isActive={selectRows.length === 1 && canView}
            label={labels.btn.viewHistory}
            type="history"
          />
        </div>
        <Table<PhysicalAttachmentsType>
          showSorterTooltip
          sortDirections={["ascend", "descend"]}
          columns={columns}
          dataSource={physicalAttachments}
          style={{ marginTop: 15, width: "100%" }}
          loading={loading}
          rowKey="physicalAttachmentId"
          rowSelection={{ type: "checkbox", ...rowSelection }}
          scroll={{ x: "max-content" }}
          rowClassName={(record) =>
            record.isDeleted ? "deleted-e-attachment-row" : ""
          }
          pagination={{
            size: "small",
            showTotal: () =>
              `${isEnglish ? "Total" : "المجموع"} ${
                physicalAttachments?.length
              } ${isEnglish ? "items" : "أغراض"}`,
            showSizeChanger: true,
            defaultPageSize: 5,
            pageSizeOptions: [5, 10],
            style: { marginRight: 10 },
            showQuickJumper: true,
            total: physicalAttachments?.length,
            locale: {
              jump_to: isEnglish ? "Go to" : "اذهب الى",
              page: isEnglish ? "Page" : "صفحة",
              prev_page: isEnglish ? "Previous" : "خلف",
              next_page: isEnglish ? "Next" : "التالي",
              items_per_page: isEnglish ? "/ Page" : "/ صفحة",
            },
          }}
        />
        {visibleHistory && (
          <HistoryModal
            visible={visibleHistory}
            onClose={() => setVisibleHistory(false)}
            correspondenceId={corrId}
            attachmentId={
              selectRows.length > 0
                ? selectRows[0].physicalAttachmentId.toString()
                : ""
            }
          />
        )}
        {openAdd && (
          <CreateNewPhysicalAttachment
            open={openAdd}
            onClose={() => setOpenAdd(false)}
            corrId={corrId}
            activateLoader={activateLoader}
            onSubmit={async () => {
              if (corrId) {
                await fetchAttachments(corrId);
              }
              setOpenAdd(false);
            }}
          />
        )}
        {openEdit && (
          <CreateNewPhysicalAttachment
            open={openEdit}
            onClose={() => setOpenEdit(false)}
            attachment={selectRows[0]}
            corrId={corrId}
            activateLoader={activateLoader}
            onSubmit={async () => {
              if (corrId) {
                await fetchAttachments(corrId);
              }
              setOpenEdit(false);
            }}
          />
        )}
        <ModalComponent
          title={
            <>
              <DeleteFilled />
              {labels.btn.delete}
            </>
          }
          description={labels.msg.if_delete_attachment}
          visible={openDelete}
          onClose={() => setOpenDelete(false)}
          onSubmit={deleteAttachment}
          okText={labels.btn.delete}
        />
      </Col>
    </Row>
  );
}
