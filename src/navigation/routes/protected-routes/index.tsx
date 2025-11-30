import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/auth";
import { useAllowedViews } from "@/context/allowed-views";
import { views_const } from "@/constants/app-constants/views";
import { el } from "date-fns/locale";
export const ProtectedRoute = ({
  routeCode = "",
  children,
}: {
  routeCode?: string;
  children: React.ReactNode;
}) => {
  const { isAuthenticated } = useAuth();
  const { allowedViews, canAccess: canAccessFn } = useAllowedViews();
  const location = useLocation();
  const currentPath = location.pathname;

  let defaultRoute = "/";

  if (canAccessFn(views_const.dashboard)) {
    defaultRoute = "/admin/dashboard";
  } else if (canAccessFn(views_const.inbox)) {
    defaultRoute = "/user/inbox";
  } else if (canAccessFn(views_const.search)) {
    defaultRoute = "/correspondence/search";
  } else {
    defaultRoute = "/";
  }
  console.log({ isAuthenticated });

  const canAccess =
    allowedViews?.some((v) => v?.code == routeCode) ||
    (isAuthenticated && routeCode == "home");

  if (isAuthenticated && (currentPath == "/" || defaultRoute == "/")) {
    if (currentPath != "/" || defaultRoute != "/") {
      return <Navigate to={defaultRoute} replace />;
    }

    return <>{children}</>;
  }

  if (canAccess) {
    console.log("access");

    return <>{children}</>;
  } else {
    if (isAuthenticated) {
      console.log("default");

      return <Navigate to={defaultRoute} replace />;
    } else {
      console.log("login");

      return <Navigate to="/auth/login" replace />;
    }
  }
};
