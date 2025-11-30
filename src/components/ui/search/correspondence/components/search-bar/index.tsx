import React from "react";
import { Box, TextField } from "@mui/material";
import { Row, Col } from "antd";
import { ArrowRightOutlined, FilterOutlined } from "@ant-design/icons";
import { useTheme } from "../../../../../../context/theme";
import { useLanguage } from "../../../../../../context/language";
import { Accordion } from "../../../../accordions/accordion";
import SenderTypesSelect from "./components/SenderTypesSelect";
import ReceiverTypesSelect from "./components/ReceiverTypesSelect";
import KeywordInput from "./components/KeyWordInput";
import SecurityLevelSelect from "./components/SecurityLevelSelect";
import UrgencyLevelSelect from "./components/UrgencyLevelSelect";
import StatusTypesSelect from "./components/StatusTypesSelect";


interface Props {
    values: any;
    onChange: any;
}

const SearchBar: React.FC<Props> = ({ values, onChange }) => {
    const { theme } = useTheme();
    const { labels } = useLanguage();

    const Header = ({ title }: { title?: string }) => (
        <Box display="flex" alignItems="center" gap={1} color={theme.colors.backgroundText}>
            <FilterOutlined />
            <span>{title}</span>
        </Box>
    );

    // Handle changes to form fields
    const handleValuesChange = (field: string, value: any) => {
        console.log(field);

        const updatedValues = { ...values };

        if (field.includes('.')) {
            const fields = field.split('.');

            fields.reduce((acc, part, index) => {
                if (index === fields.length - 1) {
                    acc[part] = value;
                } else {
                    if (!acc[part]) acc[part] = {};
                }
                return acc[part];
            }, updatedValues);
        } else {
            updatedValues[field] = value;
        }
        onChange(updatedValues);
    };

    return (
        <Accordion
            header={<Header title={labels.til.advancedSearchCirteria} />}
            panelKey=""
            collapseContainerStyleProps={{
                backgroundColor: theme.colors.primary,
            }}
            icon={<FilterOutlined />}
        >
            <Row gutter={[16, 16]}>
                {/* Left Column */}
                <Col xs={24} md={12}>
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

                    <KeywordInput
                        values={values}
                        handleValuesChange={handleValuesChange}
                    />
                </Col>

                {/* Right Column */}
                <Col xs={24} md={12}>


                    <StatusTypesSelect
                        values={values}
                        handleValuesChange={handleValuesChange}
                    />


                    <SecurityLevelSelect values={values} handleValuesChange={handleValuesChange} />

                    <UrgencyLevelSelect values={values} handleValuesChange={handleValuesChange} />

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


                </Col>
            </Row>
        </Accordion>
    );
};

export default SearchBar;
