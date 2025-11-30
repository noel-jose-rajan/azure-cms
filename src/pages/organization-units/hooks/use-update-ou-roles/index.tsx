import useHandleError from "@/components/hooks/useHandleError";
import { updateOrgUnitRoles } from "@/components/services/organization-units";
import { updateOrgUnitRolesPayloadType } from "@/components/services/organization-units/type";
import { useState } from "react";

const useUpdateOrgUnitRoles = () => {
  const { handleError } = useHandleError();
  const [loading, setLoading] = useState<boolean>(false);
  const handleUpdateOrgUnitRoles = async (
    orgUnitId: string,
    payload: updateOrgUnitRolesPayloadType
  ) => {
    try {
      setLoading(true);
      await updateOrgUnitRoles(orgUnitId, payload);
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  };
  return { loading, handleUpdateOrgUnitRoles };
};

export default useUpdateOrgUnitRoles;
