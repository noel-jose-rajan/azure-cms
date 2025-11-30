import SelectComponent from "@/components/ui/form/select";
import { useLanguage } from "@/context/language";
import { SearchOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import RelatedCorrespondenceModal from "./components/modal";
import useGetRelatedCorr from "./hooks/use-get-related-corr";
import { RelatedCorr } from "@/components/services/outbound/types";

type Props = {
  onChange: (value: RelatedCorr[]) => void;
  value: RelatedCorr[];
  loading?: boolean;
  corrId?: string | number;
};
const RelatedCorrSelect = ({ onChange, value, loading, corrId }: Props) => {
  const { labels } = useLanguage();
  const [showModal, setShowModal] = useState<boolean>(false);

  const handleShowModal = (bool: boolean) => {
    setShowModal(bool);
  };

  const { relatedCorrs, loading: relatedCorrLoading } = useGetRelatedCorr(
    corrId || ""
  );
  useEffect(() => {
    if (corrId && relatedCorrs && relatedCorrs?.length > 0) {
      onChange(relatedCorrs);
    }
  }, [corrId, relatedCorrs]);

  const values = value.map((item) => item?.id);
  const data = value?.map((item) => ({
    label: item.correspondence_no,
    value: item.id,
  }));

  return (
    <>
      <SelectComponent
        key={Math.random()}
        spinning={loading || relatedCorrLoading}
        label={labels.lbl.related_ref_num}
        defaultValue={value}
        value={values}
        onChange={(newValue) => {
          const filtered = value.filter((v) => newValue?.includes(v.id));
          onChange(filtered);
        }}
        options={data}
        dropdownStyle={{ maxHeight: 0, padding: 0 }}
        mode={"multiple"}
        listHeight={0}
        Icon={<SearchOutlined onClick={() => handleShowModal(true)} />}
      />

      {showModal && (
        <RelatedCorrespondenceModal
          onSelect={(selectedRowKeys) => {
            console.log({ selectedRowKeys });

            onChange(selectedRowKeys);
          }}
          onClose={() => handleShowModal(false)}
          selectedCorrs={Array.isArray(value) ? value : [value]}
        />
      )}
    </>
  );
};

export default RelatedCorrSelect;
