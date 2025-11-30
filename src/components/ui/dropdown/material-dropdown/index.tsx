import { CSSProperties, useEffect, useState } from "react";
import { Dropdown, MenuProps } from "antd";
import { useTheme } from "../../../../context/theme";
import { CaretDownOutlined } from "@ant-design/icons";

interface MaterialSelectProps {
  label: string;
  error?: string;
  value?: string;
  onChange: (value: string) => void;
  options: { value: string; label: string; disable?: boolean }[];
  style?: CSSProperties;
  [x: string]: any;
}

export function MaterialSelect({
  label,
  error,
  value,
  onChange,
  options,
  style,
}: MaterialSelectProps) {
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
    borderBottom: "1px solid grey",
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

  const menu: MenuProps["items"] = options.map((item) => ({
    key: item.value,
    label: (
      <div style={styles.semiMatchItem}>
        <p style={{ fontSize: 15 }}>{item.label}</p>
      </div>
    ),
    disabled: item.disable,
    onClick: () => onChange(item.value),
  }));

  const handleFocus = () => {
    setFocused(true);
  };

  const handleVisibleChange = (visible: boolean) => {
    if (!visible && !value) {
      setFocused(false);
    }
  };

  useEffect(() => {
    if (!value) {
      setFocused(false);
    }
  }, [value]);

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
        <Dropdown
          menu={{
            items: menu,
            style: {
              maxHeight: 400,
            },
          }}
          trigger={["click"]}
          onVisibleChange={handleVisibleChange}
        >
          <div style={styles.dropdownValue} onClick={handleFocus}>
            <div style={{ flex: 1, paddingLeft: 10 }}>
              {value && value !== "" ? (
                <p style={{ fontSize: 16 }}>
                  {value ? options.find((v) => v.value === value)?.label : ""}
                </p>
              ) : (
                <></>
              )}
            </div>
            <CaretDownOutlined style={{ marginRight: 5 }} />
          </div>
        </Dropdown>
        <div
          style={{
            ...underlineStyles,
            backgroundColor: error ? "#DB4437" : "#0F9D58",
          }}
        ></div>
      </div>
      {error && <p style={styles.errorText}>{error}</p>}
    </>
  );
}

const styles = {
  semiMatchText: {
    margin: 0,
    fontSize: 13,
    lineHeight: "1.2",
    display: "block",
    marginTop: 2,
  },
  semiMatchItem: {
    height: 30,
    width: "100%",
    display: "flex",
    alignItems: "center",
  },
  errorText: {
    color: "#DB4437",
    fontSize: 10,
    marginTop: 0,
    marginBottom: 0,
  },
  dropdownValue: {
    width: "100%",
    height: 40,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    // borderBottom: "1px solid grey",
  },
};
