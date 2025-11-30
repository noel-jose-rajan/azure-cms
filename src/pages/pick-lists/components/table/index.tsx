import { Button, message, Table, TableColumnsType, Tag, Tooltip } from "antd";
import {
  CreatePickListItemType,
  PickList,
  PickListType,
} from "../../../../components/services/picklist/type";
import { useTheme } from "../../../../context/theme";
import { useLanguage } from "../../../../context/language";
import { LANGUAGE } from "../../../../constants/language";
import { CSSProperties, useState } from "react";
import { EditFilled } from "@ant-design/icons";
import DeActivateLogo from "@/assets/deactivate-icon";
import ActivateIcon from "@/assets/activate_icon";
import AddNewPickListItem from "../add-new";
import {
  activateDeactivatePL,
  updateAPickListById,
} from "@/components/services/picklist";
import ConfirmModal from "../confirm-popup";
import { HttpStatus } from "@/components/functional/httphelper";
import TableComponent from "@/components/ui/table-component";

interface PickListTableProps {
  selected: PickListType;
  pickListItems: PickList[];
  updatePickListItems: (items: PickList[]) => void;
  allPickLists: PickList[];
  updateAllPickLists?: (PL: PickList[]) => void;
}

export default function PickListTable({
  pickListItems,
  selected,
  updatePickListItems,
  allPickLists,
  updateAllPickLists,
}: PickListTableProps) {
  const { theme } = useTheme();
  const { language, labels } = useLanguage();
  const isEnglish = language === LANGUAGE.ENGLISH_INT;
  const [selectedRow, setSelectedRow] = useState<PickList>();
  const [openActive, setOpenActive] = useState<boolean>(false);
  const [openDeActive, setOpenDeActive] = useState<boolean>(false);
  const [openEdit, setOpenEdit] = useState<boolean>(false);

  const columns: TableColumnsType<PickList> = [
    {
      title: labels.lbl.picklist_ar_label,
      dataIndex: "picklist_ar_label",
      render: (text: string) => (
        <a style={{ color: theme.colors.primary }}>{text}</a>
      ),
      sorter: {
        compare: (a, b) =>
          b.picklist_ar_label.localeCompare(a.picklist_ar_label),
        multiple: 3,
      },
      width: "20%",
    },
    {
      title: labels.lbl.picklist_en_label,
      dataIndex: "picklist_en_label",
      render: (text: string) => (
        <a style={{ color: theme.colors.primary }}>{text}</a>
      ),
      sorter: {
        compare: (a, b) =>
          b.picklist_en_label.localeCompare(a.picklist_en_label),
        multiple: 3,
      },
    },
    {
      title: labels.lbl.is_active,
      dataIndex: "is_enable",
      render: (text: string) => (
        <Tag
          style={{
            width: 40,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
          color={text ? theme.colors.success : theme.colors.danger}
        >
          {text ? "Yes" : "No"}
        </Tag>
      ),
    },
    {
      title: labels.lbl.is_deactivatable,
      dataIndex: "picklist_type",
      render: (text: string) => (
        <Tag
          style={{
            width: 40,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
          color={text === "System" ? theme.colors.success : theme.colors.danger}
        >
          {text !== "System" ? "Yes" : "No"}
        </Tag>
      ),
    },
    {
      title: labels.tbl.action,
      dataIndex: "picklist_id",
      render: (text: number, record: PickList) => (
        <div style={{ display: "flex" }}>
          <Button
            type="primary"
            onClick={() => {
              setSelectedRow(record);
              setOpenEdit(true);
            }}
            style={{ marginRight: 10 }}
          >
            <EditFilled />
          </Button>
          {record.picklist_type !== "System" && (
            <Tooltip
              title={
                !record.is_enable ? labels.btn.activate : labels.btn.deactivate
              }
            >
              <Button
                onClick={() => {
                  setSelectedRow(record);
                  if (record.is_enable) {
                    setOpenDeActive(true);
                  } else {
                    setOpenActive(true);
                  }
                }}
                style={{ marginRight: 10 }}
                disabled={selected.picklistType === "System"}
              >
                {record.is_enable ? (
                  <DeActivateLogo
                    color={theme.colors.primary}
                    style={{ height: isEnglish ? 20 : 16 }}
                  />
                ) : (
                  <ActivateIcon
                    color={theme.colors.primary}
                    style={{ height: isEnglish ? 20 : 16 }}
                  />
                )}
              </Button>
            </Tooltip>
          )}
        </div>
      ),
    },
  ];

  const iconStyle: CSSProperties = {
    marginLeft: isEnglish ? 0 : 10,
    marginRight: isEnglish ? 10 : 0,
  };

  const checkIsExist = (item: CreatePickListItemType): boolean => {
    const filtered = pickListItems.filter(
      (i) => i.picklist_id !== item.picklist_id
    );

    const distinctItem = filtered.find(
      (i) =>
        i.picklist_en_label === item.picklist_en_label ||
        i.picklist_ar_label === item.picklist_ar_label
    );

    if (distinctItem) {
      return true;
    }
    return false;
  };

  const updateAPickList = async (item: CreatePickListItemType) => {
    const response = await updateAPickListById(item);
    if (response.status === HttpStatus.SUCCESS) {
      const filtered = pickListItems.map((pl: PickList): PickList => {
        if (pl.picklist_id === selectedRow?.picklist_id) {
          return {
            ...pl,
            picklist_ar_label: item.picklist_ar_label,
            picklist_en_label: item.picklist_en_label,
          };
        }
        return pl;
      });

      const filteredAllPls = allPickLists.map((pl: PickList): PickList => {
        if (pl.picklist_id === selectedRow?.picklist_id) {
          return {
            ...pl,
            picklist_ar_label: item.picklist_ar_label,
            picklist_en_label: item.picklist_en_label,
          };
        }
        return pl;
      });
      updateAllPickLists?.(filteredAllPls);
      updatePickListItems(filtered);
    } else {
      message.error(
        isEnglish
          ? "Failed to update the Picklist item"
          : "فشل في تحديث عنصر قائمة التحقق"
      );
    }
    setSelectedRow(undefined);
    setOpenEdit(false);
  };

  const activatePickListItem = async (activate: boolean) => {
    if (!selectedRow) return;

    const response = await activateDeactivatePL(
      selectedRow.picklist_code,
      activate
    );

    if (response.status === HttpStatus.SUCCESS) {
      const filtered = pickListItems.map((item): PickList => {
        if (item.picklist_id === selectedRow.picklist_id) {
          item.is_enable = activate;
        }
        return item;
      });

      const filteredAllPls = pickListItems.map((item): PickList => {
        if (item.picklist_id === selectedRow.picklist_id) {
          item.is_enable = activate;
        }
        return item;
      });

      updateAllPickLists?.(filteredAllPls);
      updatePickListItems(filtered);
      setSelectedRow(undefined);
    } else {
      message.error(
        isEnglish
          ? "Failed to activate/deactivate the Picklist item"
          : "فشل في تنشيط / إلغاء تنشيط عنصر قائمة التحقق"
      );
    }
    if (activate) {
      setOpenActive(false);
    } else {
      setOpenDeActive(false);
    }
  };

  return (
    <>
      <TableComponent<PickList>
        showSorterTooltip
        sortDirections={["ascend", "descend"]}
        columns={columns}
        dataSource={pickListItems}
        rowKey="picklist_id"
        scroll={{ x: "max-content" }}
        pagination={{
          size: "small",
          defaultPageSize: 10,
          // showTotal: () => `Total ${pickListItems.length} items`,
          position: ["bottomCenter"],
          // showSizeChanger: true,
          pageSizeOptions: [5, 10, 20],
          style: { marginRight: 10 },
          showQuickJumper: true,
          hideOnSinglePage: true,
        }}
      />
      <ConfirmModal
        visible={openActive}
        updateVisible={setOpenActive}
        submitAction={() => activatePickListItem(true)}
        content={"Are you want to activate the item?"}
        title={isEnglish ? "Confirm Activate" : "تأكيد التنشيط"}
        Icon={
          <ActivateIcon
            color={theme.colors.primary}
            style={{ ...iconStyle, height: 16 }}
          />
        }
        ButtonIcon={
          <>
            <ActivateIcon color={"#fff"} style={{ ...iconStyle, height: 16 }} />
            {labels.btn.activate}
          </>
        }
      />
      <ConfirmModal
        visible={openDeActive}
        updateVisible={setOpenDeActive}
        submitAction={() => activatePickListItem(false)}
        content={"Are you want to de-activate the item?"}
        title={isEnglish ? "Confirm Deactivate" : "قم بتأكيد إلغاء التنشيط"}
        Icon={
          <DeActivateLogo
            color={theme.colors.primary}
            style={{ ...iconStyle, height: 16 }}
          />
        }
        ButtonIcon={
          <>
            <DeActivateLogo
              color={"#fff"}
              style={{ ...iconStyle, height: 16 }}
            />
            {labels.btn.deactivate}
          </>
        }
      />
      {selectedRow && openEdit && (
        <AddNewPickListItem
          title={isEnglish ? "Update a PickList" : "تحديث قائمة التحقق"}
          visible={openEdit}
          pickList={selected}
          onSubmit={updateAPickList}
          pickListItem={selectedRow}
          onCancel={() => {
            setOpenEdit(false);
            setSelectedRow(undefined);
          }}
          allPickLists={allPickLists}
        />
      )}
    </>
  );
}
