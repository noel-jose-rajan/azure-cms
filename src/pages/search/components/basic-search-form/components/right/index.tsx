import { ArrowRightOutlined } from "@ant-design/icons";
import { TextField } from "@mui/material";
import { Col, Row } from "antd";
import CorrespondenceTypesSelect from "./ CorrespondenceTypesSelect";
import DocumentTypesSelect from "./ DocumentTypesSelect";
import OutboundTypesSelect from "./ OutboundTypesSelect";
import StatusTypesSelect from "./StatusTypesSelect";
import dayjs from "dayjs";
import { useLanguage } from "../../../../../../context/language";

interface Props {
    values: any;
    handleValuesChange: (field: string, value: any) => any
}

export default function BasicSearchRightSide({ handleValuesChange, values }: Props) {

    const { labels } = useLanguage()

    return (
        <>

            <CorrespondenceTypesSelect
                values={values}
                handleValuesChange={handleValuesChange}
            />

            <OutboundTypesSelect
                values={values}
                handleValuesChange={handleValuesChange}
            />

            <DocumentTypesSelect
                values={values}
                handleValuesChange={handleValuesChange}
            />

            <StatusTypesSelect
                values={values}
                handleValuesChange={handleValuesChange}
            />




            <Row gutter={[8, 8]} align="middle">
                <Col xs={10}>
                    <TextField
                        margin="normal"
                        variant="standard"
                        fullWidth
                        type="date"

                        label={labels.lbl.corres_date_from}
                        InputLabelProps={{ shrink: true }}
                        value={dayjs(values?.singleCriteria?.correspondenceDateFrom, 'DD-MM-YYYY').format('YYYY-MM-DD') || ""}
                        onChange={(e) => handleValuesChange("singleCriteria.correspondenceDateFrom", dayjs(e.target.value, 'YYYY-MM-DD').format("DD-MM-YYYY"))}
                    />
                </Col>
                <Col xs={4} style={{ textAlign: "center" }}>
                    <ArrowRightOutlined />
                </Col>
                <Col xs={10}>
                    <TextField
                        margin="normal"
                        variant="standard"
                        fullWidth
                        type="date"
                        label={labels.lbl.corres_date_to}
                        InputLabelProps={{ shrink: true }}
                        value={dayjs(values?.singleCriteria?.correspondenceDateTo, 'DD-MM-YYYY').format('YYYY-MM-DD') || ""}
                        onChange={(e) => handleValuesChange("singleCriteria.correspondenceDateTo", dayjs(e.target.value, 'YYYY-MM-DD').format("DD-MM-YYYY"))}
                    />
                </Col>
            </Row>
        </>
    )
}
