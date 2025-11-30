import { useEffect, useState } from "react";
import { Button, Modal, Tree, Typography } from "antd";
import { UserRole } from "@/pages/delegationa-admin/service";
import { useLanguage } from "@/context/language";
import useGetAllOU from "@/store/orgs/use-get-all-ou";
import { DelegationRecord } from "../../types";
import { useTheme } from "@/context/theme";
import WhileInViewWrapper from "@/animations/while-in-view-wrapper";
import SelectUsers from "@/components/shared/select-users";

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

type Props = {
  roles: UserRole[];
  editedDelegation?: DelegationRecord | null;
  editingId?: number;
  delegations: DelegationRecord[];
  setDelegations: React.Dispatch<React.SetStateAction<DelegationRecord[]>>;
  onClose: () => void;
};

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

const UserRoles = ({
  editedDelegation,
  editingId,
  delegations,
  setDelegations,
  onClose,
  roles,
}: Props) => {
  const { isEnglish, labels } = useLanguage();
  const { getOrgById, orgUnits } = useGetAllOU();
  const [treeData, setTreeData] = useState<any[]>([]);
  const [delegate_to_user_id, setDelegate_to_user_id] = useState<number>();
  const [checkedKeys, setCheckedKeys] = useState<string[]>([]);
  const securityLevels = isEnglish ? enSecurityLevels : arSecurityLevels;
  const { theme } = useTheme();

  const getLockedKeys = (
    delegations: DelegationRecord[],
    editingId?: number
  ): string[] => {
    const locked: string[] = [];
    delegations?.forEach((delegation) => {
      if (delegation?.id === editingId) return;
      delegation?.entity_delegation?.forEach(({ entity_id, roles }) => {
        roles?.forEach((roleId) => {
          locked.push(`${entity_id}-${roleId}`);
        });
      });
    });
    return locked;
  };

  function transformEntities(data: UserRole[]): TransformedEntity[] {
    const mapRoles = (groupRoles: number[], roles: number[] = []) =>
      groupRoles
        ?.map((roleId, idx) =>
          roles?.includes(roleId)
            ? { id: roleId, level: securityLevels[idx] ?? securityLevels[0] }
            : null
        )
        .filter(Boolean) as RoleItem[];

    return (
      data?.map(({ entity_id, roles }) => ({
        entity_id,
        outbound: {
          initiator: roles?.includes(33)
            ? [{ id: 33, level: securityLevels[0] }]
            : [],
          approval: mapRoles(roleGroups.outbound.approval, roles),
          senderGroup: mapRoles(roleGroups.outbound.senderGroup, roles),
          reviewerGroup: mapRoles(roleGroups.outbound.reviewerGroup, roles),
        },
        inbound: {
          scanIndex: roles?.includes(10)
            ? [{ id: 10, level: securityLevels[0] }]
            : [],
          recipientGroup: mapRoles(roleGroups.inbound.recipientGroup, roles),
          routeUsers: mapRoles(roleGroups.inbound.routeUsers, roles),
          ccUsers: mapRoles(roleGroups.inbound.ccUsers, roles),
        },
      })) ?? []
    );
  }

  const buildTreeData = (entity: TransformedEntity, lockedKeys: string[]) => {
    const makeGroup = (title: string, items?: RoleItem[]) => {
      if (!items?.length) return null;

      const children = items.map(({ id, level }) => {
        const key = `${entity?.entity_id}-${id}`;
        return {
          title: `${level}`,
          key,
          disabled: lockedKeys.includes(key),
        };
      });

      const allDisabled = children.every((child) => child.disabled);
      return {
        title,
        key: `${entity?.entity_id}-${title}`,
        disabled: allDisabled,
        children,
      };
    };

    const outboundGroups = [
      makeGroup(isEnglish ? "Initiator" : "منشئ", entity?.outbound?.initiator),
      makeGroup(isEnglish ? "Approval" : "معتمد", entity?.outbound?.approval),
      makeGroup(isEnglish ? "Sender" : "مرسل", entity?.outbound?.senderGroup),
      makeGroup(
        isEnglish ? "Reviewer" : "مراجع",
        entity?.outbound?.reviewerGroup
      ),
    ].filter(Boolean);

    const inboundGroups = [
      makeGroup(
        isEnglish ? "Scan Index" : "المسح الضوئي",
        entity?.inbound?.scanIndex
      ),
      makeGroup(
        isEnglish ? "Recipient Group" : "مستلم",
        entity?.inbound?.recipientGroup
      ),
      makeGroup(
        isEnglish ? "Route Users" : "مجموعة التوجية",
        entity?.inbound?.routeUsers
      ),
      makeGroup(
        isEnglish ? "CC Users" : "نسخة مطابقة",
        entity?.inbound?.ccUsers
      ),
    ].filter(Boolean);

    const children = [];

    if (outboundGroups.length > 0) {
      const allDisabled = outboundGroups.every((group) => group?.disabled);
      children.push({
        title: isEnglish ? "Outbound" : "صادر",
        key: `outbound-${entity?.entity_id}`,
        disabled: allDisabled,
        children: outboundGroups,
      });
    }

    if (inboundGroups.length > 0) {
      const allDisabled = inboundGroups.every((group) => group?.disabled);
      children.push({
        title: isEnglish ? "Inbound" : "وارد",
        key: `inbound-${entity?.entity_id}`,
        disabled: allDisabled,
        children: inboundGroups,
      });
    }

    if (children.length === 0) return null;

    const ou = getOrgById?.(entity?.entity_id);
    const allDisabled = children?.every((group) => group?.disabled);

    return {
      title: isEnglish
        ? ou?.name_en ?? `Entity ${entity.entity_id}`
        : ou?.name_ar ?? `الوحدة ${entity.entity_id}`,
      key: `entity-${entity?.entity_id}`,
      disabled: allDisabled,

      children,
    };
  };

  useEffect(() => {
    if (!roles || orgUnits?.length == 0) return;
    const structured = transformEntities(roles ?? []);
    const lockedKeys = getLockedKeys(delegations, editingId);
    const tree = structured
      ?.map((entity) => buildTreeData(entity, lockedKeys))
      .filter(Boolean);
    setTreeData(tree ?? []);
  }, [roles, delegations, editingId, orgUnits]);

  const handleEdit = (record: DelegationRecord) => {
    const keys = record?.entity_delegation?.flatMap((e) =>
      e?.roles?.map((r) => `${e?.entity_id}-${r}`)
    );
    setDelegate_to_user_id(Number(record?.delegate_to_user_id) || 0);
    setCheckedKeys(keys ?? []);
  };

  useEffect(() => {
    if (editedDelegation) {
      handleEdit(editedDelegation);
    }
  }, [editedDelegation]);

  const handleSubmit = () => {
    const entityMap: Record<number, number[]> = {};

    (checkedKeys ?? [])?.forEach((key = "") => {
      const [entityId, roleId] = key.split("-").map(Number);
      if (!isNaN(entityId) && !isNaN(roleId)) {
        if (!entityMap[entityId]) entityMap[entityId] = [];
        entityMap[entityId]?.push(roleId);
      }
    });

    const entity_delegation = Object.entries(entityMap).map(
      ([entity_id, roles]) => ({
        entity_id: Number(entity_id),
        roles,
      })
    );

    const newDelegation: DelegationRecord = {
      id: editingId ?? Date.now(),
      delegate_to_user_id: delegate_to_user_id || 0,
      entity_delegation,
    };

    setDelegations((prev) => {
      const filtered = prev?.filter((d) => d?.id !== newDelegation?.id);
      return [...(filtered ?? []), newDelegation];
    });

    setCheckedKeys([]);
    onClose();
  };

  const isValid = Boolean(delegate_to_user_id) && checkedKeys?.length > 0;

  return (
    <Modal
      afterClose={onClose}
      open={true}
      onCancel={onClose}
      width={600}
      title={<Typography>{labels.lbl.add_role}</Typography>}
      footer={null}
      centered
    >
      {treeData?.length > 0 && (
        <WhileInViewWrapper>
          <SelectUsers
            hideArr={delegations
              ?.map((d) => Number(d?.delegate_to_user_id))
              ?.filter((d) => d != editedDelegation?.delegate_to_user_id)}
            label={labels.lbl.delegation_to + " *"}
            value={delegate_to_user_id}
            onChange={(val: number | number[]) =>
              setDelegate_to_user_id(val as number)
            }
          />

          <Tree
            style={{ background: theme.colors.background, paddingTop: 16 }}
            checkable
            defaultExpandAll={false}
            treeData={treeData}
            checkedKeys={checkedKeys}
            onCheck={(keys, { checkedNodes }) => {
              const validKeys = checkedNodes
                ?.filter((node: any) => !node?.disabled)
                .map((node: any) => node?.key);
              setCheckedKeys(validKeys ?? []);
            }}
          />

          <Button
            type="primary"
            onClick={handleSubmit}
            style={{ marginTop: 16 }}
            disabled={!isValid}
          >
            {editingId ? labels.btn.edit : labels.btn.save}
          </Button>
        </WhileInViewWrapper>
      )}
    </Modal>
  );
};

export default UserRoles;
