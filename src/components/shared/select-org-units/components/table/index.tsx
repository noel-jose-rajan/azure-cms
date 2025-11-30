import { Col, TableColumnsType, TableProps } from "antd";
import { useState } from "react";
import { CheckSquareFilled, ClearOutlined } from "@ant-design/icons";
import { useLanguage } from "../../../../../context/language";
import { useTheme } from "../../../../../context/theme";
import { OrgUnitType } from "../../../../services/organization-units/type";
import TableComponent from "../../../../ui/table-component";
import ButtonComponent from "../../../../ui/button";
import HeightAnimationWrapper from "@/animations/height-wrapper-animation";
import useGetAllOU from "@/store/orgs/use-get-all-ou";

interface SearchOrgUnitTableProps {
  selectedOrgUnits: number[];
  orgUnitData: OrgUnitType[];
  onSelectOrgUnits: (orgs: number[]) => void;
  multiSelect: boolean;
  onClose: () => void;
}

export default function SearchOrgUnitTable({
  selectedOrgUnits,
  onSelectOrgUnits,
  multiSelect,
  onClose,
  orgUnitData = [],
}: SearchOrgUnitTableProps) {
  const { loading } = useGetAllOU();
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>(
    selectedOrgUnits?.map((item) => item as React.Key)
  );
  const { theme } = useTheme();
  const { labels } = useLanguage();

  const rowSelection: TableProps<OrgUnitType>["rowSelection"] = {
    // fixed: true,
    columnWidth: 50,
    selectedRowKeys,
    onChange: (newSelectedRowKeys: React.Key[]) => {
      setSelectedRowKeys(newSelectedRowKeys);
    },
  };

  const columns: TableColumnsType<OrgUnitType> = [
    {
      width: 200,
      title: labels.lbl.org_unit_code,
      dataIndex: "entity_code",

      render: (text: string) => (
        <a style={{ color: theme.colors.primary }}>{text || "-"}</a>
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
      width: 200,

      title: labels.til.org_unit_name_ar,

      dataIndex: "name_ar",
      render: (text: string) => (
        <a style={{ color: theme.colors.primary }}>{text || "-"}</a>
      ),
      sorter: {
        compare: (a, b) => b.name_ar.localeCompare(a.name_ar),
        multiple: 3,
      },
    },
    {
      width: 200,

      title: labels.til.org_unit_name_en,

      dataIndex: "name_en",
      render: (text: string) => (
        <a style={{ color: theme.colors.primary }}>{text || "-"}</a>
      ),
      sorter: {
        compare: (a, b) => b.name_en.localeCompare(a.name_en),
        multiple: 3,
      },
    },
    {
      title: labels.til.org_unit_email,

      dataIndex: "email",
      render: (text: string) => (
        <a style={{ color: theme.colors.primary }}>{text || "-"}</a>
      ),
      sorter: {
        compare: (a, b) => b.email.localeCompare(a.email),
        multiple: 3,
      },
    },
  ];

  const onSubmitSelection = () => {
    onSelectOrgUnits(selectedRowKeys as number[]);
    setSelectedRowKeys([]);
    onClose();
  };
  return (
    <>
      <HeightAnimationWrapper startAnimation={!loading}>
        <TableComponent<OrgUnitType>
          rowSelection={{
            type: multiSelect ? "checkbox" : "radio",
            ...rowSelection,
          }}
          isLoading={false}
          sortDirections={["ascend", "descend"]}
          columns={columns}
          dataSource={orgUnitData}
          rowKey="id"
          scroll={{ x: "max-content" }}
          className="cms-table"
          tableLayout="fixed"
          pageSize={5}
        />
      </HeightAnimationWrapper>
      <Col
        style={{
          display: "flex",
          justifyContent: "end",
        }}
      >
        <ButtonComponent
          buttonLabel={labels.btn.clear}
          type="text"
          style={{ marginInline: 5 }}
          onClick={() => setSelectedRowKeys([])}
          disabled={selectedRowKeys.length === 0}
          icon={<ClearOutlined />}
        />

        <ButtonComponent
          buttonLabel={labels.btn.select}
          icon={<CheckSquareFilled />}
          disabled={selectedRowKeys.length === 0}
          type="primary"
          onClick={onSubmitSelection}
        />
      </Col>
    </>
  );
}
