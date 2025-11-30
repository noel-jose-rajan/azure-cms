import useCustomMessage from "@/components/hooks/use-message";
import useHandleError from "@/components/hooks/useHandleError";
import {
  Actions,
  completeTask,
  CompleteTaskPayload,
} from "@/components/services/inbox";
import ActionSelect from "@/components/shared/actions/select";
import {
  getSubActions,
  SubActionDetails,
} from "@/components/shared/actions/service";
import Picklist from "@/components/shared/picklist";
import ButtonComponent from "@/components/ui/button";
import { MaterialInput } from "@/components/ui/material-input";
import { CONST_DATA } from "@/constants/app";
import { useLanguage } from "@/context/language";
import ApproverTitleSelect from "@/pages/create-outbound/components/accreditation-form/ApproverTitleSelect";
import { SendOutlined } from "@ant-design/icons";
import { Button, Checkbox, Col, Form, Modal, Typography } from "antd";
import { ChangeEvent, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

type Props = {
  action: Actions | undefined;
  onCancel: () => void;
  label: string;
};
type FieldState = {
  users: SubActionDetails[];
  entities: SubActionDetails[];
  sub_users: SubActionDetails[];
  showUserSelect: boolean;
  showEntitySelect: boolean;
  showSubUserSelect: boolean;
};
const ActionModal = ({ action, onCancel, label }: Props) => {
  const { showMessage } = useCustomMessage();
  const { id } = useParams();
  const { labels, isEnglish } = useLanguage();
  const navigate = useNavigate();
  const { handleError } = useHandleError();
  const [form, setForm] = useState({
    comment: "",
    selectedUser: undefined,
    selectedEntity: undefined,
    title: undefined,
    notify_me: false,
    rejection_reason: undefined,
  });
  const [fields, setFields] = useState<FieldState>({
    users: [],
    entities: [],
    sub_users: [],
    showUserSelect: false,
    showEntitySelect: false,
    showSubUserSelect: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fetchSubActions = async (action: Actions, target?: string) => {
    if (!action?.action) return;
    const subActions = await getSubActions(id || "", action);
    if (subActions && subActions.Message == "users") {
      if (target === "sub_users") {
        handleFieldsChange("sub_users", subActions.Data);
        handleFieldsChange("showSubUserSelect", true);
      } else {
        handleFieldsChange("users", subActions.Data);
        handleFieldsChange("showUserSelect", true);
      }
    }
    if (subActions && subActions.Message == "entities") {
      handleFieldsChange("entities", subActions.Data);
      handleFieldsChange("showEntitySelect", true);
    }
  };

  const handleCompleteTask = async () => {
    try {
      setIsSubmitting(true);
      const payload: CompleteTaskPayload = {
        comments: form.comment,
        data: {
          title_id: form.title ? Number(form.title) : undefined,
          entity_id: form.selectedEntity ? form.selectedEntity : undefined,
          notify_me: form.notify_me,
          rejection_reason: form.rejection_reason,
        },
        id: action?.ID || 0,
        user_selected: form.selectedUser ? form.selectedUser : undefined,
      };
      const response = await completeTask(id || "", payload);
      if (response) {
        showMessage("success", labels.msg.task_completed);
        navigate("/user/inbox", { replace: true });
      }
    } catch (error) {
      handleError(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFormChange = (key: keyof typeof form, value: any) => {
    setForm((prevForm) => ({
      ...prevForm,
      [key]: value,
    }));
  };
  const handleFieldsChange = (key: keyof typeof fields, value: any) => {
    setFields((prevFields) => ({
      ...prevFields,
      [key]: value,
    }));
  };
  useEffect(() => {
    if (!action) return;
    fetchSubActions(action);
  }, [action]);

  const showTitleField =
    action?.ID == CONST_DATA.Approve_Id ||
    action?.ID == CONST_DATA.Approve_and_Forward_Id;
  const checkButton =
    !(fields.showEntitySelect ? Boolean(form.selectedEntity) : true) ||
    !(showTitleField ? Boolean(form.title) : true) ||
    (action?.comment_required && !form.comment);
  return (
    <Modal
      title={<Typography>{label}</Typography>}
      open={true}
      onCancel={onCancel}
      footer={null}
      width={600}
    >
      <Form layout="vertical">
        {/* <HeightAnimationWrapper> */}
        {showTitleField && (
          <ApproverTitleSelect
            value={form.title}
            onChange={(value) => handleFormChange("title", value)}
          />
        )}

        {fields?.showUserSelect && (
          <ActionSelect
            label={labels.lbl.to_user}
            value={form.selectedUser}
            data={fields.users}
            onChange={(value: number | string | number[]) => {
              handleFormChange("selectedUser", value);
            }}
          />
        )}

        {fields?.showEntitySelect && (
          <ActionSelect
            label={labels.lbl.org_unit_approver_next}
            value={form.selectedEntity}
            data={fields.entities}
            onClear={() => {
              handleFormChange("selectedUser", 0);
              handleFieldsChange("showSubUserSelect", false);
              handleFieldsChange("sub_users", []);
            }}
            onChange={(value: number | string | number[]) => {
              handleFormChange("selectedEntity", value);
              const entity = fields.entities.find(
                (entity) => entity.ID === value
              );
              const actions = entity?.action;

              if (actions) {
                fetchSubActions(entity as unknown as Actions, "sub_users");
              }
            }}
          />
        )}

        {fields?.showSubUserSelect && (
          <ActionSelect
            label={labels.lbl.to_user}
            value={form.selectedUser}
            data={fields.sub_users}
            onChange={(value: number | string | number[]) => {
              handleFormChange("selectedUser", value);
            }}
          />
        )}
        {CONST_DATA.Reject_Inbound_Task_Id === action?.ID && (
          <Picklist
            label={labels.lbl.rejection_reason}
            value={form.rejection_reason}
            onChange={(value) => handleFormChange("rejection_reason", value)}
            code="Rejection Reason"
          />
        )}
        <MaterialInput
          value={form.comment || ""}
          onChange={(e: ChangeEvent<HTMLInputElement>) => {
            handleFormChange("comment", e?.target.value);
          }}
          label={labels.lbl.comment}
          enableTranscript
          style={{ marginTop: 10, marginBottom: 10 }}
        />
        <Col style={{ marginTop: 16 }}>
          <Checkbox
            value={form.notify_me}
            onChange={(e) => {
              handleFormChange("notify_me", e.target.checked);
            }}
          >
            {labels?.lbl.read_receipt}
          </Checkbox>
        </Col>

        <div style={{ textAlign: isEnglish ? "right" : "left" }}>
          <Button onClick={onCancel} style={{ marginInline: 8 }}>
            {labels.lbl.cancel}
          </Button>
          <ButtonComponent
            spinning={isSubmitting}
            buttonLabel={label}
            type="primary"
            htmlType="submit"
            onClick={handleCompleteTask}
            icon={<SendOutlined />}
            disabled={checkButton}
          />
        </div>
      </Form>
    </Modal>
  );
};

export default ActionModal;
