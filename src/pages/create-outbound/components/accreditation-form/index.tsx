import { Modal, Form, Button, Row, Radio, Checkbox, Typography } from "antd";
import { useLanguage } from "../../../../context/language";
import { MaterialInput } from "../../../../components/ui/material-input";
import { CreateCorrespondenceType } from "../../../../components/services/outbound/types";
import {
  Actions,
  getActions,
  getSubActions,
  SubActionDetails,
} from "@/components/shared/actions/service";
import { ChangeEvent, useEffect, useState } from "react";
import usePicklist from "@/store/picklists/use-picklist";
import ActionSelect from "@/components/shared/actions/select";
import {
  editDraft,
  submitOutbound,
  SubmitOutboundPayload,
} from "@/components/shared/outbound/service";
import { useNavigate, useParams } from "react-router-dom";
import ButtonComponent from "@/components/ui/button";
import { SendOutlined } from "@ant-design/icons";
import ApproverTitleSelect from "./ApproverTitleSelect";
import { CONST_DATA } from "@/constants/app";
import HeightAnimationWrapper from "@/animations/height-wrapper-animation";
import useHandleError from "@/components/hooks/useHandleError";
import useCustomMessage from "@/components/hooks/use-message";

interface Props {
  open?: boolean;
  onCancel?: () => void;
  onClose?: () => void;
  corrData: CreateCorrespondenceType;
}
type FieldState = {
  users: SubActionDetails[];
  entities: SubActionDetails[];
  sub_users: SubActionDetails[];
  showUserSelect: boolean;
  showEntitySelect: boolean;
  showSubUserSelect: boolean;
};
type SubmitOption = {
  actions: Actions;
  arLabel: string;
  enLabel: string;
  id: number | string;
};

const AccreditationForm: React.FC<Props> = ({ open, onCancel, corrData }) => {
  const { showMessage } = useCustomMessage();

  const { handleError } = useHandleError();
  const { labels, isEnglish } = useLanguage();
  const { picklists } = usePicklist();
  const { id } = useParams();
  const navigate = useNavigate();
  const _actions_picklist = picklists["ACTIONS"] || [];
  const [actions, setActions] = useState<SubmitOption[]>([]);
  const [radioValue, setRadioValue] = useState(-1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState({
    comment: "",
    selectedUser: 0,
    selectedEntity: 0,
    title: 0,
    notify_me: false,
  });
  const [fields, setFields] = useState<FieldState>({
    users: [],
    entities: [],
    sub_users: [],
    showUserSelect: false,
    showEntitySelect: false,
    showSubUserSelect: false,
  });

  const handleFieldsChange = (key: keyof typeof fields, value: any) => {
    setFields((prevFields) => ({
      ...prevFields,
      [key]: value,
    }));
  };
  const resetFields = () => {
    setFields({
      users: [],
      entities: [],
      sub_users: [],
      showUserSelect: false,
      showEntitySelect: false,
      showSubUserSelect: false,
    });
    setForm((prev) => ({
      ...prev,
      selectedUser: 0,
      selectedEntity: 0,
      title: 0,
    }));
  };

  const handleFormChange = (key: keyof typeof form, value: any) => {
    setForm((prevForm) => ({
      ...prevForm,
      [key]: value,
    }));
  };

  const handleCancel = () => {
    onCancel && onCancel();
  };

  const fetchSubActions = async (action: Actions, target?: "sub_users") => {
    const subActions = await getSubActions(0, action);
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

  const fetchCorresponedenceActions = async () => {
    const len = corrData?.receiving_entities_id?.length || 0;
    const res = await getActions({
      correspondence_type: corrData?.outbound_type_id || 0,
      security_level: corrData?.security_level_id || 0,
      sending_entity: corrData?.sending_entity_id || 0,
      receiving_Entity:
        len === 1 ? corrData?.receiving_entities_id[0] || 0 : undefined,
      receiving_Entities: len > 1 ? corrData?.receiving_entities_id : undefined,
    });

    if (res) {
      const picklistMap = new Map(
        _actions_picklist.map((item) => [item.picklist_id, item])
      );

      const mappedActions = res?.map((action) => {
        const picklistItem = picklistMap.get(action.ID);

        // Return a new object combining the action data with the labels.
        return {
          actions: action,
          id: action.ID,
          arLabel: picklistItem ? picklistItem.picklist_ar_label : "",
          enLabel: picklistItem ? picklistItem.picklist_en_label : "",
        };
      });
      setRadioValue(mappedActions[0]?.id || -1);
      setActions(mappedActions);

      await fetchSubActions(res[0]);
    }
  };

  const handleSaveDraft = async (id: number | string) => {
    const { receiving_entities_id, related_details } = corrData;
    const len = receiving_entities_id?.length || 0;
    const body = {
      ...corrData,
      related: related_details?.map((item) => item.id) || [],
      receiving_entities_id: len > 1 ? receiving_entities_id : undefined,
      receiving_entity_id: len === 1 ? receiving_entities_id[0] : undefined,
    };

    try {
      setIsSubmitting(true);
      const response = await editDraft(id, body);

      if (response?.ID) {
        showMessage("success", labels.msg.corr_updated);
      }
    } catch (error) {
      setIsSubmitting(false);
      handleError(error);
    }
  };

  const handleStartWorkFlow = async () => {
    try {
      setIsSubmitting(true);
      const payload: SubmitOutboundPayload = {
        comments: form.comment,
        data: {
          title_id: form.title ? Number(form.title) : undefined,
          entity_id: form.selectedEntity ? form.selectedEntity : undefined,
          notify_me: form.notify_me,
        },
        id: radioValue,
        user_selected: form.selectedUser ? form.selectedUser : undefined,
      };
      const response = await submitOutbound(id || "", payload);
      if (response?.Message == "outbound workflow started") {
        showMessage("success", labels.msg.outbound_submitted);
        navigate("/correspondence/outbound", { replace: true });
      }
    } catch (error) {
      setIsSubmitting(false);
      handleError(error);
    }
  };

  const handleSubmitOutbound = async () => {
    await handleSaveDraft(id || 0);
    await handleStartWorkFlow();
  };

  useEffect(() => {
    if (
      corrData?.outbound_type_id &&
      corrData?.security_level_id &&
      corrData?.sending_entity_id &&
      corrData?.receiving_entities_id &&
      corrData?.receiving_entities_id.length > 0 &&
      _actions_picklist?.length > 0
    )
      fetchCorresponedenceActions();
  }, [
    corrData?.outbound_type_id,
    corrData?.security_level_id,
    corrData?.sending_entity_id,
    corrData?.receiving_entities_id,
    _actions_picklist.length,
  ]);

  const radioOptions = actions?.map((action) => ({
    value: action.id,
    label: isEnglish ? action.enLabel : action.arLabel,
  }));
  const showTitleFiled =
    radioValue == CONST_DATA.Approve_Id ||
    radioValue == CONST_DATA.Approve_and_Forward_Id;
  const checkButton =
    !(fields.showEntitySelect ? Boolean(form.selectedEntity) : true) ||
    !(showTitleFiled ? Boolean(form.title) : true) ||
    radioValue == -1;

  return (
    <Modal
      title={
        <Typography>{isEnglish ? "Submit Form" : "إرسال النموذج"}</Typography>
      }
      open={open}
      onCancel={handleCancel}
      footer={null}
      width={700}
    >
      <Form layout="vertical">
        <Row style={{ marginBottom: 32, marginTop: 16 }}>
          <Radio.Group
            onChange={(e) => {
              resetFields();
              setRadioValue(e.target.value);
              const selectedAction = actions.find(
                (action) => action.id == e.target.value
              );
              if (selectedAction) {
                fetchSubActions(selectedAction.actions);
              }
            }}
            value={radioValue}
            options={radioOptions}
          />
        </Row>
        <HeightAnimationWrapper>
          {showTitleFiled && (
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

          <MaterialInput
            value={form.comment || ""}
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
              handleFormChange("comment", e?.target.value);
            }}
            label={labels.lbl.comment}
            enableTranscript
            style={{ marginTop: 10, marginBottom: 10 }}
          />
          <Form.Item name="readReceipt" valuePropName="checked">
            <Checkbox
              checked={form.notify_me}
              onChange={(e) => handleFormChange("notify_me", e.target.checked)}
            >
              {labels.lbl.read_receipt}
            </Checkbox>
          </Form.Item>
        </HeightAnimationWrapper>

        <div
          style={{
            textAlign: "right",
            display: "flex",
            justifyContent: "end",
            marginTop: 20,
            flexDirection: "row-reverse",
          }}
        >
          <Button onClick={handleCancel} style={{ marginInline: 8 }}>
            {labels.btn.cancel}
          </Button>
          <ButtonComponent
            spinning={isSubmitting}
            buttonLabel={labels.btn.submit}
            type="primary"
            htmlType="submit"
            onClick={handleSubmitOutbound}
            icon={<SendOutlined />}
            disabled={checkButton}
          />
        </div>
      </Form>
    </Modal>
  );
};

export default AccreditationForm;
