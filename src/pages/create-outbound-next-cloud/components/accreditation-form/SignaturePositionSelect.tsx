import { FormControl } from "@mui/material";
import { useLanguage } from "../../../../context/language";
import { MaterialSelect } from "../../../../components/ui/dropdown/material-dropdown";

interface Props {
  value: number | string;
  onChange: (value: string) => any;
}

const SIGNATURE_POSITIONS = {
  en: [
    { id: 1, position: "Top Right" },
    { id: 2, position: "Top Middle" },
    { id: 3, position: "Top Left" },
    { id: 4, position: "Bottom Right" },
    { id: 5, position: "Bottom Middle" },
    { id: 6, position: "Bottom Left" },
  ],
  ar: [
    { id: 1, position: "أعلى اليمين" }, // Top Right
    { id: 2, position: "أعلى الوسط" }, // Top Middle
    { id: 3, position: "أعلى اليسار" }, // Top Left
    { id: 4, position: "أسفل اليمين" }, // Bottom Right
    { id: 5, position: "أسفل الوسط" }, // Bottom Middle
    { id: 6, position: "أسفل اليسار" }, // Bottom Left
  ],
};

export default function SignaturePositionSelect({ value, onChange }: Props) {
  const { labels, isEnglish } = useLanguage();

  const handleSelect = (val: string) => {
    onChange(val);
  };

  return (
    <FormControl fullWidth margin="normal">
      <MaterialSelect
        label={labels.lbl.approve_digital_signature_position}
        onChange={handleSelect}
        value={value ? value + "" : undefined}
        options={
          SIGNATURE_POSITIONS[isEnglish ? "en" : "ar"]?.map((item) => ({
            label: item.position,
            value: item.id + "",
          })) ?? []
        }
      />
    </FormControl>
  );
}
