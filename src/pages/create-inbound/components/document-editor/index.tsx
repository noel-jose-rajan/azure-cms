import { Button, Col, Tooltip, Upload, UploadProps } from "antd";
import { useLanguage } from "../../../../context/language";
import {
  BarcodeOutlined,
  CloudDownloadOutlined,
  CloudUploadOutlined,
  PaperClipOutlined,
  ScanOutlined,
} from "@ant-design/icons";
import { CSSProperties, useState } from "react";
// import NextcloudFileManager from "../../../../lib/helper/NextCloudFileManager";
import ENV from "../../../../constants/env";
// import { convertToTiffFormat } from "../../service";
import { HttpStatus } from "../../../../components/functional/httphelper";
import { CorrespondenceDTOType } from "../../types";
import Storage from "../../../../lib/storage";
import LOCALSTORAGE from "../../../../constants/local-storage";
import { uploadDocToServer } from "../../../../components/services/inbound";
import Iframe from "@/components/ui/iframe";
import ButtonComponent from "@/components/ui/button";

interface InboundDocEditorProps {
  corrID: string;
}

export default function InboundDocEditor({ corrID }: InboundDocEditorProps) {
  const { labels } = useLanguage();
  const [selectedFile, setSelectedFile] = useState<File>();
  // const [showUpload, setShowUpload] = useState<boolean>(false);
  // const [editUrl, setEditUrl] = useState<string>("");
  // const [url, setUrl] = useState<string>("");
  // const nextCloud = new NextcloudFileManager(ENV.NODE_API_URL);
  // const [tiffFile, setTiffFile] = useState<File>();

  const props: UploadProps = {
    beforeUpload: (file) => {
      setSelectedFile(file as File);
      return false;
    },
    type: "select",
    showUploadList: false,
    maxCount: 1,
    accept: "application/pdf",
    onRemove: () => {
      setSelectedFile(undefined);
    },
  };

  // const anothorProps: UploadProps = {
  //   beforeUpload: (file) => {
  //     setTiffFile(file as File);
  //     return false;
  //   },
  //   type: "select",
  //   showUploadList: false,
  //   maxCount: 1,
  //   onRemove: () => {
  //     setTiffFile(undefined);
  //   },
  // };

  // useEffect(() => {
  //   if (selectedFile) {
  //     uploadFileToContentServer({ file: selectedFile });
  //   }
  // }, [selectedFile]);

  // useEffect(() => {
  //   if (tiffFile) {
  //     uploadFileClicked(tiffFile);
  //   }
  // }, [tiffFile]);

  // const uploadFileToContentServer = async ({ file }: any) => {
  //   if (!file) {
  //     message.error("Please select a .docx file");
  //     return;
  //   }
  //   activateLoader(true);

  //   const filePath = await nextCloud.uploadFile(await file.arrayBuffer());
  //   if (filePath) {
  //     fetchFileEditInfo(filePath);
  //     fetchFileViewInfo(filePath);
  //   }
  //   activateLoader(false);
  // };

  // const fetchFileEditInfo = async (filePath: string) => {
  //   const fileInfo = await nextCloud.getFileInfo(filePath);
  //   if (fileInfo?.data?.ocs?.data?.id) {
  //     fetchEditUrl(fileInfo.data.ocs.data.id);
  //     setShowUpload(true);
  //   }
  // };

  // const fetchEditUrl = async (shareId: string) => {
  //   const editUrl = await nextCloud.getEditUrl(shareId, 19);

  //   if (editUrl) {
  //     setEditUrl(editUrl);
  //   }
  // };

  // const fetchFileViewInfo = async (filePath: string) => {
  //   const fileInfo = await nextCloud.getFileInfo(filePath);
  //   if (fileInfo?.data?.ocs?.data?.id) {
  //     fetchViewUrl(fileInfo.data.ocs.data.id);
  //   }
  // };

  // const fetchViewUrl = async (shareId: string) => {
  //   const viewUrl = await nextCloud.getEditUrl(shareId, 1);

  //   if (viewUrl) {
  //     setUrl(viewUrl);
  //   }
  // };

  // const handleEditFile = () => {
  //   if (editUrl) {
  //     window.open(
  //       editUrl,
  //       "_blank",
  //       "width=800,height=1100,toolbar=no,location=no,status=no,menubar=no,scrollbars=no,resizable=no"
  //     );
  //   }
  // };

  // const handleFullPageViewFile = () => {
  //   if (url) {
  //     window.open(
  //       url,
  //       "_blank",
  //       "width=800,height=1100,toolbar=no,location=no,status=no,menubar=no,scrollbars=no,resizable=no"
  //     );
  //   }
  // };

  const printBarcode = async () => {
    const token = await Storage.getItem(LOCALSTORAGE.LEGACY_ACCESS_TOKEN);
    const printWindow = window.open(
      ENV.API_URL_LEGACY +
        "/correspodence/in/generate-barcode?access_token=" +
        token,
      "printVersion",
      "menubar,scrollbars,width=640,height=480,top=0,left=0"
    );

    if (printWindow) {
      printWindow.window.onafterprint = function () {
        printWindow.window.close();
      };
      printWindow.window.print();
    }
  };

  return (
    <Col style={{ marginTop: 10, height: "100%" }}>
      <Col>
        {/* <Upload {...props}>
          <Tooltip title={labels.btn.import} arrow>
            <ButtonComponent
              icon={<CloudUploadOutlined />}
              type="primary"
              style={styles.buttonStyle}
            />
          </Tooltip>
        </Upload> */}
        {/* <Tooltip title={labels.btn.scan} arrow>
          <ButtonComponent
            type="primary"
            style={styles.buttonStyle}
            icon={<ScanOutlined />}
          />
        </Tooltip> */}

        {/* <Button
          type="primary"
          style={{ borderRadius: 20, marginTop: 10 }}
          disabled={!selectedFile}
          onClick={uploadFileClicked}
        >
          <CloudUploadOutlined />
          {labels.btn.upload_files}
        </Button> */}

        {/* <Button
          type="primary"
          style={{ borderRadius: 20 }}
          disabled={!showUpload}
          // onClick={uploadFileClicked} 
        >
          <CloudUploadOutlined />
          {labels.btn.upload_files}
        </Button> */}
        {/* <Tooltip title={labels.btn.download_pdf} arrow>
          <ButtonComponent
            type="primary"
            style={styles.buttonStyle}
            // disabled={!showUpload}
            icon={<CloudDownloadOutlined />}
          />
        </Tooltip> */}

        {/* <Tooltip title={labels.btn.download_tiff} arrow>
          <ButtonComponent
            type="primary"
            style={styles.buttonStyle}
            // disabled={!showUpload}
            icon={<CloudDownloadOutlined />}
          />
        </Tooltip> */}
        {/* <Tooltip title={labels.btn.generate_barcode} arrow>
          <ButtonComponent
            type="primary"
            style={styles.buttonStyle}
            onClick={printBarcode}
            icon={<BarcodeOutlined />}
          />
        </Tooltip> */}
        {/* <Button
          type="primary"
          style={{ borderRadius: 20, marginTop: 10 }}
          onClick={handleEditFile}
          disabled={!showUpload}
        >
          <EditFilled />
          {labels.btn.edit}
        </Button> */}
      </Col>
      <Col style={{ marginTop: 10, position: "relative" }}>
        <Iframe enableEdit={false} corrID={corrID} isPdf />
      </Col>
    </Col>
  );
}

const styles: { [x: string]: CSSProperties } = {
  buttonStyle: {
    borderRadius: 20,
    marginRight: 10,
    marginTop: 10,
  },
};
