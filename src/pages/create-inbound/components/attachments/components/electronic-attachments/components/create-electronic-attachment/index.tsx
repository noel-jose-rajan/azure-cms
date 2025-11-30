import {
  Button,
  Col,
  Form,
  Modal,
  TableColumnsType,
  Typography,
  Upload,
  UploadProps,
} from "antd";
import {
  CloseOutlined,
  CloudUploadOutlined,
  DeleteFilled,
  EditFilled,
  FileAddFilled,
  ScanOutlined,
  TableOutlined,
} from "@ant-design/icons";
import { useLanguage } from "../../../../../../../../context/language";
import { CSSProperties, ChangeEvent, useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { MaterialInput } from "../../../../../../../../components/ui/material-input";
import TitleHeader from "../../../../../../../../components/ui/header";
import { useTheme } from "../../../../../../../../context/theme";
import usePicklist from "@/store/picklists/use-picklist";
import Picklist from "@/components/shared/picklist";
import { addElectronicAttachment } from "../../../../service";
import {
  createElectronicAttachmentListSchema,
  CreateElectronicAttachmentType,
} from "../../../../schema";
import TableComponent from "@/components/ui/table-component";
import ButtonComponent from "@/components/ui/button";
import Scanner from "../../../../../../../../components/dynamsoft";
import useCustomMessage from "@/components/hooks/use-message";
import useHandleError from "@/components/hooks/useHandleError";

interface CreatePhyAttProps {
  open: boolean;
  onClose: () => void;
  corrId?: string;
  onSubmit: () => void;
}

export default function CreateElectronicAttachment({
  onClose,
  open,
  corrId,
  onSubmit,
}: CreatePhyAttProps) {
  const { handleError } = useHandleError();
  const { showMessage } = useCustomMessage();
  const { labels, isEnglish } = useLanguage();
  const { getPicklistById } = usePicklist();
  const { theme } = useTheme();
  const [selectedFile, setSelectedFile] = useState<File>();
  const [loading, setLoading] = useState(false);
  const [attachments, setAttachments] = useState<
    CreateElectronicAttachmentType[]
  >([]);
  const [selectedAttachment, setSelectedAttachment] =
    useState<CreateElectronicAttachmentType>();
  const [openScanner, setOpenScanner] = useState<boolean>(false);

  const iconStyle: CSSProperties = {
    marginRight: isEnglish ? 10 : 0,
    marginLeft: isEnglish ? 0 : 10,
  };

  const { control, reset, getValues, watch } =
    useForm<CreateElectronicAttachmentType>({
      resolver: zodResolver(createElectronicAttachmentListSchema),
      mode: "all",
    });
  const { attachment_name } = watch();
  useEffect(() => {
    if (selectedAttachment) {
      reset(selectedAttachment);
    }
  }, [selectedAttachment]);

  useEffect(() => {
    addARecord(selectedFile);
  }, [selectedFile]);

  const addARecord = async (file?: File) => {
    if (file) {
      const fileVals: CreateElectronicAttachmentType = {
        description: "",
        document_type_id: 122,
        fileSize: file.size,
        // status: "Not Start",
        attachment_name: file.name.replace(/\.[^/.]+$/, ""),
        id: new Date().getTime(),
        file: file,
      };

      setAttachments([...attachments, fileVals]);
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
    // accept: "application/pdf",
    onRemove: () => {
      setSelectedFile(undefined);
    },
  };

  const deleteARecord = async (rec: CreateElectronicAttachmentType) => {
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
    console.log(filtered);

    setSelectedAttachment(undefined);
  };

  const columns: TableColumnsType<CreateElectronicAttachmentType> = [
    {
      title: labels.lbl.name,
      dataIndex: "attachment_name",
      render: (text: string) => (
        <a style={{ color: theme.colors.primary }}>{text}</a>
      ),
      width: 200,
      ellipsis: true,
    },
    {
      width: 150,
      ellipsis: true,
      title: labels.lbl.document_type,
      dataIndex: "document_type_id",
      render: (text: string) => {
        const pl = getPicklistById("Document Type", text);
        return (
          <a style={{ color: theme.colors.primary }}>
            {(isEnglish ? pl?.picklist_en_label : pl?.picklist_ar_label) ?? ""}
          </a>
        );
      },
    },
    {
      width: 200,
      ellipsis: true,
      title: labels.lbl.description,
      dataIndex: "description",
      render: (text: string) => (
        <a style={{ color: theme.colors.primary }}>{text || "-"}</a>
      ),
    },
    {
      width: 150,
      ellipsis: true,
      title: labels.tbl.fileSize,
      dataIndex: "fileSize",
      render: (text: number) => (
        <a style={{ color: theme.colors.primary }}>
          {text ? `${(text / 1000).toFixed(2)} Kb` : ""}
        </a>
      ),
    },
    // {
    //   title: labels.lbl.status,
    //   dataIndex: "status",
    //   render: (text: string) => (
    //     <a style={{ color: theme.colors.primary }}>{text}</a>
    //   ),
    // },
    {
      width: 100,
      title: labels.tbl.action,
      dataIndex: "id",
      render: (_text: number, record: CreateElectronicAttachmentType) => (
        <div style={{ display: "flex", gap: 0 }}>
          <Button
            type="link"
            onClick={() => {
              setSelectedAttachment(record);
            }}
            style={{ marginInline: -6 }}
          >
            <EditFilled />
          </Button>
          {/* <Popconfirm
            placement="top"
            title={labels.msg.are_you_sure}
            description={labels.msg.if_delete_attachment}
            okText={labels.btn.delete}
            cancelText={labels.btn.cancel}
            > */}
          <Button
            onClick={() => deleteARecord(record)}
            type="link"
            disabled={selectedAttachment ? true : false}
            danger
            style={{ marginInline: -6 }}
          >
            <DeleteFilled />
          </Button>
          {/* </Popconfirm> */}
        </div>
      ),
    },
  ];

  const uploadTheAttachmentsToServer = async () => {
    if (attachments.length === 0) {
      showMessage("info", "Please select at least one file to upload.");
      return;
    }
    setLoading(true);
    try {
      const uploadPromises = attachments.map((att) =>
        uploadElectronicAttachments(att)
      );
      await Promise.all(uploadPromises);
      if (attachments.length == 1) {
        showMessage(
          "success",
          isEnglish
            ? "Attachment uploaded successfully!"
            : "تم رفع المرفق بنجاح!"
        );
      } else {
        showMessage(
          "success",
          isEnglish
            ? "All attachments uploaded successfully!"
            : "تم رفع جميع المرفقات بنجاح!"
        );
      }
      onSubmit();
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  };

  const uploadElectronicAttachments = async (
    doc: CreateElectronicAttachmentType
  ) => {
    const { attachment_name, description, document_type_id, file } = doc;
    const formData = new FormData();
    formData.append("file", file as Blob);
    formData.append("attachment_name", attachment_name);
    formData.append("description", description);
    formData.append("document_type_id", document_type_id.toString());
    await addElectronicAttachment(corrId || "", formData);
  };

  return (
    <>
      <Modal
        key={"create-electronic-attachment-modal"}
        title={
          <Typography>
            <FileAddFilled style={iconStyle} />
            {labels.btn.create + " " + labels.til.electronic_attachment}
          </Typography>
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
          <Form
            style={{
              marginBottom: 10,
              marginTop: 40,
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "space-between",
              gap: 8,
            }}
          >
            <Col style={{ marginTop: 20 }} sm={24} md={8}>
              <Controller
                name="attachment_name"
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
            <Col style={{ marginTop: 20 }} sm={24} md={7}>
              <Controller
                name="description"
                control={control}
                render={({ field }) => (
                  <MaterialInput
                    label={labels.lbl.description}
                    {...field}
                    style={{ height: 50 }}
                  />
                )}
              />
            </Col>
            <Col sm={24} md={7} style={{ marginTop: 28 }}>
              <Controller
                name="document_type_id"
                control={control}
                render={({ field }) => (
                  <Picklist
                    code="Document Type"
                    {...field}
                    label={labels.lbl.document_type + " *"}
                  />
                )}
              />
            </Col>
            <Col
              sm={24}
              style={{
                marginTop: 12,
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
              <ButtonComponent
                type="primary"
                onClick={() => updateARecord()}
                disabled={!attachment_name}
                Icon={<EditFilled />}
                buttonLabel={labels.btn.edit}
              />
            </Col>
          </Form>
        )}
        <TitleHeader
          applyReverse={false}
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
          <Button
            type="primary"
            style={{ borderRadius: 20, marginInline: 8 }}
            onClick={() => setOpenScanner(true)}
          >
            <ScanOutlined />
            {labels.btn.scan}
          </Button>
        </Col>
        <Col
          span={24}
          style={{
            borderRadius: "2px",
            marginTop: 20,
            border: "1px solid #cbcbcb",
          }}
        >
          <TableComponent<CreateElectronicAttachmentType>
            showSorterTooltip
            sortDirections={["ascend", "descend"]}
            columns={columns}
            dataSource={attachments}
            style={{ marginTop: 15 }}
            rowKey="id"
            scroll={{ x: "max-content" }}
            pageSize={5}
          />
        </Col>
        <Col
          style={{
            marginTop: 8,
            display: "flex",
            justifyContent: "flex-end",
          }}
        >
          <Button onClick={onClose} style={{ margin: "0 15px" }}>
            <CloseOutlined />
            {labels.btn.cancel}
          </Button>
          <ButtonComponent
            spinning={loading}
            buttonLabel={labels.btn.upload_files}
            icon={<CloudUploadOutlined />}
            type="primary"
            onClick={uploadTheAttachmentsToServer}
            disabled={attachments.length === 0}
          />
        </Col>
      </Modal>
      <Modal
        open={openScanner}
        onClose={() => setOpenScanner(false)}
        onCancel={() => setOpenScanner(false)}
        width={"90vw"}
        style={{
          maxWidth: "unset",
          top: "5vh",
        }}
        zIndex={100}
      >
        <Scanner
          onPdfGenerate={(blob) => {
            const file = new File([blob], "scanned.pdf", {
              type: blob.type || "application/pdf",
            });
            addARecord(file);
            setOpenScanner(false);
          }}
        />
      </Modal>
    </>
  );
}
