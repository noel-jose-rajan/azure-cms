import { FormControl, InputLabel, MenuItem, Select, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { PickListItemType, SearchQuery } from "../../../../types";
import { getPickListsItems } from "../../../../service";
import PICK_LIST_NAME from "../../../../../../constants/app-constants/pick-list-name";
import { Checkbox } from "antd";
import { useLanguage } from "../../../../../../context/language";

interface Props {
    values: SearchQuery;
    handleValuesChange: (field: string, value: any) => any;
}

export default function DocumentTypesSelect({
    values,
    handleValuesChange
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
                const data = await getPickListsItems(PICK_LIST_NAME.DOCUMENT_TYPE);
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
            <InputLabel>{labels.lbl.document_type}</InputLabel>
            <Select
                multiple
                disabled={loading}
                variant="standard"
                value={values.multiCriteria?.documentTypePicklistIDs}
                onChange={(e) => handleValuesChange("multiCriteria.documentTypePicklistIDs", e.target.value)}
            >
                {Array.isArray(types) &&
                    types.map((item) => (
                        <MenuItem value={item.
                            pickListId
                        } key={item.pickListId}>
                            <Checkbox checked={values.multiCriteria?.documentTypePicklistIDs?.includes(item.pickListId!)} /> {' '} &nbsp;{isEnglish ? item.picklistEnLabel : item.picklistArLabel}
                        </MenuItem>
                    ))}
            </Select>
        </FormControl>
    );
}