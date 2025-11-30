import { ChangeEvent, useState } from "react";
import { useLanguage } from "@/context/language";
import { Col, Modal, Typography } from "antd";
import useHandleError from "@/components/hooks/useHandleError";
import { MaterialInput } from "@/components/ui/material-input";
import ButtonComponent from "@/components/ui/button";
import { CloseOutlined } from "@ant-design/icons";
import { adminCancelDelegation } from "../../service";
import useCustomMessage from "@/components/hooks/use-message";
type Props = {
  onClose: () => void;
  onSubmit: () => void;
  id: number;
};
const CancelModal = ({ onClose, onSubmit, id }: Props) => {
  const { showMessage } = useCustomMessage();

  const { handleError } = useHandleError();
  const { labels } = useLanguage();
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCancel = async () => {
    try {
      setLoading(true);
      const res = await adminCancelDelegation({ id, comments: input });
      if (res) {
        showMessage("success", labels.msg.delegation_cancel_message);
        onClose();
        onSubmit();
      }
    } catch (e) {
      handleError(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      afterClose={() => onClose()}
      open={true}
      onCancel={() => onClose()}
      width={500}
      title={<Typography>{labels.lbl.cancel}</Typography>}
      footer={<></>}
      centered
      style={{ marginBottom: 50 }}
    >
      <Col
        span={24}
        style={{ marginTop: 20, display: "flex", justifyContent: "end" }}
      >
        <MaterialInput
          label={labels.lbl.comment}
          value={input}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setInput(e?.target?.value)
          }
        />
      </Col>
      <Col
        span={24}
        style={{ marginTop: 20, display: "flex", justifyContent: "end" }}
      >
        <ButtonComponent
          buttonLabel={labels.btn.cancel + " " + labels.mnu.delegation}
          type="primary"
          style={{ marginInline: 8 }}
          icon={<CloseOutlined />}
          spinning={loading}
          disabled={!input}
          onClick={handleCancel}
        />
      </Col>
    </Modal>
  );
};

export default CancelModal;
