import { Button, Col, Modal, Upload, UploadProps, message } from "antd";
import { CloseOutlined, CloudUploadOutlined } from "@ant-design/icons";
import { CSSProperties, useState } from "react";
import { ElectronicAttachmentType } from "../../../../../../../pages/create-inbound/types";
import { useLanguage } from "../../../../../../../context/language";
import { useTheme } from "../../../../../../../context/theme";
import { HttpStatus } from "../../../../../../functional/httphelper";
import { uploadNewVerSionOfDocument } from "../../../../service";

interface AddEditStampModalProps {
  visible: boolean;
  onClose: () => void;
  activateLoader: (loading: boolean) => void;
  resetSelections?: () => void;
  attachment: ElectronicAttachmentType;
}

export default function UploadNewVersion({
  onClose,
  visible,
  activateLoader,
  resetSelections,
  attachment,
}: AddEditStampModalProps) {
  const { labels, isEnglish } = useLanguage();
  const [selectedFile, setSelectedFile] = useState<File>();
  const [fileList, setFileList] = useState<any[]>([]);
  const { theme } = useTheme();

  const props: UploadProps = {
    beforeUpload: (file) => {
      setSelectedFile(file as File);
      setFileList([
        { uid: "-1", name: file.name, status: "done", size: file.size },
      ]);
      return false;
    },
    fileList,
    type: "select",
    showUploadList: true,
    maxCount: 1,
    onRemove: () => {
      setSelectedFile(undefined);
      setFileList([]);
    },
    itemRender(originNode, file) {
      const fileSize = file.size
        ? (file.size / 1024).toFixed(2) + " Kb"
        : "Unknown size";

      return (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
          }}
        >
          {originNode}
          <span style={{ fontSize: "12px", color: theme.colors.accent }}>
            {fileSize}
          </span>
        </div>
      );
    },
  };

  const uploadANewVersionFile = async () => {
    try {
      activateLoader(true);

      const formData = new FormData();
      formData.append("newFile", selectedFile as Blob);
      attachment.name = selectedFile?.name ?? attachment.name;

      const response = await uploadNewVerSionOfDocument(attachment, formData);

      if (response.status === HttpStatus.SUCCESS) {
        message.success(
          isEnglish
            ? response.data?.details_en[0].desc
            : response.data?.details_ar[0].desc
        );
      }
    } catch (error) {
      message.error(
        isEnglish
          ? "Something went wrong! Please contact your system administrator"
          : "حدث خطأ ما، يرجى الاتصال بمسؤول النظام"
      );
    } finally {
      resetSelections && resetSelections();
      onClose();
      activateLoader(false);
    }
  };

  const iconStyle: CSSProperties = {
    marginLeft: isEnglish ? 0 : 10,
    marginRight: isEnglish ? 10 : 0,
  };

  return (
    <Modal
      open={visible}
      onCancel={onClose}
      onClose={onClose}
      title={
        <>
          <CloudUploadOutlined style={iconStyle} />
          {labels.til.electronic_attachment}
        </>
      }
      centered
      footer={<></>}
      width={500}
      zIndex={10}
    >
      <Upload {...props}>
        <Button type="primary" style={{ marginTop: 30 }}>
          <CloudUploadOutlined style={iconStyle} />
          {labels.btn.upload_template}
        </Button>
      </Upload>

      <Col span={24} style={{ display: "flex", justifyContent: "flex-end" }}>
        <Button type="text" style={{ marginTop: 30 }} onClick={onClose}>
          <CloseOutlined style={iconStyle} />
          {labels.btn.cancel}
        </Button>
        <Button
          type="primary"
          style={{ marginTop: 30 }}
          disabled={!selectedFile}
          onClick={uploadANewVersionFile}
        >
          <CloudUploadOutlined />
          {labels.btn.uploadNewVersion}
        </Button>
      </Col>
    </Modal>
  );
}
