import { FormControl, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { AxiosRequestConfig } from "axios";
import apiRequest from "../../../../lib/api";
import ENV from "../../../../constants/env";
import { useLanguage } from "../../../../context/language";
import Storage from "../../../../lib/storage";
import LOCALSTORAGE from "../../../../constants/local-storage";
import { MaterialSelect } from "../../../../components/ui/dropdown/material-dropdown";

interface OrgUnit {
  organizationUnitId: number;
  orgUnitCode: string;
  orgUnitDescAr: string;
  orgUnitDescEn: string;
}

interface Props {
  values?: string;
  onChange?: (unit: OrgUnit) => any;
}

export default function SelectSendingEntity({ values, onChange }: Props) {
  const { labels, isEnglish } = useLanguage();

  const [types, setTypes] = useState<OrgUnit[] | undefined>(undefined);
  const [_loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true; // Prevent state updates if the component unmounts

    const fetchPickListItems = async () => {
      const token = Storage.getItem(LOCALSTORAGE.LEGACY_ACCESS_TOKEN);
      const headers: AxiosRequestConfig["headers"] = {
        Authorization: `Bearer ${token}`,
      };

      setLoading(true);
      setError(null);

      try {
        const data = await apiRequest(
          "GET",
          "/user/has-multi-initiation-role/outbound",
          {},
          { headers },
          ENV.API_URL_LEGACY
        );

        if (isMounted) {
          setTypes(data?.OrgUnits || []);
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

  const handleValuesChange = (orgUnitCode: number | string) => {
    const selected = types?.find((f) => f.orgUnitCode === orgUnitCode);

    onChange && selected && onChange(selected);
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
        //@ts-ignore
        value={values}
        label={labels.lbl.sending_entity}
        onChange={(val) => handleValuesChange(val)}
        // @ts-ignore
        options={
          types?.map((item) => ({
            label: isEnglish ? item.orgUnitDescEn : item.orgUnitDescAr,
            value: item.orgUnitCode,
          })) ?? []
        }
      />
    </FormControl>
  );
}
