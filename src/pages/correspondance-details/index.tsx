import { CSSProperties, useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import LoaderComponent from "../../components/ui/loader";
import { Badge, Button, Col, Tabs, TabsProps } from "antd";
import TitleHeader from "../../components/ui/header";
import { useLanguage } from "../../context/language";
import {
  BranchesOutlined,
  FileTextOutlined,
  HistoryOutlined,
  InfoCircleOutlined,
  MailOutlined,
  NodeIndexOutlined,
  PaperClipOutlined,
  PlusCircleOutlined,
  RollbackOutlined,
} from "@ant-design/icons";
import { useTheme } from "../../context/theme";
import BasicInfo from "./components/basic-info";
// import { CorrespondenceVersionsType } from "./types";
import ShareIcon from "../../assets/share.png";
import InboxHeaderActions from "./components/inbox-actions";
// import AiChatModal from "../../components/ui/nlp/ai-chat-bot";
import CorrespondenceHistory from "./components/hstory";
import {
  getCorrespondenceRoutes,
  getTaskDetailsById,
  InboxTask,
  Routes,
} from "@/components/services/inbox";
import useGetCorrespondenceDetails from "@/components/shared/hooks/use-get-correspondence";
import useHandleError from "@/components/hooks/useHandleError";
// import CorrespondenceComments from "./components/comments";
import MoreInfoCorrespondence from "./components/more-info";
import { CONST_DATA } from "@/constants/app";
import CorrespondenceAttachments from "../create-inbound/components/attachments";
import CorrespondenceVersions from "./components/versions";
import FollowUp from "./components/follow-up";
import usePicklist from "@/store/picklists/use-picklist";
import CorrespondenceRouting from "./components/routings";
import InboxDelegationDetails from "./components/inbox-delegation-details";
import HeightAnimationWrapper from "@/animations/height-wrapper-animation";
import CorrespondenceExplainerAI from "@/components/ui/ai-chat/correspondence-explainer-ai";

export interface BasicInfoDetailsType {
  sendingEntity?: string;
  attachmentUrl?: string;
  receivingEntity?: string;
}

export default function CorrespondenceDetails() {
  const { id } = useParams();
  const { theme } = useTheme();
  const { handleError } = useHandleError();
  const { getPicklistById } = usePicklist();
  const { isEnglish, labels } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState<boolean>(true);
  const [isFromInbox, setIsFromInbox] = useState<boolean>(false);
  const [isAcquired, setIsAcquired] = useState<boolean>(false);
  const [isFromBackLogs, setIsFromBackLogs] = useState<boolean>(false);
  const [isFromSearch, setIsFromSearch] = useState<boolean>(false);
  const [task, setTask] = useState<InboxTask | undefined>();
  const [routeTree, setRouteTree] = useState<Routes[] | undefined>();
  const [activeTab, setActiveTab] = useState<string>("1");
  const { corrDetails, handleGetCorrespondenceDetails } =
    useGetCorrespondenceDetails();
  const _task_type = getPicklistById("Task Subject", task?.task_type_id || "");
  const _Process_picklist = getPicklistById(
    "PROCESS_TYPE",
    task?.process_type_id || ""
  );
  const fetchTaskDetails = async () => {
    try {
      const res = await getTaskDetailsById(id ?? "");
      if (res) {
        setTask(res);
        setIsAcquired(res.is_acquired);
        await handleGetCorrespondenceDetails(res.correspondence_id);
      }
    } catch (err) {
      handleError(err);
      navigate("/user/inbox", { replace: true });
    } finally {
      setLoading(false);
    }
  };
  const getRoutesDetails = async () => {
    const response = await getCorrespondenceRoutes(
      (isFromSearch ? id || "" : isFromInbox ? task?.correspondence_id : "") ||
        ""
    );
    if (response) {
      setRouteTree(response);
    }
  };
  useEffect(() => {
    if (id && isFromInbox) {
      fetchTaskDetails();
    }
  }, [id, isFromInbox]);

  useEffect(() => {
    if (task?.correspondence_id && isFromInbox) {
      getRoutesDetails();
    }
  }, [task, isFromInbox]);
  const fetchCorrespondenceDetails = async () => {
    try {
      await handleGetCorrespondenceDetails(id || "", () =>
        navigate("/correspondence/search", { replace: true })
      );
    } catch (err) {
      handleError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id && isFromSearch) {
      fetchCorrespondenceDetails();
      getRoutesDetails();
    }
  }, [id, isFromSearch]);

  useEffect(() => {
    if (location.pathname.includes("/inbox/")) {
      setIsFromInbox(true);
    } else {
      if (location.pathname.includes("/correspondence/")) {
        setIsFromSearch(true);
      }
      if (location.pathname.includes("/backlogs/")) {
        setIsFromBackLogs(true);
      }
    }
  }, [location]);

  const iconStyle: CSSProperties = {
    marginLeft: isEnglish ? 0 : 10,
    marginRight: isEnglish ? 10 : 0,
  };

  const getTheCorrespondenceTitle = (value?: number) => {
    if (!value) return labels.pk.segment_Internal;

    if (value == CONST_DATA.Internal_id) {
      return labels.pk.segment_Internal;
    } else if (value == CONST_DATA.Outgoing_External_id) {
      return labels.pk.segment_Outbound;
    } else if (value == CONST_DATA.Incoming_External_id) {
      return labels.pk.segment_Inbound;
    } else if (value == CONST_DATA.Announcement_Id) {
      return labels.pk.segment_InternalAnnouncement;
    } else {
      return labels.pk.segment_Internal;
    }
  };

  const getTheCorrespondenceIcon = (value?: number) => {
    if (!value)
      return (
        <img
          src={ShareIcon}
          style={{
            height: 20,
            width: 20,
            filter: "brightness(0) invert(1)",
            transform: "scaleX(-1)",
          }}
        />
      );

    if (
      value === CONST_DATA.Internal_id ||
      value === CONST_DATA.Incoming_External_id ||
      value === CONST_DATA.Announcement_Id
    ) {
      return (
        <img
          src={ShareIcon}
          style={{
            height: 20,
            width: 20,
            filter: "brightness(0) invert(1)",
            transform: "scaleX(-1)",
          }}
        />
      );
    } else {
      return (
        <img
          src={ShareIcon}
          style={{
            height: 20,
            width: 20,
            filter: "brightness(0) invert(1)",
          }}
        />
      );
    }
  };

  const isInbound =
    _Process_picklist?.picklist_id === CONST_DATA.Inbound_Process_Id ||
    _Process_picklist?.picklist_id === CONST_DATA.Route_Process_Id;
  const isOutbound =
    _Process_picklist?.picklist_id === CONST_DATA.Outbound_Process_Id;
  const _TaskSubject = getPicklistById(
    "Task Subject",
    task?.task_type_id || ""
  );

  const isSendTask = _TaskSubject?.picklist_id == CONST_DATA.SEND_TASK_SUBJECT;
  const items = useMemo<TabsProps["items"]>(() => {
    const allItems: TabsProps["items"] = [
      {
        label: (
          <Badge color={theme.colors.primary} count={0}>
            <Col style={{ marginLeft: 10, marginRight: 20 }}>
              {labels.til.basic_info}
            </Col>
          </Badge>
        ),
        key: "1",
        icon: <InfoCircleOutlined />,
        children: (
          <BasicInfo
            isFromSearch={isFromSearch}
            isSendTask={isSendTask}
            details={corrDetails}
            task={task}
            isAcquired={isAcquired && isOutbound}
            refreshDetails={() =>
              handleGetCorrespondenceDetails(corrDetails?.id || "")
            }
          />
        ),
      },
      {
        label: (
          <Badge color={theme.colors.primary} count={0}>
            <Col style={{ marginLeft: 10, marginRight: 20 }}>
              {labels.til.more_info}
            </Col>
          </Badge>
        ),
        key: "2",
        children: (
          <MoreInfoCorrespondence
            details={corrDetails}
            isAcquired={isAcquired}
            isOutbound={isOutbound}
            isInbound={isInbound}
            isSendTask={isSendTask}
            refreshDetails={() =>
              handleGetCorrespondenceDetails(corrDetails?.id || "")
            }
          />
        ),
        icon: <PlusCircleOutlined />,
      },
      {
        label: (
          <Badge color={theme.colors.primary}>
            <Col style={{ marginLeft: 10, marginRight: 20 }}>
              {labels.til.attachments}
            </Col>
          </Badge>
        ),
        key: "3",
        children: (
          <CorrespondenceAttachments
            fromTab={true}
            corrId={corrDetails?.id?.toString() || ""}
            canEdit={isAcquired && isFromInbox && !isSendTask}
            isInbound={isInbound}
          />
        ),
        icon: <PaperClipOutlined />,
      },
      {
        label: (
          <Badge color={theme.colors.primary}>
            <Col style={{ marginLeft: 10, marginRight: 10 }}>
              {labels.til.followup}
            </Col>
          </Badge>
        ),
        key: "4",
        children: (
          <FollowUp
            corrID={corrDetails?.id || ""}
            key={activeTab == "4" ? "followup " + activeTab : "followup"}
          />
        ),
        icon: <NodeIndexOutlined />,
      },
      {
        label: (
          <Badge color={theme.colors.primary}>
            <Col style={{ marginLeft: 10, marginRight: 10 }}>
              {labels.til.history}
            </Col>
          </Badge>
        ),
        key: "5",
        children: (
          <CorrespondenceHistory corrId={corrDetails?.id?.toString() || ""} />
        ),
        icon: <HistoryOutlined />,
      },
      // {
      //   label: (
      //     <Badge>
      //       <Col style={{ marginLeft: 10, marginRight: 10 }}>
      //         {labels.til.comments}
      //       </Col>
      //     </Badge>
      //   ),
      //   key: "6",
      //   children: <CorrespondenceComments details={corrDetails} />,
      //   icon: <CommentOutlined />,
      // },
      {
        label: (
          <Badge color={theme.colors.primary}>
            <Col style={{ marginLeft: 10, marginRight: 10 }}>
              {labels.til.versions}
            </Col>
          </Badge>
        ),
        key: "7",
        children: (
          <CorrespondenceVersions
            key={activeTab != "7" ? "versions" : "versions " + activeTab}
            corrId={corrDetails?.id?.toString() || ""}
            canUpload={true}
          />
        ),
        icon: <FileTextOutlined />,
      },
    ];
    if (isInbound || (isFromSearch && routeTree && routeTree?.length > 0)) {
      allItems.push({
        label: (
          <Badge color={theme.colors.primary}>
            <Col style={{ marginLeft: 10, marginRight: 10 }}>
              {labels.til.route}
            </Col>
          </Badge>
        ),
        key: "8",
        children: (
          <CorrespondenceRouting
            routeTree={routeTree || []}
            recivingEntity={corrDetails?.receiving_entity_id}
            date={corrDetails?.sent_date}
          />
        ),
        icon: <BranchesOutlined />,
      });
    }
    return allItems;
  }, [
    corrDetails,
    history,
    isFromBackLogs,
    isAcquired,
    isInbound,
    isOutbound,
    task,
    isFromInbox,
    routeTree,
    isSendTask,
    activeTab,
    isEnglish,
  ]);

  // const printATaskClicked = async (values: SelectedType) => {
  //   if (!details) return;

  //   let status: string = "";
  //   const statusPl = await PickListHelper.correspondenceStatus();
  //   status =
  //     statusPl.find((pl) => pl.picklistCode === details.corrStatusPickListCode)
  //       ?.picklistEnLabel ?? "";

  //   const jsonBody: PrintTaskType = {
  //     isContentRequired: values.isContentRequired,
  //     isDocumentVersionRequired: values.isDocumentVersionRequired,
  //     isElectAttachmentsRequired: values.isElectAttachmentsRequired,
  //     isFollowUpRequired: values.isFollowUpRequired,
  //     isHistoryRequired: values.isHistoryRequired,
  //     isMainDetailsRequired: values.isMainDetailsRequired,
  //     isMoreDetailsRequired: values.isMoreDetailsRequired,
  //     isPhyAttachmentsRequired: values.isPhyAttachmentsRequired,
  //     isRoutingRequired: values.isRoutingRequired,
  //     correspondenceDate: details?.correspondenceDate,
  //     corrId: details.corrId,
  //     corrNo: details.correspondenceNo,
  //     corrSubject: details.subject,
  //     hasRoutings: itemsCount && itemsCount?.routings > 0 ? true : false,
  //     hasFollowUp: itemsCount && itemsCount?.followupTasks > 0 ? true : false,
  //     hasElecAttachments:
  //       itemsCount && itemsCount?.electronicAttachments > 0 ? true : false,
  //     hasPhyAttachments:
  //       itemsCount && itemsCount?.physicalAttachments > 0 ? true : false,
  //     hasHistory: itemsCount && itemsCount?.histoy > 0 ? true : false,
  //     hasDocumentVersions: versions.length > 0 ? true : false,
  //     corrStatusPicklistsDesc: status,
  //     corrType: getTheCorrespondenceTitle(details?.corrTypePickListCode),
  //     documentVersions: values.isDocumentVersionRequired ? versions : [],
  //     sendingEntity: entityDetails?.sendingEntity ?? "",
  //     receivingEntity: entityDetails?.receivingEntity ?? "",
  //     PDFContentFileName: entityDetails?.attachmentUrl ?? "",
  //   };

  //   const response = await printTaskInfos(jsonBody);
  //   if (response) {
  //     window.open(NG_URL + "/pdfDocuments/" + response.message);
  //   } else {
  //     message.error(!isEnglish ? "حدث خطأ ما" : "Something went wrong");
  //   }
  // };

  const acquireCompleted = async () => {
    setIsAcquired(true);
  };
  const delegationId = task?.delegation_id;

  return (
    <>
      {corrDetails?.id && (
        <CorrespondenceExplainerAI
          correspondenceId={corrDetails?.id.toString()}
          subject={corrDetails?.corr_subject}
          isPdf={isSendTask ? true : corrDetails?.content_type === "pdf"}
        />
      )}

      {loading || !corrDetails ? (
        <LoaderComponent loading={loading} fullscreen={false} delay={0} />
      ) : (
        <Col style={{ width: "100%" }}>
          {isFromInbox ? (
            <>
              <>
                {!!delegationId && (
                  <InboxDelegationDetails id={delegationId + ""} />
                )}
              </>
              <TitleHeader
                heading={
                  (isEnglish
                    ? _task_type?.picklist_en_label
                    : _task_type?.picklist_ar_label) ?? ""
                }
              />
              <InboxHeaderActions
                corrDetails={corrDetails}
                taskDetails={task}
                isAcquire={isAcquired}
                acquireCompleted={acquireCompleted}
                updatePrintViewStatus={function (visible: boolean): void {
                  throw new Error("Function not implemented. " + visible);
                }} // updatePrintViewStatus={setViewPrint}
              />
            </>
          ) : (
            <>
              <TitleHeader
                heading={getTheCorrespondenceTitle(
                  corrDetails?.corr_type_id ?? ""
                )}
                icon={getTheCorrespondenceIcon(corrDetails?.corr_type_id ?? "")}
              />

              <Col
                style={{
                  marginTop: 15,
                  marginBottom: 15,
                  display: "flex",
                  justifyContent: isEnglish ? "flex-end" : "flex-start",
                }}
              >
                {/* <Button
                  type="primary"
                  style={iconStyle}
                  onClick={deleteCorrespondence}
                >
                  <BranchesOutlined />
                  {labels.btn.adhoc_create}
                </Button> */}
                {/* <Button
                  type="primary"
                  style={iconStyle}
                  disabled={!entityDetails.attachmentUrl}
                  // onClick={() => setViewPrint(true)}
                >
                  <PrinterFilled />
                  {labels.btn.print_task_corr}
                </Button> */}
                <Button
                  type="primary"
                  style={iconStyle}
                  onClick={() => navigate("/correspondence/search")}
                >
                  <RollbackOutlined />
                  {labels.btn.back_page}
                </Button>
              </Col>
            </>
          )}
          <TitleHeader
            heading={labels.lbl.corr_details}
            icon={<MailOutlined style={{ color: "#fff" }} />}
          />
          <HeightAnimationWrapper>
            <Tabs
              defaultActiveKey="1"
              animated={{ inkBar: false, tabPane: true }}
              type="line"
              // size={"large"}
              style={{ marginBottom: 32, marginTop: 20 }}
              items={items}
              onChange={(key) => {
                if (key == "4" || key == "7") {
                  setActiveTab(key);
                } else {
                  setActiveTab("1");
                }
              }}
            />
          </HeightAnimationWrapper>
          <Col span={1}></Col>

          {/* <PrintTaskModal
        onClose={() => setViewPrint(false)}
        visible={viewPrint}
        onSubmit={printATaskClicked}
        canViewHistory={canViewHistory}
      /> */}
          {/* <AiChatModal taskData={{ corrDetails }} /> */}
        </Col>
      )}
    </>
  );
}
