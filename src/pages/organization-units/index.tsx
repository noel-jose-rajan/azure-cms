import { FilterFilled, TableOutlined } from "@ant-design/icons";
import TitleBar from "../../components/ui/bar/title-bar";
import TitleHeader from "../../components/ui/header";
import { useLanguage } from "../../context/language";
import OUListTable from "./components/table";
import { useEffect, useState } from "react";
import OUSearchForm from "./components/search";
import { OrgUnitType } from "@/components/services/organization-units/type";
import useGetAllOU from "@/store/orgs/use-get-all-ou";

export default function OrganizationUnits() {
  const { labels } = useLanguage();
  const { loading, orgUnits } = useGetAllOU();
  const [filteredOrgUnits, setFilteredOrgUnits] = useState<OrgUnitType[]>(
    orgUnits || []
  );

  useEffect(() => {
    if (orgUnits) {
      setFilteredOrgUnits(orgUnits);
    }
  }, [orgUnits]);

  return (
    <>
      <TitleBar headerText={labels.til.org_unit} />
      <TitleHeader
        heading={labels.til.org_unit_search_criteria}
        icon={<FilterFilled style={{ color: "#fff" }} />}
      />
      <OUSearchForm setFilteredOrgUnits={setFilteredOrgUnits} />
      <TitleHeader
        heading={labels.til.org_unit}
        icon={<TableOutlined style={{ color: "#fff" }} />}
      />
      <OUListTable orgUnits={filteredOrgUnits} loading={loading} />
    </>
  );
}
