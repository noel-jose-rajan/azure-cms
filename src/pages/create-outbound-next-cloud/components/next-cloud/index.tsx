import React, { lazy, useEffect, useState } from "react";
import { message, Button, Row, Col, Card, Spin } from "antd";
import NextcloudFileManager from "../../../../lib/helper/NextCloudFileManager";
import ENV from "../../../../constants/env";
import { DownloadOutlined, ReloadOutlined } from "@ant-design/icons";

const ArrowsAltOutlined = lazy(
  () => import("@ant-design/icons/ArrowsAltOutlined")
);

interface Props {
  file: File;
}

const NextcloudUploader: React.FC<Props> = ({ file }) => {
  const [editUrl, setEditUrl] = useState<string | null>(null);
  const [viewUrl, setViewUrl] = useState<string | null>(null);
  const [_isLoading, setIsLoading] = useState<boolean>(true);

  const nextcloud = new NextcloudFileManager(ENV.NODE_API_URL);

  useEffect(() => {
    if (!file) return;
    let isCancelled = false;

    const upload = async () => {
      if (isCancelled) return;
      await handleFileChange({ file });
    };

    upload();

    return () => {
      isCancelled = true;
    };
  }, [file]);

  const handleFileChange = async ({ file }: any) => {
    if (
      !file ||
      file.type !==
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ) {
      message.error("Please select a .docx file");
      return;
    }
    const filePath = await nextcloud.uploadFile(await file.arrayBuffer());
    if (filePath) {
      fetchFileEditInfo(filePath);
      fetchFileViewInfo(filePath);
    }
  };

  const fetchFileEditInfo = async (filePath: string) => {
    const fileInfo = await nextcloud.getFileInfo(filePath);
    if (fileInfo?.data?.ocs?.data?.id) {
      fetchEditUrl(fileInfo.data.ocs.data.id);
    }
  };

  const fetchEditUrl = async (shareId: string) => {
    const editUrl = await nextcloud.getEditUrl(shareId, 19);
    if (editUrl) {
      setEditUrl(editUrl);
    }
  };

  const fetchFileViewInfo = async (filePath: string) => {
    const fileInfo = await nextcloud.getFileInfo(filePath);
    if (fileInfo?.data?.ocs?.data?.id) {
      fetchViewUrl(fileInfo.data.ocs.data.id);
    }
  };

  const fetchViewUrl = async (shareId: string) => {
    const viewUrl = await nextcloud.getEditUrl(shareId, 1);
    if (viewUrl) {
      setViewUrl(viewUrl);
      setIsLoading(true);
    }
  };

  const handleEditFile = () => {
    if (editUrl) {
      window.open(
        editUrl,
        "_blank",
        "fullscreen=yes,toolbar=no,location=no,status=no,menubar=no,scrollbars=no,resizable=no"
      );
    }
  };

  const handleReload = () => {
    setIsLoading(true); // Show loading while reloading
    setViewUrl((prev) => prev + ""); // Force re-rendering by updating state
  };

  const handleDownload = async () => {
    if (!editUrl) return;

    const downloadUrl = `${editUrl}/download`; // Append "/download" to force file download

    try {
      const response = await fetch(downloadUrl);
      if (!response.ok) throw new Error("Failed to download file");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = file.name; // Keep original filename
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.log(error);

      message.error("Failed to download file.");
    }
  };

  return (
    <Card style={{ width: "100%" }}>
      <Row style={{ width: "100%" }}>
        <Col style={{ width: "100%" }}>
          <Row gutter={10}>
            <Col>
              <Button onClick={handleEditFile} disabled={!editUrl}>
                <ArrowsAltOutlined />
              </Button>
            </Col>
            <Col>
              <Button onClick={handleReload} disabled={!viewUrl}>
                <ReloadOutlined />
              </Button>
            </Col>
            <Col>
              <Button onClick={handleDownload} disabled={!viewUrl}>
                <DownloadOutlined />
              </Button>
            </Col>
          </Row>
          <hr />
          <Row>
            {viewUrl && (
              <div
                style={{
                  position: "relative",
                  width: "100%",
                  aspectRatio: "1:1",
                }}
              >
                {true && (
                  // isLoading &&
                  <div
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "100%",
                      height: "100%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      background: "rgba(255, 255, 255, 0.9)",
                      zIndex: 10,
                    }}
                  >
                    <Spin size="large" />
                  </div>
                )}
                <iframe
                  key={viewUrl}
                  src={viewUrl}
                  title="Document Editor"
                  onLoad={() => setIsLoading(false)}
                  style={{
                    width: "100%",
                    height: "50vh",
                    border: "none",
                    display: "block",
                    overflow: "hidden",
                    opacity: 0.5,
                  }}
                />
              </div>
            )}
          </Row>
        </Col>
      </Row>
    </Card>
  );
};

export default NextcloudUploader;
