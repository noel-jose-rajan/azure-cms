import { useLanguage } from "@/context/language";
import { useTheme } from "@/context/theme";
import { Col, Row, Table, TableColumnsType, Tag } from "antd";
import { CorrespondenceType } from "@/components/services/search/type";
import { useNavigate } from "react-router-dom";
import { ExportOutlined } from "@ant-design/icons";
import usePicklist from "@/store/picklists/use-picklist";
import { PicklistKeys } from "@/store/picklists/picklists.store";
import moment from "moment";

const SearchTable = ({
  data,
  pagination,
  handlePageChange,
  total,
}: {
  data: CorrespondenceType[];
  pagination: { page: number; perPage: number };
  handlePageChange: (page: number, pageSize?: number) => void;
  total: number;
}) => {
  const {
    isEnglish,
    labels: { lbl, til },
  } = useLanguage();
  const { theme } = useTheme();
  const navigate = useNavigate();
  const { getPicklistById } = usePicklist();

  const getThePiickList = (key: PicklistKeys, id: number) => {
    const pl = getPicklistById(key, id);

    if (pl) {
      return isEnglish ? pl.picklist_en_label : pl.picklist_ar_label;
    }
    return "-";
  };

  const columns: TableColumnsType<CorrespondenceType> = [
    {
      title: til.search_result,
      dataIndex: "corr_subject",
      render: (text: string, record: CorrespondenceType) => (
        <Row>
          <Col span={12}>
            <span>
              <p
                style={{ cursor: "pointer", marginBottom: 10 }}
                onClick={() => navigate(`/correspondence/${record.id}`)}
              >
                <h3 style={{ color: theme.colors.accent, margin: 0 }}>
                  {record.corr_subject} <ExportOutlined />
                </h3>
              </p>
              <p style={{ fontSize: 15, marginBottom: 7 }}>
                {getThePiickList("Correspondence Type", record.corr_type_id)}
              </p>
              <p style={{ fontSize: 12 }}>
                {lbl.sending_entity}: <Tag>{record.sending_entity ?? "-"}</Tag>
              </p>
              <p style={{ fontSize: 12 }}>
                {lbl.receiving_entity}: <Tag>{record.receiving_entity}</Tag>
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
              <p style={{ textAlign: "right", fontSize: 12 }}>
                {lbl.corr_date + ": "}
                {record.correspondence_date ? (
                  <Tag>
                    {moment(record.correspondence_date).format("DD/MM/YYYY")}
                  </Tag>
                ) : (
                  "-"
                )}
              </p>
              <p style={{ textAlign: "right", fontSize: 12 }}>
                {lbl.creation_date + ": "}
                {record.created_at ? (
                  <Tag>{moment(record.created_at).format("DD/MM/YYYY")}</Tag>
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
    <Table<CorrespondenceType>
      showSorterTooltip
      sortDirections={["ascend", "descend"]}
      columns={columns}
      dataSource={data}
      style={{ marginTop: 15 }}
      scroll={{ x: "max-content" }}
      rowKey={(record, index) => `${record.id}-${index}`}
      pagination={{
        size: "small",
        current: pagination?.page,
        pageSize: pagination?.perPage,
        defaultPageSize: pagination?.perPage,
        // showTotal: () =>
        //   `${isEnglish ? "Total" : "المجموع"} ${total} ${
        //     isEnglish ? "items" : "أغراض"
        //   }`,
        showSizeChanger: false,
        // pageSizeOptions: [5, 10, 20],
        style: { marginRight: 10 },
        showQuickJumper: true,
        hideOnSinglePage: true,
        position: ["bottomCenter"],

        total: total,
        onChange: handlePageChange,
        locale: {
          jump_to: isEnglish ? "Go to" : "اذهب الى",
          page: isEnglish ? "Page" : "صفحة",
          prev_page: isEnglish ? "Previous" : "خلف",
          next_page: isEnglish ? "Next" : "التالي",
          items_per_page: isEnglish ? "/ Page" : "/ صفحة",
        },
      }}
    />
  );
};

export default SearchTable;
