import { HttpStatus } from "@/components/functional/httphelper";
import { searchCorrespondence } from "@/components/services/search/service";
import {
  CorrSearchResultType,
  SearchCorrespondenceType,
  searchCorrespondenceSchema,
} from "@/components/services/search/type";
import TitleBar from "@/components/ui/bar/title-bar";
import TitleHeader from "@/components/ui/header";
import { useLanguage } from "@/context/language";
import { SearchOutlined, UndoOutlined } from "@ant-design/icons";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Form, Switch } from "antd";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import AdvancedSearchForm from "./components/advaned-search";
import BasicSearchInfo from "./components/basic-info";
import FilterOptions from "./components/filter-options";
import SearchResultTabs from "./components/result-tabs";

const CorrespondenceSearch = () => {
  const {
    labels: { til, lbl, btn },
    isEnglish,
  } = useLanguage();
  const [pagination, setPagination] = useState<{
    page: number;
    perPage: number;
  }>({
    page: 1,
    perPage: 10,
  });
  const [searchResults, setSearchResults] = useState<CorrSearchResultType>();
  const [enableAdvanced, setEnableAdvanced] = useState<boolean>(true);
  const [resultCounts, setResultCounts] = useState<Record<string, number>>({});
  const [totalRecords, setTotalRecords] = useState<number>(0);

  const { control, getValues, setValue, resetField, reset } =
    useForm<SearchCorrespondenceType>({
      resolver: zodResolver(searchCorrespondenceSchema),
      defaultValues: {
        is_arabic: !isEnglish,
        is_sort_desc: true,
        sort_by: "correspondence_date",
      },
    });

  const onFinishFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo, getValues());
  };

  useEffect(() => {
    if (!enableAdvanced) {
      resetField("security_level_id");
      resetField("urgency_id");
      resetField("keywords");
      resetField("remarks");
      resetField("external_reference_no");
      resetField("corr_language_id");
    }
  }, [enableAdvanced]);

  useEffect(() => {
    filterCorrespondence({}, true, pagination);
  }, []);

  const filterCorrespondence = async (
    data: SearchCorrespondenceType,
    initialLoad: boolean = false,
    pgDetails?: { page: number; perPage: number }
  ) => {
    const response = await searchCorrespondence(
      pgDetails?.page ?? pagination.page,
      pgDetails?.perPage ?? pagination.perPage,
      data ?? getValues()
    );

    if (response.status === HttpStatus.SUCCESS && response.data) {
      setSearchResults(response.data);
      if (initialLoad) {
        setResultCounts(response.data.total_group_by);
        setTotalRecords(response.data.total_records);
      }
    }
  };

  return (
    <>
      <TitleBar headerText={til.search_corres} />
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center" }}>
          <Switch
            checkedChildren={
              isEnglish ? "Disable Advanced Search" : "تعطيل البحث المتقدم"
            }
            unCheckedChildren={
              isEnglish ? "Enable Advanced Search" : "تمكين البحث المتقدم"
            }
            value={enableAdvanced}
            onChange={setEnableAdvanced}
          />
        </div>
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <Button
            type="text"
            style={{ marginBottom: 10, marginTop: 10 }}
            onClick={() => {
              reset();
              setPagination({
                page: 1,
                perPage: 10,
              });
              filterCorrespondence({}, false, {
                page: 1,
                perPage: 10,
              });
            }}
          >
            <UndoOutlined />
            {btn.reset}
          </Button>
          <Button
            type="primary"
            style={{ marginBottom: 10, marginTop: 10 }}
            onClick={() => {
              setPagination({
                page: 1,
                perPage: 10,
              });
              filterCorrespondence(getValues(), true, {
                page: 1,
                perPage: 10,
              });
            }}
          >
            <SearchOutlined />
            {btn.auto_search}
          </Button>
        </div>
      </div>
      <Form
        onFinishFailed={onFinishFailed}
        layout="vertical"
        style={{ marginBottom: 10, marginTop: 10 }}
      >
        <FilterOptions control={control} />
        <TitleHeader heading={til.basicSearchCirteria} />
        <BasicSearchInfo control={control} setValue={setValue} />
        {enableAdvanced && <AdvancedSearchForm control={control} />}
      </Form>

      <SearchResultTabs
        results={searchResults}
        pagination={pagination}
        handlePageChange={(page: number, pageSize?: number | undefined) => {
          setPagination({
            page: page,
            perPage: pageSize || pagination.perPage,
          });
          filterCorrespondence(getValues(), false, {
            page: page,
            perPage: pageSize || pagination.perPage,
          });
        }}
        resultCounts={resultCounts}
        totalRecords={totalRecords}
        handleTabChange={(key: string) => {
          if (key === "All") {
            setValue("corr_type_id", undefined);
          } else {
            setValue("corr_type_id", Number(key));
          }
          filterCorrespondence(
            {
              ...getValues(),
              corr_type_id: key === "All" ? undefined : Number(key),
            },
            false,
            {
              page: 1,
              perPage: pagination.perPage,
            }
          );
        }}
      />
    </>
  );
};

export default CorrespondenceSearch;
