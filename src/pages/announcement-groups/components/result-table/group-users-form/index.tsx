import { Checkbox, Modal, message } from "antd";
import { useEffect, useState } from "react";
import { useLanguage } from "../../../../../context/language";
import {
  getDBGroupUsers,
  updateDBGroupUsers,
} from "../../../../../components/services/announcement-groups";
import { HttpStatus } from "../../../../../components/functional/httphelper";
import SelectUsers from "@/components/shared/select-users";
import { GroupUserAddType } from "@/components/services/announcement-groups/type";

interface Props {
  groupId?: number;
  onClose?: () => any;
  isOpen?: boolean;
  isAllUsers?: boolean;
}

export default function GroupUsersForm({ onClose, isOpen, groupId }: Props) {
  const {
    labels: { til, btn, lbl },
    isEnglish,
  } = useLanguage();

  const [selected, setSelected] = useState<number[]>([]);
  const [allUsers, setAllUsers] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const handleOnClose = () => onClose && onClose();

  useEffect(() => {
    if (groupId !== undefined) {
      getAllGroupUsers(groupId);
    }
  }, [groupId]);

  const getAllGroupUsers = async (groupId: any) => {
    const response = await getDBGroupUsers(groupId);

    if (response.data) {
      setSelected(response.data.users);
      setAllUsers(response.data.is_all_users);
    } else if (response.status === HttpStatus.NOTFOUND) {
      setSelected([]);
    } else {
      message.error(
        !isEnglish ? "فشل في جلب المستخدمين" : "Failed to fetch users"
      );
      setSelected([]);
    }
  };

  const handleSave = async () => {
    if (!groupId) return;
    setLoading(true);
    try {
      const payLoad: GroupUserAddType = {
        is_all_users: allUsers,
        users: allUsers ? [] : selected,
      };

      const response = await updateDBGroupUsers(groupId, payLoad);

      if (response.status === HttpStatus.SUCCESS) {
        message.success(
          !isEnglish ? "تم حفظ المستخدمين بنجاح" : "Users assigned successfully"
        );
        handleOnClose();
      } else {
        throw new Error("Assignment failed");
      }
    } catch (error) {
      message.error(
        !isEnglish ? "فشل في تعيين المستخدمين" : "Failed to assign users"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      onCancel={handleOnClose}
      onOk={handleSave}
      open={isOpen}
      title={til.announce_grp_assign_users}
      confirmLoading={loading}
      okText={btn.ok}
      cancelText={btn.cancel}
    >
      <br />
      <Checkbox
        checked={allUsers}
        onChange={(e) => setAllUsers(e.target.checked)}
      >
        {!isEnglish ? "كل المستخدمين" : "All Users"}
      </Checkbox>
      <br />
      <br />
      {!allUsers && (
        <SelectUsers
          multiSelect={true}
          value={selected}
          onChange={(userIds: number | number[]) => {
            if (Array.isArray(userIds)) {
              setSelected(userIds);
            } else {
              if (userIds) {
                setSelected([userIds]);
              } else {
                setSelected([]);
              }
            }
          }}
          label={lbl.user}
        />
      )}
    </Modal>
  );
}
