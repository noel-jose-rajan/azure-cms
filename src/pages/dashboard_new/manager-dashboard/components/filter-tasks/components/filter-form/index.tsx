import { useLanguage } from "@/context/language";
import { Controller, useFormContext } from "react-hook-form";
import { Checkbox, Col, Row } from "antd";
import SelectAssigne from "./components/select-assigne";
import ManagerSelectOrgs from "@/pages/dashboard_new/shared/manager-select-orgs";
import Picklist from "@/components/shared/picklist";
import ButtonComponent from "@/components/ui/button";
import { FilterTasksFormType } from "../schema";

type Props = {
  orgs: number[];
  onSearch: () => Promise<void>;
};
const FilterForm = ({ orgs, onSearch }: Props) => {
  const { labels, isEnglish } = useLanguage();
  const { control } = useFormContext<FilterTasksFormType>();

  const handleSearch = async () => {
    await onSearch();
  };
  return (
    <>
      <Row
        gutter={10}
        style={{
          padding: 5,
          display: "flex",
          flexDirection: isEnglish ? "row" : "row-reverse",
        }}
      >
        <Col span={8} lg={8} md={12} xs={24} style={{ marginTop: 20 }}>
          <Controller
            name="assignee"
            control={control}
            render={({ field }) => <SelectAssigne {...field} />}
          />
        </Col>
        <Col span={8} lg={8} md={12} xs={24} style={{ marginTop: 20 }}>
          <Controller
            name="entity_id"
            control={control}
            render={({ field }) => (
              <ManagerSelectOrgs
                value={field.value}
                onChange={field.onChange}
                orgs={orgs}
              />
            )}
          />
        </Col>

        <Col span={8} lg={8} md={12} xs={24} style={{ marginTop: 20 }}>
          <Controller
            name="process_type_id"
            control={control}
            render={({ field }) => (
              <Picklist
                canClear
                code="PROCESS_TYPE"
                {...field}
                label={labels.lbl.corr_types}
              />
            )}
          />
        </Col>
        <Col span={8} lg={8} md={12} xs={24} style={{ marginTop: 20 }}>
          <Controller
            name="task_type_id"
            control={control}
            render={({ field }) => (
              <Picklist
                canClear
                code="Task Subject"
                {...field}
                label={labels.lbl.task_name}
              />
            )}
          />
        </Col>
        <Col
          xs={24}
          style={{ marginTop: 20, direction: isEnglish ? "ltr" : "rtl" }}
        >
          <Controller
            name="is_task_breach"
            control={control}
            render={({ field }) => (
              <Checkbox
                onChange={(e) => field.onChange(e?.target?.checked)}
                checked={field?.value}
              >
                {labels.lbl.is_Breach}
              </Checkbox>
            )}
          />
        </Col>

        <Row style={{ marginTop: 16 }}>
          <ButtonComponent
            type="primary"
            buttonLabel={labels.btn.search}
            onClick={handleSearch}
          />
        </Row>
      </Row>
    </>
  );
};

export default FilterForm;
