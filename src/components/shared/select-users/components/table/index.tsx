import { Col, TableColumnsType, TableProps } from "antd";
import { useState } from "react";

import { CheckSquareFilled, ClearOutlined } from "@ant-design/icons";
import { UserType } from "../../service";
import { useTheme } from "../../../../../context/theme";
import { useLanguage } from "../../../../../context/language";
import TableComponent from "../../../../ui/table-component";
import ButtonComponent from "../../../../ui/button";
import HeightAnimationWrapper from "@/animations/height-wrapper-animation";

interface SearchUserTableProps {
  userData: UserType[];
  selectedUsers: React.Key[];
  onSelectUsers: (users: number[]) => void;
  multiSelect: boolean;
  onClose: () => void;
}

export default function SearchUserTable({
  userData,
  onSelectUsers,
  multiSelect,
  selectedUsers = [],
  onClose,
}: SearchUserTableProps) {
  const [selectedRowKeys, setSelectedRowKeys] =
    useState<React.Key[]>(selectedUsers);
  const { theme } = useTheme();
  const { isEnglish, labels } = useLanguage();
  const rowSelection: TableProps<UserType>["rowSelection"] = {
    columnWidth: 50,
    selectedRowKeys,
    onChange: (newSelectedRowKeys: React.Key[]) => {
      setSelectedRowKeys(newSelectedRowKeys);
    },
  };

  const columns: TableColumnsType<UserType> = [
    {
      width: 150,
      title: labels.lbl.user_ar_name,
      dataIndex: "name_ar",
      render: (text: string) => (
        <a style={{ color: theme.colors.primary }}>{text}</a>
      ),
    },
    {
      width: 150,
      title: labels.lbl.user_en_name,
      dataIndex: "name_en",
      render: (text: string) => (
        <a style={{ color: theme.colors.primary }}>{text}</a>
      ),
    },
    {
      width: 300,

      title: labels.lbl.user_login_name,
      dataIndex: "username",
      render: (text: string) => (
        <a style={{ color: theme.colors.primary }}>{text}</a>
      ),
      sorter: {
        compare: (a, b) => b.username.localeCompare(a.username),
        multiple: 3,
      },
    },
    // {
    //   title: labels.lbl.email,
    //   dataIndex: "email",
    //   render: (text: string) => (
    //     <a style={{ color: theme.colors.primary }}>{text ?? "-"}</a>
    //   ),
    //   sorter: {
    //     compare: (a, b) => b.email.localeCompare(a.email),
    //     multiple: 3,
    //   },
    // },
  ];

  const onSubmitSelection = () => {
    onSelectUsers(selectedRowKeys as number[]);
    setSelectedRowKeys([]);
    onClose();
  };

  return (
    <HeightAnimationWrapper>
      <TableComponent<UserType>
        pageSize={5}
        rowSelection={{
          type: multiSelect ? "checkbox" : "radio",
          ...rowSelection,
        }}
        showSorterTooltip
        sortDirections={["ascend", "descend"]}
        columns={columns}
        dataSource={userData}
        style={{ marginTop: 15 }}
        rowKey="id"
        scroll={{ x: "max-content" }}
        isLoading={false}
      />
      <Col
        style={{
          display: "flex",
          justifyContent: isEnglish ? "flex-end" : "flex-start",
          marginTop: 20,
        }}
      >
        <ButtonComponent
          type="text"
          style={{ marginInline: 10 }}
          onClick={() => setSelectedRowKeys([])}
          disabled={selectedRowKeys.length === 0}
          buttonLabel={labels.btn.clear}
          icon={<ClearOutlined />}
        />
        <ButtonComponent
          type="primary"
          onClick={onSubmitSelection}
          disabled={selectedRowKeys.length === 0}
          buttonLabel={labels.btn.select}
          icon={<CheckSquareFilled />}
        />
      </Col>
    </HeightAnimationWrapper>
  );
}
