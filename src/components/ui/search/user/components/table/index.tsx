import {
  Button,
  Checkbox,
  Col,
  Table,
  TableColumnsType,
  TableProps,
} from "antd";
import { useState } from "react";
import { useTheme } from "../../../../../../context/theme";
import { useLanguage } from "../../../../../../context/language";
import { englishLabels } from "../../../../../../constants/app-constants/en";
import { arabicLabels } from "../../../../../../constants/app-constants/ar";
import { CheckSquareFilled, ClearOutlined } from "@ant-design/icons";
import { UserType } from "../../../../../services/user-preference/type";

interface SearchUserTableProps {
  paginationDetails: any;
  setPaginationDetails: (item: any) => void;
  loading: boolean;
  userData: UserType[];
  onSelectUsers: (users: UserType[]) => void;
  multiSelect: boolean;
}

export default function SearchUserTable({
  paginationDetails,
  loading,
  setPaginationDetails,
  userData,
  onSelectUsers,
  multiSelect,
}: SearchUserTableProps) {
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const { theme } = useTheme();
  const { isEnglish } = useLanguage();
  let labels = isEnglish ? englishLabels : arabicLabels;

  const rowSelection: TableProps<UserType>["rowSelection"] = {
    selectedRowKeys,
    onChange: (selectedRowKeys: React.Key[]) => {
      if (multiSelect) {
        setSelectedRowKeys(selectedRowKeys);
      } else {
        console.log("the row keys", selectedRowKeys);
        const [selectedKey] = selectedRowKeys;
        setSelectedRowKeys(selectedKey ? [selectedKey] : []);
      }
    },
    renderCell: (checked, record) => {
      return (
        <Checkbox
          checked={checked}
          onChange={() => {
            const isSelected = selectedRowKeys.includes(record.userId);

            if (multiSelect) {
              const newSelectedRowKeys = isSelected
                ? selectedRowKeys.filter((key) => key !== record.userId)
                : [...selectedRowKeys, record.userId];
              setSelectedRowKeys(newSelectedRowKeys);
            } else {
              const newSelectedRowKeys = isSelected ? [] : [record.userId];
              setSelectedRowKeys(newSelectedRowKeys);
            }
          }}
        />
      );
    },
  };

  const columns: TableColumnsType<UserType> = [
    {
      title: labels.lbl.user,
      dataIndex: isEnglish ? "nameEng" : "nameAr",
      render: (text: string) => (
        <a style={{ color: theme.colors.primary }}>{text}</a>
      ),
    },
    {
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
    {
      title: labels.lbl.email,
      dataIndex: "email",
      render: (text: string) => (
        <a style={{ color: theme.colors.primary }}>{text ?? "-"}</a>
      ),
      sorter: {
        compare: (a, b) => b.email.localeCompare(a.email),
        multiple: 3,
      },
    },
  ];

  const handlePageChange = (page: number, size: number) => {
    const clonedPagination = { ...paginationDetails };
    clonedPagination.page = page;
    clonedPagination.perPage = size;
    clonedPagination.total = paginationDetails?.total ?? userData.length;
    if (clonedPagination) {
      setPaginationDetails(clonedPagination);
    }
  };

  const onSubmitSelection = () => {
    const filtered = userData.filter((user) =>
      selectedRowKeys.includes(user.userId)
    );

    onSelectUsers(filtered);
    setSelectedRowKeys([]);
  };

  return (
    <Col>
      <Table<UserType>
        rowSelection={{ type: "checkbox", ...rowSelection }}
        showSorterTooltip
        sortDirections={["ascend", "descend"]}
        columns={columns}
        dataSource={userData}
        style={{ marginTop: 15 }}
        loading={loading}
        rowKey="userId"
        scroll={{ x: "max-content" }}
        pagination={{
          size: "small",
          current: paginationDetails?.page,
          pageSize: paginationDetails?.perPage,
          defaultPageSize: paginationDetails?.perPage,
          showTotal: () =>
            `${isEnglish ? "Total" : "المجموع"} ${
              paginationDetails?.total ?? userData.length
            } ${isEnglish ? "items" : "أغراض"}`,
          showSizeChanger: true,
          pageSizeOptions: [5, 10, 20],
          style: { marginRight: 10 },
          showQuickJumper: true,
          total: paginationDetails?.total,
          onChange: handlePageChange,
          locale: {
            jump_to: isEnglish ? "Go to" : "اذهب الى",
            page: isEnglish ? "Page" : "صفحة",
            prev_page: isEnglish ? "Previous" : "خلف",
            next_page: isEnglish ? "Next" : "التالي",
            items_per_page: isEnglish ? "/ Page" : "/ صفحة",
          },
        }}
      />
      <Col
        style={{
          display: "flex",
          justifyContent: isEnglish ? "flex-end" : "flex-start",
        }}
      >
        <Button
          type="text"
          style={{ marginLeft: 10, marginRight: 10 }}
          onClick={() => setSelectedRowKeys([])}
          disabled={selectedRowKeys.length === 0}
        >
          <ClearOutlined onClick={() => setSelectedRowKeys([])} />
          {labels.btn.clear}
        </Button>
        <Button type="primary" onClick={onSubmitSelection}>
          <CheckSquareFilled />
          {labels.btn.select}
        </Button>
      </Col>
    </Col>
  );
}
