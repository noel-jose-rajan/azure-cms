import SelectComponent from "@/components/ui/form/select";
import { useLanguage } from "@/context/language";
import { useTheme } from "@/context/theme";
import { EmployeePerformance } from "@/pages/dashboard_new/service";
import CardCount from "@/pages/dashboard_new/user-dashboard/components/card";
import useGetAllUsers from "@/store/users/use-get-all-users";
import {
  AlertOutlined,
  AreaChartOutlined,
  DatabaseOutlined,
} from "@ant-design/icons";
import { Col } from "antd";
import { useState } from "react";

type Props = {
  users: EmployeePerformance[];
};
const EmployeePerformanceCards = ({ users = [] }: Props) => {
  const { theme } = useTheme();
  const { labels, isEnglish } = useLanguage();
  const { getUserById } = useGetAllUsers();
  const [selectedUser, setSelectedUser] = useState<number | null>(
    users[0]?.assignee || null
  );

  const orgsOptions = users
    ?.map((u) => getUserById(u.assignee))
    ?.map((u) => ({
      label: isEnglish ? u?.name_en : u?.name_ar,
      value: u?.id,
    }));

  const selectedUserData = users?.find((u) => u?.assignee == selectedUser);
  return (
    <div style={{ direction: isEnglish ? "ltr" : "rtl", width: "100%" }}>
      <Col xs={24} md={12} lg={8} style={{ marginBlock: 4 }}>
        <SelectComponent
          key={isEnglish + ""}
          options={orgsOptions}
          defaultValue={orgsOptions[0]}
          label={labels.lbl.user}
          allowClear
          value={selectedUser}
          onChange={(val) => setSelectedUser(val)}
        />
      </Col>
      {selectedUser && (
        <div
          style={{
            display: "grid",
            gap: 8,
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            direction: isEnglish ? "ltr" : "rtl",
            width: "100%",
          }}
        >
          <CardCount
            key={selectedUser || "0"}
            count={selectedUserData?.kpi || 0}
            label={labels.til.performance}
            color={theme.colors.accent}
            isPercent
            Icon={<AreaChartOutlined />}
          />

          <CardCount
            count={selectedUserData?.total || 0}
            label={labels.lbl.total_num_tasks}
            color={theme.colors.primary}
            Icon={<DatabaseOutlined />}
          />

          <CardCount
            count={selectedUserData?.total_breach || 0}
            label={labels.lbl.total_Breached}
            color={theme.colors.danger}
            Icon={<AlertOutlined />}
          />
        </div>
      )}
    </div>
  );
};

export default EmployeePerformanceCards;
