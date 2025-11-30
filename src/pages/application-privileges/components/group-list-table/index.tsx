import React, { useState } from "react";
import { Button, Modal, message, Col } from "antd";
import { useLanguage } from "../../../../context/language";
import { ColumnType } from "antd/es/table";
import {
  DeleteFilled,
  EditFilled,
  EyeFilled,
  EyeOutlined,
  PlusCircleFilled,
} from "@ant-design/icons";
import ProfileModal from "../profile-modal";
import { AppPrivilegeType } from "@/components/services/application-privilege/type";
import ManageUserProfileModal from "../manage-users-profile";
import { deleteAppPrivilege } from "@/components/services/application-privilege/service";
import { HttpStatus } from "@/components/functional/httphelper";
import TableComponent from "@/components/ui/table-component";
import { useTheme } from "@/context/theme";

interface Props {
  onEdit?: (profile: AppPrivilegeType) => any;
  privileges: AppPrivilegeType[];
  updatePrivileges?: (privileges: AppPrivilegeType[]) => void;
  applicationViews: AppPrivilegeType[];
}

const GroupListTable: React.FC<Props> = ({
  onEdit,
  privileges,
  updatePrivileges,
  applicationViews,
}) => {
  const {
    labels: { lbl, msg, btn },
    isEnglish,
  } = useLanguage();
  const {
    theme: { colors },
  } = useTheme();

  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [selectedProfileId, setSelectedProfileId] = useState<number>();
  const [selectedType, setSelectedType] = useState<
    "view" | "group" | undefined
  >();
  const [assign, setAssign] = useState<AppPrivilegeType>();

  const [deleteModalVisible, setDeleteModalVisible] = useState<boolean>(false);
  const [profileToDelete, setProfileToDelete] = useState<number>();

  const handleCloseModal = () => setModalVisible(false);

  const handleDelete = (id: number) => {
    setProfileToDelete(id);
    setDeleteModalVisible(true);
  };

  const handleDeleteConfirmation = async () => {
    if (profileToDelete) {
      const success = await deleteAppPrivilege(profileToDelete);
      if (success.status === HttpStatus.SUCCESS) {
        message.success(msg.task_complete_success);
        updatePrivileges &&
          updatePrivileges(
            privileges?.filter((p) => p.id !== profileToDelete) || []
          );
      } else {
        message.error(msg.something_wrong_happened);
      }
      setDeleteModalVisible(false);
    }
  };

  const handleDeleteCancel = () => setDeleteModalVisible(false);

  const handleEdit = (record: AppPrivilegeType) => {
    onEdit && onEdit(record);
  };

  const columns: ColumnType<AppPrivilegeType>[] = [
    {
      title: lbl.arabic_name,
      dataIndex: "name_ar",
      key: "profileArName",
      width: "15%",
      sorter: {
        compare: (a, b) => b.name_ar.localeCompare(a.name_ar),
        multiple: 3,
      },
    },
    {
      title: lbl.english_name,
      dataIndex: "name_en",
      key: "profileEnName",
      sorter: {
        compare: (a, b) => b.name_en.localeCompare(a.name_en),
        multiple: 3,
      },
    },
    {
      title: lbl.profile_code,
      dataIndex: "code",
      key: "profileCode",
      sorter: {
        compare: (a, b) => b.code.localeCompare(a.code),
        multiple: 3,
      },
    },
    {
      title: lbl.profile_views,
      key: lbl.profile_views,
      render: (_: any, record: AppPrivilegeType) => (
        <Button
          type="link"
          size="small"
          onClick={() => {
            setModalVisible(true);
            setSelectedProfileId(record.id);
            setSelectedType("view");
          }}
          style={{ color: colors.info }}
        >
          <EyeFilled /> <p style={{ fontSize: 12 }}>{btn.view}</p>
        </Button>
      ),
    },
    {
      title: lbl.profile_users,
      key: lbl.profile_users,
      render: (_: any, record: AppPrivilegeType) => (
        <Button
          type="link"
          size="small"
          onClick={() => {
            setModalVisible(true);
            setSelectedProfileId(record.id);
            setSelectedType("group");
          }}
          style={{ color: colors.info }}
        >
          <EyeFilled /> <p style={{ fontSize: 12 }}>{btn.view}</p>
        </Button>
      ),
    },
    {
      title: btn.task_actions,
      key: btn.task_actions,
      render: (_: any, record: AppPrivilegeType) => (
        <Col style={{ display: "flex", flexWrap: "nowrap" }}>
          <Button
            type="link"
            size="small"
            onClick={() => setAssign(record)}
            style={{ color: colors.info }}
          >
            <PlusCircleFilled />
          </Button>
          &nbsp;
          <Button
            type="link"
            size="small"
            onClick={() => handleEdit(record)}
            style={{ color: colors.success }}
          >
            <EditFilled />
          </Button>
          &nbsp;
          <Button
            type="link"
            size="small"
            danger
            onClick={() => handleDelete(record.id)}
            style={{ color: colors.danger }}
          >
            <DeleteFilled />
          </Button>
        </Col>
      ),
    },
  ];

  return (
    <div>
      {selectedProfileId && selectedType && (
        <ProfileModal
          profileId={selectedProfileId}
          type={selectedType}
          visible={modalVisible}
          onCancel={handleCloseModal}
          applicationViews={applicationViews}
        />
      )}
      <TableComponent<AppPrivilegeType>
        showSorterTooltip
        sortDirections={["ascend", "descend"]}
        columns={columns}
        dataSource={privileges}
        style={{ marginTop: 15 }}
        rowKey="id"
        scroll={{ x: "max-content" }}
        pagination={{
          size: "small",
          // showTotal: () =>
          //   `${isEnglish ? "Total" : "المجموع"} ${privileges?.length ?? 0} ${
          //     isEnglish ? "items" : "أغراض"
          //   }`
          // ,
          hideOnSinglePage: true,
          position: ["bottomCenter"],
          showSizeChanger: false,
          // pageSizeOptions: [5, 10, 20],
          style: { marginRight: 10 },
          showQuickJumper: true,
          total: privileges.length,
          locale: {
            jump_to: isEnglish ? "Go to" : "اذهب الى",
            page: isEnglish ? "Page" : "صفحة",
            prev_page: isEnglish ? "Previous" : "خلف",
            next_page: isEnglish ? "Next" : "التالي",
            items_per_page: isEnglish ? "/ Page" : "/ صفحة",
          },
        }}
      />
      <Modal
        title={msg.are_you_sure}
        visible={deleteModalVisible}
        onOk={handleDeleteConfirmation}
        onCancel={handleDeleteCancel}
        okText={btn.delete}
        cancelText={btn.cancel}
      >
        <p>{msg.if_delete_general}</p>
      </Modal>
      {assign && (
        <ManageUserProfileModal
          open={!!assign}
          profile={assign}
          onClose={() => setAssign(undefined)}
        />
      )}
    </div>
  );
};

export default GroupListTable;
