import { Row } from "antd";
import ElectronicAttachments from "./components/electronic-attachments";
import PhysicalAttachments from "./components/physical-attachments";

interface CorrespondenceAttachmentsProps {
  corrId: string;
  canViewHistory?: boolean;
  activateLoader?: (loading: boolean) => void;
}

export default function CorrespondenceAttachments({
  corrId,
  canViewHistory = false,
  activateLoader,
}: CorrespondenceAttachmentsProps) {
  return (
    <Row style={{ padding: 10 }}>
      <ElectronicAttachments
        corrId={corrId}
        canView={canViewHistory}
        activateLoader={activateLoader}
      />
      <PhysicalAttachments
        corrId={corrId}
        canView={canViewHistory}
        activateLoader={activateLoader}
      />
    </Row>
  );
}
