import { useEffect, useState } from "react";
import TitleBar from "../../components/ui/bar/title-bar";
import { useLanguage } from "../../context/language";
import SearchAndFilterInbox from "./components/search-filter";
import { SearchInboxType, searchInboxSchema } from "./types";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  checkHasDelegation,
  getAllInboxCorrespondences,
  InboxDelegation,
  InboxResponseType,
} from "../../components/services/inbox";
import InboxTableCG from "./components/table/index_new";
import usePicklist from "@/store/picklists/use-picklist";
import FadeInWrapperAnimation from "@/animations/fade-in-wrapper-animation";
import LoaderComponent from "@/components/ui/loader";
import useHandleError from "@/components/hooks/useHandleError";
import { useAuth } from "@/context/auth";

type InboxState = {
  data: InboxResponseType["data"];
  total_records: InboxResponseType["total_records"];
  all: number;
  page: number;
};

type counts = {
  [key: string]: {
    count: number;
    id: string | number;
  };
};
export default function InboxPage() {
  const { isAuthenticated } = useAuth();
  const { handleError } = useHandleError();
  const { labels, isEnglish } = useLanguage();
  // const location = useLocation();
  // const { process_type_id } = location.state || {};
  const [applyFilters, setApplyFilters] = useState(false);
  const [inbox, setInbox] = useState<InboxState>({
    data: [],
    total_records: 0,
    all: 0,
    page: 1,
  });

  // useEffect(() => {
  //   import("./../correspondance-details");
  // }, []);
  const [counts, setCounts] = useState<counts>({
    "PROCESS-TYPE-OUTBOUND": { count: 0, id: 1 },
    "PROCESS-TYPE-INBOUND": { count: 0, id: 2 },
    "PROCESS-TYPE-ROUTE": { count: 0, id: 3 },
    "PROCESS-TYPE-AdHOC": { count: 0, id: 4 },
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [FullPageloading, setFullLoading] = useState<boolean>(true);
  const { picklists } = usePicklist();
  const _process_types = picklists["PROCESS_TYPE"] || [];
  const methods = useForm<SearchInboxType>({
    resolver: zodResolver(searchInboxSchema),
    mode: "all",
  });

  const { getValues } = methods;
  const picklist_len = _process_types.length;
  useEffect(() => {
    if (picklist_len == 0 || !isAuthenticated) return;
    searchInboxes(1, {}, true);
  }, [picklist_len]);
  const searchInboxes = async (
    page = 1,
    _payload: Partial<SearchInboxType> = {},
    isFiltering?: boolean,
    applyFiltering?: boolean
  ) => {
    try {
      const { task_date_from, task_date_to } = getValues();
      setLoading(true);
      const payload: SearchInboxType = {
        ..._payload,
        task_date_from: task_date_from
          ? new Date(task_date_from as string).toISOString()
          : undefined,
        task_date_to: task_date_to
          ? new Date(task_date_to as string).toISOString()
          : undefined,
      };

      const fields = applyFilters || applyFiltering ? getValues() : {};
      const response = await getAllInboxCorrespondences(page, {
        ...fields,
        ...payload,
      });

      if (response.data && response?.total_records) {
        const countsMap: counts = {
          "PROCESS-TYPE-OUTBOUND": { count: 0, id: 1 },
          "PROCESS-TYPE-INBOUND": { count: 0, id: 2 },
          "PROCESS-TYPE-ROUTE": { count: 0, id: 3 },
          "PROCESS-TYPE-AdHOC": { count: 0, id: 4 },
        };
        for (const item of _process_types) {
          const current = countsMap[item.picklist_code];
          const newCount = response.total_group_by[item.picklist_id] ?? 0;

          if (current) {
            countsMap[item.picklist_code] = {
              ...current,
              count: newCount,
            };
          }
        }

        if (isFiltering) {
          setInbox({
            data: response.data,
            total_records: response.total_records,
            all: response.total_records,
            page,
          });
          setCounts(countsMap);
        } else {
          setInbox((prev) => ({
            ...prev,
            data: response?.data,
            total_records: response.total_records,
            page,
          }));
        }
      } else {
        setInbox({
          data: [],
          total_records: 0,
          all: 0,
          page: 1,
        });
        setCounts({
          "PROCESS-TYPE-OUTBOUND": { count: 0, id: 1 },
          "PROCESS-TYPE-INBOUND": { count: 0, id: 2 },
          "PROCESS-TYPE-ROUTE": { count: 0, id: 3 },
          "PROCESS-TYPE-AdHOC": { count: 0, id: 4 },
        });
      }
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
      setFullLoading(false);
    }
  };
  const [delegations, setDelegations] = useState<InboxDelegation[]>([]);
  const fetchHasDelegation = async () => {
    const res = await checkHasDelegation(!isEnglish);
    if (res) {
      setDelegations(res);
    }
  };
  useEffect(() => {
    fetchHasDelegation();
  }, [isEnglish]);
  return (
    <div>
      {FullPageloading ? (
        <LoaderComponent loading={loading} delay={0} fullscreen={false} />
      ) : (
        <FadeInWrapperAnimation
          animateDuration={0.75}
          enableScaleAnimation={false}
        >
          <TitleBar headerText={labels.mnu.inbox} />
          <FormProvider {...methods}>
            <SearchAndFilterInbox
              delegations={delegations}
              onReset={() => {
                setApplyFilters(false);
              }}
              onSearch={() => {
                setApplyFilters(true);
                setTimeout(() => {
                  searchInboxes(1, {}, true, true);
                }, 100);
              }}
            />
          </FormProvider>

          <InboxTableCG
            loading={loading}
            inbox={inbox?.data || []}
            counts={counts}
            onChange={(page, payload) => searchInboxes(page, payload)}
            total={inbox?.total_records || 0}
            all={inbox?.all || 0}
            currentPage={inbox?.page}
          />
        </FadeInWrapperAnimation>
      )}
    </div>
  );
}
