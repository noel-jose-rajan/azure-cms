import { ReportName } from "../../service";
import RepoAllCorresByTypeChart from "./RepoAllCorresByTypeChart";
import RepoAllCorresStatistics from "./RepoAllCorresStatistics";
import RepoGeneralCorres from "./RepoGeneralCorres";
import RepoRoutingFromChart from "./RepoRoutingFromChart";
import RepoRoutingToChart from "./RepoRoutingToChart";

export interface ReportFilterState {
  isDelete?: 0;
  draftStatus?: 5;
  correspondenceDateFrom?: string | null;
  correspondenceDateTo?: string | null;
  statusPicklistsDesc?: string[] | "All";
  statusPicklistsId?: number[] | -1;
  corrStatusIds?: number[] | -1;
  corrStatusDesc?: string[] | "All";
  orgUnitIDs?: number[] | "All";
  orgUnitsDesc?: string[] | "All";
  keywords?: string[] | "All";
  createdDateFrom?: string | null;
  createdDateTo?: string | null;
  corrTypeIds?: number[] | -1;
  corrTypeDesc?: string[] | "All";
  securityLevelIds?: number[] | -1;
  securityLevelDesc?: string[] | "All";
  urgencyLevelIds?: number[] | -1;
  urgencyLevelDesc?: string[] | "All";
  corrSubject?: string;
  internalSendingEntityId?: number[] | -1;
  internalReceivingEntityId?: number[] | -1;
  externalSendingEntityId?: number[] | -1;
  externalReceivingEntityId?: number[] | -1;
  sendingEntityDesc?: string[] | "All";
  receivingEntityDesc?: string[] | "All";
  routingDateFrom?: string | "All";
  routingDateTo?: string | "All";
}
interface Props extends ReportName {
  reportFilterState: ReportFilterState;
  handleChange?: React.Dispatch<React.SetStateAction<ReportFilterState>>;
}

export default function ReportFilter({
  exportTypes,
  reportCode,
  reportName,
  reportFilterState,
  handleChange,
}: Props) {
  return (
    <div>
      {reportCode === "Repo-routing-from-chart" && (
        <RepoRoutingFromChart
          exportTypes={exportTypes}
          reportCode={reportCode}
          reportFilterState={reportFilterState}
          reportName={reportName}
          handleChange={handleChange}
        />
      )}

      {reportCode === "Repo-routing-to-chart" && (
        <RepoRoutingToChart
          exportTypes={exportTypes}
          reportCode={reportCode}
          reportFilterState={reportFilterState}
          reportName={reportName}
          handleChange={handleChange}
        />
      )}

      {reportCode === "Repo-all-corres-by-type-chart" && (
        <RepoAllCorresByTypeChart
          exportTypes={exportTypes}
          reportCode={reportCode}
          reportFilterState={reportFilterState}
          reportName={reportName}
          handleChange={handleChange}
        />
      )}

      {reportCode === "Repo-corres-statistics" && (
        <RepoAllCorresStatistics
          exportTypes={exportTypes}
          reportCode={reportCode}
          reportFilterState={reportFilterState}
          reportName={reportName}
          handleChange={handleChange}
        />
      )}

      {reportCode === "Repo-general-corres" && (
        <RepoGeneralCorres
          exportTypes={exportTypes}
          reportCode={reportCode}
          reportFilterState={reportFilterState}
          reportName={reportName}
          handleChange={handleChange}
        />
      )}
    </div>
  );
}
