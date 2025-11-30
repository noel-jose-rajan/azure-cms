import { HttpStatus } from "@/components/functional/httphelper";
import { deleteUserTitle } from "@/components/services/user-preference";
import { useLanguage } from "@/context/language";
import { CloseOutlined, DeleteFilled } from "@ant-design/icons";
import { Button, message, Modal } from "antd";
import React, { FC } from "react";

interface Props {
  visible: boolean;
  onClose: (value: boolean) => void;
  titleId: number;
}

const DeleteTitleModal: FC<Props> = ({ visible, onClose, titleId }) => {
  const {
    labels: { btn, lbl },
    isEnglish,
  } = useLanguage();

  const handleDeleteTitle = async () => {
    try {
      const response = await deleteUserTitle(titleId);
      if (response.status === HttpStatus.SUCCESS) {
        message.success(response.message);
        onClose(true);
      } else {
        message.error(
          isEnglish
            ? response?.message || "Failed to delete title"
            : response?.message || "فشل في حذف العنوان"
        );
      }
    } catch (error) {
      message.error(
        isEnglish ? "An unexpected error occurred" : "حدث خطأ غير متوقع"
      );
    }
  };

  return (
    <Modal
      open={visible}
      title={isEnglish ? "Confirm Delete" : "تأكيد الحذف"}
      onCancel={() => onClose(false)}
      footer={
        <>
          <div style={{ marginTop: 25 }}>
            <Button onClick={() => onClose(false)} style={{ margin: "0 15px" }}>
              <CloseOutlined />
              {btn.cancel}
            </Button>

            <Button type="primary" onClick={handleDeleteTitle}>
              <DeleteFilled />
              {btn.delete}
            </Button>
          </div>
        </>
      }
    >
      <p>
        {isEnglish
          ? "Are you sure you want to delete this title?"
          : "هل أنت متأكد أنك تريد حذف هذا العنوان؟"}
      </p>
    </Modal>
  );
};

export default DeleteTitleModal;
