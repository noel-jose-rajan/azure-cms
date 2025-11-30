import { HttpStatus } from "@/components/functional/httphelper";
import {
  getOutboundTemplateById,
  updateAnOBTemplateDoc,
  updateTheMetaDataOfTemplate,
  uploadAnOBTemplate,
} from "@/components/services/outbound-templates";
import { OBTemplateType } from "@/components/services/outbound-templates/type";
import SelectOU from "@/components/shared/select-org-units";
import { MaterialInput } from "@/components/ui/material-input";
import { useLanguage } from "@/context/language";
import { useTheme } from "@/context/theme";
import {
  CloseOutlined,
  CloudUploadOutlined,
  EditFilled,
  PlusOutlined,
} from "@ant-design/icons";
import { Button, message, Modal, Row, Switch, Upload, UploadProps } from "antd";
import { FC, useEffect, useState } from "react";

interface Props {
  onClose?: () => any;
  attachmentSize: number;
  templateId?: number;
  visible?: boolean;
  refresh?: () => void;
}

const AddTemplate: FC<Props> = ({
  attachmentSize,
  templateId,
  onClose,
  visible,
  refresh,
}) => {
  const {
    labels: { til, btn, lbl },
    isEnglish,
  } = useLanguage();
  const {
    theme: { colors },
  } = useTheme();
  const [loading, setLoading] = useState<boolean>(false);
  const [template, setTemplate] = useState<OBTemplateType>({
    ContentID: "",
    FileName: "",
    IsGeneralTemplate: true,
    TemplateName: "",
    EntityIdList: [],
  });
  const [selectedFile, setSelectedFile] = useState<File>();
  const [fileList, setFileList] = useState<UploadProps["fileList"]>([]);
  const [error, setErrors] = useState<{ attachment: string }>({
    attachment: "",
  });

  useEffect(() => {
    if (templateId) {
      getTemplateInfo(templateId);
    }
  }, [templateId]);

  const getTemplateInfo = async (id: number) => {
    const response = await getOutboundTemplateById(id);

    if (response.status === HttpStatus.SUCCESS && response.data) {
      setTemplate(response.data.Data);
      setFileList([
        {
          uid: "-1",
          name: response.data.Data.FileName,
          status: "done",
        },
      ]);
    }
  };

  const handleSubmit = async () => {
    if (templateId) {
      await updateTemaplate();
    } else {
      await createNewTemplate();
    }
  };

  const uploadProps: UploadProps = {
    beforeUpload: (file) => {
      const isLt8MB = file.size / 1024 / 1024 < attachmentSize;

      if (!isLt8MB) {
        setErrors({
          ...error,
          attachment: `File must be smaller than ${attachmentSize}MB!`,
        });
        return Upload.LIST_IGNORE;
      } else {
        setErrors({
          ...error,
          attachment: ``,
        });
      }

      setSelectedFile(file as File);
      setFileList([
        {
          uid: "-1",
          name: file.name,
          status: "done",
        },
      ]);
      return false;
    },
    type: "select",
    showUploadList: true,
    fileList: fileList,
    maxCount: 1,
    accept:
      ".docx,application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    onRemove: () => {
      setSelectedFile(undefined);
    },
  };

  const createNewTemplate = async () => {
    try {
      setLoading(true);
      if (!selectedFile) {
        setLoading(false);
        return;
      }
      const form = new FormData();
      form.append("file", selectedFile);
      form.append("template_name", template.TemplateName ?? "");
      form.append("is_general_template", template.IsGeneralTemplate.toString());
      if (!template.IsGeneralTemplate) {
        form.append("entity_id_list", template.EntityIdList?.join(",") ?? "");
      }
      const response = await uploadAnOBTemplate(form);
      if (response.status === HttpStatus.SUCCESS && response.data) {
        setLoading(false);
        refresh && refresh();
      } else {
        setLoading(false);
        message.error("Failed to Upload document");
      }
    } catch (error) {
      setLoading(false);
      message.error("Failed to Upload document");
    }
  };

  const updateTemaplate = async () => {
    try {
      setLoading(true);
      if (!templateId) {
        setLoading(false);
        return;
      }
      if (selectedFile) {
        const form = new FormData();
        form.append("file", selectedFile);
        const response = await updateAnOBTemplateDoc(form, templateId);
        if (response.status === HttpStatus.SUCCESS && response.data) {
          message.success(
            isEnglish
              ? "Document Uploaded successfully"
              : "تم تحميل المستند بنجاح"
          );
        } else {
          message.error(
            isEnglish ? "Failed to Upload document" : "فشل تحديث القالب"
          );
        }
      }

      const response = await updateTheMetaDataOfTemplate(
        {
          entityIdList: template.EntityIdList,
          isGeneralTemplate: template.IsGeneralTemplate,
          templateName: template.TemplateName,
        },
        templateId
      );
      if (response.status === HttpStatus.SUCCESS && response.data) {
        message.success(
          isEnglish
            ? "Document Uploaded successfully"
            : "تم تحميل المستند بنجاح"
        );
        setLoading(false);
        refresh && refresh();
      } else {
        message.error(
          isEnglish ? "Failed to Upload document" : "فشل تحديث القالب"
        );
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      message.error(
        error instanceof Error
          ? error.message
          : isEnglish
          ? "Failed to update template"
          : "فشل تحديث القالب"
      );
    }
  };

  return (
    <Modal
      open={visible}
      title={til.outbound_templates}
      onCancel={onClose}
      onClose={onClose}
      onOk={handleSubmit}
      okText={templateId ? btn.save : btn.create}
      cancelText={btn.cancel}
      footer={
        <>
          <div style={{ marginTop: 25 }}>
            <Button onClick={onClose} style={{ margin: "0 15px" }}>
              <CloseOutlined />
              {btn.cancel}
            </Button>
            <Button
              disabled={
                template.TemplateName.trim() === "" ||
                loading ||
                (!templateId && !selectedFile)
              }
              type="primary"
              onClick={handleSubmit}
              loading={loading}
            >
              {loading !== true ? (
                templateId ? (
                  <EditFilled />
                ) : (
                  <PlusOutlined />
                )
              ) : (
                <></>
              )}
              {templateId ? btn.save : btn.create}
            </Button>
          </div>
        </>
      }
    >
      <MaterialInput
        label={lbl.template_file_name + " *"}
        style={{ marginTop: 20 }}
        value={template.TemplateName}
        onChange={(e: any) =>
          setTemplate({ ...template, TemplateName: e.target.value })
        }
      />
      <Row
        gutter={[15, 10]}
        style={{ marginTop: 20, marginLeft: 10, marginBottom: 20 }}
      >
        <p style={{ marginRight: 10 }}>{lbl.is_general + "? *"}</p>
        <Switch
          value={template.IsGeneralTemplate}
          onChange={(e: boolean) =>
            setTemplate({ ...template, IsGeneralTemplate: e })
          }
        />
      </Row>
      <Upload {...uploadProps}>
        <Button type="primary" style={{ borderRadius: 20 }}>
          <CloudUploadOutlined />
          {btn.select_file}
        </Button>
      </Upload>
      {error.attachment && (
        <p style={{ color: colors.success, marginTop: 10, fontSize: 12 }}>
          {error.attachment}
        </p>
      )}
      <br />
      {!template.IsGeneralTemplate && (
        <SelectOU
          multiSelect
          value={template.EntityIdList}
          onChange={function (value: number[] | number): void {
            if (Array.isArray(value)) {
              setTemplate({ ...template, EntityIdList: value });
            } else {
              setTemplate({ ...template, EntityIdList: [] });
            }
          }}
          label={lbl.org_unit + " *"}
        />
      )}
    </Modal>
  );
};

export default AddTemplate;
