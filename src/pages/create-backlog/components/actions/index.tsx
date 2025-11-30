import { Button, Col } from "antd";
import { CSSProperties, useState } from "react";
import { useLanguage } from "../../../../context/language";
import { CloseOutlined, DeleteFilled, SendOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import ModalComponent from "../../../../components/ui/modal";
import { Control, useWatch } from "react-hook-form";
import { CorrespondenceType } from "../../types";

interface ActionsProps {
  submitClicked?: () => void;
  deleteClicked?: () => void;
  control: Control<CorrespondenceType>;
}

export default function Actions({
  submitClicked,
  deleteClicked,
  control,
}: ActionsProps) {
  const { isEnglish, labels } = useLanguage();
  const navigate = useNavigate();
  const [openDelete, setOpenDelete] = useState<boolean>(false);
  const { correspondenceDTO } = useWatch({ control: control });

  return (
    <Col
      style={{
        display: "flex",
        justifyContent: isEnglish ? "flex-end" : "flex-start",
        marginTop: 20,
      }}
    >
      <Button
        type="primary"
        onClick={submitClicked}
        disabled={
          correspondenceDTO?.backlogNodeType === "contract" ||
          correspondenceDTO?.backlogNodeType === "mom" ||
          correspondenceDTO?.backlogNodeType === "memo"
            ? !correspondenceDTO.archieve_number ||
              !correspondenceDTO.document_title ||
              !correspondenceDTO.file_date ||
              !correspondenceDTO.file_type ||
              !correspondenceDTO.trading_id
            : correspondenceDTO?.backlogNodeType === "correspondence"
            ? !correspondenceDTO.correspondence_number ||
              !correspondenceDTO.correspondanc_date ||
              !correspondenceDTO.subject ||
              !correspondenceDTO.sending_entity ||
              !correspondenceDTO.receiving_entity
            : false
        }
      >
        <SendOutlined />
        {labels.btn.submit}
      </Button>
      <Button type="primary" style={styles.button} onClick={() => navigate(-1)}>
        <CloseOutlined />
        {labels.btn.cancel}
      </Button>
      <ModalComponent
        title={
          <>
            <DeleteFilled />
            {labels.btn.delete}
          </>
        }
        description={labels.msg.if_delete_draft_corres}
        visible={openDelete}
        onClose={() => setOpenDelete(false)}
        onSubmit={() => {
          deleteClicked && deleteClicked();
          setOpenDelete(false);
        }}
        okText={labels.btn.cancel}
      />
    </Col>
  );
}

const styles: { [x: string]: CSSProperties } = {
  button: {
    marginLeft: 10,
  },
};
