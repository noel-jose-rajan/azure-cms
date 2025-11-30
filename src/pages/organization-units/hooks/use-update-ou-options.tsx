import React from "react";
import { updateOrgUnitOptions } from "@/components/services/organization-units";
import { CreateOrUpdate } from "@/components/shared/types/api";
import { UpdateOUType } from "@/components/services/organization-units/type";
import useHandleError from "@/components/hooks/useHandleError";

const useUpdateOrgUnitOptions = () => {
  const { handleError } = useHandleError();
  const [loading, setLoading] = React.useState<boolean>(false);

  const handleUpdateOrgUnit = async (
    orgUnitId: number | string,
    updatedData: UpdateOUType
  ): Promise<CreateOrUpdate | null> => {
    try {
      setLoading(true);
      const res = await updateOrgUnitOptions(orgUnitId, updatedData);
      return res;
    } catch (error) {
      handleError(error);
      return null;
    } finally {
      setLoading(false);
    }
  };
  return { handleUpdateOrgUnit, loading };
};

export default useUpdateOrgUnitOptions;
