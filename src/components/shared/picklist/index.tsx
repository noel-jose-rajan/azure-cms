import { useLanguage } from "@/context/language";
import SelectComponent from "@/components/ui/form/select";
import { PicklistKeys } from "@/store/picklists/picklists.store";
import usePicklist from "@/store/picklists/use-picklist";

type Props = {
  code: PicklistKeys;
  onChange: (value: any) => void;
  onBlur?: () => void;
  value: any;
  label: string;
  error?: string | undefined;
  disabled?: boolean;
  isRequired?: boolean;
  canClear?: boolean;
  multiSelect?: boolean;
};
const Picklist = ({
  code,
  onBlur,
  onChange,
  value = "",
  label,
  error,
  disabled,
  isRequired = false,
  canClear = false,
  multiSelect = false,
}: Props) => {
  const { isEnglish } = useLanguage();
  const { loading, picklists } = usePicklist();

  const options =
    picklists[code]?.map((item) => ({
      label: isEnglish ? item.picklist_en_label : item.picklist_ar_label,
      value: item.picklist_id,
    })) || [];

  return (
    <SelectComponent
      key={isEnglish + "picklist " + label}
      onChange={(value) => {
        onChange(value);
      }}
      label={label}
      value={value}
      error={error}
      spinning={loading}
      options={options}
      onBlur={onBlur}
      disabled={disabled}
      isRequired={isRequired}
      canClear={canClear}
      mode={multiSelect ? "multiple" : undefined}
    />
  );
};

export default Picklist;
