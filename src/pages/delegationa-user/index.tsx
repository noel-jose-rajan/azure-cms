import TitleBar from "@/components/ui/bar/title-bar";
import TitleHeader from "@/components/ui/header";
import { useLanguage } from "@/context/language";
import { UserSwitchOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import DelegationForm from "./components/form";
import DelegationTable from "./components/table";
import {
  searchUserDelegation,
  UserDelegationSearch,
  UserSearchDelegationPayload,
} from "./service";
import { FormProvider, useForm } from "react-hook-form";
import { delegationSearchSchema, DelegationType } from "./schema";
import { zodResolver } from "@hookform/resolvers/zod";
import useHandleError from "@/components/hooks/useHandleError";
import LoaderComponent from "@/components/ui/loader";

const Delegation = () => {
  const { handleError } = useHandleError();
  const [fullpageLoading, setFullPageLoading] = useState(true);

  const { labels, isEnglish } = useLanguage();
  const [refreshCount, setRefreshCount] = useState(0);
  const [pagination, setPagination] = useState({
    page: 1,
    total: 0,
  });

  const [data, setData] = useState<UserDelegationSearch[]>([]);
  const methods = useForm<DelegationType>({
    resolver: zodResolver(delegationSearchSchema),
    mode: "all",
  });
  const { getValues } = methods;
  const handleSearch = async (page = 1) => {
    try {
      const body: UserSearchDelegationPayload = {
        ...getValues(),
        is_arabic: !isEnglish,
      };
      const res = await searchUserDelegation(page, body);
      setPagination({ total: res?.Total, page });

      if (res) {
        setData(res?.Rows);
      }
    } catch (e) {
      handleError(e);
    } finally {
      setFullPageLoading(false);
    }
  };

  useEffect(() => {
    handleSearch(pagination.page);
  }, [isEnglish, pagination.page, refreshCount]);
  return (
    <>
      {fullpageLoading ? (
        <LoaderComponent loading={true} delay={0} fullscreen={false} />
      ) : (
        <>
          <TitleBar headerText={labels.mnu.delegation} />
          <TitleHeader
            heading={labels.til.ext_ent_search_delegation}
            icon={<UserSwitchOutlined style={{ color: "#fff" }} />}
          />
          <FormProvider {...methods}>
            <DelegationForm onSearch={handleSearch} />
          </FormProvider>
          <DelegationTable
            refresh={() => {
              setRefreshCount((c) => c + 1);
            }}
            pagination={pagination}
            data={data}
            onPagination={(page: number) => {
              setPagination((prev) => ({ ...prev, page }));
            }}
          />
        </>
      )}
    </>
  );
};

export default Delegation;
