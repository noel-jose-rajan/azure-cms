import { Button, Col, Modal, message } from "antd";
import { useLanguage } from "../../../../../../context/language";
import { CloseOutlined, MessageFilled, SaveFilled } from "@ant-design/icons";
import { CSSProperties, useState } from "react";
import { MaterialInput } from "../../../../../../components/ui/material-input";
import { addNewCommentOnCorrespondence } from "../../../../service";
import Storage from "../../../../../../lib/storage";
import LOCALSTORAGE from "../../../../../../constants/local-storage";
import LoaderComponent from "../../../../../../components/ui/loader";

interface UploadNewVersionProps {
  visible: boolean;
  onClose: () => void;
  onSubmit?: () => void;
  correspondenceId?: string;
}

export default function AddCommentModal({
  visible,
  onClose,
  onSubmit,
  correspondenceId,
}: UploadNewVersionProps) {
  const { labels, isEnglish } = useLanguage();
  const [input, setInput] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const iconStyle: CSSProperties = {
    marginLeft: isEnglish ? 0 : 10,
    marginRight: isEnglish ? 10 : 0,
  };

  const onChangeText = (event: any) => {
    const value = event.target.value;
    setInput(value);
    if (value.trim() === "") {
      setError(labels.msg.required);
    } else if (value.length < 2 || value.length >= 200) {
      setError(
        isEnglish
          ? "The field length should in range of 1 to 100 letters"
          : "يجب أن يتراوح طول الحقل من 1 إلى 100"
      );
    } else {
      setError("");
    }
  };

  const onSubmitClicked = async () => {
    setLoading(false);
    try {
      const userId = Storage.getItem(LOCALSTORAGE.LEGACY_USER_ID);

      const jsonPayLoad = {
        description: input,
        correspondenceId: correspondenceId,
        ownerUser: userId,
      };

      const response = await addNewCommentOnCorrespondence(jsonPayLoad);

      if (response) {
        onSubmit && onSubmit();
      } else {
        message.error(
          isEnglish
            ? "Something went wrong! Please try again later"
            : "حدث خطأ ما! يرجى المحاولة مرة أخرى لاحقا"
        );
      }
    } catch (error) {
      message.error(
        isEnglish
          ? "Something went wrong! Please try again later"
          : "حدث خطأ ما! يرجى المحاولة مرة أخرى لاحقا"
      );
    } finally {
      setLoading(false);
    }
  };

  const onCancelClicked = () => {
    setInput("");
    setError("");
    onClose();
  };

  return (
    <>
      <Modal
        open={visible}
        title={
          <>
            <MessageFilled style={iconStyle} />
            {labels.til.AddComment}
          </>
        }
        footer={<></>}
        centered
        onCancel={onClose}
        zIndex={10}
      >
        <Col style={{ marginTop: 30 }}>
          <MaterialInput
            label={labels.lbl.comment}
            value={input}
            onChange={onChangeText}
            error={error}
          />
          <Col
            span={24}
            style={{
              marginTop: 30,
              display: "flex",
              justifyContent: "flex-end",
            }}
          >
            <Button
              style={{ marginLeft: 10, marginRight: 10 }}
              onClick={onCancelClicked}
            >
              <CloseOutlined />
              {labels.btn.cancel}
            </Button>
            <Button
              type="primary"
              disabled={input.trim() === ""}
              onClick={onSubmitClicked}
            >
              <SaveFilled />
              {labels.btn.create}
            </Button>
          </Col>
        </Col>
      </Modal>
      <LoaderComponent loading={loading} />
    </>
  );
}
