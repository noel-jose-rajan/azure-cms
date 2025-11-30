import { Button, Modal } from "antd";
import Scanner from "../../components/dynamsoft";
import { ScanOutlined } from "@ant-design/icons";
import { useLanguage } from "../../context/language";
import { useState } from "react";

export default function Dynamsoft() {
  const { labels } = useLanguage();

  const [open, setOpen] = useState(false);
  return (
    <>
      <Button
        type="primary"
        style={{ borderRadius: 20, marginRight: 10, marginTop: 10 }}
        onClick={() => setOpen((v) => !v)}
      >
        <ScanOutlined />
        {labels.btn.scan}
      </Button>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        onCancel={() => setOpen(false)}
        width={"90vw"}
        style={{
          maxWidth: "unset",
          top: "5vh",
        }}
      >
        <Scanner />
      </Modal>
    </>
  );
}
