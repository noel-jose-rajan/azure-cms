import { FilterFilled, SearchOutlined, TableOutlined } from "@ant-design/icons";
import { Col, Modal, Typography } from "antd";
import { useState } from "react";
import EntitySearchTable from "../table";
import EntitySearchForm from "../search";
import TitleHeader from "@/components/ui/header";
import { useLanguage } from "@/context/language";
import { ExternalEntity } from "@/pages/external-entity/service";

interface ModalProps {
  onClose: () => void;
  multiSelect: boolean;
  onSelect: (entities: number[]) => void;
  data: ExternalEntity[];
}

export default function ExternalEntitySearchModal({
  data,
  onClose,
  multiSelect,
  onSelect,
}: ModalProps) {
  const { labels } = useLanguage();
  console.log({ data });

  const [filteredData, setFilteredData] = useState<ExternalEntity[]>(
    data || []
  );
  // useEffect(() => {
  //   if (selectedGroupsFromTable.length > 0) {
  //     const filtered = selectedGroupsFromTable.map((user) => {
  //       return idRequired
  //         ? user.externalEntityId.toString()
  //         : user.code.toString();
  //     });
  //     let combined = [...groupValues, ...filtered];
  //     let uniqueArray = [...new Set(combined)];

  //     onChange && onChange(uniqueArray);
  //   }
  // }, [selectedGroupsFromTable]);

  // useEffect(() => {
  //   searchAndFilterExternalEntities(
  //     searchValues,
  //     paginationDetails.perPage,
  //     paginationDetails.page
  //   );
  // }, [paginationDetails.page, paginationDetails.perPage]);

  // const searchAndFilterExternalEntities = async (
  //   searchCriteria: any = { active: true },
  //   perPage: number = 10,
  //   currentPage: number = 1
  // ) => {
  //   setLoading(true);
  //   const response = await getAllExternalEntities(
  //     searchCriteria,
  //     perPage,
  //     currentPage
  //   );

  //   if (response.status === HttpStatus.SUCCESS && response.data) {
  //     setGroupData(response.data.data ?? []);
  //     const clonedPagination = { ...paginationDetails };
  //     clonedPagination.total = response.data.pageDetails.totalCount;
  //     setPaginationDetails(clonedPagination);
  //   } else {
  //     setGroupData([]);
  //   }

  //   setLoading(false);
  // };

  const onSearch = async ({
    classify_id = -1,
    abbr = "",
    name = "",
    // g2g_code = "",
    phone = "",
    fax = "",
    email = "",
    entity_code,
  }: ExternalEntity) => {
    const filteredData = data?.filter(
      (user) =>
        (user.name_ar.toLowerCase().includes(name.toLowerCase()) ||
          user.name_en.toLowerCase().includes(name.toLowerCase())) &&
        user.entity_code
          ?.toLowerCase()
          .includes((entity_code || "")?.toLowerCase()) &&
        (classify_id != -1 ? user.classify_id === classify_id : true)
    );
    setFilteredData(filteredData);
  };
  // setSearchValues(searchObject);
  // await searchAndFilterExternalEntities(
  //   searchObject,
  //   paginationDetails.perPage,
  //   paginationDetails.page
  // );
  // };

  // const resetSearchValues = async () => {
  //   setSearchValues(undefined);
  //   await searchAndFilterExternalEntities(
  //     { active: true },
  //     paginationDetails.perPage,
  //     paginationDetails.page
  //   );
  // };

  return (
    <Modal
      afterClose={onClose}
      open={true}
      onCancel={onClose}
      width={900}
      title={
        <Typography>
          <SearchOutlined style={{ marginLeft: 10, marginRight: 10 }} />
          {labels.til.search_ext_ent}
        </Typography>
      }
      footer={<></>}
      centered
      // style={{ marginBottom: 50 }}
    >
      <TitleHeader
        heading={labels.til.search_criteria}
        icon={<FilterFilled style={{ color: "#fff" }} />}
      />
      <Col>
        <EntitySearchForm
          onSearch={onSearch}
          // searchValues={searchValues}
          // resetValues={resetSearchValues}
        />
      </Col>
      <TitleHeader
        heading={labels.til.search_result}
        icon={<TableOutlined style={{ color: "#fff" }} />}
      />
      <EntitySearchTable
        data={filteredData}
        onSelect={(entities: number[]) => {
          onSelect(entities);
        }}
        multiSelect={multiSelect}
      />
    </Modal>
  );
}
