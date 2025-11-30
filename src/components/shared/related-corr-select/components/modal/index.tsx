import React, { useState } from "react";
import {
  CorrespondenceFilterResult,
  filterCorrespondence,
} from "../../service";
import { useLanguage } from "@/context/language";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  SearchRelatedCorrespondenceSchema,
  SearchRelatedCorrespondenceType,
} from "../../schema.";
import { Modal, Typography } from "antd";
import { FormProvider, useForm } from "react-hook-form";
import TitleHeader from "@/components/ui/header";
import { FilterFilled, SearchOutlined } from "@ant-design/icons";
import RelatedCorrespondenceForm from "../form";
import RelatedCorrTable from "../table";
import useHandleError from "@/components/hooks/useHandleError";
import { RelatedCorr } from "@/components/services/outbound/types";
type Props = {
  onClose: () => void;
  selectedCorrs: RelatedCorr[];
  onSelect: (selectedRowKeys: RelatedCorr[]) => void;
};
const RelatedCorrespondenceModal = ({
  onClose,
  selectedCorrs = [],
  onSelect,
}: Props) => {
  const { labels, isEnglish } = useLanguage();
  const { handleError } = useHandleError();
  const [data, setData] = useState<{
    page: number;
    total: number;
    data: CorrespondenceFilterResult[];
  }>({
    page: 1,
    total: 0,
    data: [],
  });
  const [loading, setLoading] = useState<boolean>(false);

  const methods = useForm<SearchRelatedCorrespondenceType>({
    resolver: zodResolver(SearchRelatedCorrespondenceSchema),
  });
  const { getValues } = methods;

  const handleDataChange = (key: keyof typeof data, value: any) => {
    // Update the specific key in the data state
    setData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };
  const handleFilterCorrespondences = async (page = 1) => {
    try {
      setLoading(true);
      const currentPage = page;
      const body = {
        ...getValues(),
        approved_only: true,
        is_arabic: !isEnglish,
      };
      const res = await filterCorrespondence(body, page);

      if (res) {
        setData({
          page: currentPage,
          total: res.total_records,
          data: res.data,
        });
      }
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      afterClose={() => onClose()}
      open={true}
      onCancel={() => onClose()}
      width={900}
      height={"90%"}
      title={
        <Typography>
          <SearchOutlined style={{ marginLeft: 10, marginRight: 10 }} />
          {labels.lbl.related_ref_num}
        </Typography>
      }
      footer={<></>}
      centered
      style={{ marginBottom: 50 }}
    >
      <TitleHeader
        heading={labels.til.search_criteria}
        applyReverse={false}
        icon={<FilterFilled style={{ color: "#fff" }} />}
      />

      <FormProvider {...methods}>
        <RelatedCorrespondenceForm
          onSearch={() => handleFilterCorrespondences()}
        />
      </FormProvider>
      <RelatedCorrTable
        onClose={onClose}
        selectedCorrs={selectedCorrs}
        loading={loading}
        data={data.data}
        onSelect={(selectedRowKeys) => {
          onSelect(selectedRowKeys);
          onClose();
        }}
        pagination={{
          page: data.page,
          perPage: 10,
        }}
        handlePageChange={(page) => {
          handleDataChange("page", page);
          handleFilterCorrespondences(page);
        }}
        total={data.total}
      />
    </Modal>
  );
};

export default RelatedCorrespondenceModal;
