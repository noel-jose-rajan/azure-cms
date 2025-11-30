import { useLanguage } from "../../context/language";
import { LANGUAGE } from "../../constants/language";
import { englishLabels } from "../../constants/app-constants/en";
import { arabicLabels } from "../../constants/app-constants/ar";
import TitleBar from "../../components/ui/bar/title-bar";
import TitleHeader from "../../components/ui/header";
import { useEffect, useState } from "react";
import LoaderComponent from "../../components/ui/loader";
import UrgencyNotificationTable from "./components/urgency-notification-table";
import ActionMenuItem from "../../components/ui/menu-item";
import { DeleteFilled, TableOutlined } from "@ant-design/icons";
import CreateNewUrgencyNotification from "./components/add-new";
import ModalComponent from "../../components/ui/modal";
import DeActivateLogo from "../../assets/deactivate-icon";
import ActivateIcon from "../../assets/activate_icon";
import { Col, message } from "antd";
import EmptyListItems from "../../components/ui/empty-list";
import {
  addANewUrgencyNotification,
  deleteUrgencyNotification,
  getAllNotificationPickList,
  updateUrgencyNotification,
} from "../../components/services/urgency-notifications";
import { HttpStatus } from "../../components/functional/httphelper";
import {
  CreateUrgencyType,
  UrgencyNotificationPickListType,
} from "../../components/services/urgency-notifications/type";
import { CreatePickListItemType } from "../../components/services/picklist/type";
import {
  activateDeactivatePL,
  createNewPickListItem,
  deleteAPickList,
  getPickListsItems,
  updateAPickListById,
} from "../../components/services/picklist";

export default function UrgencyNotifications() {
  const { language } = useLanguage();
  const isEnglish = language === LANGUAGE.ENGLISH_INT;
  const labels = isEnglish ? englishLabels : arabicLabels;
  const [pickLists, setPickLists] = useState<UrgencyNotificationPickListType[]>(
    []
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [openDelete, setOpenDelete] = useState<boolean>(false);
  const [openActive, setOpenActive] = useState<boolean>(false);
  const [openDeActive, setOpenDeActive] = useState<boolean>(false);
  const [openCreate, setOpenCreate] = useState<boolean>(false);
  const [openEdit, setOpenEdit] = useState<boolean>(false);
  const [selectedRows, setSelectedRows] = useState<
    UrgencyNotificationPickListType[]
  >([]);
  const [messageApi, contextHolder] = message.useMessage();

  useEffect(() => {
    init();
  }, []);

  const fetchAllPickListNotification = async () => {
    const response = await getAllNotificationPickList();

    if (response.status === HttpStatus.SUCCESS) {
      if (response.data) {
        setPickLists(response.data.data);
      } else {
        setPickLists([]);
      }
    }
  };

  const init = async () => {
    setLoading(true);
    await fetchAllPickListNotification();
    setLoading(false);
  };

  const onDeleteAnItem = async () => {
    if (selectedRows.length === 0 || !selectedRows[0].id) {
      return;
    }
    setLoading(true);
    const deleteResponse = await deleteUrgencyNotification(selectedRows[0].id);

    if (deleteResponse) {
      const response = await deleteAPickList(selectedRows[0].pickListId);

      if (response) {
        const filtered = pickLists.filter(
          (list) => list.id !== selectedRows[0].id
        );

        setPickLists(filtered);
      } else {
        messageApi.error(
          isEnglish
            ? "Failed to delete an urgency notification"
            : "فشل في حذف إشعار عاجل"
        );
      }
    } else {
      messageApi.error(
        isEnglish
          ? "Failed to delete a Pick list item"
          : "فشل في حذف عنصر قائمة الانتقاء"
      );
    }
    setSelectedRows([]);
    setOpenDelete(false);
    setLoading(false);
  };

  const updateStatus = async (status: boolean) => {
    setLoading(true);
    const response = await activateDeactivatePL(
      selectedRows[0].picklistCode,
      status
    );

    if (response) {
      await fetchAllPickListNotification();
    }

    await fetchAllPickListNotification();

    if (status) {
      setOpenActive(false);
    } else {
      setOpenDeActive(false);
    }

    setSelectedRows([]);
    setLoading(false);
  };

  const createPickListItem = async (item: CreateUrgencyType) => {
    setLoading(true);

    const jsonBody: CreatePickListItemType = {
      picklist_ar_label: item.picklistArLabel,
      picklist_en_label: item.picklistEnLabel,
      picklist_name: item?.picklistName ?? "Urgency Level",
      picklist_code: "UGR-2",
    };

    const response = await createNewPickListItem(jsonBody);

    if (response) {
      const plResponse = await getPickListsItems(
        item?.picklistName ?? "Urgency Level"
      );

      if (plResponse && plResponse.length > 0) {
        const findItem = plResponse.find(
          (pl) => pl.pickListId === response.data.details_en[0].id
        );

        if (findItem) {
          await createNewUrgencyNotification(item, findItem.picklistCode);
        }
      }
    } else {
      messageApi.error(
        isEnglish
          ? "Failed to create a Pick list"
          : "فشل في إنشاء قائمة الاختيار"
      );
    }
    setOpenCreate(false);
    setLoading(false);
  };

  const createNewUrgencyNotification = async (
    item: CreateUrgencyType,
    code: string
  ) => {
    let jsonBody = {
      actionDuration: Number(item.actionDuration),
      durationUnit: item.durationUnit,
      notificationFrequency: Number(item.notificationFrequency),
      urgencyLevelPickListCode: code,
    };

    const response = await addANewUrgencyNotification(jsonBody);

    if (!response) {
      messageApi.error(
        isEnglish
          ? "Failed to create a Urgency Notification"
          : "فشل في إنشاء إشعار عاجل"
      );
    } else {
      await fetchAllPickListNotification();
    }
  };

  const onUpdateUrgencyNotification = async (item: CreateUrgencyType) => {
    setLoading(true);

    const jsonBody: CreatePickListItemType = {
      picklist_ar_label: item.picklistArLabel,
      picklist_en_label: item.picklistEnLabel,
      picklist_code: "URG-4",
      picklist_name: item?.picklistName ?? "Urgency Level",
    };

    const response = await updateAPickListById(jsonBody);

    if (response) {
      await saveChangesToUrgencyNotification(selectedRows[0].id, item);
    } else {
      messageApi.error(
        isEnglish
          ? "Failed to Update the Pick list"
          : "فشل تحديث قائمة الانتقاء"
      );
    }
    setSelectedRows([]);
    setOpenEdit(false);
    setLoading(false);
  };

  const saveChangesToUrgencyNotification = async (
    id: number,
    item: CreateUrgencyType
  ) => {
    const payload = {
      actionDuration: Number(item.actionDuration),
      durationUnit: item.durationUnit,
      notificationFrequency: Number(item.notificationFrequency),
      urgencyLevelPickListCode: selectedRows[0].picklistCode,
    };
    const response = await updateUrgencyNotification(id, payload);

    if (response) {
      const filtered = pickLists.map((pl: UrgencyNotificationPickListType) => {
        if (pl.id === id) {
          const cloned = { ...pl };

          cloned.picklistArLabel = item.picklistArLabel;
          cloned.picklistEnLabel = item.picklistEnLabel;
          cloned.notificationFrequency = Number(item.notificationFrequency);
          cloned.actionDuration = Number(item.actionDuration);
          cloned.durationUnit = item.durationUnit;

          return cloned;
        }

        return pl;
      });

      setPickLists(filtered);
    } else {
      messageApi.error(
        isEnglish
          ? "Failed to update the Urgency Notification"
          : "فشل تحديث إشعارات الطوارئ"
      );
    }
  };

  return (
    <>
      {contextHolder}
      <TitleBar
        title={{
          en: labels.mnu.urgency_notification,
          ar: labels.mnu.urgency_notification,
        }}
      />
      <TitleHeader
        heading={labels.til.urgency_notification}
        icon={<TableOutlined style={{ color: "#fff" }} />}
      />
      {pickLists.length > 0 ? (
        <div style={{ padding: 10 }}>
          <div
            style={{
              borderRadius: "2px",
              marginTop: 20,
              border: "1px solid #cbcbcb",
            }}
          >
            <div
              style={{
                flexDirection: isEnglish ? "row" : "row-reverse",
                display: "flex",
                flexWrap: "wrap",
              }}
            >
              <ActionMenuItem
                onClick={() => setOpenCreate(true)}
                isActive
                label={labels.btn.add_new}
                type="add"
              />
              <ActionMenuItem
                onClick={() => setOpenEdit(true)}
                isActive={selectedRows.length > 0 ? true : false}
                label={labels.btn.edit}
                type="edit"
              />
              <ActionMenuItem
                onClick={() => setOpenDelete(true)}
                isActive={
                  selectedRows.length > 0 && selectedRows[0].isSystem === false
                }
                label={labels.btn.delete}
                type="delete"
              />
              <ActionMenuItem
                onClick={() => setOpenActive(true)}
                isActive={
                  selectedRows.length > 0 &&
                  selectedRows[0].isSystem === false &&
                  selectedRows[0].isActive === false
                }
                label={labels.btn.activate}
                type="activate"
              />
              <ActionMenuItem
                onClick={() => setOpenDeActive(true)}
                isActive={
                  selectedRows.length > 0 &&
                  selectedRows[0].isSystem !== true &&
                  selectedRows[0].isActive === true
                }
                label={labels.btn.deactivate}
                type="deactivate"
              />
            </div>
            <UrgencyNotificationTable
              pickListItems={pickLists}
              onSelectARow={setSelectedRows}
              selectedRows={selectedRows}
            />
          </div>
        </div>
      ) : (
        <EmptyListItems />
      )}
      <LoaderComponent loading={loading} />
      <CreateNewUrgencyNotification
        visible={openCreate}
        onCancel={() => setOpenCreate(false)}
        fullLists={pickLists}
        onSubmit={createPickListItem}
      />
      <CreateNewUrgencyNotification
        visible={openEdit}
        onCancel={() => setOpenEdit(false)}
        pickList={selectedRows[0]}
        fullLists={pickLists}
        onSubmit={onUpdateUrgencyNotification}
      />
      <ModalComponent
        title={
          <Col style={{ display: "flex", alignItems: "center" }}>
            <DeleteFilled
              style={{
                marginRight: isEnglish ? 10 : 0,
                marginLeft: isEnglish ? 0 : 10,
              }}
            />
            {isEnglish ? "Confirm Delete" : "تأكيد الحذف"}
          </Col>
        }
        description={labels.msg.if_delete_general}
        visible={openDelete}
        onClose={() => setOpenDelete(false)}
        onSubmit={onDeleteAnItem}
        okText={labels.btn.delete}
        okIcon={<DeleteFilled />}
      />
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
        description={labels.msg.if_deactivate_general}
        visible={openDeActive}
        onClose={() => setOpenDeActive(false)}
        onSubmit={() => updateStatus(false)}
        okText={labels.btn.deactivate}
        okIcon={<DeActivateLogo color={"#fff"} style={{ height: 16 }} />}
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
        description={labels.msg.if_activate_general}
        visible={openActive}
        onClose={() => setOpenActive(false)}
        onSubmit={() => updateStatus(true)}
        okText={labels.btn.activate}
        okIcon={<ActivateIcon color={"#fff"} style={{ height: 16 }} />}
      />
    </>
  );
}
