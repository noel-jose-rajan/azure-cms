import { Button, Card, Col, Row, Splitter, Tabs } from "antd";
import TabPane from "antd/es/tabs/TabPane";
import { useTheme } from "../../context/theme";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  ArrowLeftOutlined,
  ArrowRightOutlined,
  ReloadOutlined,
  RetweetOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import TitleBar from "../../components/ui/bar/title-bar";
import { useLanguage } from "../../context/language";
import { search, getSearchCount } from "./service";
import {
  CorrespondenceType,
  CountResultStatistics,
  SearchQuery,
} from "./types";
import PaginatedTable from "./components/table";
import SearchContainer from "./components/search-container";
import DEFAULT_SEARCH_VALUES from "./lib/default-search-values";
import { OrganizationUnitType } from "../organization-units/service";

import { Box } from "@mui/material";
import FaucetSearch from "./components/faucet-filter";

export default function SearchPage() {
  const {
    theme: {
      colors: { accent, backgroundText, primary },
    },
  } = useTheme();
  const { labels, isEnglish } = useLanguage();

  const [searchParams, setSearchParams] = useSearchParams();

  // States synced with URL
  const [currentPage, setCurrentPage] = useState<number>(
    Number(searchParams.get("page")) || 1
  );
  const [activeKey, setActiveKey] = useState<string>(
    searchParams.get("correspondenceTypeCode") || ""
  );
  const [sendingEntityType, setSendingEntityType] = useState<string>(
    searchParams.get("sendingEntityType") || "0"
  );
  const [receivingEntityType, setReceivingEntityType] = useState<string>(
    searchParams.get("receivingEntityType") || "0"
  );
  const [criteriaValue, setCriteriaValue] = useState<string>(
    searchParams.get("criteriaValue") || ""
  );

  const [searchByContent, setSearchByContent] = useState<string>(
    searchParams.get("searchByContent") || ""
  );

  // Other states
  const pageSize = 10;
  const [totalPages, setTotalPages] = useState(0);
  const [statistics, setStatistics] = useState<
    CountResultStatistics | undefined
  >();
  const [results, setResults] = useState<CorrespondenceType[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [faucetFilter, setFaucetFilter] = useState<boolean>(true);
  const [formValues, setFormValues] = useState<SearchQuery>(
    JSON.parse(JSON.stringify(DEFAULT_SEARCH_VALUES))
  );

  const tabStyle = (key: string) => ({
    padding: "8px 16px",
    backgroundColor: activeKey === key ? primary : "unset",
    color: activeKey === key ? backgroundText : "inherit",
    display: "flex",
    alignItems: "center",
    borderRadius: "5px",
  });

  const numberStyle = (key: string) => ({
    backgroundColor: activeKey === key ? accent : backgroundText,
    color: activeKey === key ? "#fff" : accent,
    padding: "2px 6px",
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

  const fetchData = async (page: number, key: string) => {
    setLoading(true);
    try {
      const [searchCount, searchResult] = await Promise.all([
        getSearchCount({
          query: {
            criteriaValue,
            correspondenceTypeCode: key,
            receivingEntityType: 0,
            sendingEntityType: sendingEntityType as unknown as number,
            page: page - 1, // Adjust for zero-based indexing on the server.
            size: pageSize,
            sort: "creationDate,desc",
          },
          requestBody: {
            ...formValues,
            singleCriteria: {
              ...formValues.singleCriteria,
              contentSearch: searchByContent === "true",
            },
            multiCriteria: {
              ...formValues.multiCriteria,
              sendingEntityIDs:
                sendingEntityType === "2"
                  ? formValues.multiCriteria?.sendingEntityIDs
                  : formValues.multiCriteria?.sendingEntityIDs?.map(
                      (i: OrganizationUnitType) => i.organizationUnitId
                    ),
              relatedCorrespondenceIDs:
                formValues.multiCriteria?.relatedCorrespondenceIDs?.map(
                  (i: CorrespondenceType) => i.corrId
                ),
              recievingEntityIDs:
                receivingEntityType === "2"
                  ? formValues.multiCriteria?.recievingEntityIDs
                  : formValues.multiCriteria?.recievingEntityIDs?.map(
                      (i: OrganizationUnitType) => i.organizationUnitId
                    ),
            },
          },
        }),
        search({
          query: {
            criteriaValue,
            correspondenceTypeCode: key,
            receivingEntityType: receivingEntityType as unknown as number,
            sendingEntityType: sendingEntityType as unknown as number,
            page: page - 1,
            size: pageSize,
            sort: "creationDate,desc",
          },
          requestBody: {
            ...formValues,
            singleCriteria: {
              ...formValues.singleCriteria,
              contentSearch: searchByContent === "true",
            },
            multiCriteria: {
              ...formValues.multiCriteria,
              sendingEntityIDs:
                sendingEntityType === "2"
                  ? formValues.multiCriteria?.sendingEntityIDs
                  : formValues.multiCriteria?.sendingEntityIDs?.map(
                      (i: OrganizationUnitType) => i.organizationUnitId
                    ),
              relatedCorrespondenceIDs:
                formValues.multiCriteria?.relatedCorrespondenceIDs?.map(
                  (i: CorrespondenceType) => i.corrId
                ),
              recievingEntityIDs:
                receivingEntityType === "2"
                  ? formValues.multiCriteria?.recievingEntityIDs
                  : formValues.multiCriteria?.recievingEntityIDs?.map(
                      (i: OrganizationUnitType) => i.organizationUnitId
                    ),
            },
          },
        }),
      ]);

      if (searchResult) {
        setResults(searchResult.searchResultContent.content);
        setTotalPages(searchResult.searchResultContent.totalPages * pageSize);
      }

      if (searchCount) {
        setStatistics(searchCount);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Sync state with URL when `currentPage` or `activeKey` changes
  useEffect(() => {
    setSearchParams({
      page: String(currentPage),
      correspondenceTypeCode: activeKey,
      sendingEntityType,
      receivingEntityType,
      criteriaValue,
      searchByContent,
    });
    fetchData(currentPage, activeKey);
  }, [currentPage, activeKey]);

  // Initialize states from URL parameters when the page loads
  useEffect(() => {
    const initialPage = Number(searchParams.get("page")) || 1;
    const initialKey = searchParams.get("correspondenceTypeCode") || "";
    const initialSendingEntity = searchParams.get("sendingEntityType") || "0";
    const initialReceivingEntityType =
      searchParams.get("receivingEntityType") || "0";
    const initialCriteriaValue = searchParams.get("criteriaValue") || "";
    const initialSearchByContent = searchParams.get("searchByContent") || "";

    setSendingEntityType(initialSendingEntity);
    setReceivingEntityType(initialReceivingEntityType);
    setCurrentPage(initialPage);
    setActiveKey(initialKey);
    setCriteriaValue(initialCriteriaValue);
    setSearchByContent(initialSearchByContent);
    fetchData(initialPage, initialKey);
  }, [
    searchParams.get("correspondenceTypeCode"),
    searchParams.get("sendingEntityType"),
    searchParams.get("receivingEntityType"),
    searchParams.get("criteriaValue"),
    searchParams.get("searchByContent"),
  ]);

  return (
    <>
      <TitleBar headerText={labels.mnu.search} />

      <SearchContainer formValues={formValues} setFormValues={setFormValues} />

      <Box
        display={"flex"}
        justifyContent={isEnglish ? "left" : "right"}
        gap={2}
      >
        <Button
          type="primary"
          style={{ backgroundColor: accent }}
          onClick={() => fetchData(currentPage, activeKey)}
        >
          {labels.btn.search} <SearchOutlined />
        </Button>
        <Button
          type="primary"
          style={{ backgroundColor: accent }}
          onClick={() =>
            setFormValues(() =>
              JSON.parse(JSON.stringify(DEFAULT_SEARCH_VALUES))
            )
          }
        >
          {labels.btn.reset} <ReloadOutlined />
        </Button>
      </Box>

      <br />
      <br />

      <Row gutter={20}>
        <Col span={faucetFilter ? 0.01 : 4}>
          <FaucetSearch
            collapsed={faucetFilter}
            setCollapsed={setFaucetFilter}
          />
        </Col>

        <Col span={faucetFilter ? 24 : 20}>
          <Card>
            <Splitter>
              <Splitter.Panel collapsible min="40%">
                <Tabs
                  defaultActiveKey={activeKey}
                  onChange={(key) => {
                    setActiveKey(key);
                    setCurrentPage(1);
                  }}
                >
                  <TabPane
                    tab={renderTab(
                      <RetweetOutlined />,
                      labels.til.all,
                      statistics?.resultStatistics["all Result Count"] ?? 0,
                      ""
                    )}
                    key=""
                  />
                  <TabPane
                    tab={renderTab(
                      <ArrowLeftOutlined />,
                      labels.til.external_inbound,
                      statistics?.resultStatistics["External Inbound Count"] ??
                        0,
                      "Corr-Type Ext Inc"
                    )}
                    key="Corr-Type Ext Inc"
                  />
                  <TabPane
                    tab={renderTab(
                      <ArrowRightOutlined />,
                      labels.til.external_outbound,
                      statistics?.resultStatistics["External Outbound Count"] ??
                        0,
                      "Corr-Type Ext Out"
                    )}
                    key="Corr-Type Ext Out"
                  />
                  <TabPane
                    tab={renderTab(
                      <ReloadOutlined />,
                      labels.til.internal,
                      statistics?.resultStatistics["Internal Count"] ?? 0,
                      "Corr-Type Int"
                    )}
                    key="Corr-Type Int"
                  />
                </Tabs>
                <PaginatedTable
                  data={results}
                  loading={loading}
                  currentPage={currentPage}
                  pageSize={pageSize}
                  setCurrentPage={setCurrentPage}
                  total={isNaN(totalPages) ? 0 : totalPages}
                />
              </Splitter.Panel>

              <Splitter.Panel collapsible></Splitter.Panel>
            </Splitter>
          </Card>
        </Col>
      </Row>
    </>
  );
}
