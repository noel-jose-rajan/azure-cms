import { useEffect } from "react";
import { usePicklistStore } from "../picklists.store";

const usePicklist = () => {
  const { fetchAllPicklists, ...data } = usePicklistStore();

  useEffect(() => {
    if ((data.picklists?.ACTIONS || [])?.length > 0) return;
    fetchAllPicklists();
  }, [fetchAllPicklists]);
  return data;
};

export default usePicklist;
