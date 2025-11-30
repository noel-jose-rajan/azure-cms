import TitleHeader from "@/components/ui/header";
import { LineChartOutlined } from "@ant-design/icons";
import CurrentTasks from "./components/current-tasks";
import { useLanguage } from "@/context/language";
import UserPerformance from "./components/user-performance";
import { Performance, StatisticsType } from "../service";

type Props = {
  statistics: StatisticsType[];
  performance: Performance | null;
};
const UserDashboard = ({ performance, statistics }: Props) => {
  const { labels } = useLanguage();
  return (
    <>
      <TitleHeader
        style={{ marginBottom: 20 }}
        heading={labels.lbl.currnet_tasks_st}
        icon={<LineChartOutlined style={{ color: "#fff" }} />}
      />

      <CurrentTasks statistics={statistics} />
      <TitleHeader
        style={{ marginBottom: 20 }}
        heading={labels.til.performance}
        icon={<LineChartOutlined style={{ color: "#fff" }} />}
      />
      <UserPerformance performance={performance} />
    </>
  );
};

export default UserDashboard;
