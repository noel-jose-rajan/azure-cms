import { Button, Col, Tabs, TabsProps } from "antd";
import TitleHeader from "../../components/ui/header";
import { useLanguage } from "../../context/language";
import { FormOutlined, RollbackOutlined } from "@ant-design/icons";
import { useEffect, useMemo, useState } from "react";
import AddEditOrgUnit from "./components/add-edit-org-unit";
import { useNavigate, useParams } from "react-router-dom";
// import OrgUnitOutboundRoles from "./components/outbound-roles";
import { OrgUnitMergedDataType } from "@/components/services/organization-units/type";
import {
  getOrgUnitById,
  getOrgUnitBasicInfoById,
} from "@/components/services/organization-units";
import OrgUnitOutboundRoles from "./components/add-edit-org-unit/outbound-roles2";
import OrgUnitsUsers from "./components/org-unit-users2";
import InboundRoles from "./components/inbound-roles2";

export default function CreateEditOrganizationUnit() {
  const { id } = useParams();
  const { labels } = useLanguage();
  const [orgUnit, setOrgUnit] = useState<OrgUnitMergedDataType>(
    {} as OrgUnitMergedDataType
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [refresh, setRefresh] = useState<boolean>(true);

  const navigate = useNavigate();

  const fetchOrgUnit = async () => {
    try {
      setLoading(true);
      const [data1, data2] = await Promise.all([
        getOrgUnitById(id as string),
        getOrgUnitBasicInfoById(id as string),
      ]);

      if (data1 && data2) {
        const mergedData: OrgUnitMergedDataType = {
          ...data1,
          ...data2,
        };
        setOrgUnit(mergedData);
      }
    } catch (e) {
      console.log("Error fetching organization unit:", e);
    } finally {
      setRefresh(false);
      setLoading(false);
    }
  };

  const refreshOrgUnit = () => {
    setRefresh(true);
  };

  useEffect(() => {
    if (id && refresh) {
      fetchOrgUnit();
    }
  }, [id, refresh]);

  const items = useMemo<TabsProps["items"]>(
    () => [
      {
        label: labels.til.org_unit_data,
        key: "1",
        children: <AddEditOrgUnit orgUnit={orgUnit} />,
        disabled: false,
      },
      {
        label: labels.til.org_unit_users,
        key: "2",
        children: <OrgUnitsUsers refreshOrgUnit={refreshOrgUnit} />,
        disabled: !orgUnit?.id,
      },
      {
        label: labels.til.org_unit_in_roles,
        key: "3",
        children: (
          <InboundRoles
            orgUnit={orgUnit}
            refreshOrgUnit={refreshOrgUnit}
            getOrgUnitLoading={loading}
          />
        ),
        disabled: !orgUnit?.id,
      },
      {
        label: labels.til.org_unit_out_roles,
        key: "4",
        children: (
          // <OrgUnitOutboundRoles orgUnit={orgUnit} activateLoader={setLoading} />
          <OrgUnitOutboundRoles
            orgUnit={orgUnit}
            refreshOrgUnit={refreshOrgUnit}
            getOrgUnitLoading={loading}
          />
        ),
        disabled: !orgUnit?.id,
      },
      // {
      //   label: labels.lbl.org_unit_opentext,
      //   key: "5",
      //   children: (
      //     <OrgUnitOpenText orgUnit={orgUnit} activateLoader={setLoading} />
      //   ),
      //   disabled: !orgUnit?.entity_id,
      // },
    ],
    [labels, orgUnit]
  );

  return (
    <>
      <Col>
        <Button
          type="primary"
          onClick={() => navigate("/admin/organization-units")}
        >
          <RollbackOutlined />
          {labels.btn.back}
        </Button>
        <TitleHeader
          heading={labels["Organization Unit Form"]}
          icon={<FormOutlined style={{ color: "#fff" }} />}
        />
        <Tabs
          defaultActiveKey="1"
          type="line"
          size={"middle"}
          style={{ marginBottom: 32, marginTop: 20 }}
          items={items}
        />
      </Col>
    </>
  );
}
