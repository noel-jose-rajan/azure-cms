import {
  CorrSearchResultType,
  CorrespondenceType,
} from "@/components/services/search/type";
import { useLanguage } from "@/context/language";
import { useTheme } from "@/context/theme";
import usePicklist from "@/store/picklists/use-picklist";
import { Tabs } from "antd";
import TabPane from "antd/es/tabs/TabPane";
import { useEffect, useState } from "react";
import SearchTable from "../search-table";

const SearchResultTabs = ({
  results,
  pagination,
  handlePageChange,
  handleTabChange,
  resultCounts,
  totalRecords,
}: {
  results?: CorrSearchResultType;
  pagination: {
    page: number;
    perPage: number;
  };
  handlePageChange: (page: number, pageSize?: number) => void;
  handleTabChange?: (key: string) => void;
  resultCounts?: Record<string, number>;
  totalRecords?: number;
}) => {
  const { theme } = useTheme();
  const { labels, isEnglish } = useLanguage();
  const [activeKey, setActiveKey] = useState<string>("All");
  const [filteredResults, setFilteredResults] = useState<CorrespondenceType[]>(
    results?.data || []
  );
  const { picklists } = usePicklist();
  const correspondenceTypes = picklists?.["Correspondence Type"] || [];

  useEffect(() => {
    if (activeKey === "All") {
      setFilteredResults(results?.data || []);
    } else {
      const filtered = results?.data.filter(
        (item) => item.corr_type_id === Number(activeKey)
      );
      setFilteredResults(filtered || []);
    }
  }, [activeKey, results]);

  const tabStyle = (key: string) => ({
    padding: "8px 16px",
    backgroundColor: activeKey === key ? theme.colors.primary : "unset",
    color: activeKey === key ? theme.colors.backgroundText : "inherit",
    display: "flex",
    alignItems: "center",
    borderRadius: "5px",
  });

  const numberStyle = (key: string) => ({
    backgroundColor:
      activeKey === key ? theme.colors.accent : theme.colors.backgroundText,
    color: activeKey === key ? "#fff" : theme.colors.accent,
    padding: "2px 9px",
    borderRadius: "12px",
    marginLeft: "8px",
  });

  const renderTab = (icon: any, text: string, number: number, key: string) => (
    <span style={tabStyle(key)}>
      {icon}
      <span style={{ marginLeft: 8 }}>{text}</span>
      <span style={numberStyle(key)}>{number}</span>
    </span>
  );

  return (
    <>
      <Tabs
        defaultActiveKey={activeKey}
        onChange={(key) => {
          setActiveKey(key);
          handleTabChange?.(key);
        }}
      >
        <TabPane
          tab={renderTab(<></>, labels.til.all, totalRecords || 0, "All")}
          key="All"
        />
        {correspondenceTypes.map((type) => {
          const count = resultCounts?.[type.picklist_id.toString()] || 0;

          return (
            <TabPane
              tab={renderTab(
                <></>,
                isEnglish ? type.picklist_en_label : type.picklist_ar_label,
                count,
                type.picklist_id.toString()
              )}
              key={type.picklist_id}
              disabled={count === 0}
            />
          );
        })}
      </Tabs>
      <SearchTable
        data={filteredResults ?? []}
        pagination={pagination}
        total={results?.total_records ?? 0}
        handlePageChange={handlePageChange}
      />
    </>
  );
};

export default SearchResultTabs;
