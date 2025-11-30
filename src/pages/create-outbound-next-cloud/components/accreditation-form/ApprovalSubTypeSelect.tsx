import { FormControl, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useLanguage } from "../../../../context/language";
import { PickListItemType } from "../../types";
import PICK_LIST_NAME from "../../../../constants/app-constants/pick-list-name";
import { getPickListsItems } from "../../service";
import { MaterialSelect } from "../../../../components/ui/dropdown/material-dropdown";

interface Props {
  values?: string;
  handleValuesChange?: (value: string | number) => any;
}

export default function ApprovalSubTypeSelect({
  handleValuesChange,
  values,
}: Props) {
  const { labels, isEnglish } = useLanguage();

  const [types, setTypes] = useState<PickListItemType[] | undefined>(undefined);
  const [_loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true; // Prevent state updates if the component unmounts

    const fetchPickListItems = async () => {
      setLoading(true);
      setError(null);

      try {
        const data = await getPickListsItems(PICK_LIST_NAME.APPROVAL_SUBTYPE);
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
        value={values}
        label={labels.pk.approval_subtype}
        onChange={(val) => handleValuesChange && handleValuesChange(val)}
        // @ts-ignore
        options={
          types?.map((item) => ({
            label: isEnglish ? item.picklistEnLabel : item.picklistArLabel,
            value: item.pickListId + "",
          })) ?? []
        }
      />
    </FormControl>
  );
}
