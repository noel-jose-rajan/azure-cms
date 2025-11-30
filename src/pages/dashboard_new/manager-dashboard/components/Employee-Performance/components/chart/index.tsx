import SelectComponent from "@/components/ui/form/select";
import { useLanguage } from "@/context/language";
import { useTheme } from "@/context/theme";
import { EmployeePerformance } from "@/pages/dashboard_new/service";
import useGetAllUsers from "@/store/users/use-get-all-users";
import { useState } from "react";
import GaugeChart from "react-gauge-chart";
type Props = {
  selectedEmployeePerformance: number | null;
};
export const PerformanceChart = ({ selectedEmployeePerformance }: Props) => {
  const { theme } = useTheme();

  return (
    <div style={{ maxHeight: 200 }}>
      <GaugeChart
        id="performance-gauge"
        nrOfLevels={5}
        colors={["#EA4228", "#F5CD19", "#5BE12C"]}
        arcWidth={0.3}
        percent={selectedEmployeePerformance}
        textColor="#000"
        //   formatTextValue={() => "PERFORMANCE"}
      />
    </div>
  );
};
