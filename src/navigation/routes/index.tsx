import { createBrowserRouter, Outlet } from "react-router-dom";
import PrimaryLayout from "@/components/layouts/primary";
import { getAllowedViews } from "../loaders/auth";
import { ProtectedRoute } from "./protected-routes";
import { ProtectedLayout } from "./protected-layout";
import { views_const } from "@/constants/app-constants/views";
import UnProtectedRoutes from "./unprotected-routes";
import { lazy, Suspense } from "react";
import RouteFallback from "./route-fallback";
const Login = lazy(() => import("../../pages/auth/login"));
const BarCode = lazy(() => import("@/pages/barcode"));
const SLA = lazy(() => import("@/pages/pages/sla"));
const Calendar = lazy(() => import("@/pages/calendar"));
const OutboundDetailsPage = lazy(() => import("../../pages/create-outbound"));
const InboundDetailsPage = lazy(() => import("../../pages/create-inbound"));
const CorrDetailsPage = lazy(
  () => import("../../pages/correspondance-details")
);
const Dashboard = lazy(() => import("../../pages/dashboard_new"));
const ExternalEntity = lazy(() => import("../../pages/external-entity"));
const UserPrefrence = lazy(() => import("../../pages/users-preferences"));
const TranslationManager = lazy(
  () => import("../../pages/translation-manager")
);
const AdminDelegation = lazy(() => import("../../pages/delegationa-admin"));
const ViewDelegation = lazy(() => import("../../pages/delegation-view"));
const CreateAdminDelegation = lazy(
  () => import("../../pages/create-delegation")
);
const OutboundTemplates = lazy(() => import("../../pages/outbound-template"));
const AppPrivilege = lazy(() => import("../../pages/application-privileges"));
const OrgUnit = lazy(() => import("../../pages/organization-units"));
const CreateOrgUnit = lazy(
  () => import("../../pages/create-organization-units")
);
const Search = lazy(() => import("@/pages/correspondence-search"));
const UserDelegation = lazy(() => import("@/pages/delegationa-user"));
const CreateUserDelegation = lazy(
  () => import("@/pages/create-delegation-user")
);
const Inbox = lazy(() => import("../../pages/inbox"));
const AppParams = lazy(() => import("../../pages/application-parameters"));
const PickLists = lazy(() => import("../../pages/pick-lists"));
const Stamps = lazy(() => import("../../pages/stamps"));
const Reports = lazy(() => import("../../pages/reports"));
const Announcement = lazy(() => import("../../pages/announcement-groups"));
const ThemeEditor = lazy(() => import("../../pages/theme-editor"));
const UserProfile = lazy(() => import("../../pages/users-preferences"));
const OutboundDraftsPAge = lazy(() => import("../../pages/outbounds"));
const InboundDraftsPAge = lazy(() => import("../../pages/inbounds"));
const HOME = lazy(() => import("../../pages/default"));
//not added
// import Experimental from "../../pages/experimental";
// import FileView from "../../pages/file-viewer";

// const navigation = new Navigation();

// const routes = navigation.getNavigationList({
//   main: {
//     path: "/",
//     component: Default,
//   },
//   "file-view": {
//     path: "/file-view",
//     component: FileView,
//   },
//   auth: {
//     path: "/auth",
//     component: Default,
//     children: {
//       login: {
//         path: "/login",
//         component: Login,
//       },
//     },
//   },
//   experimental: {
//     path: "/experimental",
//     component: Experimental,
//   },
//   home: {
//     path: "/home",
//     component: Default,
//     children: {
//       dashboard: {
//         path: "/dashboard",
//         component: Dashboard,
//         children: {
//           "correspondence-schema": {
//             path: "/correspondence-schema",
//             component: CorrespondenceSchema,
//           },
//           sla: {
//             path: "/sla",
//             component: SLA,
//           },
//           "application-parameters": {
//             path: "/application-parameters",
//             component: ApplicationParameters,
//           },
//           "task-management": {
//             path: "/task-management",
//             component: TaskManagement,
//           },
//           pickLists: {
//             path: "/pick-lists",
//             component: PickLists,
//           },
//           barcode: {
//             path: "/barcode",
//             component: Barcode,
//           },
//           calendar: {
//             path: "/calendar",
//             component: Calendar,
//           },

//           "external-entity": {
//             path: "/external-entity",
//             component: ExternalEntity,
//           },
//           "users-preferences": {
//             path: "/users-preferences",
//             component: UsersPreferences,
//           },
//           delegation: {
//             path: "/delegation",
//             component: Delegation,
//           },
//           "urgency-notifications": {
//             path: "/urgency-notifications",
//             component: UrgencyNotifications,
//           },
//           "outbound-template": {
//             path: "/outbound-template",
//             component: OutboundTemplate,
//           },
//           "application-privileges": {
//             path: "/application-privileges",
//             component: ApplicationPrivileges,
//           },
//           "organization-units": {
//             path: "/organization-units",
//             component: OrganizationUnits,
//             children: {
//               create: {
//                 path: "/create",
//                 component: CreateEditOrganizationUnit,
//               },
//               ":id": {
//                 path: "/:id",
//                 component: CreateEditOrganizationUnit,
//               },
//             },
//           },
//           search: {
//             path: "/search",
//             component: CorrespondenceSearch,
//             children: {
//               details: {
//                 path: "/details/:id",
//                 component: CorrespondenceDetails,
//               },
//             },
//           },
//           "announcements-groups": {
//             path: "/announcements-groups",
//             component: AnnouncementGroups,
//           },

//           "create-outbound": {
//             path: "/create-outbound",
//             component: CreateOutbound,
//           },
//           stamps: {
//             path: "/stamps",
//             component: StampManagementPage,
//           },
//           scan: {
//             path: "/scan",
//             component: Dynamsoft,
//           },
//           inbox: {
//             path: "/inbox",
//             component: InboxPage,
//             children: {
//               details: {
//                 path: "/:id",
//                 component: CorrespondenceDetails,
//               },
//             },
//           },
//           reports: {
//             path: "/reports",
//             component: Reports,
//           },
//         },
//       },
//       inbounds: {
//         path: "/inbound",
//         component: InboundPage,
//         children: {
//           create: {
//             path: "/create",
//             component: CreateInbound,
//           },
//           ":id": {
//             path: "/:id",
//             component: CreateInbound,
//           },
//         },
//       },

//       outbounds: {
//         path: "/outbound",
//         component: OutboundPage,
//         children: {
//           create: {
//             path: "/create",
//             component: CreateOutbound,
//           },
//           ":id": {
//             path: "/:id",
//             component: CreateOutbound,
//           },
//         },
//       },

//       backlogs: {
//         path: "/backlogs",
//         component: BacklogsPage,
//         children: {
//           create: {
//             path: "/create",
//             component: CreateBacklog,
//           },
//           ":id": {
//             path: "/:id",
//             component: CreateBacklog,
//           },
//           details: {
//             path: "/details/:id",
//             component: CorrespondenceDetails,
//           },
//         },
//       },
//       correspondence: {
//         path: "/correspondence/:id",
//         component: CorrespondenceDetails,
//       },
//       "my-preferences": {
//         path: "/my-preferences",
//         component: UsersPreferences,
//       },
//       "theme-editor": {
//         path: "/theme-editor",
//         component: ThemeEditor,
//       },
//     },
//   },

//   "*": {
//     path: "*",
//     component: ErrorPage,
//   },
// });

// export default routes;

export const router = createBrowserRouter([
  {
    path: "",
    element: (
      <Suspense fallback={<RouteFallback />}>
        <ProtectedLayout>
          <PrimaryLayout />
        </ProtectedLayout>
      </Suspense>
    ),
    loader: getAllowedViews,
    shouldRevalidate: ({ currentUrl }) => {
      return currentUrl.pathname.toLowerCase() == "/auth/login";
    },
    children: [
      {
        path: "auth/login",
        element: (
          <Suspense fallback={<RouteFallback />} key="login">
            <UnProtectedRoutes>
              <Login />
            </UnProtectedRoutes>
          </Suspense>
        ),
        // lazy: async () => {
        //   const { default: Login } = await import("../../pages/auth/login");
        //   return {
        //     Component: () => (
        //       <UnProtectedRoutes>
        //         <Login />
        //       </UnProtectedRoutes>
        //     ),
        //   };
        // },
      },
      {
        path: "",
        element: (
          <Suspense fallback={<RouteFallback />} key={"home"}>
            <ProtectedRoute routeCode={"home"}>
              <HOME />
            </ProtectedRoute>
          </Suspense>
        ),
        // lazy: async () => {
        //   const { default: HOME } = await import("../../pages/default");
        //   return {
        //     Component: () => (
        //       <Suspense fallback={<RouteFallback />} key={"home"}>
        //         <ProtectedRoute routeCode={"home"}>
        //           <HOME />
        //         </ProtectedRoute>
        //       </Suspense>
        //     ),
        //   };
        // },
      },
      {
        path: "home",
        lazy: async () => {
          const { default: HOME } = await import("../../pages/default");
          return {
            Component: () => (
              <ProtectedRoute routeCode={"home"}>
                <HOME />
              </ProtectedRoute>
            ),
          };
        },
      },
      {
        path: "admin",
        element: <Outlet />,
        children: [
          {
            // lazy: async () => {
            //   const { default: Dashboard } = await import(
            //     "@/pages/dashboard_new"
            //   );
            //   return {
            //     Component: () => (
            //       <ProtectedRoute routeCode={views_const.dashboard}>
            //         <Dashboard />
            //       </ProtectedRoute>
            //     ),
            //   };
            // },
            path: "dashboard",
            element: (
              <Suspense fallback={<RouteFallback />} key={"dashboard"}>
                <ProtectedRoute routeCode={views_const.dashboard}>
                  <Dashboard />
                </ProtectedRoute>
              </Suspense>
            ),
          },

          {
            path: "sla",
            element: (
              <Suspense fallback={<RouteFallback />} key={"sla"}>
                <ProtectedRoute routeCode={views_const.app_params}>
                  <SLA />
                </ProtectedRoute>
              </Suspense>
            ),
            // lazy: async () => {
            //   const { default: SLA } = await import("@/pages/pages/sla");
            //   return {
            //     Component: () => (

            //       <ProtectedRoute routeCode={views_const.app_params}>
            //         <SLA />
            //       </ProtectedRoute>
            //     ),
            //   };
            // },
          },

          // {
          //   path: "correspondence-schema",
          //   lazy: async () => {
          //     const { default: CorrespondenceSchema } = await import(
          //       "../../pages/correspondence-schema"
          //     );
          //     return {
          //       Component: () => (
          //         <ProtectedRoute routeCode={views_const.corr_schema}>
          //           <CorrespondenceSchema />
          //         </ProtectedRoute>
          //       ),
          //     };
          //   },
          // },
          {
            path: "application-parameters",
            element: (
              <Suspense
                fallback={<RouteFallback />}
                key={"application-parameters"}
              >
                <ProtectedRoute routeCode={views_const.app_params}>
                  <AppParams />
                </ProtectedRoute>
              </Suspense>
            ),
            // lazy: async () => {
            //   const { default: AppParams } = await import(
            //     "../../pages/application-parameters"
            //   );
            //   return {
            //     Component: () => (
            //       <ProtectedRoute routeCode={views_const.app_params}>
            //         <AppParams />
            //       </ProtectedRoute>
            //     ),
            //   };
            // },
          },
          // not in use
          // {
          //   path: "task-management",
          //   lazy: async () => ({
          //     Component: (await import("@/pages/task-management")).default,
          //   }),
          // },
          {
            path: "pick-lists",
            element: (
              <Suspense fallback={<RouteFallback />} key={"pick-lists"}>
                <ProtectedRoute routeCode={views_const.picklist}>
                  <PickLists />
                </ProtectedRoute>
              </Suspense>
            ),
            // lazy: async () => {
            //   const { default: PickLists } = await import(
            //     "../../pages/pick-lists"
            //   );
            //   return {
            //     Component: () => (
            //       <ProtectedRoute routeCode={views_const.picklist}>
            //         <PickLists />
            //       </ProtectedRoute>
            //     ),
            //   };
            // },
          },
          {
            path: "barcode",
            element: (
              <Suspense fallback={<RouteFallback />} key={"barcode"}>
                <ProtectedRoute routeCode={views_const.barcode}>
                  <BarCode />
                </ProtectedRoute>
              </Suspense>
            ),
            // lazy: async () => {
            //   const { default: BarCode } = await import("../../pages/barcode");
            //   return {
            //     Component: () => (
            //       <ProtectedRoute routeCode={views_const.barcode}>
            //         <BarCode />
            //       </ProtectedRoute>
            //     ),
            //   };
            // },
          },

          {
            path: "calendar",
            element: (
              <Suspense fallback={<RouteFallback />} key={"calendar"}>
                <ProtectedRoute routeCode={views_const.calendar}>
                  <Calendar />
                </ProtectedRoute>
              </Suspense>
            ),
            // lazy: async () => {
            //   const { default: Calendar } = await import(
            //     "../../pages/calendar"
            //   );
            //   return {
            //     Component: () => (
            //       <ProtectedRoute routeCode={views_const.calendar}>
            //         <Calendar />
            //       </ProtectedRoute>
            //     ),
            //   };
            // },
          },

          {
            path: "external-entity",
            // lazy: async () => {
            //   const { default: ExternalEntity } = await import(
            //     "../../pages/external-entity"
            //   );
            //   return {
            //     Component: () => (
            //       <ProtectedRoute routeCode={views_const.external_entity}>
            //         <ExternalEntity />
            //       </ProtectedRoute>
            //     ),
            //   };
            // },
            element: (
              <Suspense fallback={<RouteFallback />} key={"external-entity"}>
                <ProtectedRoute routeCode={views_const.external_entity}>
                  <ExternalEntity />
                </ProtectedRoute>
              </Suspense>
            ),
          },

          {
            path: "users-preferences",

            // lazy: async () => {
            //   const { default: UserPrefrence } = await import(
            //     "../../pages/users-preferences"
            //   );
            //   return {
            //     Component: () => (
            //       <ProtectedRoute routeCode={views_const.user_Prefrence}>
            //         <UserPrefrence />
            //       </ProtectedRoute>
            //     ),
            //   };
            // },
            element: (
              <Suspense fallback={<RouteFallback />} key={"users-preferences"}>
                <ProtectedRoute routeCode={views_const.user_Prefrence}>
                  <UserPrefrence />
                </ProtectedRoute>
              </Suspense>
            ),
          },
          {
            path: "translation-manager",

            // lazy: async () => {
            //   const { default: UserPrefrence } = await import(
            //     "../../pages/users-preferences"
            //   );
            //   return {
            //     Component: () => (
            //       <ProtectedRoute routeCode={views_const.user_Prefrence}>
            //         <UserPrefrence />
            //       </ProtectedRoute>
            //     ),
            //   };
            // },
            element: (
              <Suspense fallback={<RouteFallback />} key={"users-preferences"}>
                <ProtectedRoute routeCode={views_const.user_Prefrence}>
                  <TranslationManager />
                </ProtectedRoute>
              </Suspense>
            ),
          },
          {
            path: "delegation",
            element: (
              <ProtectedRoute routeCode={views_const.admin_delegation}>
                <Outlet />
              </ProtectedRoute>
            ),
            children: [
              {
                path: "",
                // lazy: async () => ({
                //   Component: (await import("@/pages/delegationa-admin"))
                //     .default,
                // }),
                element: (
                  <Suspense
                    fallback={<RouteFallback />}
                    key={"delegation-admin"}
                  >
                    <AdminDelegation />
                  </Suspense>
                ),
              },
              {
                path: ":id",
                element: (
                  <Suspense
                    fallback={<RouteFallback />}
                    key={"view-delegation-admin"}
                  >
                    <ViewDelegation />
                  </Suspense>
                ),
                // lazy: async () => ({
                //   Component: (await import("@/pages/delegation-view")).default,
                // }),
              },
              {
                path: "create",
                element: (
                  <Suspense
                    fallback={<RouteFallback />}
                    key={"create-delegation-admin"}
                  >
                    <CreateAdminDelegation />
                  </Suspense>
                ),
                // lazy: async () => ({
                //   Component: (await import("@/pages/create-delegation"))
                //     .default,
                // }),
              },
            ],
          },

          // {
          //   path: "urgency-notifications",
          //   lazy: async () => ({
          //     Component: (await import("../../pages/urgency-notifications"))
          //       .default,
          //   }),
          // },

          {
            path: "outbound-template",
            element: (
              <Suspense fallback={<RouteFallback />} key={"outbound-template"}>
                <ProtectedRoute routeCode={views_const.outbound_template}>
                  <OutboundTemplates />
                </ProtectedRoute>
              </Suspense>
            ),
            // lazy: async () => {
            //   const { default: OutboundTemplates } = await import(
            //     "../../pages/outbound-template"
            //   );
            //   return {
            //     Component: () => (
            //       <ProtectedRoute routeCode={views_const.outbound_template}>
            //         <OutboundTemplates />
            //       </ProtectedRoute>
            //     ),
            //   };
            // },
          },

          {
            path: "application-privileges",
            element: (
              <Suspense fallback={<RouteFallback />} key={"app-privileges"}>
                <ProtectedRoute routeCode={views_const.app_privileges}>
                  <AppPrivilege />
                </ProtectedRoute>
              </Suspense>
            ),
            // lazy: async () => {
            //   const { default: AppPrivilege } = await import(
            //     "../../pages/application-privileges"
            //   );
            //   return {
            //     Component: () => (
            //       <ProtectedRoute routeCode={views_const.app_privileges}>
            //         <AppPrivilege />
            //       </ProtectedRoute>
            //     ),
            //   };
            // },
          },
          {
            path: "organization-units",
            element: (
              <ProtectedRoute routeCode={views_const.org_units}>
                <Outlet />
              </ProtectedRoute>
            ),
            children: [
              {
                path: "",
                element: (
                  <Suspense fallback={<RouteFallback />} key={"org-units"}>
                    <OrgUnit />
                  </Suspense>
                ),
                // lazy: async () => ({
                //   Component: (await import("../../pages/organization-units"))
                //     .default,
                // }),
              },
              {
                path: "create",
                // lazy: async () => ({
                //   Component: (
                //     await import("../../pages/create-organization-units")
                //   ).default,
                // }),
                element: (
                  <Suspense fallback={<RouteFallback />} key={"create-org"}>
                    <CreateOrgUnit />
                  </Suspense>
                ),
              },
              {
                path: ":id",
                element: (
                  <Suspense
                    fallback={<RouteFallback />}
                    key={"create-delegation"}
                  >
                    <CreateOrgUnit />
                  </Suspense>
                ),
                // lazy: async () => ({
                //   Component: (
                //     await import("../../pages/create-organization-units")
                //   ).default,
                // }),
              },
            ],
          },
          {
            path: "announcements-groups",

            element: (
              <Suspense
                fallback={<RouteFallback />}
                key={"announcements-groups"}
              >
                <ProtectedRoute routeCode={views_const.announcement_groups}>
                  <Announcement />
                </ProtectedRoute>
              </Suspense>
            ),
            // lazy: async () => {
            //   const { default: Announcement } = await import(
            //     "../../pages/announcement-groups"
            //   );
            //   return {
            //     Component: () => (
            //       <ProtectedRoute routeCode={views_const.announcement_groups}>
            //         <Announcement />
            //       </ProtectedRoute>
            //     ),
            //   };
            // },
          },
          {
            path: "stamps",
            element: (
              <Suspense fallback={<RouteFallback />} key={"stamps"}>
                <ProtectedRoute routeCode={views_const.stamps}>
                  <Stamps />
                </ProtectedRoute>
              </Suspense>
            ),
            // lazy: async () => {
            //   const { default: Stamps } = await import("../../pages/stamps");
            //   return {
            //     Component: () => (
            //       <ProtectedRoute routeCode={views_const.stamps}>
            //         <Stamps />
            //       </ProtectedRoute>
            //     ),
            //   };
            // },
          },
          // {
          //   path: "scan",
          //   lazy: async () => ({
          //     Component: (await import("../../pages/dynamsoft")).default,
          //   }),
          // },
          {
            path: "reports",
            element: (
              <Suspense fallback={<RouteFallback />} key={"reports"}>
                <ProtectedRoute routeCode={views_const.report}>
                  <Reports />
                </ProtectedRoute>
              </Suspense>
            ),
            // lazy: async () => {
            //   const { default: Reports } = await import("../../pages/reports");
            //   return {
            //     Component: () => (
            //       <ProtectedRoute routeCode={views_const.report}>
            //         <Reports />
            //       </ProtectedRoute>
            //     ),
            //   };
            // },
          },
        ],
      },

      {
        path: "correspondence",
        element: <Outlet />,
        children: [
          {
            path: "outbound",
            element: (
              <ProtectedRoute routeCode={views_const.create_outbound}>
                <Outlet />
              </ProtectedRoute>
            ),
            children: [
              {
                path: "",
                element: (
                  <Suspense
                    fallback={<RouteFallback />}
                    key={"outbound-drafts"}
                  >
                    <OutboundDraftsPAge />
                  </Suspense>
                ),
                // lazy: async () => ({
                //   Component: (await import("../../pages/outbounds")).default,
                // }),
              },
              // {
              //   path: "create",
              //   lazy: async () => ({
              //     Component: (await import("../../pages/create-outbound"))
              //       .default,
              //   }),
              // },
              {
                path: ":id",
                element: (
                  <Suspense
                    fallback={<RouteFallback />}
                    key={"outbound-details"}
                  >
                    <OutboundDetailsPage />
                  </Suspense>
                ),
                // lazy: async () => ({
                //   Component: (await import("../../pages/create-outbound"))
                //     .default,
                // }),
              },
            ],
          },

          {
            path: "inbound",
            element: (
              <ProtectedRoute routeCode={views_const.create_inbound}>
                <Outlet />
              </ProtectedRoute>
            ),
            children: [
              {
                path: "",
                element: (
                  <Suspense fallback={<RouteFallback />} key={"inbound-drafts"}>
                    <InboundDraftsPAge />
                  </Suspense>
                ),
                // lazy: async () => ({
                //   Component: (await import("../../pages/inbounds")).default,
                // }),
              },
              // {
              //   path: "create",
              //   lazy: async () => ({
              //     Component: (await import("../../pages/create-inbound"))
              //       .default,
              //   }),
              // },
              {
                path: ":id",
                element: (
                  <Suspense
                    fallback={<RouteFallback />}
                    key={"inbound-details"}
                  >
                    <InboundDetailsPage />
                  </Suspense>
                ),
                // lazy: async () => ({
                //   Component: (await import("../../pages/create-inbound"))
                //     .default,
                // }),
              },
            ],
          },
          {
            path: ":id",
            element: (
              <Suspense
                fallback={<RouteFallback />}
                key={"correspondance-details"}
              >
                <ProtectedRoute routeCode={views_const.search}>
                  <CorrDetailsPage />
                </ProtectedRoute>
              </Suspense>
            ),
            // lazy: async () => {
            //   const { default: CorrDetails } = await import(
            //     "../../pages/correspondance-details"
            //   );
            //   return {
            //     Component: () => (
            //       <ProtectedRoute routeCode={views_const.search}>
            //         <CorrDetails />
            //       </ProtectedRoute>
            //     ),
            //   };
            // },
          },

          // not in use
          // {
          //   path: "backlogs",
          //   lazy: async () => ({
          //     Component: (await import("../../pages/backlogs")).default,
          //   }),
          // },
          // {
          //   path: "backlogs/create",
          //   lazy: async () => ({
          //     Component: (await import("../../pages/create-backlog")).default,
          //   }),
          // },
          // {
          //   path: "backlogs/:id",
          //   lazy: async () => ({
          //     Component: (await import("../../pages/correspondance-details"))
          //       .default,
          //   }),
          // },

          {
            // lazy: async () => {
            //   const { default: Search } = await import(
            //     "@/pages/correspondence-search"
            //   );
            //   return {
            //     Component: () => (
            //       <ProtectedRoute routeCode={views_const.search}>
            //         <Search />
            //       </ProtectedRoute>
            //     ),
            //   };
            // },
            path: "search",
            element: (
              <Suspense fallback={<RouteFallback />} key={"search"}>
                <ProtectedRoute routeCode={views_const.search}>
                  <Search />
                </ProtectedRoute>
              </Suspense>
            ),
          },

          // {
          //   path: "search",
          //   lazy: async () => ({
          //     Component: (await import("@/pages/correspondence-search"))
          //       .default,
          //   }),
          // },
        ],
      },
      {
        path: "user",
        element: (
          <ProtectedRoute routeCode="home">
            <Outlet />
          </ProtectedRoute>
        ),
        children: [
          {
            path: "delegation",
            element: (
              <ProtectedRoute routeCode={views_const.user_delegation}>
                <Outlet />
              </ProtectedRoute>
            ),
            children: [
              {
                path: "",
                element: (
                  <Suspense
                    fallback={<RouteFallback />}
                    key={"user-delegation"}
                  >
                    <UserDelegation />
                  </Suspense>
                ),
                // lazy: async () => ({
                //   Component: (await import("@/pages/delegationa-user")).default,
                // }),
              },
              {
                path: ":id",
                element: (
                  <Suspense
                    fallback={<RouteFallback />}
                    key={"view-delegation"}
                  >
                    <ViewDelegation />
                  </Suspense>
                ),
                // lazy: async () => ({
                //   Component: (await import("@/pages/delegation-view")).default,
                // }),
              },
              {
                path: "create",
                element: (
                  <Suspense
                    fallback={<RouteFallback />}
                    key={"create-delegation"}
                  >
                    <CreateUserDelegation />
                  </Suspense>
                ),
                // lazy: async () => ({
                //   Component: (await import("@/pages/create-delegation-user"))
                //     .default,
                // }),
              },
            ],
          },
          {
            path: "inbox",
            element: (
              <ProtectedRoute routeCode={views_const.inbox}>
                {" "}
                <Outlet />
              </ProtectedRoute>
            ),
            children: [
              {
                path: "",
                element: (
                  <Suspense fallback={<RouteFallback />} key={"inbox"}>
                    <Inbox />
                  </Suspense>
                ),
                // lazy: async () => ({
                //   Component: (await import("../../pages/inbox")).default,
                // }),
              },
              {
                path: ":id",
                element: (
                  <Suspense fallback={<RouteFallback />} key={"inbox-details"}>
                    <CorrDetailsPage />
                  </Suspense>
                ),
                // lazy: async () => ({
                //   Component: (
                //     await import("../../pages/correspondance-details")
                //   ).default,
                // }),
              },
            ],
          },

          {
            path: "theme-editor",
            element: (
              <Suspense fallback={<RouteFallback />} key={"theme-editor"}>
                <ThemeEditor />
              </Suspense>
            ),
            // lazy: async () => ({
            //   Component: (await import("../../pages/theme-editor")).default,
            // }),
          },
          {
            path: "my-preferences",
            element: (
              <Suspense fallback={<RouteFallback />} key={"user-preferences"}>
                <UserProfile />
              </Suspense>
            ),
            // lazy: async () => ({
            //   Component: (await import("../../pages/users-preferences"))
            //     .default,
            // }),
          },
        ],
      },

      {
        path: "*",
        lazy: async () => ({
          Component: (await import("../../pages/error")).default,
        }),
      },
    ],
  },
]);
