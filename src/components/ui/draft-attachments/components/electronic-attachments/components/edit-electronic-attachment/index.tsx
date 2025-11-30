import { Button, Col, Form, Modal, message } from "antd";
import { CloseOutlined, EditFilled, FileAddFilled } from "@ant-design/icons";
import { CSSProperties, ChangeEvent, useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLanguage } from "../../../../../../../context/language";
import {
  ElectronicAttachmentType,
  UpdateElectronicAttachmentType,
  updateElectronicAttachmentSchema,
} from "../../../../../../../pages/create-inbound/types";
import { PickListItemType } from "../../../../../../../pages/pick-lists/service";
import { PickListHelper } from "../../../../../../functional/picklists";
import { updateElectronicAttachment } from "../../../../service";
import { HttpStatus } from "../../../../../../functional/httphelper";
import { MaterialInput } from "../../../../../material-input";
import { MaterialSelect } from "../../../../../dropdown/material-dropdown";

interface CreatePhyAttProps {
  attachment: ElectronicAttachmentType;
  open: boolean;
  onClose: () => void;
  corrId?: string;
  activateLoader: (loading: boolean) => void;
  onSubmit: () => void;
}
export default function UpdateElectronicAttachment({
  attachment,
  onClose,
  open,
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
  } = useForm<UpdateElectronicAttachmentType>({
    resolver: zodResolver(updateElectronicAttachmentSchema),
    mode: "all",
    defaultValues: {
      description: attachment.description,
      documentTypePickListCode: attachment.documentTypePickListCode,
      name: attachment.name,
    },
  });

  useEffect(() => {
    getDocTypes();
  }, []);

  const getDocTypes = async () => {
    try {
      const pickLists = await PickListHelper.documentType();

      setPickLists(pickLists);
    } catch (error) {
      setPickLists([]);
    }
  };

  const updateAttachment = async (values: UpdateElectronicAttachmentType) => {
    if (!attachment) return;
    activateLoader(true);
    const response = await updateElectronicAttachment(
      attachment.electronicAttachmentId,
      values
    );
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
    activateLoader(false);
  };

  return (
    <Modal
      title={
        attachment ? (
          <>
            <EditFilled style={iconStyle} />
            {labels.btn.edit + " " + labels.til.electronic_attachment}
          </>
        ) : (
          <>
            <FileAddFilled style={iconStyle} />
            {labels.btn.create + " " + labels.til.electronic_attachment}
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
            name="name"
            control={control}
            render={({ field }) => (
              <MaterialInput
                label={labels.lbl.name + " *"}
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
        <Col style={{ marginTop: 20 }}>
          <Controller
            name="documentTypePickListCode"
            control={control}
            render={({ field }) => (
              <MaterialSelect
                value={field.value ?? ""}
                label={labels.lbl.description + " *"}
                options={pickLists.map((classification: PickListItemType) => {
                  return {
                    label: isEnglish
                      ? classification.picklistEnLabel
                      : classification.picklistArLabel,
                    value: classification.picklistCode,
                  };
                })}
                onChange={(value: string) => {
                  field.onChange(value);
                }}
                style={{ height: 45 }}
                error={errors.documentTypePickListCode?.message}
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
          <Button type="primary" onClick={handleSubmit(updateAttachment)}>
            <EditFilled /> {labels.btn.edit}
          </Button>
        </Col>
      </Form>
    </Modal>
  );
}
