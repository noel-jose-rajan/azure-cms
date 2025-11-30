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

export default function ReceiverTypesSelect({
  values,
  handleValuesChange,
}: Props) {
  const { labels } = useLanguage();
  const [searchParams, setSearchParams] = useSearchParams();
  const state = searchParams.get("receivingEntityType") || "0";

  const handleChange = (value: string) => {
    setSearchParams({
      page: searchParams.get("page") ?? "",
      correspondenceTypeCode: searchParams.get("correspondenceTypeCode") ?? "",
      sendingEntityType: searchParams.get("sendingEntityType") ?? "0",
      criteriaValue: searchParams.get("criteriaValue") ?? "",
      searchByContent: searchParams.get("searchByContent") ?? "",

      receivingEntityType: value,
    });
  };

  useEffect(() => {
    handleValuesChange("multiCriteria.recievingEntityIDs", []);

    return () => {};
  }, [state]);

  return (
    <Row gutter={30}>
      <Col span={state === "" ? 24 : 12}>
        <FormControl fullWidth margin="normal">
          <InputLabel>{labels.lbl.reciever_type}</InputLabel>
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
        {state === "1" ? (
          <OrganizationUnitSearch
            multiple={true}
            value={values.multiCriteria?.recievingEntityIDs}
            onSelect={(e) =>
              handleValuesChange("multiCriteria.recievingEntityIDs", [
                ...(values.multiCriteria?.recievingEntityIDs ?? []),
                e,
              ])
            }
            onChange={(e) =>
              handleValuesChange("multiCriteria.recievingEntityIDs", e)
            }
          />
        ) : (
          <ExternalEntitySearch
            idRequired={true}
            multiSelect={true}
            value={values.multiCriteria?.recievingEntityIDs}
            onChange={(e) =>
              handleValuesChange("multiCriteria.recievingEntityIDs", e)
            }
          />
        )}
      </Col>
    </Row>
  );
}
