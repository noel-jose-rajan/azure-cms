import React from "react";
import { Box, InputLabel } from "@mui/material";
import { Row, Col } from "antd";
import { useTheme } from "../../../../context/theme";
import { useLanguage } from "../../../../context/language";
import { Accordion } from "../../../../components/ui/accordions/accordion";
import { FilterOutlined } from "@ant-design/icons";
import AdvanceSearchLeftSide from "./components/left";
import AdvanceSearchRightSide from "./components/right";
import OrganizationUnitSearch from "../../../../components/ui/search/unit-2";

interface Props {
    values: any;
    onChange: any;
}

const AdvancedSearchForm: React.FC<Props> = ({ values, onChange }) => {
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
                <Col xs={24} md={24}>
                    {values.singleCriteria.finalApproverOrgUnitId !== -1 && <InputLabel>{labels.lbl.out_final_approver}</InputLabel>}
                    <OrganizationUnitSearch
                        label={labels.lbl.out_final_approver}
                        multiple={false}
                        value={
                            values.singleCriteria?.finalApproverOrgUnitId && values.singleCriteria?.finalApproverOrgUnitId !== -1
                                ? [values.singleCriteria?.finalApproverOrgUnitId as any]
                                : undefined
                        }
                        onSelect={(unit) => !Array.isArray(unit) && handleValuesChange("singleCriteria.finalApproverOrgUnitId", unit)}
                        onChange={() => handleValuesChange("singleCriteria.finalApproverOrgUnitId", -1)}
                    />
                </Col>
                {/* Left Column */}
                <Col xs={24} md={12}>
                    <AdvanceSearchLeftSide
                        values={values}
                        handleValuesChange={handleValuesChange}
                    />
                </Col>

                {/* Right Column */}
                <Col xs={24} md={12}>
                    <AdvanceSearchRightSide
                        values={values}
                        handleValuesChange={handleValuesChange}
                    />
                </Col>
            </Row>
        </Accordion>
    );
};

export default AdvancedSearchForm;
