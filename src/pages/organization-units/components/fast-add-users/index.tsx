import { Button, Checkbox, Col, Modal, Row } from "antd";
import { useLanguage } from "../../../../context/language";
import { LANGUAGE } from "../../../../constants/language";
import { englishLabels } from "../../../../constants/app-constants/en";
import { arabicLabels } from "../../../../constants/app-constants/ar";
import {
  DoubleRightOutlined,
  FolderAddFilled,
  PlusOutlined,
  ReloadOutlined,
  TableOutlined,
} from "@ant-design/icons";
import TitleHeader from "../../../../components/ui/header";
import { useState } from "react";
import OrgUnitSearchOption from "../../../../components/ui/search/ou-search-actions";
import UserSearch from "../../../../components/ui/search/user";
import { ouFastAddUsers } from "../../../../components/services/organization-units";
import { OUFastAddType } from "../../../../components/services/organization-units/type";

interface OrgUnitFastAddProps {
  visible: boolean;
  onClose: () => void;
  activateLoader: (loading: boolean) => void;
}

export default function UsersFastAdd({
  activateLoader,
  onClose,
  visible,
}: OrgUnitFastAddProps) {
  const { language } = useLanguage();
  const isEnglish = language === LANGUAGE.ENGLISH_INT;
  const labels = isEnglish ? englishLabels : arabicLabels;
  const [users, setUsers] = useState<string[]>([]);
  const [inboundRoles, setInboundRoles] = useState<string[]>([]);
  const [outboundRoles, setOutboundRoles] = useState<string[]>([]);
  const [orgUnitValues, setOrgUnitValues] = useState<{
    roleOrgUnitCodes: string[];
    userId: string[];
  }>({
    roleOrgUnitCodes: [],
    userId: [],
  });

  const userOptions = [
    {
      label: labels.lbl.adminNormalUsers,
      value: "ADMIN_NORMAL",
    },
    {
      label: labels.lbl.adminSecretUsers,
      value: "ADMIN_SECRET",
    },
    {
      label: labels.lbl.adminTopSecretUsers,
      value: "ADMIN_TOP_SECRET",
    },
    {
      label: labels.lbl.contributorNormalUsers,
      value: "CONTRIBUTOR_NORMAL",
    },
    {
      label: labels.lbl.contributorSecretUsers,
      value: "CONTRIBUTOR_SECRET",
    },
    {
      label: labels.lbl.contributorTopSecretUsers,
      value: "CONTRIBUTOR_TOP_SECRET",
    },
    {
      label: labels.lbl.consumerNormalUsers,
      value: "CONSUMER_NORMAL",
    },
    {
      label: labels.lbl.consumerSecretUsers,
      value: "CONSUMER_SECRET",
    },
    {
      label: labels.lbl.consumerTopSecretUsers,
      value: "CONSUMER_TOP_SECRET",
    },
  ];

  const inboundOptions = [
    {
      label: labels.lbl.recvinbNormalUsers,
      value: "INBOUND_ROUTE_GROUP_NORMAL",
    },
    {
      label: labels.lbl.recvinbSecretUsers,
      value: "INBOUND_ROUTE_GROUP_SECRET",
    },
    {
      label: labels.lbl.recvinbTopSecretUsers,
      value: "INBOUND_ROUTE_GROUP_TOP_SECRET",
    },
    {
      label: labels.lbl.inboundRoutingNormalUsers,
      value: "INBOUND_ROUTING_NORMAL",
    },
    {
      label: labels.lbl.inboundRoutingSecretUsers,
      value: "INBOUND_ROUTING_SECRET",
    },
    {
      label: labels.lbl.inboundRoutingTopSecretUsers,
      value: "INBOUND_ROUTING_TOP_SECRET",
    },
    {
      label: labels.lbl.inboundCCNormalUsers,
      value: "INBOUND_CC_NORMAL",
    },
    {
      label: labels.lbl.inboundCCSecretUsers,
      value: "INBOUND_CC_SECRET",
    },
    {
      label: labels.lbl.inboundCCTopSecretUsers,
      value: "INBOUND_CC_TOP_SECRET",
    },
    {
      label: labels.lbl.scanIndexUsers,
      value: "SCAN_INDEX",
    },
  ];

  const outboundOptions = [
    {
      label: labels.lbl.initiatorUsers,
      value: "OUTBOUND_INITIATOR",
    },
    {
      label: labels.lbl.outboundApprovalNormalUsers,
      value: "OUTBOUND_APPROVAL_NORMAL",
    },
    {
      label: labels.lbl.outboundApprovalSecretUsers,
      value: "OUTBOUND_APPROVAL_SECRET",
    },
    {
      label: labels.lbl.outboundApprovalTopSecretUsers,
      value: "OUTBOUND_APPROVAL_TOP_SECRET",
    },
    {
      label: labels.lbl.outboundSenderNormalUsers,
      value: "OUTBOUND_SENDER_NORMAL",
    },
    {
      label: labels.lbl.outboundSenderSecretUsers,
      value: "OUTBOUND_SENDER_SECRET",
    },
    {
      label: labels.lbl.outboundSenderTopSecretUsers,
      value: "OUTBOUND_SENDER_TOP_SECRET",
    },
    {
      label: labels.lbl.outboundReviewerNormalUsers,
      value: "OUTBOUND_REVIEWER_NORMAL",
    },
    {
      label: labels.lbl.outboundReviewerSecretUsers,
      value: "OUTBOUND_REVIEWER_SECRET",
    },
    {
      label: labels.lbl.outboundReviewerTopSecretUsers,
      value: "OUTBOUND_REVIEWER_TOP_SECRET",
    },
  ];

  const submitOUCreateFast = async (continueOn: boolean) => {
    activateLoader(true);
    let payLoad: OUFastAddType = {
      orgunitCodes: [],
      roleIds: [],
      roleNames: inboundRoles.concat(outboundRoles, users),
      roleOrgUnitCodes: orgUnitValues.roleOrgUnitCodes,
      userId: orgUnitValues.userId,
    };

    const response = await ouFastAddUsers(payLoad);

    console.log(response);
    resetValues();

    if (continueOn) {
      onClose();
    }

    activateLoader(false);
  };

  const resetValues = () => {
    const clonedOrgUnitValues = { ...orgUnitValues };
    clonedOrgUnitValues.roleOrgUnitCodes = [];
    clonedOrgUnitValues.userId = [];
    setOrgUnitValues(clonedOrgUnitValues);
    setInboundRoles([]);
    setOutboundRoles([]);
    setUsers([]);
  };

  return (
    <Modal
      open={visible}
      onCancel={() => {
        resetValues();
        onClose();
      }}
      title={
        <Col style={{ display: "flex", alignItems: "center" }}>
          <FolderAddFilled
            style={{ marginLeft: 10, marginRight: 10, fontSize: 20 }}
          />
          <p style={{ fontSize: 20 }}>{labels.btn.quickly_add_user}</p>
        </Col>
      }
      width={900}
      centered
      footer={<></>}
      zIndex={20}
    >
      <Col style={{ height: window.innerHeight * 0.8, overflow: "auto" }}>
        <Row gutter={14} style={{ paddingLeft: 15, paddingRight: 15 }}>
          <Col span={24} style={{ marginTop: 20 }}>
            <OrgUnitSearchOption
              code
              multiSelect={true}
              enableSearch
              label={labels.til.org_unit}
              value={orgUnitValues.roleOrgUnitCodes}
              onChange={(values: string[]) => {
                console.log("the values", values);
                const clonedOrgUnitValues = { ...orgUnitValues };
                clonedOrgUnitValues.roleOrgUnitCodes = values;
                setOrgUnitValues(clonedOrgUnitValues);
              }}
            />
          </Col>
          <Col span={24} style={{ marginTop: 20 }}>
            <UserSearch
              multiSelect={true}
              enableSearch
              label={labels.lbl.users}
              value={orgUnitValues.userId}
              onChange={(values: string[]) => {
                console.log("the values", values);
                const clonedOrgUnitValues = { ...orgUnitValues };
                clonedOrgUnitValues.userId = values;
                setOrgUnitValues(clonedOrgUnitValues);
              }}
            />
          </Col>
        </Row>
        <TitleHeader
          heading={labels.til.org_unit_users}
          icon={<TableOutlined style={{ color: "#fff" }} />}
        />
        <Row gutter={15} style={{ padding: 10 }}>
          {userOptions.map((opt) => {
            return (
              <Col
                span={8}
                style={{
                  height: 60,
                  marginTop: 10,
                  alignContent: "center",
                }}
              >
                <Checkbox
                  checked={users.includes(opt.value)}
                  onChange={() => {
                    if (users.includes(opt.value)) {
                      const filtered = users.filter((val) => val !== opt.value);
                      setUsers(filtered);
                    } else {
                      setUsers([...users, opt.value]);
                    }
                  }}
                >
                  {opt.label}
                </Checkbox>
              </Col>
            );
          })}
        </Row>
        <TitleHeader
          heading={labels.til.org_unit_in_roles}
          icon={<TableOutlined style={{ color: "#fff" }} />}
        />
        <Row gutter={15} style={{ padding: 10 }}>
          {inboundOptions.map((opt) => {
            return (
              <Col
                span={8}
                style={{
                  height: 60,
                  marginTop: 10,
                  alignContent: "center",
                }}
              >
                <Checkbox
                  checked={outboundRoles.includes(opt.value)}
                  onChange={() => {
                    if (outboundRoles.includes(opt.value)) {
                      const filtered = outboundRoles.filter(
                        (val) => val !== opt.value
                      );
                      setOutboundRoles(filtered);
                    } else {
                      setOutboundRoles([...outboundRoles, opt.value]);
                    }
                  }}
                >
                  {opt.label}
                </Checkbox>
              </Col>
            );
          })}
        </Row>
        <TitleHeader
          heading={labels.til.org_unit_out_roles}
          icon={<TableOutlined style={{ color: "#fff" }} />}
        />
        <Row gutter={15} style={{ padding: 10 }}>
          {outboundOptions.map((opt, index) => {
            return (
              <Col
                span={index === 0 ? 24 : 8}
                style={{
                  height: 60,
                  marginTop: 10,
                  alignContent: "center",
                }}
              >
                <Checkbox
                  checked={outboundRoles.includes(opt.value)}
                  onChange={() => {
                    if (outboundRoles.includes(opt.value)) {
                      const filtered = outboundRoles.filter(
                        (val) => val !== opt.value
                      );
                      setOutboundRoles(filtered);
                    } else {
                      setOutboundRoles([...outboundRoles, opt.value]);
                    }
                  }}
                >
                  {opt.label}
                </Checkbox>
              </Col>
            );
          })}
        </Row>

        <Col
          style={{
            display: "flex",
            justifyContent: isEnglish ? "flex-end" : "flex-start",
            marginTop: 10,
          }}
        >
          <Button onClick={resetValues} style={{ margin: "0 10px" }}>
            <ReloadOutlined />
            {labels.btn.reset}
          </Button>
          <Button
            type="primary"
            onClick={() => {
              submitOUCreateFast(false);
            }}
            disabled={
              orgUnitValues.userId.length === 0 ||
              orgUnitValues.roleOrgUnitCodes.length === 0 ||
              (inboundRoles.length === 0 &&
                outboundRoles.length === 0 &&
                users.length === 0)
            }
            style={{ margin: "0 10px" }}
          >
            <PlusOutlined />
            {labels.btn.create_new}
          </Button>
          <Button
            onClick={() => {
              submitOUCreateFast(true);
            }}
            disabled={
              orgUnitValues.userId.length === 0 ||
              orgUnitValues.roleOrgUnitCodes.length === 0 ||
              (inboundRoles.length === 0 &&
                outboundRoles.length === 0 &&
                users.length === 0)
            }
            type="primary"
          >
            <DoubleRightOutlined />
            {labels.btn.create_continue}
          </Button>
        </Col>
      </Col>
    </Modal>
  );
}
