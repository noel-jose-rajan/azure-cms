import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { SearchQuery } from "../../../../types";
import OrganizationUnitSearch from "../../../../../../components/ui/search/unit-2";
import { Col, Row } from "antd";
import ExternalEntitySearch from "../../../../../../components/ui/search/external-entity";
import { useLanguage } from "../../../../../../context/language";
import { useSearchParams } from "react-router-dom";
import { useEffect } from "react";

interface Props {
  values: SearchQuery;
  handleValuesChange: (field: string, value: any) => any;
}

export default function SenderTypesSelect({
  values,
  handleValuesChange,
}: Props) {
  const { labels } = useLanguage();
  const [searchParams, setSearchParams] = useSearchParams();
  const state = searchParams.get("sendingEntityType") || "0";

  const handleChange = (value: string) => {
    setSearchParams({
      page: searchParams.get("page") ?? "",
      correspondenceTypeCode: searchParams.get("correspondenceTypeCode") ?? "",
      receivingEntityType: searchParams.get("receivingEntityType") ?? "",
      criteriaValue: searchParams.get("criteriaValue") ?? "",
      searchByContent: searchParams.get("searchByContent") ?? "",
      sendingEntityType: value,
    });
  };

  useEffect(() => {
    handleValuesChange("multiCriteria.sendingEntityIDs", []);

    return () => {};
  }, [state]);

  return (
    <Row gutter={30}>
      <Col span={state === "" ? 24 : 12}>
        <FormControl fullWidth margin="normal">
          <InputLabel>{labels.lbl.sender_type}</InputLabel>
          <Select
            variant="standard"
            value={state}
            onChange={(e) => handleChange(e.target.value)}
          >
            <MenuItem value={"0"}>--</MenuItem>
            <MenuItem value={"1"}>{labels.lbl.org_unit}</MenuItem>

            <MenuItem value={"2"}>{labels.lbl.external_entity}</MenuItem>
          </Select>
        </FormControl>
      </Col>
      <Col span={state === "0" ? 0 : 12}>
        {state === "1" && (
          <OrganizationUnitSearch
            value={values.multiCriteria?.sendingEntityIDs}
            onSelect={(e) =>
              !Array.isArray(e) &&
              handleValuesChange("multiCriteria.sendingEntityIDs", [e])
            }
            onChange={() =>
              handleValuesChange("multiCriteria.sendingEntityIDs", [])
            }
          />
        )}
        {state === "2" && (
          <ExternalEntitySearch
            idRequired={true}
            multiSelect={false}
            value={values.multiCriteria?.sendingEntityIDs}
            onChange={(e) =>
              handleValuesChange("multiCriteria.sendingEntityIDs", e)
            }
          />
        )}
      </Col>
    </Row>
  );
}
