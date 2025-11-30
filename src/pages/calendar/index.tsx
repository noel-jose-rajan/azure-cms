import TitleBar from "../../components/ui/bar/title-bar";
import WorkingDaysTimePicker from "./component/working-hours";
import { useLanguage } from "@/context/language";
import HolidaysTable from "./component/holidays/table";
import FadeInWrapperAnimation from "@/animations/fade-in-wrapper-animation";

export default function Calendar() {
  const {
    labels: { mnu },
  } = useLanguage();

  return (
    <FadeInWrapperAnimation enableScaleAnimation={false} animateDuration={0.75}>
      <TitleBar headerText={mnu.calendar} />
      <WorkingDaysTimePicker />
      <HolidaysTable />
    </FadeInWrapperAnimation>
  );
}
