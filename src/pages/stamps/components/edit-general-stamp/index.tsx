import { Button, Col, Modal, Upload, UploadProps, message } from "antd";
import {
  CloseOutlined,
  CloudUploadOutlined,
  EditFilled,
} from "@ant-design/icons";
import { useLanguage } from "../../../../context/language";
import { CSSProperties, useEffect, useState } from "react";
import { StampItemType } from "@/components/services/stamps/type";
import { HttpStatus } from "../../../../components/functional/httphelper";
import { updateAStamp } from "@/components/services/stamps/service";

interface AddEditStampModalProps {
  visible: boolean;
  onClose: () => void;
  activateLoader: (loading: boolean) => void;
  refreshPage: () => void;
  stamp?: StampItemType;
  resetSelections?: () => void;
}

export default function EditGeneralStampModal({
  onClose,
  visible,
  activateLoader,
  refreshPage,
  stamp,
  resetSelections,
}: AddEditStampModalProps) {
  const { labels, isEnglish } = useLanguage();
  const [selectedFile, setSelectedFile] = useState<File>();
  const [fileName, setFileName] = useState<string>("");
  const [fileList, setFileList] = useState<any[]>([]);

  useEffect(() => {
    if (stamp) {
      let contentName = stamp.Description + ".png";
      setFileList([{ uid: "-1", name: contentName, status: "done" }]);
      setFileName(stamp.Description);
    }
  }, [stamp]);

  const props: UploadProps = {
    beforeUpload: (file) => {
      setSelectedFile(file as File);
      setFileList([{ uid: "-1", name: file.name, status: "done" }]);
      return false;
    },
    fileList,
    type: "select",
    showUploadList: true,
    maxCount: 1,
    accept: "image/png",
    onRemove: () => {
      setSelectedFile(undefined);
      setFileList([]);
    },
  };

  const iconStyle: CSSProperties = {
    marginLeft: isEnglish ? 0 : 10,
    marginRight: isEnglish ? 10 : 0,
  };

  const updateExistingStamp = async () => {
    if (!stamp) return;

    try {
      activateLoader(true);
      if (selectedFile) {
        const formData = new FormData();
        formData.append("file", selectedFile as Blob);

        const response = await updateAStamp(formData, stamp.ID);

        if (response.status === HttpStatus.SUCCESS) {
          refreshPage();
          message.success(
            isEnglish ? "Successfully updated" : "تم التحديث بنجاح"
          );
        } else {
          message.error(
            isEnglish
              ? "Something went wrong! Please contact your system administrator"
              : "حدث خطأ ما، يرجى الاتصال بمسؤول النظام"
          );
        }
      }
    } catch (error) {
      message.error(
        isEnglish
          ? "Something went wrong! Please contact your system administrator"
          : "حدث خطأ ما، يرجى الاتصال بمسؤول النظام"
      );
    } finally {
      onClose();
      activateLoader(false);
      resetSelections && resetSelections();
    }
  };

  return (
    <Modal
      open={visible}
      onCancel={onClose}
      onClose={onClose}
      title={"Add Stamp"}
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
          disabled={!fileName}
          onClick={updateExistingStamp}
        >
          <EditFilled style={iconStyle} />
          {labels.btn.edit}
        </Button>
      </Col>
    </Modal>
  );
}
