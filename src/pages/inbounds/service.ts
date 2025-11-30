import { ServiceResult } from "../../components/functional/httphelper";
import ENV from "../../constants/env";
import LOCALSTORAGE from "../../constants/local-storage";
import Storage from "../../lib/storage";

export const downloadCorrespondenceDoc = async (corrId: string) => {
  try {
    let token = Storage.getItem(LOCALSTORAGE.LEGACY_ACCESS_TOKEN);

    const response = await fetch(
      ENV.API_URL_LEGACY +
        `/correspodence/download?corrId=${corrId}&access_token=${token}`,
      {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    if (!response.ok) {
      return ServiceResult.failed(null, "Something went wrong");
    }
    const blob = await response.blob();

    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = corrId + "_corrId_inbound_document.tif";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    return ServiceResult.success({}, "Api call successfully completed");
  } catch (error) {
    return ServiceResult.failed(null, "Something went wrong");
  }
};
