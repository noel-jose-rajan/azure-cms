import Storage from "@/lib/storage";
import LOCALSTORAGE from "@/constants/local-storage";
import ENV from "@/constants/env";
import useHandleError from "@/components/hooks/useHandleError";
import LoaderComponent from "../loader";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import ButtonComponent from "../../ui/button";
import {
  ArrowLeftOutlined,
  ArrowRightOutlined,
  EditFilled,
  ReloadOutlined,
} from "@ant-design/icons";
import { Col, Flex, Row } from "antd";
import { useLanguage } from "@/context/language";
import { useTheme } from "@/context/theme";
import WhileInViewWrapper from "@/animations/while-in-view-wrapper";
import { CONST_DATA } from "@/constants/app";
import { useAuth } from "@/context/auth";
import { Viewer, Worker } from "@react-pdf-viewer/core";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";
import ar_AE from "@react-pdf-viewer/locales/lib/ar_AE.json";
import en_US from "@react-pdf-viewer/locales/lib/en_US.json";
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";
import Spinner from "../spinner";
const MotionFlex = motion.create(Flex);
type Props = {
  corrID: string | number;
  enableEdit?: boolean;
  isPdf?: boolean;
};
const Iframe = ({ corrID, enableEdit, isPdf }: Props) => {
  const { isEnglish } = useLanguage();
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [reloadCount, setReloadCount] = useState(0);
  const { theme } = useTheme();
  const { accessToken } = useAuth();
  const imageVariants = {
    initial: { width: "100%", height: "calc(100vh - 100px)" },
    full: { width: "100vw", height: "100vh" },
  };

  const handleToggleFullScreen = () => {
    setIsFullScreen((prev) => !prev);
    setIsEditing((prev) => !prev);
  };

  return (
    <WhileInViewWrapper style={{ padding: 20, paddingTop: 0, width: "100%" }}>
      {!isAnimating && enableEdit && !isFullScreen && (
        <Row
          gutter={8}
          style={{
            display: "flex",
            flexDirection: isEnglish ? "row" : "row-reverse",
          }}
        >
          <Col>
            <ButtonComponent
              type="text"
              style={{ marginBottom: 8 }}
              onClick={handleToggleFullScreen}
              icon={<EditFilled />}
            />
          </Col>
          <Col>
            <ButtonComponent
              type="text"
              style={{ marginBottom: 8 }}
              onClick={() => setReloadCount((c) => c + 1)}
              icon={<ReloadOutlined />}
            />
          </Col>
        </Row>
      )}
      {corrID && isEditing && (
        <MotionFlex
          layout
          variants={imageVariants}
          initial="initial"
          animate={isFullScreen ? "full" : "initial"}
          transition={{ duration: 0.3, ease: "easeOut" }}
          onAnimationStart={() => setIsAnimating(true)}
          onAnimationComplete={() => setIsAnimating(false)}
          style={{
            position: isFullScreen ? "fixed" : "sticky",
            top: 0,
            left: 0,
            background: theme?.colors.background,
            border: "2px solid gray",
            zIndex: isFullScreen ? 50 : "auto",
            display: "flex",
            flexDirection: "column",
            borderRadius: isFullScreen ? 0 : 12,
          }}
        >
          <div
            style={{ padding: 10, display: "flex", justifyContent: "start" }}
          >
            <ButtonComponent
              onClick={handleToggleFullScreen}
              style={{ marginBlock: 8 }}
              icon={isEnglish ? <ArrowLeftOutlined /> : <ArrowRightOutlined />}
              buttonLabel={isEnglish ? "End Editing" : "إنهاء التعديل"}
            />
          </div>
          <iframe
            style={{
              opacity: isAnimating ? 0 : 1,
              flex: 1,
              border: 0,
            }}
            src={
              CONST_DATA.Word_Editor_Base_URL +
              corrID +
              "&access_token=" +
              accessToken
            }
          />
        </MotionFlex>
      )}
      {!isEditing && (
        <Pdf key={"pdf" + reloadCount.toString()} id={corrID} isPdf={isPdf} />
      )}

      {!corrID && <NoDocAvailable isEnglish={isEnglish} />}
    </WhileInViewWrapper>
  );
};

export default Iframe;

// const handlePrint = async (blobUrl: string) => {
//   if (!blobUrl) {
//     console.error("No document URL provided for printing.");
//     return;
//   }
//   const iframe = document.createElement("iframe");
//   iframe.style.display = "none";
//   iframe.src = blobUrl;
//   document.body.appendChild(iframe);

//   iframe.onload = () => {
//     iframe.contentWindow?.focus();
//     iframe.contentWindow?.print();
//   };
// };

const Pdf = ({ id, isPdf }: { id: number | string; isPdf?: boolean }) => {
  const { isEnglish } = useLanguage();
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const { handleError } = useHandleError();
  const { currentThemeName } = useTheme();

  const downloadAndCachePDFfile = async () => {
    try {
      setLoading(true);
      const url = await downloadCorrespondencePDF(id);
      if (url) {
        setFileUrl(url);
      }
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  };

  const downloadAndCacheWordFile = async () => {
    try {
      setLoading(true);
      const url = await downloadCorrespondenceDocument(id);
      if (url) {
        setFileUrl(url);
      }
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (!id) return;
    if (!isPdf) {
      downloadAndCachePDFfile();
    } else {
      downloadAndCacheWordFile();
    }
  }, [id, isPdf]);
  const defaultLayoutPluginInstance = defaultLayoutPlugin();

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div
        style={{
          width: "100%",
          height: "calc(100vh - 100px)",
          overflow: "auto",
          position: "relative",
        }}
      >
        <LoaderComponent fullscreen={false} loading={loading} />

        {!loading && (
          <>
            {fileUrl ? (
              <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js">
                <Viewer
                  localization={isEnglish ? en_US : ar_AE}
                  renderLoader={() => <Spinner size="default" />}
                  fileUrl={fileUrl}
                  plugins={[defaultLayoutPluginInstance]}
                  theme={currentThemeName === "dark" ? "dark" : "light"}
                />
              </Worker>
            ) : (
              <NoDocAvailable isEnglish={isEnglish} />
            )}{" "}
          </>
        )}
      </div>
    </div>
  );
};

async function downloadCorrespondenceDocument(corrId: string | number) {
  const token = await Storage.getItem(LOCALSTORAGE.ACCESS_TOKEN);
  const request = await fetch(
    ENV.API_URL + `/correspondence/content/${corrId}/download`,

    {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Bearer ${token}`,
        Accept: "application/pdf",
      },
    }
  );

  if (!request.ok) {
    throw new Error(`Failed to download template. Status: ${request.status}`);
  }

  const rawBlob = await request.blob();
  const fileBlob = new Blob([rawBlob], { type: "application/pdf" });
  const url = window.URL.createObjectURL(fileBlob);

  return url;
}

async function downloadCorrespondencePDF(corrId: string | number) {
  const token = await Storage.getItem(LOCALSTORAGE.ACCESS_TOKEN);
  const request = await fetch(
    ENV.API_URL + `/task/get-pdf?id=${corrId}`,

    {
      method: "GET",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Bearer ${token}`,
        Accept: "application/pdf",
      },
    }
  );

  if (!request.ok) {
    throw new Error(`Failed to download template. Status: ${request.status}`);
  }

  const rawBlob = await request.blob();
  const fileBlob = new Blob([rawBlob], { type: "application/pdf" });
  const url = window.URL.createObjectURL(fileBlob);

  return url;
}

const NoDocAvailable = ({ isEnglish }: { isEnglish: boolean }) => {
  return (
    <div
      style={{
        width: "100%",
        height: "calc(100vh - 100px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        border: "2px solid gray",
      }}
    >
      {isEnglish ? "No Document Available" : "لا يوجد مستند "}
    </div>
  );
};
