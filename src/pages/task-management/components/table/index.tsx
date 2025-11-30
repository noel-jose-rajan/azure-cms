import React, { useState } from "react";
import { SearchTaskManagementType } from "../../schema";
import { Col, TableColumnsType, TableProps } from "antd";
import { useLanguage } from "@/context/language";
import { useTheme } from "@/context/theme";
import TableComponent from "@/components/ui/table-component";
import ActionMenuItem from "@/components/ui/menu-item";
import moment from "moment";
import AssignUsersModal from "../assign-to-user-modal";

const TaskManagementTable = () => {
  const { labels, isEnglish } = useLanguage();
  const { theme } = useTheme();
  const [openAssignModal, setOpenAssignModal] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [selectedRow, setSelectedRow] = useState<SearchTaskManagementType[]>(
    []
  );
  const rowSelection: TableProps<SearchTaskManagementType>["rowSelection"] = {
    columnWidth: 30,
    type: "radio",
    selectedRowKeys,
    onChange: (
      _selectedRowKeys: React.Key[],
      _selectedRows: SearchTaskManagementType[]
    ) => {
      setSelectedRowKeys(_selectedRowKeys);
      setSelectedRow(_selectedRows);
    },
  };

  const columns: TableColumnsType<SearchTaskManagementType> = [
    {
      width: 100,
      title: labels.lbl.task_name,
      dataIndex: "taskName",

      render: (text: string) => (
        <a style={{ color: theme.colors.primary }}>{text}</a>
      ),
      //   sorter: {
      //     compare: (a, b) =>
      //       (b.delegateFrom ?? "")?.localeCompare(a.delegateFrom ?? ""),
      //     multiple: 3,
      //   },
    },

    {
      width: 150,
      title: labels.lbl.current_user,

      dataIndex: "currentUser",
      render: (text: string) => (
        <a style={{ color: theme.colors.primary }}>{text}</a>
      ),
      //   sorter: {
      //     compare: (a, b) =>
      //       (b.delegateFrom ?? "")?.localeCompare(a.delegateFrom ?? ""),
      //     multiple: 3,
      //   },
    },
    {
      width: 150,
      title: labels.lbl.task_start_date,
      dataIndex: "from",
      render: (text: string) => (
        <a style={{ color: theme.colors.primary }}>{text}</a>
      ),
      sorter: {
        compare: (a, b) => b.taskDueDate.localeCompare(a.taskDueDate),
        multiple: 3,
      },
    },
    {
      width: 150,
      title: labels.lbl.task_due_date,
      dataIndex: "taskDueDate",
      render: (text: string) => {
        const isPast = moment(text, "DD/MM/YYYY").isBefore(moment(), "day");
        return <a style={{ color: isPast ? "#e74c3c" : "#27ae60" }}>{text}</a>;
      },
      sorter: {
        compare: (a, b) => b.taskDueDate.localeCompare(a.taskDueDate),
        multiple: 3,
      },
    },
    {
      width: 150,
      title: labels.lbl.postponedToDate,
      dataIndex: "postponedToDate",
      render: (text: string) => {
        return <a style={{ color: theme.colors.primary }}>{text ?? "-"}</a>;
      },
      sorter: {
        compare: (a, b) =>
          (b.postponedToDate ?? "")?.localeCompare(a.postponedToDate ?? ""),
        multiple: 3,
      },
    },
    {
      width: 150,
      title: labels.lbl.is_delegated_before,
      dataIndex: "isDelegatedBefore",
      render: (text: string) => (
        <a style={{ color: theme.colors.primary }}>{text ?? "-"}</a>
      ),
      //   sorter: {
      //     compare: (a, b) => (b.status ?? "")?.localeCompare(a.status ?? ""),
      //     multiple: 3,
      //   },
    },
    {
      width: 150,
      title: labels.lbl.is_postponed_before,
      dataIndex: "isPostponedBefore",
      render: (text: string) => (
        <a style={{ color: theme.colors.primary }}>{text ?? "-"}</a>
      ),
      //   sorter: {
      //     compare: (a, b) => (b.status ?? "")?.localeCompare(a.status ?? ""),
      //     multiple: 3,
      //   },
    },
    {
      width: 180,

      title: labels.lbl.postponedEndDate,
      dataIndex: "postponedEndDate",
      render: (text: string) => (
        <a style={{ color: theme.colors.primary }}>{text ?? "-"}</a>
      ),
      sorter: {
        compare: (a, b) =>
          (b.postponedEndDate ?? "")?.localeCompare(a.postponedEndDate ?? ""),
        multiple: 3,
      },
    },
  ];

  const data: SearchTaskManagementType[] = [
    {
      id: 1,
      taskName: "مراجعة صادر",
      currentUser: "GM Manager AR",
      from: "15/07/2025",
      taskDueDate: "22/07/2025",
      postponedToDate: "30/07/2025",
      isDelegatedBefore: "لا",
      isPostponedBefore: "نعم",
      postponedEndDate: "",
    },
    {
      id: 2,
      taskName: "اعتماد صادر",
      currentUser: "GM Manager AR",
      from: "10/07/2025",
      taskDueDate: "18/07/2025",
      postponedToDate: "",
      isDelegatedBefore: "لا",
      isPostponedBefore: "لا",
      postponedEndDate: "",
    },
  ] as unknown as SearchTaskManagementType[];
  return (
    <Col
      style={{
        borderRadius: "2px",
        marginTop: 20,
        border: "1px solid #cbcbcb",
      }}
    >
      <Col
        style={{
          flexDirection: isEnglish ? "row" : "row-reverse",
          display: "flex",
          flexWrap: "wrap",
        }}
      >
        <ActionMenuItem
          onClick={() => console.log("Edit action")}
          isActive={selectedRowKeys.length === 1}
          label={isEnglish ? "postpone" : "تاجيل"}
          type="history"
        />
        <ActionMenuItem
          onClick={() => console.log("Edit action")}
          isActive={selectedRowKeys.length === 1}
          label={isEnglish ? "end postponement" : "إنهاء التأجيل"}
          type="deactivate"
        />
        <ActionMenuItem
          onClick={() => {
            setOpenAssignModal(true);
          }}
          isActive={selectedRowKeys.length === 1}
          label={isEnglish ? "delegate to another user" : "تحويل لمستخدم آخر "}
          type="eye"
        />
      </Col>
      <TableComponent<SearchTaskManagementType>
        rowSelection={rowSelection}
        sortDirections={["ascend", "descend"]}
        columns={columns}
        dataSource={data}
        rowKey="id"
        scroll={{ x: "max-content" }}
      />

      {openAssignModal && (
        <AssignUsersModal onCancel={() => setOpenAssignModal(false)} />
      )}
    </Col>
  );
};

export default TaskManagementTable;
