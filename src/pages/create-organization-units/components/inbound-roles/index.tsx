import { Button, Checkbox, Col, Row, message } from "antd";
import TitleHeader from "../../../../components/ui/header";
import { useLanguage } from "../../../../context/language";
import { LANGUAGE } from "../../../../constants/language";
import { englishLabels } from "../../../../constants/app-constants/en";
import { arabicLabels } from "../../../../constants/app-constants/ar";
import ExtensiveWrapper from "../extensive-wrapper";
import OrgUnitSearchOption from "../../../../components/ui/search/ou-search-actions";
import UserSearch from "../../../../components/ui/search/user";
import { MaterialInput } from "../../../../components/ui/material-input";
import { useEffect, useState } from "react";
import {
  CloseOutlined,
  SaveFilled,
  UsergroupAddOutlined,
} from "@ant-design/icons";
import { CheckboxChangeEvent } from "antd/es/checkbox";
import {
  createOrgUnitUserRole,
  fetchOrgUnitUsers,
  getAllOrganizationUnits,
  updateOUDetails,
} from "../../../../components/services/organization-units";
import {
  CreateOrgUnitUserRoles,
  OrganizationUnitType,
  OrganizationUnitRoleType,
  RoleDetails,
} from "../../../../components/services/organization-units/type";
import { HttpStatus } from "../../../../components/functional/httphelper";
import { UserType } from "../../../../components/services/user-preference/type";
import { getAllUsers } from "../../../../components/services/user-preference";

interface OrgUnitDataComponentProps {
  orgUnit?: OrganizationUnitType;
  activateLoader: (loading: boolean) => void;
}

export default function OrgUnitInboundRoles({
  activateLoader,
  orgUnit,
}: OrgUnitDataComponentProps) {
  const { language } = useLanguage();
  const isEnglish = language === LANGUAGE.ENGLISH_INT;
  const labels = isEnglish ? englishLabels : arabicLabels;
  const [allUsers, setAllUsers] = useState<UserType[]>([]);
  const [messageApi, contextHolder] = message.useMessage();
  const [filterRes, setFilterRes] = useState<OrganizationUnitRoleType>();
  const [userRolePayLoad, setUserRolePayLoad] = useState<
    CreateOrgUnitUserRoles[]
  >([]);
  const [expand, setExpand] = useState<boolean>(false);
  const [allOrgUnits, setAllOrgUnits] = useState<OrganizationUnitType[]>([]);
  const [g2gEnables, setG2GEnabled] = useState<boolean>(
    orgUnit?.enable_g2g === "true"
  );
  const [g2gSiteId, setG2GSiteId] = useState<string>("");
  const [g2gChanges, setG2G2Changes] = useState<{
    enable: boolean;
    siteId?: string;
  }>();
  const [siteIdError, setSiteIdError] = useState<boolean>(false);
  const [userRoleValues, setUserRoleValues] = useState<{
    SCAN_INDEX: string[];
    INBOUND_ROUTE_GROUP_NORMAL: string[];
    INBOUND_ROUTE_GROUP_SECRET: string[];
    INBOUND_ROUTE_GROUP_TOP_SECRET: string[];
    INBOUND_ROUTING_NORMAL: string[];
    INBOUND_ROUTING_SECRET: string[];
    INBOUND_ROUTING_TOP_SECRET: string[];
    INBOUND_CC_NORMAL: string[];
    INBOUND_CC_SECRET: string[];
    INBOUND_CC_TOP_SECRET: string[];
    G2G_INBOUND: string[];
  }>({
    SCAN_INDEX: [],
    INBOUND_ROUTE_GROUP_NORMAL: [],
    INBOUND_ROUTE_GROUP_SECRET: [],
    INBOUND_ROUTE_GROUP_TOP_SECRET: [],
    INBOUND_ROUTING_NORMAL: [],
    INBOUND_ROUTING_SECRET: [],
    INBOUND_ROUTING_TOP_SECRET: [],
    INBOUND_CC_NORMAL: [],
    INBOUND_CC_SECRET: [],
    INBOUND_CC_TOP_SECRET: [],
    G2G_INBOUND: [],
  });

  const [orgUnitRoleValues, setOrgUnitRoleValues] = useState<{
    INBOUND_ROUTING_NORMAL: string[];
    INBOUND_ROUTING_SECRET: string[];
    INBOUND_ROUTING_TOP_SECRET: string[];
    INBOUND_CC_NORMAL: string[];
    INBOUND_CC_SECRET: string[];
    INBOUND_CC_TOP_SECRET: string[];
  }>({
    INBOUND_ROUTING_NORMAL: [],
    INBOUND_ROUTING_SECRET: [],
    INBOUND_ROUTING_TOP_SECRET: [],
    INBOUND_CC_NORMAL: [],
    INBOUND_CC_SECRET: [],
    INBOUND_CC_TOP_SECRET: [],
  });

  useEffect(() => {
    init();
  }, []);

  useEffect(() => {
    if (orgUnit) {
      setG2GEnabled(orgUnit.enable_g2g === "true");
    }
  }, [orgUnit]);

  const init = async () => {
    activateLoader(true);
    await fetchAllUsersWithOptions();
    await fetchAllOrgUnitsWithOptions();
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
      messageApi.error(
        isEnglish ? "Failed to get Users" : "فشل في الحصول على المستخدمين"
      );
    }
  };

  const fetchAllOrgUnitsWithOptions = async () => {
    try {
      const response = await getAllOrganizationUnits(undefined, 1, 1000);

      if (response.status === HttpStatus.SUCCESS && response.data) {
        setAllOrgUnits(response.data.data);
      } else {
        messageApi.error(
          isEnglish ? "Failed to get OrgUnits" : "فشل في الحصول على المستخدمين"
        );
      }
    } catch (error) {
      messageApi.error(
        isEnglish ? "Failed to get OrgUnits" : "فشل في الحصول على المستخدمين"
      );
    }
  };

  const getAllOrgUnitInfo = async () => {
    const response = await fetchOrgUnitUsers(
      orgUnit?.entity_code ?? "",
      "Inbound"
    );

    if (response.status === HttpStatus.SUCCESS && response.data) {
      let data = response.data.data;

      if (data.length > 0) {
        setFilterRes(data[0]);
        const orgUnitDetails = data[0].listOrgUnitRoles;

        setG2GEnabled(
          data[0].enableG2g && data[0].enableG2g === "true" ? true : false
        );
        setG2GSiteId(data[0].g2gCode?.toString());

        const clonedUserRoles = { ...userRoleValues };
        const clonedOrgUnitRoles = { ...orgUnitRoleValues };

        clonedUserRoles.SCAN_INDEX = getRoleUserIds(
          orgUnitDetails,
          "SCAN_INDEX"
        );

        clonedUserRoles.G2G_INBOUND = getRoleUserIds(
          orgUnitDetails,
          "G2G_INBOUND"
        );

        clonedUserRoles.INBOUND_CC_NORMAL = getRoleUserIds(
          orgUnitDetails,
          "INBOUND_CC_NORMAL"
        );

        clonedUserRoles.INBOUND_CC_SECRET = getRoleUserIds(
          orgUnitDetails,
          "INBOUND_CC_SECRET"
        );

        clonedUserRoles.INBOUND_CC_TOP_SECRET = getRoleUserIds(
          orgUnitDetails,
          "INBOUND_CC_TOP_SECRET"
        );

        clonedUserRoles.INBOUND_ROUTE_GROUP_NORMAL = getRoleUserIds(
          orgUnitDetails,
          "INBOUND_ROUTE_GROUP_NORMAL"
        );

        clonedUserRoles.INBOUND_ROUTE_GROUP_SECRET = getRoleUserIds(
          orgUnitDetails,
          "INBOUND_ROUTE_GROUP_SECRET"
        );

        clonedUserRoles.INBOUND_ROUTE_GROUP_TOP_SECRET = getRoleUserIds(
          orgUnitDetails,
          "INBOUND_ROUTE_GROUP_TOP_SECRET"
        );

        clonedUserRoles.INBOUND_ROUTING_NORMAL = getRoleUserIds(
          orgUnitDetails,
          "INBOUND_ROUTING_NORMAL"
        );

        clonedUserRoles.INBOUND_ROUTING_SECRET = getRoleUserIds(
          orgUnitDetails,
          "INBOUND_ROUTING_SECRET"
        );

        clonedUserRoles.INBOUND_ROUTING_TOP_SECRET = getRoleUserIds(
          orgUnitDetails,
          "INBOUND_ROUTING_TOP_SECRET"
        );

        console.log("the cloned user details ", clonedUserRoles);

        setUserRoleValues(clonedUserRoles);

        clonedOrgUnitRoles.INBOUND_CC_NORMAL = getRoleOrgUnitIds(
          orgUnitDetails,
          "INBOUND_CC_NORMAL"
        );

        clonedOrgUnitRoles.INBOUND_CC_SECRET = getRoleOrgUnitIds(
          orgUnitDetails,
          "INBOUND_CC_SECRET"
        );

        clonedOrgUnitRoles.INBOUND_CC_TOP_SECRET = getRoleOrgUnitIds(
          orgUnitDetails,
          "INBOUND_CC_TOP_SECRET"
        );

        clonedOrgUnitRoles.INBOUND_ROUTING_NORMAL = getRoleOrgUnitIds(
          orgUnitDetails,
          "INBOUND_ROUTING_NORMAL"
        );

        clonedOrgUnitRoles.INBOUND_ROUTING_SECRET = getRoleOrgUnitIds(
          orgUnitDetails,
          "INBOUND_ROUTING_SECRET"
        );

        clonedOrgUnitRoles.INBOUND_ROUTING_TOP_SECRET = getRoleOrgUnitIds(
          orgUnitDetails,
          "INBOUND_ROUTING_TOP_SECRET"
        );

        setOrgUnitRoleValues(clonedOrgUnitRoles);
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

  const getRoleOrgUnitIds = (response?: RoleDetails[], roleName?: string) => {
    if (!response || !roleName) {
      return [];
    }

    const roleObject = response.find(
      (role: RoleDetails) => role.roleName === roleName
    );

    if (roleObject && roleObject.listOrganizationUnitDTO) {
      if (roleObject.listOrganizationUnitDTO.length > 0) {
        return roleObject.listOrganizationUnitDTO.map((u: any) => u.id);
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
    const role = getRoleDetails(filterRes?.listOrgUnitRoles, roleName);

    if (role === undefined) {
      return;
    }

    let previous = role.listOrgUnitUsers?.map((u) => u.userId);

    const previousSet = new Set(previous);
    const changesSet = new Set(changed);

    const deleted = previous?.filter((item) => !changesSet.has(item));
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

  const getOrgUnitArrayChanges = (changed: string[], roleName: string) => {
    const role = getRoleDetails(filterRes?.listOrgUnitRoles, roleName);

    if (role === undefined) {
      return;
    }

    let previous = role.listOrganizationUnitDTO?.map((u) => u.orgUnitCode);

    const previousSet = new Set(previous);
    const changesSet = new Set(changed);

    const deleted = previous?.filter((item) => !changesSet.has(item));
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
            deletedOrgUnitCode: deleted,
            orgUnitCode: added,
          };
        } else {
          return userRole;
        }
      });
      setUserRolePayLoad(filtered);
    } else {
      const newlyAddedRole: CreateOrgUnitUserRoles = {
        deletedOrgUnitCode: deleted,
        deletedUserId: [],
        orgUnitCode: added,
        orgUnitRoleId: role.orgUnitRoleId,
        userId: [],
      };
      const cloned = [...userRolePayLoad, newlyAddedRole];
      setUserRolePayLoad(cloned);
    }
  };

  const handleChange = (e: CheckboxChangeEvent) => {
    const isChecked = e.target.checked;
    setG2G2Changes((prevState) => ({
      ...prevState,
      enable: isChecked,
    }));
    setG2GEnabled(isChecked);
  };

  const submitChanges = async () => {
    activateLoader(true);
    console.log("the user role changes", userRolePayLoad);
    if (g2gChanges) {
      await updateG2GDetails();
    }

    if (userRolePayLoad) {
      const response = await createOrgUnitUserRole(userRolePayLoad);

      if (response.status === HttpStatus.SUCCESS) {
        setUserRolePayLoad([]);
        messageApi.success(
          isEnglish ? "Successfully Updated" : "تم التحديث بنجاح"
        );
      } else {
        setUserRolePayLoad([]);
        messageApi.error(
          isEnglish
            ? "Failed to update the user roles"
            : "فشل في تحديث أدوار المستخدم"
        );
      }
    }

    activateLoader(false);
  };

  const updateG2GDetails = async () => {
    if (!orgUnit?.entity_id) {
      return;
    }

    let payLoad = {
      g2gCode: g2gChanges?.siteId,
      enableG2g:
        g2gChanges?.enable && g2gChanges.enable === true ? "true" : "false",
    };

    const response = await updateOUDetails(payLoad, orgUnit?.entity_id);

    if (response.status === HttpStatus.SUCCESS) {
      messageApi.success(
        isEnglish ? "Successfully updated" : "تم التحديث بنجاح"
      );
    } else {
      messageApi.error(
        isEnglish
          ? "Something went wrong! Please contact your system administrator"
          : "حدث خطأ ما، يرجى الاتصال بمسؤول النظام"
      );
    }
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
          heading={labels.til.scan_index_group}
          icon={<UsergroupAddOutlined style={{ color: "#fff" }} />}
        />
        <Row gutter={15} style={{ marginTop: 10 }}>
          <Col span={expand ? 24 : 8}>
            <UserSearch
              multiSelect={true}
              label={labels.lbl.scanIndexUsers}
              showMore
              showMoreClicked={() => setExpand(!expand)}
              value={userRoleValues.SCAN_INDEX}
              onChange={(userValues: string[]) => {
                const clonedUserRoleValues = { ...userRoleValues };
                clonedUserRoleValues.SCAN_INDEX = userValues;
                setUserRoleValues(clonedUserRoleValues);
                getArrayChanges(userValues, "SCAN_INDEX");
              }}
            />
          </Col>
        </Row>
        <TitleHeader
          heading={labels.til.inbound_recipient_group}
          icon={<UsergroupAddOutlined style={{ color: "#fff" }} />}
        />
        <ExtensiveWrapper
          child1={
            <UserSearch
              multiSelect={true}
              label={labels.lbl.recvinbNormalUsers}
              allUsers={allUsers}
              value={userRoleValues.INBOUND_ROUTE_GROUP_NORMAL}
              onChange={(userValues: string[]) => {
                const clonedUserRoleValues = { ...userRoleValues };
                clonedUserRoleValues.INBOUND_ROUTE_GROUP_NORMAL = userValues;
                setUserRoleValues(clonedUserRoleValues);
                getArrayChanges(userValues, "INBOUND_ROUTE_GROUP_NORMAL");
              }}
            />
          }
          child2={
            <UserSearch
              multiSelect={true}
              label={labels.lbl.recvinbSecretUsers}
              allUsers={allUsers}
              value={userRoleValues.INBOUND_ROUTE_GROUP_SECRET}
              onChange={(userValues: string[]) => {
                const clonedUserRoleValues = { ...userRoleValues };
                clonedUserRoleValues.INBOUND_ROUTE_GROUP_SECRET = userValues;
                setUserRoleValues(clonedUserRoleValues);
                getArrayChanges(userValues, "INBOUND_ROUTE_GROUP_SECRET");
              }}
            />
          }
          child3={
            <UserSearch
              multiSelect={true}
              label={labels.lbl.recvinbTopSecretUsers}
              allUsers={allUsers}
              value={userRoleValues.INBOUND_ROUTE_GROUP_TOP_SECRET}
              onChange={(userValues: string[]) => {
                const clonedUserRoleValues = { ...userRoleValues };
                clonedUserRoleValues.INBOUND_ROUTE_GROUP_TOP_SECRET =
                  userValues;
                setUserRoleValues(clonedUserRoleValues);
                getArrayChanges(userValues, "INBOUND_ROUTE_GROUP_TOP_SECRET");
              }}
            />
          }
        />
        <TitleHeader
          heading={labels.til.route_user}
          icon={<UsergroupAddOutlined style={{ color: "#fff" }} />}
        />
        <ExtensiveWrapper
          child1={
            <UserSearch
              multiSelect={true}
              label={labels.lbl.inboundRoutingNormalUsers}
              allUsers={allUsers}
              value={userRoleValues.INBOUND_ROUTING_NORMAL}
              onChange={(userValues: string[]) => {
                const clonedUserRoleValues = { ...userRoleValues };
                clonedUserRoleValues.INBOUND_ROUTING_NORMAL = userValues;
                setUserRoleValues(clonedUserRoleValues);
                getArrayChanges(userValues, "INBOUND_ROUTING_NORMAL");
              }}
            />
          }
          child2={
            <UserSearch
              multiSelect={true}
              label={labels.lbl.inboundRoutingSecretUsers}
              allUsers={allUsers}
              value={userRoleValues.INBOUND_ROUTING_SECRET}
              onChange={(userValues: string[]) => {
                const clonedUserRoleValues = { ...userRoleValues };
                clonedUserRoleValues.INBOUND_ROUTING_SECRET = userValues;
                setUserRoleValues(clonedUserRoleValues);
                getArrayChanges(userValues, "INBOUND_ROUTING_SECRET");
              }}
            />
          }
          child3={
            <UserSearch
              multiSelect={true}
              label={labels.lbl.inboundRoutingTopSecretUsers}
              allUsers={allUsers}
              value={userRoleValues.INBOUND_ROUTING_TOP_SECRET}
              onChange={(userValues: string[]) => {
                const clonedUserRoleValues = { ...userRoleValues };
                clonedUserRoleValues.INBOUND_ROUTING_TOP_SECRET = userValues;
                setUserRoleValues(clonedUserRoleValues);
                getArrayChanges(userValues, "INBOUND_ROUTING_TOP_SECRET");
              }}
            />
          }
        />
        <TitleHeader
          heading={labels.til.route_orgunit}
          icon={<UsergroupAddOutlined style={{ color: "#fff" }} />}
        />
        <ExtensiveWrapper
          child1={
            <OrgUnitSearchOption
              multiSelect={true}
              enableSearch
              showMore
              allOrgUnits={allOrgUnits}
              value={orgUnitRoleValues.INBOUND_ROUTING_NORMAL}
              label={labels.lbl.inboundRoutingNormalOrgunit}
              onChange={(userValues: string[]) => {
                const clonedUserRoleValues = { ...orgUnitRoleValues };
                clonedUserRoleValues.INBOUND_ROUTING_NORMAL = userValues;
                setOrgUnitRoleValues(clonedUserRoleValues);
                getOrgUnitArrayChanges(userValues, "INBOUND_ROUTING_NORMAL");
              }}
            />
          }
          child2={
            <OrgUnitSearchOption
              multiSelect={true}
              label={labels.lbl.inboundRoutingSecretOrgunit}
              enableSearch
              showMore
              allOrgUnits={allOrgUnits}
              value={orgUnitRoleValues.INBOUND_ROUTING_SECRET}
              onChange={(userValues: string[]) => {
                const clonedUserRoleValues = { ...orgUnitRoleValues };
                clonedUserRoleValues.INBOUND_ROUTING_SECRET = userValues;
                setOrgUnitRoleValues(clonedUserRoleValues);
                getOrgUnitArrayChanges(userValues, "INBOUND_ROUTING_SECRET");
              }}
            />
          }
          child3={
            <OrgUnitSearchOption
              multiSelect={true}
              label={labels.lbl.inboundRoutingTopSecretOrgunit}
              enableSearch
              showMore
              allOrgUnits={allOrgUnits}
              value={orgUnitRoleValues.INBOUND_ROUTING_TOP_SECRET}
              onChange={(userValues: string[]) => {
                const clonedUserRoleValues = { ...orgUnitRoleValues };
                clonedUserRoleValues.INBOUND_ROUTING_TOP_SECRET = userValues;
                setOrgUnitRoleValues(clonedUserRoleValues);
                getOrgUnitArrayChanges(
                  userValues,
                  "INBOUND_ROUTING_TOP_SECRET"
                );
              }}
            />
          }
        />
        <TitleHeader
          heading={labels.til.cc_user}
          icon={<UsergroupAddOutlined style={{ color: "#fff" }} />}
        />
        <ExtensiveWrapper
          child1={
            <UserSearch
              multiSelect={true}
              label={labels.lbl.inboundCCNormalUsers}
              allUsers={allUsers}
              value={userRoleValues.INBOUND_CC_NORMAL}
              onChange={(userValues: string[]) => {
                const clonedUserRoleValues = { ...userRoleValues };
                clonedUserRoleValues.INBOUND_CC_NORMAL = userValues;
                setUserRoleValues(clonedUserRoleValues);
                getArrayChanges(userValues, "INBOUND_CC_NORMAL");
              }}
            />
          }
          child2={
            <UserSearch
              multiSelect={true}
              label={labels.lbl.inboundCCSecretUsers}
              allUsers={allUsers}
              value={userRoleValues.INBOUND_CC_SECRET}
              onChange={(userValues: string[]) => {
                const clonedUserRoleValues = { ...userRoleValues };
                clonedUserRoleValues.INBOUND_CC_SECRET = userValues;
                setUserRoleValues(clonedUserRoleValues);
                getArrayChanges(userValues, "INBOUND_CC_SECRET");
              }}
            />
          }
          child3={
            <UserSearch
              multiSelect={true}
              label={labels.lbl.inboundCCTopSecretUsers}
              allUsers={allUsers}
              value={userRoleValues.INBOUND_CC_TOP_SECRET}
              onChange={(userValues: string[]) => {
                const clonedUserRoleValues = { ...userRoleValues };
                clonedUserRoleValues.INBOUND_CC_TOP_SECRET = userValues;
                setUserRoleValues(clonedUserRoleValues);
                getArrayChanges(userValues, "INBOUND_CC_TOP_SECRET");
              }}
            />
          }
        />
        <TitleHeader
          heading={labels.til.cc_orgunit}
          icon={<UsergroupAddOutlined style={{ color: "#fff" }} />}
        />
        <ExtensiveWrapper
          child1={
            <OrgUnitSearchOption
              multiSelect={true}
              enableSearch
              showMore
              allOrgUnits={allOrgUnits}
              label={labels.lbl.inboundCCNormalOrgunit}
              value={orgUnitRoleValues.INBOUND_CC_NORMAL}
              onChange={(userValues: string[]) => {
                const clonedUserRoleValues = { ...orgUnitRoleValues };
                clonedUserRoleValues.INBOUND_CC_NORMAL = userValues;
                setOrgUnitRoleValues(clonedUserRoleValues);
                getOrgUnitArrayChanges(userValues, "INBOUND_CC_NORMAL");
              }}
            />
          }
          child2={
            <OrgUnitSearchOption
              multiSelect={true}
              label={labels.lbl.inboundCCSecretOrgunit}
              enableSearch
              showMore
              allOrgUnits={allOrgUnits}
              value={orgUnitRoleValues.INBOUND_CC_SECRET}
              onChange={(userValues: string[]) => {
                const clonedUserRoleValues = { ...orgUnitRoleValues };
                clonedUserRoleValues.INBOUND_CC_SECRET = userValues;
                setOrgUnitRoleValues(clonedUserRoleValues);
                getOrgUnitArrayChanges(userValues, "INBOUND_CC_SECRET");
              }}
            />
          }
          child3={
            <OrgUnitSearchOption
              multiSelect={true}
              label={labels.lbl.inboundCCTopSecretOrgunit}
              enableSearch
              showMore
              allOrgUnits={allOrgUnits}
              value={orgUnitRoleValues.INBOUND_CC_TOP_SECRET}
              onChange={(userValues: string[]) => {
                const clonedUserRoleValues = { ...orgUnitRoleValues };
                clonedUserRoleValues.INBOUND_CC_TOP_SECRET = userValues;
                setOrgUnitRoleValues(clonedUserRoleValues);
                getOrgUnitArrayChanges(userValues, "INBOUND_CC_TOP_SECRET");
              }}
            />
          }
        />
        <TitleHeader
          heading={labels.til.org_unit_G2G}
          icon={<UsergroupAddOutlined style={{ color: "#fff" }} />}
        />
        <Row gutter={15} style={{ marginTop: 10 }}>
          <Col
            span={8}
            style={{ display: "flex", alignItems: "center", paddingLeft: 10 }}
          >
            <Checkbox checked={g2gEnables} onChange={handleChange}>
              {labels.lbl.enableG2G}
            </Checkbox>
          </Col>
          <Col
            span={8}
            style={{
              display: "flex",
              justifyContent: "flex-end",
              flexDirection: "column",
            }}
          >
            <MaterialInput
              allowEdit={g2gEnables}
              style={{ height: 48, marginTop: 9 }}
              label={labels.lbl.g2gCode}
              value={g2gSiteId}
              onChange={(val: React.ChangeEvent<HTMLInputElement>) => {
                let textValue = val.target.value;
                const enable = g2gChanges?.enable ?? false;
                setG2GSiteId(textValue);
                setG2G2Changes({
                  enable,
                  siteId: textValue,
                });
                const regex = /^\d+$/;
                setSiteIdError(!regex.test(textValue));
              }}
              error={
                siteIdError
                  ? isEnglish
                    ? "Please enter only digits"
                    : "الرجاء إدخال أرقام فقط"
                  : ""
              }
            />
          </Col>
          <Col span={8} style={{ cursor: g2gEnables ? "auto" : "not-allowed" }}>
            <UserSearch
              multiSelect={true}
              disabled={!g2gEnables}
              label={labels.til.G2G_group}
              enableSearch={g2gEnables}
              showMore
              allUsers={allUsers}
              value={userRoleValues.G2G_INBOUND}
              onChange={(userValues: string[]) => {
                const clonedUserRoleValues = { ...userRoleValues };
                clonedUserRoleValues.G2G_INBOUND = userValues;
                setUserRoleValues(clonedUserRoleValues);
                getArrayChanges(userValues, "G2G_INBOUND");
              }}
            />
          </Col>
        </Row>
        <Col style={{ marginTop: 20 }}>
          <Button
            type="primary"
            disabled={
              siteIdError ||
              (userRolePayLoad.length === 0 && g2gChanges === undefined)
            }
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
