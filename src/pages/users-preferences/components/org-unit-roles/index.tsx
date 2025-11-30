import React, { useState, useMemo, useEffect } from "react";
import { Col, Row, Card, Button, Dropdown, MenuProps, message } from "antd";
import { useLanguage } from "../../../../context/language";
import { DownOutlined, PlusCircleOutlined } from "@ant-design/icons";
import AddEditRole from "./add-edit-role";
import { OrgUnitType } from "@/components/services/organization-units/type";
import {
  UserRoleType,
  UsersOrgUnitRolesType,
} from "@/components/services/user-preference/type";
import { useTheme } from "@/context/theme";
import { set } from "lodash";

interface Props {
  userId: string;
  onAdd?: () => any;
  allRoles: UserRoleType[];
  organizationUnits: OrgUnitType[];
  associatedOrgUnit: UsersOrgUnitRolesType[];
  updateAssociatedOrgUnit: (ou: UsersOrgUnitRolesType) => void;
}

const OrgUnitRoles: React.FC<Props> = ({
  userId,
  onAdd,
  allRoles,
  organizationUnits,
  associatedOrgUnit,
  updateAssociatedOrgUnit,
}) => {
  const {
    isEnglish,
    labels: { lbl, btn },
  } = useLanguage();
  const {
    theme: { colors },
  } = useTheme();
  const [selectedRoles, setSelectedRoles] = useState<UsersOrgUnitRolesType>();
  const [open, setOpen] = useState(false);
  const [selectedOrgUnit, setSelectedOrgUnit] = useState<OrgUnitType>();

  const styles = {
    semiMatchText: {
      margin: 0,
      lineHeight: "1.2",
      display: "block",
      color: selectedOrgUnit ? colors.primary : colors.textMuted,
      marginTop: 2,
    },
    semiMatchItem: {
      height: 25,
      width: 250,
      display: "flex",
      alignItems: "center",
    },
  };

  const handleSelectChange = (value: number) => {
    const selectedUnit = associatedOrgUnit.find(
      (unit) => unit.entity_id === value
    );
    if (selectedUnit) {
      setSelectedRoles(selectedUnit);
    }
  };

  useEffect(() => {
    if (selectedOrgUnit) {
      handleSelectChange(selectedOrgUnit.id!);
    }
  }, [organizationUnits]);

  const menuOrgUnits: MenuProps["items"] = useMemo(
    () =>
      organizationUnits.map((item) => ({
        key: item.id + "",
        label: (
          <div style={styles.semiMatchItem}>
            <p>{isEnglish ? item.name_en : item.name_ar}</p>
          </div>
        ),
        onClick: () => {
          setSelectedOrgUnit(item);
          handleSelectChange(item.id!);
        },
      })),
    [organizationUnits, isEnglish, styles.semiMatchItem]
  );

  return (
    <Card>
      <Row align={"middle"} justify="space-between" style={{ marginTop: 15 }}>
        <Col span={12}>
          <Dropdown
            menu={{ items: menuOrgUnits }}
            trigger={["click"]}
            onOpenChange={() => setOpen(!open)}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <a
                onClick={(e) => e.preventDefault()}
                style={styles.semiMatchText}
              >{`${
                !selectedOrgUnit
                  ? lbl.org_unit
                  : isEnglish
                  ? selectedOrgUnit.name_en
                  : selectedOrgUnit.name_ar
              }`}</a>
              <DownOutlined style={{ fontSize: 12 }} />
            </div>
          </Dropdown>
        </Col>
        <Col span={12} style={{ textAlign: "right" }}>
          <Button type="primary" onClick={() => onAdd && onAdd()}>
            <PlusCircleOutlined /> {btn.userPreference_addToOrgunit}
          </Button>
        </Col>
      </Row>
      <AddEditRole
        allRoles={allRoles}
        currentRoles={selectedRoles}
        selectedUser={userId}
        updateAssociatedOrgUnit={updateAssociatedOrgUnit}
        enable={selectedOrgUnit !== undefined}
      />
    </Card>
  );
};

export default OrgUnitRoles;
