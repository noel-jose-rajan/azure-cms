import { getUsers, UserType } from "@/components/shared/select-users/service";
import { create } from "zustand";
interface UsersState {
  users: UserType[];
  loading: boolean;
  error: string | null;
  isFetched: boolean;
  fetchAllUsers: () => Promise<void>;
  refreshAllUsers: () => Promise<void>;
  getUserById: (userId: number) => UserType | null;
}
export const useUsersStore = create<UsersState>((set, get) => ({
  users: [],
  loading: false,
  error: null,
  isFetched: false,
  fetchAllUsers: async () => {
    if (get().isFetched) return;
    set({ loading: true, error: null, isFetched: true });
    try {
      const users = await getUsers();
      set({ users, loading: false, error: null, isFetched: false });
    } catch (error) {
      console.error("Error fetching users:", error);
      set({
        loading: false,
        error: "Failed to fetch users",
        isFetched: false,
      });
    }
  },
  refreshAllUsers: async () => {
    set({ loading: true, error: null, isFetched: false });
    await get().fetchAllUsers();
  },
  getUserById: (userId: number) => {
    return get().users.find((user) => user.id === userId) || null;
  },
}));
