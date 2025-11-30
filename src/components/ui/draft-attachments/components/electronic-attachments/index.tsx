import {
  Checkbox,
  Col,
  Row,
  Table,
  TableColumnsType,
  TableProps,
  message,
} from "antd";
import { CSSProperties, useEffect, useState } from "react";
import { DeleteFilled, FileTextOutlined } from "@ant-design/icons";
import UploadNewVersion from "./components/upload-new-version";
import CreateElectronicAttachment from "./components/create-electronic-attachment";
import { ElectronicAttachmentType } from "../../../../../pages/create-inbound/types";
import { useLanguage } from "../../../../../context/language";
import { useTheme } from "../../../../../context/theme";
import { PickListItemType } from "../../../../../pages/pick-lists/service";
import { PickListHelper } from "../../../../functional/picklists";
import ActionMenuItem from "../../../menu-item";
import LoaderComponent from "../../../loader";
import UpdateElectronicAttachment from "./components/edit-electronic-attachment";
import ModalComponent from "../../../modal";
import HistoryModal from "../history";
import TitleHeader from "../../../header";
import {
  deleteElectronicAttachment,
  downloadAllElectronicAttachment,
  downloadElectronicAttachment,
  getElectronicAttachmentsOfCorrespondence,
} from "../../service";
import { HttpStatus } from "../../../../functional/httphelper";
import { DateHelper } from "../../../../functional/date";

interface CorrespondenceAttachmentsProps {
  corrId?: string;
  canView: boolean;
  activateLoader?: (loading: boolean) => void;
}

export default function ElectronicAttachments({
  corrId,
  canView,
}: CorrespondenceAttachmentsProps) {
  const [electronicAttachment, setElectronicAttachments] = useState<
    ElectronicAttachmentType[]
  >([]);
  const { labels, isEnglish } = useLanguage();
  const { theme } = useTheme();
  const [loading, setLoading] = useState<boolean>(false);
  const [docTypes, setDocTypes] = useState<PickListItemType[]>([]);
  const [visibleHistory, setVisibleHistory] = useState<boolean>(false);
  const [selectRows, setSelectedRows] = useState<ElectronicAttachmentType[]>(
    []
  );
  const [fullPageLoading, setFullPageLoading] = useState<boolean>(false);
  const [openAdd, setOpenAdd] = useState<boolean>(false);
  const [openEdit, setOpenEdit] = useState<boolean>(false);
  const [openDelete, setOpenDelete] = useState<boolean>(false);
  const [openNewVersion, setOpenNewVersion] = useState<boolean>(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  useEffect(() => {
    init();
  }, [corrId]);

  const init = async () => {
    if (corrId) {
      await fetchAllElectronicsAttachments(corrId);
    }

    await getPickListValues();
  };

  const getPickListValues = async () => {
    const plVal = await PickListHelper.documentType();

    setDocTypes(plVal);
  };

  const getDocTypeValue = (value: string) => {
    const val = docTypes.find((pl) => pl.picklistCode === value);

    if (val) {
      return isEnglish ? val.picklistEnLabel : val.picklistArLabel;
    }

    return "-";
  };

  const fetchAllElectronicsAttachments = async (id: string) => {
    setLoading(true);
    const response = await getElectronicAttachmentsOfCorrespondence(id);

    if (response) {
      setElectronicAttachments(response);
    }
    setLoading(false);
  };

  const rowSelection: TableProps<ElectronicAttachmentType>["rowSelection"] = {
    type: "checkbox",
    selectedRowKeys,
    onChange: (keys: React.Key[], rows: ElectronicAttachmentType[]) => {
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
              record.electronicAttachmentId
            );

            if (isSelected) {
              setSelectedRowKeys([]);
              setSelectedRows([]);
            } else {
              setSelectedRowKeys([record.electronicAttachmentId]);
              setSelectedRows([record]);
            }
          }}
        />
      );
    },
  };

  const columns: TableColumnsType<ElectronicAttachmentType> = [
    {
      title: labels.tbl.name,
      dataIndex: "name",
      render: (text: string) => (
        <a style={{ color: theme.colors.primary, maxWidth: 200 }}>{text}</a>
      ),
      width: "40%",
    },
    {
      title: labels.tbl.document_type,
      dataIndex: "documentTypePickListCode",
      render: (text: string) => (
        <a style={{ color: theme.colors.primary }}>
          {text ? getDocTypeValue(text) : "-"}
        </a>
      ),
      width: "15%",
    },
    {
      title: labels.tbl.description,
      dataIndex: "description",
      render: (text: string) => (
        <a style={{ color: theme.colors.primary }}>{text ?? "-"}</a>
      ),
      width: "15%",
    },
    {
      title: labels.tbl.att_last_modifier,
      dataIndex: "ownerDescription",
      render: (text) => (
        <a style={{ color: theme.colors.primary }}>{text ?? "-"}</a>
      ),
      width: "15%",
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
      width: "15%",
    },
  ];

  const downloadHistory = async () => {
    setFullPageLoading(true);
    if (selectRows.length === 0) return;
    const response = await downloadElectronicAttachment(
      selectRows[0].electronicAttachmentId.toString(),
      selectRows[0]
    );

    if (!response) {
    }
    setFullPageLoading(false);
  };

  const downLoadAllDocuments = async () => {
    setFullPageLoading(true);

    if (!corrId) return;

    const response = await downloadAllElectronicAttachment(corrId);

    if (!response) {
    }
    setFullPageLoading(false);
  };

  const deleteAttachment = async () => {
    setFullPageLoading(true);
    if (!corrId) return;

    const response = await deleteElectronicAttachment(
      corrId,
      selectRows[0].electronicAttachmentId
    );

    if (response.status == HttpStatus.SUCCESS) {
      await fetchAllElectronicsAttachments(corrId);
      setOpenDelete(false);
    } else {
      message.error(
        isEnglish
          ? "Something went wrong! Please contact your system administrator"
          : "حدث خطأ ما، يرجى الاتصال بمسؤول النظام"
      );
    }
    setFullPageLoading(false);
  };

  const iconStyle: CSSProperties = {
    marginRight: isEnglish ? 10 : 0,
    marginLeft: isEnglish ? 0 : 10,
  };

  return (
    <Row style={{ width: "100%" }}>
      <TitleHeader
        heading={labels.til.electronic_attachment}
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
          {/* <ActionMenuItem
            onClick={() => setOpenEdit(true)}
            isActive={
              selectRows.length === 1 && selectRows[0].isDeleted === false
            }
            label={labels.btn.edit}
            type="edit"
          /> */}
          <ActionMenuItem
            onClick={() => setOpenDelete(true)}
            isActive={
              selectRows.length === 1 && selectRows[0].isDeleted === false
            }
            label={labels.btn.delete}
            type="delete"
          />
          {/* <ActionMenuItem
            onClick={() => setOpenNewVersion(true)}
            isActive={
              selectRows.length === 1 && selectRows[0].isDeleted === false
            }
            label={labels.btn.uploadNewVersion}
            type="upload"
          /> */}
          <ActionMenuItem
            onClick={downloadHistory}
            isActive={
              selectRows.length === 1 && selectRows[0].isDeleted === false
            }
            label={labels.btn.download}
            type="download"
          />
          <ActionMenuItem
            onClick={downLoadAllDocuments}
            isActive
            label={labels.btn.downloadAll}
            type="download"
          />
          {/* <ActionMenuItem
            onClick={() => setVisibleHistory(true)}
            isActive={selectRows.length === 1 && canView}
            label={labels.btn.viewHistory}
            type="history"
          /> */}
        </div>
        <Table<ElectronicAttachmentType>
          showSorterTooltip
          sortDirections={["ascend", "descend"]}
          columns={columns}
          dataSource={electronicAttachment}
          style={{ marginTop: 15, width: "100%" }}
          loading={loading}
          rowKey="electronicAttachmentId"
          rowSelection={{ type: "checkbox", ...rowSelection }}
          scroll={{ x: "max-content" }}
          rowClassName={(record) =>
            record.isDeleted ? "deleted-e-attachment-row" : ""
          }
          pagination={{
            size: "small",
            showTotal: () =>
              `${isEnglish ? "Total" : "المجموع"} ${
                electronicAttachment?.length
              } ${isEnglish ? "items" : "أغراض"}`,
            showSizeChanger: true,
            defaultPageSize: 5,
            pageSizeOptions: [5, 10],
            style: { marginRight: 10 },
            showQuickJumper: true,
            total: electronicAttachment?.length,
            locale: {
              jump_to: isEnglish ? "Go to" : "اذهب الى",
              page: isEnglish ? "Page" : "صفحة",
              prev_page: isEnglish ? "Previous" : "خلف",
              next_page: isEnglish ? "Next" : "التالي",
              items_per_page: isEnglish ? "/ Page" : "/ صفحة",
            },
          }}
        />
      </Col>
      {visibleHistory && (
        <HistoryModal
          visible={visibleHistory}
          onClose={() => setVisibleHistory(false)}
          correspondenceId={corrId}
          attachmentId={
            selectRows.length > 0
              ? selectRows[0].electronicAttachmentId.toString()
              : ""
          }
          attachment={selectRows.length > 0 ? selectRows[0] : undefined}
          needDownload
        />
      )}
      <LoaderComponent loading={fullPageLoading} text={"Downloading..."} />
      {openAdd && (
        <CreateElectronicAttachment
          open={openAdd}
          onClose={() => setOpenAdd(false)}
          corrId={corrId}
          activateLoader={setFullPageLoading}
          onSubmit={async () => {
            await fetchAllElectronicsAttachments(corrId ?? "");
            setOpenAdd(false);
          }}
        />
      )}
      {openEdit && (
        <UpdateElectronicAttachment
          open={openEdit}
          onClose={() => setOpenEdit(false)}
          corrId={corrId}
          activateLoader={setFullPageLoading}
          onSubmit={async () => {
            if (corrId) {
              await fetchAllElectronicsAttachments(corrId);
            }
            setOpenEdit(false);
          }}
          attachment={selectRows[0]}
        />
      )}
      <ModalComponent
        title={
          <>
            <DeleteFilled style={iconStyle} />
            {labels.btn.delete}
          </>
        }
        description={labels.msg.if_delete_attachment}
        visible={openDelete}
        onClose={() => setOpenDelete(false)}
        onSubmit={deleteAttachment}
        okText={labels.btn.delete}
      />
      {openNewVersion && (
        <UploadNewVersion
          visible={openNewVersion}
          onClose={() => setOpenNewVersion(false)}
          activateLoader={setFullPageLoading}
          attachment={selectRows[0]}
        />
      )}
    </Row>
  );
}
