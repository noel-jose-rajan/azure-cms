import WhileInViewWrapper from "@/animations/while-in-view-wrapper";
import {
  OrgUnitRoleType,
  updateOrgUnitRolesPayloadType,
} from "@/components/services/organization-units/type";
import SelectUsers from "@/components/shared/select-users";
import ButtonComponent from "@/components/ui/button";
import TitleHeader from "@/components/ui/header";
import { ROLES_CONSTS } from "@/constants/app-constants/roles";
import { useLanguage } from "@/context/language";
import useGetOrgUnitRoles from "@/pages/create-organization-units/hooks/use-get-org-unit-roles";
import useUpdateOrgUnitRoles from "@/pages/organization-units/hooks/use-update-ou-roles";
import {
  CloseOutlined,
  SaveFilled,
  UsergroupAddOutlined,
} from "@ant-design/icons";
import { Col, Row } from "antd";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

type UsersRolesState = {
  [key: string]: OrgUnitRoleType | null;
  [ROLES_CONSTS.CONSUMER_NORMAL]: OrgUnitRoleType | null;
  [ROLES_CONSTS.CONSUMER_SECRET]: OrgUnitRoleType | null;
  [ROLES_CONSTS.CONSUMER_TOP_SECRET]: OrgUnitRoleType | null;

  [ROLES_CONSTS.CONTRIBUTOR_NORMAL]: OrgUnitRoleType | null;
  [ROLES_CONSTS.CONTRIBUTOR_SECRET]: OrgUnitRoleType | null;
  [ROLES_CONSTS.CONTRIBUTOR_TOP_SECRET]: OrgUnitRoleType | null;

  [ROLES_CONSTS.ADMIN_NORMAL]: OrgUnitRoleType | null;
  [ROLES_CONSTS.ADMIN_SECRET]: OrgUnitRoleType | null;
  [ROLES_CONSTS.ADMIN_TOP_SECRET]: OrgUnitRoleType | null;
};
type Props = {
  refreshOrgUnit: () => void;
};
const OrgUnitsUsers = ({ refreshOrgUnit }: Props) => {
  const { labels } = useLanguage();
  const { id } = useParams();
  const { fetchOrgUnitRoles } = useGetOrgUnitRoles();
  const [isEdited, setIsEdited] = useState(false);

  const { loading: updateRolesLoading, handleUpdateOrgUnitRoles } =
    useUpdateOrgUnitRoles();
  const [userRoles, setUsersRoles] = useState<UsersRolesState>({
    [ROLES_CONSTS.CONSUMER_NORMAL]: null,
    [ROLES_CONSTS.CONSUMER_SECRET]: null,
    [ROLES_CONSTS.CONSUMER_TOP_SECRET]: null,
    [ROLES_CONSTS.CONTRIBUTOR_NORMAL]: null,
    [ROLES_CONSTS.CONTRIBUTOR_SECRET]: null,
    [ROLES_CONSTS.CONTRIBUTOR_TOP_SECRET]: null,
    [ROLES_CONSTS.ADMIN_NORMAL]: null,
    [ROLES_CONSTS.ADMIN_SECRET]: null,
    [ROLES_CONSTS.ADMIN_TOP_SECRET]: null,
  });
  const init = async () => {
    setIsEdited(false);
    const { allRoles, orgUnitRoles } = await fetchOrgUnitRoles(id || "");
    if (!allRoles || !orgUnitRoles) return;
    const filterData = {} as UsersRolesState;
    allRoles?.forEach((role) => {
      if (!(role.role_name in userRoles)) return;

      const extra = orgUnitRoles[role.id];
      filterData[role.role_name] = {
        ...role,
        ...extra,
      };
    });
    setUsersRoles(filterData);
  };
  const handleChange = (key: keyof typeof userRoles, users: number[]) => {
    setUsersRoles((prev) => {
      const currentRole = prev[key];
      if (!currentRole) {
        return prev;
      }

      const updatedRole: OrgUnitRoleType = {
        ...currentRole, // This is now safe
        users: users,
      };
      return {
        ...prev,
        [key]: updatedRole,
      };
    });
    setIsEdited(true);
  };
  useEffect(() => {
    if (!id) return;
    init();
  }, [id]);

  const updateRoles = async () => {
    const payload = Object.values(userRoles)?.map((role) => {
      if (!role) return [];
      const { users, role_map_id } = role;
      return {
        role_map_id,
        users: users || [],
      };
    });

    await handleUpdateOrgUnitRoles(
      id || "",
      payload as updateOrgUnitRolesPayloadType
    );
    setIsEdited(false);
  };
  return (
    <WhileInViewWrapper once={false}>
      <Col style={{ padding: 10 }}>
        <TitleHeader
          applyReverse={false}
          heading={labels.til.admin_group}
          icon={<UsergroupAddOutlined style={{ color: "#fff" }} />}
        />
        <Row
          gutter={15}
          style={{ marginTop: 10, display: "flex", alignItems: "end" }}
        >
          <Col span={8} sm={24} lg={8}>
            <SelectUsers
              multiSelect
              label={labels.lbl.adminNormalUsers}
              value={userRoles[ROLES_CONSTS.ADMIN_NORMAL]?.users || []}
              onChange={(users: number | number[]) => {
                handleChange(
                  ROLES_CONSTS.ADMIN_NORMAL,
                  Array.isArray(users) ? users : [users]
                );
              }}
            />
          </Col>
          <Col sm={24} lg={8}>
            <SelectUsers
              multiSelect
              label={labels.lbl.adminSecretUsers}
              value={userRoles[ROLES_CONSTS.ADMIN_SECRET]?.users || []}
              onChange={(users: number | number[]) => {
                handleChange(
                  ROLES_CONSTS.ADMIN_SECRET,
                  Array.isArray(users) ? users : [users]
                );
              }}
            />
          </Col>
          <Col sm={24} lg={8}>
            <SelectUsers
              multiSelect
              label={labels.lbl.adminTopSecretUsers}
              value={userRoles[ROLES_CONSTS.ADMIN_TOP_SECRET]?.users || []}
              onChange={(users: number | number[]) => {
                handleChange(
                  ROLES_CONSTS.ADMIN_TOP_SECRET,
                  Array.isArray(users) ? users : [users]
                );
              }}
            />
          </Col>
        </Row>
      </Col>

      <Col style={{ padding: 10 }}>
        <TitleHeader
          applyReverse={false}
          heading={labels.til.contributor_group}
          icon={<UsergroupAddOutlined style={{ color: "#fff" }} />}
        />
        <Row
          gutter={15}
          style={{ marginTop: 10, display: "flex", alignItems: "end" }}
        >
          <Col span={8} sm={24} lg={8}>
            <SelectUsers
              multiSelect
              label={labels.lbl.contributorNormalUsers}
              value={userRoles[ROLES_CONSTS.CONTRIBUTOR_NORMAL]?.users || []}
              onChange={(users: number | number[]) => {
                handleChange(
                  ROLES_CONSTS.CONTRIBUTOR_NORMAL,
                  Array.isArray(users) ? users : [users]
                );
              }}
            />
          </Col>
          <Col sm={24} lg={8}>
            <SelectUsers
              multiSelect
              label={labels.lbl.contributorSecretUsers}
              value={userRoles[ROLES_CONSTS.CONTRIBUTOR_SECRET]?.users || []}
              onChange={(users: number | number[]) => {
                handleChange(
                  ROLES_CONSTS.CONTRIBUTOR_SECRET,
                  Array.isArray(users) ? users : [users]
                );
              }}
            />
          </Col>
          <Col sm={24} lg={8}>
            <SelectUsers
              multiSelect
              label={labels.lbl.contributorTopSecretUsers}
              value={
                userRoles[ROLES_CONSTS.CONTRIBUTOR_TOP_SECRET]?.users || []
              }
              onChange={(users: number | number[]) => {
                handleChange(
                  ROLES_CONSTS.CONTRIBUTOR_TOP_SECRET,
                  Array.isArray(users) ? users : [users]
                );
              }}
            />
          </Col>
        </Row>
      </Col>

      <Col style={{ padding: 10 }}>
        <TitleHeader
          applyReverse={false}
          heading={labels.til.consumer_group}
          icon={<UsergroupAddOutlined style={{ color: "#fff" }} />}
        />
        <Row
          gutter={15}
          style={{ marginTop: 10, display: "flex", alignItems: "end" }}
        >
          <Col span={8} sm={24} lg={8}>
            <SelectUsers
              multiSelect
              label={labels.lbl.consumerNormalUsers}
              value={userRoles[ROLES_CONSTS.CONSUMER_NORMAL]?.users || []}
              onChange={(users: number | number[]) => {
                handleChange(
                  ROLES_CONSTS.CONSUMER_NORMAL,
                  Array.isArray(users) ? users : [users]
                );
              }}
            />
          </Col>
          <Col sm={24} lg={8}>
            <SelectUsers
              multiSelect
              label={labels.lbl.consumerSecretUsers}
              value={userRoles[ROLES_CONSTS.CONSUMER_SECRET]?.users || []}
              onChange={(users: number | number[]) => {
                handleChange(
                  ROLES_CONSTS.CONSUMER_SECRET,
                  Array.isArray(users) ? users : [users]
                );
              }}
            />
          </Col>
          <Col sm={24} lg={8}>
            <SelectUsers
              multiSelect
              label={labels.lbl.consumerTopSecretUsers}
              value={userRoles[ROLES_CONSTS.CONSUMER_TOP_SECRET]?.users || []}
              onChange={(users: number | number[]) => {
                handleChange(
                  ROLES_CONSTS.CONSUMER_TOP_SECRET,
                  Array.isArray(users) ? users : [users]
                );
              }}
            />
          </Col>
        </Row>
      </Col>
      <Col style={{ marginTop: 20 }}>
        <ButtonComponent
          type="primary"
          onClick={updateRoles}
          icon={<SaveFilled />}
          buttonLabel={labels.btn.save}
          spinning={updateRolesLoading}
          disabled={!isEdited}
        />
        <ButtonComponent
          type="primary"
          onClick={async () => {
            await init();
            refreshOrgUnit();
          }}
          icon={<CloseOutlined />}
          buttonLabel={labels.btn.cancel}
          style={{ marginLeft: 10, marginRight: 10 }}
          disabled={!isEdited}
        />
      </Col>
    </WhileInViewWrapper>
  );
};

export default OrgUnitsUsers;
