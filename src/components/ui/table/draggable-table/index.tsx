// Import necessary libraries
import React, { useState, useEffect } from "react";
import { PaginationProps, Table } from "antd";
import type { ColumnsType } from "antd/es/table";

// Define types for the data
interface TableDataType {
  key: string;
  [key: string]: any;
}

export interface CustomColumn<T> {
  field: string;
  headerName: string;
  width?: number;
  editable?: boolean;
  sortable?: boolean;
  renderCell?: (row: T) => React.ReactNode;
}

interface CustomTableProps {
  data?: TableDataType[];
  columns?: CustomColumn<any>[];
  onChange?: (data: any[]) => any;
  paginationProps: PaginationProps;
  draggable?: boolean;
}

const DraggableTable: React.FC<CustomTableProps> = ({
  data = [],
  columns = [],
  onChange,
  paginationProps,
  draggable,
}) => {
  const [dataSource, setDataSource] = useState<TableDataType[]>([]);

  useEffect(() => {
    setDataSource(data);
  }, [data]);

  // Handle drag start
  const onDragStart = (
    e: React.DragEvent<HTMLTableRowElement>,
    index: number | undefined
  ) => {
    if (!draggable) return;
    if (index === undefined) return;
    e.dataTransfer.setData("dragIndex", index.toString());
  };

  // Handle drop
  const onDrop = (
    e: React.DragEvent<HTMLTableRowElement>,
    dropIndex: number | undefined
  ) => {
    if (!draggable) return;
    if (dropIndex === undefined) return;
    if (dropIndex === 0) return;

    const dragIndex = parseInt(e.dataTransfer.getData("dragIndex"), 10);

    if (dragIndex === dropIndex) return;

    const updatedData = [...dataSource];
    const [draggedRow] = updatedData.splice(dragIndex, 1);
    updatedData.splice(dropIndex, 0, draggedRow);

    setDataSource(updatedData);
    onChange && onChange(updatedData);
  };

  // Custom row renderer to add draggable props
  const DraggableRow: React.FC<{
    index: number | undefined;
    draggable: boolean;
  }> = ({ index, draggable, ...props }) => {
    return (
      <tr
        {...props}
        draggable={draggable}
        onDragStart={(e) => onDragStart(e, index)}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => onDrop(e, index)}
        style={{ cursor: draggable ? "move" : "pointer" }}
      />
    );
  };

  // Convert custom columns to Ant Design compatible columns
  const antColumns: ColumnsType<TableDataType> = columns.map((col) => ({
    title: col.headerName,
    dataIndex: col.field,
    key: col.field,
    width: col.width,
    sorter: col.sortable
      ? (a, b) => {
          if (
            typeof a[col.field] === "number" &&
            typeof b[col.field] === "number"
          ) {
            return a[col.field] - b[col.field];
          }
          return String(a[col.field]).localeCompare(String(b[col.field]));
        }
      : undefined,
    render: col.renderCell ? (_, row) => col.renderCell!(row) : undefined,
  }));

  return (
    <Table
      dataSource={dataSource}
      columns={antColumns}
      pagination={paginationProps}
      scroll={{ x: "max-content" }}
      components={{
        body: {
          row: (props: any) => {
            const rowKey = props["data-row-key"];
            const index = rowKey
              ? dataSource.findIndex((item) => item.key === rowKey)
              : undefined;

            const rowData = rowKey
              ? dataSource.find((item) => item.key === rowKey)
              : undefined;

            return (
              <DraggableRow
                {...props}
                index={index}
                draggable={rowData && rowData.order === "1" ? false : draggable}
                style={{
                  cursor:
                    draggable && index !== 0
                      ? "move"
                      : draggable
                      ? "not-allowed"
                      : "pointer",
                }}
              />
            );
          },
        },
      }}
    />
  );
};

export default DraggableTable;
