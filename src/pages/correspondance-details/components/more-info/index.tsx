import { Button, Col, Row, TableColumnsType } from "antd";
import TextWithValue from "../text-value-wrapper";
import { useLanguage } from "../../../../context/language";
import TitleHeader from "../../../../components/ui/header";
import {
  ApiFilled,
  CloseOutlined,
  DeleteFilled,
  EditFilled,
  EditOutlined,
} from "@ant-design/icons";
import { useTheme } from "../../../../context/theme";
import {
  DraftCorrespondenceType,
  RelatedCorr,
} from "@/components/services/outbound/types";
import usePicklist from "@/store/picklists/use-picklist";
import useGetAllUsers from "@/store/users/use-get-all-users";
import TextWithTag from "@/components/ui/text-with-tag";
import useExternalEntities from "@/store/external-entities/use-external-entities";
import useGetAllOU from "@/store/orgs/use-get-all-ou";
import { ChangeEvent, useEffect, useState } from "react";
import FadeInWrapperAnimation from "@/animations/fade-in-wrapper-animation";
import { AnimatePresence } from "framer-motion";
import ButtonComponent from "@/components/ui/button";
import SelectOU from "@/components/shared/select-org-units";
import SelectExternalEntity from "@/components/shared/select-external-entity";
import SelectUsers from "@/components/shared/select-users";
import Picklist from "@/components/shared/picklist";
import { MaterialInput } from "@/components/ui/material-input";
import { editDraft } from "@/components/shared/outbound/service";
import useHandleError from "@/components/hooks/useHandleError";
import KeywordInput from "@/components/ui/form/KeyWordInput";
import TableComponent from "@/components/ui/table-component";
import useGetRelatedCorr from "@/components/shared/related-corr-select/hooks/use-get-related-corr";
import ActionMenuItem from "@/components/ui/menu-item";
import RelatedCorrespondenceModal from "@/components/shared/related-corr-select/components/modal";
import { CONST_DATA } from "@/constants/app";
import { useNavigate } from "react-router-dom";

interface MoreInfoProps {
  details?: DraftCorrespondenceType;
  isAcquired?: boolean;
  refreshDetails: () => Promise<void>;
  isOutbound?: boolean;
  isInbound?: boolean;
  isSendTask?: boolean;
}

export default function MoreInfoCorrespondence({
  details,
  isAcquired,
  refreshDetails,
  isOutbound = false,
  isInbound = false,
  isSendTask = false,
}: MoreInfoProps) {
  const navigate = useNavigate();
  const { labels, isEnglish } = useLanguage();
  const { getUserById } = useGetAllUsers();
  const { getExternalEntityById } = useExternalEntities();
  const { getOrgById } = useGetAllOU();
  const { theme } = useTheme();
  const { getPicklistById } = usePicklist();
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const { handleError } = useHandleError();
  const [fixedKeywords, setFixedKeywords] = useState<string[] | null>(null);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [editForm, setEditForm] = useState({
    corr_language_id: details?.corr_language_id || 0,
    cc_external: details?.external_cc || [],
    cc_internal: details?.internal_cc || [],
    cc_users: details?.user_cc || [],
    keywords: details?.keywords || [],
    remarks: details?.remarks || "",
    external_reference_no: details?.external_reference_no || "",
  });

  const [relatedCorrespondence, setRelatedCorrespondence] = useState<
    RelatedCorr[]
  >([]);

  const {
    relatedCorrs,
    loading: relatedLoading,
    refreshRelatedCorrs,
  } = useGetRelatedCorr(details?.id || "");

  useEffect(() => {
    if (!isEditMode) {
      setRelatedCorrespondence(relatedCorrs || []);
    }
  }, [relatedCorrs, isEditMode]);

  useEffect(() => {
    if (!isEditMode) return;
    setEditForm({
      corr_language_id: details?.corr_language_id || 0,
      cc_external: details?.external_cc || [],
      cc_internal: details?.internal_cc || [],
      cc_users: details?.user_cc || [],
      keywords: details?.keywords || [],
      remarks: details?.remarks || "",
      external_reference_no: details?.external_reference_no || "",
    });
  }, [isEditMode, details]);

  const _language_picklist = getPicklistById(
    "Language",
    details?.corr_language_id || ""
  );
  const toggleEditMode = (bool: boolean) => {
    setIsEditMode(bool);
  };
  const handleInputChange = (key: keyof typeof editForm, value: any) => {
    setEditForm({
      ...editForm,
      [key]: value,
    });
  };

  const handleFetchCorrDetails = async () => {
    if (!details?.id) return;
    setLoading(true);
    try {
      await refreshDetails();
      // resetForm();
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
      setIsEditMode(false);
    }
  };
  const handleSaveDraft = async () => {
    try {
      setLoading(true);
      const response = await editDraft(details?.id + "", {
        ...editForm,
        related: relatedCorrespondence.map((item) => item.id),
      });

      if (response) {
        refreshRelatedCorrs();
        await handleFetchCorrDetails();
      }
    } catch (error) {
      handleError(error);
      setLoading(false);
    }
  };
  const allColumns: TableColumnsType<RelatedCorr> = [
    {
      title: labels.lbl.subject,
      dataIndex: "corr_subject",
      render: (text: string, record) => (
        <a
          style={{ color: theme.colors.accent }}
          onClick={() => {
            const url = "/correspondence/" + record?.id;
            window.open(url, "_blank");
          }}
        >
          {text}
        </a>
      ),
      sorter: {
        compare: (a, b) =>
          b.corr_subject
            .toLowerCase()
            .localeCompare(a.corr_subject.toLowerCase()),
        multiple: 3,
      },
    },
    // {
    //   title: labels.tbl.corr_type,
    //   dataIndex: "correspondenceDate",
    //   render: (text: string) => (
    //     <a style={{ color: theme.colors.primary }}>{text}</a>
    //   ),
    //   sorter: {
    //     compare: (a, b) =>
    //       b.correspondenceDate.localeCompare(a.correspondenceDate),
    //     multiple: 3,
    //   },
    // },
    {
      title: labels.tbl.corr_num,
      dataIndex: "correspondence_no",
      render: (text: string) => (
        <a style={{ color: theme.colors.primary }}>{text ?? "-"}</a>
      ),
      sorter: {
        compare: (a, b) =>
          b.correspondence_no.localeCompare(a.correspondence_no),
        multiple: 3,
      },
    },
    {
      title: labels.tbl.action,
      dataIndex: "id",
      width: 75,
      render: (id) => (
        <Button
          type="link"
          size="small"
          danger
          onClick={() => handleDelete(id)}
        >
          <DeleteFilled />
        </Button>
      ),
    },
  ];
  const columns =
    isEditMode && isOutbound ? allColumns : allColumns.slice(0, -1);

  const handleDelete = (id: string | number) => {
    const filteredRelatedCorrs =
      relatedCorrespondence.filter((corr) => corr.id !== id) || [];
    setRelatedCorrespondence(filteredRelatedCorrs);
  };
  const getCCUser = () => {
    if (!details?.user_cc) return [];
    const ccUsers = details.user_cc || [];
    return ccUsers
      .map((userId) => getUserById(userId))
      .filter(Boolean)
      .map((user) => (isEnglish ? user?.name_en || "-" : user?.name_ar || "-"));
  };

  const getCCExternal = () => {
    if (!details?.external_cc) return [];
    const ccExternal = details.external_cc || [];
    return ccExternal
      .map((externalId) => getExternalEntityById(externalId))
      .filter(Boolean)
      .map((entity) =>
        isEnglish ? entity?.name_en || "-" : entity?.name_ar || "-"
      );
  };

  const getCCInternal = () => {
    if (!details?.internal_cc) return [];
    const ccInternal = details.internal_cc || [];
    return ccInternal
      .map((ouId) => getOrgById(ouId))
      .filter(Boolean)
      .map((org) => (isEnglish ? org?.name_en || "-" : org?.name_ar || "-"));
  };

  useEffect(() => {
    if (isInbound && !fixedKeywords) {
      setFixedKeywords(details?.keywords || []);
    }
  }, [isInbound, details]);
  const incoming_External_corr =
    CONST_DATA.Incoming_External_Type_ID == details?.corr_type_id;

  return (
    <Row gutter={20} style={{ padding: 10 }}>
      <Col lg={10} md={24} style={{ position: "relative" }}>
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
          {isEditMode && isOutbound && (
            <FadeInWrapperAnimation
              key="edit-form"
              enableScaleAnimation={false}
            >
              <Col style={{ marginTop: 16 }}>
                <Picklist
                  value={editForm?.corr_language_id}
                  onChange={(value) =>
                    handleInputChange("corr_language_id", value)
                  }
                  code="Language"
                  label={labels.lbl.language}
                />
              </Col>
              <Col style={{ marginTop: 16 }}>
                <MaterialInput
                  style={{ marginTop: 16 }}
                  enableTranscript
                  allowEdit
                  label={labels.lbl.ext_ref_num}
                  value={editForm.external_reference_no || ""}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    handleInputChange("external_reference_no", e.target.value)
                  }
                />
              </Col>
              <Col style={{ marginTop: 16 }}>
                <SelectOU
                  multiSelect
                  label={labels.lbl.cc_internal}
                  value={editForm.cc_internal || []}
                  onChange={(value) => handleInputChange("cc_internal", value)}
                />
              </Col>
              <Col style={{ marginTop: 16 }}>
                <SelectExternalEntity
                  multiSelect
                  value={editForm.cc_external || []}
                  onChange={(value) => handleInputChange("cc_external", value)}
                  label={labels.lbl.cc_external}
                />
              </Col>
              <Col style={{ marginTop: 16 }}>
                <SelectUsers
                  multiSelect
                  label={labels.lbl.cc_user}
                  value={editForm.cc_users || []}
                  onChange={(value) => handleInputChange("cc_users", value)}
                />
              </Col>
              <Col style={{ marginTop: 16 }}>
                <KeywordInput
                  values={editForm.keywords || []}
                  handleValuesChange={(keywords) => {
                    handleInputChange("keywords", keywords);
                  }}
                />
              </Col>
              <Col style={{ marginTop: 16 }}>
                <MaterialInput
                  style={{ marginTop: 16 }}
                  enableTranscript
                  allowEdit
                  label={labels.lbl.remarks}
                  value={editForm.remarks || ""}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    handleInputChange("remarks", e.target.value)
                  }
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
                    // resetForm();
                  }}
                />
                <ButtonComponent
                  type="primary"
                  buttonLabel={labels.btn.edit}
                  icon={<EditOutlined />}
                  spinning={loading}
                  onClick={handleSaveDraft}
                />
              </div>
            </FadeInWrapperAnimation>
          )}

          {!isEditMode && (
            <FadeInWrapperAnimation
              key={"info-view"}
              enableScaleAnimation={false}
            >
              <TextWithValue
                primaryText={labels.pk.language}
                secondaryText={
                  (isEnglish
                    ? _language_picklist?.picklist_en_label
                    : _language_picklist?.picklist_ar_label) || "-"
                }
              />
              <TextWithValue
                primaryText={labels.lbl.ext_ref_num}
                secondaryText={details?.external_reference_no || "-"}
              />
              {incoming_External_corr && (
                <>
                  <TextWithValue
                    primaryText={labels.lbl.sender_name}
                    secondaryText={details?.agent_from || "-"}
                  />
                  <TextWithValue
                    primaryText={labels.lbl.sender_id}
                    secondaryText={details?.agent_personal_id || "-"}
                  />
                  <TextWithValue
                    primaryText={labels.lbl.sender_phone}
                    secondaryText={details?.agent_phone || "-"}
                  />
                  {/* <TextWithValue
          primaryText={labels.lbl.scan_user}
          secondaryText={details?.sc}
          /> */}
                  {/* <TextWithValue primaryText={labels.lbl.index_user} /> */}
                  <TextWithValue
                    primaryText={labels.mnu.barcode}
                    secondaryText={details?.document_barcode || "-"}
                  />
                </>
              )}
              <TextWithTag
                primaryText={labels.lbl.cc_internal}
                secondaryText={getCCInternal()}
              />
              {!incoming_External_corr && (
                <TextWithTag
                  primaryText={labels.lbl.cc_external}
                  secondaryText={getCCExternal()}
                />
              )}
              <TextWithTag
                primaryText={labels.lbl.cc_user}
                secondaryText={getCCUser()}
              />
              <TextWithTag
                primaryText={labels.lbl.keywords}
                secondaryText={details?.keywords}
              />
              <TextWithValue
                primaryText={labels.lbl.remarks}
                secondaryText={details?.remarks || "-"}
              />
            </FadeInWrapperAnimation>
          )}
        </AnimatePresence>

        {isInbound && isEditMode && (
          <FadeInWrapperAnimation
            key={"edit-form-inbound"}
            enableScaleAnimation={false}
          >
            <KeywordInput
              NotAllowedClearData={fixedKeywords || []}
              values={editForm.keywords || []}
              handleValuesChange={(keywords) => {
                handleInputChange("keywords", keywords);
              }}
            />
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
                  // resetForm();
                }}
              />
              <ButtonComponent
                type="primary"
                buttonLabel={labels.btn.edit}
                icon={<EditOutlined />}
                spinning={loading}
                onClick={handleSaveDraft}
              />
            </div>
          </FadeInWrapperAnimation>
        )}
      </Col>
      <Col lg={1} md={0} />
      <Col lg={13} md={24}>
        <TitleHeader
          applyReverse={false}
          heading={labels.lbl.related_ref_num}
          icon={<ApiFilled style={{ color: "#fff" }} />}
        />
        <Col style={{ padding: 10 }}>
          <AnimatePresence>
            <FadeInWrapperAnimation key={"related-corr-table"}>
              {isEditMode && !isInbound && (
                <ActionMenuItem
                  onClick={() => {
                    setShowModal(true);
                  }}
                  isActive={true}
                  label={labels.btn.add_new}
                  type="add"
                />
              )}
            </FadeInWrapperAnimation>
          </AnimatePresence>
          <TableComponent<RelatedCorr>
            showSorterTooltip
            sortDirections={["ascend", "descend"]}
            columns={columns}
            dataSource={relatedCorrespondence}
            style={{ marginTop: 15 }}
            loading={loading}
            rowKey="id"
            pagination={false}
            scroll={{ x: "max-content" }}
          />
        </Col>
      </Col>

      {showModal && (
        <RelatedCorrespondenceModal
          onSelect={(selectedRowKeys) => {
            setRelatedCorrespondence(selectedRowKeys);
          }}
          onClose={() => setShowModal(false)}
          selectedCorrs={relatedCorrespondence}
        />
      )}
    </Row>
  );
}
