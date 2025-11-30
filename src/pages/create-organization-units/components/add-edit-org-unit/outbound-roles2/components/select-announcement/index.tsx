import { getAllAnnouncements } from "@/components/services/organization-units";
import { AnnouncementType } from "@/components/services/organization-units/type";
import SelectComponent from "@/components/ui/form/select";
import { useLanguage } from "@/context/language";
import { useEffect, useState } from "react";

type Props = {
  value: number[];
  onChange: (value: number[]) => void;
  label: string;
};
const SelectAllAnnouncement = ({ value, onChange, label }: Props) => {
  const { isEnglish } = useLanguage();
  const [announcements, setAnnouncements] = useState<AnnouncementType[]>([]);
  const fetchAllAnnouncements = async () => {
    const res = await getAllAnnouncements();
    if (res) {
      setAnnouncements(res);
    }
  };

  useEffect(() => {
    fetchAllAnnouncements();
  }, []);

  const options =
    announcements?.map((item) => ({
      label: isEnglish ? item.name_en : item.name_ar,
      value: item.id,
    })) || [];
  return (
    <SelectComponent
      mode="multiple"
      isRequired={false}
      label={label}
      value={value}
      options={options}
      onChange={(value: number[] | number) => {
        onChange(value as number[]);
      }}
    />
  );
};

export default SelectAllAnnouncement;
