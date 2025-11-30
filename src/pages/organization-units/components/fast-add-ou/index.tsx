import { Button, Checkbox, Col, Modal, Row, message } from "antd";
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
import { fastAddOrgUnits } from "../../../../components/services/organization-units";
import { HttpStatus } from "../../../../components/functional/httphelper";
import { OUFastAddType } from "../../../../components/services/organization-units/type";

interface OrgUnitFastAddProps {
  visible: boolean;
  onClose: () => void;
  activateLoader: (loading: boolean) => void;
}

export default function OrgUnitFastAdd({
  activateLoader,
  onClose,
  visible,
}: OrgUnitFastAddProps) {
  const { language } = useLanguage();
  const isEnglish = language === LANGUAGE.ENGLISH_INT;
  const labels = isEnglish ? englishLabels : arabicLabels;
  const [inboundRoles, setInboundRoles] = useState<string[]>([]);
  const [outboundRoles, setOutboundRoles] = useState<string[]>([]);
  const [orgUnitValues, setOrgUnitValues] = useState<{
    roleOrgUnitCodes: string[];
    orgunitCodes: string[];
  }>({
    roleOrgUnitCodes: [],
    orgunitCodes: [],
  });

  const inboundOptions = [
    {
      label: labels.lbl.inboundRoutingNormalOrgunit,
      value: "INBOUND_ROUTING_NORMAL",
    },
    {
      label: labels.lbl.inboundRoutingSecretOrgunit,
      value: "INBOUND_ROUTING_SECRET",
    },
    {
      label: labels.lbl.inboundRoutingTopSecretOrgunit,
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
  ];

  const outboundOptions = [
    {
      label: labels.lbl.forwardToOrgunit,
      value: "OUTBOUND_FORWARD_TO",
    },
  ];

  const submitOUCreateFast = async (continueOn: boolean) => {
    activateLoader(true);
    let payLoad: OUFastAddType = {
      orgunitCodes: orgUnitValues.orgunitCodes,
      roleIds: [],
      roleNames: inboundRoles.concat(outboundRoles),
      roleOrgUnitCodes: orgUnitValues.roleOrgUnitCodes,
      userId: [],
    };

    const response = await fastAddOrgUnits(payLoad);

    if (response.status !== HttpStatus.SUCCESS) {
      message.error(
        isEnglish
          ? "Something went wrong! Please contact your system administrator"
          : "حدث خطأ ما، يرجى الاتصال بمسؤول النظام"
      );
    }

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
    clonedOrgUnitValues.orgunitCodes = [];
    setOrgUnitValues(clonedOrgUnitValues);
    setInboundRoles([]);
    setOutboundRoles([]);
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
          <FolderAddFilled style={{ marginLeft: 10, marginRight: 10 }} />
          {labels.btn.quickly_add_orgunit}
        </Col>
      }
      width={900}
      centered
      footer={<></>}
      zIndex={20}
    >
      <Row gutter={14} style={{ padding: 5 }}>
        <Col span={24} style={{ marginTop: 20 }}>
          <OrgUnitSearchOption
            code
            multiSelect={true}
            enableSearch
            label={labels.til.orgunit_main}
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
          <OrgUnitSearchOption
            code={true}
            multiSelect={true}
            enableSearch
            label={labels.til.orgunit_sec}
            value={orgUnitValues.orgunitCodes}
            onChange={(values: string[]) => {
              console.log("the values", values);
              const clonedOrgUnitValues = { ...orgUnitValues };
              clonedOrgUnitValues.orgunitCodes = values;
              setOrgUnitValues(clonedOrgUnitValues);
            }}
          />
        </Col>
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
                marginTop: 20,
                alignContent: "center",
              }}
            >
              <Checkbox
                checked={inboundRoles.includes(opt.value)}
                onChange={() => {
                  if (inboundRoles.includes(opt.value)) {
                    const filtered = inboundRoles.filter(
                      (val) => val !== opt.value
                    );
                    setInboundRoles(filtered);
                  } else {
                    setInboundRoles([...inboundRoles, opt.value]);
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
        {outboundOptions.map((opt) => {
          return (
            <Col
              span={8}
              style={{
                height: 60,
                marginTop: 20,
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
            orgUnitValues.orgunitCodes.length === 0 ||
            orgUnitValues.roleOrgUnitCodes.length === 0 ||
            (inboundRoles.length === 0 && outboundRoles.length === 0)
          }
        >
          <PlusOutlined />
          {labels.btn.create_new}
        </Button>
        <Button
          onClick={() => {
            submitOUCreateFast(true);
          }}
          disabled={
            orgUnitValues.orgunitCodes.length === 0 ||
            orgUnitValues.roleOrgUnitCodes.length === 0 ||
            (inboundRoles.length === 0 && outboundRoles.length === 0)
          }
          type="primary"
          style={{ margin: "0 10px" }}
        >
          <DoubleRightOutlined />
          {labels.btn.create_continue}
        </Button>
      </Col>
    </Modal>
  );
}
