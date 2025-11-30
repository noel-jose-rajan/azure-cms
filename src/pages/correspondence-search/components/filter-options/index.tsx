import { SearchCorrespondenceType } from "@/components/services/search/type";
import { useLanguage } from "@/context/language";
import { FilterFilled, SwapOutlined } from "@ant-design/icons";
import { Col, Row, Select } from "antd";
import { Control, Controller } from "react-hook-form";

const FilterOptions = ({
  control,
}: {
  control: Control<SearchCorrespondenceType>;
}) => {
  const {
    isEnglish,
    labels: { lbl },
  } = useLanguage();

  return (
    <Row>
      <Col span={24} style={{ display: "flex", justifyContent: "flex-end" }}>
        <Controller
          name="is_sort_desc"
          control={control}
          render={({ field }) => (
            <Col>
              <p
                style={{
                  fontSize: 12,
                  display: "flex",
                  flexDirection: isEnglish ? "row" : "row-reverse",
                }}
              >
                <SwapOutlined style={{ transform: "rotate(90deg)" }} />
                <p style={{ fontSize: 12, marginLeft: 10, marginRight: 10 }}>
                  {isEnglish ? "Sort Order" : "ترتيب الفرز"}
                </p>
              </p>
              <Select
                title={isEnglish ? "Sort Order" : "ترتيب الفرز"}
                onChange={(value: any) =>
                  field.onChange(value === "desc" ? true : false)
                }
                suffixIcon={<></>}
                size="small"
                value={field.value ? "desc" : "asc"}
                options={[
                  {
                    label: "A - Z",
                    value: "asc",
                  },
                  {
                    label: "Z - A",
                    value: "desc",
                  },
                ]}
                bordered={false}
              />
            </Col>
          )}
        />
        <Controller
          name="sort_by"
          control={control}
          render={({ field }) => (
            <Col style={{ marginLeft: 20 }}>
              <p
                style={{
                  fontSize: 12,
                  display: "flex",
                  flexDirection: isEnglish ? "row" : "row-reverse",
                }}
              >
                <FilterFilled />
                <p style={{ fontSize: 12, marginLeft: 10, marginRight: 10 }}>
                  {isEnglish ? "Sort By" : "ترتيب حسب"}
                </p>
              </p>
              <Select
                title={isEnglish ? "Sort By" : "ترتيب حسب"}
                onChange={(value: any) => field.onChange(value)}
                suffixIcon={<></>}
                size="small"
                value={field.value}
                options={[
                  {
                    label: lbl.corr_date,
                    value: "correspondence_date",
                  },
                  {
                    label: lbl.corr_subject,
                    value: "corr_subject",
                  },
                  {
                    label: lbl.corr_number,
                    value: "correspondence_no",
                  },
                  {
                    label: lbl.creation_date,
                    value: "created_at",
                  },
                ]}
                bordered={false}
              />
            </Col>
          )}
        />
      </Col>
    </Row>
  );
};

export default FilterOptions;
