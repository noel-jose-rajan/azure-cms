import { Modal, Table, TableColumnsType } from "antd";
import { CSSProperties, useEffect, useState } from "react";
import {
  AttachmentHistoryType,
  ElectronicAttachmentType,
} from "../../../../../pages/create-inbound/types";
import { useLanguage } from "../../../../../context/language";
import { useTheme } from "../../../../../context/theme";
import { getAttachmentHistory } from "../../../../../pages/create-inbound/service";
import { downloadHistoryDoc } from "../../service";
import { DateHelper } from "../../../../functional/date";
import { CloudDownloadOutlined, HistoryOutlined } from "@ant-design/icons";
import LoaderComponent from "../../../loader";

interface HistoryModalProps {
  visible: boolean;
  onClose: () => void;
  correspondenceId?: string;
  attachmentId?: string;
  needDownload?: boolean;
  attachment?: ElectronicAttachmentType;
}

export default function HistoryModal({
  onClose,
  visible,
  attachmentId,
  correspondenceId,
  needDownload = false,
  attachment,
}: HistoryModalProps) {
  const { labels, isEnglish } = useLanguage();
  const { theme } = useTheme();
  const [history, setHistory] = useState<AttachmentHistoryType[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [fullPageLoading, setFullPageLoading] = useState<boolean>(false);

  useEffect(() => {
    if (attachmentId && correspondenceId) {
      init(attachmentId, correspondenceId);
    }
  }, [attachmentId, correspondenceId]);

  const init = async (attachmentId: string, correspondenceId: string) => {
    setLoading(true);
    const response = await getAttachmentHistory(attachmentId, correspondenceId);

    if (response) {
      setHistory(response);
    }
    setLoading(false);
  };

  const downloadHistory = async (id: string) => {
    setFullPageLoading(true);
    if (!attachment) return;
    const response = await downloadHistoryDoc(id, attachment);

    if (!response) {
    }
    setFullPageLoading(false);
  };

  const columns: TableColumnsType<AttachmentHistoryType> = [
    {
      title: labels.tbl.performer_username,
      dataIndex: "performerUserDescription",
      render: (text: string) => (
        <a style={{ color: theme.colors.primary }}>{text}</a>
      ),
    },
    {
      title: labels.tbl.action_date,
      dataIndex: "actionDate",
      render: (text: string) => (
        <a style={{ color: theme.colors.primary }}>
          {text ? DateHelper.convertDateFormat(text) : "-"}
        </a>
      ),
      sorter: {
        compare: (a, b) =>
          DateHelper.getTime(b.actionDate) - DateHelper.getTime(a.actionDate),
        multiple: 3,
      },
    },
    {
      title: labels.tbl.performer_action,
      dataIndex: "performerActionPickListLabel",
      render: (text: string) => (
        <a style={{ color: theme.colors.primary }}>{text ?? "-"}</a>
      ),
    },
  ];

  if (needDownload) {
    columns.push({
      dataIndex: "attachmentHistoryId",
      render: (text: string) => (
        <CloudDownloadOutlined onClick={() => downloadHistory(text)} />
      ),
    });
  }

  const iconStyle: CSSProperties = {
    marginLeft: isEnglish ? 0 : 10,
    marginRight: isEnglish ? 10 : 0,
  };

  return (
    <>
      <Modal
        title={
          <>
            <HistoryOutlined style={iconStyle} />
            {labels.til.attachmentHistory}
          </>
        }
        open={visible}
        onCancel={onClose}
        centered
        footer={<></>}
        width={600}
        zIndex={5}
      >
        <Table<AttachmentHistoryType>
          showSorterTooltip
          sortDirections={["ascend", "descend"]}
          columns={columns}
          dataSource={history}
          style={{ marginTop: 15, width: "100%" }}
          loading={loading}
          rowKey="corrId"
          pagination={false}
          scroll={{ x: "max-content" }}
        />
      </Modal>
      <LoaderComponent loading={fullPageLoading} text="Downloading..." />
    </>
  );
}
