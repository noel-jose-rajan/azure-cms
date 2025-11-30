import HeightAnimationWrapper from "@/animations/height-wrapper-animation";
import useHandleError from "@/components/hooks/useHandleError";
import { WorkingDay, setWorkingHours } from "@/components/services/calendar";
import ButtonComponent from "@/components/ui/button";
import ErrorComponent from "@/components/ui/form/error";
import { calandarArr } from "@/constants/app/calander";
import { useLanguage } from "@/context/language";
import { SaveOutlined } from "@ant-design/icons";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { Row, Col, Typography, Modal, Radio } from "antd";
import dayjs from "dayjs";
import { useEffect, useState } from "react";

const getRadioLabels = (bool: boolean) => [
  {
    value: 2,
    label: !bool ? " للايام المحددة" : "custom days",
  },
  {
    value: 1,
    label: !bool ? " باليوم" : "by day",
  },
];

type Props = {
  onClose: () => void;
  initialworkingDays: WorkingDay[];
  refreshDays: () => void;
  defaultRadioValue: 2 | 1;
  defaultWorkingHours: WorkingDay[];
};
const EditWorkingHoursModal = ({
  onClose,
  initialworkingDays,
  refreshDays,
  defaultRadioValue,
  defaultWorkingHours,
}: Props) => {
  const { showMessage } = useCustomMessage();
  const { labels, isEnglish } = useLanguage();
  const { handleError } = useHandleError();
  const [customWorkingHours, setCustomWorkingHours] = useState(
    defaultRadioValue == 2
      ? {
          time_from: defaultWorkingHours[0]?.time_from,
          time_to: defaultWorkingHours[0]?.time_to,
        }
      : {
          time_from: "",
          time_to: "",
        }
  );
  const [workingDays, setWorkingDays] = useState(initialworkingDays);
  // const [isModified, setIsModified] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isValid, setIsValid] = useState(false);
  const [radioValue, setRadioValue] = useState<1 | 2>(defaultRadioValue || 2);
  const [selectedDays, setSelectedDays] = useState<number[]>(
    defaultRadioValue === 2 ? defaultWorkingHours?.map((d) => d?.day_id) : []
  );
  const handleTimeChange = (
    day_id: number,
    field: keyof WorkingDay,
    value: any
  ) => {
    const newDays = workingDays.map((d) =>
      d.day_id === day_id
        ? { ...d, [field]: value ? value.format("HH:mm") : "" }
        : d
    );
    setWorkingDays(newDays);
    // setIsModified(true);
  };

  useEffect(() => {
    if (radioValue == 1) {
      if (
        workingDays.some(
          (d) => (d.time_from && !d.time_to) || (d.time_to && !d.time_from)
        )
      ) {
        setIsValid(false);
      } else {
        setIsValid(true);
      }
    } else {
      if (customWorkingHours.time_from && customWorkingHours.time_to) {
        setIsValid(true);
      } else {
        setIsValid(false);
      }
    }
  }, [workingDays, customWorkingHours]);
  console.log({ selectedDays });

  const handleUpdateWorkingHours = async () => {
    try {
      setLoading(true);

      let body: WorkingDay[];

      if (radioValue == 1) {
        body = workingDays.filter((d) => d?.time_from && d?.time_to) || [];
      } else {
        body = selectedDays.map((id) => ({
          day_id: id,
          ...customWorkingHours,
        }));
      }
      const res = await setWorkingHours({ working_days: body });
      if (res) {
        showMessage("success", labels.msg.save_working_hours);
        refreshDays();
        onClose();
      }
    } catch (e) {
      handleError(e);
    } finally {
      setLoading(false);
    }
  };

  const handleCustomTimeChange = async (
    key: keyof typeof customWorkingHours,
    value: any
  ) => {
    setCustomWorkingHours((prev) => ({
      ...prev,
      [key]: value ? value?.format("HH:mm") : "",
    }));
    // setIsModified(true);
  };

  return (
    <Modal
      afterClose={() => onClose()}
      open={true}
      onCancel={() => onClose()}
      width={600}
      title={
        <Typography>
          {isEnglish ? "Edit Working Hours" : "تعديل ساعات العمل"}
        </Typography>
      }
      footer={<></>}
      centered
    >
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Row style={{ marginBottom: 32, marginTop: 16 }}>
          <Radio.Group
            size="small"
            // style={{ display: "flex", flexDirection: "column" }}
            onChange={(e) => {
              setRadioValue(e.target.value);
              // setIsModified(false);
              setSelectedDays([]);
              setWorkingDays(initialworkingDays);
              setCustomWorkingHours({
                time_from: "",
                time_to: "",
              });
            }}
            value={radioValue}
            options={getRadioLabels(isEnglish)}
          />
        </Row>

        <HeightAnimationWrapper>
          {radioValue == 1 ? (
            <div>
              {calandarArr.map((day) => {
                const wd: WorkingDay | null =
                  workingDays.find((d) => d.day_id === day.id) || null;
                return (
                  <Row
                    key={day.id}
                    gutter={16}
                    align="middle"
                    style={{
                      marginBottom: 12,
                      display: "flex",
                      alignItems: "flex-start",
                      // flexDirection: isEnglish ? "row" : "row-reverse",
                    }}
                  >
                    <Col
                      span={4}
                      style={{
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <Typography.Text style={{ fontSize: 14 }}>
                        {isEnglish ? day.enLabel : day.arLabel}
                      </Typography.Text>
                    </Col>
                    <Col span={10}>
                      <TimePickerComponent
                        value={
                          wd?.time_from ? dayjs(wd?.time_from, "HH:mm") : null
                        }
                        onChange={(val) =>
                          handleTimeChange(day.id, "time_from", val)
                        }
                        label={isEnglish ? "From" : "من"}
                      />
                      {wd?.time_to && !wd.time_from && (
                        <ErrorComponent
                          error={
                            isEnglish
                              ? "this field is required"
                              : "يجب إضافة هذا الحقل"
                          }
                        />
                      )}
                    </Col>
                    <Col
                      span={10}
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "flex-start",
                      }}
                    >
                      <TimePickerComponent
                        value={wd?.time_to ? dayjs(wd?.time_to, "HH:mm") : null}
                        onChange={(val) =>
                          handleTimeChange(day.id, "time_to", val)
                        }
                        label={isEnglish ? "To" : "إلى"}
                      />
                      {wd?.time_from && !wd.time_to && (
                        <ErrorComponent
                          error={
                            isEnglish
                              ? "this field is required"
                              : "يجب إضافة هذا الحقل"
                          }
                        />
                      )}
                    </Col>
                  </Row>
                );
              })}
            </div>
          ) : (
            <Col>
              <DaySelector
                selectedDays={selectedDays}
                onChange={(checked: boolean, dayId: number) => {
                  setSelectedDays((prev) =>
                    checked
                      ? [...prev, dayId]
                      : prev.filter((id) => id !== dayId)
                  );
                }}
              />
              <Row
                key={"custom-days"}
                gutter={16}
                align="middle"
                style={{
                  marginBottom: 12,
                  display: "flex",
                  alignItems: "flex-start",
                  // flexDirection: isEnglish ? "row" : "row-reverse",
                }}
              >
                <Col span={12}>
                  <TimePickerComponent
                    value={
                      customWorkingHours?.time_from
                        ? dayjs(customWorkingHours?.time_from, "HH:mm")
                        : null
                    }
                    onChange={(val) => handleCustomTimeChange("time_from", val)}
                    label={isEnglish ? "From" : "من"}
                  />
                  {customWorkingHours?.time_to &&
                    !customWorkingHours.time_from && (
                      <ErrorComponent
                        error={
                          isEnglish
                            ? "this field is required"
                            : "يجب إضافة هذا الحقل"
                        }
                      />
                    )}
                </Col>
                <Col
                  span={12}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "flex-start",
                  }}
                >
                  <TimePickerComponent
                    value={
                      customWorkingHours?.time_to
                        ? dayjs(customWorkingHours?.time_to, "HH:mm")
                        : null
                    }
                    onChange={(val) => handleCustomTimeChange("time_to", val)}
                    label={isEnglish ? "To" : "إلى"}
                  />
                  {customWorkingHours?.time_from &&
                    !customWorkingHours.time_to && (
                      <ErrorComponent
                        error={
                          isEnglish
                            ? "this field is required"
                            : "يجب إضافة هذا الحقل"
                        }
                      />
                    )}
                </Col>
              </Row>
            </Col>
          )}
          <div
            style={{
              display: "flex",
              gap: 20,
              width: "100%",
              justifyContent: !isEnglish ? "start" : "end",
              marginTop: 20,
            }}
          >
            <ButtonComponent
              type="primary"
              disabled={!isValid}
              onClick={handleUpdateWorkingHours}
              icon={<SaveOutlined />}
              buttonLabel={labels.btn.save}
              spinning={loading}
            />
            {/* <Button type="primary" disabled={!isModified}>
              <ReloadOutlined />
              {labels.btn.reset}
            </Button> */}
          </div>
        </HeightAnimationWrapper>
      </LocalizationProvider>
    </Modal>
  );
};

export default EditWorkingHoursModal;

import { Checkbox } from "antd";
import TimePickerComponent from "@/components/ui/form/time-picker";
import useCustomMessage from "@/components/hooks/use-message";

type DaySelectorProps = {
  onChange: (checked: boolean, dayId: number) => void;
  selectedDays: number[];
};
const DaySelector = ({ onChange, selectedDays }: DaySelectorProps) => {
  const { isEnglish } = useLanguage();

  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: "12px",
        marginBottom: 12,
      }}
    >
      {calandarArr.map((day) => (
        <Checkbox
          key={day.id}
          checked={selectedDays.includes(day.id)}
          onChange={(e) => onChange(e.target.checked, day.id)}
        >
          {isEnglish ? day.enLabel : day.arLabel}
        </Checkbox>
      ))}
    </div>
  );
};
