import { getAllOU } from "@/components/services/organization-units";
import { OrgUnitType } from "@/components/services/organization-units/type";
import { create } from "zustand";

interface OrgsState {
  orgUnits: OrgUnitType[];
  loading: boolean;
  error: string | null;
  isFetched: boolean;
  fetchAllOrgs: () => Promise<void>;
  refreshAllOrgs: () => Promise<void>;
  getOrgById: (orgId: number) => OrgUnitType | null;
}
export const useOrgsStore = create<OrgsState>((set, get) => ({
  orgUnits: [],
  loading: false,
  error: null,
  isFetched: false,
  fetchAllOrgs: async () => {
    if (get().isFetched) return;
    set({ loading: true, error: null, isFetched: true });
    try {
      const orgUnits = await getAllOU();
      set({ orgUnits, loading: false, error: null, isFetched: false });
    } catch (error) {
      console.error("Error fetching organization units:", error);
      set({
        loading: false,
        error: "Failed to fetch organization units",
        isFetched: false,
      });
    }
  },
  refreshAllOrgs: async () => {
    set({ loading: true, error: null, isFetched: false });
    await get().fetchAllOrgs();
  },
  getOrgById: (orgId: number) =>
    get().orgUnits.find((org) => org.id === orgId) || null,
}));
