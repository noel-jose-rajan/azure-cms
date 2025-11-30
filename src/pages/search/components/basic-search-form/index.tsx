import React from "react";
import { Box } from "@mui/material";
import { Row, Col } from "antd";
import { useTheme } from "../../../../context/theme";
import { useLanguage } from "../../../../context/language";
import { Accordion } from "../../../../components/ui/accordions/accordion";
import { FilterOutlined } from "@ant-design/icons";

import BasicSearchLeftSide from "./components/left";
import BasicSearchRightSide from "./components/right";
import { SearchQuery } from "../../types";

interface Props {
    values: SearchQuery;
    onChange: any;
}

const BasicSearchForm: React.FC<Props> = ({ values, onChange }) => {
    const { theme } = useTheme();
    const { labels } = useLanguage();

    const Header = ({ title }: { title?: string }) => (
        <Box display="flex" alignItems="center" gap={1} color={theme.colors.backgroundText}>
            <FilterOutlined />
            <span>{title}</span>
        </Box>
    );


    const handleValuesChange = (field: string, value: any) => {
        const updatedValues = { ...values };

        if (field.includes('.')) {
            const fields = field.split('.');

            fields.reduce((acc, part, index) => {
                if (index === fields.length - 1) {
                    //@ts-ignore
                    acc[part] = value;
                } else {
                    //@ts-ignore
                    if (!acc[part]) acc[part] = {};
                }
                //@ts-ignore
                return acc[part];
            }, updatedValues);
        } else {
            //@ts-ignore
            updatedValues[field] = value;
        }
        onChange(updatedValues);
    };

    return (
        <Accordion
            header={<Header title={labels.til.basicSearchCirteria} />}
            panelKey=""
            collapseContainerStyleProps={{
                backgroundColor: theme.colors.primary,
            }}
            icon={<FilterOutlined />}
        >
            <Row gutter={[16, 16]}>
                {/* Left Column */}
                <Col xs={24} md={12}>
                    <BasicSearchLeftSide
                        handleValuesChange={handleValuesChange}
                        values={values}
                    />
                </Col>


                {/* Right Column */}
                <Col xs={24} md={12}>
                    <BasicSearchRightSide
                        handleValuesChange={handleValuesChange}
                        values={values}
                    />
                </Col>
            </Row >
        </Accordion >
    );
};

export default BasicSearchForm;
