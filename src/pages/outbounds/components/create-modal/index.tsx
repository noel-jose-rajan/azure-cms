import { useLanguage } from "@/context/language";
import { Modal, Typography } from "antd";
import CreateOutboundDraftForm from "../create-outbound-Draft-form";
import { ReplyCorrespondenceType } from "@/components/services/outbound/schema";

type Props = {
  onClose: () => void;
  onCreate: () => void;
  replayData?: ReplyCorrespondenceType;
};
const CreateOutboundModal = ({ onClose, onCreate, replayData }: Props) => {
  const { labels } = useLanguage();

  return (
    <Modal
      afterClose={() => onClose()}
      open={true}
      onCancel={() => onClose()}
      width={600}
      title={
        <Typography>
          {replayData ? labels.btn.replay_to : labels.til.outbound_form}
        </Typography>
      }
      footer={<></>}
      centered
    >
      <>
        <CreateOutboundDraftForm
          onClose={onClose}
          onCreate={onCreate}
          replyData={replayData}
        />
      </>
    </Modal>
  );
};

export default CreateOutboundModal;
