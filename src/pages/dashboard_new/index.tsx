import { useLanguage } from "@/context/language";
import { useEffect, useState } from "react";
import {
  getCurrentTasksStatistics,
  getUserPerformance,
  hasOrgUnits,
  Performance,
  StatisticsType,
} from "./service";
import useHandleError from "@/components/hooks/useHandleError";
import LoaderComponent from "@/components/ui/loader";
import { Space, Switch, Tooltip } from "antd";
import { UserOutlined, TeamOutlined } from "@ant-design/icons";
import UserDashboard from "./user-dashboard";
import { useAuth } from "@/context/auth";
import ManagerDashboard from "./manager-dashboard";
import FadeInWrapperAnimation from "@/animations/fade-in-wrapper-animation";
const Dashboard = () => {
  const { isAuthenticated } = useAuth();
  const [isManager, setIsManager] = useState(false);
  const { handleError } = useHandleError();
  const { isEnglish } = useLanguage();
  const [statistics, setStatistics] = useState<StatisticsType[]>([]);
  const [performance, setPerformance] = useState<Performance | null>(null);
  const [loading, setLoading] = useState(true);
  const [orgs, setOrgs] = useState<number[] | null>(null);
  const fetchCurrentTasksStatistics = async () => {
    try {
      const res = await getCurrentTasksStatistics();
      if (res) {
        setStatistics(res);
      }
    } catch (e) {
      handleError(e);
    } finally {
    }
  };

  const fetchPerformance = async () => {
    const res = await getUserPerformance();
    if (res) {
      setPerformance(res);
    }
  };

  const IsUserAManager = async () => {
    const res = await hasOrgUnits();

    if (res) {
      setOrgs(res);
    } else {
      setOrgs(null);
    }
  };

  const init = async () => {
    try {
      await Promise.all([
        fetchCurrentTasksStatistics(),
        fetchPerformance(),
        IsUserAManager(),
      ]);
    } catch (e) {
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setOrgs(null);
    setStatistics([]);
    setPerformance(null);
  };

  useEffect(() => {
    if (isAuthenticated) {
      init();
    } else {
      reset();
    }
  }, [isAuthenticated]);
  console.log({ orgs });

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: isEnglish ? "flex-start" : "flex-end",
      }}
    >
      {loading ? (
        <LoaderComponent loading={true} delay={0} fullscreen={false} />
      ) : (
        <>
          {/* <TitleBar headerText={labels.mnu.dashboard} /> */}
          {orgs && orgs?.length > 0 && (
            <Space>
              <Tooltip
                title={
                  isEnglish ? "user dashboard" : "لوحة التحكم الخاصة بالمستخدم"
                }
              >
                <UserOutlined />
              </Tooltip>
              <Switch
                checked={isManager}
                onChange={setIsManager}
                checkedChildren={<TeamOutlined />}
                unCheckedChildren={<UserOutlined />}
              />
              <Tooltip
                title={
                  isEnglish ? "manager dashboard" : "لوحة التحكم الخاصة بالمدير"
                }
              >
                <TeamOutlined />
              </Tooltip>
            </Space>
          )}

          {!isManager ? (
            <FadeInWrapperAnimation
              enableScaleAnimation={false}
              animateDelay={0.1}
              key="UserDashboard"
              style={{ width: "100%" }}
            >
              <UserDashboard
                statistics={statistics}
                performance={performance}
              />
            </FadeInWrapperAnimation>
          ) : (
            <FadeInWrapperAnimation
              enableScaleAnimation={false}
              animateDelay={0.5}
              key="ManagerDashboard"
              style={{ width: "100%" }}
            >
              <ManagerDashboard orgs={orgs || []} />
            </FadeInWrapperAnimation>
          )}
        </>
      )}
    </div>
  );
};

export default Dashboard;
