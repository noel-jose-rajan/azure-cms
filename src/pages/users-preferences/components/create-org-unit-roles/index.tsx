import React, { useMemo, useState } from "react";
import { Col, Row, Card, Button, Tag } from "antd";
import { useLanguage } from "../../../../context/language";
import { CloseOutlined, WarningOutlined } from "@ant-design/icons";
import SelectOU from "@/components/shared/select-org-units";
import {
  UserRoleType,
  UsersOrgUnitRolesType,
} from "@/components/services/user-preference/type";
import AddEditRole from "../org-unit-roles/add-edit-role";
import { OrgUnitType } from "@/components/services/organization-units/type";

interface Props {
  userId: string;
  onClose?: () => any;
  allRoles: UserRoleType[];
  organizationUnits: OrgUnitType[];
  updateAssociatedOrgUnit: (ou: UsersOrgUnitRolesType) => void;
}

const CreateOrgUnitRoles: React.FC<Props> = ({
  userId,
  onClose,
  allRoles,
  organizationUnits,
  updateAssociatedOrgUnit,
}) => {
  const {
    labels: { msg, lbl, btn },
    isEnglish,
  } = useLanguage();
  const [selectedOrgUnit, setSelectedOrgUnit] = useState<number>();

  const duplicates = useMemo(() => {
    return organizationUnits.find((f) => f.id === selectedOrgUnit);
  }, [selectedOrgUnit, organizationUnits]);

  return (
    <Card>
      {duplicates && (
        <Row>
          <Tag icon={<WarningOutlined />} color="#cd201f">
            {msg.userPreference_orgunitDuplicate.replace(
              "({{data}})",
              ` (${isEnglish ? duplicates?.name_en : duplicates?.name_ar}) `
            )}
          </Tag>
        </Row>
      )}
      <Row align={"middle"} justify="space-between">
        <Col span={12}>
          <SelectOU
            multiSelect={false}
            onChange={(ou: number[] | number) => {
              Array.isArray(ou)
                ? setSelectedOrgUnit(ou[0])
                : setSelectedOrgUnit(ou);
            }}
            value={selectedOrgUnit}
            label={lbl.org_unit}
          />
        </Col>
        <Col span={12} style={{ textAlign: "right" }}>
          <Button type="primary" onClick={() => onClose && onClose()}>
            <CloseOutlined style={{ marginRight: 10 }} /> {btn.cancel}
          </Button>
        </Col>
      </Row>
      <AddEditRole
        allRoles={allRoles}
        currentRoles={
          selectedOrgUnit
            ? {
                entity_id: selectedOrgUnit,
                roles: [],
              }
            : undefined
        }
        selectedUser={userId}
        updateAssociatedOrgUnit={updateAssociatedOrgUnit}
        enable={selectedOrgUnit !== undefined}
      />
    </Card>
  );
};

export default CreateOrgUnitRoles;
