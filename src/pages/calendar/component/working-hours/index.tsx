import { useEffect, useState } from "react";
import WorkingHoursTable from "./components/table";
import EditWorkingHoursModal from "./components/edit-modal";
import ActionMenuItem from "@/components/ui/menu-item";
import { useLanguage } from "@/context/language";
import TitleHeader from "@/components/ui/header";
import { PrinterOutlined } from "@ant-design/icons";
import { useTheme } from "@/context/theme";
import { getWorkingHours, WorkingDay } from "@/components/services/calendar";
import { calandarArr } from "@/constants/app/calander";

export default function WorkingDaysTimePicker() {
  const { isEnglish, labels } = useLanguage();
  const { theme } = useTheme();
  const [open, setOpen] = useState(false);
  const [workingHours, setWorkingHours] = useState<WorkingDay[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshCount, setRefreshCount] = useState(0);
  const getAllWorkingHours = async () => {
    try {
      setLoading(true);
      const res = await getWorkingHours();

      if (res) {
        setWorkingHours(res);
      }
    } catch (e) {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllWorkingHours();
  }, [refreshCount]);

  const getMergedWorkingDays = () => {
    return calandarArr.map((d) => {
      const match = workingHours?.find((w) => w.day_id === d.id);
      return {
        day_id: d.id,
        time_from: match?.time_from || "",
        time_to: match?.time_to || "",
        arLabel: d.arLabel,
        enLabel: d.enLabel,
      };
    });
  };

  const checkIsTheSameStartAndEndDate = () =>
    workingHours?.every((day, _, arr) => {
      return (
        day.time_from === arr[0]?.time_from && day.time_to === arr[0].time_to
      );
    });

  return (
    <div>
      <TitleHeader
        heading={labels.til.choose_weekend_days}
        icon={
          <PrinterOutlined style={{ color: theme.colors.backgroundText }} />
        }
      />
      {open && (
        <EditWorkingHoursModal
          onClose={() => setOpen(false)}
          initialworkingDays={getMergedWorkingDays()}
          refreshDays={() => setRefreshCount((c) => c + 1)}
          defaultRadioValue={checkIsTheSameStartAndEndDate() ? 2 : 1}
          defaultWorkingHours={workingHours}
        />
      )}

      <div
        style={{ display: "flex", justifyContent: isEnglish ? "start" : "end" }}
      >
        <ActionMenuItem
          isActive
          type="edit"
          label={labels.btn.edit}
          onClick={() => setOpen(true)}
        />
      </div>
      <WorkingHoursTable loading={loading} workingHours={workingHours} />
    </div>
  );
}
