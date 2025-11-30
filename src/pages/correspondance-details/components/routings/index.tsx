import { Col, Empty, Row } from "antd";

import { CSSProperties, useState } from "react";
import { useLanguage } from "../../../../context/language";
import {
  BranchesOutlined,
  CaretDownOutlined,
  CaretUpOutlined,
  CheckCircleOutlined,
  QuestionCircleOutlined,
  UserOutlined,
} from "@ant-design/icons";
import RoutingDetailsComponent from "./components/details";
import { useTheme } from "../../../../context/theme";
import SnowFlakeIcon from "../../../../assets/snowflakes";
import GroupIcon from "../../../../assets/group";
import { Routes } from "@/components/services/inbox";
import { CONST_DATA } from "@/constants/app";
import HeightAnimationWrapper from "@/animations/height-wrapper-animation";
import FadeInWrapperAnimation from "@/animations/fade-in-wrapper-animation";
import WhileInViewWrapper from "@/animations/while-in-view-wrapper";
import useGetAllUsers from "@/store/users/use-get-all-users";
import useGetAllOU from "@/store/orgs/use-get-all-ou";
import ButtonComponent from "@/components/ui/button";
import TreeComponent from "./components/visulize-data";

interface CorrespondenceRoutingProps {
  routeTree: Routes[];
  recivingEntity?: string | number;
  date?: string;
}

export default function CorrespondenceRouting({
  routeTree,
  recivingEntity,
  date,
}: CorrespondenceRoutingProps) {
  const [selectedRoute, setSelectedRoute] = useState<Routes | null>(null);
  const [visualize, setVisualize] = useState<boolean>(false);

  const handleVisualize = (bool: boolean) => {
    setVisualize(bool);
  };

  // const items = useMemo<TabsProps["items"]>(() => {
  //   return [
  //     {
  //       label: (
  //         <label style={{ fontSize: 16, marginLeft: 10, marginRight: 10 }}>
  //           {labels.til.routing_details}
  //         </label>
  //       ),
  //       key: "1",
  //       icon: <InfoCircleOutlined style={{ marginInline: 5 }} />,
  //       children: <RoutingDetailsComponent route={selectedRoute} />,
  //     },
  //     // {
  //     //   label: (
  //     //     <label style={{ fontSize: 16, marginLeft: 10, marginRight: 10 }}>
  //     //       {labels.til.history}
  //     //     </label>
  //     //   ),
  //     //   key: "2",
  //     //   icon: <PlusCircleOutlined />,
  //     //   children: <RoutingHistoryComponent id={selectedId} />,
  //     // },
  //   ];
  // }, [selectedRoute]);
  const { isEnglish } = useLanguage();
  return (
    <>
      <Row style={{ padding: 10 }}>
        <Col span={11}>
          {routeTree && routeTree?.length > 0 && (
            <FadeInWrapperAnimation>
              <ButtonComponent
                type="primary"
                style={{ marginBottom: 10 }}
                icon={<BranchesOutlined />}
                onClick={() => handleVisualize(true)}
                buttonLabel={
                  isEnglish ? "visulize all routes" : "عرض جميع التوجيهات"
                }
              />
            </FadeInWrapperAnimation>
          )}
          {routeTree && routeTree?.length > 0 ? (
            <HeightAnimationWrapper>
              {routeTree?.map((child: any, index: number) => (
                <RouteDetails
                  selectedId={selectedRoute?.id.toString() || ""}
                  key={index}
                  onClick={(route) => {
                    setSelectedRoute(route);
                  }}
                  details={child}
                />
              ))}
            </HeightAnimationWrapper>
          ) : (
            <Empty
              description={
                isEnglish ? "no routes available" : "لا يوجد توجيهات "
              }
            />
          )}
        </Col>
        <Col style={{ width: 1, backgroundColor: "grey" }}></Col>
        <Col span={12} style={{ paddingLeft: 10 }}>
          {selectedRoute?.id && (
            // <Tabs
            //   defaultActiveKey="1"
            //   animated={{ inkBar: false, tabPane: true }}
            //   type="line"
            //   size={"large"}
            //   style={{ marginBottom: 32, marginTop: 10 }}
            //   items={items}
            // />
            <WhileInViewWrapper key={selectedRoute?.id}>
              <RoutingDetailsComponent route={selectedRoute} />
            </WhileInViewWrapper>
          )}
        </Col>
      </Row>
      {visualize && (
        <TreeComponent
          onClose={() => handleVisualize(false)}
          routes={routeTree}
          recivingEntity={recivingEntity}
          date={date}
        />
      )}
    </>
  );
}

const RouteDetails = ({
  onClick,
  selectedId,
  details,
}: {
  details: Routes;
  onClick: (route: Routes | null) => void;
  selectedId: string;
}): any => {
  const { getUserById } = useGetAllUsers();
  const { getOrgById } = useGetAllOU();
  const [show, setShow] = useState<boolean>(true);
  const { isEnglish } = useLanguage();
  const { theme } = useTheme();
  const iconStyle: CSSProperties = {
    width: 16,
    height: 16,
  };

  const isParent = details?.children && details.children.length > 0;
  const hasChildren = details?.children && details.children.length > 0;
  const _to_user = getUserById(details?.to_user_id || 0);
  const _to_entity = getOrgById(details?.to_entity_id || 0);
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        gap: 10,
      }}
    >
      {isParent || hasChildren ? (
        <div style={{ marginTop: 4 }} onClick={() => setShow(!show)}>
          {show || !hasChildren ? (
            <CaretDownOutlined color={theme.colors.primary} style={iconStyle} />
          ) : (
            <CaretUpOutlined color={theme.colors.primary} style={iconStyle} />
          )}
        </div>
      ) : (
        <div style={iconStyle} />
      )}
      <WhileInViewWrapper once={true}>
        <Col
          onClick={() => {
            onClick(details);
          }}
          style={{
            display: "flex",
            alignItems: "center",
            borderRadius: 10,
            paddingLeft: 10,
            paddingRight: 10,
            paddingBlock: 5,
            backgroundColor:
              selectedId == details?.id + "" ? "rgba(0, 0, 0, 0.25)" : "",
            outline: "1px solid #ccc",
            marginBottom: 5,
            paddingInline: 8,
            width: "fit-content",
            transition: "background-color 0.3s ease",
          }}
        >
          {isParent ? (
            <BranchesOutlined color={theme.colors.primary} style={iconStyle} />
          ) : !details?.is_to_entity ? (
            <UserOutlined color={theme.colors.primary} style={iconStyle} />
          ) : (
            <GroupIcon color={theme.colors.primary} style={iconStyle} />
          )}

          {details.status_id === CONST_DATA.Pending_status_id && (
            <QuestionCircleOutlined
              color={theme.colors.accent}
              style={{
                marginInline: 4,
                color: theme.colors.warning,
              }}
            />
          )}
          {details.status_id === CONST_DATA.Completed_status_id && (
            <CheckCircleOutlined
              color={theme.colors.accent}
              style={{
                marginInline: 4,
                color: "darkgreen",
              }}
            />
          )}
          <label
            style={{
              color: theme.colors.primary,
            }}
          >
            {details?.is_to_entity
              ? (isEnglish ? _to_entity?.name_en : _to_entity?.name_ar) || "-"
              : (isEnglish ? _to_user?.name_en : _to_user?.name_ar) || "-"}{" "}
          </label>
        </Col>

        {hasChildren && (
          <div
            style={{
              paddingLeft: isEnglish ? 20 : 0,
              paddingRight: isEnglish ? 0 : 20,
              marginBottom: 16,
              height: show ? "auto" : 0,
              opacity: show ? 1 : 0,
            }}
          >
            {details?.children?.map((child: any, index: number) => (
              <RouteDetails
                key={index}
                details={child}
                onClick={onClick}
                selectedId={selectedId}
              />
            ))}
          </div>
        )}
      </WhileInViewWrapper>{" "}
    </div>
  );
};
