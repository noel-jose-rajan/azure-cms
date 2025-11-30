import { Row } from "antd";
import ElectronicAttachments from "./components/electronic-attachments";
import PhysicalAttachments from "./components/physical-attachments";

interface CorrespondenceAttachmentsProps {
  corrId: string;
  canViewHistory?: boolean;
  canEdit?: boolean;
  fromTab?: boolean;
  isInbound?: boolean;
}

export default function CorrespondenceAttachments({
  corrId,
  canEdit = true,
  fromTab = false,
  isInbound = false,
}: CorrespondenceAttachmentsProps) {
  return (
    <Row style={{ padding: 10 }}>
      <ElectronicAttachments
        corrId={corrId}
        canEdit={canEdit}
        fromTab={fromTab}
        isInbound={isInbound}
      />
      <PhysicalAttachments
        corrId={corrId}
        canEdit={canEdit}
        fromTab={fromTab}
        isInbound={isInbound}
      />
    </Row>
  );
}
