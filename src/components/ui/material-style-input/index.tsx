import { CSSProperties, useState } from "react";
import { Input, InputProps } from "antd";
import { useTheme } from "../../../context/theme";
import { useLanguage } from "../../../context/language";

interface MaterialInputProps {
  label?: string;
  error?: string;
  value?: string;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void;
  [x: string]: any;
  allowEdit?: boolean;
  InputComponent?: typeof Input | typeof Input.Password;
  inputProps?: InputProps;
}

export default function MaterialStyleInput({
  label,
  error,
  value,
  onBlur,
  onFocus,
  allowEdit = true,
  InputComponent = Input,
  inputProps,
  ...rest
}: MaterialInputProps) {
  const [focused, setFocused] = useState(false);
  const { theme } = useTheme();
  const { isEnglish } = useLanguage();

  const labelStyles: CSSProperties = {
    position: "absolute",
    top: focused || value ? "-10px" : "50%",
    transform: focused || value ? "translateY(0)" : "translateY(-50%)",
    fontSize: focused || value ? "12px" : "16px",
    color: focused ? theme.colors.primary : "grey",
    transition: "all 0.3s ease",
    pointerEvents: "none",
  };

  const wrapperStyles: CSSProperties = {
    position: "relative",
    width: "100%",
  };

  const inputStyles: CSSProperties = {
    padding: "8px 10px",
    width: "100%",
    border: "none",
    borderRadius: "0",
    outline: "none",
    transition: "border-color 0.3s ease",
    boxShadow: "none",
  };

  const underlineStyles: CSSProperties = {
    position: "absolute",
    bottom: "0",
    left: "0",
    height: "2px",
    width: focused ? "100%" : "0",
    transition: "width 0.3s ease",
  };

  const getColor = (): string => {
    if (error) return "#DB4437";
    if (focused) return "#0F9D58";
    if (!value) return error ? "#DB4437" : "grey";
    return "grey";
  };

  // Handle focus and blur events
  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    setFocused(true);
    if (onFocus) onFocus(e);
    if (inputProps?.onFocus) inputProps.onFocus(e); // Call onFocus from inputProps if provided
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setFocused(false);
    if (onBlur) onBlur(e);
    if (inputProps?.onBlur) inputProps.onBlur(e); // Call onBlur from inputProps if provided
  };

  return (
    <>
      <div style={wrapperStyles}>
        <label
          style={{
            ...labelStyles,
            color: getColor(),
            ...(isEnglish ? { left: "8px" } : { right: "8px" }),
          }}
        >
          {label}
        </label>
        <InputComponent
          value={value}
          disabled={!allowEdit}
          {...rest}
          {...inputProps}
          onFocus={handleFocus}
          onBlur={handleBlur}
          style={{
            ...inputStyles,
            borderBottom: `1px solid ${error ? "#DB4437" : "#0F9D58"}`,
          }}
          variant="borderless"
        />
        <div
          style={{
            ...underlineStyles,
            backgroundColor: error ? "#DB4437" : "#0F9D58",
          }}
        ></div>
      </div>
      {error && (
        <p
          style={{ color: "red", fontSize: 10, marginTop: 0, marginBottom: 0 }}
        >
          {error}
        </p>
      )}
    </>
  );
}
