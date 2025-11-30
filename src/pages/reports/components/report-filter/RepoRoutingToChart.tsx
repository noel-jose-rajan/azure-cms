import React from "react";
import { ReportName } from "../../service";
import { ReportFilterState } from ".";
import { Col, Row } from "antd";
import OrganizationUnitSearch from "../../../../components/ui/search/unit-2";
import { TextField } from "@mui/material";
import { ArrowRightOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { useLanguage } from "../../../../context/language";

interface Props extends ReportName {
  reportFilterState: ReportFilterState;
  handleChange?: React.Dispatch<React.SetStateAction<ReportFilterState>>;
}

export default function RepoRoutingToChart({
  reportFilterState,
  handleChange,
}: Props) {
  const { labels } = useLanguage();
  return (
    <>
      <Row>
        <OrganizationUnitSearch
          multiple={true}
          onChange={(e) => {
            console.log(e);

            if (Array.isArray(e)) {
              if (e.length > 0) {
                handleChange &&
                  // @ts-ignore
                  handleChange((prevVal) => {
                    return {
                      ...prevVal,

                      orgUnitIDs: e.map((i) => i.organizationUnitId),

                      orgUnitsDesc: e.map((i) => i.orgUnitDescEn),
                    };
                  });
              } else {
                handleChange &&
                  handleChange((prevVal) => ({
                    ...prevVal,
                    orgUnitIDs: "All",
                    orgUnitsDesc: "All",
                  }));
              }
            }
          }}
          onSelect={(e) => {
            console.log(e);

            handleChange &&
              handleChange((prevVal) => {
                return {
                  ...prevVal,

                  orgUnitIDs: [
                    ...(Array.isArray(prevVal.orgUnitIDs)
                      ? prevVal.orgUnitIDs
                      : []),
                    //@ts-ignore
                    e.organizationUnitId,
                  ],

                  orgUnitsDesc: [
                    ...(Array.isArray(prevVal.orgUnitsDesc)
                      ? prevVal.orgUnitsDesc
                      : []),
                    //@ts-ignore
                    e.orgUnitDescEn,
                  ],
                };
              });
          }}
          value={
            Array.isArray(reportFilterState.orgUnitIDs)
              ? reportFilterState.orgUnitIDs.map((i) => ({
                  organizationUnitId: i,
                }))
              : []
          }
        />
      </Row>
      <Row gutter={[8, 8]} align="middle">
        <Col xs={10}>
          <TextField
            margin="normal"
            variant="standard"
            fullWidth
            type="date"
            label={labels.lbl.route_date_from}
            InputLabelProps={{ shrink: true }}
            value={
              dayjs(reportFilterState?.routingDateFrom, "DD-MM-YYYY").format(
                "YYYY-MM-DD"
              ) || ""
            }
            onChange={(e) =>
              handleChange &&
              handleChange((prevVal) => ({
                ...prevVal,
                routingDateFrom: e.target.value
                  ? dayjs(e.target.value, "YYYY-MM-DD").format("DD-MM-YYYY")
                  : "All",
              }))
            }
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
            label={labels.lbl.route_date_to}
            InputLabelProps={{ shrink: true }}
            value={
              dayjs(reportFilterState?.routingDateTo, "DD-MM-YYYY").format(
                "YYYY-MM-DD"
              ) || ""
            }
            onChange={(e) => {
              console.log(e.target.value);

              handleChange &&
                handleChange((prevVal) => ({
                  ...prevVal,
                  routingDateTo: e.target.value
                    ? dayjs(e.target.value, "YYYY-MM-DD").format("DD-MM-YYYY")
                    : "All",
                }));
            }}
          />
        </Col>
      </Row>
    </>
  );
}
