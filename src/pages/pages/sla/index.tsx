import { useEffect, useState } from "react";
import { fetchSlaList, SlaType } from "../service";
import { useLanguage } from "@/context/language";
import TitleBar from "@/components/ui/bar/title-bar";
import FadeInWrapperAnimation from "@/animations/fade-in-wrapper-animation";
import SlaTable from "./components/table";
import LoaderComponent from "@/components/ui/loader";
import useHandleError from "@/components/hooks/useHandleError";

const SLA = () => {
  const { handleError } = useHandleError();
  const [fullPageLoading, setFullPageLoading] = useState(true);
  const [list, setList] = useState<SlaType[]>([]);
  const { labels } = useLanguage();
  const getList = async () => {
    try {
      const res = await fetchSlaList();
      if (res) {
        setList(res);
      }
    } catch (e) {
      handleError(e);
    } finally {
      setFullPageLoading(false);
    }
  };

  useEffect(() => {
    getList();
  }, []);
  return (
    <>
      {fullPageLoading ? (
        <LoaderComponent loading={true} delay={0} fullscreen={false} />
      ) : (
        <FadeInWrapperAnimation
          enableScaleAnimation={false}
          animateDuration={0.75}
        >
          <TitleBar headerText={labels.mnu.sla} />
          <SlaTable list={list} getList={getList} />
        </FadeInWrapperAnimation>
      )}
    </>
  );
};

export default SLA;
