import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  ListItemText,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useLanguage } from "../../../../../../context/language";
import { getRoleData } from "../../../../service";

interface Props {
  roleName: string;
  orgUnitCode: string;
  value?: string[];
  handleValuesChange?: (value: string[]) => void; // Updated to handle array of strings
}

export default function DecisionRecivingEntity({
  orgUnitCode,
  roleName,
  handleValuesChange,
  value,
}: Props) {
  const { labels, isEnglish } = useLanguage();

  const [types, setTypes] = useState<
    | {
        groupId: string;
        name: string;
        nameAr: string;
        type: string;
        email: string;
        active: boolean;
        allUsers: boolean;
        desc: unknown;
        isactive: unknown;
        usersIdsList: unknown;
      }[]
    | undefined
  >(undefined);
  const [_loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true; // Prevent state updates if the component unmounts

    const fetchPickListItems = async () => {
      setLoading(true);
      setError(null);

      try {
        const data = await getRoleData(roleName, orgUnitCode);
        console.log(data);

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
      <InputLabel>{labels.lbl.receiving_entity}</InputLabel>
      <Select
        variant="standard"
        multiple // Enable multi-select
        value={value} // Ensure value is an array
        onChange={(e) =>
          handleValuesChange && handleValuesChange(e.target.value as string[])
        }
        renderValue={(_selected) => {
          // Display selected items in a comma-separated format
          const selectedLabels = types?.map((item) =>
            isEnglish ? item.name : item.nameAr
          );
          // ?.filter((item) => selected.includes(item.groupId))

          return selectedLabels?.join(", ") || "";
        }}
      >
        {types?.map((item) => (
          <MenuItem key={item.groupId} value={item.groupId}>
            <Checkbox checked={!!value?.find((f) => f === item.groupId)} />
            <ListItemText primary={isEnglish ? item.name : item.nameAr} />
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
