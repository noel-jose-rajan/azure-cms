import {
  Button,
  Checkbox,
  Col,
  Table,
  TableColumnsType,
  TableProps,
} from "antd";
import { useState } from "react";
// import { OrgUnitType } from "../../service";
import { useTheme } from "../../../../../../context/theme";
import { LANGUAGE } from "../../../../../../constants/language";
import { useLanguage } from "../../../../../../context/language";
import { englishLabels } from "../../../../../../constants/app-constants/en";
import { arabicLabels } from "../../../../../../constants/app-constants/ar";
import { CheckSquareFilled, ClearOutlined } from "@ant-design/icons";
import { OrganizationUnitType } from "../../../../../services/organization-units/type";

interface SearchOrgUnitTableProps {
  paginationDetails: any;
  setPaginationDetails: (item: any) => void;
  loading: boolean;
  orgUnitData: OrganizationUnitType[];
  onSelectOrgUnits: (orgUnits: OrganizationUnitType[]) => void;
  multiSelect: boolean;
}

export default function SearchOrgUnitTable({
  paginationDetails,
  loading,
  setPaginationDetails,
  orgUnitData,
  onSelectOrgUnits,
  multiSelect,
}: SearchOrgUnitTableProps) {
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const { theme } = useTheme();
  const { language } = useLanguage();
  const isEnglish = language === LANGUAGE.ENGLISH_INT;
  let labels = isEnglish ? englishLabels : arabicLabels;

  const rowSelection: TableProps<OrganizationUnitType>["rowSelection"] = {
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
            const isSelected = selectedRowKeys.includes(record.entity_id);

            if (multiSelect) {
              const newSelectedRowKeys = isSelected
                ? selectedRowKeys.filter((key) => key !== record.entity_id)
                : [...selectedRowKeys, record.entity_id];
              setSelectedRowKeys(newSelectedRowKeys);
            } else {
              const newSelectedRowKeys = isSelected ? [] : [record.entity_id];
              setSelectedRowKeys(newSelectedRowKeys);
            }
          }}
        />
      );
    },
  };

  const columns: TableColumnsType<OrganizationUnitType> = [
    {
      title: labels.lbl.org_unit_code,
      dataIndex: "entity_code",
      render: (text: string) => (
        <a style={{ color: theme.colors.primary }}>{text}</a>
      ),
      sorter: {
        compare: (a, b) =>
          b.entity_code
            .toLowerCase()
            .localeCompare(a.entity_code.toLowerCase()),
        multiple: 3,
      },
    },
    {
      title: labels.til.org_unit_name_ar,
      dataIndex: "entity_desc_ar",
      render: (text: string) => (
        <a style={{ color: theme.colors.primary }}>{text}</a>
      ),
      sorter: {
        compare: (a, b) => b.entity_desc_ar.localeCompare(a.entity_desc_ar),
        multiple: 3,
      },
    },
    {
      title: labels.til.org_unit_name_en,
      dataIndex: "entity_desc_en",
      render: (text: string) => (
        <a style={{ color: theme.colors.primary }}>{text ?? "-"}</a>
      ),
      sorter: {
        compare: (a, b) => b.entity_desc_en.localeCompare(a.entity_desc_en),
        multiple: 3,
      },
    },
  ];

  const handlePageChange = (page: number, size: number) => {
    const clonedPagination = { ...paginationDetails };
    clonedPagination.page = page;
    clonedPagination.perPage = size;
    clonedPagination.total = paginationDetails?.total ?? orgUnitData.length;
    if (clonedPagination) {
      setPaginationDetails(clonedPagination);
    }
  };

  const onSubmitSelection = () => {
    const filtered = orgUnitData.filter((orgUnit) =>
      selectedRowKeys.includes(orgUnit.entity_id)
    );

    onSelectOrgUnits(filtered);
    setSelectedRowKeys([]);
  };

  return (
    <Col>
      <Table<OrganizationUnitType>
        rowSelection={{ type: "checkbox", ...rowSelection }}
        showSorterTooltip
        sortDirections={["ascend", "descend"]}
        columns={columns}
        dataSource={orgUnitData}
        style={{ marginTop: 15 }}
        loading={loading}
        rowKey="entity_id"
        scroll={{ x: "max-content" }}
        pagination={{
          size: "small",
          current: paginationDetails?.page,
          pageSize: paginationDetails?.perPage,
          defaultPageSize: paginationDetails?.perPage,
          showTotal: () =>
            `Total ${paginationDetails?.total ?? orgUnitData.length} items`,
          showSizeChanger: true,
          pageSizeOptions: [5, 10, 20],
          style: { marginRight: 10 },
          showQuickJumper: true,
          total: paginationDetails?.total,
          onChange: handlePageChange,
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
