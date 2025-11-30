import { getInboundReceivingEntities } from "@/components/shared/outbound/service";
import SelectComponent from "@/components/ui/form/select";
import { useLanguage } from "@/context/language";
import React, { useEffect } from "react";

type Props = {
  onChange?: (value: number) => void;
  value?: number;
  disabled?: boolean;
};
const InboundReceivingEntity = ({ onChange, value, disabled }: Props) => {
  const { labels } = useLanguage();
  const [sendingEntities, setSendingEntities] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState<boolean>(false);

  const fetchReceivingEntities = async () => {
    if (loading) return;
    try {
      setLoading(true);
      const entities = await getInboundReceivingEntities();
      if (entities) {
        setSendingEntities(entities);
      }
    } catch (error) {
      console.error("Error fetching sending entities:", error);
      setSendingEntities([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReceivingEntities();
  }, []);
  const options = sendingEntities?.map((entity) => ({
    label: entity.name_en,
    value: entity.id,
  }));
  return (
    <SelectComponent
      showDefaultValueIfOneOption
      disabled={disabled}
      loading={loading}
      allowClear
      label={labels.lbl.receiving_entity}
      options={options}
      onChange={(val) => {
        if (onChange) {
          // Ensure val is a number before passing it to onChange
          onChange(val);
        }
      }}
      value={value}
    />
  );
};

export default InboundReceivingEntity;
