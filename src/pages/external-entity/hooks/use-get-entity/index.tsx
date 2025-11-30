import { useEffect, useState } from "react";
import { ExternalEntity } from "../../service";
import { getExternalEntityById } from "@/components/shared/select-external-entity/service";

const useGetEntity = (id: string | number) => {
  const [entity, setEntity] = useState<ExternalEntity | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const getEntityById = async () => {
    setLoading(true);
    try {
      const response = await getExternalEntityById(id);
      setEntity(response);
    } catch (error) {
      console.error("Error fetching entity:", error);
      setEntity(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!id) return;
    getEntityById();
  }, [id]);

  return {
    entity,
    loading,
  };
};

export default useGetEntity;
