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

export default function SelectSender({ values, handleChange }: Props) {
  const { labels, isEnglish } = useLanguage();
  const [state, setstate] = useState("0");

  const handleStateChange = (value: string) => {
    handleChange &&
      handleChange((v) => ({
        ...v,
        internalSendingEntityId: -1,
        sendingEntityDesc: "All",
        externalSendingEntityId: -1,
      }));
    setstate(value);
  };

  return (
    <Row gutter={30} style={{ width: "100%" }}>
      <Col span={state === "0" ? 24 : 12}>
        <FormControl fullWidth margin="normal">
          <InputLabel>{labels.lbl.sender_type}</InputLabel>
          <Select
            variant="standard"
            value={state}
            onChange={(e) => handleStateChange(e.target.value)}
          >
            <MenuItem value={"0"}>
              {" "}
              {labels.btn.select} {labels.lbl.sender_type}
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
                Array.isArray(values.internalSendingEntityId)
                  ? values.internalSendingEntityId.map((i) => ({
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
                      internalSendingEntityId: [
                        ...(Array.isArray(pv.internalSendingEntityId)
                          ? pv.internalSendingEntityId
                          : []),
                        e.organizationUnitId!,
                      ],

                      sendingEntityDesc: [
                        ...(Array.isArray(pv.sendingEntityDesc)
                          ? pv.sendingEntityDesc
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
                  Array.isArray(values.externalSendingEntityId)
                    ? values.externalSendingEntityId?.map((i) => i + "")
                    : []
                }
                onSelect={(e) => {
                  const sendingEntityDesc = e.map((i) =>
                    isEnglish ? i.descEn : i.descAr
                  );
                  const externalSendingEntityId = e.map(
                    (i) => i.externalEntityId
                  );

                  handleChange &&
                    handleChange((val) => ({
                      ...val,
                      sendingEntityDesc:
                        sendingEntityDesc.length > 0
                          ? sendingEntityDesc
                          : "All",
                      externalSendingEntityId:
                        externalSendingEntityId.length > 0
                          ? externalSendingEntityId
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
