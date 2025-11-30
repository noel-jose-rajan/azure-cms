import { FormControl, InputLabel, MenuItem, Select, Typography } from "@mui/material";
import { useEffect, useState } from "react";


import { Checkbox } from "antd";
import { CorrespondenceSearchCriteria } from "../../../types";
import PICK_LIST_NAME from "../../../../../../../constants/app-constants/pick-list-name";
import { useLanguage } from "../../../../../../../context/language";
import { getPickListsItems } from "../../../service";

interface Props {
    values: CorrespondenceSearchCriteria;
    handleValuesChange: (field: string, value: any) => any;
}

export default function SecurityLevelSelect({
    values,
    handleValuesChange
}: Props) {
    const { labels } = useLanguage()

    const [types, setTypes] = useState<any[] | undefined>(undefined);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let isMounted = true; // Prevent state updates if the component unmounts

        const fetchPickListItems = async () => {
            setLoading(true);
            setError(null);

            try {
                const data = await getPickListsItems(PICK_LIST_NAME.SECURITY_LEVEL);
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
            <InputLabel>{labels.pk.security_level}</InputLabel>
            <Select
                multiple
                disabled={loading}
                variant="standard"
                value={values.multiCriteria?.securityPicklistIDs}
                onChange={(e) => handleValuesChange("multiCriteria.securityPicklistIDs", e.target.value)}
            >
                {Array.isArray(types) &&
                    types.map((item) => (
                        <MenuItem value={item.
                            pickListId
                        } key={item.pickListId}>
                            <Checkbox checked={values.multiCriteria?.securityPicklistIDs?.includes(item.pickListId!)} /> {' '} &nbsp;{item.picklistEnLabel}
                        </MenuItem>
                    ))}
            </Select>
        </FormControl>
    );
}