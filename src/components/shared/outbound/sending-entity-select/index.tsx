import SelectComponent from "@/components/ui/form/select";
import { useLanguage } from "@/context/language";
import { useEffect, useState } from "react";
import { getSendingEntities, SendingEntity } from "../service";
type Props = {
  onChange?: (value: number) => void;
  value?: number;
  disabled?: boolean;
};
const OutboundSendingEntitySelect = ({ onChange, value, disabled }: Props) => {
  const { labels, isEnglish } = useLanguage();
  const [sendingEntities, setSendingEntities] = useState<SendingEntity[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchSendingEntities = async () => {
    if (loading) return;
    try {
      setLoading(true);
      const entities = await getSendingEntities();
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
    fetchSendingEntities();
  }, []);
  const options = sendingEntities?.map((entity) => ({
    label: isEnglish ? entity?.name_en : entity?.name_ar,
    value: entity.id,
  }));
  return (
    <SelectComponent
      key={isEnglish + "sending entity select"}
      showDefaultValueIfOneOption
      disabled={disabled}
      loading={loading}
      allowClear
      label={labels.lbl.sending_entity}
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

export default OutboundSendingEntitySelect;
