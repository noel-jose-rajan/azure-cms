import {
  Button,
  Col,
  Form,
  Modal,
  Popconfirm,
  Table,
  TableColumnsType,
  Upload,
  UploadProps,
  message,
} from "antd";
import {
  CloseOutlined,
  CloudUploadOutlined,
  DeleteFilled,
  EditFilled,
  FileAddFilled,
  TableOutlined,
} from "@ant-design/icons";
import { useLanguage } from "../../../../../../../context/language";
import { CSSProperties, ChangeEvent, useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { PickListItemType } from "../../../../../../services/picklist/type";
import { useTheme } from "../../../../../../../context/theme";
import { PickListHelper } from "../../../../../../services/picklist";
import { HttpStatus } from "../../../../../../functional/httphelper";
import { uploadANewEAttachment } from "../../../../service";
import { MaterialInput } from "../../../../../material-input";
import { MaterialSelect } from "../../../../../dropdown/material-dropdown";
import TitleHeader from "../../../../../header";

interface CreatePhyAttProps {
  open: boolean;
  onClose: () => void;
  corrId?: string;
  activateLoader: (loading: boolean) => void;
  onSubmit: () => void;
}

const createElectronicAttachmentListSchema = z.object({
  description: z.string(),
  title: z.string(),
  docType: z.string(),
  fileSize: z.number(),
  status: z.string(),
  id: z.number(),
  fileName: z.string(),
  file: z.any(),
});

type CreateElectronicAttachmentListType = z.infer<
  typeof createElectronicAttachmentListSchema
>;

export default function CreateElectronicAttachment({
  onClose,
  open,
  corrId,
  activateLoader,
  onSubmit,
}: CreatePhyAttProps) {
  const { labels, isEnglish } = useLanguage();
  const [pickLists, setPickLists] = useState<PickListItemType[]>([]);
  const { theme } = useTheme();
  const [selectedFile, setSelectedFile] = useState<File>();
  const [attachments, setAttachments] = useState<
    CreateElectronicAttachmentListType[]
  >([]);
  const [selectedAttachment, setSelectedAttachment] =
    useState<CreateElectronicAttachmentListType>();

  const iconStyle: CSSProperties = {
    marginRight: isEnglish ? 10 : 0,
    marginLeft: isEnglish ? 0 : 10,
  };

  const { control, reset, getValues } =
    useForm<CreateElectronicAttachmentListType>({
      resolver: zodResolver(createElectronicAttachmentListSchema),
      mode: "all",
    });

  useEffect(() => {
    getDocumentTypes();
  }, []);

  useEffect(() => {
    if (selectedAttachment) {
      reset(selectedAttachment);
    }
  }, [selectedAttachment]);

  useEffect(() => {
    addARecord();
  }, [selectedFile]);

  const addARecord = async () => {
    if (selectedFile) {
      const fileVals: CreateElectronicAttachmentListType = {
        description: "",
        docType: "PICKLIST_41",
        fileSize: selectedFile.size,
        status: "Not Start",
        title: selectedFile.name.replace(/\.[^/.]+$/, ""),
        id: new Date().getTime(),
        fileName: selectedFile.name,
        file: selectedFile,
      };

      console.log("the upload file", fileVals);

      setAttachments([...attachments, fileVals]);
    }
  };

  const getDocumentTypes = async () => {
    try {
      const pickLists = await PickListHelper.documentType();

      setPickLists(pickLists);
    } catch (error) {
      setPickLists([]);
    }
  };

  const uploadProps: UploadProps = {
    beforeUpload: (file) => {
      setSelectedFile(file as File);
      return false;
    },
    type: "select",
    showUploadList: false,
    maxCount: 1,
    accept: "application/pdf",
    onRemove: () => {
      setSelectedFile(undefined);
    },
  };

  const deleteARecord = async (rec: CreateElectronicAttachmentListType) => {
    const filtered = attachments.filter((att) => att.id !== rec.id);

    setAttachments(filtered);
  };

  const updateARecord = async () => {
    console.log("this is triggering", selectedAttachment);
    const filtered = attachments.map((att) => {
      if (att.id === selectedAttachment?.id) {
        return getValues();
      }
      return att;
    });

    setAttachments(filtered);
    setSelectedAttachment(undefined);
  };

  const columns: TableColumnsType<CreateElectronicAttachmentListType> = [
    {
      title: labels.lbl.name,
      dataIndex: "title",
      render: (text: string) => (
        <a style={{ color: theme.colors.primary }}>{text}</a>
      ),
      width: "30%",
    },
    {
      title: labels.lbl.document_type,
      dataIndex: "docType",
      render: (text: string) => {
        const pl = pickLists.find((p) => p.picklistCode === text);
        return (
          <a style={{ color: theme.colors.primary }}>
            {pl?.picklistEnLabel ?? ""}
          </a>
        );
      },
    },
    {
      title: labels.lbl.description,
      dataIndex: "description",
      render: (text: string) => (
        <a style={{ color: theme.colors.primary }}>{text}</a>
      ),
    },
    {
      title: labels.tbl.fileSize,
      dataIndex: "fileSize",
      render: (text: number) => (
        <a style={{ color: theme.colors.primary }}>
          {text ? `${(text / 1000).toFixed(2)} Kb` : ""}
        </a>
      ),
    },
    {
      title: labels.lbl.status,
      dataIndex: "status",
      render: (text: string) => (
        <a style={{ color: theme.colors.primary }}>{text}</a>
      ),
    },
    {
      title: "",
      dataIndex: "id",
      render: (_text: number, record: CreateElectronicAttachmentListType) => (
        <>
          <Button
            type="primary"
            style={{
              marginRight: 10,
              backgroundColor:
                selectedAttachment?.id === _text
                  ? theme.colors.accent
                  : theme.colors.primary,
            }}
            onClick={() => {
              setSelectedAttachment(record);
            }}
          >
            <EditFilled />
          </Button>
          <Popconfirm
            placement="top"
            title={labels.msg.are_you_sure}
            description={labels.msg.if_delete_attachment}
            okText={labels.btn.delete}
            cancelText={labels.btn.cancel}
            onConfirm={() => deleteARecord(record)}
          >
            <Button type="link" disabled={selectedAttachment ? true : false}>
              <DeleteFilled />
            </Button>
          </Popconfirm>
        </>
      ),
    },
  ];

  const uploadTheAttachmentsToServer = async () => {
    activateLoader(true);
    attachments.map(async (att, index) => {
      return await uploadElectronicAttachments(att, index);
    });
  };

  const uploadElectronicAttachments = async (
    doc: CreateElectronicAttachmentListType,
    index: number
  ) => {
    const payLoad = {
      correspondenceId: corrId,
      fileName: doc.fileName,
      description: doc.description,
      name: doc.title,
      documentTypePickListCode: doc.docType,
    };
    const formData = new FormData();
    formData.append("file", doc.file as Blob);
    formData.append("attachmentElectronicDTO", JSON.stringify(payLoad));

    const response = await uploadANewEAttachment(formData);

    if (response.status === HttpStatus.SUCCESS) {
      message.success(labels.msg.update_attachment);
    } else {
      message.error(labels.msg.attachment_failed);
    }

    if (index === attachments.length - 1) {
      onSubmit();
      activateLoader(false);
    }
  };

  return (
    <Modal
      title={
        <>
          <FileAddFilled style={iconStyle} />
          {labels.btn.create + " " + labels.til.electronic_attachment}
        </>
      }
      width={1000}
      centered
      open={open}
      onClose={onClose}
      onCancel={onClose}
      footer={<></>}
      zIndex={6}
    >
      {selectedAttachment && (
        <Form layout="vertical" style={{ marginBottom: 10, marginTop: 40 }}>
          <Col style={{ marginTop: 20 }}>
            <Controller
              name="title"
              control={control}
              render={({ field }) => (
                <MaterialInput
                  label={labels.lbl.name + " *"}
                  {...field}
                  style={{ height: 50 }}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    field.onChange(e.target.value)
                  }
                />
              )}
            />
          </Col>
          <Col style={{ marginTop: 20 }}>
            <Controller
              name="description"
              control={control}
              render={({ field }) => (
                <MaterialInput
                  label={labels.lbl.description + " *"}
                  {...field}
                  style={{ height: 50 }}
                />
              )}
            />
          </Col>
          <Col style={{ marginTop: 20 }}>
            <Controller
              name="docType"
              control={control}
              render={({ field }) => (
                <MaterialSelect
                  label={labels.lbl.document_type + " *"}
                  options={pickLists.map((classification: PickListItemType) => {
                    return {
                      label: isEnglish
                        ? classification.picklistEnLabel
                        : classification.picklistArLabel,
                      value: classification.picklistCode,
                    };
                  })}
                  {...field}
                  onChange={(value: string) => {
                    field.onChange(value);
                  }}
                  style={{ height: 45 }}
                />
              )}
            />
          </Col>
          <Col
            style={{
              marginTop: 50,
              display: "flex",
              justifyContent: "flex-end",
            }}
          >
            <Button
              onClick={() => setSelectedAttachment(undefined)}
              style={{ margin: "0 15px" }}
            >
              <CloseOutlined />
              {labels.btn.clear}
            </Button>
            <Button type="primary" onClick={() => updateARecord()}>
              <EditFilled />
              {labels.btn.edit}
            </Button>
          </Col>
        </Form>
      )}
      <TitleHeader
        heading={labels.til.attachment_uploading_list}
        icon={<TableOutlined style={{ color: "#fff" }} />}
      />
      <Col style={{ marginTop: 20 }}>
        <Upload {...uploadProps}>
          <Button type="primary" style={{ borderRadius: 20 }}>
            <CloudUploadOutlined />
            {labels.btn.select_file}
          </Button>
        </Upload>
      </Col>
      <Col
        span={24}
        style={{
          borderRadius: "2px",
          marginTop: 20,
          border: "1px solid #cbcbcb",
        }}
      >
        <Table<CreateElectronicAttachmentListType>
          showSorterTooltip
          sortDirections={["ascend", "descend"]}
          columns={columns}
          dataSource={attachments}
          style={{ marginTop: 15 }}
          rowKey="id"
          scroll={{ x: "max-content" }}
        />
      </Col>
      <Col
        style={{
          marginTop: 50,
          display: "flex",
          justifyContent: "flex-end",
        }}
      >
        <Button onClick={onClose} style={{ margin: "0 15px" }}>
          <CloseOutlined />
          {labels.btn.cancel}
        </Button>
        <Button type="primary" onClick={uploadTheAttachmentsToServer}>
          <CloudUploadOutlined />
          {labels.btn.upload_files}
        </Button>
      </Col>
    </Modal>
  );
}
