import SelectComponent from "@/components/ui/form/select";
import { useLanguage } from "@/context/language";
import useGetAllOU from "@/store/orgs/use-get-all-ou";
import React, { useEffect } from "react";

type Props = {
  value?: number | null;
  onChange: (val: number) => void;
  orgs: number[];
};
const ManagerSelectOrgs = ({ value, onChange, orgs }: Props) => {
  const { getOrgById, orgUnits } = useGetAllOU();
  const { labels, isEnglish } = useLanguage();
  const orgsOptions = orgs
    ?.map((id) => getOrgById(id))
    ?.map((u) => ({
      label: isEnglish ? u?.name_en : u?.name_ar,
      value: u?.id,
    }));

  useEffect(() => {
    if (!value && orgsOptions && orgsOptions?.length > 0) {
      onChange(orgsOptions[0]?.value || 0);
    }
  }, [value, orgsOptions, orgUnits]);
  return (
    <SelectComponent
      key={isEnglish + "" + orgUnits?.length}
      options={orgsOptions}
      label={labels.lbl.org_unit}
      value={value}
      onChange={(val) => onChange(val as number)}
      canClear={false}
    />
  );
};

export default ManagerSelectOrgs;
