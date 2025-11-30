import { useState } from "react";
import { useLanguage } from "../../../context/language";
import SelectComponent from "../../ui/form/select";
import { SearchOutlined } from "@ant-design/icons";
import SearchUsersModal from "./components/modal";
import useGetAllUsers from "@/store/users/use-get-all-users";
import { useAuth } from "@/context/auth";

type Props = {
  multiSelect?: boolean;
  onChange: (value: number[] | number) => void;
  value: number[] | number | undefined;
  label: string;
  error?: string | undefined;
  isRequired?: boolean;
  disabled?: boolean;
  hideArr?: number[];
  canClear?: boolean;
  removeCurrentUser?: boolean;
};
const SelectUsers = ({
  onChange,
  value,
  label,
  error,
  multiSelect,
  isRequired,
  hideArr = [],
  disabled = false,
  canClear = false,
  removeCurrentUser = false,
}: Props) => {
  const { isEnglish } = useLanguage();
  const { user } = useAuth();
  const { users, loading } = useGetAllUsers();
  const [showModal, setShowModal] = useState<boolean>(false);
  const handleShowModal = (bool: boolean) => {
    setShowModal(bool);
  };

  const options =
    users
      ?.filter((u) => (removeCurrentUser ? u.username != user?.uid : u))
      ?.map((item) => ({
        label: isEnglish ? item.name_en : item.name_ar || item.name_en,
        value: item.id,
      }))
      ?.filter((u) => !hideArr?.includes(u?.value)) || [];

  return (
    <>
      <SelectComponent
        key={"users" + isEnglish}
        isRequired={isRequired}
        onChange={onChange}
        label={label}
        defaultValue={value}
        value={value}
        disabled={disabled}
        error={error}
        spinning={loading}
        options={options}
        canClear={canClear}
        mode={multiSelect ? "multiple" : undefined}
        Icon={
          // multiSelect ? (
          <SearchOutlined onClick={() => handleShowModal(true)} />
          // ) : undefined
        }
      />
      {showModal && (
        <SearchUsersModal
          label={label}
          multiSelect={multiSelect}
          selectedUsers={value ? (Array.isArray(value) ? value : [value]) : []}
          visible={showModal}
          onClose={() => handleShowModal(false)}
          users={users || []}
          onSelectUsers={(selectedUsers) => {
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

export default SelectUsers;
