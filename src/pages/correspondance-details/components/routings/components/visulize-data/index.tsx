import GroupIcon from "@/assets/group";
import { Routes } from "@/components/services/inbox";
import ButtonComponent from "@/components/ui/button";
import { useLanguage } from "@/context/language";
import { useTheme } from "@/context/theme";
import useGetAllOU from "@/store/orgs/use-get-all-ou";
import useGetAllUsers from "@/store/users/use-get-all-users";
import {
  ArrowLeftOutlined,
  ArrowRightOutlined,
  UserOutlined,
} from "@ant-design/icons";
import moment from "moment";
import Tree from "react-d3-tree";

const renderCustomNodeElement = ({ nodeDatum }: any) => {
  const isParent = nodeDatum.attributes?.isParent;
  const is_to_entity = nodeDatum.attributes?.is_to_entity ?? "";
  const name = nodeDatum.name ?? "";

  const dateText = nodeDatum.attributes?.date
    ? moment(nodeDatum.attributes.date).format("YYYY-MM-DD HH:mm")
    : "";
  const charWidth = 7;
  const padding = 0;
  const icon = 40;

  const totalWidth =
    Math.max(name.length * charWidth, dateText.length * charWidth) +
    padding +
    icon;

  const height = isParent ? 40 : 60;

  return (
    <g direction={"ltr"}>
      <rect width={totalWidth} height={height} fill="#333" stroke="#111" />

      <g>
        <foreignObject x={10} y={10} width={totalWidth - 20} height={25}>
          <div style={{ display: "flex", alignItems: "center" }}>
            {is_to_entity ? (
              <GroupIcon
                color="#fff"
                style={{
                  fontSize: 12,
                  marginRight: 4,
                  height: 12,
                  width: 12,
                }}
              />
            ) : (
              <UserOutlined
                color="#fff"
                style={{
                  fontSize: 12,
                  marginRight: 4,
                  color: "#fff",
                  fill: "#fff",
                }}
              />
            )}
            <span style={{ color: "#fff", fontSize: 12, fontWeight: 300 }}>
              {name}
            </span>
          </div>
        </foreignObject>
        {!isParent && (
          <text
            x={10}
            y={45}
            stroke="transparent"
            fill="#fff"
            style={{ fontSize: 12, fontWeight: "300" }}
          >
            📅 {moment(nodeDatum.attributes?.date).format("YYYY-MM-DD HH:mm")}
          </text>
        )}
      </g>
    </g>
  );
};

type Props = {
  onClose?: () => void;
  routes?: Routes[];
  recivingEntity?: string | number;
  date?: string;
};
const TreeComponent = ({
  onClose,
  routes,
  recivingEntity = 0,
  date = "",
}: Props) => {
  const { theme } = useTheme();
  const { getUserById } = useGetAllUsers();
  const { getOrgById } = useGetAllOU();
  const { isEnglish } = useLanguage();
  const sendingEntityName = getOrgById(Number(recivingEntity));
  const data =
    routes?.map((route) => {
      const _to_user = getUserById(route?.to_user_id || 0);
      const _to_entity = getOrgById(route?.to_entity_id || 0);
      return {
        name: route?.is_to_entity
          ? (isEnglish ? _to_entity?.name_en : _to_entity?.name_ar) || "-"
          : (isEnglish ? _to_user?.name_en : _to_user?.name_ar) || "-",
        attributes: {
          date: route.route_date || "-",
          is_to_entity: route?.is_to_entity || false,
        },
        children: route.children?.map((child) => {
          const _to_user = getUserById(child?.to_user_id || 0);
          const _to_entity = getOrgById(child?.to_entity_id || 0);
          return {
            name: child?.is_to_entity
              ? (isEnglish ? _to_entity?.name_en : _to_entity?.name_ar) || "-"
              : (isEnglish ? _to_user?.name_en : _to_user?.name_ar) || "-",
            attributes: {
              date: child.route_date || "-",
              is_to_entity: child?.is_to_entity || false,
            },
          };
        }),
      };
    }) || [];

  const treeData = [
    {
      name:
        (isEnglish ? sendingEntityName?.name_en : sendingEntityName?.name_ar) ||
        "-",
      children: data,
      attributes: {
        date: date || "-",
        isParent: true,
      },
    },
  ];

  return (
    <div
      style={{
        width: "100vw",
        minHeight: "100vh",
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
        alignItems: "center",
        position: "fixed",
        top: 0,
        left: 0,
        backgroundColor: theme.colors.background,
        zIndex: 1000,
      }}
    >
      <div
        style={{
          padding: 10,
          display: "flex",
          justifyContent: "start",
          alignSelf: "start",
          width: "100%",
        }}
      >
        <ButtonComponent
          onClick={onClose}
          icon={isEnglish ? <ArrowLeftOutlined /> : <ArrowRightOutlined />}
        />
      </div>
      {treeData.map((tree, index) => (
        <div style={{ width: "100%", height: "100%" }} key={index}>
          <Tree
            dimensions={{ width: 900, height: 800 }}
            collapsible
            data={tree}
            renderCustomNodeElement={renderCustomNodeElement}
            orientation="vertical"
            translate={{ x: 800, y: 100 }}
            separation={{ siblings: 2, nonSiblings: 2.5 }}
            zoomable={true}
          />
        </div>
      ))}
    </div>
  );
};

export default TreeComponent;
