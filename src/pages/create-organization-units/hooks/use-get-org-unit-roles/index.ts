import useHandleError from "@/components/hooks/useHandleError";
import {
  getAllOrgUnitRoles,
  getOrgUnitRoles,
} from "@/components/services/organization-units";
import React from "react";

const useGetOrgUnitRoles = () => {
  const { handleError } = useHandleError();
  const [loading, setLoading] = React.useState<boolean>(false);
  const fetchOrgUnitRoles = async (id: string) => {
    try {
      setLoading(true);
      const [allRoles, orgUnitRoles] = await Promise.all([
        getAllOrgUnitRoles(),
        getOrgUnitRoles(id || ""),
      ]);

      return { allRoles, orgUnitRoles };
    } catch (error) {
      handleError(error);
      return { allRoles: [], orgUnitRoles: {} };
    } finally {
      setLoading(false);
    }
  };

  return { fetchOrgUnitRoles, loading };
};

export default useGetOrgUnitRoles;
