import { FormControl, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useLanguage } from "../../../../context/language";
import { MaterialSelect } from "../../../../components/ui/dropdown/material-dropdown";
import { UserTitle } from "../../types";
import { getTitles } from "../../service";

interface Props {
  value?: number | UserTitle;
  onChange: (value: UserTitle) => any;
}

export default function ApproverTitleSelect({ value, onChange }: Props) {
  const { labels, isEnglish } = useLanguage();

  const [titles, setTitles] = useState<UserTitle[] | undefined>([]);
  const [_loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true; // Prevent state updates if the component unmounts

    const fetchPickListItems = async () => {
      setLoading(true);
      setError(null);

      try {
        const data = await getTitles();
        if (isMounted) {
          setTitles(data || []);
        }
      } catch (err) {
        if (isMounted) {
          setError(labels.msg.error_title);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchPickListItems();

    return () => {
      isMounted = false;
    };
  }, []);

  console.log(value);

  const handleSelect = (val: string) => {
    const selectedTitle = titles?.find((f) => f.userTitleId === parseInt(val));
    if (selectedTitle) {
      onChange(selectedTitle);
    }
  };

  if (error) {
    return (
      <FormControl fullWidth margin="normal">
        <Typography color="error" variant="body2">
          {error}
        </Typography>
      </FormControl>
    );
  }

  return (
    <FormControl fullWidth margin="normal">
      <MaterialSelect
        label={labels.lbl.approver_title}
        onChange={handleSelect}
        value={
          typeof value === "number"
            ? value + ""
            : value?.userTitleId
            ? value?.userTitleId + ""
            : undefined
        }
        options={
          titles?.map((item) => ({
            label: isEnglish
              ? item.enUserTitle ?? "Name Error!"
              : item.arUserTitle ?? "خطأ في الإسم!",
            value: item.userTitleId + "",
          })) ?? []
        }
      />
    </FormControl>
  );
}
