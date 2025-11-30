import { message, Modal, Spin } from "antd";
import { useEffect, useState } from "react";
import { useLanguage } from "../../../../context/language";
import { AppPrivilegeType } from "@/components/services/application-privilege/type";
import SelectUsers from "@/components/shared/select-users";
import {
  assignProfileUsers,
  getProfileUsers,
} from "@/components/services/application-privilege/service";
import { HttpStatus } from "@/components/functional/httphelper";

interface Props {
  open?: boolean;
  profile?: AppPrivilegeType;
  onClose?: () => void;
}

export default function ManageUserProfileModal({
  open,
  profile,
  onClose,
}: Props) {
  const {
    isEnglish,
    labels: { lbl },
  } = useLanguage();
  const [profiles, setProfiles] = useState<number[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (profile?.id) {
      getUsers(profile.id);
    }
  }, [profile]);

  const getUsers = async (id: number) => {
    try {
      setLoading(true);
      const response = await getProfileUsers(id);

      if (response.status === HttpStatus.SUCCESS && response.data) {
        setProfiles(response.data.Data ?? []);
      }
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (profiles.length === 0) {
      message.error(
        isEnglish ? "No users selected." : "لم يتم اختيار أي مستخدمين."
      );
      return;
    }

    if (profile) {
      setLoading(true);
      try {
        const request = await assignProfileUsers(profiles, profile.id);

        if (request) {
          message.success(isEnglish ? "Done" : "تم بنجاح");
          onClose && onClose();
        } else {
          throw new Error("Request failed");
        }
      } catch (error) {
        message.error(isEnglish ? "Error" : "حدث خطأ");
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      onCancel={onClose}
      onOk={handleSubmit}
      confirmLoading={loading}
    >
      <Spin spinning={loading}>
        <SelectUsers
          multiSelect={true}
          onChange={(value) => {
            if (Array.isArray(value)) {
              setProfiles(value);
            } else {
              setProfiles([]);
            }
          }}
          value={profiles}
          label={lbl.user}
        />
      </Spin>
    </Modal>
  );
}
