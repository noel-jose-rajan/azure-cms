import { useLanguage } from "@/context/language";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import ErrorComponent from "../error";
import { useState } from "react";
import { useTheme } from "@/context/theme";

type Props = {
  label: string;
  value?: string;
  onChange: (val: string) => void;
  canClear?: boolean;
  error?: string;
};

const DateComponent = ({
  label,
  value = "",
  onChange,
  error,
  canClear = true,
}: Props) => {
  const { isEnglish } = useLanguage();
  const [isFocus, setIsFocus] = useState(false);
  const [open, setOpen] = useState(false);
  const { theme } = useTheme();
  return (
    <div
      style={{
        paddingBlock: 12,
        backgroundColor: "transparent",
        position: "relative",
      }}
      onClick={() => setOpen(true)}
    >
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <DatePicker
          open={open}
          onOpen={() => setOpen(true)}
          onClose={() => setOpen(false)}
          slotProps={{
            field: {
              clearable: canClear,
              onFocus: () => {
                setIsFocus(true);
              },
              onBlur: () => {
                setIsFocus(false);
              },
            },
            textField: {
              size: "small",
              variant: "standard",
              fullWidth: true,
              sx: {
                "& .clearButton": {
                  transform: isEnglish
                    ? "translateX(-16px)"
                    : "translateX(16px)",
                },
                "& .MuiPickersInputBase-root": {
                  position: "relative",
                },
                "& .MuiFormLabel-root": {
                  textAlign: isEnglish ? "left" : "right",
                  color: isFocus
                    ? theme.colors.success
                    : error
                    ? theme.colors.danger
                    : "grey",
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
          label={label}
          value={value ? new Date(value) : null}
          onChange={(newValue) => {
            if (!newValue) {
              onChange("");
            } else {
              const iso = newValue.toISOString();
              onChange(iso);
            }
          }}
        />
      </LocalizationProvider>
      <ErrorComponent error={error} />
    </div>
  );
};

export default DateComponent;
