import { FormControl, InputLabel, MenuItem, Select, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { PickListItemType, SearchQuery } from "../../../../types";
import PICK_LIST_NAME from "../../../../../../constants/app-constants/pick-list-name";
import { Checkbox } from "antd";
import { useLanguage } from "../../../../../../context/language";
import { getPickListsItems } from "../../../../service";

interface Props {
    values: SearchQuery;
    handleValuesChange: (field: string, value: any) => any;
    fieldName?: string
}

export default function StatusTypesSelect({
    values,
    handleValuesChange,
    fieldName
}: Props) {

    const { labels, isEnglish } = useLanguage()

    const [types, setTypes] = useState<PickListItemType[] | undefined>(undefined);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let isMounted = true; // Prevent state updates if the component unmounts

        const fetchPickListItems = async () => {
            setLoading(true);
            setError(null);

            try {
                const data = await getPickListsItems(PICK_LIST_NAME.STATUS);
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
            <InputLabel>{labels.lbl.status}</InputLabel>
            <Select
                multiple
                disabled={loading}
                variant="standard"
                value={values.multiCriteria?.statusPicklistIDs ?? []}
                onChange={(e) => handleValuesChange(fieldName ?? "statusPicklistIDs", e.target.value)}
            >
                {Array.isArray(types) &&
                    types.map((item) => (
                        <MenuItem value={item.
                            pickListId
                        } key={item.pickListId}>
                            <Checkbox checked={values.multiCriteria?.statusPicklistIDs?.includes(item.pickListId!)} /> {' '} &nbsp;{isEnglish ? item.picklistEnLabel : item.picklistArLabel}
                        </MenuItem>
                    ))}
            </Select>
        </FormControl>
    );
}