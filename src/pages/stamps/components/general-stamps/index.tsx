import { Button, Col, Row, Table, TableColumnsType, Tag, message } from "antd";
import { useLanguage } from "../../../../context/language";
import { useTheme } from "../../../../context/theme";
import { StampItemType } from "@/components/services/stamps/type";
import {
  DownloadOutlined,
  EditFilled,
  FilterOutlined,
  TableOutlined,
} from "@ant-design/icons";
import { useState } from "react";
import { Accordion } from "../../../../components/ui/accordions/accordion";
import { Box } from "@mui/material";
import { downloadAStampDoc } from "@/components/services/stamps/service";
import EditGeneralStampModal from "../edit-general-stamp";
import DownloadProgress from "@/components/ui/download-progress";

interface GeneralStampsProps {
  stamps: StampItemType[];
  activateLoader: (loading: boolean) => void;
  refreshPage: () => void;
}

export default function GeneralStamps({
  stamps,
  activateLoader,
  refreshPage,
}: GeneralStampsProps) {
  const { labels, isEnglish } = useLanguage();
  const { theme } = useTheme();
  const [selectedStamp, setSelectedStamp] = useState<StampItemType>();
  const [openEdit, setOpenEdit] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [downloadVisible, setDownloadVisible] = useState<boolean>(false);

  const columns: TableColumnsType<StampItemType> = [
    {
      title: labels.tbl.description,
      dataIndex: "Description",
      render: (text: string) => (
        <a style={{ color: theme.colors.primary }}>{text}</a>
      ),
      width: "50%",
    },
    {
      title: labels.tbl.type,
      dataIndex: "IsGeneral",
      render: (text: boolean) => (
        <Tag color={text ? theme.colors.success : theme.colors.danger}>
          {text ? labels.lbl.general : labels.btn.no}
        </Tag>
      ),
      width: "20%",
    },
    {
      title: labels.tbl.action,
      dataIndex: "ID",
      render: (_text: string, record: StampItemType) => (
        <div style={{ display: "flex" }}>
          <Button
            onClick={() => {
              setSelectedStamp(record);
              setOpenEdit(true);
            }}
            type="primary"
            style={{
              marginRight: 10,
            }}
          >
            <EditFilled />
          </Button>
          <Button onClick={() => downloadStamp(record)} type="dashed">
            <DownloadOutlined />
          </Button>
        </div>
      ),
      width: "30%",
    },
  ];

  const Header = ({ title }: { title?: string }) => (
    <Box
      display="flex"
      alignItems="center"
      gap={1}
      color={theme.colors.backgroundText}
    >
      <TableOutlined />
      <span>{title}</span>
    </Box>
  );

  const downloadStamp = async (stamp: StampItemType) => {
    setDownloadVisible(true);
    const response = await downloadAStampDoc(stamp, (percent) => {
      setProgress(percent);
    });
    setDownloadVisible(false);

    if (!response) {
      message.error(
        isEnglish
          ? "Something went wrong! Please contact your system administrator"
          : "حدث خطأ ما، يرجى الاتصال بمسؤول النظام"
      );
    }
    resetSelections();
  };

  const resetSelections = () => {
    setSelectedStamp(undefined);
  };

  return (
    <>
      <Accordion
        header={<Header title={labels.til.stamps_general_list} />}
        panelKey=""
        collapseContainerStyleProps={{
          backgroundColor: theme.colors.primary,
        }}
        icon={<FilterOutlined />}
      >
        <Row style={{ padding: 0 }}>
          <Col
            span={24}
            style={{
              borderRadius: "2px",
              marginTop: 20,
            }}
          >
            <Table<StampItemType>
              showSorterTooltip
              sortDirections={["ascend", "descend"]}
              columns={columns}
              dataSource={stamps}
              scroll={{ x: "max-content" }}
              style={{ marginTop: 15, width: "100%" }}
              rowKey="ID"
              pagination={{
                size: "small",
                // showTotal: () =>
                //   `${isEnglish ? "Total" : "المجموع"} ${stamps.length} ${
                //     isEnglish ? "items" : "أغراض"
                //   }`,
                position: ["bottomCenter"],
                showSizeChanger: false,
                // pageSizeOptions: [5, 10, 20],
                hideOnSinglePage: true,
                style: { marginRight: 10 },
                showQuickJumper: true,
                total: stamps.length,
                locale: {
                  jump_to: isEnglish ? "Go to" : "اذهب الى",
                  page: isEnglish ? "Page" : "صفحة",
                  prev_page: isEnglish ? "Previous" : "خلف",
                  next_page: isEnglish ? "Next" : "التالي",
                  items_per_page: isEnglish ? "/ Page" : "/ صفحة",
                },
              }}
            />
          </Col>
          {openEdit && (
            <EditGeneralStampModal
              visible={openEdit}
              onClose={() => setOpenEdit(false)}
              activateLoader={activateLoader}
              refreshPage={refreshPage}
              stamp={selectedStamp}
            />
          )}
        </Row>
      </Accordion>
      <DownloadProgress progress={progress} visible={downloadVisible} />
    </>
  );
}
