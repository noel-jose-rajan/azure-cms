import SelectComponent from "@/components/ui/form/select";
import { SubActionDetails } from "../service";
import { useLanguage } from "@/context/language";
type Props = {
  value?: string | number | number[];
  onChange: (value: string | number | number[]) => void;
  label: string;
  data: SubActionDetails[];
  multiSelect?: boolean;
  onClear?: () => void;
};
const ActionSelect = ({
  label,
  value,
  onChange,
  data,
  onClear,
  multiSelect,
}: Props) => {
  const { isEnglish } = useLanguage();
  const options = data?.map((item) => ({
    label: isEnglish ? item.name_en : item.name_ar,
    value: item.ID,
  }));
  return (
    <SelectComponent
      key={options?.length}
      mode={multiSelect ? "multiple" : undefined}
      options={options}
      value={value}
      onChange={(val) => {
        onChange(val);
      }}
      label={label}
      onClear={onClear}
    />
  );
};

export default ActionSelect;
