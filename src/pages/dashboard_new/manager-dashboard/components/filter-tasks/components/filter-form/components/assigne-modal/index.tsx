import HeightAnimationWrapper from "@/animations/height-wrapper-animation";
import { useLanguage } from "@/context/language";
import { useTheme } from "@/context/theme";
import { EmployeeType, getUsersByRoleId } from "@/pages/dashboard_new/service";
import { Modal, Tag, Typography } from "antd";
import React, { useEffect, useState } from "react";
type Props = {
  onClose: () => void;
  id: string | number;
};
const AssigneModal = ({ onClose, id }: Props) => {
  const [users, setUsers] = useState<EmployeeType[]>([]);
  const { labels, isEnglish } = useLanguage();
  const { theme } = useTheme();
  const fetchUsersList = async () => {
    const res = await getUsersByRoleId(id, !isEnglish);

    if (res) {
      setUsers(res);
    }
  };

  useEffect(() => {
    if (!id) return;
    fetchUsersList();
  }, [id, isEnglish]);
  return (
    <Modal
      afterClose={() => onClose()}
      open={true}
      onCancel={() => onClose()}
      width={500}
      title={<Typography>{labels.lbl.users}</Typography>}
      footer={<></>}
      centered
      style={{
        padding: 8,
      }}
    >
      <HeightAnimationWrapper style={{ minHeight: 40 }}>
        {users?.map((u) => (
          <Tag key={u?.id} color={theme.colors.primary}>
            {u?.name}
          </Tag>
        ))}
      </HeightAnimationWrapper>
    </Modal>
  );
};

export default AssigneModal;
