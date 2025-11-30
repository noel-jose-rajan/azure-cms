import { Modal, Button, Form } from "antd";
import { useLanguage } from "../../../../../context/language";
import { MaterialInput } from "../../../../../components/ui/material-input";
import { AnnouncementGroupsType } from "@/components/services/announcement-groups/type";

interface Props {
  isCreateModalVisible?: boolean;
  setIsCreateModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
  handleCreateGroup: (values: any) => any;
  checkIfGroupIdExists: (groupId: number) => any;
  defaultValues?: AnnouncementGroupsType;
  onClose?: () => any;
}

export default function CreateEditForm({
  isCreateModalVisible,
  setIsCreateModalVisible,
  handleCreateGroup,
  checkIfGroupIdExists,
  defaultValues,
  onClose,
}: Props) {
  const {
    isEnglish,
    labels: { lbl },
  } = useLanguage();

  const [form] = Form.useForm();

  return (
    <Modal
      title={isEnglish ? "Create Announcement Group" : "إنشاء مجموعة إعلان"}
      open={isCreateModalVisible}
      onCancel={() => {
        setIsCreateModalVisible(false);
        onClose && onClose();
      }}
      onClose={() => {
        onClose && onClose();
      }}
      footer={null}
    >
      <Form
        form={form}
        onFinish={handleCreateGroup}
        layout="vertical"
        initialValues={{
          code: defaultValues?.entity_code ? defaultValues?.entity_code : "",
          name_en: defaultValues?.name_en ?? "",
          name_ar: defaultValues?.name_ar ?? "",
          email: defaultValues?.email ?? "",
        }}
      >
        <Form.Item
          name="code"
          rules={[
            {
              required: true,
              message: isEnglish
                ? "Group ID is required"
                : "معرف المجموعة مطلوب",
            },
            {
              validator: (_, value) => {
                if (checkIfGroupIdExists(value)) {
                  return Promise.reject(
                    isEnglish
                      ? "Group ID already exists"
                      : "معرف المجموعة موجود بالفعل"
                  );
                }
                return Promise.resolve();
              },
            },
          ]}
        >
          <MaterialInput
            value={form.getFieldValue("code")}
            allowEdit={defaultValues === undefined ? true : false}
            enableTranscript={false}
            label={lbl.announce_grp_code}
            error={form.getFieldError("code").join(" ")}
            onChange={(e: any) => {
              form.setFieldsValue({ code: e.target.value });
            }}
            onBlur={() => {
              form.validateFields(["code"]);
            }}
          />
        </Form.Item>

        <Form.Item
          name="name_en"
          rules={[
            {
              required: true,
              message: isEnglish
                ? "Group name is required"
                : "اسم المجموعة مطلوب",
            },
          ]}
        >
          <MaterialInput
            value={form.getFieldValue("name_en")}
            label={lbl.announce_grp_name_en}
            error={form.getFieldError("name_en").join(" ")}
            onChange={(e: any) => {
              form.setFieldsValue({ name_en: e.target.value });
            }}
            onBlur={() => {
              form.validateFields(["name_en"]);
            }}
          />
        </Form.Item>

        <Form.Item
          name="name_ar"
          rules={[
            {
              required: true,
              message: isEnglish
                ? "Arabic name is required"
                : "الاسم بالعربية مطلوب",
            },
          ]}
        >
          <MaterialInput
            value={form.getFieldValue("name_ar")}
            label={lbl.announce_grp_name_ar}
            error={form.getFieldError("name_ar").join(" ")}
            onChange={(e: any) => {
              form.setFieldsValue({ name_ar: e.target.value });
            }}
            onBlur={() => {
              form.validateFields(["name_ar"]);
            }}
          />
        </Form.Item>

        <Form.Item
          name="email"
          rules={[
            {
              required: true,
              message: isEnglish
                ? "Email is required"
                : "البريد الإلكتروني مطلوب",
            },
            {
              type: "email",
              message: isEnglish
                ? "Please enter a valid email"
                : "الرجاء إدخال بريد إلكتروني صالح",
            },
          ]}
        >
          <MaterialInput
            value={form.getFieldValue("email")}
            label={lbl.announce_grp_email}
            enableTranscript={false}
            error={form.getFieldError("email").join(" ")}
            onChange={(e: any) => {
              form.setFieldsValue({ email: e.target.value });
            }}
            onBlur={() => {
              form.validateFields(["email"]);
            }}
          />
        </Form.Item>

        <Form.Item name="submit">
          <Button type="primary" htmlType="submit">
            {isEnglish
              ? defaultValues
                ? "Update"
                : "Create"
              : defaultValues
              ? "تحديث"
              : "إنشاء"}
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
}
