import { Row, TableColumnsType } from "antd";
import { useEffect, useState } from "react";
import { useLanguage } from "../../../../context/language";
import { useTheme } from "../../../../context/theme";
import {
  getTaskHistory,
  TaskHistory,
} from "@/components/shared/actions/service";
import moment from "moment";
import useGetAllUsers from "@/store/users/use-get-all-users";
import usePicklist from "@/store/picklists/use-picklist";
import useHandleError from "@/components/hooks/useHandleError";
import TableComponent from "@/components/ui/table-component";

interface CorrespondenceHistoryProps {
  corrId: string | number;
}

export default function CorrespondenceHistory({
  corrId,
}: CorrespondenceHistoryProps) {
  const [history, setHistory] = useState<TaskHistory[]>([]);
  const { labels, isEnglish } = useLanguage();
  const { theme } = useTheme();
  const [loading, setLoading] = useState<boolean>(false);
  const { handleError } = useHandleError();
  const { getPicklistById } = usePicklist();
  const { getUserById } = useGetAllUsers();
  useEffect(() => {
    if (corrId) {
      fetchCorrespondenceHistory();
    }
  }, [corrId]);

  const fetchCorrespondenceHistory = async () => {
    try {
      setLoading(true);
      const res = await getTaskHistory(corrId);
      if (res) {
        setHistory(res || []);
      }
    } catch (error) {
      handleError(error);
      setHistory([]);
    } finally {
      setLoading(false);
    }
  };
  const columns: TableColumnsType<TaskHistory> = [
    {
      width: 200,
      title: labels.tbl.performer_username,
      dataIndex: "perfomer_id",
      render: (id: number) => {
        const user = getUserById(id);

        return (
          <span style={{ color: theme.colors.primary }}>
            {(isEnglish ? user?.name_en : user?.name_ar) || "-"}
          </span>
        );
      },
      // sorter: {
      //   compare: (a, b) =>
      //     b.fromUser.toLowerCase().localeCompare(a.fromUser.toLowerCase()),
      //   multiple: 3,
      // },
    },
    {
      title: labels.tbl.action_date,
      dataIndex: "created_at",
      width: 200,

      render: (text: string) => (
        <span style={{ color: theme.colors.primary }}>
          {moment(text).format("YYYY-MM-DD hh:mm:ss a") ?? "-"}
        </span>
      ),
      // sorter: {
      //   compare: (a, b) => b.dueDate.localeCompare(a.dueDate),
      //   multiple: 3,
      // },
    },
    {
      title: labels.tbl.performer_comment,
      dataIndex: "comments",
      width: 200,
      ellipsis: true,
      render: (text: string) => (
        <span style={{ color: theme.colors.primary }}>{text || "-"}</span>
      ),
      // sorter: {
      //   compare: (a, b) => b.comments.localeCompare(a.comments),
      //   multiple: 3,
      // },
    },
    {
      title: labels.tbl.performer_action,
      dataIndex: "action_id",
      width: 100,

      render: (text) => {
        const p = getPicklistById("ACTIONS", text);

        return (
          <span style={{ color: theme.colors.primary }}>
            {(isEnglish ? p?.picklist_en_label : p?.picklist_ar_label) ?? "-"}
          </span>
        );
        // sorter: {
        //   compare: (a, b) => b.action.localeCompare(a.action),
        //   multiple: 3,
        // },
      },
    },
  ];

  return (
    <Row style={{ padding: 10 }}>
      <TableComponent<TaskHistory>
        showSorterTooltip
        sortDirections={["ascend", "descend"]}
        columns={columns}
        dataSource={history}
        style={{ marginTop: 15, width: "100%" }}
        isLoading={loading}
        rowKey="corrId"
        scroll={{ x: "max-content" }}
      />
    </Row>
  );
}
