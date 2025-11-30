import { Button, Col, Form, Modal, message } from "antd";
import {
  CloseOutlined,
  EditFilled,
  FileAddFilled,
  PlusOutlined,
} from "@ant-design/icons";
import { useLanguage } from "../../../../../../../context/language";
import { CSSProperties, ChangeEvent, useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  CreatePhysicalAttachmentType,
  PhysicalAttachmentsType,
  createPhysicalAttachmentSchema,
} from "../../../../../../../pages/create-inbound/types";
import { PickListItemType } from "../../../../../../../pages/pick-lists/service";
import { MaterialSelect } from "../../../../../dropdown/material-dropdown";
import { MaterialInput } from "../../../../../material-input";
import {
  addPhysicalAttachment,
  editPhysicalAttachment,
} from "../../../../service";
import { HttpStatus } from "../../../../../../functional/httphelper";
import { PickListHelper } from "../../../../../../functional/picklists";

interface CreatePhyAttProps {
  attachment?: PhysicalAttachmentsType;
  open: boolean;
  onClose: () => void;
  corrId?: string;
  activateLoader?: (loading: boolean) => void;
  onSubmit: () => void;
}
export default function CreateNewPhysicalAttachment({
  attachment,
  onClose,
  open,
  corrId,
  activateLoader,
  onSubmit,
}: CreatePhyAttProps) {
  const { labels, isEnglish } = useLanguage();
  const [pickLists, setPickLists] = useState<PickListItemType[]>([]);

  const iconStyle: CSSProperties = {
    marginRight: isEnglish ? 10 : 0,
    marginLeft: isEnglish ? 0 : 10,
  };

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CreatePhysicalAttachmentType>({
    resolver: zodResolver(createPhysicalAttachmentSchema),
    mode: "all",
  });

  useEffect(() => {
    getLanguages();
  }, []);

  useEffect(() => {
    reset({
      corrId: corrId,
    });
  }, [corrId]);

  useEffect(() => {
    if (attachment) {
      reset({
        corrId: corrId,
        description: attachment?.description,
        physicalAttachmentTypePickListCode:
          attachment?.physicalAttachmentTypePickListCode,
        quantity: attachment?.quantity.toString(),
      });
    }
  }, [attachment]);

  const getLanguages = async () => {
    try {
      const pickLists = await PickListHelper.physicalAttachmentType();

      setPickLists(pickLists);
    } catch (error) {
      setPickLists([]);
    }
  };

  const onFinish = async (values: CreatePhysicalAttachmentType) => {
    if (attachment) {
      await updateAttachment(values);
    } else {
      await createNewOne(values);
    }
  };

  const createNewOne = async (values: CreatePhysicalAttachmentType) => {
    activateLoader && activateLoader(true);
    const response = await addPhysicalAttachment(values);
    if (response.status === HttpStatus.SUCCESS) {
      message.success(isEnglish ? "Uploaded Successfully" : "تم الرفع بنجاح");
      onSubmit();
    } else {
      message.error(
        isEnglish
          ? "Something went wrong! Please contact your system administrator"
          : "حدث خطأ ما، يرجى الاتصال بمسؤول النظام"
      );
    }
    activateLoader && activateLoader(false);
  };

  const updateAttachment = async (values: CreatePhysicalAttachmentType) => {
    if (!attachment) return;
    activateLoader && activateLoader(true);
    const response = await editPhysicalAttachment(values, attachment);
    if (response.status === HttpStatus.SUCCESS) {
      message.success(isEnglish ? "Updated Successfully" : "تم التحديث بنجاح");
      onSubmit();
    } else {
      message.error(
        isEnglish
          ? "Something went wrong! Please contact your system administrator"
          : "حدث خطأ ما، يرجى الاتصال بمسؤول النظام"
      );
    }
    activateLoader && activateLoader(false);
  };

  return (
    <Modal
      title={
        attachment ? (
          <>
            <EditFilled style={iconStyle} />
            {labels.btn.edit + " " + labels.til.physical_attachment}
          </>
        ) : (
          <>
            <FileAddFilled style={iconStyle} />
            {labels.btn.create + " " + labels.til.physical_attachment}
          </>
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
      <Form layout="vertical" style={{ marginBottom: 10, marginTop: 40 }}>
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
            name="physicalAttachmentTypePickListCode"
            control={control}
            render={({ field }) => (
              <MaterialSelect
                label={labels.lbl.type + " *"}
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
                error={errors.physicalAttachmentTypePickListCode?.message}
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
          <Button type="primary" onClick={handleSubmit(onFinish)}>
            {attachment ? <EditFilled /> : <PlusOutlined />}
            {attachment ? labels.btn.edit : labels.btn.create}
          </Button>
        </Col>
      </Form>
    </Modal>
  );
}
