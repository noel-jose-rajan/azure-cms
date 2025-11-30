import { MaterialInput } from "@/components/ui/material-input";
import { Button, message, Modal } from "antd";
import React, { FC, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { UserTitleType } from "@/components/services/user-preference/type";
import { useLanguage } from "@/context/language";
import { CloseOutlined, EditFilled, PlusOutlined } from "@ant-design/icons";
import {
  addUserTitle,
  updateUserTitle,
} from "@/components/services/user-preference";
import { HttpStatus } from "@/components/functional/httphelper";

interface Props {
  userId: number;
  allTitles: UserTitleType[];
  visible: boolean;
  title?: UserTitleType;
  onClose: () => void;
  updateAllTitles?: (titles: UserTitleType[]) => void;
}

const TitleSchema = z.object({
  user_id: z.number(),
  title_en: z.string().min(1, {
    message: "English title is required",
  }),
  title_ar: z.string().min(1, {
    message: "Arabic title is required",
  }),
  id: z.number().optional(),
  isdefault: z.boolean(),
});

export type TitleSchemaType = z.infer<typeof TitleSchema>;

const AddEditTitle: FC<Props> = ({
  userId,
  allTitles,
  visible,
  title,
  onClose,
  updateAllTitles,
}) => {
  const {
    labels: { lbl, btn },
    isEnglish,
  } = useLanguage();
  const [loading, setLoading] = useState<boolean>(false);
  const {
    control,
    formState: { errors },
    handleSubmit,
  } = useForm<TitleSchemaType>({
    resolver: zodResolver(TitleSchema),
    mode: "onChange",
    defaultValues: {
      user_id: userId,
      isdefault: allTitles.length === 0 ? true : false,
      id: title?.id,
      title_ar: title?.title_ar,
      title_en: title?.title_en,
    },
  });

  const onSubmit = async (values: TitleSchemaType) => {
    if (title) {
      await updateTitles(values);
    } else {
      await createUserTitle(values);
    }
  };

  const updateTitles = async (values: TitleSchemaType) => {
    try {
      const response = await updateUserTitle(values);
      if (response.status === HttpStatus.SUCCESS) {
        message.success(response.message);
        let clonedTitles = [...allTitles];

        clonedTitles = clonedTitles.map((t) => {
          if (t.id === title?.id) {
            return {
              ...t,
              title_ar: values.title_ar,
              title_en: values.title_en,
            };
          } else {
            return t;
          }
        });

        updateAllTitles && updateAllTitles([...clonedTitles]);

        onClose();
      } else {
        message.error(
          isEnglish
            ? response?.message || "Failed to update title"
            : response?.message || "فشل في تحديث العنوان"
        );
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        message.error(
          isEnglish ? error.errors[0].message : "حدث خطأ غير متوقع"
        );
      } else {
        message.error(
          isEnglish ? "An unexpected error occurred" : "حدث خطأ غير متوقع"
        );
      }
    }
  };

  const createUserTitle = async (values: TitleSchemaType) => {
    try {
      const response = await addUserTitle(values);
      if (response.status === HttpStatus.SUCCESS && response.data) {
        message.success(response.message);
        const clonedTitles = [...allTitles];

        updateAllTitles &&
          updateAllTitles([...clonedTitles, response.data.data]);

        onClose();
      } else {
        message.error(
          isEnglish
            ? response?.message || "Failed to add title"
            : response?.message || "فشل في إضافة العنوان"
        );
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        message.error(
          isEnglish ? error.errors[0].message : "حدث خطأ غير متوقع"
        );
      } else {
        message.error(
          isEnglish ? "An unexpected error occurred" : "حدث خطأ غير متوقع"
        );
      }
    }
  };

  return (
    <Modal
      open={visible}
      title={`${btn.create} ${lbl.user_title}`}
      cancelText={lbl.cancel}
      okText={lbl.yes}
      onCancel={onClose}
      footer={
        <>
          <div style={{ marginTop: 25 }}>
            <Button onClick={onClose} style={{ margin: "0 15px" }}>
              <CloseOutlined />
              {btn.cancel}
            </Button>
            <Button type="primary" onClick={handleSubmit(onSubmit)}>
              {loading !== true ? (
                title ? (
                  <EditFilled />
                ) : (
                  <PlusOutlined />
                )
              ) : (
                <></>
              )}
              {title ? btn.save : btn.create}
            </Button>
          </div>
        </>
      }
    >
      <br />
      <Controller
        name="title_ar"
        control={control}
        render={({ field }) => (
          <MaterialInput
            label={lbl.user_ar_name}
            {...field}
            error={errors.title_ar?.message}
          />
        )}
      />
      <br />
      <Controller
        name="title_en"
        control={control}
        render={({ field }) => (
          <MaterialInput
            label={lbl.user_en_name}
            {...field}
            error={errors.title_en?.message}
          />
        )}
      />
      <br />
    </Modal>
  );
};

export default AddEditTitle;
