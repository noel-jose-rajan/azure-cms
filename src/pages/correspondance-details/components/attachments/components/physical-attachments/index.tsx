import { Col, Row, Table, TableColumnsType, TableProps } from "antd";
import { useEffect, useState } from "react";
import {
  CorrespondenceDetailType,
  PhysicalAttachmentsType,
} from "../../../../types";
import { useLanguage } from "../../../../../../context/language";
import { useTheme } from "../../../../../../context/theme";
import { getPhysicalAttachmentsOfCorrespondence } from "../../../../service";
import TitleHeader from "../../../../../../components/ui/header";
import { FileTextOutlined } from "@ant-design/icons";
import { PickListHelper } from "../../../../../../components/functional/picklists";
import { PickListItemType } from "../../../../../pick-lists/service";
import ActionMenuItem from "../../../../../../components/ui/menu-item";
import HistoryModal from "../history";

interface CorrespondenceAttachmentsProps {
  details?: CorrespondenceDetailType;
  canView: boolean;
}

export default function PhysicalAttachments({
  details,
  canView,
}: CorrespondenceAttachmentsProps) {
  const [physicalAttachments, setPhysicalAttachments] = useState<
    PhysicalAttachmentsType[]
  >([]);
  const [types, setTypes] = useState<PickListItemType[]>([]);
  const { labels, isEnglish } = useLanguage();
  const { theme } = useTheme();
  const [loading, setLoading] = useState<boolean>(false);
  const [visibleHistory, setVisibleHistory] = useState<boolean>(false);
  const [selectRows, setSelectedRows] = useState<PhysicalAttachmentsType[]>([]);

  useEffect(() => {
    getPhysicalAttachmentTypes();
    if (details) {
      fetchCorrespondenceHistory(details.corrId);
    }
  }, [details]);

  const fetchCorrespondenceHistory = async (id: string) => {
    setLoading(true);
    const response = await getPhysicalAttachmentsOfCorrespondence(id);

    if (response) {
      setPhysicalAttachments(response);
    }
    setLoading(false);
  };

  const getPhysicalAttachmentTypes = async () => {
    const res = await PickListHelper.physicalAttachmentType();

    setTypes(res);
  };

  const getDocTypeValue = (value: string) => {
    const val = types.find((pl) => pl.picklistCode === value);

    if (val) {
      return isEnglish ? val.picklistEnLabel : val.picklistArLabel;
    }

    return "-";
  };

  const columns: TableColumnsType<PhysicalAttachmentsType> = [
    {
      title: labels.tbl.type,
      dataIndex: "physicalAttachmentTypePickListCode",
      render: (text: string) => (
        <a style={{ color: theme.colors.primary }}>{getDocTypeValue(text)}</a>
      ),
    },
    {
      title: labels.tbl.description,
      dataIndex: "description",
      render: (text: string) => (
        <a style={{ color: theme.colors.primary }}>{text}</a>
      ),
      sorter: {
        compare: (a, b) => b.description.localeCompare(a.description),
        multiple: 3,
      },
    },
    {
      title: labels.tbl.quantity,
      dataIndex: "quantity",
      render: (text: number) => (
        <a style={{ color: theme.colors.primary }}>{text ?? "-"}</a>
      ),
      sorter: {
        compare: (a, b) => b.quantity - a.quantity,
        multiple: 3,
      },
    },
    {
      title: labels.tbl.att_last_modifier,
      dataIndex: "ownerDescription",
      render: (text) => (
        <a style={{ color: theme.colors.primary }}>{text ?? "-"}</a>
      ),
      sorter: {
        compare: (a, b) => b.ownerDescription.localeCompare(a.ownerDescription),
        multiple: 3,
      },
    },
    {
      title: labels.tbl.att_last_modify_date,
      dataIndex: "createdDate",
      render: (text) => (
        <a style={{ color: theme.colors.primary }}>
          {text ? text.replaceAll("-", "/") : "-"}
        </a>
      ),
      sorter: {
        compare: (a, b) => b.createdDate.localeCompare(a.createdDate),
        multiple: 3,
      },
    },
  ];

  const rowSelection: TableProps<PhysicalAttachmentsType>["rowSelection"] = {
    onChange: (_: React.Key[], _selectedRows: PhysicalAttachmentsType[]) => {
      setSelectedRows(_selectedRows);
    },
  };

  return (
    <Row style={{ width: "100%" }}>
      <TitleHeader
        heading={labels.til.physical_attachment}
        icon={<FileTextOutlined />}
      />
      <Col
        span={24}
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
            height: 55,
          }}
        >
          <ActionMenuItem
            onClick={() => setVisibleHistory(true)}
            isActive={selectRows.length === 1 && canView}
            label={labels.btn.viewHistory}
            type="history"
          />
        </div>
        <Table<PhysicalAttachmentsType>
          showSorterTooltip
          sortDirections={["ascend", "descend"]}
          columns={columns}
          dataSource={physicalAttachments}
          style={{ marginTop: 15, width: "100%" }}
          loading={loading}
          rowKey="physicalAttachmentId"
          rowSelection={{ type: "checkbox", ...rowSelection }}
          pagination={false}
          scroll={{ x: "max-content" }}
        />
        {visibleHistory && (
          <HistoryModal
            visible={visibleHistory}
            onClose={() => setVisibleHistory(false)}
            correspondenceId={details?.corrId}
            attachmentId={
              selectRows.length > 0
                ? selectRows[0].physicalAttachmentId.toString()
                : ""
            }
          />
        )}
      </Col>
    </Row>
  );
}
