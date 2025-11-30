import AdvancedSearchForm from "../advance-search-form";
import BasicSearchForm from "../basic-search-form";
import { SearchQuery } from "../../types";

interface Props {
    formValues: SearchQuery
    setFormValues: React.Dispatch<React.SetStateAction<SearchQuery>>

}

export default function SearchContainer({ formValues, setFormValues }: Props) {


    const handleValuesChange = (changedValues: any) => {

        const updatedValues = { ...formValues, ...changedValues };
        setFormValues(updatedValues);
    };

    return (
        <>
            <br />
            <BasicSearchForm
                values={formValues}
                onChange={handleValuesChange}
            />
            <br />
            <AdvancedSearchForm
                values={formValues}
                onChange={handleValuesChange}
            />
            <br />

        </>
    )
}
