import { Button, Col, Modal } from "antd";
import { useLanguage } from "../../../../../../context/language";
import { CloseOutlined, SendOutlined } from "@ant-design/icons";
import { MaterialInput } from "../../../../../../components/ui/material-input";
import { CSSProperties, ChangeEvent, useState } from "react";

interface DelayCorrespondenceProps {
  visible: boolean;
  onClose: () => void;
  onSubmit?: (comment: string) => void;
}

export default function DelayCorrespondence({
  visible,
  onClose,
  onSubmit,
}: DelayCorrespondenceProps) {
  const { labels, isEnglish } = useLanguage();
  const [comment, setComment] = useState<string>("");

  const iconStyle: CSSProperties = {
    marginLeft: isEnglish ? 0 : 10,
    marginRight: isEnglish ? 10 : 0,
  };

  return (
    <Modal
      open={visible}
      onCancel={onClose}
      onClose={onClose}
      title={
        <>
          <SendOutlined style={iconStyle} />
          {labels.btn.task_sendDelayComment}
        </>
      }
      centered
      width={600}
      footer={<></>}
    >
      <Col style={{ marginTop: 20 }}>
        <MaterialInput
          label={labels.lbl.comment + " *"}
          value={comment}
          onChange={(e: ChangeEvent<HTMLInputElement>) => {
            setComment(e.target.value);
          }}
        />
      </Col>
      <Col
        style={{
          marginTop: 30,
          marginBottom: 20,
          display: "flex",
          justifyContent: "flex-end",
        }}
      >
        <Button style={{ marginLeft: 10, marginRight: 10 }} onClick={onClose}>
          <CloseOutlined />
          {labels.btn.cancel}
        </Button>
        <Button
          type="primary"
          disabled={comment.trim() === ""}
          onClick={() => {
            onSubmit && onSubmit(comment);
          }}
        >
          <SendOutlined />
          {labels.btn.submit}
        </Button>
      </Col>
    </Modal>
  );
}
