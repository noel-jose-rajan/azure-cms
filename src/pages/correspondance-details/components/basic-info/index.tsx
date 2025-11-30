import { Button, Col, Row } from "antd";
import { ChangeEvent, useState } from "react";
import { useLanguage } from "../../../../context/language";
import TextWithValue from "../text-value-wrapper";
import {
  CloseOutlined,
  CloudDownloadOutlined,
  CloudUploadOutlined,
  EditFilled,
  EditOutlined,
} from "@ant-design/icons";
import UploadNewVersionModal from "../versions/components/upload-version";
import { DraftCorrespondenceType } from "../../../../components/services/outbound/types";
import usePicklist from "@/store/picklists/use-picklist";
import { InboxTask } from "@/components/services/inbox";
import Iframe from "@/components/ui/iframe";
import moment from "moment";
import TextWithTag from "@/components/ui/text-with-tag";
import {
  downloadCorrespondenceDocument,
  editDraft,
} from "@/components/shared/outbound/service";
import ButtonComponent from "@/components/ui/button";
import FadeInWrapperAnimation from "@/animations/fade-in-wrapper-animation";
import { MaterialInput } from "@/components/ui/material-input";
import Picklist from "@/components/shared/picklist";
import { AnimatePresence } from "framer-motion";
import useHandleError from "@/components/hooks/useHandleError";
import useGetAllOU from "@/store/orgs/use-get-all-ou";
import MultiCorrespondence from "./components/multi-corr";
import useExternalEntities from "@/store/external-entities/use-external-entities";

interface BasicInfoProps {
  details?: DraftCorrespondenceType;
  task?: InboxTask;
  isAcquired?: boolean;
  refreshDetails: () => Promise<void>;
  isSendTask?: boolean;
  isFromSearch?: boolean;
}

export default function BasicInfo({
  details,
  task,
  isAcquired = false,
  refreshDetails,
  isSendTask = false,
  isFromSearch = false,
}: BasicInfoProps) {
  const { getPicklistById } = usePicklist();
  const { getOrgById } = useGetAllOU();
  const { getExternalEntityById } = useExternalEntities();
  const { handleError } = useHandleError();

  const { labels, isEnglish } = useLanguage();
  const [selectedCorrId, setSelectedCorrId] = useState<string | number | null>(
    null
  );
  const [isMultiCorr, setIsMultiCorr] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [editForm, setEditForm] = useState({
    corr_subject: details?.corr_subject,
    security_level_id: details?.security_level_id,
    urgency_id: details?.urgency_id,
    doc_type_id: details?.doc_type_id,
    stamp_type_id: details?.stamp_type_id,
  });
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [fileChangeCount, setFileChangeCount] = useState<number>(0);

  const toggleEditMode = (bool: boolean) => {
    setIsEditMode(bool);
  };

  const resetForm = () => {
    setEditForm({
      corr_subject: details?.corr_subject,
      security_level_id: details?.security_level_id,
      urgency_id: details?.urgency_id,
      doc_type_id: details?.doc_type_id,
      stamp_type_id: details?.stamp_type_id,
    });
  };
  const downloadLatestVersion = async () => {
    if (details) {
      const response = await downloadCorrespondenceDocument(
        details?.id?.toString(),
        details?.content_type === "pdf" ? ".pdf" : ".docx"
      );

      if (!response) {
      }
    }
  };

  const handleFetchCorrDetails = async () => {
    if (!details?.id) return;
    setLoading(true);
    try {
      await refreshDetails();
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
      setIsEditMode(false);
    }
  };
  const handleInputChange = (key: keyof typeof editForm, value: any) => {
    setEditForm({
      ...editForm,
      [key]: value,
    });
  };
  const _status_picklist = getPicklistById(
    "Status",
    details?.corr_status_id || ""
  );
  const _corr_type_picklist = getPicklistById(
    "Correspondence Type",
    details?.corr_type_id || ""
  );

  const _security_picklist = getPicklistById(
    "Security Level",
    details?.security_level_id || ""
  );

  const _urgency_picklist = getPicklistById(
    "Urgency Level",
    details?.urgency_id || ""
  );

  const _stamp_picklist = getPicklistById(
    "Stamp Options",
    details?.stamp_type_id || ""
  );

  const _doc_picklist = getPicklistById(
    "Document Type",
    details?.doc_type_id || ""
  );

  const handleSaveDraft = async () => {
    try {
      setLoading(true);
      const response = await editDraft(task?.correspondence_id + "", editForm);

      if (response) {
        await handleFetchCorrDetails();
      }
    } catch (error) {
      handleError(error);
      setLoading(false);
    }
  };
  const _sendingEntity =
    getOrgById(details?.sending_entity_id || 0) ||
    getExternalEntityById(details?.sending_entity_id || 0);

  const _getReceivingEntities = () => {
    if (details?.is_multi_receiving) {
      const entities =
        details?.receiving_entities?.map(
          (id) => getOrgById(id) || getExternalEntityById(id)
        ) || [];
      return entities?.map(
        (entity) => (isEnglish ? entity?.name_en : entity?.name_ar) || "-"
      );
    } else {
      const _receivingEntity =
        getOrgById(details?.receiving_entity_id || 0) ||
        getExternalEntityById(details?.receiving_entity_id || 0);
      return [
        (isEnglish ? _receivingEntity?.name_en : _receivingEntity?.name_ar) ||
          "-",
      ];
    }
  };
  return (
    <Row
      gutter={20}
      style={{
        height: "100%",
        width: "100%",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <Col
        span={11}
        xl={11}
        md={23}
        sm={23}
        style={{ margin: 16, position: "relative" }}
      >
        <AnimatePresence>
          {isAcquired && !isEditMode && !isSendTask && (
            <FadeInWrapperAnimation
              key="edit-button"
              style={{
                position: "absolute",
                top: 0,
                right: isEnglish ? 20 : "initial",
                left: isEnglish ? "initial" : 20,
                zIndex: 5,
              }}
            >
              <ButtonComponent
                type="primary"
                icon={<EditFilled />}
                onClick={() => toggleEditMode(true)}
              />
            </FadeInWrapperAnimation>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {!isEditMode ? (
            <FadeInWrapperAnimation
              enableScaleAnimation={false}
              key={"info-view"}
            >
              <TextWithValue
                primaryText={labels.lbl.corr_subject}
                secondaryText={details?.corr_subject}
              />

              <TextWithValue
                primaryText={labels.lbl.corr_number}
                secondaryText={details?.correspondence_no || "-"}
              />
              <TextWithValue
                primaryText={labels.lbl.corr_date}
                secondaryText={
                  moment(details?.correspondence_date).format(
                    "YYYY-MM-DD hh:mm a"
                  ) || "-"
                }
              />
              <TextWithValue
                primaryText={labels.lbl.corr_status}
                secondaryText={
                  (isEnglish
                    ? _status_picklist?.picklist_en_label
                    : _status_picklist?.picklist_ar_label) || "-"
                }
              />

              <TextWithTag
                primaryText={labels.lbl.sending_entity}
                secondaryText={
                  // task?.from_entity_name
                  //   ? [task.from_entity_name]
                  //   :
                  [
                    (isEnglish
                      ? _sendingEntity?.name_en
                      : _sendingEntity?.name_ar) || "-",
                  ]
                }
              />
              {(!isMultiCorr || !isSendTask) && (
                <TextWithTag
                  primaryText={labels.lbl.receiving_entity}
                  secondaryText={_getReceivingEntities()}
                />
              )}
              <TextWithValue
                primaryText={labels.lbl.correspondence_type}
                secondaryText={
                  (isEnglish
                    ? _corr_type_picklist?.picklist_en_label
                    : _corr_type_picklist?.picklist_ar_label) || "-"
                }
              />
              <TextWithValue
                primaryText={labels.lbl.document_type}
                secondaryText={
                  (isEnglish
                    ? _doc_picklist?.picklist_en_label
                    : _doc_picklist?.picklist_ar_label) || "-"
                }
              />
              <TextWithValue
                primaryText={labels.lbl.urgency_level}
                secondaryText={
                  (isEnglish
                    ? _urgency_picklist?.picklist_en_label
                    : _urgency_picklist?.picklist_ar_label) || "-"
                }
              />
              <TextWithValue
                primaryText={labels.lbl.security_level}
                secondaryText={
                  (isEnglish
                    ? _security_picklist?.picklist_en_label
                    : _security_picklist?.picklist_ar_label) || "-"
                }
              />
              <TextWithValue
                primaryText={labels.lbl.stamp_type}
                secondaryText={
                  (isEnglish
                    ? _stamp_picklist?.picklist_en_label
                    : _stamp_picklist?.picklist_ar_label) || "-"
                }
              />
              {isSendTask && (
                <MultiCorrespondence
                  corrId={details?.id || 0}
                  onSelect={(id) => setSelectedCorrId(id)}
                  setIsMultiCorr={setIsMultiCorr}
                />
              )}
            </FadeInWrapperAnimation>
          ) : (
            <FadeInWrapperAnimation
              enableScaleAnimation={false}
              key="picklist-edit"
            >
              <Col style={{ marginTop: 16 }}>
                <MaterialInput
                  label={labels.lbl.subject}
                  value={editForm.corr_subject}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    handleInputChange("corr_subject", e.target.value)
                  }
                  style={{ marginBottom: 10 }}
                />
              </Col>
              <Col style={{ marginTop: 16 }}>
                <Picklist
                  value={editForm.doc_type_id}
                  onChange={(value) => handleInputChange("doc_type_id", value)}
                  code="Document Type"
                  label={labels.lbl.document_type}
                />
              </Col>
              <Col style={{ marginTop: 16 }}>
                <Picklist
                  value={editForm.urgency_id}
                  onChange={(value) => handleInputChange("urgency_id", value)}
                  code="Urgency Level"
                  label={labels.lbl.urgency_level}
                />
              </Col>
              <Col style={{ marginTop: 16 }}>
                <Picklist
                  value={editForm.security_level_id}
                  onChange={(value) =>
                    handleInputChange("security_level_id", value)
                  }
                  code="Security Level"
                  label={labels.lbl.security_level}
                />
              </Col>
              <Col style={{ marginTop: 16 }}>
                <Picklist
                  value={editForm.stamp_type_id}
                  onChange={(value) =>
                    handleInputChange("stamp_type_id", value)
                  }
                  code="Stamp Options"
                  label={labels.lbl.stamp_type}
                />
              </Col>
              <div
                style={{
                  display: "flex",
                  gap: 10,
                  marginTop: 10,
                  justifyContent: isEnglish ? "flex-start" : "flex-end",
                }}
              >
                <ButtonComponent
                  buttonLabel={labels.btn.cancel}
                  icon={<CloseOutlined />}
                  onClick={() => {
                    toggleEditMode(false);
                    resetForm();
                  }}
                />
                <ButtonComponent
                  type="primary"
                  buttonLabel={labels.btn.edit}
                  icon={<EditOutlined />}
                  disabled={!editForm.corr_subject}
                  spinning={loading}
                  onClick={handleSaveDraft}
                />
              </div>
            </FadeInWrapperAnimation>
          )}
        </AnimatePresence>
      </Col>

      <Col span={12} xl={12} md={24} sm={24}>
        {isAcquired && !isSendTask && (
          <Row gutter={30} style={{ marginBottom: 20 }}>
            <Col span={12}>
              <Button
                style={{ width: "100%", height: 40 }}
                type="primary"
                onClick={downloadLatestVersion}
              >
                <CloudDownloadOutlined />
                {labels.btn.corres_download_latest}
              </Button>
            </Col>
            <Col span={12}>
              <Button
                style={{ width: "100%", height: 40 }}
                type="primary"
                onClick={() => setModalVisible(true)}
              >
                <CloudUploadOutlined />
                {labels.btn.import_new_version}
              </Button>
            </Col>
          </Row>
        )}

        <Iframe
          key={fileChangeCount.toString() + selectedCorrId?.toString()}
          corrID={
            isSendTask && isMultiCorr ? selectedCorrId || "" : details?.id || ""
          }
          enableEdit={
            isSendTask || isFromSearch || !isAcquired
              ? false
              : details?.content_type != "pdf"
          }
          isPdf={isSendTask ? true : details?.content_type === "pdf"}
        />
      </Col>
      {modalVisible && (
        <UploadNewVersionModal
          corrId={details?.id || ""}
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          onSubmit={() => setFileChangeCount((count) => count + 1)}
        />
      )}
    </Row>
  );
}
