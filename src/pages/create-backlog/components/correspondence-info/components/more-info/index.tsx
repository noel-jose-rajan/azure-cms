import { Col, Form } from "antd";
import { ChangeEvent } from "react";
import { Control, Controller } from "react-hook-form";
import { MaterialTextArea } from "../../../../../../components/ui/text-area";
import { useLanguage } from "../../../../../../context/language";
import { CorrespondenceType } from "../../../../types";

interface MoreInfoProps {
  control: Control<CorrespondenceType>;
}

export default function MoreInfo({ control }: MoreInfoProps) {
  const { labels } = useLanguage();

  return (
    <>
      <Form name="basic-info" layout="vertical">
        <Col style={{ marginTop: 20 }}>
          <Controller
            name="correspondenceDTO.remarks"
            control={control}
            render={({ field }) => (
              <MaterialTextArea
                label={labels.lbl.remarks}
                {...field}
                onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
                  field.onChange(e.target.value ? [e.target.value] : [])
                }
              />
            )}
          />
        </Col>
      </Form>
    </>
  );
}
