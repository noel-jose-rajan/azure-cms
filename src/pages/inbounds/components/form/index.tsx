import {
  createDraftInboundSchema,
  DraftInboundType,
} from "@/components/services/outbound/schema";
import { createInBoundDraft } from "@/components/shared/outbound/service";
import ButtonComponent from "@/components/ui/button";
import { MaterialInput } from "@/components/ui/material-input";
import { useLanguage } from "@/context/language";
import {
  LeftOutlined,
  PlusOutlined,
  RightOutlined,
  ScanOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Col, Form, Modal, Upload } from "antd";
import { startTransition, useCallback, useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import InboundReceivingEntity from "../reciving-entity";
import SelectExternalEntity from "@/components/shared/select-external-entity";
import useHandleError from "@/components/hooks/useHandleError";
import Scanner from "@/components/dynamsoft";
import useCustomMessage from "@/components/hooks/use-message";
import useCapature from "@/components/hooks/useCapature";
import ScanModal from "./scan-modal";

type Props = {
  onClose: () => void;
  onCreate: () => void;
};
const CreateINBoundDraftForm = ({ onClose, onCreate }: Props) => {
  const { showMessage } = useCustomMessage();
  const navigate = useNavigate();
  const { handleError } = useHandleError();
  const [submitType, setSubmitType] = useState<"continue" | "create">(
    "continue"
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [openScanner, setOpenScanner] = useState<boolean>(false);

  const { labels, isEnglish } = useLanguage();

  const {
    control,
    getValues,
    watch,
    setValue,
    handleSubmit,
    formState: { isValid },
  } = useForm<DraftInboundType>({
    resolver: zodResolver(createDraftInboundSchema),
  });
  const { file } = watch();

  const handleOnClose = useCallback(() => setStartProcess(false), []);

  const {
    handleStartABBYY,
    currentProcess,
    startProcess,
    setStartProcess,
    rows,
  } = useCapature(handleOnClose);

  const { corr_subject, sending_entity, receiving_entity } = watch();

  const handleCreateDraft = async (submitType: "continue" | "create") => {
    try {
      setLoading(true);
      const { sending_entity, file, corr_subject, receiving_entity } =
        getValues();

      const formData = new FormData();
      formData.append("corr_subject", corr_subject);
      formData.append("sending_entity", sending_entity + "");
      formData.append("receiving_entity", receiving_entity + "");

      if (file) {
        formData.append("file", file.originFileObj as any);
      }
      const res = await createInBoundDraft(formData);
      if (res?.ID) {
        showMessage("success", labels.msg.inbound_saved);
        if (submitType == "continue") {
          navigate(`/correspondence/inbound/${res.ID}`);
        } else {
          onCreate();
          onClose();
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

  useEffect(() => {
    if (rows?.length > 0) {
      setValue("corr_subject", rows[0]?.subject);
      setStartProcess(false);
      setOpenScanner(false);
    }
  }, [rows]);

  return (
    <>
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

        <Col span={24} style={{ marginTop: 20 }}>
          <Controller
            name="sending_entity"
            control={control}
            render={({ field }) => (
              <SelectExternalEntity
                label={labels.lbl.sending_entity}
                multiSelect={false}
                {...field}
                onChange={(value) => {
                  field.onChange(value);
                }}
              />
            )}
          />
        </Col>

        <Col span={24} style={{ marginTop: 20 }}>
          <Controller
            name="receiving_entity"
            control={control}
            render={({ field }) => (
              <InboundReceivingEntity
                value={field.value as number}
                onChange={(value: number) => {
                  field.onChange(value as number);
                }}
              />
            )}
          />
        </Col>
        <Col span={24} style={{ marginTop: 20 }}>
          <Controller
            name="file"
            control={control}
            render={({ field }) => (
              <div style={{ display: "flex", alignItems: "start" }}>
                {" "}
                <Button
                  type="primary"
                  style={{
                    borderRadius: 10,
                    marginInline: 8,
                  }}
                  onClick={() => setOpenScanner(true)}
                >
                  <ScanOutlined />
                  {labels.btn.scan}
                </Button>
                <Upload
                  style={{ marginBlock: 2 }}
                  accept=".pdf"
                  maxCount={1}
                  customRequest={({ onSuccess }) => {
                    if (onSuccess) {
                      onSuccess("ok");
                    }
                  }}
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
              </div>
            )}
          />
        </Col>

        <Col
          span={24}
          style={{ marginTop: 20, display: "flex", justifyContent: "end" }}
        >
          <ButtonComponent
            buttonLabel={labels.btn.create_continue}
            type="primary"
            icon={isEnglish ? <LeftOutlined /> : <RightOutlined />}
            disabled={
              !sending_entity || !corr_subject || !receiving_entity || !file
            }
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
            disabled={
              !sending_entity || !corr_subject || !receiving_entity || !file
            }
            onClick={() => {
              setSubmitType("create");
              startTransition(() => {
                handleSubmit(() => handleCreateDraft("create"))();
              });
            }}
          />
        </Col>
      </Form>
      {startProcess && (
        <ScanModal
          rows={rows}
          onCancel={() => setStartProcess(false)}
          curretProcess={currentProcess}
        />
      )}
      <Modal
        open={openScanner}
        onClose={() => setOpenScanner(false)}
        onCancel={() => setOpenScanner(false)}
        width={"fit-content"}
        style={{
          maxWidth: "unset",
          top: "5vh",
        }}
        zIndex={1000}
      >
        <Scanner
          onPdfGenerate={async (blob) => {
            const file = new File([blob], Date.now() + ".pdf", {
              type: blob.type || "application/pdf",
            });
            setValue("file", {
              ...file,
              originFileObj: file,
            });
            await handleStartABBYY(blob);

            // setOpenScanner(false);
          }}
        />
      </Modal>
    </>
  );
};

export default CreateINBoundDraftForm;
