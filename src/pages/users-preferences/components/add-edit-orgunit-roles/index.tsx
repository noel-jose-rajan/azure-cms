import { useEffect, useRef, useState, useCallback } from "react";
import OrgUnitRoles from "../org-unit-roles";
import CreateOrgUnitRoles from "../create-org-unit-roles";
import {
  getAllOrgUnitRoles,
  getUserOrgUnitRoles,
} from "@/components/services/user-preference";
import { HttpStatus } from "@/components/functional/httphelper";
import { defaultRoleData } from "../org-unit-roles/data";
import useGetAllOU from "@/store/orgs/use-get-all-ou";
import {
  UserRoleType,
  UsersOrgUnitRolesType,
} from "@/components/services/user-preference/type";
import { message } from "antd";
import { OrgUnitType } from "@/components/services/organization-units/type";

const AddOrEditOURoles = ({ userId }: { userId: number }) => {
  const { orgUnits } = useGetAllOU();
  const ouRoles = useRef<UserRoleType[]>(defaultRoleData);

  const [editRoles, setEditRoles] = useState<boolean>(false);
  const [organizationUnits, setOrganizationUnits] = useState<OrgUnitType[]>([]);
  const [associatedOrgUnit, setAssociatedOrgUnit] = useState<
    UsersOrgUnitRolesType[]
  >([]);

  useEffect(() => {
    getAllRoles();
  }, []);

  useEffect(() => {
    if (associatedOrgUnit.length > 0) {
      const filteredOUs = associatedOrgUnit.map((item) => item.entity_id);
      const usersOUList = orgUnits.filter((ou) =>
        filteredOUs?.includes(ou.id!)
      );
      setOrganizationUnits(usersOUList);
    }
  }, [associatedOrgUnit]);

  const fetchData = useCallback(async (userId: number) => {
    try {
      const response = await getUserOrgUnitRoles(userId);
      if (response.status === HttpStatus.SUCCESS && response.data) {
        setAssociatedOrgUnit(response.data.Data ?? []);
      } else {
        // setError("Failed to fetch roles data.");
      }
    } catch (error) {
      // setError("An error occurred while fetching data.");
    }
  }, []);

  useEffect(() => {
    fetchData(userId);
  }, [userId, orgUnits]);

  const getAllRoles = async () => {
    try {
      const response = await getAllOrgUnitRoles();
      if (response.status === HttpStatus.SUCCESS && response.data) {
        ouRoles.current = response.data.Data ?? defaultRoleData;
      } else {
        throw new Error("Failed to fetch all roles");
      }
    } catch (error) {
      message.error("Error fetching all roles:" + error);
      return [];
    }
  };

  return (
    <>
      {!editRoles ? (
        <OrgUnitRoles
          userId={userId.toString()}
          onAdd={() => setEditRoles(true)}
          allRoles={ouRoles.current ?? []}
          organizationUnits={organizationUnits}
          associatedOrgUnit={associatedOrgUnit}
          updateAssociatedOrgUnit={async (role) => {
            await fetchData(userId);
          }}
        />
      ) : (
        <CreateOrgUnitRoles
          userId={userId.toString()}
          onClose={() => setEditRoles(false)}
          allRoles={ouRoles.current ?? []}
          organizationUnits={organizationUnits}
          updateAssociatedOrgUnit={async (role) => {
            await fetchData(userId);
            setEditRoles(false);
          }}
        />
      )}
    </>
  );
};

export default AddOrEditOURoles;
