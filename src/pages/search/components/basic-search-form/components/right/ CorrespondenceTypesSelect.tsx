import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { PickListItemType } from "../../../../types";
import { getPickListsItems } from "../../../../service";
import PICK_LIST_NAME from "../../../../../../constants/app-constants/pick-list-name";
import { useLanguage } from "../../../../../../context/language";

interface Props {
  values: any;
  handleValuesChange: (field: string, value: any) => any;
}

export default function CorrespondenceTypesSelect({}: Props) {
  const { labels, isEnglish } = useLanguage();

  const [types, setTypes] = useState<PickListItemType[] | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchParams, setSearchParams] = useSearchParams();

  // Get default value from URL parameter
  const defaultValue = searchParams.get("correspondenceTypeCode") || "";

  useEffect(() => {
    let isMounted = true; // Prevent state updates if the component unmounts

    const fetchPickListItems = async () => {
      setLoading(true);
      setError(null);

      try {
        const data = await getPickListsItems(
          PICK_LIST_NAME.CORRESPONDENCE_TYPE
        );
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

  const handleChange = (value: string) => {
    setSearchParams({
      page: searchParams.get("page") ?? "",
      receivingEntityType: searchParams.get("receivingEntityType") ?? "0",
      sendingEntityType: searchParams.get("sendingEntityType") ?? "0",
      criteriaValue: searchParams.get("criteriaValue") ?? "",
      searchByContent: searchParams.get("searchByContent") ?? "",
      correspondenceTypeCode: value,
    }); // Update the URL parameter
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
      <InputLabel>{labels.lbl.correspondence_type}</InputLabel>
      <Select
        disabled={loading}
        variant="standard"
        value={defaultValue}
        onChange={(e) => handleChange(e.target.value)}
      >
        {Array.isArray(types) &&
          types.map((item) => (
            <MenuItem value={item.picklistCode} key={item.pickListId}>
              {isEnglish ? item.picklistEnLabel : item.picklistArLabel}
            </MenuItem>
          ))}
      </Select>
    </FormControl>
  );
}
