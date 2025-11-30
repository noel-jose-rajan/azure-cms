import Scanner from "@/components/dynamsoft";
import { useLanguage } from "@/context/language";
import { useTheme } from "@/context/theme";
import { ScanOutlined } from "@ant-design/icons";
import { Button, Modal } from "antd";
import type { ButtonProps } from "antd";
import { useState } from "react";

interface Props extends ButtonProps {
  onPdfGenerate?: (blob: Blob) => any;
  onTifGenerate?: (blob: Blob) => any;
  onImageGenerate?: (blob: Blob) => any;
}

const ScannerComponent = (props: Props) => {
  const { labels } = useLanguage();
  const [openScanner, setOpenScanner] = useState<boolean>(false);
  const {
    theme: { colors },
  } = useTheme();

  return (
    <>
      <Button
        style={{
          borderRadius: 10,
          marginInline: 8,
          backgroundColor: colors.background,
          ...props.style,
        }}
        {...props}
        onClick={() => setOpenScanner(true)}
      >
        <ScanOutlined />
        {labels.btn.scan}
      </Button>
      <Modal
        open={openScanner}
        onClose={() => setOpenScanner(false)}
        onCancel={() => setOpenScanner(false)}
        width={"90vw"}
        style={{
          maxWidth: "unset",
          top: "5vh",
        }}
        zIndex={1000}
      >
        <Scanner
          onPdfGenerate={(blob) => {
            props.onPdfGenerate?.(blob);
            setOpenScanner(false);
          }}
          onImageGenerate={(blob) => {
            props.onImageGenerate?.(blob);
            setOpenScanner(false);
          }}
          onTifGenerate={(blob) => {
            props.onTifGenerate?.(blob);
            setOpenScanner(false);
          }}
        />
      </Modal>
    </>
  );
};

export default ScannerComponent;
