import { FormControl, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useLanguage } from "../../../../context/language";
import { MaterialSelect } from "../../../../components/ui/dropdown/material-dropdown";
import { getOrgTemplates } from "../../service/get-org-templates";
import { Button, Col, Row } from "antd";
import { DownloadOutlined, UploadOutlined } from "@ant-design/icons";

interface Template {
  outboundTemplateId: number;
  outboundTemplateName: string;
  outboundFileName: string;
  links: unknown[];
}

interface Props {
  orgUnitCode?: string;
  onChange?: (unit: Template) => any;
  onSelect?: (templateId: number) => any;
}

export default function SelectTemplate({
  orgUnitCode,
  onChange,
  onSelect,
}: Props) {
  const { labels } = useLanguage();

  const [templates, setTemplates] = useState<Template[] | undefined>(undefined);
  // const [loading, setLoading] = useState<boolean>(true);
  const [error, _setError] = useState<string | null>(null);

  const [value, setvalue] = useState<Template | undefined>();

  useEffect(() => {
    if (orgUnitCode) {
      getOrgTemplates(orgUnitCode).then(
        (template) => template && setTemplates(() => template)
      );
    }
  }, []);

  const handleValuesChange = (outboundTemplateId: number | string) => {
    const selected = templates?.find(
      (f) => f.outboundTemplateId === outboundTemplateId
    );
    onChange && selected && onChange(selected);
    selected && setvalue(selected);
  };

  if (error) {
    return (
      <FormControl fullWidth margin="normal">
        <Typography color="error" variant="body2">
          {error}
        </Typography>
      </FormControl>
    );
  }

  return (
    <>
      <Col>
        <Row>
          <FormControl fullWidth margin="normal">
            <MaterialSelect
              // @ts-ignore
              value={value?.outboundTemplateId}
              label={labels.lbl.template}
              onChange={(val) => handleValuesChange(val)}
              // @ts-ignore
              options={
                templates?.map((item) => ({
                  label: item.outboundTemplateName,
                  value: item.outboundTemplateId,
                })) ?? []
              }
            />
          </FormControl>
        </Row>
        <Row>
          <Button
            icon={<UploadOutlined />}
            onClick={() =>
              onSelect && value && onSelect(value?.outboundTemplateId)
            }
          >
            {labels.btn.download_template}
          </Button>
          &nbsp;
          <Button icon={<DownloadOutlined />}>{labels.btn.download}</Button>
        </Row>
      </Col>
    </>
  );
}
