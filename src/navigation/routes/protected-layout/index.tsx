import { useLoaderData } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/auth";
import { useAllowedViews } from "@/context/allowed-views";

export const ProtectedLayout = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const data = useLoaderData();
  const { setAllowedViews } = useAllowedViews();
  const { handleIsAuthenticated } = useAuth();

  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    if (Array.isArray(data)) {
      setAllowedViews(data);
      handleIsAuthenticated(true);
    } else {
      handleIsAuthenticated(false);
    }
    setInitialized(true);
  }, [data]);

  if (!initialized) {
    return null;
  }

  // if (!Array.isArray(data)) {
  //   return <Navigate to="/auth/login" replace />;
  // }

  return <>{children}</>;
};
