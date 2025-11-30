import {
  SaveOutlined,
  DeleteOutlined,
  DeleteFilled,
  SendOutlined,
} from "@ant-design/icons";
import { Row, Col, Button } from "antd";
import { useLanguage } from "../../../../context/language";
import { useFormContext } from "react-hook-form";
import { CreateCorrespondenceType } from "../../../../components/services/outbound/types";
import { deleteDraft, editDraft } from "@/components/shared/outbound/service";
import ButtonComponent from "@/components/ui/button";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useHandleError from "@/components/hooks/useHandleError";
import ModalComponent from "@/components/ui/modal";
import useCustomMessage from "@/components/hooks/use-message";

type Props = {
  id: string | number;
  onClickContinue: () => void;
  disableContinueButton: boolean;
};
export default function Actions({
  id,
  onClickContinue,
  disableContinueButton,
}: Props) {
  const { showMessage } = useCustomMessage();

  const { handleError } = useHandleError();
  const { getValues } = useFormContext<CreateCorrespondenceType>();
  const { labels, isEnglish } = useLanguage();
  const [saveLoading, setSaveLoading] = useState<boolean>(false);
  const [deleteLoading, setDeleteLoading] = useState<boolean>(false);
  const [openDelete, setOpenDelete] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleSaveDraft = async () => {
    const { receiving_entities_id, related_details } = getValues();
    const len = receiving_entities_id?.length || 0;

    const body = {
      ...getValues(),
      related: related_details?.map((item) => item.id) || [],
      receiving_Entities: len > 1 ? receiving_entities_id : undefined,
      receiving_Entity: len === 1 ? receiving_entities_id[0] : undefined,
    };
    try {
      setSaveLoading(true);
      const response = await editDraft(id, body);

      if (response) {
        showMessage(
          "success",
          isEnglish ? "Draft saved successfully" : "تم حفظ المسودة بنجاح"
        );
      }
    } catch (error) {
      handleError(error);
    } finally {
      setSaveLoading(false);
    }
  };
  const deleteDraftCorrespondence = async () => {
    try {
      setDeleteLoading(true);
      const res = await deleteDraft(id || "");
      if (res) {
        showMessage("success", labels.msg.delete_draft_corres);
        navigate("/correspondence/outbound/", { replace: true });
      }
    } catch (err) {
      handleError(err);
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <Row
      style={{
        justifyContent: isEnglish ? "left" : "right",
        flexDirection: isEnglish ? "row" : "row-reverse",
        gap: 8,
      }}
    >
      <Col>
        <ButtonComponent
          onClick={onClickContinue}
          disabled={disableContinueButton}
          type="primary"
          buttonLabel={labels.btn.submit}
          icon={<SendOutlined />}
        />
      </Col>
      <Col>
        <ButtonComponent
          buttonLabel={labels.btn.save}
          icon={<SaveOutlined />}
          spinning={saveLoading}
          type="primary"
          onClick={handleSaveDraft}
        />
      </Col>
      <Col>
        <ButtonComponent
          icon={<DeleteOutlined />}
          buttonLabel={labels.btn.delete}
          type="primary"
          onClick={() => setOpenDelete(true)}
        />
      </Col>
      <ModalComponent
        loading={deleteLoading}
        title={
          <>
            <DeleteFilled />
            {labels.btn.delete}
          </>
        }
        description={labels.msg.if_delete_draft_corres}
        visible={openDelete}
        onClose={() => setOpenDelete(false)}
        onSubmit={async () => {
          await deleteDraftCorrespondence();
          setOpenDelete(false);
        }}
        okText={labels.btn.delete}
      />
    </Row>
  );
}
