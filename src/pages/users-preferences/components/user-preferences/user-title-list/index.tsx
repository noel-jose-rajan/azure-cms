import { useEffect, useState } from "react";
import { useLanguage } from "../../../../../context/language";
import { LANGUAGE } from "../../../../../constants/language";
import {
  Button,
  Modal,
  Tag,
  message,
  Row,
  Col,
  Table,
  TableColumnsType,
} from "antd";
import { useTheme } from "../../../../../context/theme";
import ActionMenuItem from "../../../../../components/ui/menu-item";
import {
  EditOutlined,
  DeleteOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import {
  updateUserTitle,
  deleteUserTitle,
  setDefaultUserTitle,
  getAllTitles,
} from "../../../../../components/services/user-preference";
import * as z from "zod";
import { UserTitleType } from "../../../../../components/services/user-preference/type";
import { HttpStatus } from "../../../../../components/functional/httphelper";
import AddEditTitle from "../add-edit-title";
import DeleteTitleModal from "../delete-title";

interface Props {
  userId: number;
}

const DEFAULT_VALUE = {
  enUserTitle: "",
  arUserTitle: "",
  isDefault: false,
};

export default function UserTitleList({ userId }: Props) {
  const {
    labels: { lbl, btn },
    isEnglish,
  } = useLanguage();
  const {
    theme: { colors },
  } = useTheme();

  const [allTitles, setAllTitles] = useState<UserTitleType[]>([]);
  const [openAdd, setOpenAdd] = useState<boolean>(false);
  const [openEdit, setOpenEdit] = useState<boolean>(false);
  const [selectedTitle, setSelectedTitle] = useState<UserTitleType>();

  const [confirmVisible, setConfirmVisible] = useState<boolean>(false);
  const [titleToDelete, setTitleToDelete] = useState<number>();

  useEffect(() => {
    if (userId) {
      init();
    }
  }, [userId]);

  const init = async () => {
    const response = await getAllTitles(userId);
    if (response.status === HttpStatus.SUCCESS) {
      setAllTitles(response.data ?? []);
    }
  };

  const handleSetDefaultTitle = async (titleId: number) => {
    try {
      const response = await setDefaultUserTitle(userId, titleId, true);
      if (response.status === HttpStatus.SUCCESS) {
        message.success(response.message);

        setConfirmVisible(false);
      } else {
        message.error(
          isEnglish
            ? response?.message || "Failed to update default title"
            : response?.message || "فشل في تحديث العنوان الافتراضي"
        );
      }
    } catch (error) {
      message.error(
        isEnglish ? "An unexpected error occurred" : "حدث خطأ غير متوقع"
      );
    }
  };

  const columns: TableColumnsType<UserTitleType> = [
    {
      dataIndex: "title_ar",
      title: lbl.user_ar_name,
      sorter: {
        compare: (a, b) =>
          b.title_ar.toLowerCase().localeCompare(a.title_ar.toLowerCase()),
      },
    },
    {
      dataIndex: "title_en",
      title: lbl.user_en_name,
      sorter: {
        compare: (a, b) =>
          b.title_en.toLowerCase().localeCompare(a.title_en.toLowerCase()),
      },
    },
    {
      dataIndex: "isdefault",
      title: lbl.default,
      render: (text: boolean) => (
        <Tag color={text ? colors.success : colors.danger}>
          {text ? "Yes" : "No"}
        </Tag>
      ),
    },
    {
      title: "action",
      dataIndex: "id",
      render: (val: string, row: UserTitleType) => (
        <Col style={{ display: "flex", alignItems: "center" }}>
          <Button
            style={{ marginLeft: "5px" }}
            color="default"
            onClick={() => {
              setSelectedTitle(row);
              setOpenEdit(true);
            }}
          >
            <EditOutlined />
          </Button>
          <Button
            style={{ marginLeft: "5px" }}
            disabled={row.isdefault}
            onClick={() => {
              setTitleToDelete(row.id);
              setConfirmVisible(true);
            }}
            danger
          >
            <DeleteOutlined />
          </Button>
          <Button
            style={{
              marginLeft: "5px",
              borderColor: row.isdefault ? "unset" : colors.success,
            }}
            disabled={row.isdefault}
            onClick={() => {
              handleSetDefaultTitle(row.id);
            }}
            color="default"
          >
            <CheckCircleOutlined
              style={{
                color: row.isdefault ? "unset" : colors.success,
              }}
            />
          </Button>
        </Col>
      ),
    },
  ];

  return (
    <div
      style={{
        marginTop: "2rem",
        borderRadius: "2px",
        border: `1px solid ${colors.border}`,
      }}
    >
      <Row
        justify="space-between"
        gutter={16}
        style={{
          flexDirection: isEnglish ? "row" : "row-reverse",
        }}
      >
        <Col>
          <ActionMenuItem
            onClick={() => setOpenAdd(true)}
            isActive={true}
            label={btn.add_new}
            type="add"
          />
        </Col>
      </Row>

      <Table<UserTitleType>
        showSorterTooltip
        sortDirections={["ascend", "descend"]}
        columns={columns}
        dataSource={allTitles}
        style={{ marginTop: 15, width: "100%" }}
        rowKey="corrId"
        pagination={false}
        scroll={{ x: "max-content" }}
      />
      {openAdd && (
        <AddEditTitle
          userId={userId}
          allTitles={allTitles}
          visible={openAdd}
          onClose={() => setOpenAdd(false)}
          updateAllTitles={setAllTitles}
        />
      )}

      {openAdd && (
        <AddEditTitle
          userId={userId}
          allTitles={allTitles}
          visible={openAdd}
          onClose={() => setOpenAdd(false)}
          updateAllTitles={setAllTitles}
        />
      )}
      {openEdit && (
        <AddEditTitle
          userId={userId}
          allTitles={allTitles}
          visible={openEdit}
          title={selectedTitle}
          onClose={() => setOpenEdit(false)}
          updateAllTitles={setAllTitles}
        />
      )}
      {confirmVisible && titleToDelete && (
        <DeleteTitleModal
          visible={confirmVisible}
          onClose={(value: boolean) => {
            if (value) {
              let clonedTitles = [...allTitles];
              clonedTitles = clonedTitles.filter((t) => t.id !== titleToDelete);
              setAllTitles(clonedTitles);
            }
            setTitleToDelete(undefined);
            setConfirmVisible(false);
          }}
          titleId={titleToDelete}
        />
      )}
    </div>
  );
}
