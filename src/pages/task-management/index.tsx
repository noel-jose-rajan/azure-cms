import React from "react";
import { FormProvider, useFormContext } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { TextField } from "@mui/material";
import { searchTaskManagementSchema, SearchTaskManagementType } from "./schema";
import { Checkbox, Col, Row } from "antd";
import { useLanguage } from "@/context/language";
import SelectUsers from "@/components/shared/select-users";
import { MaterialInput } from "@/components/ui/material-input";
import TitleHeader from "@/components/ui/header";
import { SearchOutlined } from "@ant-design/icons";
import ButtonComponent from "@/components/ui/button";
import TaskManagementTable from "./components/table";

const TaskManagement = () => {
  const { labels } = useLanguage();
  const methods = useForm<SearchTaskManagementType>({
    resolver: zodResolver(searchTaskManagementSchema),
  });

  return (
    <div>
      <TitleHeader
        heading={labels.til.search_criteria}
        icon={<SearchOutlined />}
      />
      <FormProvider {...methods}>
        <SearchTaskManagementForm />
      </FormProvider>
      <TaskManagementTable />
    </div>
  );
};

export default TaskManagement;

export const SearchTaskManagementForm: React.FC = () => {
  const { isEnglish, labels } = useLanguage();
  const { control } = useFormContext<SearchTaskManagementType>();
  const {
    handleSubmit,
    formState: { errors },
  } = useFormContext<SearchTaskManagementType>();
  const onSubmit = (data: SearchTaskManagementType) => {
    console.log(data);
  };

  return (
    <Row
      gutter={[14, 30]}
      style={{
        padding: 5,
        marginTop: 12,
        display: "flex",
        flexDirection: isEnglish ? "row" : "row-reverse",
      }}
    >
      <Col xs={24} sm={12}>
        <Controller
          name="correspondenceNo"
          control={control}
          render={({ field }) => (
            <MaterialInput
              {...field}
              label={labels.lbl.corr_number}
              applyReverse
            />
          )}
        />
      </Col>
      <Col xs={24} sm={12}>
        <Controller
          name="currentUser"
          control={control}
          render={({ field }) => (
            <SelectUsers {...field} label={labels.lbl.current_user} />
          )}
        />
      </Col>

      <Col xs={24} sm={12}>
        <Controller
          name="from"
          control={control}
          render={({ field }) => (
            <TextField
              slotProps={{
                inputLabel: {
                  shrink: true,
                  style: {
                    left: isEnglish ? "8px" : "auto",
                    right: isEnglish ? "auto" : "8px",
                  },
                },
              }}
              sx={{
                "& input[type='date']::-webkit-calendar-picker-indicator": {
                  position: "absolute",
                  left: !isEnglish ? "8px" : "auto",
                  right: isEnglish ? "8px" : "auto",
                  marginRight: isEnglish ? "0px" : "4px",
                },
                "& input[type='date']": {
                  textAlign: isEnglish ? "left" : "right",
                },
              }}
              {...field}
              margin="normal"
              variant="standard"
              fullWidth
              type="date"
              label={labels.lbl.delegation_date_from}
              InputLabelProps={{ shrink: true }}
            />
          )}
        />
      </Col>
      <Col xs={24} sm={12}>
        <Controller
          name="to"
          control={control}
          render={({ field }) => (
            <TextField
              slotProps={{
                inputLabel: {
                  shrink: true,
                  style: {
                    left: isEnglish ? "8px" : "auto",
                    right: isEnglish ? "auto" : "8px",
                  },
                },
              }}
              sx={{
                "& input[type='date']::-webkit-calendar-picker-indicator": {
                  position: "absolute",
                  left: !isEnglish ? "8px" : "auto",
                  right: isEnglish ? "8px" : "auto",
                  marginRight: isEnglish ? "0px" : "4px",
                },
                "& input[type='date']": {
                  textAlign: isEnglish ? "left" : "right",
                },
              }}
              {...field}
              margin="normal"
              variant="standard"
              fullWidth
              type="date"
              label={labels.lbl.delegation_date_from}
              InputLabelProps={{ shrink: true }}
            />
          )}
        />
      </Col>

      <Col
        span={24}
        style={{
          display: "flex",
          justifyContent: isEnglish ? "flex-start" : "flex-end",
          flexDirection: !isEnglish ? "row" : "row-reverse",
          alignItems: "center",
          paddingLeft: 10,
        }}
      >
        <Controller
          name="isPostponedBefore"
          control={control}
          render={({ field }) => (
            <Checkbox
              style={{ direction: isEnglish ? "ltr" : "rtl" }}
              {...field}
              checked={field.value}
              onChange={(e) => field.onChange(e.target.checked)}
            >
              {labels.lbl.is_postponed_before}
            </Checkbox>
          )}
        />
      </Col>

      <Col
        sm={24}
        style={{
          display: "flex",
          justifyContent: isEnglish ? "flex-start" : "flex-end",
          flexDirection: !isEnglish ? "row" : "row-reverse",
          alignItems: "center",
          paddingLeft: 10,
        }}
      >
        <Controller
          name="isDelegatedBefore"
          control={control}
          render={({ field }) => (
            <Checkbox
              style={{ direction: isEnglish ? "ltr" : "rtl" }}
              {...field}
              checked={field.value}
              onChange={(e) => field.onChange(e.target.checked)}
            >
              {labels.lbl.is_delegated_before}
            </Checkbox>
          )}
        />
      </Col>

      <ButtonComponent
        icon={<SearchOutlined />}
        onClick={handleSubmit(onSubmit)}
        style={{ marginTop: 20 }}
        buttonLabel={labels.btn.search}
        type="primary"
      >
        Search
      </ButtonComponent>
    </Row>
  );
};
