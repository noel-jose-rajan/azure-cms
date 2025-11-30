import { Button, Col } from "antd";
import { CSSProperties, useState } from "react";
import { useLanguage } from "../../../../context/language";
import {
  CloseOutlined,
  DeleteFilled,
  SaveFilled,
  SendOutlined,
} from "@ant-design/icons";
import { useNavigate, useParams } from "react-router-dom";
import ModalComponent from "../../../../components/ui/modal";
import { useFormContext } from "react-hook-form";
import { InboundType } from "../../schema";
import {
  deleteDraft,
  editInboundDraft,
  submitInbound,
  SubmitOutboundPayload,
} from "@/components/shared/outbound/service";
import useHandleError from "@/components/hooks/useHandleError";
import ButtonComponent from "@/components/ui/button";
import useCustomMessage from "@/components/hooks/use-message";

export default function Actions() {
  const { showMessage } = useCustomMessage();

  const { isEnglish, labels } = useLanguage();
  const { handleError } = useHandleError();
  const { id } = useParams();
  const { getValues } = useFormContext<InboundType>();
  const navigate = useNavigate();
  const [openDelete, setOpenDelete] = useState<boolean>(false);
  const [loading, setLoading] = useState<"draft" | "submit" | "delete" | null>(
    null
  );
  const iconStyle: CSSProperties = {
    marginRight: isEnglish ? 10 : 0,
    marginLeft: isEnglish ? 0 : 10,
  };
  const handleSaveDraft = async (type?: "draft" | "submit") => {
    const { related_details, ...corrData } = getValues();
    const body = {
      ...corrData,
      related: related_details?.map((item) => item.id) || [],
    };

    try {
      setLoading(type || "draft");
      const response = await editInboundDraft(id || "", body);

      if (response) {
        if (type === "draft") {
          showMessage("success", labels.msg.corr_updated);
        }
      }
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(null);
    }
  };

  const startWorkFlow = async () => {
    const { notify_me } = getValues();
    try {
      const body: SubmitOutboundPayload = {
        data: {
          notify_me,
        },
        id: 1,
      };
      const res = await submitInbound(id || "", body);
      if (res) {
        navigate("/correspondence/inbound", { replace: true });
        showMessage("success", labels.msg.correspondence_save);
      }
    } catch (error) {
      handleError(error);
      setLoading(null);
    }
  };

  const deleteDraftCorrespondence = async () => {
    try {
      setLoading("delete");
      const res = await deleteDraft(id || "");
      if (res) {
        showMessage("success", labels.msg.delete_draft_corres);
        navigate("/correspondence/inbound/", { replace: true });
      }
    } catch (err) {
      handleError(err);
    } finally {
      setLoading(null);
    }
  };

  const handleSubmit = async () => {
    await handleSaveDraft("submit");
    await startWorkFlow();
  };
  return (
    <Col
      style={{
        display: "flex",
        justifyContent: isEnglish ? "end" : "start",
        flexDirection: isEnglish ? "row" : "row-reverse",
        marginTop: 20,
      }}
    >
      <ButtonComponent
        type="primary"
        onClick={handleSubmit}
        icon={<SendOutlined />}
        buttonLabel={labels.btn.submit}
        spinning={loading === "submit"}
        style={styles.button}
      />
      <ButtonComponent
        type="primary"
        style={styles.button}
        onClick={() => handleSaveDraft("draft")}
        icon={<SaveFilled />}
        buttonLabel={labels.btn.save_draft}
        spinning={loading === "draft"}
      />

      <Button
        type="primary"
        style={styles.button}
        onClick={() => setOpenDelete(true)}
      >
        <DeleteFilled />
        {labels.btn.delete_draft}
      </Button>
      <Button type="primary" style={styles.button} onClick={() => navigate(-1)}>
        <CloseOutlined />
        {labels.btn.cancel}
      </Button>
      <ModalComponent
        loading={loading === "delete"}
        title={
          <>
            <DeleteFilled style={iconStyle} />
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
    </Col>
  );
}

const styles: { [x: string]: CSSProperties } = {
  button: {
    marginLeft: 10,
  },
};
