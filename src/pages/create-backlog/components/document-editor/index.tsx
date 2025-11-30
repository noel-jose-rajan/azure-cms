import {
  Button,
  Col,
  Modal,
  Row,
  Tooltip,
  Upload,
  UploadProps,
  message,
} from "antd";
import { useLanguage } from "../../../../context/language";
import {
  BarcodeOutlined,
  CloudDownloadOutlined,
  EditFilled,
  ExpandOutlined,
  InboxOutlined,
  PaperClipOutlined,
  ScanOutlined,
} from "@ant-design/icons";
import { CSSProperties, useEffect, useState } from "react";
import NextcloudFileManager from "../../../../lib/helper/NextCloudFileManager";
import ENV from "../../../../constants/env";
import { useTheme } from "../../../../context/theme";
import { CorrespondenceDTOType } from "../../types";
import Storage from "../../../../lib/storage";
import LOCALSTORAGE from "../../../../constants/local-storage";
import { useNavigate } from "react-router-dom";
import Scanner from "../../../../components/dynamsoft";

interface InboundDocEditorProps {
  activateLoader: (loading: boolean) => void;
  completedUpload?: (resp: CorrespondenceDTOType) => void;
  bottomRef?: any;
  selectedFile?: File;
  updateSelectedFile?: (file?: File) => void;
}

export default function DocumentEditor({
  activateLoader,
  bottomRef,
  selectedFile,
  updateSelectedFile,
}: InboundDocEditorProps) {
  const { labels, isEnglish } = useLanguage();
  const { theme } = useTheme();
  const { Dragger } = Upload;

  const [showUpload, setShowUpload] = useState<boolean>(false);
  const [editUrl, setEditUrl] = useState<string>("");
  const [url, setUrl] = useState<string>("");
  const nextCloud = new NextcloudFileManager(ENV.NODE_API_URL);
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (selectedFile) {
      uploadFileToContentServer({ file: selectedFile });
    }
  }, [selectedFile]);

  const uploadFileToContentServer = async ({ file }: any) => {
    if (!file) {
      message.error("Please select a .docx file");
      return;
    }
    activateLoader(true);

    const filePath = await nextCloud.uploadFile(await file.arrayBuffer());
    if (filePath) {
      fetchFileEditInfo(filePath);
      fetchFileViewInfo(filePath);
    }
    activateLoader(false);
  };

  const fetchFileEditInfo = async (filePath: string) => {
    const fileInfo = await nextCloud.getFileInfo(filePath);
    if (fileInfo?.data?.ocs?.data?.id) {
      fetchEditUrl(fileInfo.data.ocs.data.id);
      setShowUpload(true);
    }
  };

  const fetchEditUrl = async (shareId: string) => {
    const editUrl = await nextCloud.getEditUrl(shareId, 19);

    if (editUrl) {
      setEditUrl(editUrl);
    }
  };

  const fetchFileViewInfo = async (filePath: string) => {
    const fileInfo = await nextCloud.getFileInfo(filePath);
    if (fileInfo?.data?.ocs?.data?.id) {
      fetchViewUrl(fileInfo.data.ocs.data.id);
    }
  };

  const fetchViewUrl = async (shareId: string) => {
    const viewUrl = await nextCloud.getEditUrl(shareId, 1);

    if (viewUrl) {
      setUrl(viewUrl);
    }
  };

  const handleEditFile = () => {
    if (editUrl) {
      window.open(
        editUrl,
        "_blank",
        "width=800,height=1100,toolbar=no,location=no,status=no,menubar=no,scrollbars=no,resizable=no"
      );
    }
  };

  const handleFullPageViewFile = () => {
    if (url) {
      window.open(
        url,
        "_blank",
        "width=800,height=1100,toolbar=no,location=no,status=no,menubar=no,scrollbars=no,resizable=no"
      );
    }
  };

  const printBarcode = async () => {
    const token = await Storage.getItem(LOCALSTORAGE.LEGACY_ACCESS_TOKEN);
    const printWindow = window.open(
      ENV.API_URL_LEGACY +
        "/correspodence/in/generate-barcode?access_token=" +
        token,
      "printVersion",
      "menubar,scrollbars,width=640,height=480,top=0,left=0"
    );

    if (printWindow) {
      printWindow.window.onafterprint = function () {
        printWindow.window.close();
      };
      printWindow.window.print();
    }
  };

  const scrollToBottom = () => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const draggerProps: UploadProps = {
    beforeUpload: (file) => {
      updateSelectedFile && updateSelectedFile(file as File);
      return false;
    },
    type: "select",
    showUploadList: false,
    maxCount: 1,
    accept: "application/pdf",
    onRemove: () => updateSelectedFile && updateSelectedFile(undefined),
    style: {
      height: 500,
    },
  };

  return (
    <Col style={{ marginTop: 10, height: "100%" }}>
      {!selectedFile ? (
        <Row gutter={20}>
          <Col span={24} style={{ marginBottom: 15 }}>
            <Button
              type="text"
              style={{
                height: 60,
                width: "100%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
              onClick={() => setOpen(true)}
            >
              <ScanOutlined />
              {labels.btn.scan}
            </Button>
          </Col>
          <Col span={24}>
            <Dragger {...draggerProps}>
              <Col
                style={{
                  height: 380,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <InboxOutlined style={{ fontSize: 35 }} />
                <p className="ant-upload-text">
                  {isEnglish
                    ? "Click or drag file to this area to upload"
                    : "انقر أو اسحب الملف إلى هذه المنطقة لتحميله"}
                </p>
              </Col>
            </Dragger>
          </Col>
        </Row>
      ) : (
        <>
          <Col
            style={{
              marginTop: 20,
              display: "flex",
              justifyContent: "flex-end",
              flexWrap: "wrap",
            }}
          >
            <Button
              type="primary"
              style={styles.buttonStyle}
              disabled={!showUpload}
            >
              <CloudDownloadOutlined />
              {labels.btn.download_pdf}
            </Button>
            <Button
              type="primary"
              style={styles.buttonStyle}
              disabled={!showUpload}
            >
              <CloudDownloadOutlined />
              {labels.btn.download_tiff}
            </Button>
            <Tooltip title={labels.btn.generate_barcode} arrow>
              <Button
                type="primary"
                style={styles.buttonStyle}
                onClick={printBarcode}
              >
                <BarcodeOutlined />
              </Button>
            </Tooltip>
            <Tooltip title={labels.til.attachments} arrow>
              <Button
                type="primary"
                style={styles.buttonStyle}
                onClick={scrollToBottom}
              >
                <PaperClipOutlined />
              </Button>
            </Tooltip>
            <Button
              type="primary"
              style={{ borderRadius: 20, marginTop: 10 }}
              onClick={handleEditFile}
              disabled={!showUpload}
            >
              <EditFilled />
              {labels.btn.edit}
            </Button>
          </Col>
          <Col style={{ marginTop: 10, position: "relative" }}>
            <>
              <iframe
                src={url}
                onLoad={() => {
                  navigate(-1);
                }}
                title="Document Editor"
                style={{
                  width: "100%",
                  maxHeight: 700,
                  aspectRatio: 9 / 12,
                  zoom: 1,
                }}
              ></iframe>
              <Button
                style={{
                  position: "absolute",
                  top: 5,
                  right: 10,
                  height: 35,
                  width: 35,
                  borderRadius: 20,
                  backgroundColor: theme.colors.accent,
                }}
                onClick={handleFullPageViewFile}
                icon={
                  <ExpandOutlined style={{ color: "#fff", fontSize: 15 }} />
                }
              ></Button>
            </>
          </Col>
        </>
      )}
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        onCancel={() => setOpen(false)}
        width={"90vw"}
        style={{
          maxWidth: "unset",
          top: "5vh",
        }}
      >
        <Scanner />
      </Modal>
    </Col>
  );
}

const styles: { [x: string]: CSSProperties } = {
  buttonStyle: {
    borderRadius: 20,
    marginRight: 10,
    marginTop: 10,
  },
};
