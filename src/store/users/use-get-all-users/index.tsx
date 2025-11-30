import { useEffect } from "react";
import { useUsersStore } from "../users.store";

const useGetAllUsers = () => {
  const { fetchAllUsers, users, ...data } = useUsersStore();

  useEffect(() => {
    if (users?.length === 0) {
      fetchAllUsers();
    }
  }, [fetchAllUsers, users]);

  return { users, ...data };
};

export default useGetAllUsers;
