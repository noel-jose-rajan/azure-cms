import {
  deleteHoliday,
  getAllHolidays,
  Holiday,
} from "@/components/services/calendar";
import TitleHeader from "@/components/ui/header";
import ActionMenuItem from "@/components/ui/menu-item";
import { useLanguage } from "@/context/language";
import { useTheme } from "@/context/theme";
import { DeleteFilled, EditFilled, SwapOutlined } from "@ant-design/icons";
import { Button, Col, TableColumnsType } from "antd";
import { useEffect, useState } from "react";
import HolidayEditor from "../../holiday-editor";
import moment from "moment";
import TableComponent from "@/components/ui/table-component";
import useHandleError from "@/components/hooks/useHandleError";
import ModalComponent from "@/components/ui/modal";
import useCustomMessage from "@/components/hooks/use-message";

const HolidaysTable = () => {
  const { showMessage } = useCustomMessage();
  const { handleError } = useHandleError();
  const { labels, isEnglish } = useLanguage();
  const [editedHoliday, setEditedHoliday] = useState<null | Holiday>(null);
  const { theme } = useTheme();
  const [officialHolidays, setOfficialHolidays] = useState<Holiday[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [deletedId, setDeletedId] = useState<number | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [pagination, setPagination] = useState<{
    page: number;
    total: number;
    size: number;
  }>({
    page: 1,
    total: 0,
    size: 1,
  });

  useEffect(() => {
    fetchAllHolidays();
  }, [pagination.page]);

  const fetchAllHolidays = async (page = pagination.page) => {
    const response = await getAllHolidays(page);

    if (response) {
      setPagination((prev) => {
        return {
          ...prev,
          total: response?.Total,
        };
      });

      setOfficialHolidays(response?.Rows);
    }
  };

  const columns: TableColumnsType<Holiday> = [
    {
      title: labels.tbl.vacation_name,
      dataIndex: "holiday_name",
      render: (_text: string) => {
        return <span>{_text}</span>;
      },
      width: 300,
      ellipsis: true,
    },
    {
      title: labels.lbl.date_from,
      dataIndex: "start_date",
      render: (_text: string) => {
        return <span>{moment(_text).format("MM-DD-YYYY")}</span>;
      },
      width: 200,
    },
    {
      title: labels.lbl.date_to,
      dataIndex: "end_date",
      render: (_text: string) => {
        return <span>{moment(_text).format("MM-DD-YYYY")}</span>;
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
            style={{ color: theme.colors.success }}
            onClick={() => {
              setEditedHoliday(record);
              setIsModalVisible(true);
            }}
          >
            <EditFilled />
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
    },
  ];

  const handleDelete = async () => {
    try {
      setDeleteLoading(true);
      if (!deletedId) return;
      const res = await deleteHoliday(deletedId);
      if (res) {
        showMessage("success", labels.msg.del_success);
        setDeletedId(null);
        await fetchAllHolidays();
      }
    } catch (e) {
      handleError(e);
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <>
      <Col>
        <TitleHeader
          heading={labels.til.official_vacations}
          icon={<SwapOutlined style={{ color: theme.colors.backgroundText }} />}
        />

        <div
          style={{
            borderRadius: "2px",
            border: `0px solid ${theme.colors.border}`,
          }}
        >
          <div
            style={{
              flexDirection: isEnglish ? "row" : "row-reverse",
              display: "flex",
              flexWrap: "wrap",
            }}
          >
            <ActionMenuItem
              onClick={() => {
                setIsModalVisible(true);
              }}
              isActive={true}
              label={labels.btn.add_new}
              type="add"
            />
            <TableComponent<Holiday>
              // isLoading={loading}
              sortDirections={["ascend", "descend"]}
              columns={columns}
              dataSource={officialHolidays}
              scroll={{ x: "max-content" }}
              size="small"
              style={{ marginTop: 15, width: "100%" }}
              rowKey="id"
              pagination={{
                size: "small",
                position: ["bottomCenter"],
                hideOnSinglePage: true,
                pageSize: 10,
                //   showTotal: () =>
                //     `${isEnglish ? "Total" : "المجموع"} ${pagination.total} ${
                //       isEnglish ? "items" : "أغراض"
                //     }`,
                showSizeChanger: false,
                //   pageSizeOptions: [2, 5, 10, 20],
                style: { marginRight: 10 },
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
          </div>
        </div>
      </Col>
      {deletedId !== null && (
        <ModalComponent
          title={isEnglish ? "Delete Holiday" : "حذف عطلة"}
          description={labels.msg.if_del_holiday}
          visible={deletedId !== null}
          onClose={() => setDeletedId(null)}
          onSubmit={handleDelete}
          okText={labels.btn.delete}
          loading={deleteLoading}
        />
      )}
      {isModalVisible && (
        <HolidayEditor
          refresh={async () => await fetchAllHolidays(1)}
          editedHoliday={editedHoliday}
          onCancel={() => {
            setIsModalVisible(false);
            setEditedHoliday(null);
          }}
          //   handleSave={handleSave}
        />
      )}
    </>
  );
};

export default HolidaysTable;
