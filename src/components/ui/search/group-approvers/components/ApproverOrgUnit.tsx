import { FormControl, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useLanguage } from "../../../../../context/language";
import { MaterialSelect } from "../../../dropdown/material-dropdown";
import { ApproverUserOugUnit } from "../types";
import { getApproverOrgUnits } from "../service";

interface Props {
  value?: ApproverUserOugUnit;
  unitCode?: string;
  onChange?: (value: ApproverUserOugUnit) => any;
}

export default function ApproverOrgUnit({ unitCode, onChange, value }: Props) {
  const { labels } = useLanguage();

  const [approverUnits, setApproverUnits] = useState<
    ApproverUserOugUnit[] | undefined
  >([]);
  const [_loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true; // Prevent state updates if the component unmounts

    const fetchPickListItems = async () => {
      setLoading(true);
      setError(null);

      try {
        const data = await getApproverOrgUnits(unitCode!);
        if (isMounted) {
          setApproverUnits(data || []);
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

  const handleSelect = (val: string) => {
    const selectedTitle = approverUnits?.find((f) => f.key === val);
    if (selectedTitle) {
      onChange && onChange(selectedTitle);
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
        value={value?.key}
        options={
          approverUnits?.map((item) => ({
            label: item.description,
            value: item.key + "",
          })) ?? []
        }
      />
    </FormControl>
  );
}
