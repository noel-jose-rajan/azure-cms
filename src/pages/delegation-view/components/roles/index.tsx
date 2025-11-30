import React, { useEffect, useState } from "react";
import { Modal, Tree, Typography } from "antd";
import { useLanguage } from "@/context/language";
import useGetAllOU from "@/store/orgs/use-get-all-ou";
import { useTheme } from "@/context/theme";
import WhileInViewWrapper from "@/animations/while-in-view-wrapper";
import { UserRole } from "@/pages/delegationa-admin/service";

const roleGroups = {
  outbound: {
    initiator: [33],
    approval: [23, 26, 29],
    senderGroup: [25, 28, 31],
    reviewerGroup: [24, 27, 30],
  },
  inbound: {
    scanIndex: [10],
    recipientGroup: [11, 12, 13],
    routeUsers: [14, 15, 16],
    ccUsers: [17, 18, 19],
  },
};

const enSecurityLevels = ["normal", "secret", "top-secret"];
const arSecurityLevels = ["عادي", "سري", "سري جدا"];

type RoleItem = {
  id: number;
  level: string;
};

type TransformedEntity = {
  entity_id: number;
  outbound?: {
    initiator?: RoleItem[];
    approval?: RoleItem[];
    senderGroup?: RoleItem[];
    reviewerGroup?: RoleItem[];
  };
  inbound?: {
    scanIndex?: RoleItem[];
    recipientGroup?: RoleItem[];
    routeUsers?: RoleItem[];
    ccUsers?: RoleItem[];
  };
};

type DelegateEntry = {
  delegate_to_user_id: number;
  delegate_to_user_name: string;
  entity_delegation: {
    entity_id: number;
    roles: number[];
  }[];
};

type Props = {
  roles: UserRole[];
  delegateTo: DelegateEntry[];
};

const ReadOnlyDelegationTree = ({ roles, delegateTo }: Props) => {
  const { isEnglish } = useLanguage();
  const { getOrgById, orgUnits } = useGetAllOU();
  const { theme } = useTheme();
  const [treeData, setTreeData] = useState<any[]>([]);
  const securityLevels = isEnglish ? enSecurityLevels : arSecurityLevels;

  const mapRolesByLevel = (groupRoles: number[], assigned: number[]) =>
    groupRoles
      .map((roleId, idx) =>
        assigned.includes(roleId)
          ? { id: roleId, level: securityLevels[idx] ?? securityLevels[0] }
          : null
      )
      .filter(Boolean) as RoleItem[];

  const transformEntity = (
    entity_id: number,
    assignedRoles: number[]
  ): TransformedEntity => ({
    entity_id,
    outbound: {
      initiator: assignedRoles.includes(33)
        ? [{ id: 33, level: securityLevels[0] }]
        : [],
      approval: mapRolesByLevel(roleGroups.outbound.approval, assignedRoles),
      senderGroup: mapRolesByLevel(
        roleGroups.outbound.senderGroup,
        assignedRoles
      ),
      reviewerGroup: mapRolesByLevel(
        roleGroups.outbound.reviewerGroup,
        assignedRoles
      ),
    },
    inbound: {
      scanIndex: assignedRoles.includes(10)
        ? [{ id: 10, level: securityLevels[0] }]
        : [],
      recipientGroup: mapRolesByLevel(
        roleGroups.inbound.recipientGroup,
        assignedRoles
      ),
      routeUsers: mapRolesByLevel(roleGroups.inbound.routeUsers, assignedRoles),
      ccUsers: mapRolesByLevel(roleGroups.inbound.ccUsers, assignedRoles),
    },
  });

  const buildTreeData = (delegate: DelegateEntry): any => {
    const children = delegate.entity_delegation
      .map(({ entity_id, roles }) => {
        const transformed = transformEntity(entity_id, roles);

        const makeGroup = (title: string, items?: RoleItem[]) => {
          if (!items?.length) return null;
          return {
            title,
            key: `${entity_id}-${title}`,
            children: items.map(({ id, level }) => ({
              title: level,
              key: `${entity_id}-${id}`,
            })),
          };
        };

        const outboundGroups = [
          makeGroup(
            isEnglish ? "Initiator" : "منشئ",
            transformed.outbound?.initiator
          ),
          makeGroup(
            isEnglish ? "Approval" : "معتمد",
            transformed.outbound?.approval
          ),
          makeGroup(
            isEnglish ? "Sender" : "مرسل",
            transformed.outbound?.senderGroup
          ),
          makeGroup(
            isEnglish ? "Reviewer" : "مراجع",
            transformed.outbound?.reviewerGroup
          ),
        ].filter(Boolean);

        const inboundGroups = [
          makeGroup(
            isEnglish ? "Scan Index" : "المسح الضوئي",
            transformed.inbound?.scanIndex
          ),
          makeGroup(
            isEnglish ? "Recipient Group" : "مستلم",
            transformed.inbound?.recipientGroup
          ),
          makeGroup(
            isEnglish ? "Route Users" : "مجموعة التوجية",
            transformed.inbound?.routeUsers
          ),
          makeGroup(
            isEnglish ? "CC Users" : "نسخة مطابقة",
            transformed.inbound?.ccUsers
          ),
        ].filter(Boolean);

        const ou = getOrgById?.(entity_id);
        const groupChildren = [];

        if (outboundGroups.length)
          groupChildren.push({
            title: isEnglish ? "Outbound" : "صادر",
            key: `outbound-${entity_id}`,
            children: outboundGroups,
          });

        if (inboundGroups.length)
          groupChildren.push({
            title: isEnglish ? "Inbound" : "وارد",
            key: `inbound-${entity_id}`,
            children: inboundGroups,
          });

        if (!groupChildren.length) return null;

        return {
          title: isEnglish
            ? ou?.name_en ?? `Entity ${entity_id}`
            : ou?.name_ar ?? `الوحدة ${entity_id}`,
          key: `entity-${delegate.delegate_to_user_id}-${entity_id}`,
          children: groupChildren,
        };
      })
      .filter(Boolean);

    return {
      title: delegate.delegate_to_user_name,
      key: `user-${delegate.delegate_to_user_id}`,
      children,
    };
  };

  useEffect(() => {
    if (!orgUnits || orgUnits?.length == 0) return;
    const tree = delegateTo.map((d) => buildTreeData(d)).filter(Boolean);
    setTreeData(tree);
  }, [delegateTo, roles, orgUnits]);

  return (
    <WhileInViewWrapper>
      <Tree
        treeData={treeData}
        defaultExpandAll
        autoExpandParent
        showLine
        selectable={false}
        style={{ background: theme.colors.background, paddingTop: 12 }}
      />
    </WhileInViewWrapper>
  );
};

export default ReadOnlyDelegationTree;
