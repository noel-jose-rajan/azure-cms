import React, { useState } from "react";
import { AnnouncementGroupsType } from "../../../../../services/announcement-groups/type";
import { useTheme } from "../../../../../../context/theme";
import { useLanguage } from "../../../../../../context/language";
import { LANGUAGE } from "../../../../../../constants/language";
import { arabicLabels } from "../../../../../../constants/app-constants/ar";
import { englishLabels } from "../../../../../../constants/app-constants/en";
import {
  Button,
  Checkbox,
  Col,
  Table,
  TableColumnsType,
  TableProps,
} from "antd";
import { CheckSquareFilled, ClearOutlined } from "@ant-design/icons";

interface SearchGroupTableProps {
  loading: boolean;
  groupData: AnnouncementGroupsType[];
  onSelectGroups: (users: AnnouncementGroupsType[]) => void;
  multiSelect: boolean;
}

export default function AnnouncementGroupSearchTable({
  loading,
  multiSelect,
  onSelectGroups,
  groupData,
}: SearchGroupTableProps) {
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const { theme } = useTheme();
  const { language } = useLanguage();
  const isEnglish = language === LANGUAGE.ENGLISH_INT;
  let labels = isEnglish ? englishLabels : arabicLabels;

  const rowSelection: TableProps<AnnouncementGroupsType>["rowSelection"] = {
    selectedRowKeys,
    onChange: (selectedRowKeys: React.Key[]) => {
      if (multiSelect) {
        setSelectedRowKeys(selectedRowKeys);
      } else {
        const [selectedKey] = selectedRowKeys;
        setSelectedRowKeys(selectedKey ? [selectedKey] : []);
      }
    },
    renderCell: (checked, record) => {
      return (
        <Checkbox
          checked={checked}
          onChange={() => {
            const isSelected = selectedRowKeys.includes(record.id);

            if (multiSelect) {
              const newSelectedRowKeys = isSelected
                ? selectedRowKeys.filter((key) => key !== record.id)
                : [...selectedRowKeys, record.id];
              setSelectedRowKeys(newSelectedRowKeys);
            } else {
              const newSelectedRowKeys = isSelected ? [] : [record.id];
              setSelectedRowKeys(newSelectedRowKeys);
            }
          }}
        />
      );
    },
  };

  const columns: TableColumnsType<AnnouncementGroupsType> = [
    {
      title: labels.lbl.announce_grp_name,
      dataIndex: isEnglish ? "name_en" : "name_ar",
      render: (text: string) => (
        <a style={{ color: theme.colors.primary }}>{text}</a>
      ),
      sorter: {
        compare: (a, b) =>
          isEnglish
            ? b.name_en.toLowerCase().localeCompare(a.name_en.toLowerCase())
            : b.name_ar.toLowerCase().localeCompare(a.name_ar.toLowerCase()),
        multiple: 3,
      },
    },
    {
      title: labels.lbl.announce_grp_code,
      dataIndex: "entity_code",
      render: (text: string) => (
        <a style={{ color: theme.colors.primary }}>{text}</a>
      ),
      sorter: {
        compare: (a, b) => b.id - a.id,
        multiple: 3,
      },
    },
    {
      title: labels.lbl.announce_grp_email,
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

  const onSubmitSelection = () => {
    const filtered = groupData.filter((user) =>
      selectedRowKeys.includes(user.id)
    );

    onSelectGroups(filtered);
    setSelectedRowKeys([]);
  };

  return (
    <Col>
      <Table<AnnouncementGroupsType>
        rowSelection={{ type: "checkbox", ...rowSelection }}
        showSorterTooltip
        sortDirections={["ascend", "descend"]}
        columns={columns}
        dataSource={groupData}
        style={{ marginTop: 15 }}
        loading={loading}
        rowKey="id"
        scroll={{ x: "max-content" }}
        pagination={{
          size: "small",
          showTotal: () =>
            `${isEnglish ? "Total" : "المجموع"} ${groupData.length} ${
              isEnglish ? "items" : "أغراض"
            }`,
          showSizeChanger: true,
          pageSizeOptions: [5, 10, 20],
          style: { marginRight: 10 },
          showQuickJumper: true,
          total: groupData.length ?? 0,
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
