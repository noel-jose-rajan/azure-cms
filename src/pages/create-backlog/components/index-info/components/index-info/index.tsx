import { Col, Form } from "antd";
import { MaterialInput } from "../../../../../../components/ui/material-input";
import { useLanguage } from "../../../../../../context/language";
import { Control, Controller, UseFormSetValue } from "react-hook-form";
import { CorrespondenceType } from "../../../../types";
import { TextField } from "@mui/material";
import { DateHelper } from "../../../../../../components/functional/date";
import { MaterialSelect } from "../../../../../../components/ui/dropdown/material-dropdown";

interface CorrespondenceInfoProps {
  control: Control<CorrespondenceType>;
  setValue: UseFormSetValue<CorrespondenceType>;
}

export default function IndexInfo({ control }: CorrespondenceInfoProps) {
  const { isEnglish } = useLanguage();

  const fileTypes = [
    {
      label: "1. Contract",
      value: "1. Contract",
    },
    {
      label: "2. Tender",
      value: "2. Tender",
    },
    {
      label: "3. Practices",
      value: "3. Practices",
    },
  ];

  const indexLabels = {
    documentTitle: isEnglish ? "Document Title" : "عنوان الوثيقة",
    archiveNumber: isEnglish ? "Archive Number" : "رقم الأرشيف",
    tradingId: isEnglish ? "Trading Id" : "معرف التداول",
    fileType: isEnglish ? "File Type" : "نوع الملف",
    fileDate: isEnglish ? "File Date" : "تاريخ ملف",
  };

  return (
    <>
      <Form name="basic-info" layout="vertical">
        <Col style={{ marginTop: 20 }}>
          <Controller
            name="correspondenceDTO.document_title"
            control={control}
            render={({ field }) => (
              <MaterialInput label={indexLabels.documentTitle} {...field} />
            )}
          />
        </Col>
        <Col style={{ marginTop: 20 }}>
          <Controller
            name="correspondenceDTO.archieve_number"
            control={control}
            render={({ field }) => (
              <MaterialInput label={indexLabels.archiveNumber} {...field} />
            )}
          />
        </Col>
        <Col style={{ marginTop: 20 }}>
          <Controller
            name="correspondenceDTO.trading_id"
            control={control}
            render={({ field }) => (
              <MaterialInput label={indexLabels.tradingId} {...field} />
            )}
          />
        </Col>
        <Col style={{ marginTop: 20 }}>
          <Controller
            name="correspondenceDTO.file_type"
            control={control}
            render={({ field }) => (
              <MaterialSelect
                label={indexLabels.fileType}
                options={fileTypes}
                {...field}
                onChange={(value: string) => {
                  field.onChange(value);
                }}
                style={{ height: 45, marginBottom: 20 }}
              />
            )}
          />
        </Col>
        <Col style={{ marginTop: 12 }} className="correspondence-date">
          <Controller
            name="correspondenceDTO.file_date"
            control={control}
            render={({ field }) => (
              <TextField
                margin="normal"
                variant="standard"
                fullWidth
                type="date"
                label={indexLabels.fileDate}
                InputLabelProps={{ shrink: true }}
                value={DateHelper.swapFormat(field.value, true)}
                onChange={(e) => {
                  console.log("the onchange vale", e.target.value);
                  field.onChange(DateHelper.swapFormat(e.target.value, false));
                }}
              />
            )}
          />
        </Col>
      </Form>
    </>
  );
}
