import { Col, Row } from "antd";
import { useLanguage } from "../../context/language";
import TitleBar from "../../components/ui/bar/title-bar";
import { PaperClipOutlined, TableOutlined } from "@ant-design/icons";
import { useParams } from "react-router-dom";
import TitleHeader from "../../components/ui/header";
import { CSSProperties, useEffect } from "react";
import Actions from "./components/actions";
import CorrespondenceInfo from "./components/correspondence-info";

import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import LoaderComponent from "../../components/ui/loader";
import CorrespondenceAttachments from "./components/attachments";
import InboundDocEditor from "./components/document-editor";

import useGetCorrespondenceDetails from "@/components/shared/hooks/use-get-correspondence";
import { InboundSchema, InboundType } from "./schema";
import FadeInWrapperAnimation from "@/animations/fade-in-wrapper-animation";

export default function CreateInbound() {
  const { labels } = useLanguage();
  const { id } = useParams();

  const { corrDetails, handleGetCorrespondenceDetails, loading } =
    useGetCorrespondenceDetails();

  useEffect(() => {
    if (!id) return;
    handleGetCorrespondenceDetails(id);
  }, [id]);

  useEffect(() => {
    if (corrDetails) {
      reset({
        ...corrDetails,
        cc_internal: corrDetails.internal_cc || [],
        cc_users: corrDetails.user_cc || [],
      });
    }
  }, [corrDetails]);

  const methods = useForm<InboundType>({
    resolver: zodResolver(InboundSchema),
  });
  const { reset } = methods;

  return (
    <>
      {loading ? (
        <LoaderComponent loading={loading} delay={0} fullscreen={false} />
      ) : (
        <FadeInWrapperAnimation
          enableScaleAnimation={false}
          animateDuration={0.78}
        >
          <TitleBar
            headerText={id ? labels["Edit Inbound"] : labels.btn.create_inbound}
          />
          <FormProvider {...methods}>
            <Actions />
            <TitleHeader
              heading={labels.til.inbound_form}
              icon={<TableOutlined style={{ color: "#fff" }} />}
            />
            <Row gutter={8} style={styles.inboundForm}>
              <Col span={12} lg={12} md={16} sm={24} style={{ padding: 8 }}>
                <InboundDocEditor corrID={id ?? ""} />
              </Col>
              <Col
                span={12}
                lg={12}
                md={8}
                sm={24}
                style={{
                  position: "relative",
                  borderLeft: "2px solid #d3d3d3",
                }}
              >
                <CorrespondenceInfo />

                {/* <Button
              type="link"
              style={styles.expandIcon}
              onClick={() => setExpanded(!expanded)}
            >
              {expanded ? <FullscreenExitOutlined /> : <FullscreenOutlined />}
            </Button> */}
              </Col>
            </Row>
            <TitleHeader
              heading={labels.til.attachments}
              icon={<PaperClipOutlined style={{ color: "#fff" }} />}
            />
            <Row style={{ paddingTop: 10 }}>
              <CorrespondenceAttachments
                canViewHistory={true}
                corrId={id ?? ""}
              />
            </Row>
          </FormProvider>
        </FadeInWrapperAnimation>
      )}
    </>
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
};
