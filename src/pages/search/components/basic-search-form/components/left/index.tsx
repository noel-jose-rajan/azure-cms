import { FormControl, TextField } from "@mui/material";
import { Col, Row } from "antd";
import Checkbox from "antd/es/checkbox/Checkbox";
import SenderTypesSelect from "./SenderTypesSelect";
import { useLanguage } from "../../../../../../context/language";
import ReceiverTypesSelect from "./ReceiverTypesSelect";

interface Props {
    values: any;
    handleValuesChange: (field: string, value: any) => any
}

export default function BasicSearchLeftSide({ handleValuesChange, values }: Props) {

    const { labels , isEnglish } = useLanguage()

    return (
        <>
            <TextField
                fullWidth
                variant="standard"
                margin="normal"
                label={labels.lbl.corr_subject}
                value={values?.singleCriteria?.subject}
                onChange={(e) => handleValuesChange("singleCriteria.subject", e.target.value)

                }
            />
            <TextField
                fullWidth
                variant="standard"
                margin="normal"
                label={labels.lbl.corr_number}
                value={values?.singleCriteria?.correspondenceNo || ""}
                onChange={(e) => handleValuesChange("singleCriteria.correspondenceNo", e.target.value)}
            />

            <SenderTypesSelect
                values={values}
                handleValuesChange={handleValuesChange}
            />

            <ReceiverTypesSelect
                values={values}
                handleValuesChange={handleValuesChange}
            />




            <Row>

                <FormControl fullWidth margin="normal">
                    <Checkbox
                        checked={values?.singleCriteria?.createdByMe || false}
                        onChange={(e) => handleValuesChange("singleCriteria.createdByMe", e.target.checked)}
                    >
                        {labels.lbl.created_by_me}
                    </Checkbox>
                </FormControl>
                <FormControl fullWidth margin="normal">
                    <Checkbox
                        checked={values?.singleCriteria?.isDeleted || false}
                        onChange={(e) => handleValuesChange("singleCriteria.isDeleted", e.target.checked)}
                    >
                        {labels.lbl.deleted}
                    </Checkbox>
                </FormControl>
                <FormControl fullWidth margin="normal">
                    <Checkbox
                        checked={values?.singleCriteria?.contentSearch || false}
                        onChange={(e) => handleValuesChange("singleCriteria.contentSearch", e.target.checked)}
                    >
                        {labels.lbl.search_contentSearch}
                    </Checkbox>
                </FormControl>
                <FormControl fullWidth margin="normal">
                    <Checkbox
                        checked={values?.singleCriteria?.createdByMe || false}
                        onChange={(e) => handleValuesChange("singleCriteria.createdByMe", e.target.checked)}
                    >
                        {isEnglish ? "Backlogs" : "المتراكمة"}
                    </Checkbox>
                </FormControl>

                <Col></Col>
            </Row>
        </>
    )
}
