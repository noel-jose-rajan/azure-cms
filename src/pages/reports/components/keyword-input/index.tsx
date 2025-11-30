import React, { useState } from "react";
import { TextField, Box, Chip, IconButton, Tooltip } from "@mui/material";
import { InfoCircleOutlined } from "@ant-design/icons";
import { useLanguage } from "../../../../context/language";
import { Col } from "antd";

interface Props {
  values?: string[] | "All";
  handleValuesChange: (value: string[] | "All") => any;
}

const KeywordInput: React.FC<Props> = ({ values, handleValuesChange }) => {
  const { labels } = useLanguage();
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
    if (Array.isArray(values)) {
      const newKeywords = (values ?? []).filter(
        (keyword) => keyword !== keywordToDelete
      );
      handleValuesChange(newKeywords);
    }
  };

  return (
    <Col span={24}>
      <Box
        sx={{
          position: "relative",
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          gap: 1,
        }}
      >
        <TextField
          margin="normal"
          label={labels.lbl.keywords}
          variant="standard"
          value={input}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown} // Add Enter key handler
          fullWidth
          multiline
          minRows={1}
          maxRows={3} // You can adjust the number of rows based on your design
        />
        <Tooltip title={labels.msg.hint_keywords} arrow>
          <IconButton
            sx={{
              position: "absolute",
              right: 8,
              top: "50%",
              transform: "translateY(-50%)",
            }}
          >
            <InfoCircleOutlined />
          </IconButton>
        </Tooltip>
      </Box>
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: 0.5,
          marginTop: "0.4rem",
        }}
      >
        {Array.isArray(values) &&
          values?.map((keyword, index) => (
            <Chip
              key={index}
              label={keyword}
              onDelete={() => handleDeleteKeyword(keyword)}
              size="small"
            />
          ))}
      </Box>
    </Col>
  );
};

export default KeywordInput;
