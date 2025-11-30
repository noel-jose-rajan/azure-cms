import { useEffect, useMemo, useState } from "react";
import { generateReport, getAllReportsName, ReportName } from "./service";
import SelectReportType from "./components/select-report-type";
import ReportFilter, { ReportFilterState } from "./components/report-filter";
import Controls from "./components/controls";
import TitleHeader from "../../components/ui/header";
import { useLanguage } from "../../context/language";
import {
  BarChartOutlined,
  FileTextFilled,
  FilterOutlined,
} from "@ant-design/icons";
import { Card, Col, Row, Spin, Typography } from "antd";
import { Box } from "@mui/material";
import { useTheme } from "../../context/theme";

function cleanObject(obj: Record<string, any>): Record<string, any> {
  return Object.fromEntries(
    Object.entries(obj).filter(
      ([, value]) =>
        value !== null &&
        value !== "" &&
        !(Array.isArray(value) && value.length === 0) &&
        !(
          typeof value === "object" &&
          value !== null &&
          !Array.isArray(value) &&
          Object.keys(value).length === 0
        )
    )
  );
}

export default function Reports() {
  const { labels, isEnglish } = useLanguage();
  const { theme } = useTheme();

  const [reportTypes, setReportTypes] = useState<ReportName[]>([]);
  const [selectedType, setSelectedType] = useState<string | undefined>(
    "Repo-routing-from-chart"
  );
  const [filter, setFilter] = useState<ReportFilterState>({
    correspondenceDateFrom: "All",
    correspondenceDateTo: "All",
  });

  const [documentUrl, setDocumentUrl] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const iframDocumetnUrl = documentUrl
    ? `http://192.168.1.107:8580/pdf/web/viewer.html?pdf=http://192.168.1.107:8580/pdfDocuments/${documentUrl}`
    : "";

  const pdfurl = documentUrl
    ? `http://192.168.1.107:8580/pdfDocuments/${documentUrl}`
    : undefined;

  const handleGenerateReport = async () => {
    if (selectedType) {
      setLoading(true);
      setError(null); // Reset any previous error

      const report = await generateReport({
        filter: cleanObject(filter) as any,
        reportType: selectedType,
      });

      setLoading(false);

      if (report?.resultCode === 200) {
        setDocumentUrl(report.message);
      } else {
        setError(isEnglish ? "Failed to fetch PDF." : "فشل في جلب ملف PDF.");
      }
    }
  };

  useEffect(() => {
    getAllReportsName().then((reportsTypeList) => {
      reportsTypeList && setReportTypes(() => reportsTypeList);
    });
  }, []);

  useEffect(() => {
    if (selectedType === "Repo-general-corres") {
      setFilter({
        isDelete: 0,
        draftStatus: 5,
        keywords: "All",
        correspondenceDateFrom: "All",
        correspondenceDateTo: "All",
        createdDateFrom: "All",
        createdDateTo: "All",
        corrTypeIds: -1,
        corrTypeDesc: "All",
        securityLevelIds: -1,
        securityLevelDesc: "All",
        urgencyLevelIds: -1,
        urgencyLevelDesc: "All",
        corrSubject: "All",
        internalSendingEntityId: -1,
        internalReceivingEntityId: -1,
        externalSendingEntityId: -1,
        externalReceivingEntityId: -1,
        sendingEntityDesc: "All",
        receivingEntityDesc: "All",
        corrStatusIds: -1,
        corrStatusDesc: "All",
      });
    } else if (selectedType === "Repo-corres-statistics") {
      setFilter({
        correspondenceDateFrom: "All",
        correspondenceDateTo: "All",
        statusPicklistsId: -1,
        statusPicklistsDesc: "All",
      });
    } else if (
      selectedType === "Repo-routing-to-chart" ||
      selectedType === "Repo-routing-from-chart"
    ) {
      setFilter({
        orgUnitIDs: "All",
        orgUnitsDesc: "All",
        routingDateFrom: "All",
        routingDateTo: "All",
      });
    } else {
      setFilter({
        correspondenceDateFrom: "All",
        correspondenceDateTo: "All",
        orgUnitIDs: "All",
        orgUnitsDesc: "All",
      });
    }
  }, [selectedType]);

  const reportTypesOptions = useMemo(
    () =>
      reportTypes
        .filter((item) =>
          [
            "Repo-all-corres-by-type-chart",
            "Repo-routing-from-chart",
            "Repo-routing-to-chart",
            "Repo-corres-statistics",
            "Repo-general-corres",
          ].includes(item.reportCode)
        )
        .map((report) => ({
          value: report.reportCode,
          key: report.reportName,
        })),
    [reportTypes]
  );

  const report = useMemo(
    () => reportTypes.find((item) => item.reportCode === selectedType),
    [selectedType, reportTypes]
  );

  return (
    <>
      <Row gutter={[20, 20]}>
        <Col span={12}>
          <TitleHeader
            heading={labels.lbl.report_name}
            icon={<FileTextFilled style={{ color: "#fff" }} />}
          />
          <Card>
            <SelectReportType
              options={reportTypesOptions}
              onSelect={(val) => {
                setDocumentUrl(() => undefined);
                setSelectedType(val);
              }}
              value={selectedType}
            />
          </Card>

          <TitleHeader
            heading={labels.til.report_filter}
            icon={<FilterOutlined style={{ color: "#fff" }} />}
          />

          {report && (
            <ReportFilter
              {...report}
              reportFilterState={filter}
              handleChange={setFilter}
            />
          )}
          <Controls
            onGenerate={handleGenerateReport}
            exportTypes={
              reportTypes.find((f) => f.reportCode === selectedType)
                ?.exportTypes
            }
            reportFilterState={!!documentUrl ? filter : undefined}
            pdfDocumentUrl={pdfurl}
            reportType={selectedType}
          />
        </Col>
        <Col span={12}>
          <TitleHeader
            heading={labels.til.report_view}
            icon={<BarChartOutlined style={{ color: "#fff" }} />}
          />

          {error && <Typography.Text type="danger">{error}</Typography.Text>}

          {loading ? (
            <Spin size="large" />
          ) : documentUrl ? (
            <iframe
              src={iframDocumetnUrl}
              style={{ width: "100%", height: "unset", aspectRatio: 1 }}
            />
          ) : (
            <Box
              sx={{
                width: "100%",
                height: "unset",
                aspectRatio: 1,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                border: `1px solid ${theme.colors.border}`,
              }}
            >
              <Typography.Text>
                {isEnglish ? "No file to display." : "لا يوجد ملف لعرضه."}
              </Typography.Text>
            </Box>
          )}
        </Col>
      </Row>
    </>
  );
}
