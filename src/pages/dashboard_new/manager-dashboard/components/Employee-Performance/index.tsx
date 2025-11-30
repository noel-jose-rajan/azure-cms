import FadeInWrapperAnimation from "@/animations/fade-in-wrapper-animation";
import HeightAnimationWrapper from "@/animations/height-wrapper-animation";
import { useLanguage } from "@/context/language";
import {
  EmployeePerformance,
  gelAllEmployeePerformance,
} from "@/pages/dashboard_new/service";
import { BarChartOutlined, TableOutlined } from "@ant-design/icons";
import { Col, Radio } from "antd";
import { useEffect, useState } from "react";
import EmployeePerformanceTable from "./components/table";
import EmployeePerformanceCards from "./components/cards";
import { PerformanceChart } from "./components/chart";
import { useTheme } from "@/context/theme";
const EmployeePerformanceComponent = () => {
  const [employees, setEmployees] = useState<EmployeePerformance[]>([]);
  const { isEnglish } = useLanguage();
  const [mode, setMode] = useState<"table" | "card">("table");
  const [selectedEmployeePerformance, setSelectedEmployeePerformance] =
    useState<number | null>(null);
  const { theme } = useTheme();
  const fetchAllEmployeePerformance = async () => {
    const res = await gelAllEmployeePerformance();
    if (res) {
      setEmployees(res);
    }
  };

  useEffect(() => {
    fetchAllEmployeePerformance();
  }, []);

  return (
    <div>
      {/* <Col
        style={{
          display: "flex",
          justifyContent: !isEnglish ? "flex-end" : "flex-start",
          marginRight: 10,
          marginBlock: 10,
          }}
          >
          <Radio.Group
          defaultValue={mode}
          buttonStyle="solid"
          onChange={(e) => {
            setMode(e.target.value);
            localStorage.setItem("inbox-view-mode", e.target.value);
            }}
            >
            <Radio.Button value={"table"}>
            <TableOutlined style={{ marginInline: 10 }} />
            {isEnglish ? "Table" : "جدول"}
          </Radio.Button>
          <Radio.Button value={"card"}>
            <BarChartOutlined style={{ marginInline: 10 }} />
            {isEnglish ? "card" : "بطاقة"}
            </Radio.Button>
        </Radio.Group>
        </Col> */}

      <HeightAnimationWrapper>
        {mode === "table" ? (
          <FadeInWrapperAnimation
            key={"EmployeePerformanceTable"}
            enableScaleAnimation={false}
            animateDelay={0.2}
            style={{
              display: "flex",
              flexWrap: "wrap",
              width: "100%",
              alignItems: "center",
              direction: isEnglish ? "ltr" : "rtl",
              // background: theme.colors.backgroundText,
              padding: 12,
            }}
          >
            <Col xs={24} lg={16}>
              <EmployeePerformanceTable
                data={employees}
                onSelectChange={(n) => setSelectedEmployeePerformance(n)}
              />
            </Col>
            <Col xs={24} lg={8}>
              <PerformanceChart
                selectedEmployeePerformance={selectedEmployeePerformance}
              />
            </Col>
          </FadeInWrapperAnimation>
        ) : (
          <FadeInWrapperAnimation
            enableScaleAnimation={false}
            animateDelay={0.2}
            key={"EmployeePerformanceCards"}
          >
            <EmployeePerformanceCards users={employees} />
          </FadeInWrapperAnimation>
        )}
      </HeightAnimationWrapper>
    </div>
  );
};

export default EmployeePerformanceComponent;
