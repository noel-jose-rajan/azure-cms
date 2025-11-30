import { useEffect, useState } from "react";
import TitleHeader from "@/components/ui/header";
import { useLanguage } from "@/context/language";
import { Checkbox, Col, Row } from "antd";
import {
  CloseOutlined,
  SaveFilled,
  UsergroupAddOutlined,
} from "@ant-design/icons";
import SelectUsers from "@/components/shared/select-users";
import {
  getAllAllowedValues,
  updateOrgUnitAllowedValues,
} from "@/components/services/organization-units";
import { useParams } from "react-router-dom";
import { ROLES_CONSTS } from "@/constants/app-constants/roles";
import ButtonComponent from "@/components/ui/button";
import {
  OrgUnitMergedDataType,
  OrgUnitRoleType,
  updateOrgUnitRolesPayloadType,
  AllowedValueType,
  updateOrgUnitAllowedValuesPayloadType,
} from "@/components/services/organization-units/type";
import SelectOU from "@/components/shared/select-org-units";
import { useAuth } from "@/context/auth";
import useUpdateOrgUnitRoles from "@/pages/organization-units/hooks/use-update-ou-roles";
import useUpdateOrgUnitOptions from "@/pages/organization-units/hooks/use-update-ou-options";
import SelectAllAnnouncement from "./components/select-announcement";
import SelectExternalEntity from "@/components/shared/select-external-entity";
import useGetOrgUnitRoles from "@/pages/create-organization-units/hooks/use-get-org-unit-roles";
import WhileInViewWrapper from "@/animations/while-in-view-wrapper";
import LoaderComponent from "@/components/ui/loader";

type OutboundRolesState = {
  [key: string]: OrgUnitRoleType | null;
  [ROLES_CONSTS.OUTBOUND_INITIATOR]: OrgUnitRoleType | null;
  [ROLES_CONSTS.OUTBOUND_FORWARD_TO]: OrgUnitRoleType | null;
  [ROLES_CONSTS.OUTBOUND_APPROVAL_NORMAL]: OrgUnitRoleType | null;
  [ROLES_CONSTS.OUTBOUND_APPROVAL_SECRET]: OrgUnitRoleType | null;
  [ROLES_CONSTS.OUTBOUND_APPROVAL_TOP_SECRET]: OrgUnitRoleType | null;
  [ROLES_CONSTS.OUTBOUND_SENDER_NORMAL]: OrgUnitRoleType | null;
  [ROLES_CONSTS.OUTBOUND_SENDER_SECRET]: OrgUnitRoleType | null;
  [ROLES_CONSTS.OUTBOUND_SENDER_TOP_SECRET]: OrgUnitRoleType | null;
  [ROLES_CONSTS.OUTBOUND_REVIEWER_NORMAL]: OrgUnitRoleType | null;
  [ROLES_CONSTS.OUTBOUND_REVIEWER_SECRET]: OrgUnitRoleType | null;
  [ROLES_CONSTS.OUTBOUND_REVIEWER_TOP_SECRET]: OrgUnitRoleType | null;
  [ROLES_CONSTS.OUTBOUND_REVIEWER_TOP_SECRET]: OrgUnitRoleType | null;
};

const org_allow_sending = ROLES_CONSTS["ORG-ALLOW-SENDING"];
const org_allow_final_approve_org = ROLES_CONSTS["ORG-ALLOW-final-approve-org"];
const org_allow_final_approve_external =
  ROLES_CONSTS["ORG-ALLOW-final-approve-external"];
const org_allow_final_approve_announcement =
  ROLES_CONSTS["ORG-ALLOW-final-approve-announcement"];
const org_allow_approve_forward = ROLES_CONSTS["ORG-ALLOW-approve-forward"];

const org_allow_sending_id = ROLES_CONSTS["ORG-ALLOW-SENDING-id"];
const org_allow_final_approve_org_id =
  ROLES_CONSTS["ORG-ALLOW-final-approve-org-id"];
const org_allow_final_approve_external_id =
  ROLES_CONSTS["ORG-ALLOW-final-approve-external-id"];
const org_allow_final_approve_announcement_id =
  ROLES_CONSTS["ORG-ALLOW-final-approve-announcement-id"];
const org_allow_approve_forward_id =
  ROLES_CONSTS["ORG-ALLOW-approve-forward-id"];

type AllowedValuesState = {
  [key: string]: AllowedValueType;

  [org_allow_sending]: AllowedValueType;
  [org_allow_final_approve_org]: AllowedValueType;
  [org_allow_final_approve_external]: AllowedValueType;
  [org_allow_final_approve_announcement]: AllowedValueType;
  [org_allow_approve_forward]: AllowedValueType;
};
type Props = {
  orgUnit: OrgUnitMergedDataType; // Adjust type as necessary
  refreshOrgUnit: () => void;
  getOrgUnitLoading: boolean;
};
const OrgUnitOutboundRoles = ({
  orgUnit,
  refreshOrgUnit,
  getOrgUnitLoading,
}: Props) => {
  const [orgUnitOptions, setOrgUnitOptions] = useState({
    enable_review_correspondences:
      orgUnit?.enable_review_correspondences || false,
    enable_send_to_any_receiving:
      orgUnit?.enable_send_to_any_receiving || false,
    enable_final_approve_any_externals:
      orgUnit?.enable_final_approve_any_externals || false,
    enable_final_approve_any_internals:
      orgUnit?.enable_final_approve_any_internals || false,
    enable_final_approve_any_announcements:
      orgUnit?.enable_final_approve_any_announcements,
  });
  const { isAuthenticated } = useAuth();
  const { id } = useParams();
  const { labels, isEnglish } = useLanguage();
  const { loading: updateRolesLoading, handleUpdateOrgUnitRoles } =
    useUpdateOrgUnitRoles();
  const { fetchOrgUnitRoles, loading: getRolesLoading } = useGetOrgUnitRoles();
  const { loading: updateLoading, handleUpdateOrgUnit } =
    useUpdateOrgUnitOptions();
  const [isEdited, setIsEdited] = useState<boolean>(false);
  const [outboundRoles, setOutboundRoles] = useState<OutboundRolesState>({
    [ROLES_CONSTS.OUTBOUND_INITIATOR]: null,
    [ROLES_CONSTS.OUTBOUND_FORWARD_TO]: null,
    [ROLES_CONSTS.OUTBOUND_APPROVAL_NORMAL]: null,
    [ROLES_CONSTS.OUTBOUND_APPROVAL_SECRET]: null,
    [ROLES_CONSTS.OUTBOUND_APPROVAL_TOP_SECRET]: null,
    [ROLES_CONSTS.OUTBOUND_SENDER_NORMAL]: null,
    [ROLES_CONSTS.OUTBOUND_SENDER_SECRET]: null,
    [ROLES_CONSTS.OUTBOUND_SENDER_TOP_SECRET]: null,
    [ROLES_CONSTS.OUTBOUND_REVIEWER_NORMAL]: null,
    [ROLES_CONSTS.OUTBOUND_REVIEWER_SECRET]: null,
    [ROLES_CONSTS.OUTBOUND_REVIEWER_TOP_SECRET]: null,
  });

  const [allowedValues, setAllowedValues] = useState<AllowedValuesState>({
    [org_allow_sending]: {
      entities: [],
      allowed_type: org_allow_sending_id,
    },
    [org_allow_final_approve_org]: {
      entities: [],
      allowed_type: org_allow_final_approve_org_id,
    },
    [org_allow_final_approve_external]: {
      entities: [],
      allowed_type: org_allow_final_approve_external_id,
    },
    [org_allow_final_approve_announcement]: {
      entities: [],
      allowed_type: org_allow_final_approve_announcement_id,
    },
    [org_allow_approve_forward]: {
      entities: [],
      allowed_type: org_allow_approve_forward_id,
    },
  });

  const fetchAllowedValues = async () => {
    const values = await getAllAllowedValues(id || "");

    if (!values) {
      setAllowedValues({
        [org_allow_sending]: {
          entities: [],
          allowed_type: org_allow_sending_id,
        },
        [org_allow_final_approve_org]: {
          entities: [],
          allowed_type: org_allow_final_approve_org_id,
        },
        [org_allow_final_approve_external]: {
          entities: [],
          allowed_type: org_allow_final_approve_external_id,
        },
        [org_allow_final_approve_announcement]: {
          entities: [],
          allowed_type: org_allow_final_approve_announcement_id,
        },
        [org_allow_approve_forward]: {
          entities: [],
          allowed_type: org_allow_approve_forward_id,
        },
      });

      return;
    }

    const userMap = Object.fromEntries(
      values?.map((item) => [item?.allowed_type, item?.entities])
    );

    const updated = Object.fromEntries(
      Object.entries(allowedValues).map(([key, value]) => [
        key,
        { ...value, entities: userMap[value.allowed_type] ?? [] },
      ])
    );

    setAllowedValues(updated as AllowedValuesState);
  };

  const init = async () => {
    setIsEdited(false);
    const { allRoles, orgUnitRoles } = await fetchOrgUnitRoles(id || "");
    if (!allRoles || !orgUnitRoles) return;
    const filterData = {} as OutboundRolesState;
    allRoles?.forEach((role) => {
      if (!(role.role_name in outboundRoles)) return;

      const extra = orgUnitRoles[role.id];
      filterData[role.role_name] = {
        ...role,
        ...extra,
      };
    });
    setOutboundRoles(filterData);
  };

  useEffect(() => {
    if (!isAuthenticated) return;
    init();
    fetchAllowedValues();
  }, [isAuthenticated]);

  const handleChangeOrgUnitOptions = (
    key: keyof typeof orgUnitOptions,
    bool: boolean
  ) => {
    setOrgUnitOptions((prev) => ({
      ...prev,
      [key]: bool,
    }));
    setIsEdited(true);
  };

  const handleChange = (key: keyof typeof outboundRoles, users: number[]) => {
    setOutboundRoles((prev) => {
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

  const handleChangeAllowedValues = (
    key: keyof typeof allowedValues,
    entities: number[]
  ) => {
    setAllowedValues((prev) => {
      const currentValue = prev[key];
      if (!currentValue) {
        return prev;
      }

      const updatedValue: AllowedValueType = {
        ...currentValue,
        entities: [...new Set(entities)], // Ensure unique entities
      };
      return {
        ...prev,
        [key]: updatedValue,
      };
    });
    setIsEdited(true);
  };

  const handleUpdateAllowedValue = async () => {
    const payload = Object.values(allowedValues)?.map((entity) => {
      if (!entity) return [];
      const { entities = [], allowed_type } = entity;
      return {
        allowed_type,
        entities,
      };
    });
    const res = await updateOrgUnitAllowedValues(
      id || "",
      payload as updateOrgUnitAllowedValuesPayloadType
    );
  };
  const updateRoles = async () => {
    const payload = Object.values(outboundRoles)?.map((role) => {
      if (!role) return [];
      const { users, role_map_id } = role;
      return {
        role_map_id,
        users: users || [],
      };
    });

    const res = await Promise.all([
      handleUpdateOrgUnit(id || "", {
        ...orgUnitOptions,
      }),
      handleUpdateOrgUnitRoles(
        id || "",
        payload as updateOrgUnitRolesPayloadType
      ),
      handleUpdateAllowedValue(),
    ]);
    setIsEdited(false);
  };

  useEffect(() => {
    setOrgUnitOptions({
      enable_final_approve_any_announcements:
        orgUnit?.enable_final_approve_any_announcements || false,
      enable_review_correspondences:
        orgUnit?.enable_review_correspondences || false,
      enable_send_to_any_receiving:
        orgUnit?.enable_send_to_any_receiving || false,
      enable_final_approve_any_externals:
        orgUnit?.enable_final_approve_any_externals || false,
      enable_final_approve_any_internals:
        orgUnit?.enable_final_approve_any_internals || false,
    });
  }, [orgUnit]);

  return (
    <WhileInViewWrapper once={false}>
      {/* <LoaderComponent
        loading={getRolesLoading || getOrgUnitLoading}
        size="large"
      /> */}
      <Col style={{ padding: 10 }}>
        <TitleHeader
          applyReverse={false}
          heading={labels.til.outbound_initiator_group}
          icon={<UsergroupAddOutlined style={{ color: "#fff" }} />}
        />
        <Row
          gutter={15}
          style={{ marginTop: 10, display: "flex", alignItems: "end" }}
        >
          <Col span={8} sm={24} lg={8}>
            <SelectUsers
              multiSelect
              label={labels.lbl.initiatorUsers}
              value={
                outboundRoles[ROLES_CONSTS.OUTBOUND_INITIATOR]?.users || []
              }
              onChange={(users: number | number[]) => {
                handleChange(
                  ROLES_CONSTS.OUTBOUND_INITIATOR,
                  Array.isArray(users) ? users : [users]
                );
              }}
            />
          </Col>
          <Col sm={24} lg={8}>
            <SelectOU
              multiSelect
              label={labels.lbl.forwardToOrgunit}
              value={allowedValues[org_allow_approve_forward]?.entities || []}
              onChange={(entites: number | number[]) => {
                handleChangeAllowedValues(
                  ROLES_CONSTS["ORG-ALLOW-approve-forward"],
                  Array.isArray(entites) ? entites : [entites]
                );
              }}
            />
          </Col>
        </Row>
      </Col>
      <Col style={{ padding: 10 }}>
        <TitleHeader
          applyReverse={false}
          heading={labels.til.outbound_approval_group}
          icon={<UsergroupAddOutlined style={{ color: "#fff" }} />}
        />
        <Row
          gutter={15}
          style={{ marginTop: 10, display: "flex", alignItems: "end" }}
        >
          <Col span={8} sm={24} lg={8}>
            <SelectUsers
              multiSelect
              label={labels.lbl.outboundApprovalNormalUsers}
              value={
                outboundRoles[ROLES_CONSTS.OUTBOUND_APPROVAL_NORMAL]?.users ||
                []
              }
              onChange={(users: number | number[]) => {
                handleChange(
                  ROLES_CONSTS.OUTBOUND_APPROVAL_NORMAL,
                  Array.isArray(users) ? users : [users]
                );
              }}
            />
          </Col>
          <Col sm={24} lg={8}>
            <SelectUsers
              multiSelect
              label={labels.lbl.outboundApprovalSecretUsers}
              value={
                outboundRoles[ROLES_CONSTS.OUTBOUND_APPROVAL_SECRET]?.users ||
                []
              }
              onChange={(users: number | number[]) => {
                handleChange(
                  ROLES_CONSTS.OUTBOUND_APPROVAL_SECRET,
                  Array.isArray(users) ? users : [users]
                );
              }}
            />
          </Col>
          <Col sm={24} lg={8}>
            <SelectUsers
              multiSelect
              label={labels.lbl.outboundApprovalTopSecretUsers}
              value={
                outboundRoles[ROLES_CONSTS.OUTBOUND_APPROVAL_TOP_SECRET]
                  ?.users || []
              }
              onChange={(users: number | number[]) => {
                handleChange(
                  ROLES_CONSTS.OUTBOUND_APPROVAL_TOP_SECRET,
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
          heading={labels.til.outbound_sender_group}
          icon={<UsergroupAddOutlined style={{ color: "#fff" }} />}
        />
        <Row
          gutter={15}
          style={{ marginTop: 10, display: "flex", alignItems: "end" }}
        >
          <Col span={8} sm={24} lg={8}>
            <SelectUsers
              multiSelect
              label={labels.lbl.outboundSenderNormalUsers}
              value={
                outboundRoles[ROLES_CONSTS.OUTBOUND_SENDER_NORMAL]?.users || []
              }
              onChange={(users: number | number[]) => {
                handleChange(
                  ROLES_CONSTS.OUTBOUND_SENDER_NORMAL,
                  Array.isArray(users) ? users : [users]
                );
              }}
            />
          </Col>
          <Col sm={24} lg={8}>
            <SelectUsers
              multiSelect
              label={labels.lbl.outboundSenderSecretUsers}
              value={
                outboundRoles[ROLES_CONSTS.OUTBOUND_SENDER_SECRET]?.users || []
              }
              onChange={(users: number | number[]) => {
                handleChange(
                  ROLES_CONSTS.OUTBOUND_SENDER_SECRET,
                  Array.isArray(users) ? users : [users]
                );
              }}
            />
          </Col>
          <Col sm={24} lg={8}>
            <SelectUsers
              multiSelect
              label={labels.lbl.outboundSenderTopSecretUsers}
              value={
                outboundRoles[ROLES_CONSTS.OUTBOUND_SENDER_TOP_SECRET]?.users ||
                []
              }
              onChange={(users: number | number[]) => {
                handleChange(
                  ROLES_CONSTS.OUTBOUND_SENDER_TOP_SECRET,
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
          heading={labels.til.outbound_reviewer_group}
          icon={<UsergroupAddOutlined style={{ color: "#fff" }} />}
        />

        <Col
          span={24}
          style={{
            display: "flex",
            alignItems: "center",
            paddingLeft: 10,
            marginBlock: 20,
          }}
        >
          <Checkbox
            checked={orgUnitOptions.enable_review_correspondences}
            onChange={() =>
              handleChangeOrgUnitOptions(
                "enable_review_correspondences",
                !orgUnitOptions.enable_review_correspondences
              )
            }
          >
            {labels.lbl.review_correspondence}
          </Checkbox>
        </Col>

        {orgUnitOptions.enable_review_correspondences && (
          <Row
            gutter={15}
            style={{ marginTop: 10, display: "flex", alignItems: "end" }}
          >
            <Col span={8} sm={24} lg={8}>
              <SelectUsers
                multiSelect
                label={labels.lbl.outboundReviewerNormalUsers}
                value={
                  outboundRoles[ROLES_CONSTS.OUTBOUND_REVIEWER_NORMAL]?.users ||
                  []
                }
                onChange={(users: number | number[]) => {
                  handleChange(
                    ROLES_CONSTS.OUTBOUND_REVIEWER_NORMAL,
                    Array.isArray(users) ? users : [users]
                  );
                }}
              />
            </Col>
            <Col sm={24} lg={8}>
              <SelectUsers
                multiSelect
                label={labels.lbl.outboundReviewerSecretUsers}
                value={
                  outboundRoles[ROLES_CONSTS.OUTBOUND_REVIEWER_SECRET]?.users ||
                  []
                }
                onChange={(users: number | number[]) => {
                  handleChange(
                    ROLES_CONSTS.OUTBOUND_REVIEWER_SECRET,
                    Array.isArray(users) ? users : [users]
                  );
                }}
              />
            </Col>
            <Col sm={24} lg={8}>
              <SelectUsers
                multiSelect
                label={labels.lbl.outboundReviewerTopSecretUsers}
                value={
                  outboundRoles[ROLES_CONSTS.OUTBOUND_REVIEWER_TOP_SECRET]
                    ?.users || []
                }
                onChange={(users: number | number[]) => {
                  handleChange(
                    ROLES_CONSTS.OUTBOUND_REVIEWER_TOP_SECRET,
                    Array.isArray(users) ? users : [users]
                  );
                }}
              />
            </Col>
          </Row>
        )}
      </Col>
      <Col style={{ padding: 10 }}>
        <TitleHeader
          applyReverse={false}
          heading={labels.til.orgunit_outbound_announcements_decisions}
          icon={<UsergroupAddOutlined style={{ color: "#fff" }} />}
        />
      </Col>
      <Row
        gutter={25}
        style={{ marginTop: 10, display: "flex", alignItems: "end" }}
      >
        <Col
          span={24}
          style={{
            display: "flex",
            alignItems: "center",
            paddingLeft: 10,
            marginBlock: 20,
          }}
        >
          <Checkbox
            checked={orgUnitOptions.enable_final_approve_any_announcements}
            onChange={() => {
              handleChangeOrgUnitOptions(
                "enable_final_approve_any_announcements",
                !orgUnitOptions.enable_final_approve_any_announcements
              );
            }}
          >
            {isEnglish ? "enable announcement" : "تمكين التعاميم"}
          </Checkbox>
        </Col>

        <Col span={12} md={24} lg={12}>
          {orgUnitOptions.enable_final_approve_any_announcements && (
            <SelectAllAnnouncement
              label={labels.lbl.orgunit_canSendOutboundAnnouncements}
              value={
                allowedValues[
                  ROLES_CONSTS["ORG-ALLOW-final-approve-announcement"]
                ]?.entities || []
              }
              onChange={(entities: number | number[]) => {
                handleChangeAllowedValues(
                  ROLES_CONSTS["ORG-ALLOW-final-approve-announcement"],
                  Array.isArray(entities) ? entities : [entities]
                );
              }}
            />
          )}
        </Col>
      </Row>
      <Col style={{ padding: 10 }}>
        <TitleHeader
          applyReverse={false}
          heading={labels.til.outbound_restrict_recipient}
          icon={<UsergroupAddOutlined style={{ color: "#fff" }} />}
        />

        <Row
          gutter={15}
          style={{ marginTop: 10, display: "flex", alignItems: "end" }}
        >
          <Col
            span={24}
            style={{
              display: "flex",
              alignItems: "center",
              paddingLeft: 10,
              marginBlock: 20,
            }}
          >
            <Checkbox
              checked={!orgUnitOptions.enable_send_to_any_receiving}
              onChange={() => {
                handleChangeOrgUnitOptions(
                  "enable_send_to_any_receiving",
                  !orgUnitOptions.enable_send_to_any_receiving
                );
              }}
            >
              {labels.lbl.send_any_internal}
            </Checkbox>
          </Col>
          <Col span={12}>
            {!orgUnitOptions.enable_send_to_any_receiving && (
              <SelectOU
                multiSelect
                label={labels.lbl.permited_org_unit_sent_to}
                value={
                  allowedValues[ROLES_CONSTS["ORG-ALLOW-SENDING"]]?.entities ||
                  []
                }
                onChange={(entities: number | number[]) => {
                  handleChangeAllowedValues(
                    ROLES_CONSTS["ORG-ALLOW-SENDING"],
                    Array.isArray(entities) ? entities : [entities]
                  );
                }}
              />
            )}
          </Col>
        </Row>
      </Col>
      <TitleHeader
        applyReverse={false}
        heading={labels.til.outbound_restrict_final_approval}
        icon={<UsergroupAddOutlined style={{ color: "#fff" }} />}
      />
      <Row
        gutter={25}
        style={{ marginTop: 10, display: "flex", alignItems: "end" }}
      >
        <Col
          span={24}
          style={{
            display: "flex",
            alignItems: "center",
            paddingLeft: 10,
            marginBlock: 20,
          }}
        >
          <Checkbox
            checked={!orgUnitOptions.enable_final_approve_any_externals}
            onChange={() => {
              handleChangeOrgUnitOptions(
                "enable_final_approve_any_externals",
                !orgUnitOptions.enable_final_approve_any_externals
              );
            }}
          >
            {labels.lbl.final_approve_ext_out}
          </Checkbox>
        </Col>
        <Col span={12}>
          {!orgUnitOptions.enable_final_approve_any_externals && (
            <SelectExternalEntity
              multiSelect
              isRequired={false}
              label={labels.lbl.permited_ext_entity_sent_to}
              value={
                allowedValues[ROLES_CONSTS["ORG-ALLOW-final-approve-external"]]
                  ?.entities || []
              }
              onChange={(entities: number | number[]) => {
                handleChangeAllowedValues(
                  ROLES_CONSTS["ORG-ALLOW-final-approve-external"],
                  Array.isArray(entities) ? entities : [entities]
                );
              }}
            />
          )}
        </Col>
      </Row>
      <Row
        gutter={25}
        style={{ marginTop: 10, display: "flex", alignItems: "end" }}
      >
        <Col
          span={24}
          style={{
            display: "flex",
            alignItems: "center",
            paddingLeft: 10,
            marginBlock: 20,
          }}
        >
          <Checkbox
            checked={!orgUnitOptions.enable_final_approve_any_internals}
            onChange={() => {
              handleChangeOrgUnitOptions(
                "enable_final_approve_any_internals",
                !orgUnitOptions.enable_final_approve_any_internals
              );
            }}
          >
            {labels.lbl.final_approve_int_out}
          </Checkbox>
        </Col>
        <Col span={12}>
          {!orgUnitOptions.enable_final_approve_any_internals && (
            <SelectOU
              key={ROLES_CONSTS["ORG-ALLOW-final-approve-org"]}
              multiSelect
              label={labels.lbl.permited_org_unit_sent_to}
              value={
                allowedValues[ROLES_CONSTS["ORG-ALLOW-final-approve-org"]]
                  ?.entities || []
              }
              onChange={(entities: number | number[]) => {
                const uniqueEntities = entities as number[];
                handleChangeAllowedValues(
                  ROLES_CONSTS["ORG-ALLOW-final-approve-org"],
                  Array.isArray(uniqueEntities)
                    ? uniqueEntities
                    : [uniqueEntities]
                );
              }}
            />
          )}
        </Col>
      </Row>
      <Col style={{ marginTop: 20 }}>
        <ButtonComponent
          type="primary"
          onClick={updateRoles}
          icon={<SaveFilled />}
          buttonLabel={labels.btn.save}
          spinning={updateRolesLoading || updateLoading}
          disabled={!isEdited}
        />
        <ButtonComponent
          type="primary"
          onClick={async () => {
            refreshOrgUnit();
            await init();
            await fetchAllowedValues();
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

export default OrgUnitOutboundRoles;
