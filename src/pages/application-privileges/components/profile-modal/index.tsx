import React, { useState, useEffect } from "react";
import { Modal, Tag, Spin, message } from "antd";
import { useLanguage } from "../../../../context/language";
import {
  getProfileUsers,
  getProfileViews,
} from "@/components/services/application-privilege/service";
import { AppPrivilegeType } from "@/components/services/application-privilege/type";
import { HttpStatus } from "@/components/functional/httphelper";
import useGetAllUsers from "@/store/users/use-get-all-users";
import { UserType } from "@/components/shared/select-users/service";

interface ModalProps {
  profileId: number;
  type: "view" | "group";
  visible: boolean;
  onCancel: () => void;
  applicationViews: AppPrivilegeType[];
}

const ProfileModal: React.FC<ModalProps> = ({
  profileId,
  type,
  visible,
  onCancel,
  applicationViews,
}) => {
  const {
    labels: { msg, lbl },
    isEnglish,
  } = useLanguage();

  const [loading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState<AppPrivilegeType[] | UserType[]>([]);
  const [error, setError] = useState<string | null>(null);
  const { users } = useGetAllUsers();

  useEffect(() => {
    if (visible) {
      setLoading(true);
      setError(null);
      const fetchData = async () => {
        try {
          if (type === "group") {
            const result = await getProfileUsers(profileId);
            if (result.status === HttpStatus.SUCCESS && result.data) {
              const data = result.data.Data ?? [];
              const filteredUsers = users.filter((user) =>
                data.includes(user.id)
              );
              setData(filteredUsers);
            } else {
              setData([]);
            }
          } else {
            const result = await getProfileViews(profileId);
            if (result.status === HttpStatus.SUCCESS && result.data !== null) {
              const data = result.data.Data ?? [];
              const filteredViews = applicationViews.filter((ap) =>
                data.includes(ap.id)
              );
              setData(filteredViews);
            } else {
              setData([]);
            }
          }
        } catch (err) {
          setError("Failed to fetch data");
          message.error("Failed to fetch data");
        } finally {
          setLoading(false);
        }
      };
      fetchData();
    }
  }, [profileId, type, visible]);

  const renderTags = () => {
    if (!Array.isArray(data) || data.length === 0) {
      return <p style={{ textAlign: "center" }}>{msg.no_data}</p>;
    }

    if (type === "view") {
      return (data as AppPrivilegeType[]).map((view) => (
        <Tag style={{ margin: "5px" }} key={view.id} color="blue">
          {isEnglish ? view.name_en : view.name_ar}
        </Tag>
      ));
    } else {
      return ((data as UserType[]) ?? []).map((user, index) => (
        <Tag style={{ margin: "5px" }} key={user.id} color="green">
          {isEnglish ? user.name_en : user.name_ar}
        </Tag>
      ));
    }
  };

  return (
    <Modal
      title={type === "view" ? lbl.profile_views : lbl.profile_users}
      visible={visible}
      onCancel={onCancel}
      footer={null}
      width={600}
    >
      {loading ? (
        <Spin size="large" />
      ) : error ? (
        <div>{error}</div>
      ) : (
        <div>{renderTags()}</div>
      )}
    </Modal>
  );
};

export default ProfileModal;
