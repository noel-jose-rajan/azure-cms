import { CSSProperties, useState } from "react";
import { Input } from "antd";
import { useTheme } from "../../../context/theme";

const { TextArea } = Input;

interface MaterialInputProps {
  label: string;
  error?: string;
  [x: string]: any;
  allowEdit?: boolean;
  style?: CSSProperties;
}

export function MaterialTextArea({
  label,
  error,
  value,
  onBlur,
  allowEdit = true,
  style,
  ...rest
}: MaterialInputProps) {
  const [focused, setFocused] = useState(false);
  const { theme } = useTheme();

  const labelStyles: CSSProperties = {
    position: "absolute",
    left: "8px",
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
    borderBottom: `1px solid ${
      error ? theme.colors.danger : theme.colors.success
    }`,
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
    if (error) return theme.colors.danger;
    if (focused) return theme.colors.success;
    if (!value) return error ? theme.colors.danger : "grey";
    return "grey";
  };

  return (
    <>
      <div style={{ ...wrapperStyles, ...style }}>
        <label
          style={{
            ...labelStyles,
            color: getColor(),
          }}
        >
          {label}
        </label>
        <TextArea
          onFocus={() => setFocused(true)}
          onBlur={(e) => {
            if (onBlur) onBlur(e);
            setFocused(false);
          }}
          value={value}
          disabled={!allowEdit}
          {...rest}
          style={{
            ...inputStyles,
          }}
          variant="borderless"
          autoSize={{ minRows: 1, maxRows: 6 }}
        />
        <div
          style={{
            ...underlineStyles,
            backgroundColor: error ? "#DB4437" : "#0F9D58",
          }}
        ></div>
      </div>
      <p style={{ color: "red", fontSize: 10, marginTop: 0, marginBottom: 0 }}>
        {error}
      </p>
    </>
  );
}
