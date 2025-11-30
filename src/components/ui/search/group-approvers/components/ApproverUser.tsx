import { FormControl, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useLanguage } from "../../../../../context/language";
import { MaterialSelect } from "../../../dropdown/material-dropdown";
import { ApproverUser as ApproverUserType } from "../types";
import { getApproverUsers } from "../service";

interface Props {
  value?: ApproverUserType;
  unitCode?: string;
  securityLevelCode?: string;
  onChange?: (value: ApproverUserType) => any;
}

export default function ApproverUser({
  unitCode,
  securityLevelCode,
  onChange,
  value,
}: Props) {
  const { labels } = useLanguage();

  const [approverUsers, setApproverUsers] = useState<
    ApproverUserType[] | undefined
  >([]);
  const [_loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true; // Prevent state updates if the component unmounts

    const fetchPickListItems = async () => {
      setLoading(true);
      setError(null);

      try {
        const data = await getApproverUsers(unitCode!, securityLevelCode!);
        if (isMounted) {
          setApproverUsers(data || []);
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
    const selectedTitle = approverUsers?.find((f) => f.key === val);
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
          approverUsers?.map((item) => ({
            label: item.description,
            value: item.key + "",
          })) ?? []
        }
      />
    </FormControl>
  );
}
