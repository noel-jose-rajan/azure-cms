import { TableColumnsType, TableProps, Tag } from "antd";
import { useTheme } from "../../../../context/theme";
import { useLanguage } from "../../../../context/language";
import { useState } from "react";
import { ExternalEntity } from "../../service";
import ActionMenuItem from "@/components/ui/menu-item";
import ViewEntityDetails from "../view-entity-details";
import ModalComponent from "@/components/ui/modal";
import DeActivateLogo from "@/assets/deactivate-icon";
import ActivateIcon from "@/assets/activate_icon";
import CreateEntityModal from "../add-edit-entity";
import usePicklist from "@/store/picklists/use-picklist";
import TableComponent from "@/components/ui/table-component";
import useUpdateEntity from "../../hooks/use-update-entity";
import { UpdateExternalEntityPayload } from "@/components/shared/select-external-entity/service";
import useExternalEntities from "@/store/external-entities/use-external-entities";
import useCustomMessage from "@/components/hooks/use-message";

interface ExternalEntityListTableProps {
  entityItems: ExternalEntity[];
}

export default function ExternalEntityListTable({
  entityItems,
}: ExternalEntityListTableProps) {
  const { showMessage } = useCustomMessage();
  const { getPicklistById } = usePicklist();
  const { refreshAllExternalEntites } = useExternalEntities();
  const { theme } = useTheme();
  const { labels, isEnglish } = useLanguage();
  const { loading: updateLoading, updateExternalEntity } = useUpdateEntity();
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>();
  const [viewVisible, setViewVisible] = useState<boolean>(false);
  // const [openDelete, setOpenDelete] = useState<boolean>(false);
  const [openActive, setOpenActive] = useState<boolean>(false);
  const [openDeActive, setOpenDeActive] = useState<boolean>(false);
  const [openCreate, setOpenCreate] = useState<boolean>(false);
  const [openEdit, setOpenEdit] = useState<boolean>(false);
  // const [openImport, setOpenImport] = useState<boolean>(false);
  const [selectedExternalEntity, setSelectedExternalEntity] = useState<
    ExternalEntity[]
  >([]);

  const columns: TableColumnsType<ExternalEntity> = [
    {
      title: labels.lbl.english_name,
      dataIndex: "name_en",
      render: (text: string) => (
        <a style={{ color: theme.colors.primary }}>{text}</a>
      ),
      width: 150,
      sorter: {
        compare: (a, b) => b.name_en.localeCompare(a.name_en),
        multiple: 3,
      },
    },
    {
      title: labels.lbl.arabic_name,
      dataIndex: "name_ar",
      render: (text: string) => (
        <a style={{ color: theme.colors.primary }}>{text}</a>
      ),
      width: 150,
      sorter: {
        compare: (a, b) => b.name_ar.localeCompare(a.name_ar),
        multiple: 3,
      },
    },
    {
      title: labels.lbl.short_number,
      dataIndex: "abbr",
      width: 120,

      render: (text: string) => (
        <a style={{ color: theme.colors.primary }}>{text || "-"}</a>
      ),
      sorter: {
        compare: (a, b) => (b.abbr ?? "")?.localeCompare(a.abbr ?? ""),
        multiple: 3,
      },
    },
    {
      width: 120,

      title: labels.lbl.classification,
      dataIndex: "classify_id",
      render: (text: string) => {
        const picklist = getPicklistById(
          "External Entity Classification",
          text
        );
        return (
          <a style={{ color: theme.colors.primary }}>
            {(isEnglish
              ? picklist?.picklist_en_label
              : picklist?.picklist_ar_label) || "-"}
          </a>
        );
      },
      // sorter: {
      //   compare: (a, b) =>
      //     b.classifyPickListCode.localeCompare(a.classifyPickListCode),
      //   multiple: 3,
      // },
    },
    {
      width: 120,

      title: labels.lbl.sequence_number,
      dataIndex: "entity_code",
      render: (text = "") => (
        <a style={{ color: theme.colors.primary }}>{text}</a>
      ),
      // sorter: {
      //   compare: (a, b) => b.entity_code - a.entity_code,
      //   multiple: 3,
      // },
    },
    {
      width: 120,

      title: labels.lbl.status,
      dataIndex: "is_active",
      render: (text: boolean) => {
        return (
          <Tag
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              width: 100,
            }}
            color={text ? "#0F9D58" : "#DB4437"}
          >
            {text ? labels.lbl.active : labels.lbl.notactive}
          </Tag>
        );
      },
      sorter: {
        compare: (a, b) =>
          a.is_active === b.is_active ? 0 : a.is_active ? -1 : 1,
        multiple: 3,
      },
    },
  ];

  const rowSelection: TableProps<ExternalEntity>["rowSelection"] = {
    selectedRowKeys,
    onChange: (
      selectedRowKeys: React.Key[],
      selectedRows: ExternalEntity[]
    ) => {
      console.log(selectedRowKeys);
      setSelectedRowKeys(selectedRowKeys);
      setSelectedExternalEntity(selectedRows);
      // onSelectARow(selectedRows);
    },
  };

  const updateActiveStatusOfEntity = async (isActive: boolean) => {
    if (isActive) {
      setOpenActive(false);
    } else {
      setOpenDeActive(false);
    }

    // const filtered = selectedExternalEntity.map((entity) => ({
    //   [entity.externalEntityId.toString()]: isActive,
    // }));
    const selectedItem = selectedExternalEntity[0];

    const payload: UpdateExternalEntityPayload = {
      is_active: isActive,
    };
    const res = await updateExternalEntity(selectedItem?.id || 0, payload);
    if (res?.ID) {
      showMessage("success", labels.msg.update_ex_success);
      await refreshAllExternalEntites();
      setOpenActive(false);
      setOpenDeActive(false);
      setSelectedExternalEntity([]);
      setSelectedRowKeys([]);
    }
  };

  const checkIsActivatable = (): boolean => {
    let active = true;

    if (selectedExternalEntity.length === 0) {
      return false;
    }

    selectedExternalEntity.forEach((element) => {
      if (element.is_active) {
        return (active = false);
      }
    });

    return active;
  };

  const checkIsDeActivatable = (): boolean => {
    let active = true;

    if (selectedExternalEntity.length === 0) {
      return false;
    }

    selectedExternalEntity.forEach((element) => {
      if (!element.is_active) {
        return (active = false);
      }
    });

    return active;
  };

  const onDeleteAnItem = async () => {
    // setOpenDelete(false);
    // setLoading(true);
    // if (selectedExternalEntity.length === 1) {
    //   const response = await deleteAExternalEntity(
    //     selectedExternalEntity[0]?.id + ""
    //   );
    //   if (response) {
    //     const filteredEntries = externalEntities.filter(
    //       (con) => con.id !== selectedExternalEntity[0].id
    //     );
    //     setExternalEntities(filteredEntries ?? []);
    //     setSelectedExternalEntity([]);
    //   }
    // }
    // setLoading(false);
  };

  return (
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
          isActive={selectedExternalEntity.length === 1}
          label={labels.btn.edit}
          type="edit"
        />
        {/* <ActionMenuItem
          onClick={() => setOpenDelete(true)}
          isActive={
            selectedExternalEntity.length === 1 &&
            selectedExternalEntity[0].is_active
          }
          label={labels.btn.delete}
          type="delete"
        /> */}
        <ActionMenuItem
          onClick={() => setOpenActive(true)}
          isActive={checkIsActivatable()}
          label={labels.btn.activate}
          type="activate"
        />
        <ActionMenuItem
          onClick={() => setOpenDeActive(true)}
          isActive={checkIsDeActivatable()}
          label={labels.btn.deactivate}
          type="deactivate"
        />
        <ActionMenuItem
          onClick={() => setViewVisible(true)}
          isActive={selectedExternalEntity.length === 1}
          label={labels.btn.view}
          type="eye"
        />
        {/* <ActionMenuItem
          onClick={() => setOpenImport(true)}
          isActive
          label={labels.btn.import}
          type="upload"
        />
      </div> */}

        <TableComponent<ExternalEntity>
          rowSelection={{ type: "radio", ...rowSelection }}
          // showSorterTooltip
          sortDirections={["ascend", "descend"]}
          columns={columns}
          dataSource={entityItems}
          rowKey="id"
          scroll={{ x: "max-content" }}
        />
        {viewVisible && (
          <ViewEntityDetails
            onCancel={() => {
              setViewVisible(false);
            }}
            title={labels.lbl.external_entity}
            id={selectedExternalEntity[0]?.id + ""}
            entity={selectedExternalEntity[0]}
          />
        )}
        {/* <ModalComponent
        title={"Confirm Delete"}
        description={labels.msg.if_delete_general}
        visible={openDelete}
        onClose={() => setOpenDelete(false)}
        onSubmit={onDeleteAnItem}
        okText={labels.btn.delete}
        okIcon={<DeleteFilled />}
      /> */}
        <ModalComponent
          title={"Confirm deactivate"}
          description={labels.msg.if_deactivate_general}
          visible={openDeActive}
          onClose={() => setOpenDeActive(false)}
          onSubmit={() => updateActiveStatusOfEntity(false)}
          okText={labels.btn.deactivate}
          okIcon={<DeActivateLogo color={"#fff"} style={{ height: 16 }} />}
          loading={updateLoading}
        />
        <ModalComponent
          title={"Confirm Activate"}
          description={labels.msg.if_activate_general}
          visible={openActive}
          onClose={() => setOpenActive(false)}
          onSubmit={() => updateActiveStatusOfEntity(true)}
          okText={labels.btn.activate}
          okIcon={<ActivateIcon color={"#fff"} style={{ height: 16 }} />}
          loading={updateLoading}
        />
        {openCreate && (
          <CreateEntityModal
            title={labels.lbl.external_entity}
            visible={openCreate}
            onCancel={() => setOpenCreate(false)}
          />
        )}
        {openEdit && (
          <CreateEntityModal
            key={"create-edit-entity" + isEnglish}
            title={labels.lbl.external_entity}
            visible={openEdit}
            onCancel={() => setOpenEdit(false)}
            externalEntity={selectedExternalEntity[0]}
            id={selectedExternalEntity[0].id + ""}
          />
        )}
        {/* <UploadTemplateFile
        visible={openImport}
        onCancel={() => setOpenImport(false)}
      /> */}
      </div>
    </div>
  );
}
