import { DraftCorrespondenceType } from "@/components/services/outbound/types";
import { useState } from "react";
import { getOutboundDraftById } from "../../outbound/service";
import useHandleError from "@/components/hooks/useHandleError";

const useGetCorrespondenceDetails = () => {
  const { handleError } = useHandleError();
  const [loading, setLoading] = useState<boolean>(true);
  const [corrDetails, setCorrDetails] = useState<
    DraftCorrespondenceType | undefined
  >(undefined);
  const handleGetCorrespondenceDetails = async (
    id: number | string,
    errFn?: () => void
  ) => {
    try {
      setLoading(true);
      const res = await getOutboundDraftById(id + "");
      if (res) {
        setCorrDetails(res);
      }
    } catch (error) {
      if (errFn) {
        errFn();
      }
      handleError(error);
    } finally {
      setLoading(false);
    }
  };
  return { corrDetails, handleGetCorrespondenceDetails, loading };
};

export default useGetCorrespondenceDetails;
