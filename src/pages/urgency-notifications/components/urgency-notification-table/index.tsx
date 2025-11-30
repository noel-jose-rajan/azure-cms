import { Checkbox, Table, TableColumnsType, TableProps, Tag } from "antd";
import { useTheme } from "../../../../context/theme";
import { useLanguage } from "../../../../context/language";
import { LANGUAGE } from "../../../../constants/language";
import { englishLabels } from "../../../../constants/app-constants/en";
import { arabicLabels } from "../../../../constants/app-constants/ar";
import { useEffect, useState } from "react";
import { UrgencyNotificationPickListType } from "../../../../components/services/urgency-notifications/type";

interface ExternalEntityListTableProps {
  pickListItems: UrgencyNotificationPickListType[];
  onSelectARow: (rows: UrgencyNotificationPickListType[]) => void;
  selectedRows: UrgencyNotificationPickListType[];
}

export default function UrgencyNotificationTable({
  pickListItems,
  onSelectARow,
  selectedRows,
}: ExternalEntityListTableProps) {
  const { theme } = useTheme();
  const { language } = useLanguage();
  const isEnglish = language === LANGUAGE.ENGLISH_INT;
  let labels = isEnglish ? englishLabels : arabicLabels;
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>(
    selectedRows?.map((row) => row.id)
  );

  useEffect(() => {
    setSelectedRowKeys(selectedRows?.map((row) => row.id));
  }, [selectedRows]);

  const columns: TableColumnsType<UrgencyNotificationPickListType> = [
    {
      title: labels.lbl.picklist_ar_label,
      dataIndex: "picklistArLabel",
      render: (text: string) => (
        <a style={{ color: theme.colors.primary }}>{text}</a>
      ),
      sorter: {
        compare: (a, b) => b.picklistArLabel.localeCompare(a.picklistArLabel),
        multiple: 3,
      },
    },
    {
      title: labels.lbl.picklist_en_label,
      dataIndex: "picklistEnLabel",
      render: (text: string) => (
        <a style={{ color: theme.colors.primary }}>{text}</a>
      ),
      sorter: {
        compare: (a, b) => b.picklistEnLabel.localeCompare(a.picklistEnLabel),
        multiple: 3,
      },
    },
    {
      title: labels.lbl.duration_unit,
      dataIndex: "durationUnit",
      render: (text: string) => (
        <a style={{ color: theme.colors.primary }}>{text ?? "-"}</a>
      ),
      sorter: {
        compare: (a, b) =>
          (b.durationUnit ?? "")?.localeCompare(a.durationUnit ?? ""),
        multiple: 3,
      },
    },
    {
      title: labels.lbl.duration,
      dataIndex: "actionDuration",
      render: (text: string) => (
        <a style={{ color: theme.colors.primary }}>{text}</a>
      ),
      sorter: {
        compare: (a, b) => b.actionDuration - a.actionDuration,
        multiple: 3,
      },
    },
    {
      title: labels.lbl.escalation_after_how_many_reminders,
      dataIndex: "notificationFrequency",
      render: (text: string) => (
        <a style={{ color: theme.colors.primary }}>{text}</a>
      ),
      sorter: {
        compare: (a, b) => b.notificationFrequency - a.notificationFrequency,
        multiple: 3,
      },
    },
    {
      title: labels.lbl.is_active,
      dataIndex: "isActive",
      render: (text: boolean) => (
        <Tag
          style={{
            width: 40,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
          color={text === true ? theme.colors.success : theme.colors.danger}
        >
          {text === true ? labels.btn.yes : labels.btn.no}
        </Tag>
      ),
    },
    {
      title: labels.lbl.is_deactivatable,
      dataIndex: "isSystem",
      render: (text: boolean) => (
        <Tag
          style={{
            width: 40,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
          color={text !== true ? theme.colors.success : theme.colors.danger}
        >
          {text !== true ? labels.btn.yes : labels.btn.no}
        </Tag>
      ),
    },
  ];

  const rowSelection: TableProps<UrgencyNotificationPickListType>["rowSelection"] =
    {
      type: "checkbox",
      selectedRowKeys,
      onChange: (
        _selectedRowKeys: React.Key[],
        _selectedRows: UrgencyNotificationPickListType[]
      ) => {
        const [selectedKey] = _selectedRowKeys;
        const [selectedRow] = _selectedRows;
        setSelectedRowKeys(selectedKey ? [selectedKey] : []);
        onSelectARow(selectedRow ? [selectedRow] : []);
      },
      renderCell: (checked, record) => {
        return (
          <Checkbox
            checked={checked}
            onChange={() => {
              const isSelected = selectedRowKeys.includes(record.id);
              const newSelectedRowKeys = isSelected ? [] : [record.id];
              const newSelectedRows = isSelected ? [] : [record];
              setSelectedRowKeys(newSelectedRowKeys);
              onSelectARow(newSelectedRows);
            }}
          />
        );
      },
    };

  return (
    <Table<UrgencyNotificationPickListType>
      rowSelection={{ type: "checkbox", ...rowSelection }}
      showSorterTooltip
      sortDirections={["ascend", "descend"]}
      columns={columns}
      dataSource={pickListItems}
      rowKey="id"
      scroll={{ x: "max-content" }}
      pagination={{
        size: "small",
        defaultPageSize: 10,
        showTotal: () =>
          `${isEnglish ? "Total" : "المجموع"} ${pickListItems.length} ${
            isEnglish ? "items" : "أغراض"
          }`,
        showSizeChanger: true,
        pageSizeOptions: [5, 10, 20],
        style: { marginRight: 10, marginLeft: 10 },
        showQuickJumper: true,
        locale: {
          jump_to: isEnglish ? "Go to" : "اذهب الى",
          page: isEnglish ? "Page" : "صفحة",
          prev_page: isEnglish ? "Previous" : "خلف",
          next_page: isEnglish ? "Next" : "التالي",
          items_per_page: isEnglish ? "/ Page" : "/ صفحة",
        },
      }}
    />
  );
}
