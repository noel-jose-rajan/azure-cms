import { FormControl, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useLanguage } from "../../../../context/language";
import { MaterialSelect } from "../../../../components/ui/dropdown/material-dropdown";
import { getApproversFromOU } from "../../../../components/services/organization-units";
import { HttpStatus } from "../../../../components/functional/httphelper";
import { UserType } from "../../../../components/services/user-preference/type";

interface Props {
  orgUnitCode: string;
  securityLevelCode: string;
  values?: string;
  handleValuesChange?: (value: string | number) => any;
}
//not used
export default function ApproverUserSelect({
  handleValuesChange,
  values,
  orgUnitCode,
  securityLevelCode,
}: Props) {
  const { labels } = useLanguage();

  const [types, setTypes] = useState<UserType[]>([]);
  const [_loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true; // Prevent state updates if the component unmounts

    const fetchPickListItems = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await getApproversFromOU(
          orgUnitCode,
          securityLevelCode
        );
        if (response.status === HttpStatus.SUCCESS && response.data) {
          if (isMounted) {
            setTypes(response.data);
          }
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
        label={labels.lbl.select_approver_user}
        onChange={(val) => handleValuesChange && handleValuesChange(val)}
        // @ts-ignore
        options={
          types?.map((item) => ({
            label: item.username,
            value: item.username,
          })) ?? []
        }
      />
    </FormControl>
  );
}
