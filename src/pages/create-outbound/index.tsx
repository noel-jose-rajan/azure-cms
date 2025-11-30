import { useEffect, useState } from "react";
import { Button, Card, Col, Row } from "antd";
import {
  CloudDownloadOutlined,
  CloudUploadOutlined,
  TableOutlined,
} from "@ant-design/icons";
import TitleBar from "../../components/ui/bar/title-bar";
import TitleHeader from "../../components/ui/header";
import AccreditationForm from "./components/accreditation-form";
import OutBoundForm from "./components/out-bound-form";
import { useLanguage } from "../../context/language";
import { useNavigate, useParams } from "react-router-dom";
import Actions from "./components/actions";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm, useWatch } from "react-hook-form";
import {
  CreateCorrespondenceType,
  correspondenceCreateSchema,
} from "../../components/services/outbound/types";
import Iframe from "@/components/ui/iframe";
import OutboundSendingEntitySelect from "@/components/shared/outbound/sending-entity-select";
import {
  downloadCorrespondenceDocument,
  getOutboundDraftById,
} from "@/components/shared/outbound/service";
import LoaderComponent from "@/components/ui/loader";
import CorrespondenceAttachments from "../create-inbound/components/attachments";
import FadeInWrapperAnimation from "@/animations/fade-in-wrapper-animation";
import UploadNewVersionModal from "../correspondance-details/components/versions/components/upload-version";
import useHandleError from "@/components/hooks/useHandleError";

const CreateOutbound: React.FC = () => {
  const { handleError } = useHandleError();
  const { id } = useParams();
  const { labels, isEnglish } = useLanguage();

  const [loading, setLoading] = useState<boolean>(true);
  useEffect(() => {
    if (!id) return;
    init();
  }, [id]);
  const [continueButton, setContinueButton] = useState<boolean>(false);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [fileChangeCount, setFileChangeCount] = useState<number>(0);
  const [iframeURL, setIframeURL] = useState<string>("");

  const form = useForm<CreateCorrespondenceType>({
    resolver: zodResolver(correspondenceCreateSchema),
  });
  const navigate = useNavigate();

  const { control } = form;

  const { sending_entity_id, receiving_entities_id, corr_subject } = useWatch({
    control,
  });

  const getCorrespondenceDetails = async () => {
    try {
      setLoading(true);
      const res = await getOutboundDraftById(id + "");

      setIframeURL(" ");
      //@ts-ignore
      form.reset({
        ...res,
        cc_users: res?.user_cc || [],
        cc_external: res?.external_cc || [],
        cc_internal: res?.internal_cc || [],
        receiving_entities_id: res?.receiving_entities || [],
      });
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const init = async () => {
    if (!id) return;
    await getCorrespondenceDetails();
  };

  const downloadLatestVersion = async () => {
    try {
      await downloadCorrespondenceDocument(id + "", ".docx");
    } catch (error) {
      handleError(error);
    }
  };
  return (
    <>
      {loading ? (
        <LoaderComponent loading={loading} delay={0} fullscreen={false} />
      ) : (
        <FadeInWrapperAnimation
          enableScaleAnimation={false}
          animateDuration={0.75}
        >
          <FormProvider {...form}>
            <TitleBar headerText={labels.mnu.outbound} />
            <br />

            <Actions
              id={id + ""}
              onClickContinue={() => setContinueButton((v) => !v)}
              disableContinueButton={
                !corr_subject ||
                !receiving_entities_id ||
                receiving_entities_id?.length === 0
              }
            />

            <TitleHeader
              applyReverse={true}
              heading={labels.til.outbound_form}
              icon={<TableOutlined style={{ color: "#fff" }} />}
            />

            <Row
              style={{ transition: "all 0.3s ease", marginTop: 10 }}
              gutter={[16, 16]}
              // wrap={isEnlarged}
            >
              <Col
                xs={!iframeURL ? 0 : 24}
                sm={!iframeURL ? 0 : 24}
                md={!iframeURL ? 0 : 24}
                lg={!iframeURL ? 0 : 12}
                style={{
                  transition: "all 0.3s ease",
                  display: "flex",
                  justifyContent: "flex-end",
                }}
              >
                {iframeURL && (
                  <div
                    style={{
                      marginTop: 16,
                      display: "flex",
                      flexDirection: "column",
                      width: "100%",
                      paddingInline: 12,
                      gap: 8,
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        flexDirection: isEnglish ? "row" : "row-reverse",
                        flexWrap: "wrap",
                        gap: 8,
                      }}
                    >
                      {" "}
                      <Button
                        style={{ height: 40, flex: 1 }}
                        type="primary"
                        onClick={downloadLatestVersion}
                      >
                        <CloudDownloadOutlined />
                        {labels.btn.corres_download_latest}
                      </Button>
                      <Button
                        style={{ height: 40, flex: 1 }}
                        type="primary"
                        onClick={() => setModalVisible(true)}
                      >
                        <CloudUploadOutlined />
                        {labels.btn.import_new_version}
                      </Button>
                    </div>
                    <Iframe corrID={id + ""} key={fileChangeCount} enableEdit />
                  </div>
                )}
              </Col>
              <Col
                xs={24}
                sm={24}
                md={24}
                lg={!iframeURL ? 24 : 12}
                style={{ minHeight: 700, transition: "all 0.3s ease" }}
              >
                <Card>
                  <Col span={24}>
                    <TitleHeader
                      applyReverse={false}
                      heading={labels.til.outbound_templates}
                      icon={<TableOutlined style={{ color: "#fff" }} />}
                    />
                    <br />
                    <OutboundSendingEntitySelect
                      value={sending_entity_id}
                      disabled
                    />
                    <br />
                  </Col>
                </Card>
                <br />
                {iframeURL && <OutBoundForm />}
                <br />
              </Col>
            </Row>

            <Col span={24}>
              <Row>
                <CorrespondenceAttachments canEdit={true} corrId={id || ""} />
              </Row>
            </Col>
          </FormProvider>
          {continueButton && (
            <AccreditationForm
              key="accreditation-form"
              open={continueButton}
              onCancel={() => setContinueButton(false)}
              onClose={() => {
                setContinueButton(false);
                navigate(-1);
              }}
              corrData={form.getValues()}
            />
          )}
        </FadeInWrapperAnimation>
      )}

      {modalVisible && (
        <UploadNewVersionModal
          corrId={id || ""}
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          onSubmit={() => setFileChangeCount((count) => count + 1)}
        />
      )}
    </>
  );
};

export default CreateOutbound;
