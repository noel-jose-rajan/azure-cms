import { Actions, getTaskActions } from "@/components/services/inbox";
import { useLanguage } from "@/context/language";
import usePicklist from "@/store/picklists/use-picklist";
import { CaretDownFilled } from "@ant-design/icons";
import { Button, Dropdown, MenuProps } from "antd";
import { CSSProperties, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ActionModal from "./actions/action-modal";
import { CONST_DATA } from "@/constants/app";
import RouteActionModal from "./actions/route-modal";
import SendTaskModal from "./actions/send-modal";
type SubmitOption = {
  actions: Actions;
  arLabel: string;
  enLabel: string;
  id: number;
};
type Props = {
  urgency_level: number;
  setCanReply: React.Dispatch<React.SetStateAction<boolean>>;
};
const TaskActions = ({ urgency_level, setCanReply }: Props) => {
  const { id } = useParams();
  const { isEnglish, labels } = useLanguage();
  const { picklists } = usePicklist();
  const _actions_picklist = picklists["ACTIONS"] || [];
  const [actions, setActions] = useState<SubmitOption[]>([]);
  const [selectedAction, setSelectedAction] = useState<
    SubmitOption | undefined
  >();
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const iconStyle: CSSProperties = {
    marginLeft: isEnglish ? 0 : 10,
    marginRight: isEnglish ? 10 : 0,
  };

  const fetchTaskActions = async () => {
    const res = await getTaskActions(id || "");
    if (res) {
      const picklistMap = new Map(
        _actions_picklist.map((item) => [item.picklist_id, item])
      );

      const mappedActions = res?.map((action) => {
        const picklistItem = picklistMap.get(action.ID);
        return {
          actions: action,
          id: action.ID,
          arLabel: picklistItem ? picklistItem.picklist_ar_label : "",
          enLabel: picklistItem ? picklistItem.picklist_en_label : "",
        };
      });
      setActions(mappedActions);
      if (mappedActions?.some((a) => a.id == CONST_DATA.Route_Task_Id)) {
        setCanReply(true);
      } else {
        setCanReply(false);
      }
    }
  };

  useEffect(() => {
    if (!id || !(_actions_picklist?.length > 0)) return;
    fetchTaskActions();
  }, [id, _actions_picklist?.length]);

  const menu: MenuProps["items"] = actions.map((action) => ({
    key: action.id,
    label: isEnglish ? action.enLabel : action.arLabel,
    onClick: () => {
      setSelectedAction(action);
      setIsModalOpen(true);
    },
  }));

  const isRoutingTask =
    selectedAction?.id == CONST_DATA.Route_Task_Id ||
    selectedAction?.id == CONST_DATA.Route_CC_Task_Id;
  const isSendTask = selectedAction?.id == CONST_DATA.Send_task_id;

  const isDefaultTask = !isRoutingTask && !isSendTask;
  return (
    <>
      <Dropdown menu={{ items: menu }} trigger={["click"]}>
        <Button type="primary" style={iconStyle}>
          <CaretDownFilled />
          {labels.btn.task_actions}
        </Button>
      </Dropdown>
      {isModalOpen && (
        <>
          {isDefaultTask && (
            <ActionModal
              onCancel={() => setIsModalOpen(false)}
              action={selectedAction?.actions}
              label={
                (isEnglish
                  ? selectedAction?.enLabel
                  : selectedAction?.arLabel) || "-"
              }
            />
          )}

          {isRoutingTask && (
            <RouteActionModal
              urgency_level={urgency_level}
              onCancel={() => setIsModalOpen(false)}
              action={selectedAction?.actions}
              label={
                (isEnglish
                  ? selectedAction?.enLabel
                  : selectedAction?.arLabel) || "-"
              }
            />
          )}
          {isSendTask && (
            <SendTaskModal
              onClose={() => setIsModalOpen(false)}
              action={selectedAction?.actions}
              label={
                (isEnglish
                  ? selectedAction?.enLabel
                  : selectedAction?.arLabel) || "-"
              }
            />
          )}
        </>
      )}
    </>
  );
};

export default TaskActions;
