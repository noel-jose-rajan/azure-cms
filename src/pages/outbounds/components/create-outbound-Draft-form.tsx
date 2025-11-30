import FadeInWrapperAnimation from "@/animations/fade-in-wrapper-animation";
import HeightAnimationWrapper from "@/animations/height-wrapper-animation";
import useCustomMessage from "@/components/hooks/use-message";
import useHandleError from "@/components/hooks/useHandleError";
import {
  createDraftOutboundSchema,
  DraftOutboundType,
  ReplyCorrespondenceType,
} from "@/components/services/outbound/schema";
import OutboundTemplatesSelect from "@/components/shared/outbound/outbound-templates-select";
import OutboundSendingEntitySelect from "@/components/shared/outbound/sending-entity-select";
import {
  createOutboundDraft,
  editDraft,
} from "@/components/shared/outbound/service";
import Picklist from "@/components/shared/picklist";
import ButtonComponent from "@/components/ui/button";
import { MaterialInput } from "@/components/ui/material-input";
import { useLanguage } from "@/context/language";
import {
  LeftOutlined,
  PlusOutlined,
  RightOutlined,
  RollbackOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Col, Form, Radio, Upload } from "antd";
import { startTransition, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

type Props = {
  onClose: () => void;
  onCreate: () => void;
  replyData?: ReplyCorrespondenceType;
};
const CreateOutboundDraftForm = ({ replyData, onClose, onCreate }: Props) => {
  const { showMessage } = useCustomMessage();
  const { handleError } = useHandleError();
  const navigate = useNavigate();

  const [fileType, setFileType] = useState<1 | 2>(1);
  const [submitType, setSubmitType] = useState<"continue" | "create">(
    "continue"
  );
  const [loading, setLoading] = useState<boolean>(false);
  const { labels, isEnglish } = useLanguage();

  const {
    control,
    getValues,
    watch,
    setValue,
    handleSubmit,
    formState: { isValid },
  } = useForm<DraftOutboundType>({
    resolver: zodResolver(createDraftOutboundSchema),
    defaultValues: {
      corr_subject: replyData?.corr_subject,
      outbound_type: replyData?.outbound_type,
    },
  });
  const { sending_entity, file, template_id } = watch();

  const handleCreateDraft = async (submitType?: "continue" | "create") => {
    try {
      setLoading(true);
      const { sending_entity, file, template_id, corr_subject } = getValues();
      const formData = new FormData();
      formData.append("corr_subject", corr_subject);
      formData.append("sending_entity", String(sending_entity));
      if (template_id) {
        formData.append("template_id", String(template_id));
      }
      if (file) {
        formData.append("file", file.originFileObj as any);
      }
      formData.append("outbound_type", String(getValues("outbound_type")));
      const res = await createOutboundDraft(formData);
      if (res?.ID) {
        showMessage("success", labels.msg.outbound_saved);

        if (!replyData) {
          if (submitType == "continue") {
            navigate(`/correspondence/outbound/${res.ID}`);
          } else {
            onCreate();
            onClose();
          }
        } else {
          await handleSaveDraft(res?.ID);
          navigate(`/correspondence/outbound/${res?.ID}`);
        }
      }
    } catch (err) {
      handleError(err);
      setLoading(false);
    } finally {
      if (submitType != "continue") {
        setLoading(false);
      }
    }
  };
  const handleSaveDraft = async (id: number | string) => {
    const body = {
      related: replyData?.id ? [replyData?.id] : [],
    };

    try {
      await editDraft(id, body);
    } catch (error) {
      handleError(error);
    }
  };
  return (
    <Form name="create-outbound-draft" layout="vertical">
      <Col span={24} style={{ marginTop: 20 }}>
        <Controller
          name="corr_subject"
          control={control}
          render={({ field }) => (
            <MaterialInput label={labels.lbl.subject} {...field} />
          )}
        />
      </Col>

      <Col
        span={24}
        style={{ marginTop: 20 }}
        key={"select sending entity" + replyData?.sending_entity}
      >
        <Controller
          name="sending_entity"
          control={control}
          render={({ field }) => (
            <OutboundSendingEntitySelect
              {...field}
              onChange={(value) => {
                field.onChange(value);
                setValue("template_id", null);
              }}
            />
          )}
        />
      </Col>
      <Col span={24} style={{ marginTop: 20 }}>
        <Controller
          name="outbound_type"
          control={control}
          render={({ field }) => (
            <Picklist
              {...field}
              code="outbound types"
              label={labels.lbl.outbound_type}
            />
          )}
        />
      </Col>
      <Col span={24} style={{ marginTop: 20 }}>
        <Radio.Group
          value={fileType}
          onChange={(e) => {
            setFileType(e.target.value);
            setValue("file", null);
            setValue("template_id", null);
          }}
          options={[
            { value: 1, label: labels.lbl.from_local_file },
            { value: 2, label: labels.lbl.from_template },
          ]}
        />
      </Col>
      <HeightAnimationWrapper>
        {fileType === 2 ? (
          <FadeInWrapperAnimation
            key="template-select"
            enableScaleAnimation={false}
          >
            <Col span={24} style={{ marginTop: 20 }}>
              <Controller
                name="template_id"
                control={control}
                render={({ field }) => (
                  <OutboundTemplatesSelect
                    {...field}
                    entityId={sending_entity}
                  />
                )}
              />
            </Col>
          </FadeInWrapperAnimation>
        ) : (
          <FadeInWrapperAnimation
            key="file-upload"
            enableScaleAnimation={false}
          >
            <Col span={24} style={{ marginTop: 20 }}>
              <Controller
                name="file"
                control={control}
                render={({ field }) => (
                  <Upload
                    style={{ marginBlock: 2 }}
                    customRequest={({ onSuccess }) => {
                      if (onSuccess) {
                        onSuccess("ok");
                      }
                    }}
                    accept=".docx"
                    maxCount={1}
                    onChange={(info) => {
                      if (info?.fileList?.length > 0) {
                        field.onChange(info.file);
                      } else {
                        field.onChange(null);
                      }
                    }}
                  >
                    <Button icon={<UploadOutlined />} type="primary">
                      {labels.btn.upload}
                    </Button>
                  </Upload>
                )}
              />
            </Col>
          </FadeInWrapperAnimation>
        )}
      </HeightAnimationWrapper>

      <Col
        span={24}
        style={{ marginTop: 20, display: "flex", justifyContent: "end" }}
      >
        {!replyData ? (
          <>
            <ButtonComponent
              buttonLabel={labels.btn.create_continue}
              type="primary"
              icon={isEnglish ? <LeftOutlined /> : <RightOutlined />}
              disabled={!isValid || (!file && !template_id)}
              spinning={loading && submitType === "continue"}
              onClick={() => {
                setSubmitType("continue");
                startTransition(() => {
                  handleSubmit(() => handleCreateDraft("continue"))();
                });
              }}
            />
            <ButtonComponent
              buttonLabel={labels.btn.create}
              type="primary"
              style={{ marginInline: 8 }}
              icon={<PlusOutlined />}
              spinning={loading && submitType === "create"}
              disabled={!isValid || (!file && !template_id)}
              onClick={() => {
                setSubmitType("create");
                startTransition(() => {
                  handleSubmit(() => handleCreateDraft("create"))();
                });
              }}
            />{" "}
          </>
        ) : (
          <ButtonComponent
            buttonLabel={labels.btn.replay_to}
            type="primary"
            style={{ marginInline: 8 }}
            icon={<RollbackOutlined />}
            spinning={loading}
            disabled={!isValid || (!file && !template_id)}
            onClick={() => handleCreateDraft()}
          />
        )}
      </Col>
    </Form>
  );
};

export default CreateOutboundDraftForm;
