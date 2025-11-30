import { useState, useEffect, useRef } from "react";
import { Tag, message, Modal, Button } from "antd";
import {
  EditFilled,
  EditOutlined,
  EyeFilled,
  PlusOutlined,
} from "@ant-design/icons";
import { ColumnsType } from "antd/es/table";
import { useLanguage } from "../../../../context/language";
import { useTheme } from "../../../../context/theme";
import {
  AnnouncementGroupsType,
  CreateAnnouncementGroupType,
  SearchGroupsType,
} from "@/components/services/announcement-groups/type";
import CreateEditForm from "./create-edit-form";
import GroupUsersForm from "./group-users-form";
import SearchBar from "../search-bar";
import {
  getAllAnnouncementGroups,
  updateStatusOfAnnouncementGroup,
  createAnnouncementGroup,
  updateAnnouncementGroup,
} from "@/components/services/announcement-groups";
import { HttpStatus } from "@/components/functional/httphelper";
import { searchAnnouncementGroups } from "@/components/functional/announcement-groups";
import TableComponent from "@/components/ui/table-component";

const defaultValues: SearchGroupsType = {
  name_en: "",
  entity_code: "",
  email: "",
};

const AnnouncementGroupsTable = () => {
  const {
    isEnglish,
    labels: { lbl, btn },
  } = useLanguage();
  const {
    theme: { colors },
  } = useTheme();

  const [searchProps, setsearchProps] =
    useState<SearchGroupsType>(defaultValues);

  const [announcementGroups, setAnnouncementGroups] = useState<
    AnnouncementGroupsType[]
  >([]);
  const allDataRef = useRef<AnnouncementGroupsType[]>([]);
  const [loading, setLoading] = useState(false);
  const [isConfirmModalVisible, setIsConfirmModalVisible] = useState(false);
  const [selectedStatus, setSelectedStatus] =
    useState<AnnouncementGroupsType>();
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [isEdit, setIsEdit] = useState<AnnouncementGroupsType>();

  const [viewGroupUsers, setViewGroupUsers] =
    useState<AnnouncementGroupsType>();

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (
      searchProps.name_en === "" &&
      searchProps.entity_code === "" &&
      searchProps.email === ""
    ) {
      setAnnouncementGroups(allDataRef.current);
    } else {
      onClickSearch();
    }
  }, [searchProps]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await getAllAnnouncementGroups();

      if (response.status === HttpStatus.SUCCESS && response.data) {
        setAnnouncementGroups(response?.data.Data ?? []);
        allDataRef.current = response?.data.Data ?? [];
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
    setLoading(false);
  };

  const handleStatusChangeClick = (group: AnnouncementGroupsType) => {
    setSelectedStatus(group);
    setIsConfirmModalVisible(true);
  };

  const handleConfirmStatusChange = async () => {
    if (selectedStatus) {
      const result = await updateStatusOfAnnouncementGroup(
        selectedStatus.id,
        !selectedStatus.is_active
      );

      if (result.status === HttpStatus.SUCCESS) {
        setAnnouncementGroups((prev) =>
          prev.map((item) =>
            item.id === selectedStatus.id
              ? { ...item, is_active: !item.is_active }
              : item
          )
        );
        message.success(
          isEnglish ? "Status change successful" : "تم تغيير الحالة بنجاح"
        );
      } else {
        message.error(isEnglish ? "Status change failed" : "فشل تغيير الحالة");
      }
      setIsConfirmModalVisible(false);
      setSelectedStatus(undefined);
    }
  };

  const handleCreateGroupClick = () => {
    setIsCreateModalVisible(true);
  };

  const handleOnClose = () => {
    setIsEdit(() => undefined);
  };

  const handleCreateGroup = async (values: CreateAnnouncementGroupType) => {
    if (isEdit) {
      return await updateAGroup(values);
    }

    const { code, name_ar, name_en, email } = values;

    const success = await createAnnouncementGroup({
      code: code,
      email: email,
      is_active: true,
      name_ar,
      name_en,
    });

    if (success.status === HttpStatus.SUCCESS && success.data) {
      message.success(
        isEnglish
          ? "Announcement group created successfully"
          : "تم إنشاء المجموعة بنجاح"
      );
      const data = success.data;
      setAnnouncementGroups((prev) => [
        ...prev,
        {
          entity_code: code,
          email: email,
          is_active: true,
          name_ar: name_ar,
          name_en: name_en,
          id: data.ID,
        },
      ]);
      setIsCreateModalVisible(false);
    } else {
      message.error(
        isEnglish
          ? "Failed to create announcement group"
          : "فشل في إنشاء المجموعة"
      );
    }
  };

  const updateAGroup = async (values: CreateAnnouncementGroupType) => {
    if (!isEdit) return;
    const { code, name_ar, name_en, email } = values;

    const success = await updateAnnouncementGroup(isEdit.id, {
      code: code,
      email: email,
      name_ar,
      name_en,
    });

    if (success.status === HttpStatus.SUCCESS && success.data) {
      message.success(
        isEnglish
          ? "Announcement group updated successfully"
          : "تم إنشاء المجموعة بنجاح"
      );
      setAnnouncementGroups((prev) => {
        return prev.map((item) =>
          item.id === isEdit.id
            ? {
                ...item,
                entity_code: code,
                email: email,
                name_ar: name_ar,
                name_en: name_en,
              }
            : item
        );
      });
      setIsCreateModalVisible(false);
    } else {
      message.error(
        isEnglish
          ? "Failed to update announcement group"
          : "فشل في إنشاء المجموعة"
      );
    }
  };

  const checkIfGroupIdExists = (id: string | number) => {
    if (!!isEdit) {
      return undefined;
    }
    return allDataRef.current?.some((group) => group.id === id);
  };

  const columns: ColumnsType<AnnouncementGroupsType> = [
    {
      title: lbl.arabic_name,
      dataIndex: "name_ar",
      key: lbl.arabic_name,
      width: "15%",
    },
    {
      title: lbl.english_name,
      dataIndex: "name_en",
      key: lbl.english_name,
      width: "20%",
    },
    {
      title: lbl.announce_grp_code,
      dataIndex: "entity_code",
      key: lbl.announce_grp_code,
    },
    {
      title: lbl.email,
      dataIndex: "email",
      key: lbl.email,
    },
    {
      title: lbl.announce_grp_status,
      dataIndex: "is_active",
      key: lbl.announce_grp_status,
      render: (_, record) => (
        <Tag
          onClick={() => handleStatusChangeClick(record)}
          style={{
            textAlign: "center",
            cursor: "pointer",
            paddingLeft: 10,
            paddingRight: 10,
          }}
          color={record.is_active ? colors.success : colors.danger}
        >
          <EditOutlined />
          &nbsp;
          {record.is_active ? lbl.active : lbl.notactive}
        </Tag>
      ),
    },
    {
      title: lbl.viewActions,
      dataIndex: "action",
      key: lbl.viewActions,
      render: (_, record) => (
        <div style={{ display: "flex" }}>
          <Button
            type="link"
            size="small"
            onClick={() => {
              setIsEdit(record);
              handleCreateGroupClick();
            }}
            style={{ color: colors.success }}
          >
            <EditFilled />
          </Button>
          &nbsp;
          <Button
            type="link"
            size="small"
            onClick={() => setViewGroupUsers(record)}
            style={{ color: colors.info }}
          >
            <EyeFilled /> <p style={{ fontSize: 12 }}>{lbl.users}</p>
          </Button>
        </div>
      ),
    },
  ];

  const onClickSearch = async () => {
    setLoading(true);

    try {
      const response = searchAnnouncementGroups(
        allDataRef.current,
        searchProps,
        isEnglish
      );

      setAnnouncementGroups(response);
    } catch (error) {
      message.error(
        isEnglish ? "An error occurred while searching" : "حدث خطأ أثناء البحث"
      );
      setAnnouncementGroups([]);
    }
    setLoading(false);
  };

  const handleReset = () => {
    setsearchProps(defaultValues);
    setAnnouncementGroups(allDataRef.current);
  };

  return (
    <>
      <SearchBar
        value={searchProps}
        updateSearch={setsearchProps}
        handleReset={handleReset}
      />
      <div
        style={{
          flexDirection: isEnglish ? "row" : "row-reverse",
          display: "flex",
          height: 55,
        }}
      >
        <Button type="primary" onClick={handleCreateGroupClick}>
          <PlusOutlined />
          &nbsp;{btn.add_new}
        </Button>
      </div>
      <TableComponent<AnnouncementGroupsType>
        showSorterTooltip
        sortDirections={["ascend", "descend"]}
        columns={columns}
        dataSource={announcementGroups}
        style={{ marginTop: 15 }}
        loading={loading}
        rowKey="id"
        scroll={{ x: "max-content" }}
        pagination={{
          size: "small",
          hideOnSinglePage: true,
          // showTotal: () =>
          //   `${isEnglish ? "Total" : "المجموع"} ${
          //     announcementGroups?.length ?? 0
          //   } ${isEnglish ? "items" : "أغراض"}`,
          showSizeChanger: false,
          // pageSizeOptions: [5, 10, 20],
          position: ["bottomCenter"],
          style: { marginRight: 10 },
          showQuickJumper: true,
          total: announcementGroups.length,
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
        title={isEnglish ? "Confirm Status Change" : "تأكيد تغيير الحالة"}
        open={isConfirmModalVisible}
        onOk={handleConfirmStatusChange}
        onCancel={() => setIsConfirmModalVisible(false)}
        okText={isEnglish ? "Confirm" : "تأكيد"}
        cancelText={isEnglish ? "Cancel" : "إلغاء"}
      >
        <p>
          {isEnglish
            ? `Are you sure you want to change the status to ${
                !selectedStatus?.is_active ? lbl.active : lbl.notactive
              }?`
            : "هل أنت متأكد أنك تريد تغيير الحالة؟"}
        </p>
      </Modal>

      {/* Create Announcement Group Modal */}
      {isCreateModalVisible && (
        <CreateEditForm
          checkIfGroupIdExists={checkIfGroupIdExists}
          handleCreateGroup={handleCreateGroup}
          setIsCreateModalVisible={setIsCreateModalVisible}
          isCreateModalVisible={isCreateModalVisible}
          defaultValues={isEdit}
          onClose={handleOnClose}
        />
      )}

      {!!viewGroupUsers && (
        <GroupUsersForm
          groupId={viewGroupUsers.id}
          isOpen={!!viewGroupUsers}
          onClose={() => {
            setViewGroupUsers(() => undefined);
          }}
        />
      )}
    </>
  );
};

export default AnnouncementGroupsTable;
