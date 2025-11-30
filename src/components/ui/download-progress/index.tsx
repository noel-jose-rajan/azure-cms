import { Modal, Progress } from "antd";
import React, { FC } from "react";

interface DownloadProgressProps {
  visible: boolean;
  progress: number;
}

const DownloadProgress: FC<DownloadProgressProps> = ({ progress, visible }) => {
  return (
    <Modal
      title="Downloading..."
      open={visible}
      footer={null}
      closable={false}
      centered
    >
      <br />
      <Progress
        percent={progress}
        size={["100%", 18]}
        status={progress === 100 ? "success" : "active"}
      />
      <br />
    </Modal>
  );
};

export default DownloadProgress;
