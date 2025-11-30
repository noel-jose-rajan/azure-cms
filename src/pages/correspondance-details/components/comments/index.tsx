import { Button, Col, Row, Table, TableColumnsType } from "antd";
import {
  CorrespondenceCommentsType,
  CorrespondenceDetailType,
} from "../../types";
import { useEffect, useState } from "react";
import { getCorrespondenceComments } from "../../service";
import { useLanguage } from "../../../../context/language";
import { useTheme } from "../../../../context/theme";
import { PlusOutlined } from "@ant-design/icons";
import AddCommentModal from "./components/add-comment";
import { DraftCorrespondenceType } from "@/components/services/outbound/types";

interface CorresPondenceCommentsProps {
  details?: DraftCorrespondenceType;
}

export default function CorrespondenceComments({
  details,
}: CorresPondenceCommentsProps) {
  const [comments, setComments] = useState<CorrespondenceCommentsType[]>([]);
  const { labels } = useLanguage();
  const { theme } = useTheme();
  const [loading, setLoading] = useState<boolean>(false);
  const [modalVisible, setModalVisible] = useState<boolean>(false);

  useEffect(() => {
    if (details) {
      // fetchCorrespondenceHistory(details.corrId);
    }
  }, [details]);

  const fetchCorrespondenceHistory = async (id: string) => {
    setLoading(true);
    const response = await getCorrespondenceComments(id);

    if (response) {
      setComments(response);
    }
    setLoading(false);
  };

  const columns: TableColumnsType<CorrespondenceCommentsType> = [
    {
      title: labels.tbl.performer_username,
      dataIndex: "performerUser",
      render: (text: string) => (
        <a style={{ color: theme.colors.primary }}>{text}</a>
      ),
      sorter: {
        compare: (a, b) =>
          b.performerUser
            .toLowerCase()
            .localeCompare(a.performerUser.toLowerCase()),
        multiple: 3,
      },
    },
    {
      title: labels.tbl.action_date,
      dataIndex: "createdDate",
      render: (text: string) => (
        <a style={{ color: theme.colors.primary }}>{text}</a>
      ),
      sorter: {
        compare: (a, b) => {
          const dateA = new Date(a.createdDate.split("-").reverse().join("-"));
          const dateB = new Date(b.createdDate.split("-").reverse().join("-"));
          return dateA.getTime() - dateB.getTime();
        },
        multiple: 3,
      },
    },
    {
      title: labels.lbl.comment,
      dataIndex: "description",
      render: (text: string) => (
        <a style={{ color: theme.colors.primary }}>{text ?? "-"}</a>
      ),
      sorter: {
        compare: (a, b) => b.description.localeCompare(a.description),
        multiple: 3,
      },
    },
  ];

  return (
    <Row style={{ padding: 10 }}>
      <Col span={24} style={{ display: "flex", justifyContent: "flex-end" }}>
        <Button type="primary" onClick={() => setModalVisible(true)}>
          <PlusOutlined />
          {labels.til.AddComment}
        </Button>
      </Col>
      <Table<CorrespondenceCommentsType>
        showSorterTooltip
        sortDirections={["ascend", "descend"]}
        columns={columns}
        dataSource={comments}
        style={{ marginTop: 15, width: "100%" }}
        loading={loading}
        rowKey="corrId"
        pagination={false}
        scroll={{ x: "max-content" }}
      />
      {modalVisible && (
        <AddCommentModal
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          correspondenceId={details?.id.toString()}
          onSubmit={async () => {
            if (details) {
              await fetchCorrespondenceHistory(details?.id.toString());
            }
            setModalVisible(false);
          }}
        />
      )}
    </Row>
  );
}
