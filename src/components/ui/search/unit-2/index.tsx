import { useEffect, useState, useCallback } from "react";
import { OrganizationUnit } from "./types";
import { Button, Modal, Tag } from "antd";
import { useLanguage } from "../../../../context/language";
import { englishLabels } from "../../../../constants/app-constants/en";
import { arabicLabels } from "../../../../constants/app-constants/ar";
import { useTheme } from "../../../../context/theme";
import SearchBar from "./components/search-bar";
import ResultTable from "./components/result-table";
import MiniSearch from "./components/mini-search";
import { getAllOrgUnit } from "./service";

interface Props {
  value?: OrganizationUnit[];
  onChange?: (orgUnit: OrganizationUnit | OrganizationUnit[]) => void;
  onSelect?: (unit: OrganizationUnit | OrganizationUnit[] | undefined) => any;
  multiple?: boolean;
  label?: string;
  selectorKey?: keyof OrganizationUnit;
}

export default function OrganizationUnitSearch({
  value,
  onSelect,
  onChange,
  multiple = false,
  label,
  selectorKey = "organizationUnitId",
}: Props) {
  // Context
  const { isEnglish } = useLanguage();
  const {
    theme: { colors },
  } = useTheme();

  // States
  const [_search, setSearch] = useState<any>({});
  const [open, setOpen] = useState<boolean>(false);
  const [allOrgUnits, setAllOrgUnits] = useState<OrganizationUnit[]>([]);

  // Computed Labels
  const { btn, til } = isEnglish ? englishLabels : arabicLabels;

  // Handlers
  const handleOnClose = useCallback(() => setOpen(false), []);

  const handleRemove = useCallback(
    (e?: React.MouseEvent<HTMLElement>, removeId?: number | null) => {
      if (Array.isArray(value)) {
        const filtered = value.filter((unit) => unit[selectorKey] !== removeId);

        const oned = Object.entries(filtered).map(
          (i) => i[1].organizationUnitId
        );
        const filteredWithData = allOrgUnits.filter((f) =>
          oned.includes(f.organizationUnitId)
        );
        onChange && onChange(filteredWithData);
      }
      e?.preventDefault();
    },
    [value, onChange, selectorKey]
  );

  useEffect(() => {
    const fetchOrgUnits = async () => {
      const units = await getAllOrgUnit();
      if (units) setAllOrgUnits(units);
    };
    fetchOrgUnits();
  }, []);

  // Render tags for selected values
  const renderTags = () => {
    // @ts-ignore
    return allOrgUnits
      .filter((f) => value?.find((f2) => f2[selectorKey] === f[selectorKey]))
      ?.map((unit) => (
        <Tag
          style={{ margin: "5px" }}
          key={`${unit[selectorKey]}`}
          color={colors.primary}
          closeIcon
          onClose={(e) => handleRemove(e, unit[selectorKey] as number)}
        >
          {isEnglish ? unit.orgUnitDescEn : unit.orgUnitDescAr}
        </Tag>
      ));
  };

  return (
    <>
      {(multiple || (value ?? []).length < 1) && (
        <MiniSearch
          label={label}
          onSelect={(unit) => onSelect && onSelect(unit)}
          onAdvanceSearch={() => setOpen(true)}
          values={value}
        />
      )}
      {renderTags()}

      <Modal
        open={open}
        onCancel={handleOnClose}
        title={til.search_org_unit}
        style={{ maxWidth: "1500px" }}
        width={"90vw"}
        footer={
          multiple
            ? [
                <Button key="ok" type="primary" onClick={handleOnClose}>
                  {btn.ok}
                </Button>,
              ]
            : null
        }
      >
        <SearchBar onSearch={(search) => setSearch(search)} />
        <br />
        <ResultTable
          value={value}
          onRemove={(id) => handleRemove(undefined, id)}
          onSelect={(unit) => {
            onSelect && onSelect(unit);
            !multiple && setOpen(false);
          }}
          searchProps={_search}
          multiple={multiple}
        />
      </Modal>
    </>
  );
}
