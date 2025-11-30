import { useLanguage } from "@/context/language";
import React, { useEffect } from "react";
import { getOutboundTemplates, OutboundTemplateType } from "../service";
import SelectComponent from "@/components/ui/form/select";
type Props = {
  onChange: (value: number) => void;
  value?: number | null;
  entityId: number;
};
const OutboundTemplatesSelect = ({ onChange, value, entityId }: Props) => {
  const { labels } = useLanguage();
  const [templates, setTemplates] = React.useState<OutboundTemplateType[]>([]);
  const [loading, setLoading] = React.useState<boolean>(false);
  const fetchTemplates = async () => {
    try {
      setLoading(true);
      const data = await getOutboundTemplates(entityId);
      setTemplates(data || []);
    } catch (error) {
      console.error("Error fetching templates:", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (!entityId) return;
    fetchTemplates();
  }, [entityId]);
  const options =
    templates?.map((template) => ({
      value: template.id,
      label: template.template_name,
    })) || [];

  return (
    <SelectComponent
      disabled={!entityId}
      label={labels.lbl.template_name}
      options={options}
      spinning={loading}
      onChange={(val) => {
        onChange(val as number);
      }}
      value={value}
    />
  );
};

export default OutboundTemplatesSelect;
