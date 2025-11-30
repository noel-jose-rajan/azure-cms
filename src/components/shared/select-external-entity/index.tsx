import SelectComponent from "@/components/ui/form/select";
import { useLanguage } from "@/context/language";
import { SearchOutlined } from "@ant-design/icons";
import { useState } from "react";
import ExternalEntitySearchModal from "./components/modal-wrappers";
import useExternalEntities from "@/store/external-entities/use-external-entities";
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
const SelectExternalEntity = ({
  multiSelect,
  onChange,
  value,
  label,
  error,
  disabled,
  isRequired,
  canClear = false,
}: Props) => {
  const { entites, loading } = useExternalEntities();
  const { isEnglish } = useLanguage();
  const [showModal, setShowModal] = useState<boolean>(false);
  const handleShowModal = (bool: boolean) => {
    setShowModal(bool);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };
  const options =
    entites?.map((item) => ({
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
        Icon={<SearchOutlined onClick={() => handleShowModal(true)} />}
        canClear={canClear}
      />

      {showModal && (
        <ExternalEntitySearchModal
          onSelect={onChange}
          data={entites}
          multiSelect={multiSelect}
          onClose={handleCloseModal}
        />
      )}
    </>
  );
};

export default SelectExternalEntity;
