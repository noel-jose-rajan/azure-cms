import TableComponent from "@/components/ui/table-component";
import { useLanguage } from "@/context/language";
import { EmployeePerformance } from "@/pages/dashboard_new/service";
import useGetAllUsers from "@/store/users/use-get-all-users";
import { TableColumnsType, TableProps } from "antd";
import { useEffect, useState } from "react";

type Props = {
  data: EmployeePerformance[];
  onSelectChange?: (id: number) => void;
};
const EmployeePerformanceTable = ({ data, onSelectChange }: Props) => {
  const { labels, isEnglish } = useLanguage();
  const { getUserById } = useGetAllUsers();
  const [selectedRows, setSelectedRows] = useState<React.Key[]>([]);

  const rowSelection: TableProps<EmployeePerformance>["rowSelection"] = {
    type: "radio",
    selectedRowKeys: selectedRows,
    onChange: (newSelectedRowKeys: React.Key[]) => {
      setSelectedRows(newSelectedRowKeys);
    },
  };

  const columns: TableColumnsType<EmployeePerformance> = [
    {
      title: labels.lbl.name,
      dataIndex: "assignee",
      render: (id: number) => {
        const u = getUserById(id);

        return <span>{(isEnglish ? u?.name_en : u?.name_ar) || "-"}</span>;
      },

      width: 200,
      ellipsis: true,
    },
    {
      title: labels.til.performance,
      dataIndex: "kpi",
      render: (text: string, record) => {
        const total = record?.total || 0;
        const breached = record?.total_breach || 0;

        const performance = total > 0 ? (total - breached) / total : 0;
        return <span>{(performance * 100)?.toFixed(2)}%</span>;
      },
      width: 150,
      ellipsis: true,
    },

    {
      title: labels.lbl.total_Breached,
      dataIndex: "total_breach",
      render: (_text: string) => {
        return <span>{_text ?? "-"}</span>;
      },
      width: 200,
      ellipsis: true,
    },
    {
      title: labels.lbl.total,
      dataIndex: "total",
      render: (_text: string) => {
        return <span>{_text || "-"}</span>;
      },
      width: 200,
      ellipsis: true,
    },
  ];

  useEffect(() => {
    if (selectedRows?.length == 0) {
      setSelectedRows(data?.length ? [data[0]?.assignee as React.Key] : []);
    }
  }, [data?.length, selectedRows]);
  const selectedEmployee = data.find((emp) => emp.assignee === selectedRows[0]);

  const total = selectedEmployee?.total || 0;
  const breached = selectedEmployee?.total_breach || 0;

  const performance = total > 0 ? (total - breached) / total : 0;

  useEffect(() => {
    onSelectChange && selectedEmployee && onSelectChange(performance);
  }, [performance, selectedRows]);
  return (
    <TableComponent<EmployeePerformance>
      columns={columns}
      dataSource={data}
      scroll={{ x: "max-content" }}
      size="small"
      style={{ marginTop: 15, background: "transparent", boxShadow: "0" }}
      rowKey="assignee"
      rowSelection={rowSelection}
    />
  );
};

export default EmployeePerformanceTable;
