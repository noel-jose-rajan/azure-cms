import WhileInViewWrapper from "@/animations/while-in-view-wrapper";
import useHandleError from "@/components/hooks/useHandleError";
import {
  getAllAllowedValues,
  updateOrgUnitAllowedValues,
} from "@/components/services/organization-units";
import {
  AllowedValueType,
  OrgUnitMergedDataType,
  OrgUnitRoleType,
  updateOrgUnitAllowedValuesPayloadType,
  updateOrgUnitRolesPayloadType,
} from "@/components/services/organization-units/type";
import SelectOU from "@/components/shared/select-org-units";
import SelectUsers from "@/components/shared/select-users";
import ButtonComponent from "@/components/ui/button";
import TitleHeader from "@/components/ui/header";
import { MaterialInput } from "@/components/ui/material-input";
import { ROLES_CONSTS } from "@/constants/app-constants/roles";
import { useLanguage } from "@/context/language";
import useGetOrgUnitRoles from "@/pages/create-organization-units/hooks/use-get-org-unit-roles";
import useUpdateOrgUnitOptions from "@/pages/organization-units/hooks/use-update-ou-options";
import useUpdateOrgUnitRoles from "@/pages/organization-units/hooks/use-update-ou-roles";
import {
  CloseOutlined,
  SaveFilled,
  UsergroupAddOutlined,
} from "@ant-design/icons";
import { Checkbox, Col, Row } from "antd";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

type InoundRolesState = {
  [key: string]: OrgUnitRoleType | null;
  [ROLES_CONSTS.SCAN_INDEX]: OrgUnitRoleType | null;

  [ROLES_CONSTS.INBOUND_ROUTING_NORMAL]: OrgUnitRoleType | null;
  [ROLES_CONSTS.INBOUND_ROUTING_SECRET]: OrgUnitRoleType | null;
  [ROLES_CONSTS.INBOUND_ROUTING_TOP_SECRET]: OrgUnitRoleType | null;

  [ROLES_CONSTS.INBOUND_ROUTE_GROUP_NORMAL]: OrgUnitRoleType | null;
  [ROLES_CONSTS.INBOUND_ROUTE_GROUP_SECRET]: OrgUnitRoleType | null;
  [ROLES_CONSTS.INBOUND_ROUTE_GROUP_TOP_SECRET]: OrgUnitRoleType | null;

  [ROLES_CONSTS.INBOUND_CC_NORMAL]: OrgUnitRoleType | null;
  [ROLES_CONSTS.INBOUND_CC_SECRET]: OrgUnitRoleType | null;
  [ROLES_CONSTS.INBOUND_CC_TOP_SECRET]: OrgUnitRoleType | null;
};
const ORG_ALLOW_INBOUND_ROUTE_ORG_NORMAL =
  ROLES_CONSTS["ORG-ALLOW-INBOUND-ROUTE-ORG-NORMAL"];
const ORG_ALLOW_INBOUND_ROUTE_ORG_NORMAL_id =
  ROLES_CONSTS["ORG-ALLOW-INBOUND-ROUTE-ORG-NORMAL-id"];
const ORG_ALLOW_INBOUND_ROUTE_ORG_SECRET =
  ROLES_CONSTS["ORG-ALLOW-INBOUND-ROUTE-ORG-SECRET"];
const ORG_ALLOW_INBOUND_ROUTE_ORG_SECRET_id =
  ROLES_CONSTS["ORG-ALLOW-INBOUND-ROUTE-ORG-SECRET-id"];
const ORG_ALLOW_INBOUND_ROUTE_ORG_TOP_SECRET =
  ROLES_CONSTS["ORG-ALLOW-INBOUND-ROUTE-ORG-TOP-SECRET"];
const ORG_ALLOW_INBOUND_ROUTE_ORG_TOP_SECRET_id =
  ROLES_CONSTS["ORG-ALLOW-INBOUND-ROUTE-ORG-TOP-SECRET-id"];

const ORG_ALLOW_INBOUND_CC_ORG_NORMAL =
  ROLES_CONSTS["ORG-ALLOW-INBOUND-CC-ORG-NORMAL"];
const ORG_ALLOW_INBOUND_CC_ORG_NORMAL_id =
  ROLES_CONSTS["ORG-ALLOW-INBOUND-CC-ORG-NORMAL-id"];
const ORG_ALLOW_INBOUND_CC_ORG_SECRET =
  ROLES_CONSTS["ORG-ALLOW-INBOUND-CC-ORG-SECRET"];
const ORG_ALLOW_INBOUND_CC_ORG_SECRET_id =
  ROLES_CONSTS["ORG-ALLOW-INBOUND-CC-ORG-SECRET-id"];
const ORG_ALLOW_INBOUND_CC_ORG_TOP_SECRET =
  ROLES_CONSTS["ORG-ALLOW-INBOUND-CC-ORG-TOP-SECRET"];
const ORG_ALLOW_INBOUND_CC_ORG_TOP_SECRET_id =
  ROLES_CONSTS["ORG-ALLOW-INBOUND-CC-ORG-TOP-SECRET-id"];

type AllowedValuesState = {
  [key: string]: AllowedValueType;
  [ORG_ALLOW_INBOUND_ROUTE_ORG_NORMAL]: AllowedValueType;
  [ORG_ALLOW_INBOUND_ROUTE_ORG_SECRET]: AllowedValueType;
  [ORG_ALLOW_INBOUND_ROUTE_ORG_TOP_SECRET]: AllowedValueType;
  [ORG_ALLOW_INBOUND_CC_ORG_NORMAL]: AllowedValueType;
  [ORG_ALLOW_INBOUND_CC_ORG_SECRET]: AllowedValueType;
  [ORG_ALLOW_INBOUND_CC_ORG_TOP_SECRET]: AllowedValueType;
};
type Props = {
  orgUnit: OrgUnitMergedDataType;
  refreshOrgUnit: () => void;
  getOrgUnitLoading: boolean;
};

const InboundRoles = ({
  orgUnit,
  refreshOrgUnit,
  getOrgUnitLoading,
}: Props) => {
  const { labels } = useLanguage();
  const { handleError } = useHandleError();
  const { id } = useParams();
  const { fetchOrgUnitRoles, loading: getRolesLoading } = useGetOrgUnitRoles();
  const [isEdited, setIsEdited] = useState(false);

  const { loading: updateRolesLoading, handleUpdateOrgUnitRoles } =
    useUpdateOrgUnitRoles();
  const { loading: updateLoading, handleUpdateOrgUnit } =
    useUpdateOrgUnitOptions();
  const [inboundRoles, setInboundRoles] = useState<InoundRolesState>({
    [ROLES_CONSTS.SCAN_INDEX]: null,

    [ROLES_CONSTS.INBOUND_ROUTING_NORMAL]: null,
    [ROLES_CONSTS.INBOUND_ROUTING_SECRET]: null,
    [ROLES_CONSTS.INBOUND_ROUTING_TOP_SECRET]: null,

    [ROLES_CONSTS.INBOUND_ROUTE_GROUP_NORMAL]: null,
    [ROLES_CONSTS.INBOUND_ROUTE_GROUP_SECRET]: null,
    [ROLES_CONSTS.INBOUND_ROUTE_GROUP_TOP_SECRET]: null,

    [ROLES_CONSTS.INBOUND_CC_NORMAL]: null,
    [ROLES_CONSTS.INBOUND_CC_SECRET]: null,
    [ROLES_CONSTS.INBOUND_CC_TOP_SECRET]: null,
  });

  const [orgUnitOptions, setOrgUnitOptions] = useState({
    enable_g2g: orgUnit?.enable_g2g || false,
    g2g_code: orgUnit?.g2g_code || "",
  });

  const [allowedValues, setAllowedValues] = useState<AllowedValuesState>({
    [ORG_ALLOW_INBOUND_ROUTE_ORG_NORMAL]: {
      entities: [],
      allowed_type: ORG_ALLOW_INBOUND_ROUTE_ORG_NORMAL_id,
    },
    [ORG_ALLOW_INBOUND_ROUTE_ORG_SECRET]: {
      entities: [],
      allowed_type: ORG_ALLOW_INBOUND_ROUTE_ORG_SECRET_id,
    },
    [ORG_ALLOW_INBOUND_ROUTE_ORG_TOP_SECRET]: {
      entities: [],
      allowed_type: ORG_ALLOW_INBOUND_ROUTE_ORG_TOP_SECRET_id,
    },
    [ORG_ALLOW_INBOUND_CC_ORG_NORMAL]: {
      entities: [],
      allowed_type: ORG_ALLOW_INBOUND_CC_ORG_NORMAL_id,
    },
    [ORG_ALLOW_INBOUND_CC_ORG_SECRET]: {
      entities: [],
      allowed_type: ORG_ALLOW_INBOUND_CC_ORG_SECRET_id,
    },
    [ORG_ALLOW_INBOUND_CC_ORG_TOP_SECRET]: {
      entities: [],
      allowed_type: ORG_ALLOW_INBOUND_CC_ORG_TOP_SECRET_id,
    },
  });
  const fetchAllowedValues = async () => {
    try {
      const values = await getAllAllowedValues(id || "");

      if (!values) {
        setAllowedValues({
          [ORG_ALLOW_INBOUND_ROUTE_ORG_NORMAL]: {
            entities: [],
            allowed_type: ORG_ALLOW_INBOUND_ROUTE_ORG_NORMAL_id,
          },
          [ORG_ALLOW_INBOUND_ROUTE_ORG_SECRET]: {
            entities: [],
            allowed_type: ORG_ALLOW_INBOUND_ROUTE_ORG_SECRET_id,
          },
          [ORG_ALLOW_INBOUND_ROUTE_ORG_TOP_SECRET]: {
            entities: [],
            allowed_type: ORG_ALLOW_INBOUND_ROUTE_ORG_TOP_SECRET_id,
          },
          [ORG_ALLOW_INBOUND_CC_ORG_NORMAL]: {
            entities: [],
            allowed_type: ORG_ALLOW_INBOUND_CC_ORG_NORMAL_id,
          },
          [ORG_ALLOW_INBOUND_CC_ORG_SECRET]: {
            entities: [],
            allowed_type: ORG_ALLOW_INBOUND_CC_ORG_SECRET_id,
          },
          [ORG_ALLOW_INBOUND_CC_ORG_TOP_SECRET]: {
            entities: [],
            allowed_type: ORG_ALLOW_INBOUND_CC_ORG_TOP_SECRET_id,
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
    } catch (error) {
      handleError(error);
    }
  };

  const init = async () => {
    setIsEdited(false);
    const { allRoles, orgUnitRoles } = await fetchOrgUnitRoles(id || "");
    if (!allRoles || !orgUnitRoles) return;
    const filterData = {} as InoundRolesState;
    allRoles?.forEach((role) => {
      if (!(role.role_name in inboundRoles)) return;

      const extra = orgUnitRoles[role.id];
      filterData[role.role_name] = {
        ...role,
        ...extra,
      };
    });
    setInboundRoles(filterData);
  };
  const handleChange = (key: keyof typeof inboundRoles, users: number[]) => {
    setInboundRoles((prev) => {
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

  const handleChangeOrgUnitOptions = (
    key: keyof typeof orgUnitOptions,
    bool: any
  ) => {
    setOrgUnitOptions((prev) => ({
      ...prev,
      [key]: bool,
    }));
    setIsEdited(true);
  };
  useEffect(() => {
    if (!id) return;
    init();
    fetchAllowedValues();
  }, [id]);

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
        entities,
      };
      return {
        ...prev,
        [key]: updatedValue,
      };
    });
    setIsEdited(true);
  };

  const handleUpdateAllowedValue = async () => {
    const payload = Object.values(allowedValues)?.map((v) => {
      if (!v) return [];
      const { entities = [], allowed_type } = v;
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
    const payload = Object.values(inboundRoles)?.map((role) => {
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
      enable_g2g: orgUnit?.enable_g2g || false,
      g2g_code: orgUnit?.g2g_code || "",
    });
  }, [orgUnit]);

  return (
    <WhileInViewWrapper once={false}>
      {/* <LoaderComponent loading={getRolesLoading || getOrgUnitLoading} /> */}
      <Col style={{ padding: 10 }}>
        <TitleHeader
          applyReverse={false}
          heading={labels.til.scan_index_group}
          icon={<UsergroupAddOutlined style={{ color: "#fff" }} />}
        />
        <Row
          gutter={15}
          style={{ marginTop: 10, display: "flex", alignItems: "end" }}
        >
          <Col span={8} sm={24} lg={8}>
            <SelectUsers
              multiSelect
              label={labels.lbl.scanIndexUsers}
              value={inboundRoles[ROLES_CONSTS.SCAN_INDEX]?.users || []}
              onChange={(users: number | number[]) => {
                handleChange(
                  ROLES_CONSTS.SCAN_INDEX,
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
          heading={labels.til.inbound_recipient_group}
          icon={<UsergroupAddOutlined style={{ color: "#fff" }} />}
        />
        <Row
          gutter={15}
          style={{ marginTop: 10, display: "flex", alignItems: "end" }}
        >
          <Col span={8} sm={24} lg={8}>
            <SelectUsers
              multiSelect
              label={labels.lbl.recvinbNormalUsers}
              value={
                inboundRoles[ROLES_CONSTS.INBOUND_ROUTING_NORMAL]?.users || []
              }
              onChange={(users: number | number[]) => {
                handleChange(
                  ROLES_CONSTS.INBOUND_ROUTING_NORMAL,
                  Array.isArray(users) ? users : [users]
                );
              }}
            />
          </Col>
          <Col sm={24} lg={8}>
            <SelectUsers
              multiSelect
              label={labels.lbl.recvinbSecretUsers}
              value={
                inboundRoles[ROLES_CONSTS.INBOUND_ROUTING_SECRET]?.users || []
              }
              onChange={(users: number | number[]) => {
                handleChange(
                  ROLES_CONSTS.INBOUND_ROUTING_SECRET,
                  Array.isArray(users) ? users : [users]
                );
              }}
            />
          </Col>
          <Col sm={24} lg={8}>
            <SelectUsers
              multiSelect
              label={labels.lbl.recvinbTopSecretUsers}
              value={
                inboundRoles[ROLES_CONSTS.INBOUND_ROUTING_TOP_SECRET]?.users ||
                []
              }
              onChange={(users: number | number[]) => {
                handleChange(
                  ROLES_CONSTS.INBOUND_ROUTING_TOP_SECRET,
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
          heading={labels.til.route_orgunit}
          icon={<UsergroupAddOutlined style={{ color: "#fff" }} />}
        />
        <Row
          gutter={15}
          style={{ marginTop: 10, display: "flex", alignItems: "end" }}
        >
          <Col span={8} sm={24} lg={8}>
            <SelectOU
              label={labels.lbl.inboundRoutingNormalOrgunit}
              value={
                allowedValues[ORG_ALLOW_INBOUND_ROUTE_ORG_NORMAL]?.entities ||
                []
              }
              onChange={(orgUnits: number | number[]) => {
                handleChangeAllowedValues(
                  ORG_ALLOW_INBOUND_ROUTE_ORG_NORMAL,
                  Array.isArray(orgUnits) ? orgUnits : [orgUnits]
                );
              }}
              multiSelect
            />
          </Col>
          <Col span={8} sm={24} lg={8}>
            <SelectOU
              label={labels.lbl.inboundRoutingSecretOrgunit}
              value={
                allowedValues[ORG_ALLOW_INBOUND_ROUTE_ORG_SECRET]?.entities ||
                []
              }
              onChange={(orgUnits: number | number[]) => {
                handleChangeAllowedValues(
                  ORG_ALLOW_INBOUND_ROUTE_ORG_SECRET,
                  Array.isArray(orgUnits) ? orgUnits : [orgUnits]
                );
              }}
              multiSelect
            />
          </Col>
          <Col span={8} sm={24} lg={8}>
            <SelectOU
              label={labels.lbl.inboundRoutingTopSecretOrgunit}
              value={
                allowedValues[ORG_ALLOW_INBOUND_ROUTE_ORG_TOP_SECRET]
                  ?.entities || []
              }
              onChange={(orgUnits: number | number[]) => {
                handleChangeAllowedValues(
                  ORG_ALLOW_INBOUND_ROUTE_ORG_TOP_SECRET,
                  Array.isArray(orgUnits) ? orgUnits : [orgUnits]
                );
              }}
              multiSelect
            />
          </Col>
        </Row>
      </Col>

      <Col style={{ padding: 10 }}>
        <TitleHeader
          applyReverse={false}
          heading={labels.til.route_user}
          icon={<UsergroupAddOutlined style={{ color: "#fff" }} />}
        />
        <Row
          gutter={15}
          style={{ marginTop: 10, display: "flex", alignItems: "end" }}
        >
          <Col span={8} sm={24} lg={8}>
            <SelectUsers
              multiSelect
              label={labels.lbl.inboundRoutingNormalUsers}
              value={
                inboundRoles[ROLES_CONSTS.INBOUND_ROUTE_GROUP_NORMAL]?.users ||
                []
              }
              onChange={(users: number | number[]) => {
                handleChange(
                  ROLES_CONSTS.INBOUND_ROUTE_GROUP_NORMAL,
                  Array.isArray(users) ? users : [users]
                );
              }}
            />
          </Col>
          <Col sm={24} lg={8}>
            <SelectUsers
              multiSelect
              label={labels.lbl.inboundRoutingSecretUsers}
              value={
                inboundRoles[ROLES_CONSTS.INBOUND_ROUTE_GROUP_SECRET]?.users ||
                []
              }
              onChange={(users: number | number[]) => {
                handleChange(
                  ROLES_CONSTS.INBOUND_ROUTE_GROUP_SECRET,
                  Array.isArray(users) ? users : [users]
                );
              }}
            />
          </Col>
          <Col sm={24} lg={8}>
            <SelectUsers
              multiSelect
              label={labels.lbl.inboundRoutingTopSecretUsers}
              value={
                inboundRoles[ROLES_CONSTS.INBOUND_ROUTE_GROUP_TOP_SECRET]
                  ?.users || []
              }
              onChange={(users: number | number[]) => {
                handleChange(
                  ROLES_CONSTS.INBOUND_ROUTE_GROUP_TOP_SECRET,
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
          heading={labels.til.cc_user}
          icon={<UsergroupAddOutlined style={{ color: "#fff" }} />}
        />
        <Row
          gutter={15}
          style={{ marginTop: 10, display: "flex", alignItems: "end" }}
        >
          <Col span={8} sm={24} lg={8}>
            <SelectUsers
              multiSelect
              label={labels.lbl.inboundCCNormalUsers}
              value={inboundRoles[ROLES_CONSTS.INBOUND_CC_NORMAL]?.users || []}
              onChange={(users: number | number[]) => {
                handleChange(
                  ROLES_CONSTS.INBOUND_CC_NORMAL,
                  Array.isArray(users) ? users : [users]
                );
              }}
            />
          </Col>
          <Col sm={24} lg={8}>
            <SelectUsers
              multiSelect
              label={labels.lbl.inboundCCSecretUsers}
              value={inboundRoles[ROLES_CONSTS.INBOUND_CC_SECRET]?.users || []}
              onChange={(users: number | number[]) => {
                handleChange(
                  ROLES_CONSTS.INBOUND_CC_SECRET,
                  Array.isArray(users) ? users : [users]
                );
              }}
            />
          </Col>
          <Col sm={24} lg={8}>
            <SelectUsers
              multiSelect
              label={labels.lbl.inboundCCTopSecretUsers}
              value={
                inboundRoles[ROLES_CONSTS.INBOUND_CC_TOP_SECRET]?.users || []
              }
              onChange={(users: number | number[]) => {
                handleChange(
                  ROLES_CONSTS.INBOUND_CC_TOP_SECRET,
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
          heading={labels.til.cc_orgunit}
          icon={<UsergroupAddOutlined style={{ color: "#fff" }} />}
        />
        <Row
          gutter={15}
          style={{ marginTop: 10, display: "flex", alignItems: "end" }}
        >
          <Col span={8} sm={24} lg={8}>
            <SelectOU
              label={labels.lbl.inboundCCNormalOrgunit}
              value={
                allowedValues[ORG_ALLOW_INBOUND_CC_ORG_NORMAL]?.entities || []
              }
              onChange={(orgUnits: number | number[]) => {
                handleChangeAllowedValues(
                  ORG_ALLOW_INBOUND_CC_ORG_NORMAL,
                  Array.isArray(orgUnits) ? orgUnits : [orgUnits]
                );
              }}
              multiSelect
            />
          </Col>
          <Col span={8} sm={24} lg={8}>
            <SelectOU
              label={labels.lbl.inboundCCSecretOrgunit}
              value={
                allowedValues[ORG_ALLOW_INBOUND_CC_ORG_SECRET]?.entities || []
              }
              onChange={(orgUnits: number | number[]) => {
                handleChangeAllowedValues(
                  ORG_ALLOW_INBOUND_CC_ORG_SECRET,
                  Array.isArray(orgUnits) ? orgUnits : [orgUnits]
                );
              }}
              multiSelect
            />
          </Col>
          <Col span={8} sm={24} lg={8}>
            <SelectOU
              label={labels.lbl.inboundCCTopSecretOrgunit}
              value={
                allowedValues[ORG_ALLOW_INBOUND_CC_ORG_TOP_SECRET]?.entities ||
                []
              }
              onChange={(orgUnits: number | number[]) => {
                handleChangeAllowedValues(
                  ORG_ALLOW_INBOUND_CC_ORG_TOP_SECRET,
                  Array.isArray(orgUnits) ? orgUnits : [orgUnits]
                );
              }}
              multiSelect
            />
          </Col>
        </Row>
      </Col>

      <TitleHeader
        heading={labels.til.org_unit_G2G}
        icon={<UsergroupAddOutlined style={{ color: "#fff" }} />}
        applyReverse={false}
      />
      <Row
        gutter={15}
        style={{ marginTop: 10, display: "flex", alignItems: "end" }}
      >
        <Col
          span={8}
          style={{ display: "flex", alignItems: "center", paddingLeft: 10 }}
        >
          <Checkbox
            checked={orgUnitOptions.enable_g2g}
            onChange={(e) =>
              handleChangeOrgUnitOptions("enable_g2g", e.target.checked)
            }
          >
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
            allowEdit={orgUnitOptions.enable_g2g}
            style={{ height: 48, marginTop: 9 }}
            label={labels.lbl.g2gCode}
            value={orgUnitOptions.g2g_code}
            onChange={(val: React.ChangeEvent<HTMLInputElement>) => {
              handleChangeOrgUnitOptions("g2g_code", val.target.value);
            }}
          />
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
            await init();
            refreshOrgUnit();
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

export default InboundRoles;
