import {
  getOutboundReceivingEntities,
  ReceivingEntity,
} from "@/components/shared/outbound/service";
import SelectComponent from "@/components/ui/form/select";
import { useLanguage } from "@/context/language";
import React, { useEffect } from "react";
type Props = {
  outbound_type: string | number;
  sending_entity: string | number;
  value?: string | number | number[];
  onChange: (value: string | number) => void;
  multiSelect?: boolean;
};
const ReceivingEntitySelect = ({
  outbound_type,
  sending_entity,
  value,
  onChange,
  multiSelect = false,
}: Props) => {
  const [entities, setEntities] = React.useState<ReceivingEntity[]>([]);
  const [loading, setLoading] = React.useState<boolean>(false);
  const { labels, isEnglish } = useLanguage();
  const fetchReceivingEntities = async () => {
    try {
      setLoading(true);
      const res = await getOutboundReceivingEntities(
        outbound_type,
        sending_entity
      );
      setEntities(res || []);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (outbound_type && sending_entity) {
      fetchReceivingEntities();
    }
  }, [outbound_type, sending_entity]);

  const options = entities.map((entity) => ({
    label: isEnglish ? entity.name_en : entity.name_ar,
    value: entity.id,
  }));
  console.log({ value });

  return (
    <SelectComponent
      mode={multiSelect ? "multiple" : undefined}
      label={labels.lbl.receiving_entity}
      options={options}
      spinning={loading}
      onChange={(value) => {
        onChange(value);
      }}
      value={value}
    />
  );
};

export default ReceivingEntitySelect;
