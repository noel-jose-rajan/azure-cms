import React, { useEffect, useState, useRef } from "react";
import {
  TextField,
  InputAdornment,
  IconButton,
  List,
  ListItem,
} from "@mui/material";
import { SearchOutlined } from "@ant-design/icons"; // Import Search Icon from Ant Design
import { arabicLabels } from "../../../../../../constants/app-constants/ar";
import { englishLabels } from "../../../../../../constants/app-constants/en";
import { useLanguage } from "../../../../../../context/language";
import { OrganizationUnit } from "../../types";
import { searchOrgUnit } from "../../service";

interface Props {
  onAdvanceSearch?: () => any;
  onSelect?: (unit: OrganizationUnit) => any;
  values?: OrganizationUnit | OrganizationUnit[];
  label?: string;
}

const MiniSearch: React.FC<Props> = ({
  onAdvanceSearch,
  onSelect,
  values,
  label,
}) => {
  // context
  const { isEnglish } = useLanguage();

  // states
  const [search, setSearch] = useState("");
  const [list, setList] = useState<OrganizationUnit[]>([]);
  const [isFocused, setIsFocused] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // computed
  const { lbl } = isEnglish ? englishLabels : arabicLabels;

  const handleSearch = () => {
    onAdvanceSearch && onAdvanceSearch();
  };

  const handleSelect = (unit: OrganizationUnit) => {
    onSelect && onSelect(unit);
    setIsFocused(false); // Close the list on selection
  };

  useEffect(() => {
    searchOrgUnit(search).then((d) => Array.isArray(d) && setList(d));

    return () => {};
  }, [search]);

  // Close the list when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsFocused(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const filterArray = (
    filterValue: OrganizationUnit | OrganizationUnit[] | undefined,
    data: OrganizationUnit[]
  ) => {
    const ids = Array.isArray(filterValue)
      ? filterValue.map((m) => m.organizationUnitId)
      : [filterValue?.organizationUnitId];

    return data.filter((f) => !ids.includes(f.organizationUnitId));
  };

  return (
    <div ref={containerRef} style={{ position: "relative", width: "100%" }}>
      <TextField
        margin="normal"
        required
        color="success"
        placeholder={label ?? lbl.user_orgunit}
        label={label ?? lbl.user_orgunit}
        variant="standard"
        type="search"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        onFocus={() => setIsFocused(true)}
        style={{ width: "100%" }}
        InputProps={{
          ...(isEnglish
            ? {
                endAdornment: (
                  <InputAdornment position={"end"}>
                    <IconButton onClick={handleSearch}>
                      <SearchOutlined style={{ fontSize: "24px" }} />
                    </IconButton>
                  </InputAdornment>
                ),
              }
            : {
                startAdornment: (
                  <InputAdornment position={"start"}>
                    <IconButton onClick={handleSearch}>
                      <SearchOutlined style={{ fontSize: "24px" }} />
                    </IconButton>
                  </InputAdornment>
                ),
              }),
        }}
        sx={{
          "& .MuiInputLabel-asterisk": {
            color: "red",
          },
        }}
      />
      {isFocused && list.length > 0 && (
        <List
          style={{
            position: "absolute",
            width: "100%",
            maxHeight: "200px",
            overflowY: "auto",
            backgroundColor: "white",
            border: "1px solid #ccc",
            borderRadius: "4px",
            zIndex: 1000,
          }}
        >
          {filterArray(values, list).map((unit) => (
            // @ts-ignore
            <ListItem
              key={unit.organizationUnitId!}
              onClick={() => handleSelect(unit)}
              button
            >
              {unit.orgUnitDescEn} {/* Adjust to match your data structure */}
            </ListItem>
          ))}
        </List>
      )}
    </div>
  );
};

export default MiniSearch;
