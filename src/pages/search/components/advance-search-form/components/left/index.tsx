import { TextField } from "@mui/material";
import SecurityLevelSelect from "./SecurityLevelSelect";
import UrgencyLevelSelect from "./UrgencyLevelSelect";
import KeywordInput from "./KeyWordInput";
import { SearchQuery } from "../../../../types";
import { useLanguage } from "../../../../../../context/language";
interface Props {
    values: SearchQuery;
    handleValuesChange: (field: string, value: any) => any
}

export default function AdvanceSearchLeftSide({ handleValuesChange, values }: Props) {

    const { labels } = useLanguage()

    return (
        <>
            <SecurityLevelSelect values={values} handleValuesChange={handleValuesChange} />

            <UrgencyLevelSelect values={values} handleValuesChange={handleValuesChange} />


            <TextField
                variant="standard"
                fullWidth
                margin="normal"
                label={labels.lbl.barcode}
                value={values?.singleCriteria?.barcode || ""}
                onChange={(e) => handleValuesChange("singleCriteria.barcode", e.target.value)}
            />


            <TextField
                fullWidth
                variant="standard"
                margin="normal"
                label={labels.lbl.remarks}
                value={values?.singleCriteria?.remarks || ""}
                onChange={(e) => handleValuesChange("singleCriteria.remarks", e.target.value)}
            />

            <TextField
                fullWidth
                variant="standard"
                margin="normal"
                label={labels.lbl.ext_ref_num}
                value={values?.singleCriteria?.externalReferenceNo || ""}
                onChange={(e) => handleValuesChange("singleCriteria.externalReferenceNo", e.target.value)}
            />

            <KeywordInput values={values} handleValuesChange={handleValuesChange} />


        </ >
    )
}
