import TableComponent from "@/components/ui/table-component";
import { useLanguage } from "@/context/language";
import { useTheme } from "@/context/theme";
import useGetAllOU from "@/store/orgs/use-get-all-ou";
import usePicklist from "@/store/picklists/use-picklist";
import useGetAllUsers from "@/store/users/use-get-all-users";
import { DeleteFilled } from "@ant-design/icons";
import { Button, Col, TableColumnsType, Tag } from "antd";
import { RoutingType } from "../create-route-form/schema";

type Props = {
  routings: RoutingType[];
  setRoutings: React.Dispatch<React.SetStateAction<RoutingType[] | undefined>>;
};
const RoutingTable = ({ routings, setRoutings }: Props) => {
  const { theme } = useTheme();
  const { getPicklistById } = usePicklist();
  const { getUserById } = useGetAllUsers();
  const { getOrgById } = useGetAllOU();
  const { labels, isEnglish } = useLanguage();
  const columns: TableColumnsType<RoutingType> = [
    {
      width: 200,
      title: labels.lbl.route_to,
      dataIndex: "to_user_id",
      render: (_text: string, record: RoutingType) => {
        const ou = getOrgById(record.to_entity_id || 0);
        const user = getUserById(record.to_user_id || 0);
        const routeToEntity =
          Boolean(record?.to_entity_id) && isEnglish
            ? ou?.name_en
            : ou?.name_ar;
        const routeToUser =
          Boolean(record?.to_user_id) && isEnglish
            ? user?.name_en
            : user?.name_ar;
        return (
          <Tag
            style={{ color: theme.colors.primary }}
            color={ou ? "green" : "blue"}
          >
            {routeToEntity || routeToUser || "-"}
          </Tag>
        );
      },
    },
    {
      ellipsis: true,
      width: 150,
      title: labels.lbl.reqired_action,
      dataIndex: "required_action",
      render: (id: string) => {
        const picklist = getPicklistById("Required Action", id);
        return (
          <a style={{ color: theme.colors.primary }}>
            {(isEnglish
              ? picklist?.picklist_en_label
              : picklist?.picklist_ar_label) || "-"}
          </a>
        );
      },
    },
    {
      width: 200,
      ellipsis: true,
      title: labels.lbl.route_comment,
      dataIndex: "comments",
      render: (text: string) => (
        <a style={{ color: theme.colors.primary }}>{text || "-"}</a>
      ),
    },
    {
      dataIndex: "id",
      width: 50,
      render: (_text: string, record: RoutingType) => (
        <>
          {/* <Button
            type="link"
            color="primary"
            size="small"
            variant="text"
            onClick={() => {
              setEditId(record.id);
              reset({
                comments: record.comments,
                route_list: [record],
                required_action: record.required_action,
              });
            }}
          >
            <EditFilled />
          </Button> */}
          <Button
            type="link"
            size="small"
            danger
            onClick={() => deleteRouting(record.id)}
          >
            <DeleteFilled />
          </Button>
        </>
      ),
    },
  ];

  const deleteRouting = (id: number | string) => {
    setRoutings((prev) => {
      if (!prev) return prev;
      const data = prev.filter((routing) => routing.id !== id);
      return data;
    });
  };
  return (
    <Col
      span={24}
      style={{
        borderRadius: "2px",
        marginTop: 20,
        border: "1px solid #cbcbcb",
      }}
    >
      <TableComponent<RoutingType>
        showSorterTooltip
        sortDirections={["ascend", "descend"]}
        columns={columns}
        dataSource={routings}
        style={{ marginTop: 15, width: "100%" }}
        rowKey="routingId"
        scroll={{ x: "max-content" }}
        size="small"
        pageSize={4}
        bordered={false}
      />
    </Col>
  );
};

export default RoutingTable;
