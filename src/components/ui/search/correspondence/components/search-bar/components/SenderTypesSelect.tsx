import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";

import { Col, Row } from "antd";
import { useState } from "react";
import { CorrespondenceSearchCriteria } from "../../../types";
import { useLanguage } from "../../../../../../../context/language";
import OrganizationUnitSearch from "../../../../unit-2";
import ExternalEntitySearch from "../../../../external-entity";



interface Props {
    values: CorrespondenceSearchCriteria;
    handleValuesChange: (field: string, value: any) => any;
}

export default function SenderTypesSelect({
    values,
    handleValuesChange
}: Props) {

    const { labels } = useLanguage()


    const [state, setState] = useState('')

    return (

        <Row gutter={30}>
            <Col span={state === '' ? 24 : 12}>
                <FormControl fullWidth margin="normal">
                    <InputLabel>{labels.lbl.sender_type}</InputLabel>
                    <Select
                        variant="standard"
                        value={state}
                        onChange={(e) => setState(e.target.value)}
                    >
                        <MenuItem value={''} >
                            --
                        </MenuItem>
                        <MenuItem value={'internal'} >
                            {labels.lbl.org_unit}
                        </MenuItem>

                        <MenuItem value={'external'}  >
                            {labels.lbl.external_entity}
                        </MenuItem>
                    </Select>


                </FormControl>
            </Col>
            <Col span={state === '' ? 0 : 12}>

                {state === 'internal'
                    ? <OrganizationUnitSearch
                        value={values.multiCriteria?.sendingEntityIDs as any}
                        onSelect={(e) => !Array.isArray(e) && handleValuesChange("multiCriteria.sendingEntityIDs", [e])}
                        onChange={() => handleValuesChange("multiCriteria.sendingEntityIDs", [])}
                    />
                    : <ExternalEntitySearch
                        idRequired={true}
                        multiSelect={false}
                        value={values.multiCriteria?.sendingEntityIDs as any}
                        onChange={(e) => handleValuesChange("multiCriteria.sendingEntityIDs", e)}

                    />
                }

            </Col>

        </Row>

    );
}