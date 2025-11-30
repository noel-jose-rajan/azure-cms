import React, { useEffect, useMemo, useState } from "react";
import { Modal, Checkbox, message, Form, Button } from "antd";
import { Accordion } from "../../../../components/ui/accordions/accordion";
import { CheckboxChangeEvent } from "antd/es/checkbox";
import { useLanguage } from "../../../../context/language";
import { AppPrivilegeType } from "@/components/services/application-privilege/type";
import {
  createAppPrivilege,
  getProfileViews,
  updateAppPrivilege,
} from "@/components/services/application-privilege/service";
import { HttpStatus } from "@/components/functional/httphelper";
import { MaterialInput } from "@/components/ui/material-input";

const Header = ({ title }: { title?: string }) => (
  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
    <span>{title}</span>
  </div>
);

interface Props {
  open: boolean;
  onClose?: (refresh: boolean) => any;
  editValue?: AppPrivilegeType;
  privileges: AppPrivilegeType[];
  applicationViews: AppPrivilegeType[];
}

const CreateEditAppPrivilege: React.FC<Props> = ({
  open,
  onClose,
  editValue,
  privileges,
  applicationViews,
}) => {
  const { labels, isEnglish } = useLanguage();

  const [arabicLabel, setArabicLabel] = useState(editValue?.name_ar ?? "");
  const [englishLabel, setEnglishLabel] = useState(editValue?.name_en ?? "");
  const [groupCode, setGroupCode] = useState(editValue?.code ?? "");
  const [selectedViews, setSelectedViews] = useState<number[]>([]);

  const { lbl, btn } = labels;
  const isValid: boolean =
    englishLabel !== "" &&
    arabicLabel !== "" &&
    groupCode !== "" &&
    Array.isArray(selectedViews) &&
    selectedViews.length > 0 &&
    true;

  const uniqueGroupCode: boolean = useMemo(
    () => privileges.filter((f) => f.code === groupCode).length === 0,
    [privileges, groupCode]
  );

  const [form] = Form.useForm();

  useEffect(() => {
    if (editValue) {
      getProfileView(editValue.id);
      form.setFieldsValue({
        arabicLabel: editValue?.name_ar ?? "",
        englishLabel: editValue?.name_en ?? "",
        groupCode: editValue?.code ?? "",
      });
    }
  }, [editValue]);

  const getProfileView = async (id: number) => {
    try {
      const response = await getProfileViews(id);
      if (response.status === HttpStatus.SUCCESS && response.data) {
        setSelectedViews(response.data.Data ?? []);
      } else {
        setSelectedViews([]);
      }
    } catch (error) {
      setSelectedViews([]);
    }
  };

  const validateFields = () => {
    // Trigger validation
    form
      .validateFields()
      .then(() => {
        // Validation passed, proceed with submission
        handleSubmit();
      })
      .catch((e) => {
        // Valeidation failed, error messages are automatically shown
        console.log(e);

        message.error(
          isEnglish
            ? "Please fill in all the fields and select at least one group."
            : "يرجى ملء جميع الحقول واختيار مجموعة واحدة على الأقل."
        );
      });
  };

  const handleSubmit = async () => {
    try {
      const response = await (editValue
        ? updateAppPrivilege(
            {
              views: selectedViews,
              name_ar: arabicLabel,
              name_en: englishLabel,
            },
            editValue.id
          )
        : createAppPrivilege({
            views: selectedViews,
            name_ar: arabicLabel,
            name_en: englishLabel,
            code: groupCode,
          }));

      if (response.status === HttpStatus.SUCCESS) {
        const successMessage = editValue
          ? isEnglish
            ? "Profile updated successfully!"
            : "تم تحديث الملف الشخصي بنجاح!"
          : isEnglish
          ? "Profile created successfully!"
          : "تم إنشاء الملف الشخصي بنجاح!";
        message.success(successMessage);
      } else {
        throw new Error("Operation failed");
      }
    } catch (error) {
      const errorMessage = editValue
        ? isEnglish
          ? "Failed to update profile. Please try again."
          : "فشل في تحديث الملف الشخصي. حاول مرة أخرى."
        : isEnglish
        ? "Failed to create profile. Please try again."
        : "فشل في إنشاء الملف الشخصي. حاول مرة أخرى.";
      message.error(errorMessage);
    }

    onClose && onClose(true);
  };

  const handleCancel = () => {
    onClose && onClose(false);
  };

  const handleSelectGroups = (
    current: CheckboxChangeEvent,
    group: AppPrivilegeType
  ) => {
    const isChecked = current.target.checked;

    setSelectedViews((prev) =>
      isChecked ? [...prev, group.id] : prev.filter((id) => id !== group.id)
    );
  };

  return (
    <Modal
      title={lbl.profile_views}
      open={open}
      onCancel={handleCancel}
      footer={[
        <Button onClick={handleCancel}>{btn.cancel}</Button>,
        <Button
          disabled={!isValid || (!editValue && !uniqueGroupCode)}
          onClick={validateFields}
          type="primary"
        >
          {btn.submit}
        </Button>,
      ]}
      width={"80%"}
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{ arabicLabel, englishLabel, groupCode }}
      >
        <Form.Item
          name="arabicLabel"
          rules={[
            {
              required: true,
              message: isEnglish
                ? "Arabic profile name is required!"
                : "اسم الملف الشخصي بالعربية مطلوب!",
            },
          ]}
          className="app-privilage-form-item"
        >
          <MaterialInput
            required
            label={lbl.profile_name_ar}
            value={arabicLabel}
            onChange={(e: any) => setArabicLabel(e.target.value)}
            style={{ marginTop: 20 }}
            error={form.getFieldError("arabicLabel")[0]}
          />
        </Form.Item>
        <Form.Item
          name="englishLabel"
          rules={[
            {
              required: true,
              message: isEnglish
                ? "English profile name is required!"
                : "اسم الملف الشخصي بالإنجليزية مطلوب!",
            },
          ]}
          className="app-privilage-form-item"
        >
          <MaterialInput
            required
            label={lbl.profile_name_en}
            value={englishLabel}
            onChange={(e: any) => setEnglishLabel(e.target.value)}
            style={{ marginTop: 20 }}
            error={form.getFieldError("englishLabel")[0]}
          />
        </Form.Item>
        <Form.Item
          name="groupCode"
          rules={[
            {
              required: true,
              message: isEnglish
                ? "Profile code is required!"
                : "رمز الملف الشخصي مطلوب!",
            },
          ]}
          className="app-privilage-form-item"
        >
          <MaterialInput
            required
            allowEdit={editValue ? false : true}
            label={lbl.profile_code}
            value={groupCode}
            onChange={(e: any) => setGroupCode(e.target.value)}
            error={
              form.getFieldError("groupCode")[0] ||
              (!editValue && !uniqueGroupCode
                ? "Group code already exists"
                : "")
            }
            style={{ marginTop: 20 }}
          />
        </Form.Item>
        <Accordion
          children={
            <div style={{ maxHeight: "300px", overflow: "scroll" }}>
              {applicationViews?.map((item) => (
                <div key={item.id}>
                  <Checkbox
                    onChange={(e) => handleSelectGroups(e, item)}
                    checked={selectedViews.includes(item.id)}
                    style={{ marginRight: 8 }}
                  >
                    {isEnglish ? item.name_en : item.name_ar}
                  </Checkbox>
                </div>
              ))}
            </div>
          }
          header={
            <Header title={`${lbl.profile_views} (${selectedViews.length})`} />
          }
          panelKey="0"
        />
      </Form>
    </Modal>
  );
};

export default CreateEditAppPrivilege;
