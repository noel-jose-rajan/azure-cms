import SelectComponent from "@/components/ui/form/select";
import { useLanguage } from "@/context/language";
import { EmployeeType, getEmployeeList } from "@/pages/dashboard_new/service";
import useGetAllUsers from "@/store/users/use-get-all-users";
import React, { useEffect, useState } from "react";
type Props = {
  value?: number | null;
  onChange: (val: number) => void;
};
const SelectAssigne = ({ onChange, value }: Props) => {
  const { isEnglish, labels } = useLanguage();
  const [users, setUsers] = useState<EmployeeType[]>([]);
  const [loading, setLoading] = useState(true);
  const fetchUserList = async () => {
    try {
      const res = await getEmployeeList();

      if (res) {
        setUsers(res);
      }
    } catch (e) {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserList();
  }, []);

  const { getUserById } = useGetAllUsers();
  const userOptions = users
    ?.map((u) => getUserById(u?.id))
    ?.map((u) => ({
      label: isEnglish ? u?.name_en : u?.name_ar,
      value: u?.id,
    }));
  return (
    <SelectComponent
      key={isEnglish + ""}
      spinning={loading}
      options={userOptions || []}
      label={labels.lbl.name}
      allowClear
      value={value}
      onChange={(val) => onChange(val as number)}
    />
  );
};

export default SelectAssigne;
