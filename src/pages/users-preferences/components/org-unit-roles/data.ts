// export const template = [
//   {
//     key: "ADMIN_NORMAL",
//     en: "Delete Normal Users",
//     ar: "حذف المستخدمين العاديين",
//   },
//   {
//     key: "ADMIN_SECRET",
//     en: "Delete Secret Users",
//     ar: "حذف المستخدمين السريين",
//   },
//   {
//     key: "ADMIN_TOP_SECRET",
//     en: "Delete Top Secret Users",
//     ar: "حذف المستخدمين شديدي السرية",
//   },

//   {
//     key: "CONTRIBUTOR_NORMAL",
//     en: "Edit Normal Users",
//     ar: "تعديل المستخدمين العاديين",
//   },
//   {
//     key: "CONTRIBUTOR_SECRET",
//     en: "Edit Secret Users",
//     ar: "تعديل المستخدمين السريين",
//   },
//   {
//     key: "CONTRIBUTOR_TOP_SECRET",
//     en: "Edit Top Secret Users",
//     ar: "تعديل المستخدمين شديدي السرية",
//   },

//   {
//     key: "CONSUMER_NORMAL",
//     en: "Read Access Normal Users",
//     ar: "قراءة المستخدمين العاديين",
//   },
//   {
//     key: "CONSUMER_SECRET",
//     en: "Read Access Secret Users",
//     ar: "قراءة المستخدمين السريين",
//   },
//   {
//     key: "CONSUMER_TOP_SECRET",
//     en: "Read Access Top Secret Users",
//     ar: "قراءة المستخدمين شديدي السرية",
//   },

//   {
//     key: "INBOUND_ROUTE_GROUP_NORMAL",
//     en: "Receive Normal Users",
//     ar: "استقبال المستخدمين العاديين",
//   },
//   {
//     key: "INBOUND_ROUTE_GROUP_SECRET",
//     en: "Receive Secret Users",
//     ar: "استقبال المستخدمين السريين",
//   },
//   {
//     key: "INBOUND_ROUTE_GROUP_TOP_SECRET",
//     en: "Receive Top Secret Users",
//     ar: "استقبال المستخدمين شديدي السرية",
//   },

//   {
//     key: "INBOUND_ROUTING_NORMAL",
//     en: "Inbound Routing Normal Users",
//     ar: "توجيه الوارد للمستخدمين العاديين",
//   },
//   {
//     key: "INBOUND_ROUTING_SECRET",
//     en: "Inbound Routing Secret Users",
//     ar: "توجيه الوارد للمستخدمين السريين",
//   },
//   {
//     key: "INBOUND_ROUTING_TOP_SECRET",
//     en: "Inbound Routing Top Secret Users",
//     ar: "توجيه الوارد للمستخدمين شديدي السرية",
//   },

//   {
//     key: "INBOUND_CC_NORMAL",
//     en: "Inbound CC Routing Normal Users",
//     ar: "توجيه CC الوارد للمستخدمين العاديين",
//   },
//   {
//     key: "INBOUND_CC_SECRET",
//     en: "Inbound CC Routing Secret Users",
//     ar: "توجيه CC الوارد للمستخدمين السريين",
//   },
//   {
//     key: "INBOUND_CC_TOP_SECRET",
//     en: "Inbound CC Routing Top Secret Users",
//     ar: "توجيه CC الوارد للمستخدمين شديدي السرية",
//   },

//   { key: "SCAN_INDEX", en: "Scan Index Users", ar: "فحص فهرس المستخدمين" },
//   {
//     key: "G2G_INBOUND",
//     en: "Inbound Group (G2G)",
//     ar: "المجموعة الواردة (من حكومة إلى حكومة)",
//   },

//   { key: "OUTBOUND_INITIATOR", en: "Initiator Users", ar: "مستخدمون مبتدئون" },
//   {
//     key: "OUTBOUND_APPROVAL_NORMAL",
//     en: "Outbound Approval Normal Users",
//     ar: "موافقة الإرسال للمستخدمين العاديين",
//   },
//   {
//     key: "OUTBOUND_APPROVAL_SECRET",
//     en: "Outbound Approval Secret Users",
//     ar: "موافقة الإرسال للمستخدمين السريين",
//   },
//   {
//     key: "OUTBOUND_APPROVAL_TOP_SECRET",
//     en: "Outbound Approval Top Secret Users",
//     ar: "موافقة الإرسال للمستخدمين شديدي السرية",
//   },
//   {
//     key: "OUTBOUND_SENDER_NORMAL",
//     en: "Outbound Sender Normal Users",
//     ar: "مرسل الإرسال للمستخدمين العاديين",
//   },
//   {
//     key: "OUTBOUND_SENDER_SECRET",
//     en: "Outbound Sender Secret Users",
//     ar: "مرسل الإرسال للمستخدمين السريين",
//   },
//   {
//     key: "OUTBOUND_SENDER_TOP_SECRET",
//     en: "Outbound Sender Top Secret Users",
//     ar: "مرسل الإرسال للمستخدمين شديدي السرية",
//   },
//   {
//     key: "OUTBOUND_REVIEWER_NORMAL",
//     en: "Outbound Reviewer Normal Users",
//     ar: "مراجع الإرسال للمستخدمين العاديين",
//   },
//   {
//     key: "OUTBOUND_REVIEWER_SECRET",
//     en: "Outbound Reviewer Secret Users",
//     ar: "مراجع الإرسال للمستخدمين السريين",
//   },
//   {
//     key: "OUTBOUND_REVIEWER_TOP_SECRET",
//     en: "Outbound Reviewer Top Secret Users",
//     ar: "مراجع الإرسال للمستخدمين شديدي السرية",
//   },
// ];

export const roleNameLists: {
  [x: string]: { key: string; en: string; ar: string };
} = {
  ADMIN_NORMAL: {
    key: "ADMIN_NORMAL",
    en: "Delete Normal Users",
    ar: "حذف المستخدمين العاديين",
  },
  ADMIN_SECRET: {
    key: "ADMIN_SECRET",
    en: "Delete Secret Users",
    ar: "حذف المستخدمين السريين",
  },
  ADMIN_TOP_SECRET: {
    key: "ADMIN_TOP_SECRET",
    en: "Delete Top Secret Users",
    ar: "حذف المستخدمين شديدي السرية",
  },
  CONTRIBUTOR_NORMAL: {
    key: "CONTRIBUTOR_NORMAL",
    en: "Edit Normal Users",
    ar: "تعديل المستخدمين العاديين",
  },
  CONTRIBUTOR_SECRET: {
    key: "CONTRIBUTOR_SECRET",
    en: "Edit Secret Users",
    ar: "تعديل المستخدمين السريين",
  },
  CONTRIBUTOR_TOP_SECRET: {
    key: "CONTRIBUTOR_TOP_SECRET",
    en: "Edit Top Secret Users",
    ar: "تعديل المستخدمين شديدي السرية",
  },
  CONSUMER_NORMAL: {
    key: "CONSUMER_NORMAL",
    en: "Read Access Normal Users",
    ar: "قراءة المستخدمين العاديين",
  },
  CONSUMER_SECRET: {
    key: "CONSUMER_SECRET",
    en: "Read Access Secret Users",
    ar: "قراءة المستخدمين السريين",
  },
  CONSUMER_TOP_SECRET: {
    key: "CONSUMER_TOP_SECRET",
    en: "Read Access Top Secret Users",
    ar: "قراءة المستخدمين شديدي السرية",
  },
  INBOUND_ROUTE_GROUP_NORMAL: {
    key: "INBOUND_ROUTE_GROUP_NORMAL",
    en: "Receive Normal Users",
    ar: "استقبال المستخدمين العاديين",
  },
  INBOUND_ROUTE_GROUP_SECRET: {
    key: "INBOUND_ROUTE_GROUP_SECRET",
    en: "Receive Secret Users",
    ar: "استقبال المستخدمين السريين",
  },
  INBOUND_ROUTE_GROUP_TOP_SECRET: {
    key: "INBOUND_ROUTE_GROUP_TOP_SECRET",
    en: "Receive Top Secret Users",
    ar: "استقبال المستخدمين شديدي السرية",
  },
  INBOUND_ROUTING_NORMAL: {
    key: "INBOUND_ROUTING_NORMAL",
    en: "Inbound Routing Normal Users",
    ar: "توجيه الوارد للمستخدمين العاديين",
  },
  INBOUND_ROUTING_SECRET: {
    key: "INBOUND_ROUTING_SECRET",
    en: "Inbound Routing Secret Users",
    ar: "توجيه الوارد للمستخدمين السريين",
  },
  INBOUND_ROUTING_TOP_SECRET: {
    key: "INBOUND_ROUTING_TOP_SECRET",
    en: "Inbound Routing Top Secret Users",
    ar: "توجيه الوارد للمستخدمين شديدي السرية",
  },
  INBOUND_CC_NORMAL: {
    key: "INBOUND_CC_NORMAL",
    en: "Inbound CC Routing Normal Users",
    ar: "توجيه CC الوارد للمستخدمين العاديين",
  },
  INBOUND_CC_SECRET: {
    key: "INBOUND_CC_SECRET",
    en: "Inbound CC Routing Secret Users",
    ar: "توجيه CC الوارد للمستخدمين السريين",
  },
  INBOUND_CC_TOP_SECRET: {
    key: "INBOUND_CC_TOP_SECRET",
    en: "Inbound CC Routing Top Secret Users",
    ar: "توجيه CC الوارد للمستخدمين شديدي السرية",
  },
  SCAN_INDEX: {
    key: "SCAN_INDEX",
    en: "Scan Index Users",
    ar: "فحص فهرس المستخدمين",
  },
  G2G_INBOUND: {
    key: "G2G_INBOUND",
    en: "Inbound Group (G2G)",
    ar: "المجموعة الواردة (من حكومة إلى حكومة)",
  },
  OUTBOUND_INITIATOR: {
    key: "OUTBOUND_INITIATOR",
    en: "Initiator Users",
    ar: "مستخدمون مبتدئون",
  },
  OUTBOUND_APPROVAL_NORMAL: {
    key: "OUTBOUND_APPROVAL_NORMAL",
    en: "Outbound Approval Normal Users",
    ar: "موافقة الإرسال للمستخدمين العاديين",
  },
  OUTBOUND_APPROVAL_SECRET: {
    key: "OUTBOUND_APPROVAL_SECRET",
    en: "Outbound Approval Secret Users",
    ar: "موافقة الإرسال للمستخدمين السريين",
  },
  OUTBOUND_APPROVAL_TOP_SECRET: {
    key: "OUTBOUND_APPROVAL_TOP_SECRET",
    en: "Outbound Approval Top Secret Users",
    ar: "موافقة الإرسال للمستخدمين شديدي السرية",
  },
  OUTBOUND_SENDER_NORMAL: {
    key: "OUTBOUND_SENDER_NORMAL",
    en: "Outbound Sender Normal Users",
    ar: "مرسل الإرسال للمستخدمين العاديين",
  },
  OUTBOUND_SENDER_SECRET: {
    key: "OUTBOUND_SENDER_SECRET",
    en: "Outbound Sender Secret Users",
    ar: "مرسل الإرسال للمستخدمين السريين",
  },
  OUTBOUND_SENDER_TOP_SECRET: {
    key: "OUTBOUND_SENDER_TOP_SECRET",
    en: "Outbound Sender Top Secret Users",
    ar: "مرسل الإرسال للمستخدمين شديدي السرية",
  },
  OUTBOUND_REVIEWER_NORMAL: {
    key: "OUTBOUND_REVIEWER_NORMAL",
    en: "Outbound Reviewer Normal Users",
    ar: "مراجع الإرسال للمستخدمين العاديين",
  },
  OUTBOUND_REVIEWER_SECRET: {
    key: "OUTBOUND_REVIEWER_SECRET",
    en: "Outbound Reviewer Secret Users",
    ar: "مراجع الإرسال للمستخدمين السريين",
  },
  OUTBOUND_REVIEWER_TOP_SECRET: {
    key: "OUTBOUND_REVIEWER_TOP_SECRET",
    en: "Outbound Reviewer Top Secret Users",
    ar: "مراجع الإرسال للمستخدمين شديدي السرية",
  },
};

export const permissionRoles = [
  "CONSUMER_NORMAL",
  "CONSUMER_SECRET",
  "CONSUMER_TOP_SECRET",
  "CONTRIBUTOR_NORMAL",
  "CONTRIBUTOR_SECRET",
  "CONTRIBUTOR_TOP_SECRET",
  "ADMIN_NORMAL",
  "ADMIN_SECRET",
  "ADMIN_TOP_SECRET",
];

export const inboundRoles = [
  "INBOUND_ROUTE_GROUP_NORMAL",
  "INBOUND_ROUTE_GROUP_SECRET",
  "INBOUND_ROUTE_GROUP_TOP_SECRET",
  "INBOUND_ROUTING_NORMAL",
  "INBOUND_ROUTING_SECRET",
  "INBOUND_ROUTING_TOP_SECRET",
  "INBOUND_CC_NORMAL",
  "INBOUND_CC_SECRET",
  "INBOUND_CC_TOP_SECRET",
  "SCAN_INDEX",
  "G2G_INBOUND",
];

export const outboundRoles = [
  "OUTBOUND_APPROVAL_NORMAL",
  "OUTBOUND_APPROVAL_SECRET",
  "OUTBOUND_APPROVAL_TOP_SECRET",
  "OUTBOUND_SENDER_NORMAL",
  "OUTBOUND_SENDER_SECRET",
  "OUTBOUND_SENDER_TOP_SECRET",
  "OUTBOUND_REVIEWER_NORMAL",
  "OUTBOUND_REVIEWER_SECRET",
  "OUTBOUND_REVIEWER_TOP_SECRET",
];

export const defaultRoleData = [
  {
    id: 1,
    role_name: "CONSUMER_NORMAL",
    role_type: "Permission",
  },
  {
    id: 2,
    role_name: "CONSUMER_SECRET",
    role_type: "Permission",
  },
  {
    id: 3,
    role_name: "CONSUMER_TOP_SECRET",
    role_type: "Permission",
  },
  {
    id: 4,
    role_name: "CONTRIBUTOR_NORMAL",
    role_type: "Permission",
  },
  {
    id: 5,
    role_name: "CONTRIBUTOR_SECRET",
    role_type: "Permission",
  },
  {
    id: 6,
    role_name: "CONTRIBUTOR_TOP_SECRET",
    role_type: "Permission",
  },
  {
    id: 7,
    role_name: "ADMIN_NORMAL",
    role_type: "Permission",
  },
  {
    id: 8,
    role_name: "ADMIN_SECRET",
    role_type: "Permission",
  },
  {
    id: 9,
    role_name: "ADMIN_TOP_SECRET",
    role_type: "Permission",
  },
  {
    id: 10,
    role_name: "SCAN_INDEX",
    role_type: "Inbound",
  },
  {
    id: 11,
    role_name: "INBOUND_ROUTING_NORMAL",
    role_type: "Inbound",
  },
  {
    id: 12,
    role_name: "INBOUND_ROUTING_SECRET",
    role_type: "Inbound",
  },
  {
    id: 13,
    role_name: "INBOUND_ROUTING_TOP_SECRET",
    role_type: "Inbound",
  },
  {
    id: 14,
    role_name: "INBOUND_ROUTE_GROUP_NORMAL",
    role_type: "Inbound",
  },
  {
    id: 15,
    role_name: "INBOUND_ROUTE_GROUP_SECRET",
    role_type: "Inbound",
  },
  {
    id: 16,
    role_name: "INBOUND_ROUTE_GROUP_TOP_SECRET",
    role_type: "Inbound",
  },
  {
    id: 17,
    role_name: "INBOUND_CC_NORMAL",
    role_type: "Inbound",
  },
  {
    id: 18,
    role_name: "INBOUND_CC_SECRET",
    role_type: "Inbound",
  },
  {
    id: 19,
    role_name: "INBOUND_CC_TOP_SECRET",
    role_type: "Inbound",
  },
  {
    id: 20,
    role_name: "G2G_INBOUND",
    role_type: "Inbound",
  },
  {
    id: 21,
    role_name: "ANNOUNCEMENT",
    role_type: "Outbound",
  },
  {
    id: 22,
    role_name: "DECISIONS",
    role_type: "Outbound",
  },
  {
    id: 23,
    role_name: "OUTBOUND_APPROVAL_NORMAL",
    role_type: "Outbound",
  },
  {
    id: 24,
    role_name: "OUTBOUND_REVIEWER_NORMAL",
    role_type: "Outbound",
  },
  {
    id: 25,
    role_name: "OUTBOUND_SENDER_NORMAL",
    role_type: "Outbound",
  },
  {
    id: 26,
    role_name: "OUTBOUND_APPROVAL_SECRET",
    role_type: "Outbound",
  },
  {
    id: 27,
    role_name: "OUTBOUND_REVIEWER_SECRET",
    role_type: "Outbound",
  },
  {
    id: 28,
    role_name: "OUTBOUND_SENDER_SECRET",
    role_type: "Outbound",
  },
  {
    id: 29,
    role_name: "OUTBOUND_APPROVAL_TOP_SECRET",
    role_type: "Outbound",
  },
  {
    id: 30,
    role_name: "OUTBOUND_REVIEWER_TOP_SECRET",
    role_type: "Outbound",
  },
  {
    id: 31,
    role_name: "OUTBOUND_SENDER_TOP_SECRET",
    role_type: "Outbound",
  },
  {
    id: 32,
    role_name: "OUTBOUND_FORWARD_TO",
    role_type: "Outbound",
  },
  {
    id: 33,
    role_name: "OUTBOUND_INITIATOR",
    role_type: "Outbound",
  },
  {
    id: 34,
    role_name: "USER_Permission",
    role_type: "User",
  },
  {
    id: 35,
    role_name: "ANNOUNCEMENT_GROUP",
    role_type: "ANNOUNCEMENT",
  },
];
