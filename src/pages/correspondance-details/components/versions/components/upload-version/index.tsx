import { Button, Col, Modal, Typography, Upload, UploadProps } from "antd";
import { useLanguage } from "../../../../../../context/language";
import { CloudUploadOutlined, FilePdfOutlined } from "@ant-design/icons";
import { CSSProperties, useState } from "react";
import ButtonComponent from "@/components/ui/button";
import { uploadNewTemplateVersion } from "@/components/shared/actions/service";
import useHandleError from "@/components/hooks/useHandleError";
import useCustomMessage from "@/components/hooks/use-message";

interface UploadNewVersionProps {
  visible: boolean;
  onClose: () => void;
  corrId: string | number;
  onSubmit: () => void;
}

export default function UploadNewVersionModal({
  visible,
  onClose,
  corrId,
  onSubmit,
}: UploadNewVersionProps) {
  const { showMessage } = useCustomMessage();

  const { handleError } = useHandleError();
  const { labels, isEnglish } = useLanguage();
  const [loading, setLoading] = useState<boolean>(false);
  const [file, setFile] = useState<File | null>(null);
  const iconStyle: CSSProperties = {
    marginLeft: isEnglish ? 0 : 10,
    marginRight: isEnglish ? 10 : 0,
  };

  const props: UploadProps = {
    accept: ".docx",
    showUploadList: {
      extra: ({ size = 0 }) => (
        <span style={{ color: "#cccccc" }}>
          ({(size / 1024 / 1024).toFixed(2)}MB)
        </span>
      ),
      showRemoveIcon: true,
    },
    maxCount: 1,
    onChange: (info) => {
      if (info.fileList?.length > 0) {
        setFile(info.fileList[0].originFileObj as File);
      } else {
        setFile(null);
      }
    },
  };

  const handleUpload = async () => {
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("file", file as Blob);
      const res = await uploadNewTemplateVersion(corrId, formData);
      if (res) {
        showMessage("success", labels.msg.import_uploaded);
        onSubmit();
        onClose();
        setFile(null);
      }
    } catch (err) {
      handleError(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      open={visible}
      title={<Typography>{labels.til.outbound_file}</Typography>}
      footer={<></>}
      centered
      onCancel={onClose}
    >
      <Col style={{ marginTop: 30 }}>
        <Upload
          {...props}
          customRequest={({ onSuccess }) => {
            if (onSuccess) {
              onSuccess("ok");
            }
          }}
        >
          <Button type="primary">
            <CloudUploadOutlined style={styles.icons} />
            {labels.btn.upload_template}
          </Button>
        </Upload>

        <Col
          style={{ marginTop: 30, display: "flex", justifyContent: "flex-end" }}
          span={24}
        >
          <ButtonComponent
            buttonLabel={labels.btn.upload}
            onClick={handleUpload}
            disabled={!file}
            icon={<CloudUploadOutlined />}
            type="primary"
            spinning={loading}
          />
        </Col>
      </Col>
    </Modal>
  );
}
const styles = {
  icons: {
    margin: "0 10px",
    height: 27,
  },
};
