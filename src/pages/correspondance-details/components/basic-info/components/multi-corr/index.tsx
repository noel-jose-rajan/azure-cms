import useHandleError from "@/components/hooks/useHandleError";
import {
  getMultiCorrespondence,
  MultiCorr,
} from "@/components/shared/outbound/service";
import TableComponent from "@/components/ui/table-component";
import { useLanguage } from "@/context/language";
import { TableColumnsType, TableProps } from "antd";
import { RowSelectionType } from "antd/es/table/interface";
import React, { useEffect } from "react";

type Props = {
  corrId: number | string;
  onSelect: (id: string | number) => void;
  setIsMultiCorr: React.Dispatch<React.SetStateAction<boolean>>;
};
const MultiCorrespondence = ({ corrId, onSelect, setIsMultiCorr }: Props) => {
  const { handleError } = useHandleError();
  const { labels } = useLanguage();
  const [multiCorrs, setMultiCorrs] = React.useState<MultiCorr[]>([]);
  const [selectedRows, setSelectedRows] = React.useState<React.Key[]>([]);
  const [loading, setLoading] = React.useState<boolean>(false);
  const fetchMultiCorr = async () => {
    try {
      setLoading(true);
      const data = await getMultiCorrespondence(corrId);
      if (data && data.length > 0) {
        setSelectedRows([data[0]?.id]);
        setMultiCorrs(data);
        onSelect(data[0]?.id);
        setIsMultiCorr(true);
      } else {
        setIsMultiCorr(false);
      }
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!corrId) return;
    fetchMultiCorr();
  }, [corrId]);

  const rowSelection: TableProps<MultiCorr>["rowSelection"] = {
    type: "radio",
    selectedRowKeys: selectedRows,

    onChange: (newSelectedRowKeys: React.Key[]) => {
      setSelectedRows(newSelectedRowKeys);
      onSelect(newSelectedRowKeys[0] as string | number);
    },
  };
  const columns: TableColumnsType<MultiCorr> = [
    {
      title: labels.tbl.subject,
      dataIndex: "correspondence_no",
      render: (_text: string) => {
        return <span>{_text || labels.lbl.subject}</span>;
      },
      width: 300,
      ellipsis: true,
    },
    {
      title: labels.tbl.receiving_entity,
      dataIndex: "receiving_entity_name",
      render: (_text: string) => {
        return <span>{_text}</span>;
      },
      width: 200,
      ellipsis: true,
    },
  ];

  return (
    <>
      {multiCorrs && multiCorrs.length > 0 && (
        <TableComponent<MultiCorr>
          rowSelection={rowSelection}
          isLoading={loading}
          showSorterTooltip
          sortDirections={["ascend", "descend"]}
          columns={columns}
          dataSource={multiCorrs}
          style={{ marginTop: 15 }}
          scroll={{ x: "max-content" }}
          rowKey={"id"}
        />
      )}
    </>
  );
};

export default MultiCorrespondence;
