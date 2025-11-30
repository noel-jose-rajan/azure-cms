import { Button, Checkbox, Col, Row, message } from "antd";
import TitleHeader from "../../../../components/ui/header";
import { useLanguage } from "../../../../context/language";
import { LANGUAGE } from "../../../../constants/language";
import { englishLabels } from "../../../../constants/app-constants/en";
import { arabicLabels } from "../../../../constants/app-constants/ar";
import {
  CloseOutlined,
  SaveFilled,
  UsergroupAddOutlined,
} from "@ant-design/icons";
import UserSearch from "../../../../components/ui/search/user";
import { useEffect, useState } from "react";
import ExtensiveWrapper from "../extensive-wrapper";
import OrgUnitSearchOption from "../../../../components/ui/search/ou-search-actions";
import AnnouncementGroupSearch from "../../../../components/ui/search/announcement-groups";
import ExternalEntitySearch from "../../../../components/ui/search/external-entity";
import {
  createOrgUnitUserRole,
  fetchOrgUnitUsers,
  getAllOrganizationUnits,
  getOrgUnitAllowedValues,
  getReviewEnabledForCorrespondence,
  orgUnitReviewEnableUpdate,
  orgUnitUpdateAllowedValues,
} from "../../../../components/services/organization-units";
import { HttpStatus } from "../../../../components/functional/httphelper";
import {
  CreateOrgUnitUserRoles,
  OrganizationUnitType,
  OrgUnitAllowedDataType,
  OrganizationUnitRoleType,
  RoleDetails,
} from "../../../../components/services/organization-units/type";
import { UserType } from "../../../../components/services/user-preference/type";
import { getAllUsers } from "../../../../components/services/user-preference";

interface OrgUnitDataComponentProps {
  orgUnit?: OrganizationUnitType;
  activateLoader: (loading: boolean) => void;
}

interface AllowedInitialDataType {
  flag: boolean;
  data: string[];
}

const defaultValues: AllowedInitialDataType = {
  data: [],
  flag: false,
};

export default function OrgUnitOutboundRoles({
  activateLoader,
  orgUnit,
}: OrgUnitDataComponentProps) {
  const { language } = useLanguage();
  const isEnglish = language === LANGUAGE.ENGLISH_INT;
  const labels = isEnglish ? englishLabels : arabicLabels;
  const [messageApi, contextHolder] = message.useMessage();
  const [allUsers, setAllUsers] = useState<UserType[]>([]);
  const [allOrgUnits, setAllOrgUnits] = useState<OrganizationUnitType[]>([]);
  const [reviewEnabled, setReviewEnabled] = useState<boolean>(false);
  const [filterRes, setFilterRes] = useState<OrganizationUnitRoleType>();
  const [expandInitiatorGroup, setExpandInitiatorGroup] =
    useState<boolean>(false);
  const [expandAnnouncement, setExpandAnnouncement] = useState<boolean>(false);
  const [userRolePayLoad, setUserRolePayLoad] = useState<
    CreateOrgUnitUserRoles[]
  >([]);
  const [currentReviewFlag, setCurrentReviewFlag] = useState<boolean>(false);
  const [userRoleValues, setUserRoleValues] = useState<{
    ANNOUNCEMENT: number[];
    DECISIONS: number[];
    OUTBOUND_APPROVAL_NORMAL: string[];
    OUTBOUND_REVIEWER_NORMAL: string[];
    OUTBOUND_SENDER_NORMAL: string[];
    OUTBOUND_APPROVAL_SECRET: string[];
    OUTBOUND_REVIEWER_SECRET: string[];
    OUTBOUND_SENDER_SECRET: string[];
    OUTBOUND_APPROVAL_TOP_SECRET: string[];
    OUTBOUND_REVIEWER_TOP_SECRET: string[];
    OUTBOUND_SENDER_TOP_SECRET: string[];
    OUTBOUND_FORWARD_TO: string[];
    OUTBOUND_INITIATOR: string[];
  }>({
    ANNOUNCEMENT: [],
    DECISIONS: [],
    OUTBOUND_APPROVAL_NORMAL: [],
    OUTBOUND_REVIEWER_NORMAL: [],
    OUTBOUND_SENDER_NORMAL: [],
    OUTBOUND_APPROVAL_SECRET: [],
    OUTBOUND_REVIEWER_SECRET: [],
    OUTBOUND_SENDER_SECRET: [],
    OUTBOUND_APPROVAL_TOP_SECRET: [],
    OUTBOUND_REVIEWER_TOP_SECRET: [],
    OUTBOUND_SENDER_TOP_SECRET: [],
    OUTBOUND_FORWARD_TO: [],
    OUTBOUND_INITIATOR: [],
  });

  const [updatedAllowedValues, setUpdatedAllowedValues] = useState<
    {
      flag: boolean;
      type: string;
      allowedCodes: string[];
    }[]
  >([]);

  const [
    canFinalApproveToAllExternalOutbound,
    setCanFinalApproveToAllExternalOutbound,
  ] = useState<AllowedInitialDataType>(defaultValues);

  const [
    canFinalApproveToAllInternalOutbound,
    setCanFinalApproveToAllInternalOutbound,
  ] = useState<AllowedInitialDataType>(defaultValues);

  const [
    canSendToAllInternalReceivingEntities,
    setCanSendToAllInternalReceivingEntities,
  ] = useState<AllowedInitialDataType>(defaultValues);

  useEffect(() => {
    init();
  }, []);

  useEffect(() => {
    if (orgUnit) {
      configureOrUnitData();
    }
  }, [orgUnit]);

  const configureOrUnitData = async () => {
    await getAllOrgUnitInfo();
    await fetchReviewEnabled();
    await getAllowedOrgOptions();
  };

  const init = async () => {
    activateLoader(true);
    await fetchAllUsersWithOptions();
    await fetchAllOrgUnitsWithOptions();
    activateLoader(false);
  };

  const fetchReviewEnabled = async () => {
    if (orgUnit?.entity_id) {
      const response = await getReviewEnabledForCorrespondence(
        orgUnit?.entity_id
      );

      if (response.status === HttpStatus.SUCCESS && response.data) {
        if (response.data.data.length > 0) {
          let data = response.data.data[0];
          setReviewEnabled(
            data.canReviewCorrespondences === "true" ? true : false
          );
          setCurrentReviewFlag(
            data.canReviewCorrespondences === "true" ? true : false
          );
        }
      }
    }
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
        setAllOrgUnits(response.data.data ?? []);
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

  const getRoleDetails = (
    response?: RoleDetails[],
    roleName?: string
  ): RoleDetails | undefined => {
    if (!response || !roleName) {
      return undefined;
    }

    return response.find((role: RoleDetails) => role.roleName === roleName);
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

  const getAnnounceGroups = (response?: RoleDetails[], roleName?: string) => {
    if (!response || !roleName) {
      return [];
    }

    const roleObject = response.find(
      (role: RoleDetails) => role.roleName === roleName
    );

    if (roleObject && roleObject.listOrgUnitGroups) {
      if (roleObject.listOrgUnitGroups.length > 0) {
        return roleObject.listOrgUnitGroups.map((u: any) => u.id);
      } else {
        return [];
      }
    }

    return [];
  };

  const filterAllowedCodeData = (
    response: OrgUnitAllowedDataType,
    type: string
  ): string[] => {
    let theFilteredValues: string[] = [];
    const finalApproval = response.allowedValues.find(
      (value) => value.type === type
    );

    if (
      finalApproval &&
      finalApproval.allowedCodes &&
      finalApproval.allowedCodes.length > 0
    ) {
      theFilteredValues = finalApproval.allowedCodes.map(
        (code) => code.allowedCode
      );
    }

    return theFilteredValues;
  };

  const getTheActiveFlag = (
    response: OrgUnitAllowedDataType,
    type: string
  ): boolean => {
    let theFilteredValues: boolean = false;
    const finalApproval = response.allowedValues.find(
      (value) => value.type === type
    );

    if (finalApproval) {
      theFilteredValues = finalApproval.flag;
    }

    return theFilteredValues;
  };

  const getAllowedOrgOptions = async () => {
    const response = await getOrgUnitAllowedValues(orgUnit?.entity_id);

    if (response.status === HttpStatus.SUCCESS && response.data) {
      if (response.data.data.length > 0) {
        const data = response.data.data[0];
        const clonedApprovalToAllExternal = {
          ...canFinalApproveToAllExternalOutbound,
        };
        clonedApprovalToAllExternal.flag = getTheActiveFlag(
          data,
          "canFinalApproveToAllExternalOutbound"
        );
        clonedApprovalToAllExternal.data = filterAllowedCodeData(
          data,
          "canFinalApproveToAllExternalOutbound"
        );
        setCanFinalApproveToAllExternalOutbound(clonedApprovalToAllExternal);

        const clonedApprovalToAllInternal = {
          ...canFinalApproveToAllInternalOutbound,
        };
        clonedApprovalToAllInternal.flag = getTheActiveFlag(
          data,
          "canFinalApproveToAllInternalOutbound"
        );
        clonedApprovalToAllInternal.data = filterAllowedCodeData(
          data,
          "canFinalApproveToAllInternalOutbound"
        );
        setCanFinalApproveToAllInternalOutbound(clonedApprovalToAllInternal);

        const clonedSendToAllEntity = {
          ...canSendToAllInternalReceivingEntities,
        };
        clonedSendToAllEntity.flag = getTheActiveFlag(
          data,
          "canSendToAllInternalReceivingEntities"
        );
        clonedSendToAllEntity.data = filterAllowedCodeData(
          data,
          "canSendToAllInternalReceivingEntities"
        );
        setCanSendToAllInternalReceivingEntities(clonedSendToAllEntity);
      }
    } else {
    }
  };

  const getAllOrgUnitInfo = async () => {
    const response = await fetchOrgUnitUsers(
      orgUnit?.entity_code ?? "",
      "Outbound"
    );
    if (response.status === HttpStatus.SUCCESS && response.data) {
      let data = response.data.data;

      if (data.length > 0) {
        setFilterRes(data[0]);
        const orgUnitDetails = data[0].listOrgUnitRoles;

        const clonedUserRoles = { ...userRoleValues };

        clonedUserRoles.ANNOUNCEMENT = getAnnounceGroups(
          orgUnitDetails,
          "ANNOUNCEMENT"
        );

        clonedUserRoles.DECISIONS = getAnnounceGroups(
          orgUnitDetails,
          "DECISIONS"
        );

        clonedUserRoles.OUTBOUND_APPROVAL_NORMAL = getRoleUserIds(
          orgUnitDetails,
          "OUTBOUND_APPROVAL_NORMAL"
        );

        clonedUserRoles.OUTBOUND_APPROVAL_SECRET = getRoleUserIds(
          orgUnitDetails,
          "OUTBOUND_APPROVAL_SECRET"
        );

        clonedUserRoles.OUTBOUND_APPROVAL_TOP_SECRET = getRoleUserIds(
          orgUnitDetails,
          "OUTBOUND_APPROVAL_TOP_SECRET"
        );

        clonedUserRoles.OUTBOUND_FORWARD_TO = getRoleOrgUnitIds(
          orgUnitDetails,
          "OUTBOUND_FORWARD_TO"
        );

        clonedUserRoles.OUTBOUND_INITIATOR = getRoleUserIds(
          orgUnitDetails,
          "OUTBOUND_INITIATOR"
        );

        clonedUserRoles.OUTBOUND_REVIEWER_NORMAL = getRoleUserIds(
          orgUnitDetails,
          "OUTBOUND_REVIEWER_NORMAL"
        );

        clonedUserRoles.OUTBOUND_REVIEWER_SECRET = getRoleUserIds(
          orgUnitDetails,
          "OUTBOUND_REVIEWER_SECRET"
        );

        clonedUserRoles.OUTBOUND_REVIEWER_TOP_SECRET = getRoleUserIds(
          orgUnitDetails,
          "OUTBOUND_REVIEWER_TOP_SECRET"
        );

        clonedUserRoles.OUTBOUND_SENDER_NORMAL = getRoleUserIds(
          orgUnitDetails,
          "OUTBOUND_SENDER_NORMAL"
        );

        clonedUserRoles.OUTBOUND_SENDER_SECRET = getRoleUserIds(
          orgUnitDetails,
          "OUTBOUND_SENDER_SECRET"
        );

        clonedUserRoles.OUTBOUND_SENDER_TOP_SECRET = getRoleUserIds(
          orgUnitDetails,
          "OUTBOUND_SENDER_TOP_SECRET"
        );

        setUserRoleValues(clonedUserRoles);
      }
    } else {
      messageApi.error(
        isEnglish ? "Failed to get Users" : "فشل في الحصول على المستخدمين"
      );
    }
  };

  const getArrayChanges = (changed: string[], roleName: string) => {
    const role = getRoleDetails(filterRes?.listOrgUnitRoles, roleName);

    if (role === undefined) {
      return;
    }

    let previous = role.listOrgUnitUsers?.map((u) => u.userId) ?? [];

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

      console.log("console log", cloned);

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

  const announcementGroupChanges = (changed: number[], roleName: string) => {
    const role = getRoleDetails(filterRes?.listOrgUnitRoles, roleName);

    if (role === undefined) {
      return;
    }

    let previous = role.listOrgUnitGroups?.map((u) => u.groupId);

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
            deletedGroups: deleted,
            groups: added,
          };
        } else {
          return userRole;
        }
      });
      setUserRolePayLoad(filtered);
    } else {
      const newlyAddedRole: CreateOrgUnitUserRoles = {
        deletedOrgUnitCode: [],
        deletedUserId: [],
        orgUnitCode: [],
        orgUnitRoleId: role.orgUnitRoleId,
        userId: [],
        deletedGroups: deleted,
        groups: added,
      };
      const cloned = [...userRolePayLoad, newlyAddedRole];
      setUserRolePayLoad(cloned);
    }
  };

  const saveUpdatedChanges = async () => {
    activateLoader(true);

    if (userRolePayLoad.length > 0) {
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

    if (updatedAllowedValues.length > 0) {
      let payLoad = {
        orgunitId: orgUnit?.entity_id,
        allowedEntity: updatedAllowedValues,
      };

      let allowedResponse = await orgUnitUpdateAllowedValues(payLoad);

      if (allowedResponse.status === HttpStatus.SUCCESS) {
        setUpdatedAllowedValues([]);
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

    if (currentReviewFlag !== reviewEnabled) {
      const updateReviewFlagResponse = await orgUnitReviewEnableUpdate(
        orgUnit?.entity_id,
        reviewEnabled
      );
      if (!updateReviewFlagResponse) {
        setUserRolePayLoad([]);
        messageApi.error(
          isEnglish
            ? "Failed to update the Review enable/disable"
            : "فشل في تحديث تمكين المراجعة"
        );
      }
    }

    activateLoader(false);
  };

  const updateChangesInAllowedValues = async (
    codes: string[],
    type: string,
    flag: boolean
  ) => {
    const clonedValues = [...updatedAllowedValues];

    const ifExist = clonedValues.find((value) => value.type == type);

    if (ifExist) {
      let filtered = clonedValues.map((allowedVal) => {
        if (allowedVal.type === type) {
          return {
            type: type,
            allowedCodes: codes,
            flag: flag,
          };
        } else {
          return allowedVal;
        }
      });

      setUpdatedAllowedValues(filtered);
    } else {
      let addNew = {
        allowedCodes: codes,
        type: type,
        flag: flag,
      };

      setUpdatedAllowedValues([...clonedValues, addNew]);
    }
  };

  const resetChanges = async () => {
    activateLoader(true);
    await getAllOrgUnitInfo();
    activateLoader(false);
  };

  return (
    <Col style={{ padding: 10 }}>
      {contextHolder}
      <TitleHeader
        heading={labels.til.outbound_initiator_group}
        icon={<UsergroupAddOutlined style={{ color: "#fff" }} />}
      />
      <Row gutter={15} style={{ marginTop: 10 }}>
        <Col span={expandInitiatorGroup ? 24 : 8}>
          <UserSearch
            multiSelect={true}
            label={labels.lbl.initiatorUsers}
            allUsers={allUsers}
            value={userRoleValues.OUTBOUND_INITIATOR}
            showMore
            onChange={(userValues: string[]) => {
              const clonedUserRoleValues = { ...userRoleValues };
              clonedUserRoleValues.OUTBOUND_INITIATOR = userValues;
              setUserRoleValues(clonedUserRoleValues);
              getArrayChanges(userValues, "OUTBOUND_INITIATOR");
            }}
            showMoreClicked={() =>
              setExpandInitiatorGroup(!expandInitiatorGroup)
            }
          />
        </Col>
        <Col span={8}></Col>
        <Col span={expandInitiatorGroup ? 24 : 8}>
          <OrgUnitSearchOption
            multiSelect={true}
            label={labels.lbl.forwardToOrgunit}
            enableSearch
            showMore
            allOrgUnits={allOrgUnits}
            value={userRoleValues.OUTBOUND_FORWARD_TO}
            onChange={(userValues: string[]) => {
              const clonedUserRoleValues = { ...userRoleValues };
              clonedUserRoleValues.OUTBOUND_FORWARD_TO = userValues;
              setUserRoleValues(clonedUserRoleValues);
              getOrgUnitArrayChanges(userValues, "OUTBOUND_FORWARD_TO");
            }}
            showMoreClicked={() =>
              setExpandInitiatorGroup(!expandInitiatorGroup)
            }
          />
        </Col>
      </Row>
      <TitleHeader
        heading={labels.til.outbound_approval_group}
        icon={<UsergroupAddOutlined style={{ color: "#fff" }} />}
      />
      <ExtensiveWrapper
        child1={
          <UserSearch
            multiSelect={true}
            label={labels.lbl.outboundApprovalNormalUsers}
            allUsers={allUsers}
            value={userRoleValues.OUTBOUND_APPROVAL_NORMAL}
            onChange={(userValues: string[]) => {
              const clonedUserRoleValues = { ...userRoleValues };
              clonedUserRoleValues.OUTBOUND_APPROVAL_NORMAL = userValues;
              setUserRoleValues(clonedUserRoleValues);
              getArrayChanges(userValues, "OUTBOUND_APPROVAL_NORMAL");
            }}
          />
        }
        child2={
          <UserSearch
            multiSelect={true}
            label={labels.lbl.outboundApprovalSecretUsers}
            allUsers={allUsers}
            value={userRoleValues.OUTBOUND_APPROVAL_SECRET}
            onChange={(userValues: string[]) => {
              const clonedUserRoleValues = { ...userRoleValues };
              clonedUserRoleValues.OUTBOUND_APPROVAL_SECRET = userValues;
              setUserRoleValues(clonedUserRoleValues);
              getArrayChanges(userValues, "OUTBOUND_APPROVAL_SECRET");
            }}
          />
        }
        child3={
          <UserSearch
            multiSelect={true}
            label={labels.lbl.outboundApprovalTopSecretUsers}
            allUsers={allUsers}
            value={userRoleValues.OUTBOUND_APPROVAL_TOP_SECRET}
            onChange={(userValues: string[]) => {
              const clonedUserRoleValues = { ...userRoleValues };
              clonedUserRoleValues.OUTBOUND_APPROVAL_TOP_SECRET = userValues;
              setUserRoleValues(clonedUserRoleValues);
              getArrayChanges(userValues, "OUTBOUND_APPROVAL_TOP_SECRET");
            }}
          />
        }
      />
      <TitleHeader
        heading={labels.til.outbound_sender_group}
        icon={<UsergroupAddOutlined style={{ color: "#fff" }} />}
      />
      <ExtensiveWrapper
        child1={
          <UserSearch
            multiSelect={true}
            label={labels.lbl.outboundSenderNormalUsers}
            allUsers={allUsers}
            value={userRoleValues.OUTBOUND_SENDER_NORMAL}
            onChange={(userValues: string[]) => {
              const clonedUserRoleValues = { ...userRoleValues };
              clonedUserRoleValues.OUTBOUND_SENDER_NORMAL = userValues;
              setUserRoleValues(clonedUserRoleValues);
              getArrayChanges(userValues, "OUTBOUND_SENDER_NORMAL");
            }}
          />
        }
        child2={
          <UserSearch
            multiSelect={true}
            label={labels.lbl.outboundSenderSecretUsers}
            allUsers={allUsers}
            value={userRoleValues.OUTBOUND_SENDER_SECRET}
            onChange={(userValues: string[]) => {
              const clonedUserRoleValues = { ...userRoleValues };
              clonedUserRoleValues.OUTBOUND_SENDER_SECRET = userValues;
              setUserRoleValues(clonedUserRoleValues);
              getArrayChanges(userValues, "OUTBOUND_SENDER_SECRET");
            }}
          />
        }
        child3={
          <UserSearch
            multiSelect={true}
            label={labels.lbl.outboundSenderTopSecretUsers}
            allUsers={allUsers}
            value={userRoleValues.OUTBOUND_SENDER_TOP_SECRET}
            onChange={(userValues: string[]) => {
              const clonedUserRoleValues = { ...userRoleValues };
              clonedUserRoleValues.OUTBOUND_SENDER_TOP_SECRET = userValues;
              setUserRoleValues(clonedUserRoleValues);
              getArrayChanges(userValues, "OUTBOUND_SENDER_TOP_SECRET");
            }}
          />
        }
      />
      <TitleHeader
        heading={labels.til.outbound_reviewer_group}
        icon={<UsergroupAddOutlined style={{ color: "#fff" }} />}
      />
      <Col
        span={8}
        style={{
          display: "flex",
          alignItems: "center",
          paddingLeft: 10,
          marginTop: 20,
        }}
      >
        <Checkbox
          checked={reviewEnabled}
          onChange={() => setReviewEnabled(!reviewEnabled)}
        >
          {labels.lbl.review_correspondence}
        </Checkbox>
      </Col>
      {reviewEnabled && (
        <ExtensiveWrapper
          child1={
            <UserSearch
              multiSelect={true}
              label={labels.lbl.outboundReviewerNormalUsers}
              allUsers={allUsers}
              value={userRoleValues.OUTBOUND_REVIEWER_NORMAL}
              onChange={(userValues: string[]) => {
                const clonedUserRoleValues = { ...userRoleValues };
                clonedUserRoleValues.OUTBOUND_REVIEWER_NORMAL = userValues;
                setUserRoleValues(clonedUserRoleValues);
                getArrayChanges(userValues, "OUTBOUND_REVIEWER_NORMAL");
              }}
            />
          }
          child2={
            <UserSearch
              multiSelect={true}
              label={labels.lbl.outboundReviewerSecretUsers}
              allUsers={allUsers}
              value={userRoleValues.OUTBOUND_REVIEWER_SECRET}
              onChange={(userValues: string[]) => {
                const clonedUserRoleValues = { ...userRoleValues };
                clonedUserRoleValues.OUTBOUND_REVIEWER_SECRET = userValues;
                setUserRoleValues(clonedUserRoleValues);
                getArrayChanges(userValues, "OUTBOUND_REVIEWER_SECRET");
              }}
            />
          }
          child3={
            <UserSearch
              multiSelect={true}
              label={labels.lbl.outboundReviewerTopSecretUsers}
              allUsers={allUsers}
              value={userRoleValues.OUTBOUND_REVIEWER_TOP_SECRET}
              onChange={(userValues: string[]) => {
                const clonedUserRoleValues = { ...userRoleValues };
                clonedUserRoleValues.OUTBOUND_REVIEWER_TOP_SECRET = userValues;
                setUserRoleValues(clonedUserRoleValues);
                getArrayChanges(userValues, "OUTBOUND_REVIEWER_TOP_SECRET");
              }}
            />
          }
        />
      )}

      <TitleHeader
        heading={labels.til.orgunit_outbound_announcements_decisions}
        icon={<UsergroupAddOutlined style={{ color: "#fff" }} />}
      />
      <Row gutter={24} style={{ marginTop: 10 }}>
        <Col span={expandAnnouncement ? 24 : 12}>
          <AnnouncementGroupSearch
            multiSelect={true}
            label={labels.lbl.orgunit_canSendOutboundAnnouncements}
            showMore
            showMoreClicked={() => setExpandAnnouncement(!expandAnnouncement)}
            value={userRoleValues.ANNOUNCEMENT}
            onChange={(userValues: number[]) => {
              const clonedUserRoleValues = { ...userRoleValues };
              clonedUserRoleValues.ANNOUNCEMENT = userValues;
              setUserRoleValues(clonedUserRoleValues);
              announcementGroupChanges(userValues, "ANNOUNCEMENT");
            }}
          />
        </Col>
        <Col span={expandAnnouncement ? 24 : 12}>
          <AnnouncementGroupSearch
            multiSelect={true}
            label={labels.lbl.orgunit_canSendOutboundDecisions}
            showMore
            showMoreClicked={() => setExpandAnnouncement(!expandAnnouncement)}
            value={userRoleValues.DECISIONS}
            onChange={(userValues: number[]) => {
              const clonedUserRoleValues = { ...userRoleValues };
              clonedUserRoleValues.DECISIONS = userValues;
              setUserRoleValues(clonedUserRoleValues);
              announcementGroupChanges(userValues, "DECISIONS");
            }}
          />
        </Col>
      </Row>
      <TitleHeader
        heading={labels.til.outbound_restrict_recipient}
        icon={<UsergroupAddOutlined style={{ color: "#fff" }} />}
      />
      <Row gutter={25} style={{ marginTop: 10 }}>
        <Col
          span={8}
          md={8}
          sm={24}
          style={{ display: "flex", alignItems: "center", paddingLeft: 20 }}
        >
          <Checkbox
            checked={canSendToAllInternalReceivingEntities.flag}
            onChange={() => {
              const clonedUserRoleValues = {
                ...canSendToAllInternalReceivingEntities,
              };
              clonedUserRoleValues.flag =
                !canSendToAllInternalReceivingEntities.flag;
              setCanSendToAllInternalReceivingEntities(clonedUserRoleValues);
              updateChangesInAllowedValues(
                canSendToAllInternalReceivingEntities.data,
                "canSendToAllInternalReceivingEntities",
                !canSendToAllInternalReceivingEntities.flag
              );
            }}
          >
            {labels.lbl.send_any_internal}
          </Checkbox>
        </Col>
        <Col span={12}>
          {canSendToAllInternalReceivingEntities.flag && (
            <OrgUnitSearchOption
              code
              multiSelect={true}
              label={labels.lbl.permited_org_unit_sent_to}
              enableSearch
              allOrgUnits={allOrgUnits}
              value={canSendToAllInternalReceivingEntities.data}
              onChange={(userValues: string[]) => {
                const clonedUserRoleValues = {
                  ...canSendToAllInternalReceivingEntities,
                };
                canSendToAllInternalReceivingEntities.data = userValues;
                setCanSendToAllInternalReceivingEntities(clonedUserRoleValues);
                updateChangesInAllowedValues(
                  userValues,
                  "canSendToAllInternalReceivingEntities",
                  canSendToAllInternalReceivingEntities.flag
                );
              }}
            />
          )}
        </Col>
      </Row>
      <TitleHeader
        heading={labels.til.outbound_restrict_final_approval}
        icon={<UsergroupAddOutlined style={{ color: "#fff" }} />}
      />
      <Row gutter={25} style={{ marginTop: 10 }}>
        <Col
          span={8}
          md={8}
          sm={24}
          style={{ display: "flex", alignItems: "center", paddingLeft: 20 }}
        >
          <Checkbox
            checked={canFinalApproveToAllExternalOutbound.flag}
            onChange={() => {
              const clonedUserRoleValues = {
                ...canFinalApproveToAllExternalOutbound,
              };
              clonedUserRoleValues.flag =
                !canFinalApproveToAllExternalOutbound.flag;
              setCanFinalApproveToAllExternalOutbound(clonedUserRoleValues);
              updateChangesInAllowedValues(
                canFinalApproveToAllExternalOutbound.data,
                "canFinalApproveToAllExternalOutbound",
                !canFinalApproveToAllExternalOutbound.flag
              );
            }}
          >
            {labels.lbl.final_approve_ext_out}
          </Checkbox>
        </Col>
        <Col span={12}>
          {canFinalApproveToAllExternalOutbound.flag && (
            <ExternalEntitySearch
              multiSelect={true}
              idRequired={false}
              label={labels.lbl.permited_ext_entity_sent_to}
              enableSearch
              value={canFinalApproveToAllExternalOutbound.data}
              onChange={(values: string[]) => {
                console.log("the chaned values", values);
                const clonedUserRoleValues = {
                  ...canFinalApproveToAllExternalOutbound,
                };
                canFinalApproveToAllExternalOutbound.data = values;
                setCanFinalApproveToAllExternalOutbound(clonedUserRoleValues);
                updateChangesInAllowedValues(
                  values,
                  "canFinalApproveToAllExternalOutbound",
                  canFinalApproveToAllExternalOutbound.flag
                );
              }}
            />
          )}
        </Col>
      </Row>
      <Row gutter={25} style={{ marginTop: 25 }}>
        <Col
          span={8}
          md={8}
          sm={24}
          style={{
            display: "flex",
            alignItems: "center",
            paddingLeft: 20,
          }}
        >
          <Checkbox
            checked={canFinalApproveToAllInternalOutbound.flag}
            onChange={() => {
              const clonedUserRoleValues = {
                ...canFinalApproveToAllInternalOutbound,
              };
              clonedUserRoleValues.flag =
                !canFinalApproveToAllInternalOutbound.flag;

              setCanFinalApproveToAllInternalOutbound(clonedUserRoleValues);
              updateChangesInAllowedValues(
                canFinalApproveToAllInternalOutbound.data,
                "canFinalApproveToAllInternalOutbound",
                !canFinalApproveToAllInternalOutbound.flag
              );
            }}
          >
            {labels.lbl.final_approve_int_out}
          </Checkbox>
        </Col>
        <Col span={12}>
          {canFinalApproveToAllInternalOutbound.flag && (
            <OrgUnitSearchOption
              code
              multiSelect={true}
              label={labels.lbl.permited_org_unit_sent_to}
              enableSearch
              allOrgUnits={allOrgUnits}
              value={canFinalApproveToAllInternalOutbound.data}
              onChange={(userValues: string[]) => {
                const clonedUserRoleValues = {
                  ...canFinalApproveToAllInternalOutbound,
                };
                canFinalApproveToAllInternalOutbound.data = userValues;
                setCanFinalApproveToAllInternalOutbound(clonedUserRoleValues);
                updateChangesInAllowedValues(
                  userValues,
                  "canFinalApproveToAllInternalOutbound",
                  canFinalApproveToAllInternalOutbound.flag
                );
              }}
            />
          )}
        </Col>
      </Row>
      <Col style={{ marginTop: 20 }}>
        <Button type="primary" onClick={saveUpdatedChanges}>
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
  );
}
