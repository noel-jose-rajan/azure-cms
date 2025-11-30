export type DelegationRecord = {
  id: number;
  delegate_to_user_id: string | number;
  entity_delegation: { entity_id: number; roles: number[] }[];
};
