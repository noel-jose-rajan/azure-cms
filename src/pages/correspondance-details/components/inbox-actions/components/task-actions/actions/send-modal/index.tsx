import { Button, Checkbox, Col, Modal, Typography } from "antd";
import { CloseOutlined, SendOutlined } from "@ant-design/icons";
import { ChangeEvent, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useLanguage } from "@/context/language";

import { MaterialInput } from "@/components/ui/material-input";
import Picklist from "@/components/shared/picklist";
import { CONST_DATA } from "@/constants/app";
import {
  Actions,
  completeTask,
  CompleteTaskPayload,
} from "@/components/services/inbox";
import useHandleError from "@/components/hooks/useHandleError";
import ButtonComponent from "@/components/ui/button";
import useCustomMessage from "@/components/hooks/use-message";

interface ReviewedProps {
  onClose: () => void;
  label: string;
  action: Actions | undefined;
}

export default function SendTaskModal({
  onClose,
  label,
  action,
}: ReviewedProps) {
  const { showMessage } = useCustomMessage();

  const { id } = useParams();
  const { labels } = useLanguage();
  const [payload, setPayload] = useState<{
    comment: string;
    method: number;
    printed: boolean;
  }>({
    comment: "",
    method: 0,
    printed: false,
  });
  const [printed, setPrinted] = useState(false);
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();
  const { handleError } = useHandleError();
  const updatePayload = (key: keyof typeof payload, value: any) => {
    setPayload((prev) => ({ ...prev, [key]: value }));
  };
  const resetAll = () => {
    setPrinted(false);
  };
  useEffect(() => {
    resetAll();
  }, [payload.method]);

  const handleCompleteTask = async () => {
    try {
      setLoading(true);
      const body: CompleteTaskPayload = {
        comments: payload.comment || "",
        data: {
          method: payload.method,
        },
        id: action?.ID || 0,
      };
      const response = await completeTask(id || "", body);
      if (response) {
        showMessage("success", labels.msg.task_submitted);
        navigate("/user/inbox", { replace: true });
      }
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  };

  const shouldDisableButton =
    !payload.method ||
    (payload.method === CONST_DATA.Send_task_By_Post_Office_id && !printed) ||
    payload.method === CONST_DATA.Send_task_By_G2G;
  return (
    <Modal
      open={true}
      onCancel={onClose}
      onClose={onClose}
      title={<Typography>{label}</Typography>}
      centered
      width={600}
      footer={<></>}
    >
      <Col style={{ marginTop: 20 }}>
        <Picklist
          code="outbound sending type"
          label={labels.lbl.sending_method + " *"}
          value={payload.method}
          onChange={(value) => updatePayload("method", value)}
        />
      </Col>
      {payload.method == CONST_DATA.Send_task_By_Post_Office_id && (
        <Col
          span={24}
          style={{ marginTop: 20, display: "flex", alignItems: "center" }}
        >
          <Checkbox
            checked={printed}
            onChange={(e) => setPrinted(e.target.checked)}
          >
            {labels.msg.outbound_task_confirm_contant}
          </Checkbox>
        </Col>
      )}

      <Col style={{ marginTop: 20 }}>
        <MaterialInput
          label={labels.lbl.comment}
          value={payload.comment}
          onChange={(e: ChangeEvent<HTMLInputElement>) => {
            const cloned = { ...payload };
            cloned.comment = e.target.value;
            setPayload(cloned);
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
        <ButtonComponent
          type="primary"
          onClick={handleCompleteTask}
          disabled={shouldDisableButton}
          spinning={loading}
          icon={<SendOutlined />}
          buttonLabel={label}
        />
      </Col>
    </Modal>
  );
}
