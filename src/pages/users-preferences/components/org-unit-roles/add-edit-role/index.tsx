import TitleHeader from "@/components/ui/header";
import {
  InsertRowAboveOutlined,
  ReloadOutlined,
  SaveOutlined,
} from "@ant-design/icons";
import { Button, Card, Checkbox, Col, message, Row } from "antd";
import {
  inboundRoles,
  outboundRoles,
  permissionRoles,
  roleNameLists,
} from "../data";
import { useLanguage } from "@/context/language";
import { useTheme } from "@/context/theme";
import {
  UserRoleType,
  UsersOrgUnitRolesType,
} from "@/components/services/user-preference/type";
import { useEffect, useRef, useState } from "react";
import {
  removeUserOrgUnitRoles,
  updateUserOrgUnitRoles,
} from "@/components/services/user-preference";
import { HttpStatus } from "@/components/functional/httphelper";

const AddEditRole = ({
  allRoles,
  currentRoles,
  selectedUser,
  updateAssociatedOrgUnit,
  enable = false,
}: {
  allRoles: UserRoleType[];
  currentRoles?: UsersOrgUnitRolesType;
  selectedUser: number | string;
  updateAssociatedOrgUnit: (ou: UsersOrgUnitRolesType) => void;
  enable?: boolean;
}) => {
  const {
    labels: { til, btn },
    isEnglish,
  } = useLanguage();
  const { theme } = useTheme();
  const associatedRoles = useRef<number[]>([]);
  const [selectedRoles, setSelectedRoles] = useState<number[]>(
    currentRoles?.roles ?? []
  );

  useEffect(() => {
    setSelectedRoles(currentRoles?.roles ?? []);
    associatedRoles.current = currentRoles?.roles ?? [];
  }, [currentRoles]);

  const handleChange = (e: any) => {
    const { value, checked } = e.target;
    if (checked) {
      setSelectedRoles([...selectedRoles, value]);
    } else {
      setSelectedRoles(selectedRoles.filter((role) => role !== value));
    }
  };

  const isChanged =
    associatedRoles.current.sort().toString() !==
    selectedRoles.sort().toString();

  const handleSave = async () => {
    try {
      const prev = associatedRoles.current;
      const curr = selectedRoles;
      const added = curr.filter((role) => !prev.includes(role));
      const deleted = prev.filter((role) => !curr.includes(role));

      if (added.length > 0) {
        await handleAddRoles(added);
      }
      if (deleted.length > 0) {
        await handleRemoveRoles(deleted);
      }

      updateAssociatedOrgUnit({
        entity_id: currentRoles?.entity_id!,
        roles: selectedRoles,
      });
    } catch (error) {
      message.error("Failed to Update Roles");
    }
  };

  const handleAddRoles = async (roles: number[]) => {
    const response = await updateUserOrgUnitRoles(
      { entity_id: currentRoles?.entity_id, roles: roles },
      selectedUser
    );

    if (response.status === HttpStatus.SUCCESS) {
      message.success(
        isEnglish ? "Roles Updated Successfully" : "تمت إزالة الأدوار بنجاح"
      );
    } else if (response.status === HttpStatus.FAILED) {
      message.error("Failed to Update Roles");
    } else {
      message.error("Failed to Update Roles");
    }
  };

  const handleRemoveRoles = async (roles: number[]) => {
    const response = await removeUserOrgUnitRoles(
      { entity_id: currentRoles?.entity_id, roles: roles },
      selectedUser
    );

    if (response.status === HttpStatus.SUCCESS) {
      message.success(
        isEnglish ? "Roles Removed Successfully" : "تمت إزالة الأدوار بنجاح"
      );
    } else if (response.status === HttpStatus.FAILED) {
      message.error("Failed to Update Roles");
    } else {
      message.error("Failed to Update Roles");
    }
  };

  const handleReset = () => {
    setSelectedRoles(currentRoles?.roles ?? []);
  };

  return (
    <>
      <TitleHeader
        applyReverse={false}
        heading={til.org_unit_users}
        icon={
          <InsertRowAboveOutlined
            style={{ color: theme.colors.backgroundText }}
          />
        }
      />
      <Card>
        <Row className="checkbox-container">
          {permissionRoles.map((item, index) => {
            let value = allRoles.find((f) => f.role_name === item)?.id;

            if (!value) return <></>;

            return (
              <Col key={index} span={8}>
                <div className="checkbox-item">
                  <Checkbox
                    name={item}
                    value={value}
                    checked={selectedRoles.includes(value)}
                    onChange={handleChange}
                    disabled={!enable}
                  >
                    {roleNameLists[item]?.[isEnglish ? "en" : "ar"]}
                  </Checkbox>
                </div>
              </Col>
            );
          })}
        </Row>
      </Card>
      <TitleHeader
        applyReverse={false}
        heading={til.org_unit_in_roles}
        icon={
          <InsertRowAboveOutlined
            style={{ color: theme.colors.backgroundText }}
          />
        }
      />
      <Card>
        <Row className="checkbox-container">
          {inboundRoles.map((item, index) => {
            let value = allRoles.find((f) => f.role_name === item)?.id;

            if (!value) return <></>;

            return (
              <Col key={index} span={8}>
                <div className="checkbox-item">
                  <Checkbox
                    name={item}
                    value={value}
                    checked={selectedRoles.includes(value)}
                    onChange={handleChange}
                    disabled={!enable}
                  >
                    {roleNameLists[item]?.[isEnglish ? "en" : "ar"]}
                  </Checkbox>
                </div>
              </Col>
            );
          })}
        </Row>
      </Card>
      <TitleHeader
        applyReverse={false}
        heading={til.org_unit_out_roles}
        icon={
          <InsertRowAboveOutlined
            style={{ color: theme.colors.backgroundText }}
          />
        }
      />
      <Card>
        <Row className="checkbox-container">
          {["OUTBOUND_INITIATOR"].map((item, index) => {
            let value = allRoles.find((f) => f.role_name === item)?.id;

            if (!value) return <></>;

            return (
              <Col key={index} span={8}>
                <div className="checkbox-item">
                  <Checkbox
                    name={item}
                    value={value}
                    checked={selectedRoles.includes(value)}
                    onChange={handleChange}
                    disabled={!enable}
                  >
                    {roleNameLists[item]?.[isEnglish ? "en" : "ar"]}
                  </Checkbox>
                </div>
              </Col>
            );
          })}
        </Row>
        <Row className="checkbox-container">
          {outboundRoles.map((item, index) => {
            let value = allRoles.find((f) => f.role_name === item)?.id;

            if (!value) return <></>;

            return (
              <Col key={index} span={8}>
                <div className="checkbox-item">
                  <Checkbox
                    name={item}
                    value={value}
                    checked={selectedRoles.includes(value)}
                    onChange={handleChange}
                    disabled={!enable}
                  >
                    {roleNameLists[item]?.[isEnglish ? "en" : "ar"]}
                  </Checkbox>
                </div>
              </Col>
            );
          })}
        </Row>
      </Card>
      <br />
      <Card>
        <div style={{ display: "flex", gap: 20 }}>
          <Button type="primary" disabled={!isChanged} onClick={handleSave}>
            <SaveOutlined /> {btn.save}
          </Button>

          <Button type="primary" disabled={!isChanged} onClick={handleReset}>
            <ReloadOutlined />
            {btn.reset}
          </Button>
        </div>
      </Card>
    </>
  );
};

export default AddEditRole;
