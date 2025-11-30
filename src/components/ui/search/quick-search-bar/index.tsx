import { useEffect, useState } from "react";
import { Input, Select, Button, message } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { useTheme } from "../../../../context/theme";
import { useLanguage } from "../../../../context/language";
import { getPickListsItems } from "../correspondence/service";
import PICK_LIST_NAME from "../../../../constants/app-constants/pick-list-name";
import { CreatePickListItemType } from "../../../../pages/pick-lists/service";
import { useSearchParams } from "react-router-dom";

const { Option } = Select;

const QuickSearchBar = () => {
  const { theme } = useTheme();
  const [searchParams] = useSearchParams();

  const { labels, isEnglish } = useLanguage();
  const [category, setCategory] = useState<string | "search-by-content">(
    searchParams.get("correspondenceTypeCode") ??
      (searchParams.get("searchByContent") && "search-by-content") ??
      "all"
  );
  const [query, setQuery] = useState(searchParams.get("criteriaValue") ?? "");

  const [types, setTypes] = useState<CreatePickListItemType[] | undefined>(
    undefined
  );

  const handleSearch = () => {
    if (category === "search-by-content") {
      window.location.href = `/correspondence/search?criteriaValue=${encodeURIComponent(
        query
      )}&searchByContent=true`;
    } else {
      window.location.href = `/correspondence/search?criteriaValue=${encodeURIComponent(
        query
      )}${category ? `&correspondenceTypeCode=${category}` : ""}`;
    }
  };

  useEffect(() => {
    let isMounted = true; // Prevent state updates if the component unmounts

    const fetchPickListItems = async () => {
      try {
        const data = await getPickListsItems(
          PICK_LIST_NAME.CORRESPONDENCE_TYPE
        );
        if (isMounted) {
          setTypes(data || []);
        }
      } catch (err) {
        message.error(labels.msg.error_message);
      }
    };

    fetchPickListItems();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div
      className="borderless-select"
      style={{
        display: "flex",
        alignItems: "center",
        width: "100%",
        maxWidth: "80%",
        border: `0.1rem solid ${theme.colors.accent}`,
        borderRadius: "1rem",
        overflow: "hidden",
        height: 40,
        backgroundColor: "#fff",
      }}
    >
      <Input
        placeholder={`${labels.btn.search}`}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        style={{
          flex: 1,
          border: 0,
          outline: 0,
          padding: "0 0.75rem",
          height: "100%",
          borderTopRightRadius: 0,
          borderBottomRightRadius: 0,
          width: 500,
        }}
      />
      <Select
        value={category}
        onChange={setCategory}
        style={{
          border: "none",
          boxShadow: "none",
          height: "100%",
        }}
        dropdownStyle={{
          border: "none",
          boxShadow: "none",
          width: "250px",
        }}
      >
        <Option value="" disabled>
          {labels.til.search_by_metadata}
        </Option>
        <Option value="">
          <></>
        </Option>

        <Option value="all">All</Option>

        {types?.map((items, index) => (
          <Option
            key={index}
            // @ts-ignore
            value={items.picklistCode}
          >
            {isEnglish ? items.picklistEnLabel : items.picklistArLabel}
          </Option>
        ))}
        <Option value="" disabled>
          {labels.til.search_by_content}
        </Option>
        <Option value="search-by-content">
          {labels.lbl.search_contentSearch}
        </Option>
      </Select>
      <Button
        type="primary"
        icon={<SearchOutlined />}
        onClick={handleSearch}
        style={{
          background: theme.colors.accent,
          borderColor: theme.colors.accent,
          color: theme.colors.backgroundText,
          height: "100%",
          borderTopLeftRadius: 0,
          borderBottomLeftRadius: 0,
          width: "3rem",
        }}
      />
    </div>
  );
};

export default QuickSearchBar;
