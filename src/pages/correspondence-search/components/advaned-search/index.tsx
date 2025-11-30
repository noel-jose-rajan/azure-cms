import { SearchCorrespondenceType } from "@/components/services/search/type";
import TitleHeader from "@/components/ui/header";
import { MaterialInput } from "@/components/ui/material-input";
import { useLanguage } from "@/context/language";
import { Col, Row } from "antd";
import { Control, Controller } from "react-hook-form";
import Picklist from "@/components/shared/picklist";
import KeywordInput from "@/components/ui/form/KeyWordInput";

const AdvancedSearchForm = ({
  control,
}: {
  control: Control<SearchCorrespondenceType>;
}) => {
  const {
    isEnglish,
    labels: { til, lbl },
  } = useLanguage();

  return (
    <>
      <TitleHeader heading={til.advancedSearchCirteria} />
      <Row>
        <Col xs={24} md={12} lg={12} xl={8} xxl={8} style={{ padding: 4 }}>
          <div style={{ marginTop: 12 }}>
            <Controller
              name="security_level_id"
              control={control}
              render={({ field }) => (
                <Picklist
                  code={"Security Level"}
                  onChange={(value: any) => {
                    field.onChange(value);
                  }}
                  canClear
                  value={field.value}
                  label={lbl.security_level}
                />
              )}
            />
          </div>
          <div style={{ marginTop: 15 }}>
            <Controller
              name="urgency_id"
              control={control}
              render={({ field }) => (
                <Picklist
                  canClear
                  code={"Urgency Level"}
                  onChange={(value: any) => {
                    field.onChange(value);
                  }}
                  value={field.value}
                  label={lbl.urgency_level}
                />
              )}
            />
          </div>
        </Col>
        <Col xs={24} md={12} lg={12} xl={8} xxl={8} style={{ padding: 4 }}>
          <div style={{ marginTop: 10, marginBottom: 10 }}>
            <Controller
              name="remarks"
              control={control}
              render={({ field }) => (
                <MaterialInput label={lbl.remarks} {...field} applyReverse />
              )}
            />
          </div>
          <Col
            style={{
              marginTop: 10,
              marginBottom: 10,
              direction: isEnglish ? "ltr" : "rtl",
            }}
          >
            <Controller
              name="keywords"
              control={control}
              render={({ field }) => (
                <KeywordInput
                  values={field.value ?? []}
                  handleValuesChange={field.onChange}
                />
              )}
            />
          </Col>
        </Col>
        <Col xs={24} md={24} lg={24} xl={8} xxl={8}>
          <Row>
            <Col
              xs={24}
              md={12}
              lg={12}
              xl={24}
              xxl={24}
              style={{ padding: 4 }}
            >
              <div style={{ marginTop: 10 }}>
                <Controller
                  name="external_reference_no"
                  control={control}
                  render={({ field }) => (
                    <MaterialInput
                      label={lbl.ext_ref_num}
                      {...field}
                      enableTranscript={false}
                    />
                  )}
                />
              </div>
            </Col>
            <Col
              xs={24}
              md={12}
              lg={12}
              xl={24}
              xxl={24}
              style={{ padding: 4 }}
            >
              <div style={{ marginTop: 18, marginBottom: 10 }}>
                <Controller
                  name="corr_language_id"
                  control={control}
                  render={({ field }) => (
                    <Picklist
                      canClear
                      code={"Language"}
                      onChange={(value: any) => {
                        field.onChange(value);
                      }}
                      value={field.value}
                      label={lbl.language}
                    />
                  )}
                />
              </div>
            </Col>
          </Row>
        </Col>
      </Row>
    </>
  );
};

export default AdvancedSearchForm;
