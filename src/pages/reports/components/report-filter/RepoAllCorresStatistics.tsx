import React from "react";
import { ReportName } from "../../service";
import { ReportFilterState } from ".";
import { Col, Row } from "antd";
import { TextField } from "@mui/material";
import { ArrowRightOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { useLanguage } from "../../../../context/language";
import SelectStatus from "../select-status";

interface Props extends ReportName {
  reportFilterState: ReportFilterState;
  handleChange?: React.Dispatch<React.SetStateAction<ReportFilterState>>;
}

export default function RepoAllCorresStatistics({
  reportFilterState,
  handleChange,
}: Props) {
  const { labels } = useLanguage();
  return (
    <>
      <Row>
        <SelectStatus
          value={
            Array.isArray(reportFilterState.statusPicklistsId)
              ? reportFilterState.statusPicklistsId
              : []
          }
          handleValuesChange={(item) => {
            console.log(item);

            handleChange &&
              handleChange((prevVal) => ({
                ...prevVal,

                statusPicklistsDesc:
                  Array.isArray(item) && item.length > 0
                    ? [...item.map((i) => i.picklistEnLabel ?? "")]
                    : "All",

                statusPicklistsId:
                  Array.isArray(item) && item.length > 0
                    ? [...item.map((i) => i.pickListId!)]
                    : -1,
              }));
          }}
        />
      </Row>
      <Row gutter={[8, 8]} align="middle">
        <Col xs={10}>
          <TextField
            margin="normal"
            variant="standard"
            fullWidth
            type="date"
            label={labels.lbl.creation_date_from}
            InputLabelProps={{ shrink: true }}
            value={
              dayjs(
                reportFilterState?.correspondenceDateFrom,
                "DD-MM-YYYY"
              ).format("YYYY-MM-DD") || ""
            }
            onChange={(e) =>
              handleChange &&
              handleChange((prevVal) => ({
                ...prevVal,
                correspondenceDateFrom: e.target.value
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
            label={labels.lbl.creation_date_to}
            InputLabelProps={{ shrink: true }}
            value={
              dayjs(
                reportFilterState?.correspondenceDateTo,
                "DD-MM-YYYY"
              ).format("YYYY-MM-DD") || ""
            }
            onChange={(e) => {
              console.log(e.target.value);

              handleChange &&
                handleChange((prevVal) => ({
                  ...prevVal,
                  correspondenceDateTo: e.target.value
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
