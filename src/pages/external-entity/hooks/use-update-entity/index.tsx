import { useState } from "react";
import {
  editExternalEntity,
  UpdateExternalEntityPayload,
} from "@/components/shared/select-external-entity/service";
import { useLanguage } from "@/context/language";
import { message } from "antd";
import useExternalEntities from "@/store/external-entities/use-external-entities";

const useUpdateEntity = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const updateExternalEntity = async (
    id: string | number,
    payload: UpdateExternalEntityPayload
  ) => {
    setLoading(true);
    try {
      const response = await editExternalEntity(id, payload);
      return response;
    } catch (error) {
      console.error("Error fetching entity:", error);
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    updateExternalEntity,
  };
};

export default useUpdateEntity;
