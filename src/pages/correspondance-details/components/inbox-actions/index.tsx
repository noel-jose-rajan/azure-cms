import {
  CaretDownFilled,
  CheckOutlined,
  InboxOutlined,
  InfoCircleOutlined,
  MailOutlined,
  MessageOutlined,
  PrinterOutlined,
  RollbackOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Avatar, Button, Col, Dropdown, MenuProps, Row } from "antd";
import TitleHeader from "../../../../components/ui/header";
// import { InboxTaskType } from "../../types";
import { useLanguage } from "../../../../context/language";
import { CSSProperties, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTheme } from "../../../../context/theme";
// import SendCC from "./components/send-cc";
import {
  acquireATask,
  // markCorrespondenceAsRead,
  // updateTaskDelayComment,
} from "../../service";
// import DelayCorrespondence from "./components/delay-task";
import { DraftCorrespondenceType } from "../../../../components/services/outbound/types";
import { InboxCorresDetailType } from "../../../../components/services/inbox/type";
import { acquireTask, InboxTask } from "@/components/services/inbox";
import TextWithValue from "@/components/ui/text-with-value";
import moment from "moment";
import TaskActions from "./components/task-actions";
import useHandleError from "@/components/hooks/useHandleError";
import ButtonComponent from "@/components/ui/button";
import { AnimatePresence } from "framer-motion";
import FadeInWrapperAnimation from "@/animations/fade-in-wrapper-animation";
import {
  DraftOutboundType,
  ReplyCorrespondenceType,
} from "@/components/services/outbound/schema";
import CreateOutboundModal from "@/pages/outbounds/components/create-modal";
import { CONST_DATA } from "@/constants/app";

interface InboxHeaderActionsProps {
  corrDetails?: DraftCorrespondenceType;
  isAcquire: boolean;
  acquireCompleted: () => void;
  updatePrintViewStatus: (visible: boolean) => void;
  taskDetails?: InboxTask;
}

export default function InboxHeaderActions({
  corrDetails,
  isAcquire,
  acquireCompleted,
  updatePrintViewStatus,
  taskDetails,
}: InboxHeaderActionsProps) {
  const { isEnglish, labels } = useLanguage();
  const { theme } = useTheme();
  const { id } = useParams();
  const { handleError } = useHandleError();
  const [acquireLoading, setAcquireLoading] = useState<boolean>(false);
  const [canReply, setCanReply] = useState<boolean>(false);
  const [openReplyModal, setOpenReplyModal] = useState<boolean>(false);
  const navigate = useNavigate();
  const iconStyle: CSSProperties = {
    marginLeft: isEnglish ? 0 : 10,
    marginRight: isEnglish ? 10 : 0,
  };

  // const markAsRead = async () => {
  //   const taskId = taskDetails?.taskId ?? "";

  //   const response = await markCorrespondenceAsRead(
  //     !readStatus,
  //     taskId,
  //     taskDetails?.corrId ?? ""
  //   );

  //   if (response.status === HttpStatus.SUCCESS) {
  //     setReadStatus(!readStatus);
  //   } else {
  //     message.error(
  //       isEnglish ? "Failed to update" : "فشل في الحصول على المستخدمين"
  //     );
  //   }
  // };

  const otherActions = [
    // {
    //   label: (
    //     <>
    //       {true ? (
    //         <>
    //           <MailOutlined style={iconStyle} />
    //           {labels.btn.notread}
    //         </>
    //       ) : (
    //         <>
    //           <InboxOutlined style={iconStyle} />
    //           {labels.btn.read}
    //         </>
    //       )}
    //     </>
    //   ),
    //   // onClick: () => markAsRead(),
    //   enable: true,
    // },
    {
      label: (
        <>
          <RollbackOutlined style={iconStyle} />
          {labels.btn.replay_to}
        </>
      ),
      onClick: () => setOpenReplyModal(true),
      enable: true,
      // enable:
      //   details?.correspondence_no !== "" &&
      //   (taskDetails?.taskKey === "RecieveInbound" ||
      //     taskDetails?.taskKey === "FYAtask"),
    },
    // {
    //   label: (
    //     <>
    //       <MessageOutlined style={iconStyle} />
    //       {labels.btn.task_sendDelayComment}
    //     </>
    //   ),
    //   // onClick: () => setOpenDelayTask(true),
    //   enable: true,
    // },
    // {
    //   label: (
    //     <>
    //       <PrinterOutlined style={iconStyle} />
    //       {labels.btn.print_task_corr}
    //     </>
    //   ),
    //   onClick: () => updatePrintViewStatus(true),
    //   enable: true,
    // },
  ];

  // const menu: MenuProps["items"] = actions
  //   .filter((item) => {
  //     const filteredActions = userActions.map((item) => item.picklist_code);
  //     if (details?.corr_status_pick_list_code === "PICKLIST_81") {
  //       return (
  //         (filteredActions?.includes(item.key) && item.forAll) ||
  //         (filteredActions?.includes(item.key) && item.isApprove)
  //       );
  //     } else {
  //       return (
  //         (filteredActions?.includes(item.key) && item.forAll) ||
  //         (filteredActions?.includes(item.key) && item.isReview)
  //       );
  //     }
  //   })
  //   .map((item, index) => {
  //     return {
  //       key: index,
  //       label: item.label,
  //       onClick: item.onClick,
  //     };
  //   });

  const otherActionMenu: MenuProps["items"] = otherActions
    .filter((oa) => oa.enable)
    .map((item, index) => {
      return {
        key: index,
        label: item.label,
        onClick: () => {
          item.onClick && item.onClick();
        },
      };
    });

  const handleAcquireTask = async () => {
    try {
      setAcquireLoading(true);
      const res = await acquireTask(id || "");
      console.log({ res });

      if (res) {
        console.log("inside if");

        acquireCompleted();
      }
    } catch (error) {
      handleError(error);
    } finally {
      setAcquireLoading(false);
    }
  };

  return (
    <>
      {/* <TitleHeader heading={taskDetails?.taskTitle ?? ""} /> */}
      <Row style={{ marginTop: 20 }}>
        <Col
          span={5}
          style={{
            display: "flex",
            alignItems: "center",
            paddingLeft: 10,
          }}
        >
          <Avatar size={50} icon={<UserOutlined />} />
          <span
            style={{
              color: theme.colors.primary,
              marginLeft: 10,
              fontSize: 14,
            }}
          >
            {taskDetails?.from_user_name}
          </span>
        </Col>
        <Col
          span={19}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
          }}
        >
          <AnimatePresence mode="wait">
            {isAcquire ? (
              <FadeInWrapperAnimation key={"task-actions"}>
                <TaskActions
                  urgency_level={corrDetails?.urgency_id || 0}
                  setCanReply={setCanReply}
                />
              </FadeInWrapperAnimation>
            ) : (
              <FadeInWrapperAnimation key={"task-actions-loading"}>
                <ButtonComponent
                  spinning={acquireLoading}
                  buttonLabel={labels.btn.acquire}
                  icon={<CheckOutlined />}
                  type="primary"
                  style={iconStyle}
                  onClick={handleAcquireTask}
                />
              </FadeInWrapperAnimation>
            )}
          </AnimatePresence>

          {canReply && (
            <Dropdown menu={{ items: otherActionMenu }} trigger={["click"]}>
              <Button type="primary" style={iconStyle}>
                <CaretDownFilled />
                {labels.btn.task_other_actions}
              </Button>
            </Dropdown>
          )}
          <Button type="primary" style={iconStyle} onClick={() => navigate(-1)}>
            <RollbackOutlined />
            {labels.btn.back_page}
          </Button>
        </Col>
      </Row>
      <TitleHeader
        heading={labels.til.task_details}
        icon={<InfoCircleOutlined style={{ color: "#fff" }} />}
      />
      <Col style={{ marginTop: 10, width: "100%" }}>
        <TextWithValue
          applyReverse
          primaryText={labels.lbl.corr_subject}
          secondaryText={taskDetails?.corr_subject ?? ""}
        />
        <TextWithValue
          applyReverse
          primaryText={labels.lbl.task_due_date}
          secondaryText={
            taskDetails?.task_date
              ? moment(taskDetails.task_due_date).format("YYYY-MM-DD hh:mm a")
              : "-"
          }
        />
        {taskDetails?.comments && (
          <TextWithValue
            applyReverse
            primaryText={labels.lbl.previous_comment}
            secondaryText={taskDetails?.comments}
          />
        )}
      </Col>

      {openReplyModal && (
        <CreateOutboundModal
          replayData={{
            corr_subject: corrDetails?.corr_subject ?? "",
            sending_entity: corrDetails?.receiving_entity_id || 0,
            id: corrDetails?.id || 0,
            outbound_type: CONST_DATA.Internal_outbound_Id || 0,
          }}
          onCreate={() => {
            navigate("/outbounds");
            setOpenReplyModal(false);
          }}
          onClose={() => {
            setOpenReplyModal(false);
          }}
        />
      )}
    </>
  );
}
