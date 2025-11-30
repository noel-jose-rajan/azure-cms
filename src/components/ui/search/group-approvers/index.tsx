import { useState } from "react";
import { ApproverUser as ApproverUserType, ApproverUserOugUnit } from "./types";
import { Button, Modal, Row, Tag } from "antd";
import { DeleteOutlined, PlusCircleOutlined } from "@ant-design/icons";
import { InputLabel } from "@mui/material";
import { useTheme } from "../../../../context/theme";
import { useLanguage } from "../../../../context/language";
import ApproverOrgUnit from "./components/ApproverOrgUnit";
import ApproverUser from "./components/ApproverUser";
import DraggableTable, { CustomColumn } from "../../table/draggable-table";

interface Approvals {
  approvalId: string;
  position: string;
  userDescription: string;
  approvalOrgunitCode: string;
  approvalOrgunit: unknown;
}

interface Props {
  open?: boolean;
  onClose?: () => any;
  onCancel?: () => any;
  onFinish?: (val: Approvals[]) => any;
  sendingOrgCode?: string;
  securityLevelCode?: string;
  value?: Approvals[];
}

export default function GroupApprovers({
  sendingOrgCode,
  securityLevelCode,
  value: approvals,
  onFinish,
}: Props) {
  const { theme } = useTheme();
  const { labels } = useLanguage();

  const [selectedUnit, setSelectedUnit] = useState<
    ApproverUserOugUnit | undefined
  >();
  const [selectedUser, setSelectedUser] = useState<
    ApproverUserType | undefined
  >();

  const [modalVisible, setModalVisible] = useState(false);

  const handleModalClose = () => {
    setModalVisible(false);
  };

  const columns: CustomColumn<Approvals>[] = [
    {
      headerName: "Position",
      field: "position",
    },
    {
      headerName: "User Description",
      field: "userDescription",
    },
    {
      headerName: "Org Unit Code",
      field: "approvalOrgunitCode",
    },

    {
      field: "action",
      headerName: "Action",
      width: 100,
      sortable: false,
      renderCell: (row) => (
        <>
          <Button
            style={{ marginLeft: "5px" }}
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleRemove(row.position + "")}
          />
        </>
      ),
    },
  ];

  const disable = approvals?.find((f) => selectedUser?.key === f.approvalId);

  const handleAddNew = () => {
    let value = approvals ?? [];

    if (Array.isArray(value)) {
      value?.push({
        approvalId: selectedUser?.key!,
        approvalOrgunit: null,
        approvalOrgunitCode: selectedUnit?.key!,
        position: (approvals?.length ?? -1) + 1 + "",
        userDescription: selectedUser?.description!,
      });
    }
    onFinish && onFinish(value);
  };

  const handleRemove = (indexString: string) => {
    let value = approvals?.filter((f) => f.position !== indexString) ?? [];

    console.log(value);

    onFinish && onFinish(value);
  };

  return (
    <>
      <br />
      <InputLabel>{labels.lbl.select_approval_users}</InputLabel>
      <Row>
        <Button
          style={{ marginBottom: "5px" }}
          type="primary"
          onClick={() => setModalVisible(true)}
        >
          <PlusCircleOutlined />
        </Button>

        {...(approvals ?? []).map((tag, index) => (
          <Tag
            style={{ margin: "5px" }}
            color={theme.colors.primary}
            key={index}
            closable
            // onClose={() => setTags(tags.filter((t) => t !== tag))}
          >
            {tag.userDescription}
          </Tag>
        ))}
      </Row>
      <hr style={{ borderWidth: 0.2 }} />
      <Modal
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        onOk={handleModalClose}
        okText={labels.btn.finish}
        cancelText={labels.btn.close}
      >
        <ApproverOrgUnit
          unitCode={sendingOrgCode}
          onChange={(e) => setSelectedUnit(e)}
          value={selectedUnit}
        />

        {selectedUnit && (
          <ApproverUser
            unitCode={selectedUnit?.key}
            securityLevelCode={securityLevelCode}
            onChange={(e) => setSelectedUser(e)}
            value={selectedUser}
          />
        )}
        <Button disabled={!!disable} onClick={handleAddNew}>
          {labels.btn.add_new}
        </Button>

        {/* @ts-ignore */}
        <DraggableTable
          paginationProps={{}}
          columns={columns}
          data={(approvals?.map((i, k) => ({ key: k, ...i })) as any) ?? []}
          draggable={true}
          onChange={(e) => onFinish && onFinish(e)}
        />
      </Modal>
    </>
  );
}
