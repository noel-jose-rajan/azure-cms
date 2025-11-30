import { Col } from "antd";
import { useLanguage } from "../../../../context/language";
import {
  Control,
  Controller,
  UseFormSetValue,
  useWatch,
} from "react-hook-form";
import { CorrespondenceType } from "../../types";
import { MaterialSelect } from "../../../../components/ui/dropdown/material-dropdown";
import CorrespondenceInfo from "../correspondence-info";
import IndexInfoTabs from "../index-info";

interface CorrespondenceInfoProps {
  control: Control<CorrespondenceType>;
  setValue: UseFormSetValue<CorrespondenceType>;
}

export default function DocumentMetaDataInfo({
  control,
  setValue,
}: CorrespondenceInfoProps) {
  const { labels } = useLanguage();
  const { correspondenceDTO } = useWatch({ control: control });

  return (
    <>
      <Col
        style={{
          paddingLeft: 10,
          paddingRight: 60,
          marginBottom: 20,
          marginTop: 20,
        }}
      >
        <Controller
          name="correspondenceDTO.backlogNodeType"
          control={control}
          render={({ field }) => (
            <MaterialSelect
              label={labels.lbl.document_type + " *"}
              options={[
                {
                  label: "Correspondence",
                  value: "correspondence",
                },
                {
                  label: "Contract",
                  value: "contract",
                },
                {
                  label: "Mom",
                  value: "mom",
                },
                {
                  label: "Memo",
                  value: "memo",
                },
              ]}
              value={field.value}
              onChange={(value: string) => {
                field.onChange(value);
              }}
              style={{
                height: 45,
              }}
            />
          )}
        />
      </Col>
      {correspondenceDTO?.backlogNodeType === "correspondence" ? (
        <CorrespondenceInfo control={control} setValue={setValue} />
      ) : correspondenceDTO?.backlogNodeType === "contract" ||
        correspondenceDTO?.backlogNodeType === "mom" ||
        correspondenceDTO?.backlogNodeType === "memo" ? (
        <IndexInfoTabs control={control} setValue={setValue} />
      ) : null}
    </>
  );
}
