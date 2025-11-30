import React, { useState, useEffect } from "react";
import "./theme-editor.css";
import {
  Card,
  Tabs,
  Form,
  Input,
  ColorPicker,
  InputNumber,
  Select,
  Button,
  Row,
  Col,
  Space,
  Typography,
  Divider,
  Switch,
  message,
  Upload,
} from "antd";
import {
  BgColorsOutlined,
  FontSizeOutlined,
  LayoutOutlined,
  SettingOutlined,
  SaveOutlined,
  ReloadOutlined,
  ExportOutlined,
  ImportOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import { useTheme } from "../../context/theme";
import { ThemeType } from "../../types/theme";
import { ThemeName } from "../../configs/theme/register-theme";
import themes from "../../configs/theme/register-theme";
import { useLanguage } from "../../context/language";
import { LANGUAGE } from "../../constants/language";

const { Text, Paragraph } = Typography;
const { TabPane } = Tabs;
const { Option } = Select;

// Safe ColorPicker wrapper component
const SafeColorPicker: React.FC<any> = ({ value, onChange, ...props }) => {
  const handleChange = (color: any) => {
    let colorValue = color;

    // Convert color object to string
    if (color && typeof color === "object") {
      if (color.toHexString) {
        colorValue = color.toHexString();
      } else if (color.metaColor) {
        const { r, g, b, a } = color.metaColor;
        colorValue =
          a === 1 ? `rgb(${r}, ${g}, ${b})` : `rgba(${r}, ${g}, ${b}, ${a})`;
      } else if (color.toRgbString) {
        colorValue = color.toRgbString();
      }
    }

    if (onChange) {
      onChange(colorValue);
    }
  };

  const safeValue =
    typeof value === "object" && value?.toHexString
      ? value.toHexString()
      : value;

  return <ColorPicker {...props} value={safeValue} onChange={handleChange} />;
};

interface ThemeEditorProps {}

const ThemeEditor: React.FC<ThemeEditorProps> = () => {
  const { theme, toggleTheme, updateTheme, saveCustomTheme, currentThemeName } =
    useTheme();
  const { language } = useLanguage();
  const [form] = Form.useForm();
  const [customTheme, setCustomTheme] = useState<ThemeType>(theme);
  const [activeTab, setActiveTab] = useState("colors");
  const [previewMode, setPreviewMode] = useState(false);
  const [isModified, setIsModified] = useState(false);
  const [selectedBaseTheme, setSelectedBaseTheme] =
    useState<ThemeName>("legacy");

  const normalizeColorValues = (themeData: ThemeType): ThemeType => {
    const normalized = { ...themeData };
    const colors = { ...normalized.colors };

    Object.entries(colors).forEach(([key, value]) => {
      if (typeof value === "object" && value !== null) {
        (colors as any)[key] = "#000000";
      }
    });

    return { ...normalized, colors };
  };

  useEffect(() => {
    if (currentThemeName) {
      const parsedName = currentThemeName.split("-")[0] as ThemeName;
      const values = ["light", "dark", "solorid", "dracula", "legacy"].includes(
        parsedName
      );

      if (values) {
        setSelectedBaseTheme(parsedName);
      }
    }
  }, [currentThemeName]);

  // Initialize form with current theme
  useEffect(() => {
    console.log(
      "Initializing theme editor with current theme:",
      currentThemeName
    );
    const normalizedTheme = normalizeColorValues(theme);
    form.setFieldsValue(normalizedTheme);
    setCustomTheme(normalizedTheme);
    setIsModified(false);
  }, [theme, form, currentThemeName]);

  const handleFormChange = (changedFields: any, allFields: any) => {
    const newTheme = { ...customTheme } as any;

    // Update the theme object based on form changes
    Object.keys(allFields).forEach((key) => {
      let value = allFields[key];

      // Handle ColorPicker values - extract hex string from color object
      if (value && typeof value === "object" && value.toHexString) {
        value = value.toHexString();
      } else if (value && typeof value === "object" && value.metaColor) {
        // Handle the specific color object format from Ant Design ColorPicker
        const { r, g, b, a } = value.metaColor;
        value =
          a === 1 ? `rgb(${r}, ${g}, ${b})` : `rgba(${r}, ${g}, ${b}, ${a})`;
      }

      if (value !== undefined) {
        const keys = key.split(".");
        let current = newTheme;

        for (let i = 0; i < keys.length - 1; i++) {
          if (!current[keys[i]]) current[keys[i]] = {};
          current = current[keys[i]];
        }
        current[keys[keys.length - 1]] = value;
      }
    });

    setCustomTheme(newTheme);
    setIsModified(true);
  };

  const handleBaseThemeChange = (themeName: ThemeName) => {
    console.log("Base theme changed to:", themeName);
    const baseTheme = normalizeColorValues(themes[themeName]);
    setCustomTheme(baseTheme);
    form.setFieldsValue(baseTheme);
    setIsModified(false);
  };

  const applyTheme = () => {
    try {
      // Create a unique name for the custom theme if it's modified
      const themeName = isModified
        ? `${selectedBaseTheme}-custom-${Date.now()}`
        : selectedBaseTheme;

      const themeToSave = {
        ...customTheme,
        name: themeName,
      };

      if (isModified) {
        // Save as a custom theme
        saveCustomTheme(themeToSave);
        message.success("Custom theme applied and saved successfully!");
      } else {
        // Just switch to the base theme
        toggleTheme(selectedBaseTheme);
        message.success("Theme applied successfully!");
      }

      setIsModified(false);
    } catch (error) {
      message.error("Failed to apply theme. Please try again.");
      console.error("Theme application error:", error);
    }
  };

  const resetTheme = () => {
    const baseTheme = normalizeColorValues(themes[selectedBaseTheme]);
    form.setFieldsValue(baseTheme);
    setCustomTheme(baseTheme);
    setIsModified(false);
    message.info("Theme reset to original");
  };

  const exportTheme = () => {
    const themeJson = JSON.stringify(customTheme, null, 2);
    const blob = new Blob([themeJson], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${customTheme.name}-theme.json`;
    a.click();
    URL.revokeObjectURL(url);
    message.success("Theme exported successfully!");
  };

  const importTheme = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedTheme = JSON.parse(e.target?.result as string);
        setCustomTheme(importedTheme);
        form.setFieldsValue(importedTheme);
        setIsModified(true);
        message.success("Theme imported successfully!");
      } catch (error) {
        message.error("Invalid theme file format");
      }
    };
    reader.readAsText(file);
    return false; // Prevent upload
  };

  const ThemeSelector = () => (
    <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
      <Col span={24}>
        <Card size="small">
          <Row align="middle" gutter={[16, 16]}>
            <Col>
              <Text strong>
                {language === LANGUAGE.ENGLISH_INT
                  ? "Base Theme:"
                  : "السمة الأساسية:"}
              </Text>
            </Col>
            <Col>
              <Select
                value={selectedBaseTheme}
                style={{ width: 200 }}
                onChange={(value) => {
                  setSelectedBaseTheme(value);
                  handleBaseThemeChange(value);
                }}
              >
                {["light", "dark", "solorid", "dracula", "legacy"].map(
                  (thName) => (
                    <Option key={thName} value={thName}>
                      {thName}
                    </Option>
                  )
                )}
              </Select>
            </Col>
            <Col>
              <Text type="secondary">
                {language === LANGUAGE.ENGLISH_INT
                  ? "Select a base theme to customize"
                  : "اختر سمة أساسية للتخصيص"}
              </Text>
            </Col>
            {isModified && (
              <Col>
                <Text type="warning" style={{ fontSize: "12px" }}>
                  ● {language === LANGUAGE.ENGLISH_INT ? "Modified" : "معدل"}
                </Text>
              </Col>
            )}
          </Row>
        </Card>
      </Col>
    </Row>
  );

  const ColorSection = () => (
    <Row gutter={[16, 16]}>
      <Col span={24}>
        <h3>Primary Colors</h3>
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} md={8}>
            <Form.Item label="Primary" name={["colors", "primary"]}>
              <SafeColorPicker style={{ padding: 10 }} showText format="hex" />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12} md={8}>
            <Form.Item label="Primary Dark" name={["colors", "primaryDark"]}>
              <SafeColorPicker style={{ padding: 10 }} showText format="hex" />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12} md={8}>
            <Form.Item label="Primary Light" name={["colors", "primaryLight"]}>
              <SafeColorPicker style={{ padding: 10 }} showText format="hex" />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12} md={8}>
            <Form.Item label="Secondary" name={["colors", "secondary"]}>
              <SafeColorPicker style={{ padding: 10 }} showText format="hex" />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12} md={8}>
            <Form.Item label="Accent" name={["colors", "accent"]}>
              <SafeColorPicker style={{ padding: 10 }} showText format="hex" />
            </Form.Item>
          </Col>
        </Row>
      </Col>

      <Col span={24}>
        <Divider />
        <h3>Background Colors</h3>
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} md={8}>
            <Form.Item label="Background" name={["colors", "background"]}>
              <SafeColorPicker style={{ padding: 10 }} showText format="hex" />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12} md={8}>
            <Form.Item
              label="Background Secondary"
              name={["colors", "backgroundSecondary"]}
            >
              <SafeColorPicker style={{ padding: 10 }} showText format="hex" />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12} md={8}>
            <Form.Item
              label="Background Text"
              name={["colors", "backgroundText"]}
            >
              <SafeColorPicker style={{ padding: 10 }} showText format="hex" />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12} md={8}>
            <Form.Item label="Surface" name={["colors", "surface"]}>
              <SafeColorPicker style={{ padding: 10 }} showText format="hex" />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12} md={8}>
            <Form.Item label="Surface Hover" name={["colors", "surfaceHover"]}>
              <SafeColorPicker style={{ padding: 10 }} showText format="hex" />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12} md={8}>
            <Form.Item
              label="Surface Active"
              name={["colors", "surfaceActive"]}
            >
              <SafeColorPicker style={{ padding: 10 }} showText format="hex" />
            </Form.Item>
          </Col>
        </Row>
      </Col>

      <Col span={24}>
        <Divider />
        <h3>Text Colors</h3>
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} md={8}>
            <Form.Item label="Text" name={["colors", "text"]}>
              <SafeColorPicker style={{ padding: 10 }} showText format="hex" />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12} md={8}>
            <Form.Item
              label="Text Secondary"
              name={["colors", "textSecondary"]}
            >
              <SafeColorPicker style={{ padding: 10 }} showText format="hex" />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12} md={8}>
            <Form.Item label="Text Muted" name={["colors", "textMuted"]}>
              <SafeColorPicker style={{ padding: 10 }} showText format="hex" />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12} md={8}>
            <Form.Item label="Link" name={["colors", "link"]}>
              <SafeColorPicker style={{ padding: 10 }} showText format="hex" />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12} md={8}>
            <Form.Item label="Link Hover" name={["colors", "linkHover"]}>
              <SafeColorPicker style={{ padding: 10 }} showText format="hex" />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12} md={8}>
            <Form.Item label="Disabled" name={["colors", "disabled"]}>
              <SafeColorPicker style={{ padding: 10 }} showText format="hex" />
            </Form.Item>
          </Col>
        </Row>
      </Col>

      <Col span={24}>
        <Divider />
        <h3>Status Colors</h3>
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} md={6}>
            <Form.Item label="Success" name={["colors", "success"]}>
              <SafeColorPicker style={{ padding: 10 }} showText format="hex" />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Form.Item label="Warning" name={["colors", "warning"]}>
              <SafeColorPicker style={{ padding: 10 }} showText format="hex" />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Form.Item label="Danger" name={["colors", "danger"]}>
              <SafeColorPicker style={{ padding: 10 }} showText format="hex" />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Form.Item label="Info" name={["colors", "info"]}>
              <SafeColorPicker style={{ padding: 10 }} showText format="hex" />
            </Form.Item>
          </Col>
        </Row>
      </Col>

      <Col span={24}>
        <Divider />
        <h3>Other Colors</h3>
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} md={8}>
            <Form.Item label="Border" name={["colors", "border"]}>
              <SafeColorPicker style={{ padding: 10 }} showText format="hex" />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12} md={8}>
            <Form.Item label="Shadow" name={["colors", "shadow"]}>
              <Input placeholder="rgba(0, 0, 0, 0.15)" />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12} md={8}>
            <Form.Item label="Overlay Color" name={["colors", "overlayColor"]}>
              <Input placeholder="#000000aa" />
            </Form.Item>
          </Col>
        </Row>
      </Col>
    </Row>
  );

  const TypographySection = () => (
    <Row gutter={[16, 16]}>
      <Col span={24}>
        <h3>Font Settings</h3>
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12}>
            <Form.Item label="Font Family" name={["typography", "fontFamily"]}>
              <Select>
                <Option value='"Inter", "Segoe UI", sans-serif'>Inter</Option>
                <Option value='"Roboto", "Arial", sans-serif'>Roboto</Option>
                <Option value='"Arial", sans-serif'>Arial</Option>
                <Option value='"Helvetica", sans-serif'>Helvetica</Option>
                <Option value='"Georgia", serif'>Georgia</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item label="Base Font Size" name={["typography", "fontSize"]}>
              <InputNumber min={12} max={24} />
            </Form.Item>
          </Col>
        </Row>
      </Col>

      <Col span={24}>
        <Divider />
        <h3>Font Weights</h3>
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={8}>
            <Form.Item label="Light" name={["typography", "fontWeightLight"]}>
              <InputNumber min={100} max={900} step={100} />
            </Form.Item>
          </Col>
          <Col xs={24} sm={8}>
            <Form.Item
              label="Regular"
              name={["typography", "fontWeightRegular"]}
            >
              <InputNumber min={100} max={900} step={100} />
            </Form.Item>
          </Col>
          <Col xs={24} sm={8}>
            <Form.Item label="Bold" name={["typography", "fontWeightBold"]}>
              <InputNumber min={100} max={900} step={100} />
            </Form.Item>
          </Col>
        </Row>
      </Col>

      <Col span={24}>
        <Divider />
        <h3>Line Heights</h3>
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={8}>
            <Form.Item
              label="Tight"
              name={["typography", "lineHeight", "tight"]}
            >
              <InputNumber min={1} max={3} step={0.1} />
            </Form.Item>
          </Col>
          <Col xs={24} sm={8}>
            <Form.Item
              label="Normal"
              name={["typography", "lineHeight", "normal"]}
            >
              <InputNumber min={1} max={3} step={0.1} />
            </Form.Item>
          </Col>
          <Col xs={24} sm={8}>
            <Form.Item
              label="Relaxed"
              name={["typography", "lineHeight", "relaxed"]}
            >
              <InputNumber min={1} max={3} step={0.1} />
            </Form.Item>
          </Col>
        </Row>
      </Col>

      <Col span={24}>
        <Divider />
        <h3>Headings</h3>
        {["h1", "h2", "h3", "h4", "h5", "h6"].map((heading) => (
          <Row key={heading} gutter={[16, 16]} style={{ marginBottom: 16 }}>
            <Col span={24}>
              <Text strong>{heading.toUpperCase()}</Text>
            </Col>
            <Col xs={24} sm={8}>
              <Form.Item
                label="Font Size"
                name={["typography", "headings", heading, "fontSize"]}
              >
                <Input placeholder="2rem" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={8}>
              <Form.Item
                label="Font Weight"
                name={["typography", "headings", heading, "fontWeight"]}
              >
                <InputNumber min={100} max={900} step={100} />
              </Form.Item>
            </Col>
            <Col xs={24} sm={8}>
              <Form.Item
                label="Line Height"
                name={["typography", "headings", heading, "lineHeight"]}
              >
                <Input placeholder="1.2" />
              </Form.Item>
            </Col>
          </Row>
        ))}
      </Col>
    </Row>
  );

  const SpacingSection = () => (
    <Row gutter={[16, 16]}>
      <Col span={24}>
        <h3>Spacing Scale</h3>
        <Paragraph>
          Define the spacing scale used throughout the application for margins,
          paddings, and gaps.
        </Paragraph>
        <Row gutter={[16, 16]}>
          {["none", "xs", "sm", "md", "lg", "xl", "xxl", "xxxl"].map((size) => (
            <Col key={size} xs={24} sm={12} md={6}>
              <Form.Item label={size.toUpperCase()} name={["spacing", size]}>
                <Input placeholder="16px" />
              </Form.Item>
            </Col>
          ))}
        </Row>
      </Col>

      <Col span={24}>
        <Divider />
        <h3>Border Radius</h3>
        <Row gutter={[16, 16]}>
          {["none", "small", "medium", "large", "xl", "full"].map((size) => (
            <Col key={size} xs={24} sm={12} md={8}>
              <Form.Item
                label={size.charAt(0).toUpperCase() + size.slice(1)}
                name={["borderRadius", size]}
              >
                <Input placeholder="8px" />
              </Form.Item>
            </Col>
          ))}
        </Row>
      </Col>

      <Col span={24}>
        <Divider />
        <h3>Shadows</h3>
        <Row gutter={[16, 16]}>
          {["none", "small", "medium", "large", "xl", "inner"].map((size) => (
            <Col key={size} xs={24} sm={12}>
              <Form.Item
                label={size.charAt(0).toUpperCase() + size.slice(1)}
                name={["shadows", size]}
              >
                <Input placeholder="0px 3px 6px rgba(0, 0, 0, 0.16)" />
              </Form.Item>
            </Col>
          ))}
        </Row>
      </Col>
    </Row>
  );

  const ComponentsSection = () => (
    <Row gutter={[16, 16]}>
      <Col span={24}>
        <h3>Button Components</h3>
        <Card
          key={"primary"}
          size="small"
          title={"primary"}
          style={{ marginBottom: 16 }}
        >
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12} md={6}>
              <Form.Item
                label="Background"
                name={["components", "button", "primary", "background"]}
              >
                <SafeColorPicker
                  style={{ padding: 10 }}
                  showText
                  format="hex"
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Form.Item
                label="Text Color"
                name={["components", "button", "primary", "textColor"]}
              >
                <SafeColorPicker
                  style={{ padding: 10 }}
                  showText
                  format="hex"
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Form.Item
                label="Border"
                name={["components", "button", "primary", "border"]}
              >
                <Input placeholder="1px solid #000" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Form.Item
                label="Border Radius"
                name={["components", "button", "primary", "borderRadius"]}
              >
                <Input placeholder="8px" />
              </Form.Item>
            </Col>
          </Row>
        </Card>
        <Card
          key={"secondary"}
          size="small"
          title={"secondary"}
          style={{ marginBottom: 16 }}
        >
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12} md={6}>
              <Form.Item
                label="Background"
                name={["components", "button", "secondary", "background"]}
              >
                <SafeColorPicker
                  style={{ padding: 10 }}
                  showText
                  format="hex"
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Form.Item
                label="Text Color"
                name={["components", "button", "secondary", "textColor"]}
              >
                <SafeColorPicker
                  style={{ padding: 10 }}
                  showText
                  format="hex"
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Form.Item
                label="Border"
                name={["components", "button", "secondary", "border"]}
              >
                <Input placeholder="1px solid #000" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Form.Item
                label="Border Radius"
                name={["components", "button", "secondary", "borderRadius"]}
              >
                <Input placeholder="8px" />
              </Form.Item>
            </Col>
          </Row>
        </Card>
        <Card
          key={"disabled"}
          size="small"
          title={"disabled"}
          style={{ marginBottom: 16 }}
        >
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12} md={6}>
              <Form.Item
                label="Background"
                name={["components", "button", "disabled", "background"]}
              >
                <SafeColorPicker
                  style={{ padding: 10 }}
                  showText
                  format="hex"
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Form.Item
                label="Text Color"
                name={["components", "button", "disabled", "textColor"]}
              >
                <SafeColorPicker
                  style={{ padding: 10 }}
                  showText
                  format="hex"
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Form.Item
                label="Border"
                name={["components", "button", "disabled", "border"]}
              >
                <Input placeholder="1px solid #000" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Form.Item
                label="Border Radius"
                name={["components", "button", "disabled", "borderRadius"]}
              >
                <Input placeholder="8px" />
              </Form.Item>
            </Col>
          </Row>
        </Card>
      </Col>

      <Col span={24}>
        <Divider />
        <h3>Input Components</h3>
        <Card size="small">
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12} md={6}>
              <Form.Item
                label="Background"
                name={["components", "input", "background"]}
              >
                <SafeColorPicker
                  style={{ padding: 10 }}
                  showText
                  format="hex"
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Form.Item
                label="Text Color"
                name={["components", "input", "textColor"]}
              >
                <SafeColorPicker
                  style={{ padding: 10 }}
                  showText
                  format="hex"
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Form.Item
                label="Border"
                name={["components", "input", "border"]}
              >
                <Input placeholder="1px solid #d9d9d9" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Form.Item
                label="Focus Border"
                name={["components", "input", "focusBorder"]}
              >
                <Input placeholder="1px solid #1d1060" />
              </Form.Item>
            </Col>
          </Row>
        </Card>
      </Col>

      <Col span={24}>
        <Divider />
        <h3>Card Components</h3>
        <Card size="small">
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12} md={6}>
              <Form.Item
                label="Background"
                name={["components", "card", "background"]}
              >
                <SafeColorPicker
                  style={{ padding: 10 }}
                  showText
                  format="hex"
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Form.Item label="Border" name={["components", "card", "border"]}>
                <Input placeholder="1px solid #d9d9d9" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Form.Item
                label="Border Radius"
                name={["components", "card", "borderRadius"]}
              >
                <Input placeholder="8px" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Form.Item label="Shadow" name={["components", "card", "shadow"]}>
                <Input placeholder="0px 3px 6px rgba(0, 0, 0, 0.16)" />
              </Form.Item>
            </Col>
          </Row>
        </Card>
      </Col>
    </Row>
  );

  const PreviewSection = () => (
    <Row gutter={[16, 16]}>
      <Col span={24}>
        <h3>Theme Preview</h3>
        <Paragraph>
          Preview how your theme changes will look across different components.
        </Paragraph>
      </Col>

      <Col xs={24} md={12}>
        <Card title="Buttons Preview" size="small">
          <Space direction="vertical" style={{ width: "100%" }}>
            <Button
              type="primary"
              style={{
                backgroundColor:
                  customTheme.components?.button?.primary?.background ||
                  customTheme.colors?.primary ||
                  "#1890ff",
                color:
                  customTheme.components?.button?.primary?.textColor ||
                  "#ffffff",
                border:
                  customTheme.components?.button?.primary?.border || "none",
                borderRadius:
                  customTheme.components?.button?.primary?.borderRadius ||
                  "6px",
              }}
            >
              Primary Button
            </Button>
            <Button
              style={{
                backgroundColor:
                  customTheme.components?.button?.secondary?.background ||
                  customTheme.colors?.secondary ||
                  "#f5f5f5",
                color:
                  customTheme.components?.button?.secondary?.textColor ||
                  customTheme.colors?.text ||
                  "#000000",
                border:
                  customTheme.components?.button?.secondary?.border ||
                  "1px solid #d9d9d9",
                borderRadius:
                  customTheme.components?.button?.secondary?.borderRadius ||
                  "6px",
              }}
            >
              Secondary Button
            </Button>
            <Button
              disabled
              style={{
                backgroundColor:
                  customTheme.components?.button?.disabled?.background ||
                  "#f5f5f5",
                color:
                  customTheme.components?.button?.disabled?.textColor ||
                  "#cccccc",
                border:
                  customTheme.components?.button?.disabled?.border ||
                  "1px solid #d9d9d9",
                borderRadius:
                  customTheme.components?.button?.disabled?.borderRadius ||
                  "6px",
              }}
            >
              Disabled Button
            </Button>
          </Space>
        </Card>
      </Col>

      <Col xs={24} md={12}>
        <Card title="Typography Preview" size="small">
          <Space direction="vertical" style={{ width: "100%" }}>
            <h1
              style={{
                color: customTheme.colors?.text || "#000000",
                fontSize:
                  customTheme.typography?.headings?.h1?.fontSize || "2rem",
                fontWeight:
                  customTheme.typography?.headings?.h1?.fontWeight || 600,
                lineHeight:
                  customTheme.typography?.headings?.h1?.lineHeight || 1.2,
                margin: 0,
              }}
            >
              Heading 1
            </h1>
            <h2
              style={{
                color: customTheme.colors?.text || "#000000",
                fontSize:
                  customTheme.typography?.headings?.h2?.fontSize || "1.75rem",
                fontWeight:
                  customTheme.typography?.headings?.h2?.fontWeight || 600,
                lineHeight:
                  customTheme.typography?.headings?.h2?.lineHeight || 1.3,
                margin: 0,
              }}
            >
              Heading 2
            </h2>
            <Paragraph
              style={{
                color: customTheme.colors?.textSecondary || "#666666",
                margin: 0,
              }}
            >
              This is body text with secondary color.
            </Paragraph>
            <Text style={{ color: customTheme.colors?.textMuted || "#999999" }}>
              This is muted text.
            </Text>
          </Space>
        </Card>
      </Col>

      <Col xs={24} md={12}>
        <Card title="Form Elements Preview" size="small">
          <Space direction="vertical" style={{ width: "100%" }}>
            <Input
              placeholder="Input field"
              style={{
                backgroundColor:
                  customTheme.components?.input?.background || "#ffffff",
                color:
                  customTheme.components?.input?.textColor ||
                  customTheme.colors?.text ||
                  "#000000",
                border:
                  customTheme.components?.input?.border || "1px solid #d9d9d9",
                borderRadius:
                  customTheme.components?.input?.borderRadius || "6px",
              }}
            />
            <Select
              placeholder="Select option"
              style={{ width: "100%" }}
              options={[
                { value: "option1", label: "Option 1" },
                { value: "option2", label: "Option 2" },
              ]}
            />
          </Space>
        </Card>
      </Col>

      <Col xs={24} md={12}>
        <Card
          title="Card Preview"
          size="small"
          style={{
            backgroundColor:
              customTheme.components?.card?.background ||
              customTheme.colors?.surface ||
              "#ffffff",
            border: customTheme.components?.card?.border || "1px solid #d9d9d9",
            borderRadius: customTheme.components?.card?.borderRadius || "8px",
            boxShadow:
              customTheme.components?.card?.shadow ||
              customTheme.shadows?.medium ||
              "0 2px 8px rgba(0,0,0,0.15)",
          }}
        >
          <Paragraph
            style={{ color: customTheme.colors?.text || "#000000", margin: 0 }}
          >
            This is how cards will look with your theme settings.
          </Paragraph>
        </Card>
      </Col>
    </Row>
  );

  return (
    <div
      style={{
        padding: "24px",
        backgroundColor: theme.colors.background,
        minHeight: "100vh",
      }}
    >
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Card>
            <Row justify="space-between" align="middle">
              <Col>
                <h2 style={{ margin: 0, color: theme.colors.text }}>
                  {language === LANGUAGE.ENGLISH_INT
                    ? "Theme Editor"
                    : "محرر السمات"}
                </h2>
                <Text type="secondary">
                  {language === LANGUAGE.ENGLISH_INT
                    ? "Customize your application theme colors, typography, and components"
                    : "خصص ألوان السمة والطباعة والمكونات الخاصة بتطبيقك"}
                </Text>
              </Col>
              <Col>
                <Space>
                  <Switch
                    checkedChildren={<EyeOutlined />}
                    unCheckedChildren={<EyeOutlined />}
                    checked={previewMode}
                    onChange={setPreviewMode}
                  />
                  <Upload
                    accept=".json"
                    beforeUpload={importTheme}
                    showUploadList={false}
                  >
                    <Button icon={<ImportOutlined />}>
                      {language === LANGUAGE.ENGLISH_INT ? "Import" : "استيراد"}
                    </Button>
                  </Upload>
                  <Button icon={<ExportOutlined />} onClick={exportTheme}>
                    {language === LANGUAGE.ENGLISH_INT ? "Export" : "تصدير"}
                  </Button>
                  <Button icon={<ReloadOutlined />} onClick={resetTheme}>
                    {language === LANGUAGE.ENGLISH_INT
                      ? "Reset"
                      : "إعادة تعيين"}
                  </Button>
                  <Button
                    type="primary"
                    icon={<SaveOutlined />}
                    onClick={applyTheme}
                    disabled={
                      !isModified && selectedBaseTheme === currentThemeName
                    }
                  >
                    {isModified
                      ? language === LANGUAGE.ENGLISH_INT
                        ? "Save Custom Theme"
                        : "حفظ السمة المخصصة"
                      : language === LANGUAGE.ENGLISH_INT
                      ? "Apply Theme"
                      : "تطبيق السمة"}
                  </Button>
                </Space>
              </Col>
            </Row>
          </Card>
        </Col>

        <Col span={24}>
          <Card>
            <ThemeSelector />
            <Form
              form={form}
              layout="vertical"
              onValuesChange={handleFormChange}
              initialValues={theme}
            >
              <Tabs activeKey={activeTab} onChange={setActiveTab}>
                <TabPane
                  tab={
                    <span>
                      <BgColorsOutlined />
                      {language === LANGUAGE.ENGLISH_INT ? "Colors" : "الألوان"}
                    </span>
                  }
                  key="colors"
                >
                  <ColorSection />
                </TabPane>

                <TabPane
                  tab={
                    <span>
                      <FontSizeOutlined />
                      {language === LANGUAGE.ENGLISH_INT
                        ? "Typography"
                        : "الطباعة"}
                    </span>
                  }
                  key="typography"
                >
                  <TypographySection />
                </TabPane>

                <TabPane
                  tab={
                    <span>
                      <LayoutOutlined />
                      {language === LANGUAGE.ENGLISH_INT
                        ? "Spacing & Layout"
                        : "التباعد والتخطيط"}
                    </span>
                  }
                  key="spacing"
                >
                  <SpacingSection />
                </TabPane>

                <TabPane
                  tab={
                    <span>
                      <SettingOutlined />
                      {language === LANGUAGE.ENGLISH_INT
                        ? "Components"
                        : "المكونات"}
                    </span>
                  }
                  key="components"
                >
                  <ComponentsSection />
                </TabPane>

                <TabPane
                  tab={
                    <span>
                      <EyeOutlined />
                      {language === LANGUAGE.ENGLISH_INT ? "Preview" : "معاينة"}
                    </span>
                  }
                  key="preview"
                >
                  <PreviewSection />
                </TabPane>
              </Tabs>
            </Form>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default ThemeEditor;
