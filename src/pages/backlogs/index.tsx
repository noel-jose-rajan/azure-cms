import {
  Button,
  Col,
  Table,
  TableColumnsType,
  TableProps,
  message,
} from "antd";
import { useLanguage } from "../../context/language";
import TitleBar from "../../components/ui/bar/title-bar";
import {
  DownloadOutlined,
  EditFilled,
  PlusOutlined,
  SyncOutlined,
} from "@ant-design/icons";
import { useEffect, useState } from "react";
import {
  InboundCorrListType,
  deleteADraft,
  downloadCorrespondenceDoc,
  getAllInbounds,
} from "./service";
import LoaderComponent from "../../components/ui/loader";
import { HttpStatus } from "../../components/functional/httphelper";
import ActionMenuItem from "../../components/ui/menu-item";
import { useTheme } from "../../context/theme";
import { DateHelper } from "../../components/functional/date";
import { useNavigate } from "react-router-dom";
import ModalComponent from "../../components/ui/modal";

export default function BacklogsPage() {
  const { labels, isEnglish } = useLanguage();
  const { theme } = useTheme();
  const [drafts, setDrafts] = useState<InboundCorrListType[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [openDelete, setOpenDelete] = useState<boolean>(false);

  const navigate = useNavigate();

  useEffect(() => {
    init();
  }, []);

  const init = async () => {
    setLoading(true);
    const response = await getAllInbounds();

    if (response.status === HttpStatus.SUCCESS) {
      setDrafts(response.data ?? []);
    } else {
      message.error(
        isEnglish
          ? "Something went wrong! Please contact your system administrator"
          : "حدث خطأ ما، يرجى الاتصال بمسؤول النظام"
      );
    }

    setLoading(false);
  };

  const rowSelection: TableProps<InboundCorrListType>["rowSelection"] = {
    selectedRowKeys,
    onChange: (keys: React.Key[], _rows: InboundCorrListType[]) => {
      setSelectedRowKeys(keys);
    },
  };

  const columns: TableColumnsType<InboundCorrListType> = [
    {
      title: labels.tbl.description,
      dataIndex: "subject",
      render: (text: string, record: InboundCorrListType) => (
        <a
          style={{ color: theme.colors.accent }}
          onClick={() => navigate(`/correspondence/${record.corrId}`)}
        >
          {text === "" ? labels.msg.no_subject : text}
        </a>
      ),
    },
    {
      title: labels.tbl.type,
      dataIndex: "createdDate",
      render: (text: string) => (
        <a style={{ color: theme.colors.primary }}>
          {text === null || text === "null" ? "-" : text}
        </a>
      ),
      sorter: {
        compare: (a, b) =>
          DateHelper.getTime(b.createdDate) - DateHelper.getTime(a.createdDate),
        multiple: 3,
      },
    },
    {
      title: "",
      dataIndex: "corrId",
      render: (text: string) => (
        <>
          <Button
            type="primary"
            onClick={() => navigate(text)}
            style={{ marginRight: 15 }}
          >
            <EditFilled />
          </Button>
          <Button type="primary" onClick={() => downloadCorrespondence(text)}>
            <DownloadOutlined />
          </Button>
        </>
      ),
      sorter: {
        compare: (a, b) =>
          DateHelper.getTime(b.createdDate) - DateHelper.getTime(a.createdDate),
        multiple: 3,
      },
    },
  ];

  const downloadCorrespondence = async (id: string) => {
    setLoading(true);
    const response = await downloadCorrespondenceDoc(id);

    if (response?.status !== HttpStatus.SUCCESS) {
      message.error(
        isEnglish
          ? "Something went wrong! Please contact your system administrator"
          : "حدث خطأ ما، يرجى الاتصال بمسؤول النظام"
      );
    }

    setLoading(false);
  };

  const deleteDraftCorrespondence = async () => {
    if (selectedRowKeys.length === 0) return;
    setLoading(true);

    const payLoad = selectedRowKeys.map((rowId) => {
      return {
        corrId: rowId.toString(),
      };
    });

    const response = await deleteADraft(payLoad);

    if (response.status === HttpStatus.SUCCESS) {
      const filtered = drafts.filter(
        (corr) => !selectedRowKeys.includes(corr.corrId)
      );

      setDrafts(filtered);
    } else {
      message.error(
        isEnglish
          ? "Something went wrong! Please contact your system administrator"
          : "حدث خطأ ما، يرجى الاتصال بمسؤول النظام"
      );
    }

    setOpenDelete(false);
    setLoading(false);
  };

  return (
    <>
      <Col>
        <TitleBar headerText={isEnglish ? "Backlogs" : "المتراكمة"} />
        <Col
          style={{ display: "flex", justifyContent: "flex-end", marginTop: 20 }}
        >
          <Button
            type="primary"
            style={{ marginLeft: 10, marginRight: 10 }}
            onClick={() => {
              navigate("create");
            }}
          >
            <PlusOutlined />
            {isEnglish ? "New Backlog" : "تراكم جديد"}
          </Button>
          <Button type="primary" style={{ borderRadius: 25 }} onClick={init}>
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
              height: 55,
            }}
          >
            <ActionMenuItem
              onClick={() => {
                setOpenDelete(true);
              }}
              isActive={selectedRowKeys.length > 0}
              label={labels.btn.delete}
              type="delete"
            />
          </div>
          <Table<InboundCorrListType>
            rowSelection={{ type: "checkbox", ...rowSelection }}
            showSorterTooltip
            sortDirections={["ascend", "descend"]}
            columns={columns}
            dataSource={drafts}
            style={{ width: "100%" }}
            scroll={{ x: "max-content" }}
            rowKey="corrId"
            pagination={{
              size: "small",
              showTotal: () =>
                `${isEnglish ? "Total" : "المجموع"} ${drafts.length} ${
                  isEnglish ? "items" : "أغراض"
                }`,
              showSizeChanger: true,
              pageSizeOptions: [5, 10, 20],
              style: { marginRight: 10 },
              showQuickJumper: true,
              total: drafts.length,
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
      </Col>
      {openDelete && (
        <ModalComponent
          title={
            isEnglish ? "Delete Draft Correspondence" : "حذف مسودة المراسلات"
          }
          description={labels.msg.if_delete_draft_corres}
          visible={openDelete}
          onClose={() => setOpenDelete(false)}
          onSubmit={deleteDraftCorrespondence}
          okText={labels.btn.delete}
        />
      )}
      <LoaderComponent loading={loading} />
    </>
  );
}
