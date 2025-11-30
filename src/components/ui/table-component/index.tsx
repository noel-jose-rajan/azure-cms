import { ConfigProvider, Empty, GetProp, Spin, Table, TableProps } from "antd";
import Spinner from "../spinner";
import { useLanguage } from "@/context/language";

interface TableComponentProps<RecordType extends object>
  extends TableProps<RecordType> {
  isLoading?: boolean;
  pageSize?: number;
  pagination?: TableProps<RecordType>["pagination"];
}

const TableComponent = <RecordType extends object>({
  isLoading = false,
  pagination,
  pageSize = 10,
  ...props
}: TableComponentProps<RecordType>) => {
  const { isEnglish } = useLanguage();
  const renderEmpty: GetProp<typeof ConfigProvider, "renderEmpty"> = () => {
    return (
      <Empty
        image={Empty.PRESENTED_IMAGE_SIMPLE}
        description={isEnglish ? "No Data" : "لا يوجد بيانات"}
      />
    );
  };

  return (
    <ConfigProvider renderEmpty={renderEmpty}>
      <Table<RecordType>
        {...props}
        loading={{
          indicator: <Spin indicator={<Spinner />} />,
          spinning: isLoading,
        }}
        sticky
        // style={{ paddingInline: 10 }}
        scroll={{ x: "max-content" }}
        size="small"
        pagination={
          pagination || {
            hideOnSinglePage: true,
            pageSize,
            position: ["bottomCenter"],
            showQuickJumper: true,
            showSizeChanger: false,

            locale: {
              jump_to: isEnglish ? "Go to" : "اذهب الى",
              page: isEnglish ? "Page" : "صفحة",
              prev_page: isEnglish ? "Previous" : "خلف",
              next_page: isEnglish ? "Next" : "التالي",
              items_per_page: isEnglish ? "/ Page" : "/ صفحة",
            },
          }
        }
      />
    </ConfigProvider>
  );
};

export default TableComponent;
