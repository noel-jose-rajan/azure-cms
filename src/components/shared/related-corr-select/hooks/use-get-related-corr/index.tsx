import React, { useEffect } from "react";
import { getRelatedCorrespondence } from "../../service";
import { RelatedCorr } from "@/components/services/outbound/types";

const useGetRelatedCorr = (id: string | number) => {
  const [relatedCorrs, setRelatedCorrs] = React.useState<RelatedCorr[]>([]);
  const [refresh, setRefresh] = React.useState(false);
  const [loading, setLoading] = React.useState<boolean>(false);
  const handleGetRelatedCorr = async () => {
    setLoading(true);
    try {
      const response = await getRelatedCorrespondence(id);
      setRelatedCorrs(response);
    } catch (error) {
      console.error("Error fetching related correspondence:", error);
    } finally {
      setLoading(false);
      setRefresh(false);
    }
  };

  const refreshRelatedCorrs = () => {
    setRefresh(true);
  };

  useEffect(() => {
    if (!id && refresh) return;
    handleGetRelatedCorr();
  }, [id, refresh]);

  return { relatedCorrs, loading, refreshRelatedCorrs };
};

export default useGetRelatedCorr;
