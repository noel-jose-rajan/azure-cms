import { useEffect } from "react";
import { useOrgsStore } from "../orgs.store";

const useGetAllOU = () => {
  const { fetchAllOrgs, ...data } = useOrgsStore();

  useEffect(() => {
    fetchAllOrgs();
  }, [fetchAllOrgs]);

  return data;
};

export default useGetAllOU;
