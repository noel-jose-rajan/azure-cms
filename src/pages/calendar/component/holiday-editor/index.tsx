import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Col, Modal } from "antd";
import { EditFilled, PlusOutlined } from "@ant-design/icons";
import { useLanguage } from "../../../../context/language";
import dayjs, { Dayjs } from "dayjs";
import {
  addHoliday,
  editHoliday,
  Holiday,
  holidaySchema,
} from "../../../../components/services/calendar";
import { MaterialInput } from "@/components/ui/material-input";
import { DatePicker } from "antd";
import ButtonComponent from "@/components/ui/button";
import useHandleError from "@/components/hooks/useHandleError";
import useCustomMessage from "@/components/hooks/use-message";

const { RangePicker } = DatePicker;
interface Props {
  onCancel: () => any;
  refresh: () => Promise<void>;
  editedHoliday?: Holiday | null;
}

export default function HolidayEditor({
  refresh,
  onCancel,
  editedHoliday,
}: Props) {
  const isEditMode = Boolean(editedHoliday);
  const { showMessage } = useCustomMessage();
  const { handleError } = useHandleError();
  const { labels, isEnglish } = useLanguage();
  const [loading, setLoading] = useState(false);
  const {
    getValues,
    control,
    watch,
    formState: { errors },
  } = useForm<Holiday>({
    resolver: zodResolver(holidaySchema),
    defaultValues: isEditMode
      ? {
          holiday_name: editedHoliday?.holiday_name,
          dateRange: [editedHoliday?.start_date, editedHoliday?.end_date],
        }
      : {},
  });

  const onSubmit = async () => {
    if (isEditMode) {
      handleUpdate();
    } else {
      await handleCreate();
    }
  };

  const handleCreate = async () => {
    try {
      setLoading(true);
      const { dateRange = [], holiday_name } = getValues();
      const body: Holiday = {
        holiday_name,
        end_date: dateRange[1],
        start_date: dateRange[0],
      };
      const res = await addHoliday(body);

      if (res) {
        showMessage("success", labels.msg.save_annual_holiday);
        onCancel();
        await refresh();
      }
    } catch (e) {
      handleError(e);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    try {
      setLoading(true);
      const { dateRange = [], holiday_name } = getValues();
      const body: Holiday = {
        holiday_name,
        end_date: dateRange[1],
        start_date: dateRange[0],
      };
      const res = await editHoliday(editedHoliday?.id, body);

      if (res) {
        showMessage("success", labels.msg.save_annual_holiday);
        onCancel();
        await refresh();
      }
    } catch (e) {
      handleError(e);
    } finally {
      setLoading(false);
    }
  };
  const { dateRange, holiday_name } = watch();

  const isValid = holiday_name && dateRange?.every((d) => Boolean(d));
  return (
    <Modal
      title={isEditMode ? labels.btn.edit : labels.btn.add_new}
      open={true}
      onCancel={onCancel}
      // onOk={handleSubmit(onSubmit)}
      okText={labels.btn.ok}
      cancelText={labels.btn.cancel}
      footer={<></>}
    >
      <form style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        <Col span={24} style={{ marginTop: 20 }}>
          <Controller
            name="holiday_name"
            control={control}
            render={({ field }) => (
              <MaterialInput
                label={labels.tbl.vacation_name}
                {...field}
                error={errors.holiday_name?.message}
              />
            )}
          />
        </Col>
        <Col span={24} style={{ marginTop: 20 }}>
          <Controller
            name="dateRange"
            control={control}
            render={({ field }) => {
              console.log({ dates: field.value });

              const values: [Dayjs | null, Dayjs | null] = [
                field?.value && field.value[0] ? dayjs(field.value[0]) : null,
                field?.value && field.value[1] ? dayjs(field.value[1]) : null,
              ];
              return (
                <RangePicker
                  style={{ width: "100%" }}
                  variant="borderless"
                  {...field}
                  value={values}
                  onChange={(dates) => {
                    const isoDates = dates?.map((d) => d?.toISOString()) ?? [
                      null,
                      null,
                    ];
                    field.onChange(isoDates);
                  }}
                  format="YYYY-MM-DD"
                  allowClear
                  placeholder={
                    !isEnglish
                      ? ["تاريخ البدء", "تاريخ الانتهاء"]
                      : ["Start Date", "End Date"]
                  }
                />
              );
            }}
          />
        </Col>

        <Col
          span={24}
          style={{ marginTop: 20, display: "flex", justifyContent: "end" }}
        >
          <ButtonComponent
            buttonLabel={isEditMode ? labels.btn.edit : labels.btn.create}
            type="primary"
            style={{ marginInline: 8 }}
            icon={isEditMode ? <EditFilled /> : <PlusOutlined />}
            spinning={loading}
            disabled={!isValid}
            onClick={() => {
              onSubmit();
            }}
          />
        </Col>
      </form>
    </Modal>
  );
}
