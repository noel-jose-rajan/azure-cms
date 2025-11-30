import { useEffect } from 'react';
import DWTEditBar from './DWTEditBar';
import DWTScan from './DWTScan';
import DWTUploadAndSave from './DWTUploadAndSave';
import { DwtUIOperations } from './tools/dwtUIOperations';

const containerId = 'dwtcontrolContainer';
const dwtUtil = new DwtUIOperations(containerId);

const Dwt = () => {
  useEffect(() => {
    dwtUtil.onPageInit();
    return () => {
      dwtUtil.destroy();
    };
  }, []);

  return (
    <>
      <div className="ds-dwt-content ds-dwt-center">
        <div className="ds-dwt-header">
          <h1>Scan and upload documents in browsers</h1>
        </div>
      </div>
      <div className="ds-dwt-content ds-dwt-center">
        <div id="DWTcontainerTop">
          <DWTEditBar dwtUtil={dwtUtil} />
          <div id={containerId}></div>
        </div>
        <div id="ScanWrapper">
          <DWTScan dwtUtil={dwtUtil} />
          <DWTUploadAndSave dwtUtil={dwtUtil} />
          {/* <OutputMessage /> */}
        </div>
      </div>
    </>
  );
};

export default Dwt;