import { SyncOutlined } from "@ant-design/icons";
import { Button, message } from "antd";
import { LANGUAGE } from "../../../../constants/language";
import { useLanguage } from "../../../../context/language";
import { arabicLabels } from "../../../../constants/app-constants/ar";
import { englishLabels } from "../../../../constants/app-constants/en";
import { useState } from "react";
import {
  SyncedUser,
  syncUsers,
} from "../../../../components/services/user-preference";
import Spinner from "@/components/ui/spinner";
import WhileInViewWrapper from "@/animations/while-in-view-wrapper";
import SyncUsersTable from "./components/table";

type Props = {
  handleSelectedUser: (id: string) => Promise<void>;
};
export default function SyncUsers({ handleSelectedUser }: Props) {
  const [users, setUsers] = useState<SyncedUser[]>([]);
  const { language } = useLanguage();

  //states
  const [loading, setLoading] = useState<boolean>(false);

  //computed states
  const isEnglish = language === LANGUAGE.ENGLISH_INT;
  const { btn } = isEnglish ? englishLabels : arabicLabels;

  //Functions

  const handleSyncUsers = async () => {
    setLoading(() => true);

    try {
      const response = await syncUsers();
      if (response) {
        setUsers(response);
      }
    } catch (err: unknown) {
      message.error("Failed to sync users");
    } finally {
      setLoading(() => false);
    }
  };

  return (
    <div
      style={{
        padding: "16px",
        direction: isEnglish ? "ltr" : "rtl",
      }}
    >
      <Button onClick={handleSyncUsers} style={{ marginBottom: 16 }}>
        {loading ? <Spinner /> : <SyncOutlined />} {btn.sync}
      </Button>
      <br />
      {users && users?.length > 0 && (
        <WhileInViewWrapper>
          <SyncUsersTable
            data={users}
            handleSelectedUser={async (id) => {
              await handleSyncUsers();
              handleSelectedUser(id);
            }}
          />
        </WhileInViewWrapper>
      )}
    </div>
  );
}
