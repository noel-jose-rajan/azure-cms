import { SearchCorrespondenceType } from "@/components/services/search/type";
import Picklist from "@/components/shared/picklist";
import { MaterialInput } from "@/components/ui/material-input";
import { useLanguage } from "@/context/language";
import { Row, Col, Checkbox, CheckboxChangeEvent, DatePicker } from "antd";
import {
  Control,
  Controller,
  UseFormSetValue,
  useFormContext,
  useWatch,
} from "react-hook-form";
import SelectEntity from "../select-entity";
import dayjs, { Dayjs } from "dayjs";

const BasicSearchInfo = ({
  control,
  setValue,
}: {
  control: Control<SearchCorrespondenceType>;
  setValue: UseFormSetValue<SearchCorrespondenceType>;
}) => {
  const {
    labels: { lbl },
    isEnglish,
  } = useLanguage();

  const fromValues = useWatch({ control: control });

  return (
    <>
      <Row style={{ flexDirection: isEnglish ? "row" : "row-reverse" }}>
        <Col span={12}>
          <Row style={{ flexDirection: isEnglish ? "row" : "row-reverse" }}>
            <Col
              xs={24}
              md={24}
              lg={24}
              xl={12}
              xxl={12}
              style={{ padding: 4 }}
            >
              <div style={{ marginTop: 10, marginBottom: 15 }}>
                <Controller
                  name="corr_subject"
                  control={control}
                  render={({ field }) => (
                    <MaterialInput
                      label={lbl.corr_subject}
                      {...field}
                      applyReverse
                    />
                  )}
                />
              </div>
              <div style={{ marginTop: 18 }}>
                <Controller
                  name="correspondence_no"
                  control={control}
                  render={({ field }) => (
                    <MaterialInput
                      label={
                        isEnglish ? "Correspondence Number" : "رقم المراسلة"
                      }
                      {...field}
                      enableTranscript={false}
                    />
                  )}
                />
              </div>
            </Col>
            <Col
              xs={24}
              md={24}
              lg={24}
              xl={12}
              xxl={12}
              style={{ padding: 4 }}
            >
              <div style={{ marginTop: 12, marginBottom: 8 }}>
                <Controller
                  name="sending_entity_id"
                  control={control}
                  render={({ field }) => (
                    <SelectEntity
                      value={field.value}
                      label={lbl.sending_entity}
                      onChange={field.onChange}
                    />
                  )}
                />
              </div>
              <div style={{ marginTop: 5, marginBottom: 10 }}>
                <Controller
                  name="receiving_entity_id"
                  control={control}
                  render={({ field }) => (
                    <SelectEntity
                      label={lbl.receiving_entity}
                      value={field.value}
                      onChange={field.onChange}
                    />
                  )}
                />
              </div>
            </Col>
          </Row>
        </Col>
        <Col span={12}>
          <Row style={{ flexDirection: isEnglish ? "row" : "row-reverse" }}>
            <Col
              xs={24}
              md={24}
              lg={24}
              xl={12}
              xxl={12}
              style={{ padding: 4 }}
            >
              <div style={{ marginTop: 12, marginBottom: 8 }}>
                <Controller
                  name="corr_type_id"
                  control={control}
                  render={({ field }) => (
                    <Picklist
                      canClear
                      code={"Correspondence Type"}
                      onChange={(value: any) => {
                        field.onChange(value);
                      }}
                      value={field.value}
                      label={lbl.correspondence_type}
                    />
                  )}
                />
              </div>
              <div style={{}}>
                <Controller
                  name="doc_type_id"
                  control={control}
                  render={({ field }) => (
                    <Picklist
                      canClear
                      code={"Document Type"}
                      onChange={(value: any) => {
                        field.onChange(value);
                      }}
                      value={field.value}
                      label={lbl.document_type}
                    />
                  )}
                />
              </div>
              {/* <div style={{ marginTop: 10 }}>
              <Controller
                name="corr_type_id"
                control={control}
                render={({ field }) => (
                  <Picklist
                    code={"outbound types"}
                    onChange={(value: any) => {
                      console.log("Function not implemented.", value);
                      field.onChange(value);
                    }}
                    value={field.value}
                    label={lbl.outbound_type}
                  />
                )}
              />
            </div> */}
            </Col>
            <Col
              xs={24}
              md={24}
              lg={24}
              xl={12}
              xxl={12}
              style={{ padding: 4 }}
            >
              {/* <div style={{ marginBottom: 10 }}>
                <Controller
                  name="doc_type_id"
                  control={control}
                  render={({ field }) => (
                    <Picklist
                      code={"Document Type"}
                      onChange={(value: any) => {
                        console.log("Function not implemented.", value);
                        field.onChange(value);
                      }}
                      value={field.value}
                      label={lbl.document_type}
                    />
                  )}
                />
              </div> */}
              <div style={{ marginTop: 10 }}>
                <Controller
                  name="corr_status_id"
                  control={control}
                  render={({ field }) => (
                    <Picklist
                      canClear
                      code={"Status"}
                      onChange={(value: any) => {
                        field.onChange(value);
                      }}
                      value={field.value}
                      label={lbl.status}
                    />
                  )}
                />
              </div>
            </Col>
          </Row>
        </Col>
      </Row>
      <Row style={{ flexDirection: isEnglish ? "row" : "row-reverse" }}>
        <Col
          span={12}
          style={{ display: "flex", justifyContent: "space-around" }}
        >
          <Controller
            name="owner_id"
            control={control}
            render={({ field }) => (
              <Checkbox
                checked={field.value !== undefined}
                onChange={(e: CheckboxChangeEvent) =>
                  field.onChange(e.target.checked ? 0 : undefined)
                }
                style={{ alignItems: "center" }}
              >
                {lbl.created_by_me}
              </Checkbox>
            )}
          />
          {/* <Controller
            name="has_attachment"
            control={control}
            render={({ field }) => (
              <Checkbox
                checked={field.value}
                onChange={(e: CheckboxChangeEvent) =>
                  field.onChange(e.target.checked ? true : undefined)
                }
                style={{ alignItems: "center" }}
              >
                {lbl.search_contentSearch}
              </Checkbox>
            )}
          /> */}
        </Col>
        <Col span={12}>
          <Controller
            name="correspondence_date_from"
            control={control}
            render={({ field }) => (
              <DatePicker.RangePicker
                bordered={false}
                value={
                  field.value && fromValues.correspondence_date_to
                    ? [
                        dayjs(fromValues.correspondence_date_from),
                        dayjs(fromValues.correspondence_date_to),
                      ]
                    : null
                }
                style={{ width: "100%" }}
                onChange={(dates) => {
                  if (Array.isArray(dates) && dates.length === 2) {
                    setValue(
                      "correspondence_date_from",
                      dates[0]?.toISOString()
                    );
                    setValue("correspondence_date_to", dates[1]?.toISOString());
                  } else {
                    setValue("correspondence_date_from", undefined);
                    setValue("correspondence_date_to", undefined);
                  }
                }}
              />
            )}
          />
        </Col>
      </Row>
    </>
  );
};

export default BasicSearchInfo;
