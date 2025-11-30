import React from "react";
import { Controller, useFormContext } from "react-hook-form";
import { SearchRelatedCorrespondenceType } from "../../schema.";
import { Col, Row } from "antd";
import { MaterialInput } from "@/components/ui/material-input";
import { useLanguage } from "@/context/language";
import ButtonComponent from "@/components/ui/button";
import { ClearOutlined, SearchOutlined } from "@ant-design/icons";

type Props = {
  onSearch: () => Promise<void>;
};
const RelatedCorrespondenceForm = ({ onSearch }: Props) => {
  const { labels } = useLanguage();
  const { control, reset } = useFormContext<SearchRelatedCorrespondenceType>();
  return (
    <Row gutter={10}>
      <Col span={12} style={{ marginTop: 20 }}>
        <Controller
          name="corr_subject"
          control={control}
          render={({ field }) => (
            <MaterialInput
              label={labels.lbl.subject}
              {...field}
              style={{ height: 60 }}
            />
          )}
        />
      </Col>
      <Col span={12} style={{ marginTop: 20 }}>
        <Controller
          name="correspondence_no"
          control={control}
          render={({ field }) => (
            <MaterialInput
              label={labels.lbl.corr_number}
              {...field}
              style={{ height: 60 }}
            />
          )}
        />
      </Col>
      <Col span={24} style={{ marginTop: 20 }}>
        <ButtonComponent
          type="primary"
          buttonLabel={labels.btn.search}
          onClick={onSearch}
          icon={<SearchOutlined />}
          style={{ marginInline: 8 }}
        />
        <ButtonComponent
          buttonLabel={labels.btn.reset}
          onClick={() => reset()}
          icon={<ClearOutlined />}
        />
      </Col>
    </Row>
  );
};

export default RelatedCorrespondenceForm;
