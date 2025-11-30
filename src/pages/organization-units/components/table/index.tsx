import { Col, TableColumnsType, TableProps } from "antd";
import ActionMenuItem from "../../../../components/ui/menu-item";
import { useState } from "react";
import { useLanguage } from "../../../../context/language";
import { useTheme } from "../../../../context/theme";
import ModalComponent from "../../../../components/ui/modal";
import DeActivateLogo from "../../../../assets/deactivate-icon";
import ActivateIcon from "../../../../assets/activate_icon";
import { useNavigate } from "react-router-dom";
import {
  OrgUnitType,
  UpdateOUType,
} from "@/components/services/organization-units/type";
import TableComponent from "../../../../components/ui/table-component";
import useUpdateOrgUnit from "../../hooks/use-update-ou";
import HeightAnimationWrapper from "@/animations/height-wrapper-animation";
import useGetAllOU from "@/store/orgs/use-get-all-ou";
import useGetAllUsers from "@/store/users/use-get-all-users";
import { CheckOutlined, CloseOutlined } from "@ant-design/icons";
import useCustomMessage from "@/components/hooks/use-message";

interface OUListTableProps {
  orgUnits: OrgUnitType[];
  loading: boolean;
}

export default function OUListTable({ orgUnits, loading }: OUListTableProps) {
  const { showMessage } = useCustomMessage();
  const { isEnglish, labels } = useLanguage();
  const { theme } = useTheme();
  const { refreshAllOrgs, loading: refreshLoading, getOrgById } = useGetAllOU();
  const { getUserById } = useGetAllUsers();
  const [openActive, setOpenActive] = useState<boolean>(false);
  const [openDeActive, setOpenDeActive] = useState<boolean>(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [selectedOrgUnits, setSelectedOrgUnits] = useState<OrgUnitType[]>([]);
  // const [fastAddVisible, setFastAddVisible] = useState<boolean>(false);
  // const [fastUserAddVisible, setFastUserAddVisible] = useState<boolean>(false);
  // const [loading, setLoading] = useState<boolean>(false);
  const { loading: updateLoading, handleUpdateOrgUnit } = useUpdateOrgUnit();
  const navigate = useNavigate();

  const rowSelection: TableProps<OrgUnitType>["rowSelection"] = {
    columnWidth: 30,
    type: "radio",
    selectedRowKeys,
    onChange: (_selectedRowKeys: React.Key[], _selectedRows: OrgUnitType[]) => {
      setSelectedRowKeys(_selectedRowKeys);
      setSelectedOrgUnits(_selectedRows);
    },
  };

  const columns: TableColumnsType<OrgUnitType> = [
    {
      width: 150,
      title: labels.til.org_unit_code,
      dataIndex: "entity_code",
      render: (text: string) => (
        <a style={{ color: theme.colors.primary }}>{text}</a>
      ),
      sorter: {
        compare: (a, b) =>
          (b.entity_code ?? "")?.localeCompare(a.entity_code ?? ""),
        multiple: 3,
      },
    },
    {
      width: 150,

      title: labels.lbl.arabic_name,
      dataIndex: "name_ar",
      render: (text: string) => (
        <a style={{ color: theme.colors.primary }}>{text}</a>
      ),
      sorter: {
        compare: (a, b) => b.name_ar.localeCompare(a.name_ar),
        multiple: 3,
      },
    },
    {
      width: 150,

      title: labels.lbl.english_name,
      dataIndex: "name_en",
      render: (text: string) => (
        <a style={{ color: theme.colors.primary }}>{text}</a>
      ),
      sorter: {
        compare: (a, b) => b.name_en.localeCompare(a.name_en),
        multiple: 3,
      },
    },
    {
      width: 200,
      title: labels.lbl.org_unit_manager,
      dataIndex: "manager_id",
      render: (text: string) => {
        const user = getUserById(Number(text));
        return (
          <a style={{ color: theme.colors.primary }}>
            {(isEnglish ? user?.name_en : user?.name_ar) ?? "-"}
          </a>
        );
      },
    },
    {
      width: 200,
      title: labels.lbl.org_unit_parent,
      dataIndex: "parent_id",
      render: (text: string) => {
        const org = getOrgById(Number(text));
        return (
          <a style={{ color: theme.colors.primary }}>
            {(isEnglish ? org?.name_en : org?.name_ar) ?? "-"}
          </a>
        );
      },
    },
    {
      width: 200,

      title: labels.lbl.email,
      dataIndex: "email",
      render: (text: string) => (
        <a style={{ color: theme.colors.primary }}>{text ?? "-"}</a>
      ),
      sorter: {
        compare: (a, b) => (b.email ?? "")?.localeCompare(a.email ?? ""),
        multiple: 3,
      },
    },
    {
      width: 120,
      title: labels.lbl.active,
      dataIndex: "is_active",
      render: (bool: boolean) => (
        // <Tag
        //   style={{
        //     width: 100,
        //     display: "flex",
        //     justifyContent: "center",
        //     alignItems: "center",
        //   }}
        //   color={text ? theme.colors.success : theme.colors.danger}
        // >
        //   {text ? labels.lbl.active : labels.lbl.notactive}
        // </Tag>
        <span>
          {bool ? (
            <CheckOutlined style={{ color: theme.colors.success }} />
          ) : (
            <CloseOutlined style={{ color: theme.colors.danger }} />
          )}
        </span>
      ),
      sorter: {
        compare: (a, b) =>
          String(b.is_active).localeCompare(String(a.is_active)),
        multiple: 3,
      },
    },
  ];

  const checkIsActivatable = (): boolean => {
    if (selectedOrgUnits.length === 0) {
      return false;
    }

    let active = true;
    selectedOrgUnits.forEach((element) => {
      if (element.is_active === true) {
        return (active = false);
      }
    });

    return active;
  };

  const checkIsDeActivatable = (): boolean => {
    if (selectedOrgUnits.length === 0) {
      return false;
    }

    let active = true;
    selectedOrgUnits.forEach((element) => {
      if (element.is_active === false) {
        return (active = false);
      }
    });

    return active;
  };

  const updateTheStatusOfOrgUnits = async (activate: boolean) => {
    if (!selectedOrgUnits || selectedOrgUnits.length === 0) return;
    const id = Number(selectedRowKeys[0]);
    const payload: UpdateOUType = {
      is_active: activate,
    };
    const res = await handleUpdateOrgUnit(id, payload);

    if (res?.Message == "edited") {
      showMessage(
        "success",
        activate ? labels.msg.orgunit_activate : labels.msg.orgunit_deactivate
      );
      setOpenActive(false);
      setOpenDeActive(false);
      setSelectedOrgUnits([]);
      setSelectedRowKeys([]);
      refreshAllOrgs();
      // const updatedOrgUnits = orgUnits.map((ou) =>
      //   ou?.id === id ? { ...ou, is_active: activate } : ou
      // );
      // setOrgUnits(updatedOrgUnits);
    }
  };

  return (
    <>
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
            onClick={() => navigate("create")}
            isActive
            label={labels.btn.add_new}
            type="add"
          />
          <ActionMenuItem
            onClick={() =>
              navigate("/admin/organization-units/" + selectedOrgUnits[0]?.id, {
                state: selectedOrgUnits[0],
              })
            }
            isActive={selectedRowKeys.length === 1}
            label={labels.btn.edit}
            type="edit"
          />
          <ActionMenuItem
            onClick={() => setOpenActive(true)}
            isActive={checkIsActivatable()}
            label={labels.btn.activate}
            type="activate"
            loading={updateLoading}
          />
          <ActionMenuItem
            onClick={() => setOpenDeActive(true)}
            isActive={checkIsDeActivatable()}
            label={labels.btn.deactivate}
            type="deactivate"
            loading={updateLoading}
          />
          {/* <ActionMenuItem
            onClick={() => setFastUserAddVisible(true)}
            isActive={selectedRowKeys.length === 0}
            label={labels.btn.quickly_add_user}
            type="add"
          />
          <ActionMenuItem
            onClick={() => setFastAddVisible(true)}
            isActive={selectedRowKeys.length === 0}
            label={labels.btn.quickly_add_orgunit}
            type="add"
          /> */}
        </Col>
        <HeightAnimationWrapper startAnimation={!(loading || refreshLoading)}>
          <TableComponent<OrgUnitType>
            rowSelection={rowSelection}
            sortDirections={["ascend", "descend"]}
            columns={columns}
            dataSource={orgUnits}
            rowKey="id"
            scroll={{ x: "max-content" }}
            isLoading={loading}
          />
        </HeightAnimationWrapper>
      </Col>
      <ModalComponent
        title={
          <Col style={{ display: "flex", alignItems: "center" }}>
            <DeActivateLogo
              style={{
                height: 20,
                marginRight: isEnglish ? 10 : 0,
                marginLeft: isEnglish ? 0 : 10,
              }}
            />
            {isEnglish ? "Confirm deactivate" : "تأكيد التعطيل"}
          </Col>
        }
        description={labels.msg.if_deactivate}
        visible={openDeActive}
        onClose={() => setOpenDeActive(false)}
        onSubmit={() => updateTheStatusOfOrgUnits(false)}
        okText={labels.btn.deactivate}
        okIcon={<DeActivateLogo color={"#fff"} style={{ height: 16 }} />}
        loading={updateLoading}
      />
      <ModalComponent
        title={
          <Col style={{ display: "flex", alignItems: "center" }}>
            <ActivateIcon
              style={{
                height: 20,
                marginRight: isEnglish ? 10 : 0,
                marginLeft: isEnglish ? 0 : 10,
              }}
            />
            {isEnglish ? "Confirm Activate" : "تأكيد التنشيط"}
          </Col>
        }
        description={labels.msg.if_activate}
        visible={openActive}
        onClose={() => setOpenActive(false)}
        onSubmit={() => updateTheStatusOfOrgUnits(true)}
        okText={labels.btn.activate}
        okIcon={<ActivateIcon color={"#fff"} style={{ height: 16 }} />}
        loading={updateLoading}
      />
      {/* {fastAddVisible && (
        <OrgUnitFastAdd
          visible={fastAddVisible}
          onClose={() => setFastAddVisible(false)}
          activateLoader={setLoading}
          />
      )}
      {fastUserAddVisible && (
        <UsersFastAdd
          visible={fastUserAddVisible}
          onClose={() => setFastUserAddVisible(false)}
          activateLoader={setLoading}
        />
      )} */}
    </>
  );
}
