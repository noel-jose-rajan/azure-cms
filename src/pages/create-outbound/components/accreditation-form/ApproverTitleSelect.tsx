import { FormControl } from "@mui/material";
import { useEffect, useState } from "react";
import { useLanguage } from "../../../../context/language";
import { getUserTitles, UserTitle } from "@/components/shared/outbound/service";
import SelectComponent from "@/components/ui/form/select";

interface Props {
  value: number | undefined;
  onChange: (value: number | undefined) => void;
}

export default function ApproverTitleSelect({ value, onChange }: Props) {
  const { labels, isEnglish } = useLanguage();

  const [titles, setTitles] = useState<UserTitle[] | undefined>([]);
  const [_loading, setLoading] = useState<boolean>(true);

  const fetchTitles = async () => {
    setLoading(true);

    try {
      const data = await getUserTitles();
      setTitles(data || []);
    } catch (err) {
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchTitles();
  }, []);

  const options =
    titles?.map((item) => ({
      label: isEnglish ? item.title_ar : item.title_ar,
      value: item.id + "",
    })) ?? [];

  return (
    <FormControl fullWidth margin="normal">
      <SelectComponent
        showDefaultValueIfOneOption
        loading={_loading}
        label={labels.lbl.approver_title}
        onChange={(value) => {
          onChange(value);
        }}
        value={value}
        options={options}
      />
    </FormControl>
  );
}
