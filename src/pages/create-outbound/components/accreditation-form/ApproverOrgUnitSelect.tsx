import { FormControl, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useLanguage } from "../../../../context/language";
import { MaterialSelect } from "../../../../components/ui/dropdown/material-dropdown";
import apiRequest from "../../../../lib/api";
import ENV from "../../../../constants/env";
import { AxiosRequestConfig } from "axios";
import Storage from "../../../../lib/storage";
import LOCALSTORAGE from "../../../../constants/local-storage";

interface Props {
  orgUnitCode: string;
  values?: string;
  handleValuesChange?: (value: string | number) => any;
}

interface Item {
  key: string;
  description: string;
}

export default function ApproverOrgUnitSelect({
  handleValuesChange,
  values,
  orgUnitCode,
}: Props) {
  const { labels } = useLanguage();

  const [types, setTypes] = useState<Item[] | undefined>(undefined);
  const [_loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true; // Prevent state updates if the component unmounts

    const fetchPickListItems = async () => {
      setLoading(true);
      setError(null);

      try {
        const token = await Storage.getItem(LOCALSTORAGE.LEGACY_ACCESS_TOKEN);
        const headers: AxiosRequestConfig["headers"] = {
          Authorization: `Bearer ${token}`,
        };

        const data = await apiRequest(
          "GET",
          `/approve-outbound/approver-org-units?sendingOrgCode=${orgUnitCode}`,
          {},
          { headers },
          ENV.API_URL_LEGACY
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
        label={labels.lbl.select_approver}
        onChange={(val) => handleValuesChange && handleValuesChange(val)}
        // @ts-ignore
        options={
          types?.map((item) => ({
            label: item.description,
            value: item.key + "",
          })) ?? []
        }
      />
    </FormControl>
  );
}
