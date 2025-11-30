import React, { useMemo } from "react";
import CardCount from "../card";
import { StatisticsType } from "../../../service";
import { useLanguage } from "@/context/language";
import usePicklist from "@/store/picklists/use-picklist";
import { StatisticsData } from "../../../types";
import { CONST_DATA } from "@/constants/app";
import { useTheme } from "@/context/theme";
import { englishLabels } from "@/constants/app-constants/en";
import { arabicLabels } from "@/constants/app-constants/ar";
import {
  AlertOutlined,
  ArrowUpOutlined,
  DatabaseOutlined,
  RollbackOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

type Props = {
  statistics: StatisticsType[];
};

const CurrentTasks = ({ statistics }: Props) => {
  const navigate = useNavigate();
  const { labels, isEnglish } = useLanguage();
  const { theme } = useTheme();
  const { getPicklistById, picklists } = usePicklist();

  const data: StatisticsData[] = useMemo(() => {
    const outboundArr = statistics?.filter(
      (st) => st.process_type_id == CONST_DATA.Outbound_Process_Id
    );

    const inboundArr = statistics?.filter(
      (st) =>
        st.process_type_id == CONST_DATA.Route_Process_Id ||
        st.process_type_id == CONST_DATA.Inbound_Process_Id
    );
    const bearchedArr = statistics?.filter((st) => st?.is_task_breach);
    const totalCount = statistics?.reduce((sum, item) => sum + item.total, 0);
    const outboundCount = outboundArr?.reduce(
      (sum, item) => sum + item.total,
      0
    );
    const inboundCount = inboundArr?.reduce((sum, item) => sum + item.total, 0);
    const overDueCount = bearchedArr?.reduce(
      (sum, item) => sum + item.total,
      0
    );
    return [
      {
        enLabel: englishLabels.til.all,
        arLabel: arabicLabels.til.all,
        color: theme.colors.primary,
        label: labels.til.all,
        icon: <DatabaseOutlined />,
        showPercent: false,
        count: totalCount,
        dropdown: statistics?.map((s) => {
          const p = getPicklistById("Task Subject", s?.task_type_id);

          return {
            onClick: () => {
              navigate("/user/inbox", {
                state: { process_type_id: s?.process_type_id },
              });
            },
            enLabel: p?.picklist_en_label
              ? p?.picklist_en_label + " " + `(${s?.total})`
              : "",
            arLabel: p?.picklist_ar_label
              ? p?.picklist_ar_label + " " + `(${s?.total})`
              : "",
          };
        }),
      },

      {
        percent: (outboundCount / totalCount) * 100,
        color: theme.colors.accent,
        enLabel: englishLabels.til.outbound,
        arLabel: arabicLabels.til.outbound,
        showPercent: true,
        icon: <ArrowUpOutlined />,
        count: outboundArr?.reduce((sum, item) => sum + item.total, 0),
        dropdown: outboundArr?.map((s) => {
          const p = getPicklistById("Task Subject", s?.task_type_id);

          return {
            onClick: () => {
              navigate("/user/inbox", {
                state: { corr_type_id: s?.task_type_id },
              });
            },
            enLabel: p?.picklist_en_label
              ? p?.picklist_en_label + " " + `(${s?.total})`
              : "",
            arLabel: p?.picklist_ar_label
              ? p?.picklist_ar_label + " " + `(${s?.total})`
              : "",
          };
        }),
      },
      {
        color: theme.colors.success,
        enLabel: englishLabels.til.inbound,
        arLabel: arabicLabels.til.inbound,
        icon: <RollbackOutlined />,
        count: inboundCount,
        showPercent: true,
        percent: (inboundCount / totalCount) * 100,
        dropdown: inboundArr?.map((s) => {
          const p = getPicklistById("Task Subject", s?.task_type_id);

          return {
            onClick: () => {
              navigate("/user/inbox", {
                state: { process_type_id: s?.process_type_id },
              });
            },
            enLabel: p?.picklist_en_label
              ? p?.picklist_en_label + " " + `(${s?.total})`
              : "",
            arLabel: p?.picklist_ar_label
              ? p?.picklist_ar_label + " " + `(${s?.total})`
              : "",
          };
        }),
      },
      {
        color: theme.colors.danger,
        icon: <AlertOutlined />,
        showPercent: true,
        enLabel: englishLabels.lbl.over_due,
        arLabel: arabicLabels.lbl.over_due,
        count: overDueCount,
        percent: (overDueCount / totalCount) * 100,
        dropdown: bearchedArr?.map((s) => {
          const p = getPicklistById("Task Subject", s?.task_type_id);

          return {
            onClick: () => {
              navigate("/user/inbox", {
                state: { process_type_id: s?.process_type_id },
              });
            },
            enLabel: p?.picklist_en_label
              ? p?.picklist_en_label + " " + `(${s?.total})`
              : "",
            arLabel: p?.picklist_ar_label
              ? p?.picklist_ar_label + " " + `(${s?.total})`
              : "",
          };
        }),
      },
    ];
  }, [statistics, picklists]);

  return (
    <div
      style={{
        display: "grid",
        gap: 8,
        gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
        direction: isEnglish ? "ltr" : "rtl",

        width: "100%",
        flexGrow: 2,
      }}
    >
      {/* <TitleHeader
        heading={labels.til.curr}
        icon={<TableOutlined style={{ color: "#fff" }} />}
      /> */}

      {data?.map((item) => (
        <CardCount
          {...item}
          Icon={item?.icon}
          label={isEnglish ? item?.enLabel : item?.arLabel}
          key={item?.enLabel}
        />
      ))}
    </div>
  );
};

export default CurrentTasks;
