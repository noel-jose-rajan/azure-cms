import TableComponent from "@/components/ui/table-component";
import { useLanguage } from "@/context/language";
import { FilterTaskData } from "@/pages/dashboard_new/service";
import usePicklist from "@/store/picklists/use-picklist";
import useGetAllUsers from "@/store/users/use-get-all-users";
import { Button, TableColumnsType, Tooltip } from "antd";
import moment from "moment";
import React, { useState } from "react";
import { Pagination } from "./type";
import { EyeFilled } from "@ant-design/icons";
import ButtonComponent from "@/components/ui/button";
import AssigneModal from "../filter-form/components/assigne-modal";
import GroupIcon from "@/assets/group";
import { useTheme } from "@/context/theme";
import { CONST_DATA } from "@/constants/app";

type Props = {
  data: FilterTaskData[];
  onPagination: (page: number) => Promise<void>;
  pagination: Pagination;
};
const TasksFilterTable = ({ data, onPagination, pagination }: Props) => {
  const { labels, isEnglish } = useLanguage();
  const { theme } = useTheme();
  const { getUserById } = useGetAllUsers();
  const { getPicklistById } = usePicklist();
  const [assigneId, setAssigneId] = useState<number | null>(null);

  const getProcessLabel = (id: string | number) => {
    if (id === CONST_DATA.Outbound_Process_Id) {
      return labels.til.outbound;
    } else if (
      id === CONST_DATA.Inbound_Process_Id ||
      id === CONST_DATA.Route_Process_Id
    ) {
      return labels.til.inbound;
    } else if (id === CONST_DATA.Adhoc_Process_Id) {
      return labels.til.adhoc;
    } else {
      return "-";
    }
  };
  const columns: TableColumnsType<FilterTaskData> = [
    {
      title: labels.lbl.subject,
      dataIndex: "CorrSubject",
      render: (text: string) => {
        return <span>{text || "-"}</span>;
      },
      width: 150,
      ellipsis: true,
    },

    {
      title: labels.lbl.corr_number,
      dataIndex: "CorrespondenceNo",
      render: (text: string) => {
        return <span>{text || "-"}</span>;
      },
      width: 200,
      ellipsis: true,
    },
    {
      title: labels.lbl.corr_types,
      dataIndex: "ProcessTypeID",
      render: (id: string) => {
        return <span>{getProcessLabel(id) || "-"}</span>;
      },
      width: 150,
      ellipsis: true,
    },
    {
      title: labels.lbl.task_name,
      dataIndex: "TaskTypeID",
      render: (id: string) => {
        const p = getPicklistById("Task Subject", id);
        return (
          <span>
            {(isEnglish ? p?.picklist_en_label : p?.picklist_ar_label) || "-"}
          </span>
        );
      },
      width: 150,
      ellipsis: true,
    },

    {
      title: labels.lbl.assignee,
      dataIndex: "Assignee",
      render: (id: number, record: FilterTaskData) => {
        const u = getUserById(id);

        return (
          <>
            {" "}
            {record?.IsUser ? (
              <span>
                {(record?.IsUser && (isEnglish ? u?.name_en : u?.name_ar)) ||
                  "-"}
              </span>
            ) : (
              <Tooltip
                title={
                  isEnglish ? "show assignee users" : "عرض  قائمة المُكلَّفين"
                }
              >
                <ButtonComponent
                  type="link"
                  size="small"
                  icon={
                    <GroupIcon
                      color={theme.colors.primary}
                      style={{ height: 16, width: 16 }}
                    />
                  }
                  onClick={() => setAssigneId(record?.Assignee)}
                />
              </Tooltip>
            )}
          </>
        );
      },

      width: 200,
      ellipsis: true,
    },
    {
      title: labels.lbl.acquired_date,
      dataIndex: "AcquiredDate",
      render: (date: string) => {
        return <span> {moment(date)?.format("YYYY-MM-DD hh:mm:ss a")}</span>;
      },

      width: 200,
      ellipsis: true,
    },
  ];

  return (
    <>
      <TableComponent<FilterTaskData>
        // isLoading={loading}
        columns={columns}
        dataSource={data}
        scroll={{ x: "max-content" }}
        size="small"
        style={{ marginTop: 15, width: "100%" }}
        rowKey="id"
        pagination={{
          hideOnSinglePage: true,
          pageSize: 10,
          position: ["bottomCenter"],
          size: "small",
          showSizeChanger: false,

          current: pagination.page,
          showQuickJumper: true,

          total: pagination.total,
          onChange(page: number) {
            onPagination(page);
          },
          locale: {
            jump_to: isEnglish ? "Go to" : "اذهب الى",
            page: isEnglish ? "Page" : "صفحة",
            prev_page: isEnglish ? "Previous" : "السابق",
            next_page: isEnglish ? "Next" : "التالي",
            items_per_page: isEnglish ? "/ Page" : "/ صفحة",
          },
        }}
      />
      {assigneId != null && (
        <AssigneModal onClose={() => setAssigneId(null)} id={assigneId || 0} />
      )}
    </>
  );
};

export default TasksFilterTable;
