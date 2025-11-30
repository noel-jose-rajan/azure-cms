import { Col, Form, Row } from "antd";
import { Controller, useForm } from "react-hook-form";
import { useLanguage } from "../../../../context/language";
import { LANGUAGE } from "../../../../constants/language";
import { arabicLabels } from "../../../../constants/app-constants/ar";
import { englishLabels } from "../../../../constants/app-constants/en";
import {
  SearchOUType,
  searchOUSchema,
} from "../../../../components/services/organization-units/type";
import { zodResolver } from "@hookform/resolvers/zod";
import SelectComponent from "../../../../components/ui/form/select";
import SelectUsers from "../../../../components/shared/select-users";
import SelectOU from "../../../../components/shared/select-org-units";
import { MaterialInput } from "../../../../components/ui/material-input";
import { useEffect } from "react";
import { OrgUnitType } from "@/components/services/organization-units/type";
import useGetAllOU from "@/store/orgs/use-get-all-ou";

interface OUSearchFormProps {
  setFilteredOrgUnits: React.Dispatch<React.SetStateAction<OrgUnitType[]>>;
}

export default function OUSearchForm({
  setFilteredOrgUnits,
}: OUSearchFormProps) {
  const { language } = useLanguage();
  const isEnglish = language === LANGUAGE.ENGLISH_INT;
  const labels = isEnglish ? englishLabels : arabicLabels;
  const { orgUnits } = useGetAllOU();
  const { watch, control } = useForm<SearchOUType>({
    resolver: zodResolver(searchOUSchema),
    mode: "all",
  });

  const {
    entity_code = "",
    name = "",
    is_active = undefined,
    manager_id = "",
    parent_id = "",
  } = watch();

  useEffect(() => {
    setFilteredOrgUnits(() => {
      return orgUnits?.filter((ou) => {
        const isActive =
          is_active === "true"
            ? true
            : is_active === "false"
            ? false
            : undefined;
        return (
          (entity_code
            ? ou.entity_code?.toLowerCase().includes(entity_code?.toLowerCase())
            : true) &&
          ((name
            ? ou.name_ar?.toLowerCase().includes(name?.toLowerCase())
            : true) ||
            (name
              ? ou.name_en?.toLowerCase().includes(name?.toLowerCase())
              : true)) &&
          (is_active !== undefined ? ou.is_active === isActive : true) &&
          (manager_id ? ou.manager_id === manager_id : true) &&
          (parent_id ? ou.parent_id === parent_id : true)
        );
      });
    });
  }, [entity_code, name, is_active, manager_id, parent_id]);
  return (
    <Col>
      <Form
        name="search-entity"
        onFinish={() => {}}
        onFinishFailed={() => {}}
        layout="vertical"
      >
        <Row
          gutter={[14, 30]}
          style={{
            padding: 5,
            marginTop: 12,
            display: "flex",
            flexDirection: isEnglish ? "row" : "row-reverse",
          }}
        >
          <Col xs={24} sm={12} lg={8}>
            <Controller
              name="name"
              control={control}
              render={({ field }) => (
                <MaterialInput
                  label={labels.lbl.org_unit_name}
                  {...field}
                  applyReverse
                />
              )}
            />
          </Col>
          <Col xs={24} sm={12} lg={8}>
            <Controller
              name="entity_code"
              control={control}
              render={({ field }) => (
                <MaterialInput
                  applyReverse
                  label={labels.lbl.org_unit_code}
                  {...field}
                />
              )}
            />
          </Col>
          <Col xs={24} sm={12} lg={8}>
            <Controller
              name="is_active"
              control={control}
              render={({ field }) => (
                <SelectComponent
                  label={labels.lbl.status}
                  allowClear
                  {...field}
                  options={[
                    { label: labels.lbl.active, value: "true" },
                    { label: labels.lbl.not_active, value: "false" },
                  ]}
                  style={{ height: 45 }}
                />
              )}
            />
          </Col>
          <Col xs={24} sm={12} lg={8}>
            <Controller
              name="manager_id"
              control={control}
              render={({ field }) => (
                <SelectUsers
                  canClear
                  label={labels.lbl.org_unit_manager}
                  multiSelect={false}
                  {...field}
                />
              )}
            />
          </Col>
          <Col xs={24} sm={12} lg={8}>
            <Controller
              name="parent_id"
              control={control}
              render={({ field }) => (
                <SelectOU
                  canClear
                  multiSelect={false}
                  {...field}
                  label={labels.lbl.org_unit_parent}
                />
              )}
            />
          </Col>
        </Row>
      </Form>
      <Col
        style={{
          display: "flex",
          justifyContent: isEnglish ? "flex-end" : "flex-start",
          marginTop: 10,
        }}
      >
        {/* <Button onClick={resetValues}>
          <ReloadOutlined />
          {labels.btn.reset}
        </Button>
        <Button
          onClick={() => onSearchClicked(getValues())}
          type="primary"
          style={{ margin: "0 10px" }}
        >
          <SearchOutlined />
          {labels.btn.search}
        </Button> */}
      </Col>
    </Col>
  );
}
