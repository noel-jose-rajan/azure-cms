import { Button, Col, TableColumnsType, Tag, Tooltip } from "antd";
import { useLanguage } from "@/context/language";
import TableComponent from "@/components/ui/table-component";
import ActionMenuItem from "@/components/ui/menu-item";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import { AdminDelegationSearch } from "../../service";
import { CheckOutlined, InfoCircleFilled } from "@ant-design/icons";
import { useTheme } from "@/context/theme";
import { Pagination } from "@/pages/dashboard_new/manager-dashboard/components/filter-tasks/components/table/type";
import usePicklist from "@/store/picklists/use-picklist";
import CancelModal from "../cancel-modal";
import { useState } from "react";

type Props = {
  data: AdminDelegationSearch[];
  onPagination: (page: number) => void;
  pagination: Pagination;
  refresh: () => void;
};
const DelegationTable = ({
  data,
  onPagination,
  pagination,
  refresh,
}: Props) => {
  const { labels, isEnglish } = useLanguage();
  const { getPicklistById } = usePicklist();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const [cancelId, setCancelId] = useState<null | number>(null);
  const columns: TableColumnsType<AdminDelegationSearch> = [
    {
      width: 150,
      title: labels.lbl.delegation_from,
      dataIndex: "delegator_user_name",
      render: (u: string) => {
        return <span>{u || "-"}</span>;
      },
    },
    {
      width: 150,
      title: labels.lbl.creator,
      dataIndex: "creator_name",
      render: (u: string) => {
        return <span>{u || "-"}</span>;
      },
    },
    {
      width: 150,
      title: labels.lbl.delegation_to,

      dataIndex: "delegate_to",
      render: (arr: string[]) => {
        return (
          <div>
            {arr?.map((u) => (
              <Tag color={theme.colors.primary}>{u} </Tag>
            ))}
          </div>
        );
      },
    },

    {
      width: 150,
      title: labels.lbl.date_from,
      dataIndex: "date_from",
      render: (text: string) => (
        <span>{moment(text)?.format("DD-MM-YYYY")}</span>
      ),
    },
    {
      width: 150,
      title: labels.lbl.date_to,
      dataIndex: "date_to",
      render: (text: string) => (
        <span>{moment(text)?.format("DD-MM-YYYY")}</span>
      ),
    },
    {
      width: 150,
      title: labels.lbl.delegate_all,
      dataIndex: "delegate_all",
      render: (bool: boolean) => {
        return (
          <span>
            {bool ? (
              <CheckOutlined style={{ color: theme.colors.success }} />
            ) : (
              <>⛔</>
            )}
          </span>
        );
      },
    },
    {
      width: 100,

      title: labels.lbl.status,
      dataIndex: "status_id",
      render: (id: string) => {
        const p = getPicklistById("DelegationStatus", id);
        return (
          <a style={{ color: theme.colors.primary }}>
            {(isEnglish ? p?.picklist_en_label : p?.picklist_ar_label) ||
              (isEnglish ? "Created" : "تم الأنشاء")}
          </a>
        );
      },
    },
    {
      title: labels.tbl.action,
      dataIndex: "id",
      width: 100,
      render: (id, record) => {
        const disable = record?.status_id == 3;
        return (
          <div style={{ display: "flex", alignItems: "center" }}>
            <Tooltip title={labels.btn.cancel}>
              <Button
                type="link"
                size="small"
                onClick={() => setCancelId(id)}
                disabled={disable}
                style={{ opacity: disable ? 0.3 : 1 }}
              >
                🚫
              </Button>
            </Tooltip>
            <Button
              type="link"
              size="small"
              onClick={() => navigate("/admin/delegation/" + id)}
            >
              <InfoCircleFilled />
            </Button>
          </div>
        );
      },
      // sorter: {
      //   compare: (a, b) =>
      //     DateHelper.getTime(b.createdDate) - DateHelper.getTime(a.createdDate),
      //   multiple: 3,
      // },
    },
  ];

  return (
    <Col
      style={{
        borderRadius: "2px",
        marginTop: 20,
        border: "1px solid #cbcbcb",
      }}
    >
      <Col
        style={{
          flexDirection: isEnglish ? "row" : "row-reverse",
          display: "flex",
          flexWrap: "wrap",
        }}
      >
        <ActionMenuItem
          onClick={() => navigate("/admin/delegation/create")}
          isActive
          label={labels.btn.add_new}
          type="add"
        />
      </Col>
      <TableComponent<AdminDelegationSearch>
        sortDirections={["ascend", "descend"]}
        columns={columns}
        dataSource={data}
        rowKey="id"
        scroll={{ x: "max-content" }}
        pagination={{
          position: ["bottomCenter"],
          size: "small",
          hideOnSinglePage: true,
          current: pagination.page,
          style: { marginRight: 10 },
          total: pagination.total,
          pageSize: 10,
          showQuickJumper: true,
          showSizeChanger: false,
          locale: {
            jump_to: isEnglish ? "Go to" : "اذهب الى",
            page: isEnglish ? "Page" : "صفحة",
            prev_page: isEnglish ? "Previous" : "السابق",
            next_page: isEnglish ? "Next" : "التالي",
            items_per_page: isEnglish ? "/ Page" : "/ صفحة",
          },
          onChange(page: number) {
            onPagination(page);
          },
        }}
      />
      {cancelId && (
        <CancelModal
          onClose={() => setCancelId(null)}
          onSubmit={refresh}
          id={cancelId}
        />
      )}
    </Col>
  );
};

export default DelegationTable;
