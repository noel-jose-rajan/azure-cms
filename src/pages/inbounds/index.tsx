import { Button, Col, TableColumnsType, message } from "antd";
import { useLanguage } from "../../context/language";
import TitleBar from "../../components/ui/bar/title-bar";
import {
  DeleteFilled,
  DownloadOutlined,
  EditFilled,
  PlusOutlined,
  SyncOutlined,
} from "@ant-design/icons";
import { useEffect, useState } from "react";
import { useTheme } from "../../context/theme";
import { useNavigate } from "react-router-dom";
import ModalComponent from "../../components/ui/modal";
import moment from "moment";
import {
  deleteDraft,
  downloadCorrespondenceDocument,
  getDrafts,
  DraftType,
} from "@/components/shared/outbound/service";
import TableComponent from "@/components/ui/table-component";
import FadeInWrapperAnimation from "@/animations/fade-in-wrapper-animation";
import useHandleError from "@/components/hooks/useHandleError";
import CreateInboundModal from "./components/create-modal";

export default function InBoundPage() {
  const { labels, isEnglish } = useLanguage();
  const { theme } = useTheme();
  const { handleError } = useHandleError();
  const [drafts, setDrafts] = useState<DraftType[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [deletedId, setDeletedId] = useState<number | null>(null);
  const [deleteLoading, setDeleteLoading] = useState<boolean>(false);
  const [openCreateModal, setOpenCreateModal] = useState<boolean>(false);
  const [pagination, setPagination] = useState<{
    page: number;
    total: number;
    size: number;
  }>({
    page: 1,
    total: 10,
    size: 10,
  });

  const navigate = useNavigate();

  useEffect(() => {
    fetchAllDrafts();
  }, [pagination.size, pagination.page]);

  const fetchAllDrafts = async () => {
    try {
      setLoading(true);
      const response = await getDrafts(1, pagination.page);

      setDrafts(response?.Data?.Rows || []);
      setPagination((prev) => {
        return {
          ...prev,
          total: response?.Data?.Total ?? 0,
        };
      });
    } catch (err) {
      handleError(err);
    } finally {
      setLoading(false);
    }
  };

  const columns: TableColumnsType<DraftType> = [
    {
      title: labels.tbl.subject,
      dataIndex: "corr_subject",
      render: (_text: string, record: DraftType) => {
        return (
          <span>
            {record.corr_subject === null || record.corr_subject === ""
              ? labels.lbl.subject
              : record.corr_subject}
          </span>
        );
      },
      width: 300,
      ellipsis: true,
    },
    {
      title: labels.tbl.date_created,
      dataIndex: "created_at",
      render: (_text: string, record: DraftType) => {
        return (
          <a
            style={{ color: theme.colors.primary }}
            onClick={() => navigate(record.id)}
          >
            {moment(_text).format("MM-DD-YYYY")}
          </a>
        );
      },
      width: 200,
    },
    {
      title: labels.tbl.action,
      dataIndex: "id",
      width: 150,
      render: (id, record) => (
        <div style={{ display: "flex", gap: 0 }}>
          <Button
            type="link"
            size="small"
            onClick={() => {
              navigate("/correspondence/inbound/" + record.id);
            }}
            style={{ color: theme.colors.success }}
          >
            <EditFilled />
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => downloadCorrespondence(record)}
          >
            <DownloadOutlined />
          </Button>
          <Button
            type="link"
            size="small"
            danger
            onClick={() => setDeletedId(id)}
          >
            <DeleteFilled />
          </Button>
        </div>
      ),
      // sorter: {
      //   compare: (a, b) =>
      //     DateHelper.getTime(b.createdDate) - DateHelper.getTime(a.createdDate),
      //   multiple: 3,
      // },
    },
  ];

  const downloadCorrespondence = async (draft: DraftType) => {
    if (!draft) return;
    try {
      await downloadCorrespondenceDocument(draft?.id?.toString(), ".pdf");
    } catch (e) {
      message.error(
        isEnglish
          ? "Something went wrong! Please contact your system administrator"
          : "حدث خطأ ما، يرجى الاتصال بمسؤول النظام"
      );
    }
  };

  const deleteDraftCorrespondence = async () => {
    if (!deletedId) return;
    try {
      setDeleteLoading(true);
      const response = await deleteDraft(deletedId);
    } catch (err) {
      handleError(err);
    } finally {
      setDeletedId(null);
      setDeleteLoading(false);
      fetchAllDrafts();
    }
  };

  return (
    <FadeInWrapperAnimation enableScaleAnimation={false} animateDuration={0.75}>
      <Col>
        <TitleBar headerText={labels.til.inbound} />
        <Col
          style={{ display: "flex", justifyContent: "flex-end", marginTop: 20 }}
        >
          <Button
            type="primary"
            style={{ marginLeft: 10, marginRight: 10 }}
            onClick={() => {
              setOpenCreateModal(true);
            }}
          >
            <PlusOutlined />
            {labels.btn.new_inbound}
          </Button>
          <Button
            type="primary"
            style={{ borderRadius: 25 }}
            onClick={fetchAllDrafts}
          >
            <SyncOutlined />
          </Button>
        </Col>
        <Col
          span={24}
          style={{
            borderRadius: "2px",
            marginTop: 20,
            border: "1px solid #cbcbcb",
          }}
        >
          <div
            style={{
              flexDirection: isEnglish ? "row" : "row-reverse",
              display: "flex",
              flexWrap: "wrap",
            }}
          ></div>
          <TableComponent<DraftType>
            isLoading={loading}
            sortDirections={["ascend", "descend"]}
            columns={columns}
            dataSource={drafts}
            scroll={{ x: "max-content" }}
            size="small"
            style={{ marginTop: 15, width: "100%" }}
            rowKey="id"
            pagination={{
              hideOnSinglePage: true,
              size: "small",
              // showTotal: () =>
              //   `${isEnglish ? "Total" : "المجموع"} ${pagination.total} ${
              //     isEnglish ? "items" : "أغراض"
              //   }`,
              position: ["bottomCenter"],
              showSizeChanger: false,
              pageSize: 10,
              // pageSizeOptions: [2, 5, 10, 20],
              // style: { marginRight: 10 },
              showQuickJumper: true,
              total: pagination.total,
              onChange(page: number, pageSize: number) {
                setPagination((prev) => {
                  return { ...prev, page: page, size: pageSize };
                });
              },
              locale: {
                jump_to: isEnglish ? "Go to" : "اذهب الى",
                page: isEnglish ? "Page" : "صفحة",
                prev_page: isEnglish ? "Previous" : "السابق",
                next_page: isEnglish ? "Next" : "التالي",
                items_per_page: isEnglish ? "/ Page" : "/ صفحة",
              },
            }}
          />
        </Col>
      </Col>
      {deletedId !== null && (
        <ModalComponent
          title={
            isEnglish ? "Delete Draft Correspondence" : "حذف مسودة المراسلات"
          }
          description={labels.msg.if_delete_draft_corres}
          visible={deletedId !== null}
          onClose={() => setDeletedId(null)}
          onSubmit={deleteDraftCorrespondence}
          okText={labels.btn.delete}
          loading={deleteLoading}
        />
      )}

      {openCreateModal && (
        <CreateInboundModal
          onCreate={() => {
            fetchAllDrafts();
          }}
          onClose={() => {
            setOpenCreateModal(false);
          }}
        />
      )}
    </FadeInWrapperAnimation>
  );
}
