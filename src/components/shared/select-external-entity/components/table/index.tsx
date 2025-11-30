import React, { useState } from "react";
import { Button, Col, TableColumnsType, TableProps } from "antd";
import { CheckSquareFilled, ClearOutlined } from "@ant-design/icons";
import TableComponent from "@/components/ui/table-component";
import { useTheme } from "@/context/theme";
import { useLanguage } from "@/context/language";
import usePicklist from "@/store/picklists/use-picklist";
import { ExternalEntity } from "@/pages/external-entity/service";
import HeightAnimationWrapper from "@/animations/height-wrapper-animation";

interface SearchGroupTableProps {
  data: ExternalEntity[];
  onSelect: (entities: number[]) => void;
  multiSelect: boolean;
}

export default function EntitySearchTable({
  multiSelect,
  onSelect,
  data,
}: SearchGroupTableProps) {
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const { theme } = useTheme();
  const { labels, isEnglish } = useLanguage();
  const { getPicklistById } = usePicklist();

  // const rowSelection: TableProps<ExternalEntityType>["rowSelection"] = {
  //   selectedRowKeys,
  //   onChange: (selectedRowKeys: React.Key[]) => {
  //     if (multiSelect) {
  //       setSelectedRowKeys(selectedRowKeys);
  //     } else {
  //       const [selectedKey] = selectedRowKeys;
  //       setSelectedRowKeys(selectedKey ? [selectedKey] : []);
  //     }
  //   },
  //   renderCell: (checked, record) => {
  //     return (
  //       <Checkbox
  //         checked={checked}
  //         onChange={() => {
  //           const isSelected = selectedRowKeys.includes(record.code);

  //           if (multiSelect) {
  //             const newSelectedRowKeys = isSelected
  //               ? selectedRowKeys.filter((key) => key !== record.code)
  //               : [...selectedRowKeys, record.code];
  //             setSelectedRowKeys(newSelectedRowKeys);
  //           } else {
  //             const newSelectedRowKeys = isSelected ? [] : [record.code];
  //             setSelectedRowKeys(newSelectedRowKeys);
  //           }
  //         }}
  //       />
  //     );
  //   },
  // };
  const rowSelection: TableProps<ExternalEntity>["rowSelection"] = {
    selectedRowKeys,
    onChange: (newSelectedRowKeys: React.Key[]) => {
      setSelectedRowKeys(newSelectedRowKeys);
    },
  };
  const columns: TableColumnsType<ExternalEntity> = [
    {
      title: labels.lbl.arabic_name,
      dataIndex: "name_ar",
      render: (text: string) => (
        <a style={{ color: theme.colors.primary }}>{text}</a>
      ),
      sorter: {
        compare: (a, b) =>
          b.name_ar.toLowerCase().localeCompare(a.name_ar.toLowerCase()),
        multiple: 3,
      },
    },
    {
      title: labels.lbl.english_name,
      dataIndex: "name_en",
      render: (text: string) => (
        <a style={{ color: theme.colors.primary }}>{text}</a>
      ),
      sorter: {
        compare: (a, b) =>
          b.name_en.toLowerCase().localeCompare(a.name_en.toLowerCase()),
        multiple: 3,
      },
    },
    {
      title: labels.lbl.short_number,
      dataIndex: "entity_code",
      render: (text: string) => (
        <a style={{ color: theme.colors.primary }}>{text ?? "-"}</a>
      ),
      sorter: {
        compare: (a, b) =>
          (b.abbr ?? "")
            .toLowerCase()
            .localeCompare((a.abbr ?? "").toLowerCase()),
        multiple: 3,
      },
    },
    {
      title: labels.lbl.classification,
      dataIndex: "classify_id",
      render: (text: string) => {
        const p = getPicklistById("External Entity Classification", text);
        return (
          <a style={{ color: theme.colors.primary }}>
            {(isEnglish ? p?.picklist_en_label : p?.picklist_ar_label) || "-"}
          </a>
        );
      },
    },
    // {
    //   title: labels.lbl.phone,
    //   dataIndex: "phone",
    //   render: (text: string) => (
    //     <a style={{ color: theme.colors.primary }}>{text ?? "-"}</a>
    //   ),
    //   sorter: {
    //     compare: (a, b) =>
    //       (b.phone ?? "")
    //         .toLowerCase()
    //         .localeCompare((a?.phone ?? "").toLowerCase()),
    //     multiple: 3,
    //   },
    // },
    // {
    //   title: labels.lbl.fax_number,
    //   dataIndex: "fax",
    //   render: (text: string) => (
    //     <a style={{ color: theme.colors.primary }}>{text ?? "-"}</a>
    //   ),
    //   sorter: {
    //     compare: (a, b) =>
    //       (b.fax ?? "")
    //         .toLowerCase()
    //         .localeCompare((a.fax ?? "").toLowerCase()),
    //     multiple: 3,
    //   },
    // },
    // {
    //   title: labels.lbl.email,
    //   dataIndex: "email",
    //   render: (text: string) => (
    //     <a style={{ color: theme.colors.primary }}>{text ?? "-"}</a>
    //   ),
    //   sorter: {
    //     compare: (a, b) =>
    //       (b.email ?? "")
    //         .toLowerCase()
    //         .localeCompare((a.email ?? "").toLowerCase()),
    //     multiple: 3,
    //   },
    // },
  ];

  // const handlePageChange = (page: number, size: number) => {
  //   const clonedPagination = { ...paginationDetails };
  //   clonedPagination.page = page;
  //   clonedPagination.perPage = size;
  //   clonedPagination.total = paginationDetails?.total ?? groupData.length;
  //   if (clonedPagination) {
  //     setPaginationDetails(clonedPagination);
  //   }
  // };

  const onSubmitSelection = () => {
    onSelect(selectedRowKeys as number[]);
    setSelectedRowKeys([]);
  };

  return (
    <HeightAnimationWrapper>
      <TableComponent<ExternalEntity>
        rowSelection={{
          type: multiSelect ? "checkbox" : "radio",
          ...rowSelection,
        }}
        showSorterTooltip
        sortDirections={["ascend", "descend"]}
        columns={columns}
        dataSource={data}
        style={{ marginTop: 15 }}
        scroll={{ x: "max-content" }}
        rowKey="id"
        pageSize={5}
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
    </HeightAnimationWrapper>
  );
}
