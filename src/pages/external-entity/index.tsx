import { useLanguage } from "../../context/language";
import TitleBar from "../../components/ui/bar/title-bar";
import TitleHeader from "../../components/ui/header";
import { useEffect, useState } from "react";
import ExternalEntityListTable from "./components/entity-table";
import { SearchOutlined, TableOutlined } from "@ant-design/icons";
import SearchAndFilter from "./components/search-and-filter";
import useExternalEntities from "@/store/external-entities/use-external-entities";
import { type ExternalEntity } from "./service";

export default function ExternalEntity() {
  const { labels } = useLanguage();
  const { entites: externalEntities } = useExternalEntities();
  const [filteredExternalEntities, setFilteredExternalEntities] = useState<
    ExternalEntity[]
  >([]);

  useEffect(() => {
    if (externalEntities) {
      setFilteredExternalEntities(externalEntities);
    }
  }, [externalEntities]);

  return (
    <>
      <TitleBar
        title={{
          en: labels.lbl.external_entity,
          ar: labels.lbl.external_entity,
        }}
      />
      <TitleHeader
        heading={labels.til.ext_ent_search_criteria}
        icon={<SearchOutlined style={{ color: "#fff" }} />}
      />
      <SearchAndFilter
        setFilteredExternalEntities={setFilteredExternalEntities}
      />
      <div style={{ padding: 10 }}>
        <TitleHeader
          heading={labels.mnu.external_entity}
          icon={<TableOutlined style={{ color: "#fff" }} />}
        />
        <ExternalEntityListTable entityItems={filteredExternalEntities} />
      </div>
    </>
  );
}
