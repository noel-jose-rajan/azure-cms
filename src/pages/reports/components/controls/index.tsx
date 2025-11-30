import {
  FolderViewOutlined,
  PrinterOutlined,
  FilePdfOutlined,
  FileExcelOutlined,
  FileWordOutlined,
  FileTextOutlined,
} from "@ant-design/icons";
import { Card, Row, Col, Button } from "antd";
import { useLanguage } from "../../../../context/language";
import { downloadReport, ReportExportTypes } from "../../service";
import { ReportFilterState } from "../report-filter";

interface Props {
  onGenerate?: () => any;
  reportType?: string;
  exportTypes?: ReportExportTypes[];
  reportFilterState?: ReportFilterState;
  pdfDocumentUrl?: string;
}

const handlePrint = (url: string) => {
  // Open a new window

  const printWindow = window.open(
    url,
    "printReport",
    "menubar,scrollbars,width=640,height=480,top=0,left=0"
  );
  printWindow?.print();
};

const handleReport = async ({
  filter,
  reportType,
  exportFileType,
}: {
  filter: ReportFilterState | any;
  reportType: string;
  exportFileType: "XLSX" | "DOCX" | "RTF";
}) => {
  await downloadReport({
    filter,
    reportType,
    exportFileType,
  });
};

export default function Controls({
  onGenerate,
  exportTypes,
  reportFilterState,
  pdfDocumentUrl,
  reportType,
}: Props) {
  const { labels } = useLanguage();
  return (
    <Card>
      <Row gutter={[10, 10]}>
        <Col>
          <Button onClick={() => onGenerate && onGenerate()}>
            <FolderViewOutlined />
            {labels.btn.report_view}
          </Button>
        </Col>
        <Col>
          <Button
            disabled={!reportFilterState}
            onClick={() => handlePrint(pdfDocumentUrl!)}
          >
            <PrinterOutlined /> {labels.btn.report_print}
          </Button>
        </Col>
        <Col>
          <Button
            disabled={!reportFilterState || !exportTypes?.includes("PDF")}
            onClick={() => window.open(pdfDocumentUrl, "_blank")}
          >
            <FilePdfOutlined />
          </Button>
        </Col>
        <Col>
          <Button
            disabled={!reportFilterState || !exportTypes?.includes("XLSX")}
            onClick={() =>
              handleReport({
                filter: reportFilterState,
                exportFileType: "XLSX",
                reportType: reportType!,
              })
            }
          >
            <FileExcelOutlined />
          </Button>
        </Col>
        <Col>
          <Button
            disabled={!reportFilterState || !exportTypes?.includes("DOCX")}
            onClick={() =>
              handleReport({
                filter: reportFilterState,
                exportFileType: "DOCX",
                reportType: reportType!,
              })
            }
          >
            <FileWordOutlined />
          </Button>
        </Col>
        <Col>
          <Button
            disabled={!reportFilterState || !exportTypes?.includes("RTF")}
            onClick={() =>
              handleReport({
                filter: reportFilterState,
                exportFileType: "RTF",
                reportType: reportType!,
              })
            }
          >
            <FileTextOutlined />
          </Button>
        </Col>
      </Row>
    </Card>
  );
}
