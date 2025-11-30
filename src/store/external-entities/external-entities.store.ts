import { create } from "zustand";
import { getAllExternalEntities } from "@/components/shared/select-external-entity/service";
import { ExternalEntity } from "@/pages/external-entity/service";

interface ExternalEntitesState {
  entites: ExternalEntity[];
  loading: boolean;
  error: string | null;
  isFetched: boolean;
  fetchAllExternalEntites: () => Promise<void>;
  refreshAllExternalEntites: () => Promise<void>;
  getExternalEntityById: (entityId: number) => ExternalEntity | null;
}
export const useExternalEntitesStore = create<ExternalEntitesState>(
  (set, get) => ({
    entites: [],
    loading: false,
    error: null,
    isFetched: false,
    fetchAllExternalEntites: async () => {
      if (get().isFetched) return;
      set({ loading: true, error: null, isFetched: true });
      try {
        const entites = await getAllExternalEntities();
        set({ entites, loading: false, error: null, isFetched: false });
      } catch (error) {
        console.error("Error fetching external entities:", error);
        set({
          loading: false,
          error: "Failed to fetch external entities",
          isFetched: false,
        });
      }
    },
    refreshAllExternalEntites: async () => {
      set({ loading: true, error: null, isFetched: false });
      await get().fetchAllExternalEntites();
    },
    getExternalEntityById: (entityId: number) => {
      return (
        get().entites.find(
          (entity) => entity.id?.toString() === entityId.toString()
        ) || null
      );
    },
  })
);
