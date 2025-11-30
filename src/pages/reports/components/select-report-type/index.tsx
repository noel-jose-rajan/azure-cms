import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { Row } from "antd";
import { useLanguage } from "../../../../context/language";
import { useState } from "react";

interface Props {
  options: { value: string; key: string }[];
  onSelect?: (value: string) => any;
  value?: string;
}

export default function SelectReportType({ options, value, onSelect }: Props) {
  const { labels } = useLanguage();
  const [selected, setSelected] = useState<string | undefined>(
    value ?? undefined
  );

  const handleChange = (value: string) => {
    setSelected(() => value);
    onSelect && onSelect(value);
  };

  return (
    <Row gutter={30}>
      <FormControl fullWidth margin="normal">
        <InputLabel>{labels.lbl.report_name}</InputLabel>
        <Select
          variant="standard"
          value={selected}
          onChange={(e) => handleChange(e.target.value as string)}
        >
          <MenuItem value={selected}>--</MenuItem>

          {options.map((option, index) => (
            <MenuItem key={index} value={option.value}>
              {option.key}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Row>
  );
}
