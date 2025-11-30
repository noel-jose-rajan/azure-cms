import { Button, Col, message } from "antd";
import TitleHeader from "../../../../components/ui/header";
import { useLanguage } from "../../../../context/language";
import { LANGUAGE } from "../../../../constants/language";
import { englishLabels } from "../../../../constants/app-constants/en";
import { arabicLabels } from "../../../../constants/app-constants/ar";
import UserSearch from "../../../../components/ui/search/user";
import ExtensiveWrapper from "../extensive-wrapper";
import {
  CloseOutlined,
  SaveFilled,
  UsergroupAddOutlined,
} from "@ant-design/icons";
import { useEffect, useState } from "react";
import {
  createOrgUnitUserRole,
  fetchOrgUnitUsers,
} from "../../../../components/services/organization-units";
import { HttpStatus } from "../../../../components/functional/httphelper";
import {
  CreateOrgUnitUserRoles,
  OrganizationUnitType,
  RoleDetails,
} from "../../../../components/services/organization-units/type";
import { getAllUsers } from "../../../../components/services/user-preference";
import { UserType } from "../../../../components/services/user-preference/type";

interface OrgUnitDataComponentProps {
  orgUnit?: OrganizationUnitType;
  activateLoader: (loading: boolean) => void;
}

export default function OrganizationUnitUsers({
  orgUnit,
  activateLoader,
}: OrgUnitDataComponentProps) {
  const { language } = useLanguage();
  const isEnglish = language === LANGUAGE.ENGLISH_INT;
  const labels = isEnglish ? englishLabels : arabicLabels;
  const [allUsers, setAllUsers] = useState<UserType[]>([]);
  const [messageApi, contextHolder] = message.useMessage();
  const [filterRes, setFilterRes] = useState<RoleDetails[]>();
  const [userRolePayLoad, setUserRolePayLoad] = useState<
    CreateOrgUnitUserRoles[]
  >([]);
  const [userRoleValues, setUserRoleValues] = useState<{
    CONSUMER_NORMAL: string[];
    CONSUMER_SECRET: string[];
    CONSUMER_TOP_SECRET: string[];
    CONTRIBUTOR_NORMAL: string[];
    CONTRIBUTOR_SECRET: string[];
    CONTRIBUTOR_TOP_SECRET: string[];
    ADMIN_NORMAL: string[];
    ADMIN_SECRET: string[];
    ADMIN_TOP_SECRET: string[];
  }>({
    CONSUMER_NORMAL: [],
    CONSUMER_SECRET: [],
    CONSUMER_TOP_SECRET: [],
    CONTRIBUTOR_NORMAL: [],
    CONTRIBUTOR_SECRET: [],
    CONTRIBUTOR_TOP_SECRET: [],
    ADMIN_NORMAL: [],
    ADMIN_SECRET: [],
    ADMIN_TOP_SECRET: [],
  });

  useEffect(() => {
    init();
  }, []);

  const init = async () => {
    activateLoader(true);
    await fetchAllUsersWithOptions();
    await getAllOrgUnitInfo();
    activateLoader(false);
  };

  const fetchAllUsersWithOptions = async () => {
    try {
      const response = await getAllUsers();

      if (response.status === HttpStatus.SUCCESS && response.data) {
        setAllUsers(response.data.data);
      } else {
        messageApi.error(
          isEnglish ? "Failed to get Users" : "فشل في الحصول على المستخدمين"
        );
      }
    } catch (error) {
      console.error("Error fetching options:", error);
      messageApi.error(
        isEnglish ? "Failed to get Users" : "فشل في الحصول على المستخدمين"
      );
    }
  };

  const getAllOrgUnitInfo = async () => {
    const response = await fetchOrgUnitUsers(
      orgUnit?.entity_code ?? "",
      "Permission"
    );

    if (response.status === HttpStatus.SUCCESS && response.data) {
      let data = response.data.data;

      if (data.length > 0) {
        const orgUnitDetails = data[0].listOrgUnitRoles;
        setFilterRes(data[0].listOrgUnitRoles);
        const clonedUserRoles = { ...userRoleValues };

        clonedUserRoles.ADMIN_NORMAL = getRoleUserIds(
          orgUnitDetails,
          "ADMIN_NORMAL"
        );
        clonedUserRoles.ADMIN_SECRET = getRoleUserIds(
          orgUnitDetails,
          "ADMIN_SECRET"
        );
        clonedUserRoles.ADMIN_TOP_SECRET = getRoleUserIds(
          orgUnitDetails,
          "ADMIN_TOP_SECRET"
        );
        clonedUserRoles.CONSUMER_NORMAL = getRoleUserIds(
          orgUnitDetails,
          "CONSUMER_NORMAL"
        );
        clonedUserRoles.CONSUMER_SECRET = getRoleUserIds(
          orgUnitDetails,
          "CONSUMER_SECRET"
        );
        clonedUserRoles.CONSUMER_TOP_SECRET = getRoleUserIds(
          orgUnitDetails,
          "CONSUMER_TOP_SECRET"
        );
        clonedUserRoles.CONTRIBUTOR_NORMAL = getRoleUserIds(
          orgUnitDetails,
          "CONTRIBUTOR_NORMAL"
        );
        clonedUserRoles.CONTRIBUTOR_SECRET = getRoleUserIds(
          orgUnitDetails,
          "CONTRIBUTOR_SECRET"
        );
        clonedUserRoles.CONTRIBUTOR_TOP_SECRET = getRoleUserIds(
          orgUnitDetails,
          "CONTRIBUTOR_TOP_SECRET"
        );

        setUserRoleValues(clonedUserRoles);
      }
    } else {
      messageApi.error(
        isEnglish ? "Failed to get Users" : "فشل في الحصول على المستخدمين"
      );
    }
  };

  const getRoleUserIds = (response?: RoleDetails[], roleName?: string) => {
    if (!response || !roleName) {
      return [];
    }

    const roleObject = response.find(
      (role: RoleDetails) => role.roleName === roleName
    );

    if (roleObject && roleObject.listOrgUnitUsers) {
      if (roleObject.listOrgUnitUsers.length > 0) {
        return roleObject.listOrgUnitUsers.map((u: any) => u.userId);
      } else {
        return [];
      }
    }

    return [];
  };

  const getRoleDetails = (
    response?: RoleDetails[],
    roleName?: string
  ): RoleDetails | undefined => {
    if (!response || !roleName) {
      return undefined;
    }

    return response.find((role: RoleDetails) => role.roleName === roleName);
  };

  const getArrayChanges = (changed: string[], roleName: string) => {
    const role = getRoleDetails(filterRes, roleName);

    if (role === undefined) {
      return;
    }

    let previous = role.listOrgUnitUsers?.map((u: any) => u.userId);

    const previousSet = new Set(previous);
    const changesSet = new Set(changed);

    const deleted = previous?.filter((item: string) => !changesSet.has(item));
    const added = changed.filter((item) => !previousSet.has(item));

    let ifExist = userRolePayLoad.find(
      (userRole: CreateOrgUnitUserRoles) =>
        userRole.orgUnitRoleId === role.orgUnitRoleId
    );

    if (ifExist) {
      const cloned = [...userRolePayLoad];
      let filtered = cloned.map((userRole) => {
        if (userRole.orgUnitRoleId === role.orgUnitRoleId) {
          return {
            ...userRole,
            deletedUserId: deleted,
            userId: added,
          };
        } else {
          return userRole;
        }
      });
      setUserRolePayLoad(filtered);
    } else {
      const newlyAddedRole: CreateOrgUnitUserRoles = {
        deletedOrgUnitCode: [],
        deletedUserId: deleted,
        orgUnitCode: [],
        orgUnitRoleId: role.orgUnitRoleId,
        userId: added,
      };
      const cloned = [...userRolePayLoad, newlyAddedRole];
      setUserRolePayLoad(cloned);
    }
  };

  const submitChanges = async () => {
    activateLoader(true);
    console.log("the user role changes", userRolePayLoad);

    const response = await createOrgUnitUserRole(userRolePayLoad);

    if (response.status === HttpStatus.SUCCESS) {
      messageApi.success(
        isEnglish ? "Successfully Updated" : "تم التحديث بنجاح"
      );
    } else {
      messageApi.error(
        isEnglish
          ? "Failed to update the user roles"
          : "فشل في تحديث أدوار المستخدم"
      );
    }

    activateLoader(false);
  };

  const resetChanges = async () => {
    activateLoader(true);
    await getAllOrgUnitInfo();
    activateLoader(false);
  };

  return (
    <>
      {contextHolder}
      <Col style={{ padding: 10 }}>
        <TitleHeader
          heading={labels.til.admin_group}
          icon={<UsergroupAddOutlined style={{ color: "#fff" }} />}
        />
        <ExtensiveWrapper
          child1={
            <UserSearch
              multiSelect={true}
              label={labels.lbl.adminNormalUsers}
              allUsers={allUsers}
              value={userRoleValues.ADMIN_NORMAL}
              onChange={(userValues: string[]) => {
                const clonedUserRoleValues = { ...userRoleValues };
                clonedUserRoleValues.ADMIN_NORMAL = userValues;
                setUserRoleValues(clonedUserRoleValues);
                getArrayChanges(userValues, "ADMIN_NORMAL");
              }}
            />
          }
          child2={
            <UserSearch
              multiSelect={true}
              label={labels.lbl.adminSecretUsers}
              allUsers={allUsers}
              value={userRoleValues.ADMIN_SECRET}
              onChange={(userValues: string[]) => {
                const clonedUserRoleValues = { ...userRoleValues };
                clonedUserRoleValues.ADMIN_SECRET = userValues;
                setUserRoleValues(clonedUserRoleValues);
                getArrayChanges(userValues, "ADMIN_SECRET");
              }}
            />
          }
          child3={
            <UserSearch
              multiSelect={true}
              label={labels.lbl.adminTopSecretUsers}
              allUsers={allUsers}
              value={userRoleValues.ADMIN_TOP_SECRET}
              onChange={(userValues: string[]) => {
                const clonedUserRoleValues = { ...userRoleValues };
                clonedUserRoleValues.ADMIN_TOP_SECRET = userValues;
                setUserRoleValues(clonedUserRoleValues);
                getArrayChanges(userValues, "ADMIN_TOP_SECRET");
              }}
            />
          }
        />
        <TitleHeader
          heading={labels.til.contributor_group}
          icon={<UsergroupAddOutlined style={{ color: "#fff" }} />}
        />
        <ExtensiveWrapper
          child1={
            <UserSearch
              multiSelect={true}
              label={labels.lbl.contributorNormalUsers}
              allUsers={allUsers}
              value={userRoleValues.CONTRIBUTOR_NORMAL}
              onChange={(userValues: string[]) => {
                const clonedUserRoleValues = { ...userRoleValues };
                clonedUserRoleValues.CONTRIBUTOR_NORMAL = userValues;
                setUserRoleValues(clonedUserRoleValues);
                getArrayChanges(userValues, "CONTRIBUTOR_NORMAL");
              }}
            />
          }
          child2={
            <UserSearch
              multiSelect={true}
              label={labels.lbl.contributorSecretUsers}
              allUsers={allUsers}
              value={userRoleValues.CONTRIBUTOR_SECRET}
              onChange={(userValues: string[]) => {
                const clonedUserRoleValues = { ...userRoleValues };
                clonedUserRoleValues.CONTRIBUTOR_SECRET = userValues;
                setUserRoleValues(clonedUserRoleValues);
                getArrayChanges(userValues, "CONTRIBUTOR_SECRET");
              }}
            />
          }
          child3={
            <UserSearch
              multiSelect={true}
              label={labels.lbl.contributorTopSecretUsers}
              allUsers={allUsers}
              value={userRoleValues.CONTRIBUTOR_TOP_SECRET}
              onChange={(userValues: string[]) => {
                const clonedUserRoleValues = { ...userRoleValues };
                clonedUserRoleValues.CONTRIBUTOR_TOP_SECRET = userValues;
                setUserRoleValues(clonedUserRoleValues);
                getArrayChanges(userValues, "CONTRIBUTOR_TOP_SECRET");
              }}
            />
          }
        />
        <TitleHeader
          heading={labels.til.consumer_group}
          icon={<UsergroupAddOutlined style={{ color: "#fff" }} />}
        />
        <ExtensiveWrapper
          child1={
            <UserSearch
              multiSelect={true}
              label={labels.lbl.consumerNormalUsers}
              allUsers={allUsers}
              value={userRoleValues.CONSUMER_NORMAL}
              onChange={(userValues: string[]) => {
                const clonedUserRoleValues = { ...userRoleValues };
                clonedUserRoleValues.CONSUMER_NORMAL = userValues;
                setUserRoleValues(clonedUserRoleValues);
                getArrayChanges(userValues, "CONSUMER_NORMAL");
              }}
            />
          }
          child2={
            <UserSearch
              multiSelect={true}
              label={labels.lbl.consumerSecretUsers}
              allUsers={allUsers}
              value={userRoleValues.CONSUMER_SECRET}
              onChange={(userValues: string[]) => {
                const clonedUserRoleValues = { ...userRoleValues };
                clonedUserRoleValues.CONSUMER_SECRET = userValues;
                setUserRoleValues(clonedUserRoleValues);
                getArrayChanges(userValues, "CONSUMER_SECRET");
              }}
            />
          }
          child3={
            <UserSearch
              multiSelect={true}
              label={labels.lbl.consumerTopSecretUsers}
              allUsers={allUsers}
              value={userRoleValues.CONSUMER_TOP_SECRET}
              onChange={(userValues: string[]) => {
                const clonedUserRoleValues = { ...userRoleValues };
                clonedUserRoleValues.CONSUMER_TOP_SECRET = userValues;
                setUserRoleValues(clonedUserRoleValues);
                getArrayChanges(userValues, "CONSUMER_TOP_SECRET");
              }}
            />
          }
        />
        <Col style={{ marginTop: 20 }}>
          <Button
            type="primary"
            disabled={userRolePayLoad.length === 0}
            onClick={submitChanges}
          >
            <SaveFilled />
            {labels.btn.save}
          </Button>
          <Button
            style={{ marginLeft: 10, marginRight: 10 }}
            onClick={resetChanges}
          >
            <CloseOutlined />
            {labels.btn.cancel}
          </Button>
        </Col>
      </Col>
    </>
  );
}
