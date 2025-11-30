import { TextField } from "@mui/material";
import { Col, Row } from "antd";
import { ArrowRightOutlined } from "@ant-design/icons";
import { useLanguage } from "../../../../../../context/language";
import { SearchQuery } from "../../../../types";
import CorrespondenceSearch from "../../../../../../components/ui/search/correspondence";
interface Props {
    values: SearchQuery;
    handleValuesChange: (field: string, value: any) => any
}

export default function AdvanceSearchRightSide({ handleValuesChange, values }: Props) {

    const { labels } = useLanguage()

    return (
        <>


            <TextField
                variant="standard"
                fullWidth
                margin="normal"
                label={`${labels.inbound} ${labels.lbl.sender_name}`}
                value={values?.singleCriteria?.inboundSenderName || ""}
                onChange={(e) => handleValuesChange("singleCriteria.inboundSenderName", e.target.value)}
            />

            <CorrespondenceSearch
                values={values.multiCriteria?.relatedCorrespondenceIDs}
                label={labels.lbl.related_ref_num}
                onSelect={(e) => {
                    handleValuesChange("multiCriteria.relatedCorrespondenceIDs", e)
                }}
            />


            {/* Date Pickers with Arrow */}
            <Row gutter={[8, 8]} align="middle">
                <Col xs={10}>
                    <TextField
                        margin="normal"
                        variant="standard"
                        fullWidth
                        type="date"
                        label={labels.lbl.creation_date_from}
                        InputLabelProps={{ shrink: true }}
                        value={values?.singleCriteria?.createdDateFrom || ""}
                        onChange={(e) => handleValuesChange("singleCriteria.createdDateFrom", e.target.value)}
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
                        label={labels.lbl.creation_date_to}
                        InputLabelProps={{ shrink: true }}
                        value={values?.singleCriteria?.createdDateTo || ""}
                        onChange={(e) => handleValuesChange("singleCriteria.createdDateTo", e.target.value)}
                    />
                </Col>
            </Row>

            <Row gutter={[8, 8]} align="middle">
                <Col xs={10}>
                    <TextField
                        margin="normal"
                        variant="standard"
                        fullWidth
                        type="date"
                        label={labels.lbl.sign_date_from}

                        InputLabelProps={{ shrink: true }}
                        value={values?.singleCriteria?.signDateFrom || ""}
                        onChange={(e) => handleValuesChange("singleCriteria.signDateFrom", e.target.value)}
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
                        label={labels.lbl.sign_date_to}

                        InputLabelProps={{ shrink: true }}
                        value={values?.singleCriteria?.signDateTo || ""}
                        onChange={(e) => handleValuesChange("singleCriteria.signDateTo", e.target.value)}
                    />
                </Col>
            </Row>

            <Row gutter={[8, 8]} align="middle">
                <Col xs={10}>
                    <TextField
                        margin="normal"
                        variant="standard"
                        fullWidth
                        type="date"
                        label={labels.lbl.receive_date_from}

                        InputLabelProps={{ shrink: true }}
                        value={values?.singleCriteria?.signDateFrom || ""}
                        onChange={(e) => handleValuesChange("singleCriteria.recieveDateFrom", e.target.value)}
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
                        label={labels.lbl.receive_date_to}
                        InputLabelProps={{ shrink: true }}
                        value={values?.singleCriteria?.signDateTo || ""}
                        onChange={(e) => handleValuesChange("singleCriteria.recieveDateTo", e.target.value)}
                    />
                </Col>
            </Row>

            <Row gutter={[8, 8]} align="middle">
                <Col xs={10}>
                    <TextField
                        margin="normal"
                        variant="standard"
                        fullWidth
                        type="date"
                        label={labels.lbl.send_date_from}

                        InputLabelProps={{ shrink: true }}
                        value={values?.singleCriteria?.sentDateFrom || ""}
                        onChange={(e) => handleValuesChange("singleCriteria.sentDateFrom", e.target.value)}
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
                        label={labels.lbl.send_date_to}
                        InputLabelProps={{ shrink: true }}
                        value={values?.singleCriteria?.sentDateTo || ""}
                        onChange={(e) => handleValuesChange("singleCriteria.sentDateTo", e.target.value)}
                    />
                </Col>
            </Row>


        </>
    )
}
