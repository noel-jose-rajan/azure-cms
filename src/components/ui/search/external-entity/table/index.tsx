import React, { useState } from "react";
import {
  Button,
  Checkbox,
  Col,
  Table,
  TableColumnsType,
  TableProps,
} from "antd";
import { CheckSquareFilled, ClearOutlined } from "@ant-design/icons";
import { ExternalEntityType } from "../../../../services/external-entity/type";
import { useTheme } from "../../../../../context/theme";
import { useLanguage } from "../../../../../context/language";
import { LANGUAGE } from "../../../../../constants/language";
import { englishLabels } from "../../../../../constants/app-constants/en";
import { arabicLabels } from "../../../../../constants/app-constants/ar";
import { PickListItemType } from "../../../../services/picklist/type";

interface SearchGroupTableProps {
  paginationDetails: any;
  setPaginationDetails: (item: any) => void;
  loading: boolean;
  groupData: ExternalEntityType[];
  onSelectGroups: (users: ExternalEntityType[]) => void;
  multiSelect: boolean;
  entityClassification: PickListItemType[];
}

export default function EntitySearchTable({
  loading,
  multiSelect,
  onSelectGroups,
  paginationDetails,
  setPaginationDetails,
  groupData,
  entityClassification,
}: SearchGroupTableProps) {
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const { theme } = useTheme();
  const { language } = useLanguage();
  const isEnglish = language === LANGUAGE.ENGLISH_INT;
  let labels = isEnglish ? englishLabels : arabicLabels;

  const rowSelection: TableProps<ExternalEntityType>["rowSelection"] = {
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
            const isSelected = selectedRowKeys.includes(record.code);

            if (multiSelect) {
              const newSelectedRowKeys = isSelected
                ? selectedRowKeys.filter((key) => key !== record.code)
                : [...selectedRowKeys, record.code];
              setSelectedRowKeys(newSelectedRowKeys);
            } else {
              const newSelectedRowKeys = isSelected ? [] : [record.code];
              setSelectedRowKeys(newSelectedRowKeys);
            }
          }}
        />
      );
    },
  };

  const columns: TableColumnsType<ExternalEntityType> = [
    {
      title: labels.lbl.arabic_name,
      dataIndex: "descAr",
      render: (text: string) => (
        <a style={{ color: theme.colors.primary }}>{text}</a>
      ),
      sorter: {
        compare: (a, b) =>
          b.descAr.toLowerCase().localeCompare(a.descAr.toLowerCase()),
        multiple: 3,
      },
    },
    {
      title: labels.lbl.english_name,
      dataIndex: "descEn",
      render: (text: string) => (
        <a style={{ color: theme.colors.primary }}>{text}</a>
      ),
      sorter: {
        compare: (a, b) =>
          b.descEn.toLowerCase().localeCompare(a.descEn.toLowerCase()),
        multiple: 3,
      },
    },
    {
      title: labels.lbl.short_number,
      dataIndex: "shortName",
      render: (text: string) => (
        <a style={{ color: theme.colors.primary }}>{text ?? "-"}</a>
      ),
      sorter: {
        compare: (a, b) =>
          (b.shortName ?? "")
            .toLowerCase()
            .localeCompare((a.shortName ?? "").toLowerCase()),
        multiple: 3,
      },
    },
    {
      title: labels.lbl.classification,
      dataIndex: "classifyPickListCode",
      render: (text: string) => (
        <a style={{ color: theme.colors.primary }}>
          {entityClassification.find((entity) => entity.picklistCode == text)
            ?.picklistEnLabel ?? "-"}
        </a>
      ),
      sorter: {
        compare: (a, b) =>
          (b.classifyPickListCode ?? "")
            .toLowerCase()
            .localeCompare((a.classifyPickListCode ?? "").toLowerCase()),
        multiple: 3,
      },
    },
    {
      title: labels.lbl.phone,
      dataIndex: "phone",
      render: (text: string) => (
        <a style={{ color: theme.colors.primary }}>{text ?? "-"}</a>
      ),
      sorter: {
        compare: (a, b) =>
          (b.phone ?? "")
            .toLowerCase()
            .localeCompare((a.phone ?? "").toLowerCase()),
        multiple: 3,
      },
    },
    {
      title: labels.lbl.fax_number,
      dataIndex: "fax",
      render: (text: string) => (
        <a style={{ color: theme.colors.primary }}>{text ?? "-"}</a>
      ),
      sorter: {
        compare: (a, b) =>
          (b.fax ?? "")
            .toLowerCase()
            .localeCompare((a.fax ?? "").toLowerCase()),
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
        compare: (a, b) =>
          (b.email ?? "")
            .toLowerCase()
            .localeCompare((a.email ?? "").toLowerCase()),
        multiple: 3,
      },
    },
  ];

  const handlePageChange = (page: number, size: number) => {
    const clonedPagination = { ...paginationDetails };
    clonedPagination.page = page;
    clonedPagination.perPage = size;
    clonedPagination.total = paginationDetails?.total ?? groupData.length;
    if (clonedPagination) {
      setPaginationDetails(clonedPagination);
    }
  };

  const onSubmitSelection = () => {
    const filtered = groupData.filter((user) =>
      selectedRowKeys.includes(user.code)
    );

    onSelectGroups(filtered);
    setSelectedRowKeys([]);
  };

  return (
    <Col>
      <Table<ExternalEntityType>
        rowSelection={{ type: "checkbox", ...rowSelection }}
        showSorterTooltip
        sortDirections={["ascend", "descend"]}
        columns={columns}
        dataSource={groupData}
        style={{ marginTop: 15 }}
        loading={loading}
        scroll={{ x: "max-content" }}
        rowKey="code"
        pagination={{
          size: "small",
          current: paginationDetails?.page,
          pageSize: paginationDetails?.perPage,
          defaultPageSize: paginationDetails?.perPage,
          showTotal: () =>
            `${isEnglish ? "Total" : "المجموع"} ${
              paginationDetails?.total ?? groupData.length
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
