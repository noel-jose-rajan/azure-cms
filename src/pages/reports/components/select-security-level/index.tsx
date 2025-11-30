import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";

import { Checkbox } from "antd";
import PICK_LIST_NAME from "../../../../constants/app-constants/pick-list-name";
import { useLanguage } from "../../../../context/language";
import { getPickListsItems, PicklistItem } from "../../service";

interface Props {
  handleValuesChange?: (value?: PicklistItem[]) => any;
  value?: number[];
}

export default function SelectUrgencyLevel({
  handleValuesChange,
  value = [],
}: Props) {
  const { labels, isEnglish } = useLanguage();

  const [types, setTypes] = useState<PicklistItem[] | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true; // Prevent state updates if the component unmounts

    const fetchPickListItems = async () => {
      setLoading(true);
      setError(null);

      try {
        const data = await getPickListsItems(PICK_LIST_NAME.URGENCY_LEVEL);
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

  const handelChange = (selectedItemValue: number[]) => {
    const frequencyMap = selectedItemValue.reduce<Record<number, number>>(
      (acc, id) => {
        acc[id] = (acc[id] || 0) + 1;
        return acc;
      },
      {}
    );

    const filteredValues = selectedItemValue.filter(
      (id) => frequencyMap[id] === 1
    );

    const fullItemData = types?.filter((item) =>
      filteredValues.includes(item.pickListId!)
    );

    handleValuesChange && handleValuesChange(fullItemData);
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
      <InputLabel>{labels.lbl.urgency_level}</InputLabel>
      <Select
        multiple
        disabled={loading}
        variant="standard"
        value={value}
        onChange={(e) => handelChange(e.target.value as number[])}
      >
        {Array.isArray(types) &&
          types.map((item) => (
            <MenuItem value={item.pickListId} key={item.pickListId}>
              <Checkbox checked={value?.includes(item.pickListId!)} /> &nbsp;
              {isEnglish ? item.picklistEnLabel : item.picklistArLabel}
            </MenuItem>
          ))}
      </Select>
    </FormControl>
  );
}
