import { FormControl, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useLanguage } from "../../../../../../context/language";
import { MaterialSelect } from "../../../../../../components/ui/dropdown/material-dropdown";
import { PickListHelper } from "../../../../../../components/services/picklist";
import { PickListItemType } from "../../../../../../components/services/picklist/type";

interface Props {
  value: string;
  handleValuesChange: (value: string) => any;
}

export default function DocumentTypesSelect({
  handleValuesChange,
  value,
}: Props) {
  const { labels, isEnglish } = useLanguage();

  const [types, setTypes] = useState<PickListItemType[]>([]);
  const [_loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true; // Prevent state updates if the component unmounts

    const fetchPickListItems = async () => {
      setLoading(true);
      setError(null);

      try {
        const data = await PickListHelper.documentType();
        if (data.length > 0) {
          handleValuesChange(data[0]?.picklistCode ?? "");
        }
        if (isMounted) {
          setTypes(data || []);
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
        value={value && value !== "" ? value : types[0]?.picklistCode}
        label={labels.lbl.document_type + " *"}
        onChange={(val) => handleValuesChange(val)}
        // @ts-ignore
        options={
          types?.map((item) => ({
            label: isEnglish ? item.picklistEnLabel : item.picklistArLabel,
            value: item.picklistCode,
          })) ?? []
        }
      />
    </FormControl>
  );
}
