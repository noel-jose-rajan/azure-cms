import { useLanguage } from "@/context/language";
import { useTheme } from "@/context/theme";
import { CloseOutlined } from "@ant-design/icons";
import { Col, Modal } from "antd";
import { CSSProperties, FC, ReactNode } from "react";

interface ConfirmModalProps {
  visible: boolean;
  updateVisible: (open: boolean) => void;
  submitAction: () => void;
  content: ReactNode;
  Icon?: ReactNode | string;
  title: string;
  ButtonIcon?: ReactNode;
  onCancel?: () => void;
}

const ConfirmModal: FC<ConfirmModalProps> = ({
  visible,
  updateVisible,
  submitAction,
  content,
  Icon,
  title,
  ButtonIcon,
  onCancel,
}) => {
  const { isEnglish, labels } = useLanguage();

  const iconStyle: CSSProperties = {
    marginLeft: isEnglish ? 0 : 10,
    marginRight: isEnglish ? 10 : 0,
  };

  return (
    <Modal
      title={
        <Col style={{ display: "flex", flexDirection: "row" }}>
          {Icon}
          {title}
        </Col>
      }
      centered
      open={visible}
      cancelText={
        <div style={{ display: "flex", flexWrap: "nowrap" }}>
          <CloseOutlined style={iconStyle} />
          {labels.btn.cancel}
        </div>
      }
      okText={
        <div style={{ display: "flex", flexWrap: "nowrap" }}>
          {ButtonIcon ?? Icon}
        </div>
      }
      onOk={submitAction}
      onCancel={() => {
        updateVisible(false);
        onCancel && onCancel();
      }}
      width={400}
    >
      <p style={{ marginBottom: 30 }}>{content}</p>
    </Modal>
  );
};

export default ConfirmModal;
