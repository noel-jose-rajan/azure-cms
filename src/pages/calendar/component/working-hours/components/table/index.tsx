import { WorkingDay } from "@/components/services/calendar";
import TableComponent from "@/components/ui/table-component";
import { calandarArr } from "@/constants/app/calander";
import { useLanguage } from "@/context/language";
import { TableColumnsType } from "antd";
import dayjs from "dayjs";

type Props = {
  workingHours: WorkingDay[];
  loading: boolean;
};
const WorkingHoursTable = ({ workingHours, loading }: Props) => {
  const { labels, isEnglish } = useLanguage();

  const columns: TableColumnsType<WorkingDay> = [
    {
      title: labels.lbl.day,
      dataIndex: "day_id",
      render: (id: number) => {
        const day = calandarArr.find((d) => d.id == id);
        return <span>{isEnglish ? day?.enLabel : day?.arLabel}</span>;
      },
      width: 300,
      ellipsis: true,
    },
    {
      title: labels.lbl.time_start,
      dataIndex: "time_from",
      render: (_text: string) => {
        const time = dayjs(`2000-01-01T${_text}`);

        return (
          <span>
            {time.isValid() ? time.format("hh:mm A") : "Invalid time"}
          </span>
        );
      },
      width: 200,
    },
    {
      title: labels.lbl.end_time,
      dataIndex: "time_to",
      render: (_text: string) => {
        const time = dayjs(`2000-01-01T${_text}`);
        return (
          <span>
            {time.isValid() ? time.format("hh:mm A") : "Invalid time"}
          </span>
        );
      },
      width: 200,
    },
  ];
  return (
    <TableComponent<WorkingDay>
      sortDirections={["ascend", "descend"]}
      columns={columns}
      dataSource={workingHours}
      scroll={{ x: "max-content" }}
      size="small"
      style={{ marginTop: 15, width: "100%" }}
      rowKey="id"
      isLoading={loading}
    />
  );
};

export default WorkingHoursTable;
