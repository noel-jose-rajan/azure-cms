import React from "react";
import { updateOrgUnit } from "@/components/services/organization-units";
import { CreateOrUpdate } from "@/components/shared/types/api";
import { UpdateOUType } from "@/components/services/organization-units/type";

const useUpdateOrgUnitBasicInfo = () => {
  const [loading, setLoading] = React.useState<boolean>(false);

  const handleUpdateOrgUnit = async (
    orgUnitId: number | string,
    updatedData: UpdateOUType
  ): Promise<CreateOrUpdate | null> => {
    try {
      setLoading(true);
      const res = await updateOrgUnit(orgUnitId, updatedData);
      return res;
    } catch (error) {
      console.error("Error updating organization unit:", error);
      return null;
    } finally {
      setLoading(false);
    }
  };
  return { handleUpdateOrgUnit, loading };
};

export default useUpdateOrgUnitBasicInfo;
