import { useLanguage } from "@/context/language";
import { Modal, Typography } from "antd";
import CreateINBoundDraftForm from "../form";

type Props = {
  onClose: () => void;
  onCreate: () => void;
};
const CreateInboundModal = ({ onClose, onCreate }: Props) => {
  const { labels } = useLanguage();
  return (
    <Modal
      afterClose={() => onClose()}
      open={true}
      onCancel={() => onClose()}
      width={600}
      title={<Typography>{labels.til.inbound_form}</Typography>}
      footer={<></>}
      centered
    >
      <>
        <CreateINBoundDraftForm onClose={onClose} onCreate={onCreate} />
      </>
    </Modal>
  );
};

export default CreateInboundModal;
