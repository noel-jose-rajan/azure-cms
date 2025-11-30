import {
  Button,
  Col,
  Modal,
  Progress,
  Row,
  Table,
  TableColumnsType,
  message,
} from "antd";
import { useLanguage } from "../../../../context/language";
import { useTheme } from "../../../../context/theme";
import { StampItemType } from "@/components/services/stamps/type";
import {
  DeleteFilled,
  DownloadOutlined,
  EditFilled,
  PlusOutlined,
  TableOutlined,
} from "@ant-design/icons";
import { useState } from "react";
import AddEditStampModal from "../add-edit-stamp";
import ModalComponent from "../../../../components/ui/modal";
// import { deleteStamp } from "../../service";
import { HttpStatus } from "../../../../components/functional/httphelper";
import { Accordion } from "../../../../components/ui/accordions/accordion";
import { Box } from "@mui/material";
import {
  deleteStamp,
  downloadAStampDoc,
} from "@/components/services/stamps/service";
import useGetAllOU from "@/store/orgs/use-get-all-ou";

interface GeneralStampsProps {
  stamps: StampItemType[];
  activateLoader: (loading: boolean) => void;
  allStamps: StampItemType[];
  updateStamps: (items: StampItemType[]) => void;
  refreshPage: () => void;
}

export default function OrgUnitStamps({
  stamps,
  activateLoader,
  allStamps,
  updateStamps,
  refreshPage,
}: GeneralStampsProps) {
  const { labels, isEnglish } = useLanguage();
  const [openAdd, setOpenAdd] = useState<boolean>(false);
  const [openEdit, setOpenEdit] = useState<boolean>(false);
  const [openDelete, setOpenDelete] = useState<boolean>(false);
  const { theme } = useTheme();
  const { orgUnits } = useGetAllOU();
  const [selectedStamp, setSelectedStamp] = useState<StampItemType>();
  const [visible, setVisible] = useState(false);
  const [progress, setProgress] = useState<number>(0);

  const getOrgUnitValue = (value: number) => {
    const findOU = orgUnits.find((ou) => ou.id === value);

    if (findOU) {
      return findOU.name_en;
    }

    return "-";
  };

  const columns: TableColumnsType<StampItemType> = [
    {
      title: labels.lbl.org_unit,
      dataIndex: "EntityID",
      render: (text: number) => (
        <a style={{ color: theme.colors.primary }}>{getOrgUnitValue(text)}</a>
      ),
      width: "30%",
    },
    {
      title: labels.tbl.description,
      dataIndex: "Description",
      render: (text: string) => (
        <a style={{ color: theme.colors.primary }}>{text}</a>
      ),
      sorter: {
        compare: (a, b) => b.Description.localeCompare(a.Description),
        multiple: 3,
      },
    },
    {
      title: labels.tbl.action,
      dataIndex: "ID",
      render: (_text: string, record: StampItemType) => (
        <div style={{ display: "flex" }}>
          <Button
            onClick={() => {
              setSelectedStamp(record);
              setOpenEdit(true);
            }}
            type="primary"
            style={{
              marginRight: 10,
            }}
          >
            <EditFilled />
          </Button>
          <Button
            onClick={() => {
              setSelectedStamp(record);
              setOpenDelete(true);
            }}
            type="primary"
            style={{
              marginRight: 10,
            }}
          >
            <DeleteFilled />
          </Button>
          <Button onClick={() => downloadStamp(record)} type="dashed">
            <DownloadOutlined />
          </Button>
        </div>
      ),
    },
  ];

  const onDeleteAnItem = async () => {
    activateLoader(true);
    const response = await deleteStamp(selectedStamp?.ID);

    if (response.status === HttpStatus.SUCCESS) {
      const filteredItems = allStamps.filter(
        (st) => st.ID !== selectedStamp?.ID
      );

      updateStamps(filteredItems);
    } else {
      message.error("Failed to delete the stamp");
    }

    activateLoader(false);
    setOpenDelete(false);
    resetSelections();
  };

  const Header = ({ title }: { title?: string }) => (
    <Box
      display="flex"
      alignItems="center"
      gap={1}
      color={theme.colors.backgroundText}
    >
      <TableOutlined />
      <span>{title}</span>
    </Box>
  );

  const downloadStamp = async (stamp: StampItemType) => {
    setVisible(true);
    await downloadAStampDoc(stamp, (percent) => {
      setProgress(percent);
    });
    setTimeout(() => {
      setVisible(false);
      setProgress(0);
    }, 1000);
    resetSelections();
  };

  const resetSelections = () => {
    setSelectedStamp(undefined);
  };

  return (
    <Accordion
      header={<Header title={labels.til.stamps_list} />}
      panelKey=""
      collapseContainerStyleProps={{
        backgroundColor: theme.colors.primary,
      }}
      icon={<TableOutlined />}
    >
      <Row style={{ padding: 0 }}>
        <Col
          span={24}
          style={{
            borderRadius: "2px",
            marginTop: 20,
          }}
        >
          <div
            style={{
              flexDirection: !isEnglish ? "row" : "row-reverse",
              display: "flex",
              flexWrap: "wrap",
              marginBottom: 10,
            }}
          >
            <Button
              onClick={() => {
                setOpenAdd(true);
              }}
              type="primary"
            >
              <PlusOutlined />
              {labels.btn.add_new}
            </Button>
          </div>
          <Table<StampItemType>
            showSorterTooltip
            sortDirections={["ascend", "descend"]}
            columns={columns}
            dataSource={stamps}
            scroll={{ x: "max-content" }}
            style={{ marginTop: 15, width: "100%" }}
            rowKey="ID"
            pagination={{
              size: "small",
              // showTotal: () =>
              //   `${isEnglish ? "Total" : "المجموع"} ${stamps.length} ${
              //     isEnglish ? "items" : "أغراض"
              //   }`,
              position: ["bottomCenter"],
              hideOnSinglePage: true,
              showSizeChanger: false,
              // pageSizeOptions: [5, 10, 20],
              style: { marginRight: 10 },
              showQuickJumper: true,
              total: stamps.length,
              locale: {
                jump_to: isEnglish ? "Go to" : "اذهب الى",
                page: isEnglish ? "Page" : "صفحة",
                prev_page: isEnglish ? "Previous" : "خلف",
                next_page: isEnglish ? "Next" : "التالي",
                items_per_page: isEnglish ? "/ Page" : "/ صفحة",
              },
            }}
          />
        </Col>
      </Row>
      {openAdd && (
        <AddEditStampModal
          visible={openAdd}
          onClose={() => setOpenAdd(false)}
          orgUnits={orgUnits}
          existingStamps={stamps}
          activateLoader={activateLoader}
          refreshPage={refreshPage}
          resetSelections={resetSelections}
        />
      )}
      {openEdit && (
        <AddEditStampModal
          visible={openEdit}
          onClose={() => setOpenEdit(false)}
          orgUnits={orgUnits}
          existingStamps={stamps}
          activateLoader={activateLoader}
          refreshPage={refreshPage}
          stamp={selectedStamp}
          resetSelections={resetSelections}
        />
      )}
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
      <Modal
        title="Downloading..."
        open={visible}
        footer={null}
        closable={false}
        centered
      >
        <br />
        <Progress
          percent={progress}
          size={["100%", 18]}
          status={progress === 100 ? "success" : "active"}
        />
        <br />
      </Modal>
    </Accordion>
  );
}
