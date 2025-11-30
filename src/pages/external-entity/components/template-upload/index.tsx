import { Button, Col, Modal, Upload, UploadProps } from "antd";
import Text from "../../../../components/ui/text/text";
import { useLanguage } from "../../../../context/language";
import { LANGUAGE } from "../../../../constants/language";
import { englishLabels } from "../../../../constants/app-constants/en";
import { arabicLabels } from "../../../../constants/app-constants/ar";
import { CloudUploadOutlined, RollbackOutlined } from "@ant-design/icons";
import DownloadTemplate from "../../../../assets/download-template";
import { TemplateUploadStatusType } from "../../service";
import { useState } from "react";
import { useTheme } from "../../../../context/theme";
import {
  bulkCreateExternalEntity,
  downloadEntityTemplate,
  downloadLogFile,
} from "../../../../components/services/external-entity";

interface UploadTemplateFileProps {
  visible: boolean;
  onCancel: () => void;
  // activateLoader: (val: boolean) => void;
}

export default function UploadTemplateFile({
  onCancel,
  visible,
}: // activateLoader,
UploadTemplateFileProps) {
  const { language } = useLanguage();
  const isEnglish = language === LANGUAGE.ENGLISH_INT;
  const labels = isEnglish ? englishLabels : arabicLabels;
  const { theme } = useTheme();
  const [uploadStatus, setUploadStatus] = useState<TemplateUploadStatusType>();
  const [size, setSize] = useState<string>();

  const getTemplate = async () => {
    // activateLoader(true);
    await downloadEntityTemplate();
    // activateLoader(false);
  };

  const handleFileUpload = async (file: File) => {
    // activateLoader(true);
    const response = await bulkCreateExternalEntity(file);

    if (response.data) {
      setUploadStatus(response.data.data[0]);
    }
    // activateLoader(false);
  };

  const props: UploadProps = {
    beforeUpload: (file) => {
      handleFileUpload(file as File);
      return false;
    },
    showUploadList:
      uploadStatus?.failedRowsErrors &&
      uploadStatus?.failedRowsErrors.length > 0
        ? true
        : false,
    maxCount: 1,
    onChange: (info) => {
      const fileSize = info.file.size ? (info.file.size / 1024).toFixed(2) : "";
      setSize(fileSize);
    },
  };

  const uploadSuccessMessage = {
    success: isEnglish ? "Uploaded Successfully" : "تم الرفع بنجاح",
    failed: isEnglish ? "Upload Failed" : "فشل الرفع",
  };

  const getLogFile = async () => {
    if (uploadStatus?.logFileName) {
      await downloadLogFile(uploadStatus?.logFileName);
    }
  };

  const UploadStatus = () => {
    return (
      <>
        <Col style={{ display: "flex" }}>
          <Text
            style={styles.textBold}
            ar={labels.lbl.file_name + " : "}
            en={labels.lbl.file_name + " : "}
          />
          <Text style={styles.textWithHorizontalMargin} ar={"-"} en={"-"} />
        </Col>
        <Col style={{ display: "flex" }}>
          <Text
            style={styles.textBold}
            ar={labels.lbl.size + " : "}
            en={labels.lbl.size + " : "}
          />
          <Text
            style={styles.textWithHorizontalMargin}
            ar={size + "kb"}
            en={size + "kb"}
          />
        </Col>
        <Col style={{ display: "flex" }}>
          <Text
            style={styles.textBold}
            ar={labels.msg.import_success + " : "}
            en={labels.msg.import_success + " : "}
          />
          <Text
            style={styles.textWithHorizontalMargin}
            ar={uploadStatus?.successfullyRows + "/" + uploadStatus?.noOfRows}
            en={uploadStatus?.successfullyRows + "/" + uploadStatus?.noOfRows}
          />
        </Col>
        <Col style={{ display: "flex" }}>
          <Text
            style={styles.textBold}
            ar={labels.tbl.status + " : "}
            en={labels.tbl.status + " : "}
          />
          <Text
            style={styles.textWithHorizontalMargin}
            ar={
              uploadStatus?.failedRowsErrors.length === 0
                ? uploadSuccessMessage.success
                : uploadSuccessMessage.failed
            }
            en={
              uploadStatus?.failedRowsErrors.length === 0
                ? uploadSuccessMessage.success
                : uploadSuccessMessage.failed
            }
          />
        </Col>
        {uploadStatus?.failedRowsErrors &&
          uploadStatus?.failedRowsErrors.length > 0 && (
            <Col
              style={{
                display: "flex",
                alignItems: "center",
              }}
            >
              <Text
                style={styles.textBold}
                ar={"Log File" + " : "}
                en={"Log File" + " : "}
              />
              <Button
                type="text"
                style={{ marginTop: 10 }}
                onClick={getLogFile}
              >
                <p style={{ color: theme.colors.primary }}>Download</p>
              </Button>
            </Col>
          )}
      </>
    );
  };
  return (
    <Modal
      open={visible}
      title={
        <>
          <CloudUploadOutlined
            style={{
              marginLeft: isEnglish ? 0 : 10,
              marginRight: isEnglish ? 10 : 0,
            }}
            height={24}
          />
          {labels.til.import_ext_ent_template}
        </>
      }
      onCancel={onCancel}
      footer={<></>}
      zIndex={10}
      centered
    >
      {uploadStatus?.failedRowsErrors &&
      uploadStatus?.failedRowsErrors.length === 0 ? (
        <Col style={{ marginTop: 20 }}>
          <UploadStatus />
          <Col
            style={{
              ...styles.buttonWrapper,
              justifyContent: isEnglish ? "flex-end" : "flex-start",
            }}
          >
            <Button type="primary" onClick={() => setUploadStatus(undefined)}>
              <RollbackOutlined />
              {labels.btn.back}
            </Button>
          </Col>
        </Col>
      ) : (
        <Col style={{ marginTop: 20 }}>
          <Text
            style={styles.text}
            ar={labels.msg.ext_import_step1}
            en={labels.msg.ext_import_step1}
          />
          <Text
            style={styles.text}
            ar={labels.msg.ext_import_step2}
            en={labels.msg.ext_import_step2}
          />
          <Text
            style={styles.text}
            ar={labels.msg.ext_import_step3}
            en={labels.msg.ext_import_step3}
          />

          <Col style={styles.buttonWrapper}>
            <Button type="primary" onClick={getTemplate}>
              <DownloadTemplate color={"#fff"} style={styles.downloadIcon} />
              {labels.btn.download_template}
            </Button>
            <Upload {...props}>
              <Button type="primary">
                <CloudUploadOutlined style={styles.icons} />
                {labels.btn.upload_template}
              </Button>
            </Upload>
          </Col>

          {uploadStatus && <UploadStatus />}
        </Col>
      )}
    </Modal>
  );
}

const styles = {
  text: {
    marginTop: 10,
  },
  icons: {
    margin: "0 10px",
    height: 27,
  },
  buttonWrapper: {
    display: "flex",
    justifyContent: "space-around",
    marginTop: 20,
  },
  downloadIcon: {
    height: 30,
    marginRight: 10,
  },
  textBold: {
    marginTop: 10,
    fontWeight: "600",
  },
  textWithHorizontalMargin: {
    marginTop: 10,
    marginLeft: 10,
    marginRight: 10,
  },
};
