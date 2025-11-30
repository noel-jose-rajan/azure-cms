import { FC, useState } from "react";
import { Button, message, Modal, Table, TableColumnsType, Tag } from "antd";
import { HttpStatus } from "@/components/functional/httphelper";
import {
  deleteAnOBTemplate,
  downloadOBTemplate,
} from "@/components/services/outbound-templates";
import { OutboundTemplateType } from "@/components/services/outbound-templates/type";
import DownloadProgress from "@/components/ui/download-progress";
import { useLanguage } from "@/context/language";
import { useTheme } from "@/context/theme";
import {
  CloudDownloadOutlined,
  DeleteOutlined,
  EditOutlined,
} from "@ant-design/icons";

import OrgUnitList from "../orgunit-list";
interface OutboundTemplatesTableProps {
  data: OutboundTemplateType[];
  loading: boolean;
  onEdit?: (id: number) => void;
  updateData?: (data: OutboundTemplateType[]) => void;
}

const OutboundTemplatesTable: FC<OutboundTemplatesTableProps> = ({
  data,
  loading,
  onEdit,
  updateData,
}) => {
  const {
    labels: { til, btn, tbl, lbl, msg },
    isEnglish,
  } = useLanguage();
  const {
    theme: { colors },
  } = useTheme();
  const [isDelete, setIsDelete] = useState<boolean>(false);
  const [selectedItem, setSelectedItem] = useState<number>();
  const [downloadVisible, setDownloadVisible] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const columns: TableColumnsType<OutboundTemplateType> = [
    {
      title: tbl.name,
      dataIndex: "template_name",
      render: (text: string) => (
        <a style={{ color: colors.primary, maxWidth: 200 }}>{text}</a>
      ),
      sorter: {
        compare: (a, b) => b.template_name.localeCompare(a.template_name),
        multiple: 3,
      },
      width: "30%",
    },
    {
      title: lbl.general,
      dataIndex: "is_general_template",
      render: (text: boolean | undefined) => (
        <Tag color={text ? colors.success : colors.danger}>
          {text ? lbl.yes : lbl.no}
        </Tag>
      ),
    },
    {
      title: lbl.org_unit,
      dataIndex: "id",
      render: (_text: number, record: OutboundTemplateType) => (
        <OrgUnitList template={record} />
      ),
    },
    {
      dataIndex: "id",
      render: (id: number) => (
        <>
          <Button type="primary" onClick={() => onEdit && onEdit(id)}>
            <EditOutlined />
          </Button>
          &nbsp;
          <Button type="dashed" danger onClick={() => showDeleteModal(id)}>
            <DeleteOutlined />
          </Button>
          &nbsp;
          <Button type="dashed" onClick={() => handleDownload(id)}>
            <CloudDownloadOutlined />
          </Button>
        </>
      ),
    },
  ];

  const showDeleteModal = async (id: number) => {
    setSelectedItem(id);
    setIsDelete(true);
  };

  const handleDownload = async (templateId: string | number) => {
    setDownloadVisible(true);
    await downloadOBTemplate(templateId, (percent) => {
      setProgress(percent);
    });
    setDownloadVisible(false);
  };

  const handleDeleteTemplate = async () => {
    if (selectedItem) {
      const status = await deleteAnOBTemplate(selectedItem);
      if (status.status === HttpStatus.SUCCESS) {
        message.success(msg.outbound_template_delete);
        const clonedData = [...data];
        let filteredData = clonedData.filter(
          (item) => item.id !== selectedItem
        );
        updateData && updateData(filteredData);
      } else {
        message.error(msg.error_message);
      }
      setIsDelete(false);
      setSelectedItem(undefined);
    }
  };

  return (
    <>
      <Table<OutboundTemplateType>
        showSorterTooltip
        sortDirections={["ascend", "descend"]}
        columns={columns}
        dataSource={data}
        style={{ marginTop: 15, width: "100%" }}
        loading={loading}
        rowKey="id"
        scroll={{ x: "max-content" }}
        pagination={{
          size: "small",
          // showTotal: () =>
          //   `${isEnglish ? "Total" : "المجموع"} ${data?.length} ${
          //     isEnglish ? "items" : "أغراض"
          //   }`,
          position: ["bottomCenter"],
          hideOnSinglePage: true,
          showSizeChanger: false,
          defaultPageSize: 5,
          // pageSizeOptions: [5, 10],
          style: { marginRight: 10 },
          showQuickJumper: true,
          total: data?.length,
          locale: {
            jump_to: isEnglish ? "Go to" : "اذهب الى",
            page: isEnglish ? "Page" : "صفحة",
            prev_page: isEnglish ? "Previous" : "خلف",
            next_page: isEnglish ? "Next" : "التالي",
            items_per_page: isEnglish ? "/ Page" : "/ صفحة",
          },
        }}
        className="outbound-templates-table"
      />

      <Modal
        title={isEnglish ? "Confirm Deletion" : "تأكيد الحذف"}
        open={isDelete}
        onOk={handleDeleteTemplate}
        onCancel={() => setIsDelete(false)}
        okText={isEnglish ? "Delete" : "حذف"}
        cancelText={isEnglish ? "Cancel" : "إلغاء"}
      >
        <p>
          {isEnglish
            ? "Are you sure you want to delete this template? This action cannot be undone."
            : "هل أنت متأكد أنك تريد حذف هذا القالب؟ هذا الإجراء لا يمكن التراجع عنه."}
        </p>
      </Modal>
      <DownloadProgress progress={progress} visible={downloadVisible} />
    </>
  );
};

export default OutboundTemplatesTable;
