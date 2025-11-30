import { useEffect, useState } from "react";
import { useLanguage } from "../../../../context/language";
import { useTheme } from "../../../../context/theme";
import { TableColumnsType } from "antd";
import { DateHelper } from "../../../../components/functional/date";
import {
  FollowUpType,
  getCorrespondenceFollowUp,
} from "@/components/services/inbox";
import TableComponent from "@/components/ui/table-component";
import usePicklist from "@/store/picklists/use-picklist";
import moment from "moment";

interface FollowUpProps {
  corrID?: string | number;
}

export default function FollowUp({ corrID }: FollowUpProps) {
  const { labels, isEnglish } = useLanguage();
  const { theme } = useTheme();
  const { getPicklistById } = usePicklist();
  const [followUpCorrespondence, setFollowUpCorrespondence] = useState<
    FollowUpType[]
  >([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (corrID) {
      getRelatedCorrespondence();
    }
  }, []);

  const getRelatedCorrespondence = async () => {
    if (!corrID) return;

    setLoading(true);
    const response = await getCorrespondenceFollowUp(corrID);

    if (response) {
      setFollowUpCorrespondence(response);
    }

    setLoading(false);
  };

  const columns: TableColumnsType<FollowUpType> = [
    {
      width: 150,
      ellipsis: true,

      title: labels.lbl.task_name,
      dataIndex: "task_type_id",
      render: (text: string) => {
        const p = getPicklistById("Task Subject", text);
        return (
          <span style={{ color: theme.colors.primary }}>
            {(isEnglish ? p?.picklist_en_label : p?.picklist_ar_label) ?? "-"}
          </span>
        );
      },
      // sorter: {
      //   compare: (a, b) =>
      //     b.taskTitle.toLowerCase().localeCompare(a.taskTitle.toLowerCase()),
      //   multiple: 3,
      // },
    },
    {
      width: 200,

      title: labels.tbl.sent_date,
      dataIndex: "task_date",
      render: (text: string) => (
        <span style={{ color: theme.colors.primary }}>
          {moment(text).format("YYYY-MM-DD hh:mm:ss a") ?? "-"}
        </span>
      ),
      sorter: {
        compare: (a, b) => b.task_date.localeCompare(a.task_date),
        multiple: 3,
      },
    },
    {
      width: 150,
      ellipsis: true,
      title: labels.tbl.sender_name,
      dataIndex: "from_user_name",
      render: (text: string) => (
        <span style={{ color: theme.colors.primary }}>{text ?? "-"}</span>
      ),
      sorter: {
        compare: (a, b) => b.from_user_name.localeCompare(a.from_user_name),
        multiple: 3,
      },
    },
    {
      width: 300,
      ellipsis: true,
      title: labels.tbl.currentPerformer,
      dataIndex: "assignee_name",
      render: (text: string) => (
        <span style={{ color: theme.colors.primary }}>{text ?? "-"}</span>
      ),
      // sorter: {
      //   compare: (a, b) => b.assignee_name.localeCompare(a.assignee_name),
      //   multiple: 3,
      // },
    },

    {
      width: 200,
      ellipsis: true,
      title: labels.lbl.task_due_date,
      dataIndex: "task_due_date",
      render: (text: string) => (
        <span
          style={{
            color: DateHelper.checkDateIsFuture(text)
              ? theme.colors.danger
              : theme.colors.success,
          }}
        >
          {moment(text).format("YYYY-MM-DD hh:mm:ss a") ?? "-"}
        </span>
      ),
      sorter: {
        compare: (a, b) => b.task_due_date.localeCompare(a.task_due_date),
        multiple: 3,
      },
    },
    // {
    //   width: 150,
    //   ellipsis: true,
    //   title: labels.lbl.status,
    //   dataIndex: "process_type_id",
    //   render: (text: string) => {
    //     const p = getPicklistById("PROCESS_TYPE", text);
    //     return (
    //       <a style={{ color: theme.colors.primary }}>
    //         {(isEnglish ? p?.picklist_en_label : p?.picklist_ar_label) ?? "-"}
    //       </a>
    //     );
    //   },
    // },
  ];

  return (
    <TableComponent<FollowUpType>
      showSorterTooltip
      sortDirections={["ascend", "descend"]}
      columns={columns}
      dataSource={followUpCorrespondence}
      style={{ marginTop: 15, width: "100%" }}
      loading={loading}
      rowKey="corrId"
      scroll={{ x: "max-content" }}
    />
  );
}
