import React from "react";
import { ReportName } from "../../service";
import { ReportFilterState } from ".";
import { Col, Row } from "antd";
import { TextField } from "@mui/material";
import { ArrowRightOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { useLanguage } from "../../../../context/language";
import SelectStatus from "../select-status";
import KeywordInput from "../keyword-input";
import SelectCorresType from "../select-corres-type";
import SelectSecurityLevel from "../select-urgency-level";
import SelectUrgencyLevel from "../select-security-level";
import SelectReceiver from "../select-receiver";
import SelectSender from "../select-sender";

interface Props extends ReportName {
  reportFilterState: ReportFilterState;
  handleChange?: React.Dispatch<React.SetStateAction<ReportFilterState>>;
}

export default function RepoGeneralCorres({
  reportFilterState,
  handleChange,
}: Props) {
  const { labels } = useLanguage();
  return (
    <>
      {/* Row 1 - Corres Type | Status */}
      <Row gutter={[8, 8]}>
        <Col span={12}>
          <SelectCorresType
            value={
              Array.isArray(reportFilterState.corrTypeIds)
                ? reportFilterState.corrTypeIds
                : []
            }
            handleValuesChange={(item) => {
              console.log(item);

              handleChange &&
                handleChange((prevVal) => ({
                  ...prevVal,

                  corrTypeDesc:
                    Array.isArray(item) && item.length > 0
                      ? [...item.map((i) => i.picklistEnLabel ?? "")]
                      : "All",

                  corrTypeIds:
                    Array.isArray(item) && item.length > 0
                      ? [...item.map((i) => i.pickListId!)]
                      : -1,
                }));
            }}
          />
        </Col>
        <Col span={12}>
          <SelectStatus
            value={
              Array.isArray(reportFilterState.corrStatusIds)
                ? reportFilterState.corrStatusIds
                : []
            }
            handleValuesChange={(item) => {
              console.log(item);

              handleChange &&
                handleChange((prevVal) => ({
                  ...prevVal,

                  corrStatusDesc:
                    Array.isArray(item) && item.length > 0
                      ? [...item.map((i) => i.picklistEnLabel ?? "")]
                      : "All",

                  corrStatusIds:
                    Array.isArray(item) && item.length > 0
                      ? [...item.map((i) => i.pickListId!)]
                      : -1,
                }));
            }}
          />
        </Col>
      </Row>

      {/* Row 2 - security and urgency levels*/}
      <Row gutter={[8, 8]}>
        <Col span={12}>
          <SelectSecurityLevel
            value={
              Array.isArray(reportFilterState.securityLevelIds)
                ? reportFilterState.securityLevelIds
                : []
            }
            handleValuesChange={(item) => {
              handleChange &&
                handleChange((prevVal) => ({
                  ...prevVal,

                  securityLevelDesc:
                    Array.isArray(item) && item.length > 0
                      ? [...item.map((i) => i.picklistEnLabel ?? "")]
                      : "All",

                  securityLevelIds:
                    Array.isArray(item) && item.length > 0
                      ? [...item.map((i) => i.pickListId!)]
                      : -1,
                }));
            }}
          />
        </Col>
        <Col span={12}>
          <SelectUrgencyLevel
            value={
              Array.isArray(reportFilterState.urgencyLevelIds)
                ? reportFilterState.urgencyLevelIds
                : []
            }
            handleValuesChange={(item) => {
              console.log(item);

              handleChange &&
                handleChange((prevVal) => ({
                  ...prevVal,

                  urgencyLevelDesc:
                    Array.isArray(item) && item.length > 0
                      ? [...item.map((i) => i.picklistEnLabel ?? "")]
                      : "All",

                  urgencyLevelIds:
                    Array.isArray(item) && item.length > 0
                      ? [...item.map((i) => i.pickListId!)]
                      : -1,
                }));
            }}
          />
        </Col>
      </Row>

      {/* Corres dates */}
      <Row gutter={[8, 8]} align="middle">
        <Col xs={10}>
          <TextField
            margin="normal"
            variant="standard"
            fullWidth
            type="date"
            label={labels.lbl.corres_date_from}
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
            label={labels.lbl.corres_date_to}
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

      {/* Creation dates */}
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
              dayjs(reportFilterState?.createdDateFrom, "DD-MM-YYYY").format(
                "YYYY-MM-DD"
              ) || ""
            }
            onChange={(e) =>
              handleChange &&
              handleChange((prevVal) => ({
                ...prevVal,
                createdDateFrom: e.target.value
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
              dayjs(reportFilterState?.createdDateTo, "DD-MM-YYYY").format(
                "YYYY-MM-DD"
              ) || ""
            }
            onChange={(e) => {
              console.log(e.target.value);

              handleChange &&
                handleChange((prevVal) => ({
                  ...prevVal,
                  createdDateTo: e.target.value
                    ? dayjs(e.target.value, "YYYY-MM-DD").format("DD-MM-YYYY")
                    : "All",
                }));
            }}
          />
        </Col>
      </Row>
      <Row>
        <SelectReceiver
          values={reportFilterState}
          handleChange={handleChange}
        />
      </Row>

      <Row>
        <SelectSender values={reportFilterState} handleChange={handleChange} />
      </Row>

      <br />
      <Row>
        <TextField
          fullWidth
          variant="standard"
          placeholder={labels.lbl.corr_subject}
          value={
            reportFilterState.corrSubject === "All"
              ? ""
              : reportFilterState.corrSubject
          }
          onChange={(e) =>
            handleChange &&
            handleChange((pv) => ({
              ...pv,
              corrSubject: e.target.value === "" ? "All" : e.target.value,
            }))
          }
        />
      </Row>

      <Row>
        <KeywordInput
          values={reportFilterState.keywords}
          handleValuesChange={(val) =>
            handleChange &&
            handleChange((preVal) => ({
              ...preVal,
              keywords: val,
            }))
          }
        />
      </Row>
    </>
  );
}
