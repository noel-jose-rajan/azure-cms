import useHandleError from "@/components/hooks/useHandleError";
import {
  AddUserBody,
  addUsers,
  SyncedUser,
} from "@/components/services/user-preference";
import ModalComponent from "@/components/ui/modal";
import TableComponent from "@/components/ui/table-component";
import { useLanguage } from "@/context/language";
import { SyncOutlined } from "@ant-design/icons";
import { Button, Col, message, TableColumnsType } from "antd";
import React, { useState } from "react";

type Props = {
  data: SyncedUser[];
  handleSelectedUser: (id: string) => Promise<void>;
};
const SyncUsersTable = ({ data, handleSelectedUser }: Props) => {
  const { handleError } = useHandleError();
  const { labels, isEnglish } = useLanguage();
  const [user, setUser] = useState<SyncedUser | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const columns: TableColumnsType<SyncedUser> = [
    {
      width: 150,
      title: labels.lbl.english_name,
      dataIndex: "cn",
      render: (text: string) => <span>{text}</span>,
      sorter: {
        compare: (a, b) => (b.cn ?? "")?.localeCompare(a.cn ?? ""),
        multiple: 3,
      },
    },
    {
      width: 150,

      title: labels.lbl.name,
      dataIndex: "uid",
      render: (text: string) => <span>{text}</span>,
      sorter: {
        compare: (a, b) => b.uid.localeCompare(a.uid),
        multiple: 3,
      },
    },

    {
      width: 200,
      title: labels.lbl.email,
      dataIndex: "mail",
      render: (text: string) => {
        return <span>{text}</span>;
      },
    },
    {
      width: 75,
      title: labels.tbl.action,
      dataIndex: "uid",
      render: (_: unknown, record: SyncedUser) => {
        return (
          <Button type="link" size="small" onClick={() => setUser(record)}>
            <SyncOutlined />
          </Button>
        );
      },
    },
  ];

  const handleAddUser = async () => {
    try {
      setLoading(true);

      const body: AddUserBody = {
        email: user?.mail || "",
        name_en: user?.cn || "",
        username: user?.uid || "",
      };
      const res = await addUsers(body);

      if (res) {
        message.success(labels.msg.sync_success);
        await handleSelectedUser(user?.uid + "");
        setUser(null);
      }
    } catch (e) {
      handleError(e);
    } finally {
      setLoading(false);
    }
  };
  return (
    <Col span={24}>
      <TableComponent<SyncedUser>
        sortDirections={["ascend", "descend"]}
        columns={columns}
        dataSource={data}
        size="small"
        rowKey="uid"
        pageSize={5}
        style={{ width: "100%" }}
        scroll={{ x: "max-content" }}
      />
      {user !== null && (
        <ModalComponent
          title={isEnglish ? "sync user" : "مزامنة المستخدم"}
          description={labels.msg.if_Sync_users}
          visible={user !== null}
          onClose={() => setUser(null)}
          onSubmit={handleAddUser}
          okText={labels.btn.sync}
          loading={loading}
        />
      )}
    </Col>
  );
};

export default SyncUsersTable;
