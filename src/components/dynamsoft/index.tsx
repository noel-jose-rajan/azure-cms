import { useEffect } from "react";
import DWTEditBar from "./DWTEditBar";
import DWTScan from "./DWTScan";
import DWTUploadAndSave from "./DWTUploadAndSave";
import { DwtUIOperations } from "./tools/dwtUIOperations";
import { useLanguage } from "../../context/language";

const containerId = "dwtcontrolContainer";
const dwtUtil = new DwtUIOperations(containerId);

interface Props {
  onPdfGenerate?: (blob: Blob) => any;
  onTifGenerate?: (blob: Blob) => any;
  onImageGenerate?: (blob: Blob) => any;
}

const Scanner: React.FC<Props> = ({
  onImageGenerate,
  onPdfGenerate,
  onTifGenerate,
}) => {
  const { isEnglish } = useLanguage();
  // useEffect(() => {
  //   dwtUtil.onPageInit();
  //   return () => {
  //     dwtUtil.destroy();
  //   };
  // }, []);
  useEffect(() => {
    const timer = setTimeout(() => {
      dwtUtil.onPageInit();
    }, 100); // slight delay to ensure DOM is ready

    return () => {
      clearTimeout(timer);
      dwtUtil.destroy();
    };
  }, []);
  return (
    <>
      <div className="ds-dwt-content ds-dwt-center">
        <div id="DWTcontainerTop">
          <DWTEditBar dwtUtil={dwtUtil} />
          <div id={containerId}></div>
        </div>
        <div id="ScanWrapper">
          <DWTScan dwtUtil={dwtUtil} isEnglish={isEnglish} />
          <DWTUploadAndSave
            dwtUtil={dwtUtil}
            isEnglish={isEnglish}
            onImageGenerate={onImageGenerate}
            onPdfGenerate={onPdfGenerate}
            onTifGenerate={onTifGenerate}
          />
          {/* <OutputMessage /> */}
        </div>
      </div>
    </>
  );
};

export default Scanner;
