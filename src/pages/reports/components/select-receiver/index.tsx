import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { Col, Row } from "antd";

import { useState } from "react";
import { useLanguage } from "../../../../context/language";
import OrganizationUnitSearch from "../../../../components/ui/search/unit-2";
import ExternalEntitySearch from "../../../../components/ui/search/external-entity";
import { ReportFilterState } from "../report-filter";

interface Props {
  values: ReportFilterState;
  handleChange?: React.Dispatch<React.SetStateAction<ReportFilterState>>;
}

export default function SelectReceiver({ values, handleChange }: Props) {
  const { labels, isEnglish } = useLanguage();
  const [state, setstate] = useState("0");

  const handleStateChange = (value: string) => {
    handleChange &&
      handleChange((v) => ({
        ...v,
        internalReceivingEntityId: -1,
        receivingEntityDesc: "All",
        externalReceivingEntityId: -1,
      }));

    setstate(value);
  };

  return (
    <Row gutter={30} style={{ width: "100%" }}>
      <Col span={state === "0" ? 24 : 12}>
        <FormControl fullWidth margin="normal">
          <InputLabel>{labels.lbl.reciever_type}</InputLabel>
          <Select
            variant="standard"
            value={state}
            onChange={(e) => handleStateChange(e.target.value)}
          >
            <MenuItem value={"0"}>
              {labels.btn.select} {labels.lbl.reciever_type}
            </MenuItem>
            <MenuItem value={"1"}>{labels.lbl.org_unit}</MenuItem>

            <MenuItem value={"2"}>{labels.lbl.external_entity}</MenuItem>
          </Select>
        </FormControl>
      </Col>

      <Col span={state === "0" ? 0 : 12}>
        <Row style={{ width: "100%" }}>
          {state === "1" ? (
            <OrganizationUnitSearch
              multiple={true}
              value={
                Array.isArray(values.internalReceivingEntityId)
                  ? values.internalReceivingEntityId.map((i) => ({
                      organizationUnitId: i,
                    }))
                  : []
              }
              onSelect={(e) => {
                console.log(e);

                if (!Array.isArray(e) && e) {
                  handleChange &&
                    handleChange((pv) => ({
                      ...pv,
                      internalReceivingEntityId: [
                        ...(Array.isArray(pv.internalReceivingEntityId)
                          ? pv.internalReceivingEntityId
                          : []),
                        e.organizationUnitId!,
                      ],

                      receivingEntityDesc: [
                        ...(Array.isArray(pv.receivingEntityDesc)
                          ? pv.receivingEntityDesc
                          : []),
                        e.orgUnitDescEn!,
                      ],
                    }));
                }
              }}
              onChange={(e) => {
                if (Array.isArray(e)) {
                  handleChange &&
                    handleChange((pv) => ({
                      ...pv,
                      internalReceivingEntityId:
                        e.length === 0
                          ? -1
                          : e.map((i) => i.organizationUnitId!),

                      receivingEntityDesc:
                        e.length === 0
                          ? "All"
                          : e.map((i) =>
                              isEnglish ? i.orgUnitDescEn! : i.orgUnitDescAr!
                            ),
                    }));
                }
              }}
            />
          ) : (
            <Col span={24}>
              <ExternalEntitySearch
                idRequired={true}
                multiSelect={true}
                value={
                  Array.isArray(values.externalReceivingEntityId)
                    ? values.externalReceivingEntityId?.map((i) => i + "")
                    : []
                }
                onSelect={(e) => {
                  const receivingEntityDesc = e.map((i) =>
                    isEnglish ? i.descEn : i.descAr
                  );
                  const externalReceivingEntityId = e.map(
                    (i) => i.externalEntityId
                  );

                  handleChange &&
                    handleChange((val) => ({
                      ...val,
                      receivingEntityDesc:
                        receivingEntityDesc.length > 0
                          ? receivingEntityDesc
                          : "All",
                      externalReceivingEntityId:
                        externalReceivingEntityId.length > 0
                          ? externalReceivingEntityId
                          : -1,
                    }));
                }}
              />
            </Col>
          )}
        </Row>
      </Col>
    </Row>
  );
}
