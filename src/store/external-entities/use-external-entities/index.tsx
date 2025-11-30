import { useEffect } from "react";
import { useExternalEntitesStore } from "../external-entities.store";

const useExternalEntities = () => {
  const { fetchAllExternalEntites, ...data } = useExternalEntitesStore();
  useEffect(() => {
    fetchAllExternalEntites();
  }, [fetchAllExternalEntites]);
  return data;
};

export default useExternalEntities;
