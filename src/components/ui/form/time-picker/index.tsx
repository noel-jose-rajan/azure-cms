import { useLanguage } from "@/context/language";
import { TimePicker } from "@mui/x-date-pickers";
import { PickerValue } from "@mui/x-date-pickers/internals";
import React, { useState } from "react";

type Props = {
  label: string;
  value: PickerValue;
  onChange: (val: PickerValue) => void;
  canClear?: boolean;
};

const TimePickerComponent = ({
  label,
  onChange,
  value,
  canClear = true,
}: Props) => {
  const { isEnglish } = useLanguage();
  const [open, setOpen] = useState(false);

  return (
    <div onClick={() => setOpen(true)}>
      <TimePicker
        open={open}
        onOpen={() => setOpen(true)}
        onClose={() => setOpen(false)}
        slotProps={{
          field: {
            clearable: canClear,
          },
          textField: {
            size: "small",
            //   fullWidth: true,
            variant: "standard",
            fullWidth: true,
            sx: {
              "& .clearButton": {
                transform: isEnglish ? "translateX(-16px)" : "translateX(16px)",
              },
              "& .MuiPickersInputBase-root": {
                position: "relative",
              },
              "& .MuiFormLabel-root": {
                textAlign: isEnglish ? "left" : "right",

                width: "100%",
                transformOrigin: isEnglish ? "left" : "right",
              },
              "& .MuiPickersSectionList-root": {
                display: "flex",
                justifyContent: !isEnglish ? "end" : "start",
              },
              "& .MuiIconButton-root": {
                position: "absolute",
                left: !isEnglish ? "8px" : "auto",
                right: isEnglish ? "8px" : "auto",
              },
              "& .MuiSvgIcon-root": {
                width: 12,
                height: 12,
                marginInline: -12,
              },
            },
          },
        }}
        value={value}
        onChange={onChange}
        ampm={true}
        label={label}
      />
    </div>
  );
};

export default TimePickerComponent;
