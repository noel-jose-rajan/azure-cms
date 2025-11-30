import { useLanguage } from "@/context/language";
import { useTheme } from "@/context/theme";
import { Col, Row, TableColumnsType, Tag } from "antd";
import { useNavigate } from "react-router-dom";
import { ExportOutlined } from "@ant-design/icons";
import usePicklist from "@/store/picklists/use-picklist";
import { PicklistKeys } from "@/store/picklists/picklists.store";
import moment from "moment";
import { CorrespondenceFilterResult } from "../../service";
import TableComponent from "@/components/ui/table-component";
import { useState } from "react";
import ButtonComponent from "@/components/ui/button";
import { RelatedCorr } from "@/components/services/outbound/types";
import { RowSelectionType } from "antd/es/table/interface";

type Props = {
  loading: boolean;
  data: CorrespondenceFilterResult[];
  pagination: { page: number; perPage: number };
  handlePageChange: (page: number, pageSize?: number) => void;
  total: number;
  onSelect: (selectedRowKeys: RelatedCorr[]) => void;
  selectedCorrs: RelatedCorr[];
  onClose?: () => void;
};
const RelatedCorrTable = ({
  loading,
  data,
  pagination,
  handlePageChange,
  total,
  onSelect,
  selectedCorrs = [],
  onClose,
}: Props) => {
  const {
    isEnglish,
    labels: { lbl, til, btn },
  } = useLanguage();
  const { theme } = useTheme();
  const navigate = useNavigate();
  const { getPicklistById } = usePicklist();

  // Multi-select state
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>(
    selectedCorrs?.map((item) => item.id) || []
  );
  const [selectedIds, setSelectedIds] = useState<RelatedCorr[]>(selectedCorrs);

  const checkData = () => {
    const fromThisPage = [] as RelatedCorr[];
    const fromOtherPage = [] as RelatedCorr[];

    selectedIds.forEach((item) => {
      if (data.some((d) => d.id === item.id)) {
        fromThisPage.push(item);
      } else {
        fromOtherPage.push(item);
      }
    });
    return { fromThisPage, fromOtherPage };
  };

  const rowSelection = {
    type: "checkbox" as RowSelectionType,
    selectedRowKeys,
    onChange: (
      newSelectedRowKeys: React.Key[],
      selectedRows: CorrespondenceFilterResult[]
    ) => {
      // Clear logic (if user deselects everything)
      // if (newSelectedRowKeys.length === 0) {
      //   setSelectedRowKeys([]);
      //   setSelectedIds([]);
      //   return;
      // }

      const { fromOtherPage } = checkData();

      const filtered = data?.filter((v) => newSelectedRowKeys.includes(v.id));
      const allData = [...(filtered || []), ...(fromOtherPage || [])];

      setSelectedRowKeys(allData.map((item) => item.id));

      setSelectedIds(allData);
    },
  };
  const getThePiickList = (key: PicklistKeys, id: number) => {
    const pl = getPicklistById(key, id);

    if (pl) {
      return isEnglish ? pl.picklist_en_label : pl.picklist_ar_label;
    }
    return "-";
  };

  const columns: TableColumnsType<CorrespondenceFilterResult> = [
    {
      title: til.search_result,
      dataIndex: "corr_subject",
      render: (text: string, record: CorrespondenceFilterResult) => (
        <Row>
          <Col span={12}>
            <span>
              <span
                style={{ cursor: "pointer", marginBottom: 10 }}
                // onClick={() => navigate(`/correspondence/${record.id}`)}
              >
                <h3
                  style={{
                    // color: theme.colors.accent,
                    margin: 0,
                  }}
                >
                  {record.corr_subject} <ExportOutlined />
                </h3>
              </span>
              <p style={{ fontSize: 15, marginBottom: 7 }}>
                {getThePiickList("Correspondence Type", record.corr_type_id)}
              </p>
              <p style={{ fontSize: 12, marginBottom: 4 }}>
                {lbl.sending_entity}:{" "}
                <Tag color={theme.colors.accent}>
                  {record.sending_entity ?? "-"}
                </Tag>
              </p>
              <p style={{ fontSize: 12 }}>
                {lbl.receiving_entity}:{" "}
                <Tag color={theme.colors.accent}>
                  {record.receiving_entity ?? "-"}
                </Tag>
              </p>
            </span>
          </Col>
          <Col
            span={12}
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "right",
              alignItems: "end",
            }}
          >
            <span>
              <p style={{ textAlign: "right" }}>
                <b>{record.correspondence_no ?? "--"}</b>
              </p>
              <p style={{ textAlign: "right", fontSize: 12, marginBottom: 8 }}>
                {lbl.corr_date + ": "}
                {record.correspondence_date ? (
                  <span>
                    {moment(record.correspondence_date).format("DD/MM/YYYY")}
                  </span>
                ) : (
                  "-"
                )}
              </p>
              <p style={{ textAlign: "right", fontSize: 12 }}>
                {lbl.creation_date + ": "}
                {record.created_at ? (
                  <span>{moment(record.created_at).format("DD/MM/YYYY")}</span>
                ) : (
                  "-"
                )}
              </p>
              <p
                style={{
                  textAlign: "right",
                  fontSize: 14,
                  marginRight: 10,
                  marginTop: 5,
                }}
              >
                <b>
                  {getThePiickList("Status", record.corr_status_id) ?? "--"}
                </b>
              </p>
            </span>
          </Col>
        </Row>
      ),
    },
  ];

  return (
    <>
      <TableComponent<CorrespondenceFilterResult>
        rowSelection={rowSelection}
        isLoading={loading}
        showSorterTooltip
        sortDirections={["ascend", "descend"]}
        columns={columns}
        dataSource={data}
        style={{ marginTop: 15 }}
        scroll={{ x: "max-content" }}
        rowKey={"id"}
        pagination={{
          position: ["bottomCenter"],
          size: "small",
          current: pagination?.page,
          pageSize: pagination?.perPage,
          defaultPageSize: pagination?.perPage,
          hideOnSinglePage: true,
          // showTotal: () =>
          //   `${isEnglish ? "Total" : "المجموع"} ${total} ${
          //     isEnglish ? "items" : "أغراض"
          //   }`,
          showSizeChanger: false,
          // style: { marginRight: 10 },
          showQuickJumper: true,
          total: total,
          onChange: handlePageChange,
          locale: {
            jump_to: isEnglish ? "Go to" : "اذهب الى",
            page: isEnglish ? "Page" : "صفحة",
            //   prev_page: isEnglish ? "Previous" : "خلف",
            //   next_page: isEnglish ? "Next" : "التالي",
            //   items_per_page: isEnglish ? "/ Page" : "/ صفحة",
          },
        }}
      />
      <Row>
        <Col span={24} style={{ textAlign: "right", marginTop: 10 }}>
          <ButtonComponent
            type="primary"
            onClick={() => onSelect(selectedIds)}
            icon={<ExportOutlined />}
            buttonLabel={btn.select}
          />
          <ButtonComponent
            onClick={onClose}
            icon={<ExportOutlined />}
            buttonLabel={btn.cancel}
            style={{ marginInline: 10 }}
          />
        </Col>
      </Row>
    </>
  );
};

export default RelatedCorrTable;
