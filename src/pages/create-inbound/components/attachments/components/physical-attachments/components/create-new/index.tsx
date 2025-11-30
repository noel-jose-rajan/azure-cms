import { Button, Col, Form, Modal, Typography } from "antd";
import {
  CloseOutlined,
  EditFilled,
  FileAddFilled,
  PlusOutlined,
} from "@ant-design/icons";
import { useLanguage } from "../../../../../../../../context/language";
import { CSSProperties, ChangeEvent, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { MaterialInput } from "../../../../../../../../components/ui/material-input";
import Picklist from "@/components/shared/picklist";
import {
  CreatePhysicalAttachmentType,
  getPhysicalAttachmentSchema,
} from "../../../../schema";
import { addNewPhysicalAttachment } from "../../../../service";
import useCustomMessage from "@/components/hooks/use-message";
import useHandleError from "@/components/hooks/useHandleError";
import ButtonComponent from "@/components/ui/button";
interface CreatePhyAttProps {
  attachment?: any;
  // PhysicalAttachmentsType
  open: boolean;
  onClose: () => void;
  corrId?: string;
  onSubmit: () => void;
}
export default function CreateNewPhysicalAttachment({
  attachment = undefined,
  onClose,
  open,
  corrId,
  onSubmit,
}: CreatePhyAttProps) {
  const { showMessage } = useCustomMessage();
  const { handleError } = useHandleError();
  const { labels, isEnglish } = useLanguage();
  const [loading, setLoading] = useState(false);
  const iconStyle: CSSProperties = {
    marginRight: isEnglish ? 10 : 0,
    marginLeft: isEnglish ? 0 : 10,
  };

  const schema = getPhysicalAttachmentSchema(isEnglish ? "en" : "ar");
  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<CreatePhysicalAttachmentType>({
    resolver: zodResolver(schema),
    // mode: "all",
  });

  // useEffect(() => {
  //   if (attachment) {
  //     reset({
  //       corrId: corrId,
  //       description: attachment?.description,
  //       physicalAttachmentTypePickListCode:
  //         attachment?.physicalAttachmentTypePickListCode,
  //       quantity: attachment?.quantity.toString(),
  //     });
  //   }
  // }, [attachment]);

  const onFinish = async (values: CreatePhysicalAttachmentType) => {
    if (attachment) {
      await updateAttachment(values);
    } else {
      await createNewOne(values);
    }
  };

  const createNewOne = async (values: CreatePhysicalAttachmentType) => {
    try {
      setLoading(true);
      const response = await addNewPhysicalAttachment(corrId + "", values);
      if (response) {
        showMessage(
          "success",
          isEnglish
            ? "attachment  is uploaded successfully"
            : "تم التحميل بنجاح"
        );
        onSubmit();
      }
    } catch (e) {
      handleError(e);
    } finally {
      setLoading(false);
    }
  };

  const updateAttachment = async (values: CreatePhysicalAttachmentType) => {
    // if (!attachment) return;
    // const response = await editPhysicalAttachment(values, attachment);
    // if (response.status === HttpStatus.SUCCESS) {
    //   message.success(isEnglish ? "Updated Successfully" : "تم التحديث بنجاح");
    //   onSubmit();
    // } else {
    //   message.error(
    //     isEnglish
    //       ? "Something went wrong! Please contact your system administrator"
    //       : "حدث خطأ ما، يرجى الاتصال بمسؤول النظام"
    //   );
    // }
  };

  return (
    <Modal
      title={
        attachment ? (
          <Typography>
            <EditFilled style={iconStyle} />
            {labels.btn.edit + " " + labels.til.physical_attachment}
          </Typography>
        ) : (
          <Typography>
            <FileAddFilled style={iconStyle} />
            {labels.btn.create + " " + labels.til.physical_attachment}
          </Typography>
        )
      }
      width={600}
      centered
      open={open}
      onClose={onClose}
      onCancel={onClose}
      footer={<></>}
      zIndex={6}
    >
      <Form
        layout="vertical"
        style={{ marginBottom: 10, marginTop: 40 }}
        onFinish={handleSubmit(onFinish)}
      >
        <Col style={{ marginTop: 20 }}>
          <Controller
            name="attachmentName"
            control={control}
            render={({ field }) => (
              <MaterialInput
                label={labels.lbl.name + " *"}
                {...field}
                style={{ height: 50 }}
                error={errors.attachmentName?.message}
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
                error={errors.description?.message}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  field.onChange(e.target.value)
                }
              />
            )}
          />
        </Col>
        <Col style={{ marginTop: 20 }}>
          <Controller
            name="attachmentTypeID"
            control={control}
            render={({ field }) => (
              <Picklist
                code="Physical Attachment Type"
                label={labels.lbl.type + " *"}
                {...field}
                error={errors.attachmentTypeID?.message}
              />
            )}
          />
        </Col>
        <Col style={{ marginTop: 20 }}>
          <Controller
            name="quantity"
            control={control}
            render={({ field }) => (
              <MaterialInput
                label={labels.lbl.quantity + " *"}
                {...field}
                style={{ height: 50 }}
                error={errors.quantity?.message}
              />
            )}
          />
        </Col>
        <Col
          style={{ marginTop: 50, display: "flex", justifyContent: "flex-end" }}
        >
          <Button onClick={onClose} style={{ margin: "0 15px" }}>
            <CloseOutlined />
            {labels.btn.cancel}
          </Button>
          <ButtonComponent
            type="primary"
            onClick={handleSubmit(onFinish)}
            disabled={!isValid}
            spinning={loading}
            buttonLabel={attachment ? labels.btn.edit : labels.btn.create}
            icon={attachment ? <EditFilled /> : <PlusOutlined />}
          />
        </Col>
      </Form>
    </Modal>
  );
}
