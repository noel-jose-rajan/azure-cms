import { CSSProperties, useState } from "react";
import { Dropdown, MenuProps, Tag } from "antd";
import { useTheme } from "../../../../context/theme";
import { CaretDownOutlined } from "@ant-design/icons";

interface MultiSelectProps {
  label: string;
  error?: string;
  value?: string[];
  onChange: (value: string[]) => void;
  options: { value: string; label: string }[];
  style?: CSSProperties;
  [x: string]: any;
}

export function MultiSelectDropdown({
  label,
  error,
  value = [],
  onChange,
  options,
  style,
}: MultiSelectProps) {
  const [focused, setFocused] = useState(false);
  const { theme } = useTheme();

  const labelStyles: CSSProperties = {
    position: "absolute",
    left: "8px",
    top: focused || value.length ? "-10px" : "50%",
    transform: focused || value.length ? "translateY(0)" : "translateY(-50%)",
    fontSize: focused || value.length ? "12px" : "16px",
    color: focused ? theme.colors.primary : "grey",
    transition: "all 0.3s ease",
    pointerEvents: "none",
  };

  const wrapperStyles: CSSProperties = {
    position: "relative",
    width: "100%",
    borderBottom: "1px solid grey",
    minHeight: 45,
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
    if (!value.length) return error ? "#DB4437" : "grey";
    return "grey";
  };

  const menu: MenuProps["items"] = options.map((item) => ({
    key: item.value,
    label: (
      <div style={styles.menuItem}>
        <p style={{ fontSize: 15 }}>{item.label}</p>
      </div>
    ),
    onClick: () => {
      const newValue = value.includes(item.value)
        ? value.filter((v) => v !== item.value)
        : [...value, item.value];
      onChange(newValue);
    },
  }));

  const handleFocus = () => {
    setFocused(true);
  };

  const handleVisibleChange = (visible: boolean) => {
    if (!visible && !value.length) {
      setFocused(false);
    }
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
        <Dropdown
          menu={{ items: menu }}
          trigger={["click"]}
          onVisibleChange={handleVisibleChange}
        >
          <div style={styles.dropdownValue} onClick={handleFocus}>
            <div
              style={{
                flex: 1,
                paddingLeft: 10,
                display: "flex",
                flexWrap: "wrap",
              }}
            >
              {value.map((val) => (
                <Tag
                  key={val}
                  closable
                  onClose={() => onChange(value.filter((v) => v !== val))}
                >
                  {options.find((v) => v.value === val)?.label}
                </Tag>
              ))}
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
  menuItem: {
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
  },
};
