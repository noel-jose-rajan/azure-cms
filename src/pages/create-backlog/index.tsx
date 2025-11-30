import { Button, Col, Row, message } from "antd";
import { useLanguage } from "../../context/language";
import TitleBar from "../../components/ui/bar/title-bar";
import {
  FullscreenExitOutlined,
  FullscreenOutlined,
  PaperClipOutlined,
  TableOutlined,
} from "@ant-design/icons";
import { useParams } from "react-router-dom";
import TitleHeader from "../../components/ui/header";
import { CSSProperties, useEffect, useState } from "react";
import { getCorrespondenceDetails } from "./service";
import {
  CorrespondenceDTOType,
  CorrespondenceType,
  correspondenceSchema,
} from "./types";
import { HttpStatus } from "../../components/functional/httphelper";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import LoaderComponent from "../../components/ui/loader";
import CorrespondenceAttachments from "../../components/ui/draft-attachments";
import NotAccessible from "../../components/ui/not-accessible";
import DocumentEditor from "./components/document-editor";
import DocumentMetaDataInfo from "./components/metadata";
import Actions from "./components/actions";
import {
  createAContractDocument,
  createACorrespondenceDocument,
  uploadAContractDocument,
} from "../../components/services/alfressco";

export default function CreateInbound() {
  const { labels, isEnglish } = useLanguage();
  const { id } = useParams();
  const [uploadStatus, setUploadStatus] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [expanded, setExpanded] = useState<boolean>(false);
  const [correspondenceDetails, setCorrespondenceDetails] =
    useState<CorrespondenceDTOType>();
  const [selectedFile, setSelectedFile] = useState<File>();

  const apiResponseLabels = {
    uploadSuccess: isEnglish
      ? "File uploaded successfully"
      : "تم تحميل الملف بنجاح",
    uploadFiled: isEnglish
      ? "Failed to upload the document. Please try again!"
      : "فشل تحميل المستند. يُرجى المحاولة مرة أخرى!",
    contractDocCreationFiled: isEnglish
      ? "Failed to create a contract document"
      : "فشل في إنشاء مستند العقد",
    corrDocCreationFailed: isEnglish
      ? "Failed to create a correspondence document"
      : "فشل في إنشاء مستند المراسلات",
  };

  useEffect(() => {
    getRelatedInfo();
  }, [id]);

  const getRelatedInfo = async () => {
    if (id) {
      setUploadStatus(true);
      const response = await getCorrespondenceDetails(id);

      if (response.status === HttpStatus.SUCCESS) {
        if (response.data) {
          setCorrespondenceDetails(response.data);
        }
      } else {
        message.error(
          isEnglish
            ? "Something went wrong! Please contact your system administrator"
            : "حدث خطأ ما، يرجى الاتصال بمسؤول النظام"
        );
      }
    }
  };

  const { control, reset, setValue } = useForm<CorrespondenceType>({
    resolver: zodResolver(correspondenceSchema),
    defaultValues: {
      correspondenceDTO: correspondenceDetails,
      genericActionDTO: {
        readReceipt: false,
      },
    },
  });

  const { correspondenceDTO } = useWatch({ control: control });

  useEffect(() => {
    if (correspondenceDetails) {
      reset({
        correspondenceDTO: correspondenceDetails,
      });
    }
  }, [correspondenceDetails]);

  const submitClicked = async () => {
    if (selectedFile) {
      if (correspondenceDTO?.backlogNodeType === "correspondence") {
        await uploadCorrespondenceDocument(selectedFile);
      } else {
        const createResponse = await createAContractDocument(
          selectedFile,
          correspondenceDTO as CorrespondenceDTOType
        );
        if (
          createResponse.status === HttpStatus.SUCCESS &&
          createResponse.data
        ) {
          await uploadDoc(selectedFile, createResponse.data.entry.id);
        } else {
          message.error(apiResponseLabels.contractDocCreationFiled);
        }
      }
    }
  };

  const uploadCorrespondenceDocument = async (selectedFile: File) => {
    const createResponse = await createACorrespondenceDocument(
      selectedFile,
      "-shared-",
      correspondenceDTO as CorrespondenceDTOType
    );
    if (createResponse.status === HttpStatus.SUCCESS && createResponse.data) {
      await uploadDoc(selectedFile, createResponse.data.entry.id);
    } else {
      message.error(apiResponseLabels.corrDocCreationFailed);
    }
  };

  const uploadDoc = async (file: File, id: string) => {
    const uploadResponse = await uploadAContractDocument(file, id);
    if (uploadResponse.status === HttpStatus.SUCCESS) {
      message.success(apiResponseLabels.uploadSuccess);
    } else {
      message.error(apiResponseLabels.uploadFiled);
    }
  };

  return (
    <Col>
      <TitleBar
        headerText={id ? labels["Edit Inbound"] : labels.btn.create_inbound}
      />
      <Actions submitClicked={submitClicked} control={control} />
      <TitleHeader
        heading={labels.til.inbound_form}
        icon={<TableOutlined style={{ color: "#fff" }} />}
      />
      <Row gutter={4} style={styles.inboundForm}>
        <Col
          span={expanded ? 0 : 12}
          lg={expanded ? 0 : 12}
          md={expanded ? 0 : 16}
          sm={expanded ? 0 : 24}
          style={{ height: 300 }}
        >
          <DocumentEditor
            activateLoader={setLoading}
            selectedFile={selectedFile}
            updateSelectedFile={setSelectedFile}
          />
        </Col>
        <Col
          span={expanded ? 24 : 12}
          lg={expanded ? 24 : 12}
          md={expanded ? 24 : 8}
          sm={24}
          style={{
            position: "relative",
            borderLeft: "2px solid #d3d3d3",
          }}
        >
          <DocumentMetaDataInfo control={control} setValue={setValue} />
          {/* {!uploadStatus && (
            <NotAccessible style={styles.notAccessibleWrapper} />
          )} */}
          <Button
            type="link"
            style={styles.expandIcon}
            onClick={() => setExpanded(!expanded)}
          >
            {expanded ? <FullscreenExitOutlined /> : <FullscreenOutlined />}
          </Button>
        </Col>
      </Row>
      <TitleHeader
        heading={labels.til.attachments}
        icon={<PaperClipOutlined style={{ color: "#fff" }} />}
      />
      <Row style={{ paddingTop: 10 }}>
        {!uploadStatus && id === undefined ? (
          <NotAccessible style={{ minHeight: 300 }} />
        ) : (
          <CorrespondenceAttachments
            canViewHistory={true}
            corrId={id ?? ""}
            activateLoader={setLoading}
          />
        )}
      </Row>
      <LoaderComponent loading={loading} />
    </Col>
  );
}

const styles: { [x: string]: CSSProperties } = {
  button: {
    marginLeft: 10,
  },
  expandIcon: {
    position: "absolute",
    top: 5,
    right: 5,
    padding: 8,
    borderRadius: 25,
  },
  inboundForm: {
    minHeight: 500,
    boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
    margin: 5,
    marginTop: 20,
  },
  notAccessibleWrapper: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
  },
};
