import { useState } from "react";
import { useLanguage } from "../../../context/language";
import { SearchOutlined } from "@ant-design/icons";
import SelectComponent from "../../ui/form/select";
import SearchOrgUnitModal from "./components/modal";
import useGetAllOU from "@/store/orgs/use-get-all-ou";

type Props = {
  multiSelect: boolean;
  onChange: (value: number[] | number) => void;
  value: number[] | number | undefined | null;
  label: string;
  error?: string | undefined;
  disabled?: boolean;
  isRequired?: boolean;
  canClear?: boolean;
};
const SelectOU = ({
  onChange,
  value,
  label,
  error,
  multiSelect,
  disabled = false,
  isRequired = false,
  canClear = false,
}: Props) => {
  const { isEnglish } = useLanguage();

  const { loading, orgUnits } = useGetAllOU();
  // const [orgUnits, setOrgUnits] = useState<OrganizationUnitType[]>([]);
  const [showModal, setShowModal] = useState<boolean>(false);
  // const [loading, setLoading] = useState<boolean>(false);
  const handleShowModal = (bool: boolean) => {
    setShowModal(bool);
  };

  const options =
    orgUnits?.map((item) => ({
      label: isEnglish ? item.name_en : item.name_ar,
      value: item.id,
    })) || [];

  return (
    <>
      <SelectComponent
        disabled={disabled}
        onChange={onChange}
        label={label}
        defaultValue={value}
        spinning={loading}
        value={value}
        error={error}
        options={options}
        mode={multiSelect ? "multiple" : undefined}
        isRequired={isRequired}
        canClear={canClear}
        Icon={
          // multiSelect ? (
          <SearchOutlined onClick={() => handleShowModal(true)} />
          // ) : undefined
        }
      />
      {showModal && (
        <SearchOrgUnitModal
          label={label}
          multiSelect={multiSelect}
          selectedOrgUnits={
            value ? (Array.isArray(value) ? value : [value]) : []
          }
          visible={showModal}
          onClose={() => handleShowModal(false)}
          orgs={orgUnits || []}
          onSelectOrgUnits={(selectedUsers: number[]) => {
            if (multiSelect) {
              onChange(selectedUsers);
            } else {
              onChange(selectedUsers[0]);
            }
          }}
        />
      )}
    </>
  );
};

export default SelectOU;
