import { Col, Tooltip } from "antd";
import { useLanguage } from "../../../../context/language";
import {
  AlertOutlined,
  // BranchesOutlined,
  MessageFilled,
  // RollbackOutlined,
  SafetyCertificateFilled,
  UserSwitchOutlined,
} from "@ant-design/icons";
import { InboxTask } from "@/components/services/inbox";
import usePicklist from "@/store/picklists/use-picklist";

interface TaskInfoIconsProps {
  details: InboxTask;
  // colorGroups?: { [x: string]: string };
  verticalMode?: boolean;
}
export default function TaskInfoIcons({
  details,
  // colorGroups,
  verticalMode = false,
}: TaskInfoIconsProps) {
  const { labels, isEnglish } = useLanguage();
  const { picklists } = usePicklist();
  const urgencyLevel = picklists["Urgency Level"] || [];
  const securityLevel = picklists["Security Level"] || [];

  const { security_level_id, urgency_id } = details;
  const getUrgencyLevel = () => {
    return (
      <Tooltip
        title={
          urgency_id
            ? labels.lbl.urgency_level +
              " : " +
              `${getUrgencyPicklistName(urgency_id)}`
            : labels.lbl.urgency_level
        }
      >
        <AlertOutlined
          style={{
            fontSize: 14,
            marginLeft: verticalMode ? 0 : 5,
            marginTop: verticalMode ? 5 : 0,
          }}
        />
      </Tooltip>
    );
  };

  const getUrgencyPicklistName = (id: number | string) => {
    const picklist = urgencyLevel.find((item) => item.picklist_id == id);
    return picklist
      ? isEnglish
        ? picklist.picklist_en_label
        : picklist.picklist_ar_label
      : "";
  };

  const getSecurityPicklistName = (id: string | number) => {
    const picklist = securityLevel.find((item) => item.picklist_id == id);
    return picklist
      ? isEnglish
        ? picklist.picklist_en_label
        : picklist.picklist_ar_label
      : "";
  };

  const getSecurityLevel = () => {
    return (
      <Tooltip
        title={
          security_level_id
            ? labels.lbl.security_level +
              " : " +
              `${getSecurityPicklistName(security_level_id + "")}`
            : labels.lbl.security_level
        }
      >
        <SafetyCertificateFilled
          style={{
            fontSize: 14,
            marginLeft: verticalMode ? 0 : 5,
            marginTop: verticalMode ? 5 : 0,
          }}
        />
      </Tooltip>
    );
  };

  // const getComment = () => {
  //   if (action?.comments) {
  //     return (
  //       <Tooltip title={labels.lbl.previous_comment + " : " + action?.comments}>
  //         <MessageFilled
  //           style={{
  //             fontSize: 14,
  //             marginLeft: verticalMode ? 0 : 5,
  //             marginTop: verticalMode ? 5 : 0,
  //           }}
  //         />
  //       </Tooltip>
  //     );
  //   }
  // };

  return (
    <Col
      style={{
        display: "flex",
        flexDirection: verticalMode ? "column" : "row",
        alignItems: "flex-start",
      }}
    >
      {/* {getCorrType(correspondence?.processName ?? "")} */}
      {getUrgencyLevel()}
      {getSecurityLevel()}
      {details?.delegation_id > 0 ? (
        <Tooltip title={labels.mnu.delegation}>
          <UserSwitchOutlined
            style={{
              fontSize: 14,
              marginLeft: verticalMode ? 0 : 5,
              marginTop: verticalMode ? 5 : 0,
            }}
          />
        </Tooltip>
      ) : (
        <></>
      )}
      {/* {getComment()} */}
      {/* {getColor()} */}
    </Col>
  );
}
