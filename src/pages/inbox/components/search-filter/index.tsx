import { Button, Col, Form, Row, Switch, Tag } from "antd";
import TitleHeader from "../../../../components/ui/header";
import {
  FilterFilled,
  ReloadOutlined,
  RightCircleFilled,
  SearchOutlined,
} from "@ant-design/icons";
import { useLanguage } from "../../../../context/language";
import { Controller, useFormContext } from "react-hook-form";
import { MaterialInput } from "../../../../components/ui/material-input";
import { TextField } from "@mui/material";
import { useWatch } from "react-hook-form";
import Picklist from "@/components/shared/picklist";
import usePicklist from "@/store/picklists/use-picklist";
import { useState } from "react";
import { SearchInboxType } from "../../types";
import { AnimatePresence } from "framer-motion";
import FadeInWrapperAnimation from "@/animations/fade-in-wrapper-animation";
import HeightAnimationWrapper from "@/animations/height-wrapper-animation";
import ButtonComponent from "@/components/ui/button";
import DateComponent from "@/components/ui/form/date";
import moment from "moment";
import InboxDelegationSelect from "./components/inbox-delegation-select";
import { InboxDelegation } from "@/components/services/inbox";
import useGetAllUsers from "@/store/users/use-get-all-users";

interface SearchAndFilterInboxProps {
  // updateUsers: (users: UserType[]) => void;
  delegations: InboxDelegation[];
  onSearch: () => void;
  onReset: () => void;
  delegation_id?: number;
}

export default function SearchAndFilterInbox({
  // updateUsers,
  onSearch,
  onReset,
  delegations,
}: SearchAndFilterInboxProps) {
  const { control, setValue, reset } = useFormContext<SearchInboxType>();
  const { labels, isEnglish } = useLanguage();
  const { getPicklistById } = usePicklist();
  const { getUserById } = useGetAllUsers();
  const [showFilter, setShowFilter] = useState<boolean>(false);
  const formValues = useWatch({ control });
  const onClickSearch = async () => {
    onSearch();
  };

  const removeFilter = async (key: keyof SearchInboxType) => {
    setValue(key, undefined);
  };

  const renderTag = (
    key: keyof SearchInboxType,
    value: string | boolean | number
  ) => {
    let renderVal: string | boolean | number | undefined = value;

    if (key === "corr_type_id") {
      const p = getPicklistById("Correspondence Type", +value);
      renderVal =
        (isEnglish ? p?.picklist_en_label : p?.picklist_ar_label) || "";
    } else if (key === "delegation_id") {
      const u = delegations?.find((d) => d?.id === value);
      renderVal = u?.delegate_from_name || "";
    } else if (key === "security_level_id") {
      const p = getPicklistById("Security Level", +value);
      renderVal =
        (isEnglish ? p?.picklist_en_label : p?.picklist_ar_label) || "";
    } else if (key === "urgency_id") {
      const p = getPicklistById("Urgency Level", +value);
      renderVal =
        (isEnglish ? p?.picklist_en_label : p?.picklist_ar_label) || "";
    } else if (key === "correspondence_no" || key === "corr_subject") {
      renderVal = value;
    } else if (key === "task_date_from" || key === "task_date_to") {
      renderVal = moment(value?.toString()).format("DD-MM-YYYY");
    }
    // else if (key === "isDueDate") {
    //   renderVal = value ? labels.lbl.over_due : undefined;
    // }
    // else if (key === "owner_name") {
    //   renderVal =
    //     allUsers?.find((type) => type.userId === value)?.username ?? "";
    // }
    // else if (key === "process_name" || key === "task_name") {
    //   renderVal = undefined;
    // }

    if (renderVal) {
      return (
        <FadeInWrapperAnimation key={key + "-parent"} layout>
          <Tag
            color="blue"
            closable
            onClose={() => removeFilter(key)}
            key={key}
          >
            {renderVal}
          </Tag>
        </FadeInWrapperAnimation>
      );
    }
  };

  const resetAll = async () => {
    reset();
    onSearch();
    onReset();
  };

  return (
    <div
      style={{
        direction: isEnglish ? "ltr" : "rtl",
      }}
    >
      <Col
        span={24}
        style={{
          display: "flex",
          justifyContent: isEnglish ? "flex-end" : "flex-start",
          alignItems: "center",
          marginTop: 10,
          gap: 8,
        }}
      >
        <Switch
          checked={showFilter}
          checkedChildren={labels.btn.filter}
          unCheckedChildren={labels.btn.filter}
          onChange={() => setShowFilter(!showFilter)}
          style={{ marginRight: 20 }}
          size="default"
        />
        <Button type="primary" onClick={resetAll}>
          <ReloadOutlined />
          {labels.btn.refresh}
        </Button>
      </Col>
      <HeightAnimationWrapper
        wrapperStyle={{
          display: "flex",
          flexWrap: "wrap",
          gap: "8px",
          paddingInline: 10,
          paddingTop: 10,
          justifyContent: "start",
        }}
      >
        <AnimatePresence>
          {Object.entries(formValues).map(([key, value]) => {
            if (value !== undefined) {
              return renderTag(key as keyof SearchInboxType, value);
            }
          })}
        </AnimatePresence>
      </HeightAnimationWrapper>
      {showFilter && (
        <>
          <TitleHeader
            heading={labels.til.taskSearchCirteria}
            applyReverse={false}
            icon={<FilterFilled style={{ color: "#fff" }} />}
            style={{ marginTop: 0 }}
          />
          <Form
            name="search-entity"
            onFinish={() => {}}
            onFinishFailed={() => {}}
            layout="vertical"
          >
            <Row gutter={14} style={{ padding: 5 }}>
              <Col span={8} style={{ marginTop: 20 }}>
                <Controller
                  name="corr_subject"
                  control={control}
                  render={({ field }) => (
                    <MaterialInput
                      label={labels.lbl.corr_subject}
                      {...field}
                      style={{ height: 45 }}
                    />
                  )}
                />
              </Col>
              <Col span={8} style={{ marginTop: 20 }}>
                <Controller
                  name="correspondence_no"
                  control={control}
                  render={({ field }) => (
                    <MaterialInput
                      label={labels.lbl.corr_number}
                      {...field}
                      style={{ height: 45 }}
                    />
                  )}
                />
              </Col>
              <Col span={8} style={{ marginTop: 20 }}>
                <Controller
                  name="corr_type_id"
                  control={control}
                  render={({ field }) => (
                    <Picklist
                      canClear
                      {...field}
                      value={field.value || -1}
                      code="Correspondence Type"
                      label={labels.lbl.corr_types}
                    />
                  )}
                />
              </Col>

              <Col xs={24} lg={8} style={{ marginTop: 20 }}>
                <Controller
                  name="security_level_id"
                  control={control}
                  render={({ field }) => (
                    <Picklist
                      {...field}
                      value={field.value || -1}
                      code="Security Level"
                      label={labels.lbl.security_level}
                      canClear
                    />
                  )}
                />
              </Col>
              <Col xs={24} lg={8} style={{ marginTop: 20 }}>
                <Controller
                  name="urgency_id"
                  control={control}
                  render={({ field }) => (
                    <Picklist
                      {...field}
                      value={field.value || -1}
                      code="Urgency Level"
                      label={labels.lbl.urgency_level}
                      canClear
                    />
                  )}
                />
              </Col>
              {delegations && delegations?.length > 0 && (
                <Col xs={24} lg={8} style={{ marginTop: 22 }}>
                  <Controller
                    name="delegation_id"
                    control={control}
                    render={({ field }) => (
                      <InboxDelegationSelect
                        {...field}
                        delegations={delegations}
                      />
                    )}
                  />
                </Col>
              )}

              <Col span={12} style={{ marginTop: 22 }}>
                <Controller
                  name="task_date_from"
                  control={control}
                  render={({ field }) => (
                    <DateComponent
                      {...field}
                      label={labels.lbl.start_task_date}
                    />
                  )}
                />
              </Col>
              <Col span={12} style={{ marginTop: 22 }}>
                <Controller
                  name="task_date_to"
                  control={control}
                  render={({ field }) => (
                    <DateComponent
                      {...field}
                      label={labels.lbl.end_task_date}
                    />
                  )}
                />
              </Col>
            </Row>
          </Form>
          <Col
            span={24}
            style={{
              display: "flex",
              justifyContent: "end",
              alignItems: "center",
              marginTop: 20,
              gap: 8,
            }}
          >
            <ButtonComponent
              type="primary"
              style={{ marginRight: 15 }}
              onClick={onClickSearch}
              icon={<SearchOutlined />}
              buttonLabel={labels.btn.search}
            />
            <Button type="primary" onClick={resetAll}>
              <ReloadOutlined />
              {labels.btn.reset}
            </Button>
          </Col>
        </>
      )}
    </div>
  );
}
