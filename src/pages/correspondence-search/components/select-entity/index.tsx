import SelectExternalEntity from "@/components/shared/select-external-entity";
import SelectOU from "@/components/shared/select-org-units";
import SelectComponent from "@/components/ui/form/select";
import { useLanguage } from "@/context/language";
import { Col, Row } from "antd";
import { useState } from "react";

const SelectEntity = ({
  label,
  value,
  onChange,
}: {
  label: string;
  value?: number;
  onChange: (value: number | number[]) => void;
}) => {
  const {
    labels: { lbl },
  } = useLanguage();
  const [selectedEntity, setSelectedEntity] = useState<
    "org-unit" | "ext-ent"
  >();
  return (
    <Row gutter={10}>
      <Col span={selectedEntity ? 12 : 24}>
        <SelectComponent
          value={selectedEntity}
          label={label}
          options={[
            {
              label: "Organization Unit",
              value: "org-unit",
            },
            {
              label: "External Entity",
              value: "ext-ent",
            },
          ]}
          onChange={(value) =>
            setSelectedEntity(value as "org-unit" | "ext-ent" | undefined)
          }
        />
      </Col>
      {selectedEntity && (
        <Col span={12}>
          {selectedEntity === "ext-ent" ? (
            <SelectExternalEntity
              canClear
              multiSelect={false}
              onChange={onChange}
              value={value}
              label={lbl.external_entity}
            />
          ) : (
            <SelectOU
              canClear
              multiSelect={false}
              onChange={onChange}
              value={value}
              label={lbl.org_unit}
            />
          )}
        </Col>
      )}
    </Row>
  );
};

export default SelectEntity;
