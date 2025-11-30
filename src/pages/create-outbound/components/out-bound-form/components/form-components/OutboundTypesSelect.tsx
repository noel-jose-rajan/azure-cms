import { FormControl, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { PickListHelper } from "../../../../../../components/services/picklist";
import { PickListItemType } from "../../../../../../components/services/picklist/type";
import { MaterialSelect } from "../../../../../../components/ui/dropdown/material-dropdown";
import { useLanguage } from "../../../../../../context/language";

interface Props {
  value: string;
  handleValuesChange: (value: any) => any;
}

export default function OutboundTypesSelect({
  handleValuesChange,
  value,
}: Props) {
  const { labels, isEnglish } = useLanguage();

  const [types, setTypes] = useState<PickListItemType[]>([]);
  const [_loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchPickListItems = async () => {
      setLoading(true);
      setError(null);

      try {
        const data = await PickListHelper.outboundType();
        let filtered = data.filter((i) => i.picklistCode === "PICKLIST_72");
        if (filtered.length > 0) {
          handleValuesChange(filtered[0]?.picklistCode ?? "");
        }
        if (isMounted) {
          setTypes(filtered);
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
        value={value && value !== "" ? value : "PICKLIST_72"}
        label={labels.lbl.outbound_type + " *"}
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
