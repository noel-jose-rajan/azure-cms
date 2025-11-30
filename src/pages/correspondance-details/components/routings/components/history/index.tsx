import { Col, Spin, Table, TableColumnsType } from "antd";
import { useLanguage } from "../../../../../../context/language";
import { HistoryRecordType } from "../../../../types";
import { useTheme } from "../../../../../../context/theme";
import { DateHelper } from "../../../../../../components/functional/date";
import { useEffect, useState } from "react";
import { getTheHistoryOfRouting } from "../../../../service";
import { LoadingOutlined } from "@ant-design/icons";

export default function RoutingHistoryComponent({ id }: { id: string }) {
  const { labels, isEnglish } = useLanguage();
  const { theme } = useTheme();
  const [history, setHistory] = useState<HistoryRecordType[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const getAllHistoryDetails = async () => {
    setHistory([]);
    setLoading(true);
    const response = await getTheHistoryOfRouting(id);

    if (response) {
      setHistory(response);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (id) {
      getAllHistoryDetails();
    }
  }, [id]);
  const columns: TableColumnsType<HistoryRecordType> = [
    {
      title: (
        <label style={{ fontSize: 14 }}>{labels.tbl.performer_username}</label>
      ),
      dataIndex: "performerUserDescription",
      render: (text: string) => (
        <label style={{ color: theme.colors.primary, fontSize: 14 }}>
          {text}
        </label>
      ),
      sorter: {
        compare: (a, b) =>
          b.performerUserDescription
            .toLowerCase()
            .localeCompare(a.performerUserDescription.toLowerCase()),
        multiple: 3,
      },
    },
    {
      title: <label style={{ fontSize: 14 }}>{labels.tbl.action_date}</label>,
      dataIndex: "actionDate",
      render: (text: string) => (
        <label style={{ color: theme.colors.primary, fontSize: 14 }}>
          {text ? DateHelper.convertDateFormat(text) : "-"}
        </label>
      ),
      sorter: {
        compare: (a, b) => b.actionDate.localeCompare(a.actionDate),
        multiple: 3,
      },
    },
    {
      title: (
        <label style={{ fontSize: 14 }}>{labels.tbl.performer_action}</label>
      ),
      dataIndex: "performerActionPickListDTO",
      render: (text) => (
        <label style={{ color: theme.colors.primary, fontSize: 14 }}>
          {text
            ? isEnglish
              ? text.picklistEnLabel
              : text.picklistArLabel
            : "-"}
        </label>
      ),
    },
    {
      title: (
        <label style={{ fontSize: 14 }}>{labels.tbl.performer_comment}</label>
      ),
      dataIndex: "performerComment",
      render: (text: string) => (
        <label style={{ color: theme.colors.primary, fontSize: 14 }}>
          {text ?? "-"}
        </label>
      ),
      sorter: {
        compare: (a, b) => b.performerComment.localeCompare(a.performerComment),
        multiple: 3,
      },
    },
  ];

  return (
    <Col style={{ padding: 10 }}>
      <Spin spinning={loading} size="small" indicator={<LoadingOutlined />}>
        <Table<HistoryRecordType>
          showSorterTooltip
          sortDirections={["ascend", "descend"]}
          columns={columns}
          dataSource={history}
          style={{ width: "100%" }}
          rowKey="index"
          pagination={false}
        />
      </Spin>
    </Col>
  );
}
