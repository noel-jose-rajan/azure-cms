import {
  ApartmentOutlined,
  ArrowUpOutlined,
  AuditOutlined,
  BarcodeOutlined,
  BellOutlined,
  CalendarOutlined,
  DashboardOutlined,
  FileOutlined,
  FileTextOutlined,
  HistoryOutlined,
  InboxOutlined,
  NotificationOutlined,
  PieChartOutlined,
  RollbackOutlined,
  SafetyCertificateOutlined,
  ScanOutlined,
  SearchOutlined,
  SettingOutlined,
  TranslationOutlined,
  UserOutlined,
  UserSwitchOutlined,
} from "@ant-design/icons";
import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from "react";
import { useLanguage } from "../language";
import { useAuth } from "../auth";
import { AntdIconProps } from "@ant-design/icons/lib/components/AntdIcon";
import { getAllowedViews, ViewsType } from "@/navigation/loaders/auth";
import { views_const } from "@/constants/app-constants/views";

type AllowedRoute = {
  path: string;
  icon: React.ForwardRefExoticComponent<
    Omit<AntdIconProps, "ref"> & React.RefAttributes<HTMLSpanElement>
  >;
  name: string;
  check?: boolean;
};

type AllowedViewsContextType = {
  allowedViews: ViewsType[];
  setAllowedViews: React.Dispatch<React.SetStateAction<ViewsType[]>>;
  allowedRoutes: AllowedRoute[];
  canAccess: (checkStr: string) => boolean;
};
const AllowedViewsContext = createContext<AllowedViewsContextType | undefined>(
  undefined
);

export const AllowedViewsProvider = ({ children }: PropsWithChildren) => {
  const { labels, isEnglish } = useLanguage();
  const { isAuthenticated } = useAuth();
  const [allowedViews, setAllowedViews] = useState<ViewsType[]>([]);
  const canAccess = (checkStr: string) => {
    return allowedViews?.map((d) => d?.code)?.includes(checkStr);
  };

  useEffect(() => {
    if (!isAuthenticated) {
      setAllowedViews([]);
    }
  }, [isAuthenticated]);

  const adminRoute: AllowedRoute[] = [
    {
      path: "/admin/dashboard",
      icon: DashboardOutlined,
      name: labels.mnu.dashboard,
      check: canAccess(views_const.dashboard),
    },
    {
      path: "/user/inbox",
      icon: InboxOutlined,
      name: labels.mnu.inbox,
      check: canAccess(views_const.inbox),
    },
    {
      path: "/correspondence/search",
      icon: SearchOutlined,
      name: labels.mnu.search,
      check: canAccess(views_const.search),
    },
    {
      path: "/correspondence/inbound",
      icon: RollbackOutlined,
      name: labels.mnu.inbound,
      check: canAccess(views_const.create_inbound),
    },
    {
      path: "/correspondence/outbound",
      icon: ArrowUpOutlined,
      name: labels.mnu.outbound,
      check: canAccess(views_const.create_outbound),
    },
    {
      path: "/admin/scan",
      icon: ScanOutlined,
      name: "Scan",
    },
    {
      path: "/correspondence/backlogs",
      icon: HistoryOutlined,
      name: isEnglish ? "Backlogs" : "المتراكمة",
    },
    {
      path: "/admin/barcode",
      icon: BarcodeOutlined,
      name: labels.mnu.barcode,
      check: canAccess(views_const.barcode),
    },
    // {
    //   path: "/admin/correspondence-schema",
    //   icon: FileOutlined,
    //   name: labels.mnu.corres_schema,
    //   check: canAccess(views_const.corr_schema),
    // },
    {
      path: "/admin/sla",
      icon: SafetyCertificateOutlined,
      name: labels.mnu.sla,
      check: canAccess(views_const.app_params),
    },
    {
      path: "/admin/organization-units",
      icon: ApartmentOutlined,
      name: labels.mnu.organization_unit,
      check: canAccess(views_const.org_units),
    },
    {
      path: "/admin/application-parameters",
      icon: SettingOutlined,
      name: labels.mnu.app_parameters,
      check: canAccess(views_const.app_params),
    },
    {
      path: "/admin/pick-lists",
      icon: FileOutlined,
      name: labels.mnu.picklists,
      check: canAccess(views_const.picklist),
    },
    {
      path: "/admin/stamps",
      icon: AuditOutlined,
      name: labels.mnu.stamps,
      check: canAccess(views_const.stamps),
    },
    {
      path: "/admin/calendar",
      icon: CalendarOutlined,
      name: labels.mnu.calendar,
      check: canAccess(views_const.calendar),
    },
    {
      path: "/admin/external-entity",
      icon: UserOutlined,
      name: labels.mnu.external_entity,
      check: canAccess(views_const.external_entity),
    },
    {
      path: "/admin/users-preferences",
      icon: SettingOutlined,
      name: labels.mnu.users_preferences,
      check: canAccess(views_const.user_Prefrence),
    },
    {
      path: "/admin/translation-manager",
      icon: TranslationOutlined,
      name: labels.mnu.translation_manager,
      check: canAccess(views_const.user_Prefrence),
    },
    {
      path: "/admin/delegation",
      icon: UserSwitchOutlined,
      name: labels.mnu.delegation,
      check: canAccess(views_const.admin_delegation),
    },
    {
      path: "/admin/urgency-notifications",
      icon: BellOutlined,
      name: labels.mnu.urgency_notification,
    },
    {
      path: "/admin/task-management",
      icon: FileTextOutlined,
      name: labels.mnu.task_management,
    },
    {
      path: "/admin/outbound-template",
      icon: FileOutlined,
      name: labels.mnu.outbound_templates,
      check: canAccess(views_const.outbound_template),
    },
    {
      path: "/admin/application-privileges",
      icon: SettingOutlined,
      name: labels.mnu.accessibility_priviliges,
      check: canAccess(views_const.app_privileges),
    },
    {
      path: "/admin/announcements-groups",
      icon: NotificationOutlined,
      name: labels.mnu.announcements_groups,
      check: canAccess(views_const.announcement_groups),
    },
    {
      path: "/admin/reports",
      icon: PieChartOutlined,
      name: labels.mnu.reports,
      check: canAccess(views_const.report),
    },
  ];

  const allowedRoutes = adminRoute?.filter((route) => route.check);

  return (
    <AllowedViewsContext.Provider
      value={{ allowedViews, allowedRoutes, setAllowedViews, canAccess }}
    >
      {children}
    </AllowedViewsContext.Provider>
  );
};

export const useAllowedViews = (): AllowedViewsContextType => {
  const context = useContext(AllowedViewsContext);
  if (!context) {
    throw new Error("useAllowedViews must be used within a ThemeProvider");
  }
  return context;
};
