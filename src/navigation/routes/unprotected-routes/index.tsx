import { Navigate } from "react-router-dom";
import type { PropsWithChildren } from "react";
import { useAuth } from "@/context/auth";
import { useAllowedViews } from "@/context/allowed-views";
import { views_const } from "@/constants/app-constants/views";

const UnProtectedRoutes = ({ children }: PropsWithChildren) => {
  const { isAuthenticated } = useAuth();
  const { canAccess: canAccessFn } = useAllowedViews();

  let defaultRoute = "/";

  if (canAccessFn(views_const.inbox)) {
    defaultRoute = "/user/inbox";
  } else if (canAccessFn(views_const.search)) {
    defaultRoute = "/correspondence/search";
  } else if (canAccessFn(views_const.dashboard)) {
    defaultRoute = "/admin/dashboard";
  } else {
    defaultRoute = "/";
  }

  if (!isAuthenticated) {
    return <>{children}</>;
  } else {
    return <Navigate to={defaultRoute} replace />;
  }
};

export default UnProtectedRoutes;
