import { FormControl, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { Correspondence, PickListItemType } from "../../../../types";
import { getPickListsItems } from "../../../../service";
import PICK_LIST_NAME from "../../../../../../constants/app-constants/pick-list-name";
import { useLanguage } from "../../../../../../context/language";
import { MaterialSelect } from "../../../../../../components/ui/dropdown/material-dropdown";

interface Props {
    values: Correspondence;
    handleValuesChange: (value: any) => any;
}

export default function SecurityLevelSelect({
    handleValuesChange
}: Props) {
    const { labels, isEnglish } = useLanguage()

    const [types, setTypes] = useState<PickListItemType[] | undefined>(undefined);
    const [_loading, setLoading] = useState<boolean>(true);
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
            <MaterialSelect
                label={labels.pk.security_level}
                onChange={(val) => handleValuesChange(val)}
                // @ts-ignore
                options={
                    types?.map(
                        item => ({
                            label: isEnglish ? item.picklistEnLabel : item.picklistArLabel, value: item.pickListId + ""
                        })) ?? []
                }
            />
        </FormControl>
    );
}