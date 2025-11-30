import { useState } from "react";
import {
  OrgUnitType,
  OUSearchModelType,
} from "../../../../services/organization-units/type";
import { useLanguage } from "../../../../../context/language";
import { Col, Modal, Typography } from "antd";
import { FilterFilled, SearchOutlined, TableOutlined } from "@ant-design/icons";
import TitleHeader from "../../../../ui/header";
import OrgUnitSearchForm from "../search";
import SearchOrgUnitTable from "../table";
type Props = {
  visible: boolean;
  onClose: () => void;
  multiSelect: boolean;
  orgs: OrgUnitType[];
  onSelectOrgUnits: (orgs: number[]) => void;
  selectedOrgUnits: number[];
  label?: string;
};
const SearchOrgUnitModal = ({
  visible,
  onClose,
  multiSelect,
  orgs,
  onSelectOrgUnits,
  selectedOrgUnits = [],
  label,
}: Props) => {
  const { labels } = useLanguage();
  const [filteredOrgUnits, setFilteredOrgUnits] = useState<OrgUnitType[]>(orgs);

  const onSearchOrgUnits = ({
    entity_desc_en = "",
    entity_email = "",
    entity_code = "",
  }: OUSearchModelType) => {
    console.log({
      entity_desc_en,
      entity_email,
      entity_code,
    });

    const filteredOrgUnits = orgs.filter(
      (orgUnit) =>
        (orgUnit.name_ar
          .toLowerCase()
          .includes(entity_desc_en.toLowerCase() || "") ||
          orgUnit.name_en
            .toLowerCase()
            .includes(entity_desc_en.toLowerCase() || "")) &&
        orgUnit.entity_code
          .toLowerCase()
          .includes(entity_code.toLowerCase() || "") &&
        orgUnit.email.toLowerCase().includes(entity_email.toLowerCase() || "")
    );
    setFilteredOrgUnits(filteredOrgUnits);
  };

  // const onResetSearch = () => {
  //   setFilteredOrgUnits(orgs);
  // };
  return (
    <>
      <Modal
        afterClose={() => onClose()}
        open={visible}
        onCancel={() => onClose()}
        width={900}
        height={"90%"}
        title={
          <Typography>
            <SearchOutlined style={{ marginInline: 10 }} />
            {label}
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
        <Col>
          <OrgUnitSearchForm
            onSubmit={onSearchOrgUnits}
            // onResetSearch={onResetSearch}
          />
        </Col>
        <TitleHeader
          applyReverse={false}
          heading={labels.til.search_result}
          icon={<TableOutlined style={{ color: "#fff" }} />}
        />

        <SearchOrgUnitTable
          selectedOrgUnits={selectedOrgUnits}
          orgUnitData={filteredOrgUnits}
          onClose={onClose}
          onSelectOrgUnits={(ids: number[]) => {
            onSelectOrgUnits(ids);
          }}
          multiSelect={multiSelect}
        />
      </Modal>
    </>
  );
};

export default SearchOrgUnitModal;
