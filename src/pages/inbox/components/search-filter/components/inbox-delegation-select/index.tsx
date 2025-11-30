import { InboxDelegation } from "@/components/services/inbox";
import SelectComponent from "@/components/ui/form/select";
import { useLanguage } from "@/context/language";

type Props = {
  value?: number;
  onChange: (val: number) => void;
  delegations: InboxDelegation[];
};
const InboxDelegationSelect = ({ onChange, value, delegations }: Props) => {
  const { labels } = useLanguage();

  const options = delegations?.map((d) => ({
    value: d?.id,
    label: d?.delegate_from_name,
  }));
  return (
    <SelectComponent
      label={labels.lbl.delegation_from}
      options={options}
      value={value}
      onChange={(val: number[] | number) => onChange(val as number)}
    />
  );
};

export default InboxDelegationSelect;
