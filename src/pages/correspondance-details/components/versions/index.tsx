import { useEffect, useState } from "react";
import { useLanguage } from "@/context/language";
import { useTheme } from "@/context/theme";
import { Row, Table, TableColumnsType } from "antd";
import { CloudDownloadOutlined } from "@ant-design/icons";
import UploadNewVersionModal from "./components/upload-version";
import {
  downloadCorrespondenceVersion,
  getAllCorrespondenceVersions,
  VersionDocType,
} from "@/components/services/inbox";
import moment from "moment";
import ButtonComponent from "@/components/ui/button";
import useHandleError from "@/components/hooks/useHandleError";

interface CorrespondenceVersionProps {
  corrId: string | number;
  canUpload: boolean;
}

export default function CorrespondenceVersions({
  corrId,
}: CorrespondenceVersionProps) {
  const { handleError } = useHandleError();
  const { labels } = useLanguage();
  const { theme } = useTheme();
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [versions, setVersions] = useState<VersionDocType[]>([]);
  const [downloadId, setDownloadId] = useState<string | number | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const fetchAllVersions = async () => {
    const res = await getAllCorrespondenceVersions(corrId);
    if (res) {
      setVersions(res);
    }
  };

  const downloadAVersion = async (id: string | number, fileName: string) => {
    try {
      setLoading(true);
      await downloadCorrespondenceVersion(corrId, id.toString(), fileName);
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (corrId) {
      fetchAllVersions();
    }
  }, [corrId]);

  const columns: TableColumnsType<VersionDocType> = [
    {
      title: labels.tbl.document_name,
      width: 300,
      dataIndex: "name",
      render: (text: string) => (
        <span style={{ color: theme.colors.primary }}>{text}</span>
      ),
      sorter: {
        compare: (a, b) =>
          b.name.toLowerCase().localeCompare(a.name.toLowerCase()),
        multiple: 3,
      },
    },
    // {
    //   title: labels.tbl.fileType,
    //   dataIndex: "fileExtension",
    //   render: (text: string) => (
    //     <a style={{ color: theme.colors.primary }}>{text}</a>
    //   ),
    //   sorter: {
    //     compare: (a, b) => b.fileExtension.localeCompare(a.fileExtension),
    //     multiple: 3,
    //   },
    // },
    // {
    //   title: labels.tbl.editor_name,
    //   dataIndex: "editorName",
    //   render: (text: string) => (
    //     <a style={{ color: theme.colors.primary }}>{text ?? "-"}</a>
    //   ),
    //   sorter: {
    //     compare: (a, b) => b.editorName.localeCompare(a.editorName),
    //     multiple: 3,
    //   },
    // },
    {
      title: labels.tbl.edit_date,
      dataIndex: "modified_at",
      width: 200,
      render: (text) => (
        <span style={{ color: theme.colors.primary }}>
          {text ? moment(text).format("DD/MM/YYYY hh:mm a") : "-"}
        </span>
      ),
      sorter: {
        compare: (a, b) => b.modified_at.localeCompare(a.modified_at),
        multiple: 3,
      },
    },
    {
      title: labels.tbl.action,
      dataIndex: "id",
      width: 50,
      render: (id, record) => (
        <ButtonComponent
          spinning={loading && downloadId === id}
          onClick={() => {
            downloadAVersion(id, record.name);
            setDownloadId(id);
          }}
          icon={<CloudDownloadOutlined />}
        />
      ),
    },
    // {
    //   title: labels.tbl.action,
    //   dataIndex: "modifiedDate",
    //   render: (_, record) => (
    //     <Button type="primary" onClick={() => downloadAVersion(record)}>
    //       <CloudDownloadOutlined />
    //       {labels.btn.download}
    //     </Button>
    //   ),
    //   sorter: {
    //     compare: (a, b) => b.modifiedDate.localeCompare(a.modifiedDate),
    //     multiple: 3,
    //   },
    // },
  ];

  // const downloadLatestVersion = async () => {
  //   if (corrId) {
  //     const response = await downloadLatestVersionOfDocument(details);

  //     if (!response) {
  //     }
  //   }
  // };

  return (
    <Row style={{ padding: 10 }}>
      {/* <Col span={24} style={{ display: "flex", justifyContent: "flex-end" }}>
        <Button
          style={{ marginLeft: 10, marginRight: 10 }}
          // onClick={downloadLatestVersion}
        >
          <CloudDownloadOutlined />
          {labels.btn.corres_download_latest}
        </Button>
        <Button
          type="primary"
          disabled={!canUpload}
          onClick={() => setModalVisible(true)}
        >
          <CloudUploadOutlined />
          {labels.btn.import_new_version}
        </Button>
      </Col> */}
      <Table<VersionDocType>
        showSorterTooltip
        sortDirections={["ascend", "descend"]}
        columns={columns}
        dataSource={versions}
        style={{ marginTop: 15, width: "100%" }}
        rowKey="corrId"
        pagination={false}
        scroll={{ x: "max-content" }}
      />
      {modalVisible && (
        <UploadNewVersionModal
          onSubmit={() => {}}
          corrId={corrId}
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
        />
      )}
    </Row>
  );
}
