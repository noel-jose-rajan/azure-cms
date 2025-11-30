import { CloseOutlined } from "@ant-design/icons";
import { Modal, Typography } from "antd";
import { useLanguage } from "../../../context/language";
import { ReactElement } from "react";
import ButtonComponent from "../button";

interface ModalProps {
  title: React.ReactNode;
  description: string;
  visible: boolean;
  onClose?: () => void;
  onSubmit: () => any;
  okText: string;
  okIcon?: ReactElement;
  loading?: boolean;
}

export default function ModalComponent({
  description,
  onClose,
  title,
  visible,
  onSubmit,
  okText,
  okIcon,
  loading,
}: ModalProps) {
  const { isEnglish, labels } = useLanguage();

  return (
    <Modal
      title={<Typography>{title ?? labels.msg.are_you_sure}</Typography>}
      centered
      open={visible}
      okText={labels.btn.delete}
      onCancel={onClose}
      cancelText={labels.btn.cancel}
      width={400}
      zIndex={20}
      closable={onClose !== undefined}
      footer={
        <div>
          {onClose && (
            <ButtonComponent
              style={{
                marginLeft: isEnglish ? 10 : 0,
                marginRight: isEnglish ? 0 : 10,
              }}
              onClick={onClose}
              icon={<CloseOutlined />}
              buttonLabel={labels.btn.cancel}
            />
          )}
          <ButtonComponent
            onClick={onSubmit}
            style={{
              marginLeft: isEnglish ? 10 : 0,
              marginRight: isEnglish ? 0 : 10,
            }}
            type="primary"
            icon={okIcon}
            spinning={loading}
            buttonLabel={okText}
          />
        </div>
      }
    >
      <p
        style={{
          marginBottom: 30,
          textWrap: "balance",
        }}
      >
        {description}
      </p>
    </Modal>
  );
}
