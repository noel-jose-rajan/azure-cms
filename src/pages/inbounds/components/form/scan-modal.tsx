import Spinner from "@/components/ui/spinner";
import { Modal, Typography } from "antd";
import { motion } from "framer-motion";
type Props = {
  curretProcess: string;
  onCancel: () => void;
  rows: Record<string, string>[];
};
const ScanModal = ({ curretProcess, onCancel }: Props) => {
  return (
    <Modal
      title={<></>}
      centered
      open={true}
      zIndex={10000}
      width={600}
      footer={<></>}
      closable={false}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 16,
          alignItems: "center",
        }}
      >
        <Spinner size="large" />
        <motion.div
          key={curretProcess}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: [0, 1], y: 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        >
          <Typography
            style={{ fontSize: 24, textAlign: "center", fontWeight: 700 }}
          >
            {curretProcess}
          </Typography>
        </motion.div>
      </div>
    </Modal>
  );
};

export default ScanModal;
