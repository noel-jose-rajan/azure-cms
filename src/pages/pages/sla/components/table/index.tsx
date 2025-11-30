import TitleHeader from "@/components/ui/header";
import ActionMenuItem from "@/components/ui/menu-item";
import ModalComponent from "@/components/ui/modal";
import TableComponent from "@/components/ui/table-component";
import { useLanguage } from "@/context/language";
import { useTheme } from "@/context/theme";
import { deleteSla, SlaType } from "@/pages/pages/service";
import useGetAllOU from "@/store/orgs/use-get-all-ou";
import usePicklist from "@/store/picklists/use-picklist";
import { DeleteFilled, EditFilled, SwapOutlined } from "@ant-design/icons";
import { Button, Col, TableColumnsType } from "antd";
import { useState } from "react";
import CreateSlaModal from "../modal";
import { getSlaTypes } from "../../consts/sla";
import useHandleError from "@/components/hooks/useHandleError";
import useCustomMessage from "@/components/hooks/use-message";

type Props = {
  list: SlaType[];
  getList: () => Promise<void>;
};
const SlaTable = ({ getList, list }: Props) => {
  const { showMessage } = useCustomMessage();
  const { handleError } = useHandleError();
  const { theme } = useTheme();
  const { getPicklistById } = usePicklist();
  const { getOrgById } = useGetAllOU();
  const { labels, isEnglish } = useLanguage();
  const [openModal, setOpenModal] = useState(false);
  const [deletedId, setDeletedId] = useState<number | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [editedCol, setEditedCol] = useState<SlaType | null>(null);

  const columns: TableColumnsType<SlaType> = [
    {
      title: labels.tbl.name,
      dataIndex: "name",
      render: (_text: string) => {
        return <span>{_text}</span>;
      },
      width: 200,
      ellipsis: true,
    },
    {
      title: labels.lbl.corr_subject,
      dataIndex: "corr_subject",
      render: (_text: string) => {
        return <span>{_text || "-"}</span>;
      },
      width: 250,
      ellipsis: true,
    },
    {
      title: labels.lbl.corr_number,
      dataIndex: "corr_no",
      render: (_text: string) => {
        return <span>{_text || "-"}</span>;
      },
      width: 200,
      ellipsis: true,
    },
    {
      title: labels.lbl.type,
      dataIndex: "corr_type",
      render: (id: string) => {
        const p = getPicklistById("Correspondence Type", id);
        return (
          <span>
            {(isEnglish ? p?.picklist_en_label : p?.picklist_ar_label) || "-"}
          </span>
        );
      },
      width: 150,
    },
    {
      title: labels.lbl.security_level,
      dataIndex: "security_level",
      render: (id: string) => {
        const p = getPicklistById("Security Level", id);
        return (
          <span>
            {(isEnglish ? p?.picklist_en_label : p?.picklist_ar_label) || "-"}
          </span>
        );
      },
      width: 150,
    },
    {
      title: labels.lbl.org_unit,
      dataIndex: "org_unit",
      render: (id) => {
        const org = getOrgById(id);
        return <span>{(isEnglish ? org?.name_en : org?.name_ar) || "-"}</span>;
      },
      width: 150,
    },
    {
      title: isEnglish ? "Priority Order" : "ترتيب الأولوية",
      dataIndex: "order_by",
      render: (_text: string) => {
        return <span>{_text}</span>;
      },
      width: 200,
      ellipsis: true,
    },
    {
      title: labels.lbl.sla_type,
      dataIndex: "sla_time_type",
      render: (id) => {
        const type = getSlaTypes(isEnglish)?.find((t) => t.value == id);
        return <span>{type?.label}</span>;
      },
      width: 200,
      ellipsis: true,
    },
    {
      title: labels.lbl.sla_time,
      dataIndex: "sla_time",
      render: (_text: string) => {
        return <span>{_text}</span>;
      },
      width: 100,
      ellipsis: true,
    },
    {
      title: labels.tbl.action,
      dataIndex: "id",
      width: 150,
      render: (id, record) => (
        <div style={{ display: "flex", gap: 0 }}>
          <Button
            type="link"
            size="small"
            style={{ color: theme.colors.success }}
            onClick={() => {
              setEditedCol(record);
              setOpenModal(true);
            }}
          >
            <EditFilled />
          </Button>

          <Button
            type="link"
            size="small"
            danger
            onClick={() => setDeletedId(id)}
          >
            <DeleteFilled />
          </Button>
        </div>
      ),
    },
  ];

  const handleDelete = async () => {
    try {
      setDeleteLoading(true);
      if (!deletedId) return;
      const res = await deleteSla(deletedId || "");
      if (res) {
        showMessage("success", labels.msg.del_success);
        setDeletedId(null);
        await getList();
      }
    } catch (e) {
      handleError(e);
    } finally {
      setDeleteLoading(false);
    }
  };
  return (
    <>
      <Col>
        <TitleHeader
          heading={isEnglish ? "Agreement List" : "قائمة الاتفاقيات"}
          icon={<SwapOutlined style={{ color: theme.colors.backgroundText }} />}
        />

        <div
          style={{
            borderRadius: "2px",
            border: `0px solid ${theme.colors.border}`,
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
              onClick={() => {
                setOpenModal(true);
              }}
              isActive={true}
              label={labels.btn.add_new}
              type="add"
            />
            <TableComponent<SlaType>
              // isLoading={loading}
              sortDirections={["ascend", "descend"]}
              columns={columns}
              dataSource={list}
              scroll={{ x: "max-content" }}
              size="small"
              style={{ marginTop: 15, width: "100%" }}
              rowKey="id"
            />
          </div>
        </div>
      </Col>
      {deletedId !== null && (
        <ModalComponent
          title={isEnglish ? "Delete " : "حذف "}
          description={labels.msg.are_you_sure}
          visible={deletedId !== null}
          onClose={() => setDeletedId(null)}
          onSubmit={handleDelete}
          okText={labels.btn.delete}
          loading={deleteLoading}
        />
      )}

      {openModal && (
        <CreateSlaModal
          onCancel={() => {
            setOpenModal(false);
            setEditedCol(null);
          }}
          refreshData={getList}
          editedCol={editedCol}
        />
      )}
    </>
  );
};

export default SlaTable;
