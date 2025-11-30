import { Button, TableColumnsType } from "antd";
import React from "react";
import { DelegationRecord } from "../../types";
import { useLanguage } from "@/context/language";
import useGetAllUsers from "@/store/users/use-get-all-users";
import { DeleteFilled, EditFilled } from "@ant-design/icons";
import { useTheme } from "@/context/theme";
import TableComponent from "@/components/ui/table-component";

type Props = {
  handleEdit: (data: DelegationRecord) => void;
  data: DelegationRecord[];
  setDelegations: React.Dispatch<React.SetStateAction<DelegationRecord[]>>;
};

const DelegationTable = ({ data, setDelegations, handleEdit }: Props) => {
  const { isEnglish, labels } = useLanguage();
  const { getUserById } = useGetAllUsers();
  const { theme } = useTheme();
  const handleDelete = (rowId: number) => {
    setDelegations((prev) => prev?.filter((d) => d?.id !== rowId));
  };

  const columns: TableColumnsType<DelegationRecord> = [
    {
      title: labels.lbl.user_name,
      dataIndex: "delegate_to_user_id",
      render: (id: number) => {
        const u = getUserById(id);
        return <span>{(isEnglish ? u?.name_en : u?.name_ar) || "-"}</span>;
      },
      width: 200,
    },
    {
      title: labels.tbl.action,
      dataIndex: "id",
      width: 150,
      render: (id, record) => (
        <div style={{ display: "flex", gap: 0 }}>
          <Button
            type="link"
            size="small"
            onClick={() => handleEdit(record)}
            style={{ color: theme.colors.success }}
          >
            <EditFilled />
          </Button>

          <Button
            type="link"
            size="small"
            danger
            onClick={() => handleDelete(id)}
          >
            <DeleteFilled />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <TableComponent<DelegationRecord>
      sortDirections={["ascend", "descend"]}
      columns={columns}
      dataSource={data}
      scroll={{ x: "max-content" }}
      size="small"
      style={{
        marginTop: 15,
        maxWidth: 800,
      }}
      rowKey="id"
      // pagination={{
      //   hideOnSinglePage: true,
      //   size: "small",
      //   position: ["bottomCenter"],
      // }}
    />
  );
};

export default DelegationTable;
