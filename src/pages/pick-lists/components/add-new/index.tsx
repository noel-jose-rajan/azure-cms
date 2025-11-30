import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Col, Form, Modal } from "antd";
import { Controller, useForm } from "react-hook-form";
import { LANGUAGE } from "../../../../constants/language";
import { useLanguage } from "../../../../context/language";
import { englishLabels } from "../../../../constants/app-constants/en";
import { arabicLabels } from "../../../../constants/app-constants/ar";
import { CSSProperties, useEffect, useState } from "react";
import {
  CloseOutlined,
  EditFilled,
  FolderAddFilled,
  PlusOutlined,
} from "@ant-design/icons";
import { MaterialInput } from "../../../../components/ui/material-input";
import { useTheme } from "../../../../context/theme";
import {
  CreatePickListItemType,
  PickList,
  PickListType,
  createPickListSchema,
} from "../../../../components/services/picklist/type";

interface AddNewPickListProps {
  title: string;
  pickListItem?: PickList;
  pickList?: PickListType;
  visible: boolean;
  onSubmit: (item: CreatePickListItemType) => void;
  onCancel: () => void;
  allPickLists: PickList[];
}

export default function AddNewPickListItem({
  onCancel,
  onSubmit,
  title,
  visible,
  pickListItem,
  pickList,
  allPickLists,
}: AddNewPickListProps) {
  const {
    control,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors },
    setError,
    clearErrors,
  } = useForm<CreatePickListItemType>({
    resolver: zodResolver(createPickListSchema),
    defaultValues: {
      picklist_ar_label: pickListItem?.picklist_ar_label || "",
      picklist_en_label: pickListItem?.picklist_en_label || "",
      picklist_name: pickList?.picklistName || "",
      picklist_code: pickListItem?.picklist_code || "",
    },
  });
  const [errorMessage, setErrorMessage] = useState<string>("");

  const { language } = useLanguage();
  const isEnglish = language === LANGUAGE.ENGLISH_INT;
  const { theme } = useTheme();
  const labels = isEnglish ? englishLabels : arabicLabels;

  useEffect(() => {
    if (pickList) {
      setValue("picklist_name", pickList.picklistName);
    }

    if (pickListItem) {
      setValue("picklist_ar_label", pickListItem.picklist_ar_label);
      setValue("picklist_en_label", pickListItem.picklist_en_label);
      setValue("picklist_id", pickListItem.picklist_id);
      setValue("picklist_code", pickListItem.picklist_code);
    }
  }, [pickList, pickListItem]);

  const onFinish = async (values: CreatePickListItemType) => {
    onSubmit(values);
    resetValues();
    setErrorMessage("");
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo, getValues());
  };

  const iconStyle: CSSProperties = {
    marginLeft: isEnglish ? 0 : 10,
    marginRight: isEnglish ? 10 : 0,
  };

  const resetValues = () => {
    setValue("picklist_ar_label", "");
    setValue("picklist_en_label", "");
    setValue("picklist_code", "");
    setErrorMessage("");
  };

  const checkCodeExists = (picklist_code: string) => {
    if (picklist_code === "") {
      setError("picklist_code", {
        type: "required",
        message: isEnglish
          ? "The Picklist code is required"
          : "شفرة قائمة الاختيار مطلوبة",
      });
      return;
    }

    const filteredPL = allPickLists?.find(
      (pl) => pl.picklist_code === picklist_code
    );

    if (filteredPL) {
      setError("picklist_code", {
        type: "required",
        message: isEnglish
          ? "The Picklist code already exists"
          : "رمز قائمة الاختيار موجود بالفعل",
      });
      return true;
    } else {
      clearErrors("picklist_code");
    }
  };

  const checkEnNameExists = (pl_en_name: string) => {
    if (pl_en_name.trim() === "") {
      setError("picklist_en_label", {
        type: "required",
        message: isEnglish
          ? "The Picklist english name is required"
          : "اسم قائمة الاختيار الإنجليزية مطلوب",
      });
      return;
    }

    const filteredPL = allPickLists.filter(
      (pl) => pl.picklist_name === pickList?.picklistName
    );

    const isDuplicate = filteredPL.some((pl) =>
      pickListItem?.picklist_id
        ? pl.picklist_id !== pickListItem.picklist_id &&
          pl.picklist_en_label === pl_en_name.trim()
        : pl.picklist_en_label === pl_en_name.trim()
    );

    if (isDuplicate) {
      setError("picklist_en_label", {
        type: "required",
        message: isEnglish
          ? "The Picklist Name already exists"
          : "اسم قائمة الاختيار موجود بالفعل",
      });
      return;
    } else {
      clearErrors("picklist_en_label");
      return;
    }
  };

  const checkArNameExists = (pl_ar_name: string) => {
    if (pl_ar_name.trim() === "") {
      setError("picklist_ar_label", {
        type: "required",
        message: isEnglish
          ? "The Picklist arabic name is required"
          : "اسم قائمة الاختيار العربية مطلوب",
      });
      return;
    }

    const filteredPL = allPickLists.filter(
      (pl) => pl.picklist_name === pickList?.picklistName
    );

    const isDuplicate = filteredPL.some((pl) =>
      pickListItem?.picklist_id
        ? pl.picklist_id !== pickListItem.picklist_id &&
          pl.picklist_ar_label === pl_ar_name.trim()
        : pl.picklist_ar_label === pl_ar_name.trim()
    );

    if (isDuplicate) {
      setError("picklist_ar_label", {
        type: "required",
        message: isEnglish
          ? "The Picklist Name already exists"
          : "اسم قائمة الاختيار موجود بالفعل",
      });
      return;
    } else {
      clearErrors("picklist_ar_label");
      return;
    }
  };

  return (
    <Modal
      title={
        <>
          <FolderAddFilled style={iconStyle} />
          {title}
        </>
      }
      centered
      open={visible}
      onCancel={() => {
        resetValues();
        setErrorMessage("");
        onCancel();
      }}
      width={500}
      style={{ paddingBottom: 40 }}
      footer={
        <Col style={{ marginTop: 40 }}>
          <Button
            style={{ marginLeft: 10, marginRight: 10 }}
            onClick={() => {
              setErrorMessage("");
              onCancel();
              resetValues();
            }}
          >
            <CloseOutlined style={iconStyle} />
            {labels.btn.cancel}
          </Button>
          <Button type="primary" onClick={handleSubmit(onFinish)}>
            {pickListItem ? (
              <>
                <EditFilled style={iconStyle} />
                {labels.btn.edit}
              </>
            ) : (
              <>
                <PlusOutlined style={iconStyle} />
                {labels.btn.create}
              </>
            )}
          </Button>
        </Col>
      }
    >
      <Form
        onFinishFailed={onFinishFailed}
        layout="vertical"
        style={{ marginBottom: 10, marginTop: 40 }}
      >
        {!pickListItem?.picklist_id && (
          <Col style={{ marginTop: 20 }}>
            <Controller
              name="picklist_code"
              control={control}
              render={({ field }) => (
                <MaterialInput
                  label={isEnglish ? "Code" : "شفرة"}
                  {...field}
                  style={{ height: 50 }}
                  error={errors.picklist_code?.message}
                  allowEdit={!pickListItem?.picklist_id}
                  onChange={(e: any) => {
                    field.onChange(e.target.value);
                    checkCodeExists(e.target.value);
                  }}
                />
              )}
            />
          </Col>
        )}
        <Col style={{ marginTop: 20 }}>
          <Controller
            name="picklist_ar_label"
            control={control}
            render={({ field }) => (
              <MaterialInput
                label={labels.lbl.picklist_ar_label}
                {...field}
                style={{ height: 50 }}
                error={errors.picklist_ar_label?.message}
                onChange={(e: any) => {
                  field.onChange(e.target.value);
                  checkArNameExists(e.target.value);
                }}
              />
            )}
          />
        </Col>
        <Col style={{ marginTop: 20 }}>
          <Controller
            name="picklist_en_label"
            control={control}
            render={({ field }) => (
              <MaterialInput
                label={labels.lbl.picklist_en_label}
                {...field}
                style={{ height: 50 }}
                error={errors.picklist_en_label?.message}
                onChange={(e: any) => {
                  field.onChange(e.target.value);
                  checkEnNameExists(e.target.value);
                }}
              />
            )}
          />
        </Col>
        <span style={{ fontSize: "14px", color: theme.colors.danger }}>
          {errorMessage}
        </span>
      </Form>
    </Modal>
  );
}
