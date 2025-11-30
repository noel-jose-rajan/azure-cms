import {
  ArrowLeftOutlined,
  ArrowRightOutlined,
  InsertRowBelowOutlined,
  ReloadOutlined,
  RetweetOutlined,
  TableOutlined,
  UserOutlined,
} from "@ant-design/icons";
import {
  Avatar,
  Col,
  Radio,
  Row,
  TableColumnsType,
  TableProps,
  Tabs,
} from "antd";
import { useEffect, useState } from "react";
import TitleHeader from "../../../../components/ui/header";
import { useLanguage } from "../../../../context/language";
import { useTheme } from "../../../../context/theme";
import { useNavigate } from "react-router-dom";
import TextWithValue from "../../../../components/ui/text-with-value";
import TextWithTag from "../../../../components/ui/text-with-tag";
import TaskInfoIcons from "../task-info-icons";
import { InboxTask } from "@/components/services/inbox";
import usePicklist from "@/store/picklists/use-picklist";
import useGetAllOU from "@/store/orgs/use-get-all-ou";
import useGetAllUsers from "@/store/users/use-get-all-users";
import moment from "moment";
import TabPane from "antd/es/tabs/TabPane";
import { SearchInboxType } from "../../types";
import TableComponent from "@/components/ui/table-component";
import useExternalEntities from "@/store/external-entities/use-external-entities";

interface InboxTableProps {
  inbox: InboxTask[];
  counts: Record<
    string,
    {
      count: number;
      id: string | number;
    }
  >;
  total: number;
  onChange: (page: number, _payload?: Partial<SearchInboxType>) => void;
  loading: boolean;
  all: number;
  currentPage: number;
}

export default function InboxTableCG({
  inbox,
  total,
  onChange,
  counts,
  loading,
  all,
  currentPage,
}: InboxTableProps) {
  const { labels, isEnglish } = useLanguage();
  const { theme } = useTheme();
  const { getPicklistById } = usePicklist();
  const { getOrgById } = useGetAllOU();
  const { getUserById } = useGetAllUsers();
  const { getExternalEntityById } = useExternalEntities();
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const getInitialMode = (): "card" | "table" => {
    const mode = localStorage.getItem("inbox-view-mode");
    return mode === "card" || mode === "table" ? mode : "table";
  };

  const [mode, setMode] = useState<"card" | "table">(getInitialMode());
  const [activeKey, setActiveKey] = useState<string>("0");
  const navigate = useNavigate();
  useEffect(() => {
    if (all == 0) {
      setActiveKey("0");
    }
  }, [all]);
  const columns: TableColumnsType<InboxTask> = [
    {
      width: 100,
      title: "",
      dataIndex: "id",
      render: (_text: string, record: InboxTask) => {
        return <TaskInfoIcons details={record} />;
      },
    },
    {
      title: labels.lbl.task_name,
      dataIndex: "task_type_id",
      width: 120,
      render: (text, record) => {
        const p = getPicklistById("Task Subject", text);

        return (
          <a
            onClick={() => {
              navigate(`/user/inbox/${record?.id}`, {
                state: { from: "inbox" },
              });
            }}
            style={{ color: theme.colors.accent }}
          >
            {(isEnglish ? p?.picklist_en_label : p?.picklist_ar_label) || "-"}
          </a>
        );
      },
    },
    {
      width: 250,
      ellipsis: true,
      title: labels.lbl.subject,
      dataIndex: "corr_subject",
      render: (text) => <span>{text}</span>,
      sorter: true,
    },
    {
      width: 220,
      title: labels.lbl.corr_number,
      dataIndex: "correspondence_no",
      render: (text) => (
        <span style={{ color: theme.colors.primary }}>{text || "-"}</span>
      ),
    },
    {
      width: 150,
      title: labels.lbl.urgency_level,
      dataIndex: "urgency_id",
      render: (id) => {
        const p = getPicklistById("Urgency Level", id);
        const text =
          (isEnglish ? p?.picklist_en_label : p?.picklist_ar_label) ?? "-";
        return <span style={{ color: theme.colors.primary }}>{text}</span>;
      },
    },
    {
      width: 150,
      title: labels.lbl.corr_types,
      dataIndex: "correspondence_type",
      render: (id) => {
        const p = getPicklistById("Correspondence Type", id);
        return (
          <span style={{ color: theme.colors.primary }}>
            {(isEnglish ? p?.picklist_en_label : p?.picklist_ar_label) ?? "-"}
          </span>
        );
      },
    },
    {
      width: 180,
      title: labels.lbl.sending_entity,
      dataIndex: "corr_sending_id",
      render: (id) => {
        const org = getOrgById(id) || getExternalEntityById(id);
        return (
          <span style={{ color: theme.colors.primary }}>
            {(isEnglish ? org?.name_en : org?.name_ar) ?? ""}
          </span>
        );
      },
    },
    {
      width: 180,
      title: labels.lbl.receiving_entity,
      dataIndex: "corr_receiving_id",
      render: (id) => {
        const org = getOrgById(id) || getExternalEntityById(id);

        return (
          <span style={{ color: theme.colors.primary }}>
            {(isEnglish ? org?.name_en : org?.name_ar) || "-"}
          </span>
        );
      },
    },

    {
      width: 180,
      title: labels.lbl.task_sending_entity,
      dataIndex: "from_entity_id",
      render: (id) => {
        const org = getOrgById(id) || getExternalEntityById(id);

        return (
          <span style={{ color: theme.colors.primary }}>
            {(isEnglish ? org?.name_en : org?.name_ar) || "-"}
          </span>
        );
      },
    },
    {
      width: 180,
      title: labels.tbl.task_receiving_entity,
      dataIndex: "to_entity_id",
      render: (text) => {
        const org = getOrgById(text) || getExternalEntityById(text);
        return (
          <span style={{ color: theme.colors.primary }}>
            {org?.name_en || org?.name_ar || "-"}
          </span>
        );
      },
    },

    {
      width: 220,
      title: labels.lbl.send_date,
      dataIndex: "task_date",
      render: (text) => (
        <span>{moment(text).format("YYYY-MM-DD hh:mm:ss a")}</span>
      ),
      sorter: true,
      // sorter: {
      //   compare: (a, b) => b.task_date.localeCompare(a.task_date),
      //   multiple: 3,
      // },
    },
    {
      width: 220,
      title: labels.lbl.task_due_date,
      dataIndex: "task_due_date",
      render: (text) => {
        const isFuture = moment(text).isAfter(moment());
        const color = !isFuture ? "red" : "green";
        return (
          <span style={{ color }}>
            {moment(text).format("YYYY-MM-DD hh:mm:ss a")}
          </span>
        );
      },
    },
    {
      width: 200,

      title: labels.lbl.sender_name,
      dataIndex: "from_user_id",
      render: (text) => {
        const user = getUserById(text);
        return (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <Avatar icon={<UserOutlined size={16} />} />
            <span
              style={{
                color: theme.colors.primary,

                fontSize: 14,
              }}
            >
              {(isEnglish ? user?.name_en : user?.name_ar) || ""}
            </span>
          </div>
        );
      },
    },
    // {
    //   title: labels.lbl.sending_entity,
    //   dataIndex: "corrId",
    //   render: (_text: string, record: InboxCorrespondenceType) => {
    //     const corrType = record.corrTypePickList.picklistCode;
    //     let value = "";
    //     if (corrType === "Corr-Type Int" || corrType === "Corr-Type Announ") {
    //       value = isEnglish
    //         ? record.internalSendingEntityDescEn ?? ""
    //         : record.internalSendingEntityDescAr ?? "";
    //     } else {
    //       value = isEnglish
    //         ? record.externalSendingEntityDescEn ?? "-"
    //         : record.externalSendingEntityDescAr ?? "-";
    //     }
    //     return <a style={{ color: theme.colors.primary }}>{value}</a>;
    //   },
    // },
    // {
    //   title: labels.lbl.receiving_entity,
    //   dataIndex: "corrId",
    //   render: (_text: string, record: InboxCorrespondenceType) => {
    //     let value = isEnglish
    //       ? record.receivingOrganizationUnitsDescEn &&
    //         record.receivingOrganizationUnitsDescEn.length > 0
    //         ? record.receivingOrganizationUnitsDescEn[0]
    //         : "-"
    //       : record.receivingOrganizationUnitsDescAr &&
    //         record.receivingOrganizationUnitsDescAr.length > 0
    //       ? record.receivingOrganizationUnitsDescAr[0]
    //       : "-";

    //     return <a style={{ color: theme.colors.primary }}>{value}</a>;
    //   },
    // },
  ];

  const cardColumns: TableColumnsType<InboxTask> = [
    {
      title: labels.tbl.task,
      dataIndex: "id",
      render: (_: unknown, record: InboxTask) => {
        const corr_type_picklist = getPicklistById(
          "Correspondence Type",
          record?.correspondence_type
        );
        const task_type = getPicklistById("Task Subject", record?.task_type_id);
        const sendingEntity =
          getOrgById(record?.from_entity_id) ||
          getExternalEntityById(record?.from_entity_id);
        const receiving_entity =
          getOrgById(record?.to_entity_id) ||
          getExternalEntityById(record?.to_entity_id);
        const user = getUserById(record?.from_user_id);

        const getColor = (text: string) => {
          const isFuture = moment(text).isAfter(moment());
          return !isFuture ? "red" : "green";
        };
        return (
          <Row>
            <Col span={1}>
              <TaskInfoIcons details={record} verticalMode />
            </Col>
            <Col span={11}>
              <a
                style={{
                  cursor: "pointer",
                  color: theme.colors.accent,
                  fontWeight: "bold",
                  fontSize: 20,
                  padding: 10,
                  display: "block",
                }}
                onClick={() => {
                  navigate(`/user/inbox/${record?.id}`, {
                    state: { from: "inbox" },
                  });
                }}
              >
                {(isEnglish
                  ? task_type?.picklist_en_label
                  : task_type?.picklist_ar_label) || "-"}
              </a>

              <TextWithValue
                primaryText={labels.lbl.corr_subject}
                secondaryText={record?.corr_subject ?? ""}
              />
              <TextWithTag
                primaryText={labels.lbl.sending_entity}
                secondaryText={[
                  (isEnglish
                    ? sendingEntity?.name_en
                    : sendingEntity?.name_ar) || "-",
                ]}
              />
              <TextWithTag
                primaryText={labels.lbl.receiving_entity}
                secondaryText={[
                  (isEnglish
                    ? receiving_entity?.name_en
                    : receiving_entity?.name_ar) || "-",
                ]}
              />
              {/* <TextWithValue
                primaryText={labels.lbl.previous_comment}
                secondaryText={record.action.comments ?? "-"}
              /> */}
              <TextWithValue
                primaryText={labels.lbl.task_due_date}
                secondaryText={moment(record?.task_date).format(
                  "YYYY-MM-DD hh:mm:ss a"
                )}
                secondaryTextStyle={{ color: getColor(record?.task_due_date) }}
              />
            </Col>
            <Col span={12}>
              <Col
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: 15,
                  marginLeft: 10,
                  gap: 10,
                }}
              >
                <Avatar size={50} icon={<UserOutlined />} />
                <a
                  style={{
                    color: theme.colors.primary,

                    fontSize: 14,
                  }}
                >
                  {(isEnglish ? user?.name_en : user?.name_ar) || ""}
                </a>
              </Col>
              <TextWithValue
                primaryText={labels.lbl.corr_number}
                secondaryText={record?.correspondence_no ?? "-"}
              />
              <TextWithValue
                primaryText={labels.lbl.correspondence_type}
                secondaryText={
                  isEnglish
                    ? corr_type_picklist?.picklist_en_label
                    : corr_type_picklist?.picklist_ar_label
                }
              />
              <TextWithValue
                primaryText={labels.lbl.send_date}
                secondaryText={moment(record?.task_date).format(
                  "YYYY-MM-DD hh:mm:ss a"
                )}
              />
            </Col>
          </Row>
        );
      },
    },
  ];

  const rowSelection: TableProps<InboxTask>["rowSelection"] = {
    type: "radio",
    selectedRowKeys,
    onChange: (keys: React.Key[]) => {
      const [selectedKey] = keys;
      setSelectedRowKeys(selectedKey ? [selectedKey] : []);
    },
  };

  const tabStyle = (key: string) => ({
    padding: "8px 16px",
    backgroundColor: activeKey === key ? theme.colors.primary : "unset",
    color: activeKey === key ? theme.colors.backgroundText : "inherit",
    display: "flex",
    alignItems: "center",
    borderRadius: "5px",
  });

  const renderTab = (icon: any, text: string, number: number, key: string) => {
    const numberStyle = (key: string) => ({
      backgroundColor:
        activeKey === key ? theme.colors.accent : theme.colors.backgroundText,
      color: activeKey === key ? "#fff" : theme.colors.accent,
      padding: "2px 9px",
      borderRadius: "12px",
      marginLeft: "8px",
    });

    return (
      <span style={tabStyle(key)}>
        {icon}
        <span style={{ marginLeft: 8 }}>{text}</span>
        <span style={numberStyle(key)}>{number}</span>
      </span>
    );
  };

  const inboundCount =
    counts["PROCESS-TYPE-INBOUND"].count + counts["PROCESS-TYPE-ROUTE"].count ||
    0;
  const outboundCount = counts["PROCESS-TYPE-OUTBOUND"].count || 0;
  const adHocCount = counts["PROCESS-TYPE-AdHOC"].count || 0;
  return (
    <>
      <TitleHeader
        heading={labels.til.tasks}
        icon={<TableOutlined style={{ color: "#fff" }} />}
      />
      <Col
        style={{
          display: "flex",
          justifyContent: !isEnglish ? "flex-end" : "flex-start",
          marginRight: 10,
          marginTop: 10,
        }}
      >
        <Radio.Group
          defaultValue={mode}
          buttonStyle="solid"
          onChange={(e) => {
            setMode(e.target.value);
            localStorage.setItem("inbox-view-mode", e.target.value);
          }}
        >
          <Radio.Button value={"table"}>
            <TableOutlined style={{ marginInline: 10 }} />
            {isEnglish ? "Table" : "جدول"}
          </Radio.Button>
          <Radio.Button value={"card"}>
            <InsertRowBelowOutlined style={{ marginInline: 10 }} />
            {isEnglish ? "Card" : "بطاقة"}
          </Radio.Button>
        </Radio.Group>
      </Col>
      <div style={{ padding: 10 }}>
        <div
          style={{
            borderRadius: "2px",
            marginTop: 20,
            border: "1px solid #cbcbcb",
          }}
        >
          <Tabs
            defaultActiveKey={activeKey}
            onChange={(key) => {
              onChange(1, { process_type_id: Number(key) });
              setActiveKey(key);
            }}
          >
            <TabPane
              tab={renderTab(<RetweetOutlined />, labels.til.all, all, "0")}
              key={0}
            />
            <TabPane
              tab={renderTab(
                <ArrowLeftOutlined />,
                labels.til.inbound,
                inboundCount,
                "5"
              )}
              key={5}
              disabled={inboundCount == 0}
            />
            <TabPane
              tab={renderTab(
                <ArrowRightOutlined />,
                labels.til.outbound,
                outboundCount,
                "1"
              )}
              key={1}
              disabled={outboundCount == 0}
            />
            {/* <TabPane
              disabled={adHocCount == 0}
              tab={renderTab(
                <ReloadOutlined />,
                labels.til.adhoc,
                adHocCount,
                "4"
              )}
              key={4}
            /> */}
          </Tabs>

          <TableComponent<InboxTask>
            rowSelection={{ type: "radio", ...rowSelection }}
            showSorterTooltip
            sortDirections={["ascend", "descend"]}
            columns={mode == "table" ? columns : cardColumns}
            dataSource={inbox}
            rowKey="id"
            isLoading={loading}
            scroll={{ x: "max-content" }}
            onChange={(pagination, __, sorter) => {
              const sortOrder = Array.isArray(sorter)
                ? sorter[0]?.order
                : sorter?.order;
              const sortField = Array.isArray(sorter)
                ? sorter[0]?.field
                : sorter?.field;
              onChange(pagination?.current || 1, {
                is_sort_desc: sortOrder != "ascend" ? true : false,
                sort_by: sortField?.toString(),
                process_type_id: Number(activeKey),
              });
            }}
            // rowClassName={(record) => {
            //   const corr = searchInbox.find((c) => c.corrId === record.corrId);
            //   if (corr && readStatus?.[corr?.taskId as string]) {
            //     return "";
            //   }
            //   return "inbox-table-unread";
            // }}
            pagination={{
              size: "small",
              // onChange(page) {
              //   onChange(page, {
              //     process_type_id: Number(activeKey),
              //     ...sorter,
              //   });
              // },
              //   total:
              //     tableTasks[
              //       activeKey as "All" | "Inbound" | "Outbound" | "Adhoc"
              //     ].length,
              total: total,
              position: ["bottomCenter"],
              pageSize: 10,
              hideOnSinglePage: true,
              current: currentPage,
              //   showTotal: () =>
              //     `${isEnglish ? "Total" : "المجموع"} ${
              //       tableTasks[
              //         activeKey as "All" | "Inbound" | "Outbound" | "Adhoc"
              //       ].length
              //     } ${isEnglish ? "items" : "أغراض"}`,
              // showTotal: () =>
              //   `${isEnglish ? "Total" : "المجموع"} ${total} ${
              //     isEnglish ? "items" : "أغراض"
              //   }`,
              showSizeChanger: false,
              // pageSizeOptions: [5, 10, 20],
              style: { marginRight: 10, marginLeft: 10 },
              showQuickJumper: true,
              locale: {
                jump_to: isEnglish ? "Go to" : "اذهب الى",
                page: isEnglish ? "Page" : "صفحة",
                prev_page: isEnglish ? "Previous" : "خلف",
                next_page: isEnglish ? "Next" : "التالي",
                items_per_page: isEnglish ? "/ Page" : "/ صفحة",
              },
            }}
          />
        </div>
      </div>
    </>
  );
}
