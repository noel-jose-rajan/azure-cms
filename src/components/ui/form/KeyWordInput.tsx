import React, { CSSProperties, useState } from "react";
import { Chip, IconButton, Tooltip } from "@mui/material";
import { DeleteFilled, InfoCircleOutlined } from "@ant-design/icons";
import { useLanguage } from "../../../context/language";
import { Input } from "antd";
import { useTheme } from "@/context/theme";

interface Props {
  values: string[];
  handleValuesChange: (value: any) => any;
  NotAllowedClearData?: string[];
}

const KeywordInput: React.FC<Props> = ({
  values,
  handleValuesChange,
  NotAllowedClearData = [],
}) => {
  const { labels, isEnglish } = useLanguage();
  const { theme } = useTheme();
  const [focused, setFocused] = useState(false);
  const [input, setInput] = useState<string>("");

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInput(event.target.value); // Update the input as user types
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (
      event.key === "Enter" &&
      input.trim() &&
      !values?.includes(input.trim())
    ) {
      handleValuesChange([...(values ?? []), input.trim()]);
      setInput(""); // Clear input field after adding keyword
    }
  };

  const handleDeleteKeyword = (keywordToDelete: string) => {
    const newKeywords = (values ?? []).filter(
      (keyword) => keyword !== keywordToDelete
    );

    handleValuesChange(newKeywords);
  };
  const hasValue = (values && values.length > 0) || Boolean(input);
  const labelStyles: CSSProperties = {
    position: "absolute",
    top: focused || hasValue ? "-0" : "50%",
    transform: focused || hasValue ? "translateY(0)" : "translateY(-50%)",
    fontSize: focused || hasValue ? "12px" : "16px",
    color: focused ? theme.colors.primary : "grey",
    transition: "all 0.3s ease",
    pointerEvents: "none",
  };

  const wrapperStyles: CSSProperties = {
    position: "relative",
    width: "100%",
    borderBottom: `1px solid ${theme.colors.success}`,
    // marginTop: 8,
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
    if (focused) return theme.colors.success;
    return "grey";
  };

  return (
    <div
      style={{
        position: "relative",
        display: "flex",
        flexWrap: "wrap",
        alignItems: "center",
        justifyContent: isEnglish ? "flex-end" : "flex-start",
        gap: 1,
      }}
    >
      <>
        <div style={wrapperStyles}>
          <label
            style={{
              ...labelStyles,
              color: getColor(),
              ...(isEnglish ? { left: "8px" } : { right: "8px" }),
            }}
          >
            {labels.lbl.keywords}
          </label>

          <div
            style={{
              display: "inline-flex",
              justifyContent: "start",
              flexWrap: "wrap",
              gap: 1,
              minHeight: 45,
              flexDirection: "row",
              paddingBottom: 4,
              paddingTop: 16,
              paddingRight: !isEnglish ? 0 : 24,
              paddingLeft: !isEnglish ? 24 : 0,
            }}
          >
            {values?.map((keyword, index) => {
              const deletable = !NotAllowedClearData?.includes(keyword);
              return (
                <Chip
                  key={index}
                  label={keyword}
                  size="small"
                  deleteIcon={deletable ? <DeleteFilled /> : <></>}
                  onDelete={() => deletable && handleDeleteKeyword(keyword)}
                  sx={{
                    paddingInline: "12px",
                    margin: "2px",
                  }}
                />
              );
            })}

            <Input
              onFocus={() => setFocused(true)}
              autoComplete="off"
              onBlur={() => {
                setFocused(false);
              }}
              value={input}
              style={{
                padding: "8px 10px",
                border: "none",
                borderRadius: "0",
                outline: "none",
                transition: "border-color 0.3s ease",
                boxShadow: "none",
                flexBasis: "100px",
                flexGrow: 1,
              }}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              variant="borderless"
            />
          </div>
          <div
            style={{
              ...underlineStyles,
              backgroundColor: "#0F9D58",
            }}
          ></div>

          <Tooltip title={labels.msg.hint_keywords} arrow>
            <IconButton
              size="small"
              sx={{
                position: "absolute",
                right: isEnglish ? 2 : "unset",
                left: !isEnglish ? 2 : "unset",
                top: "50%",
                transform: "translateY(-50%)",
              }}
            >
              <InfoCircleOutlined />
            </IconButton>
          </Tooltip>
        </div>
      </>
    </div>
  );
};

export default KeywordInput;
