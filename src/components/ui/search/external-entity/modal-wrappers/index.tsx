import { FilterFilled, SearchOutlined, TableOutlined } from "@ant-design/icons";
import { Col, Modal } from "antd";
import { useEffect, useState } from "react";
import TitleHeader from "../../../header";
import { useLanguage } from "../../../../../context/language";
import { LANGUAGE } from "../../../../../constants/language";
import { englishLabels } from "../../../../../constants/app-constants/en";
import { arabicLabels } from "../../../../../constants/app-constants/ar";
import EntitySearchTable from "../table";
import EntitySearchForm from "../search";
import { getAllExternalEntities } from "../../../../services/external-entity";
import { HttpStatus } from "../../../../functional/httphelper";
import { ExternalEntityType } from "../../../../services/external-entity/type";
import { getPickListsItems } from "../../../../services/picklist";
import { PickListItemType } from "../../../../services/picklist/type";

interface ModalProps {
  visible: boolean;
  onClose: () => void;
  multiSelect: boolean;
  onChange?: (users: string[]) => void;
  groupValues: string[];
  idRequired?: boolean;
}

export default function ModalWrapper({
  onClose,
  visible,
  multiSelect,
  onChange,
  groupValues,
  idRequired = false,
}: ModalProps) {
  const { language } = useLanguage();
  const isEnglish = language === LANGUAGE.ENGLISH_INT;
  const labels = isEnglish ? englishLabels : arabicLabels;
  const [loading, setLoading] = useState<boolean>(false);
  const [groupData, setGroupData] = useState<ExternalEntityType[]>([]);
  const [searchValues, setSearchValues] = useState<any>();
  const [selectedGroupsFromTable, setSelectedGroupsFromTable] = useState<
    ExternalEntityType[]
  >([]);
  const [paginationDetails, setPaginationDetails] = useState<{
    page: number;
    perPage: number;
    total: number;
  }>({ page: 1, perPage: 10, total: 10 });

  const [entityClassification, setEntityClassification] = useState<
    PickListItemType[]
  >([]);

  useEffect(() => {
    getEntityClassification();
  }, []);

  const getEntityClassification = async () => {
    const response = await getPickListsItems("External Entity Classification");

    if (response) {
      setEntityClassification(response);
    }
  };

  useEffect(() => {
    if (selectedGroupsFromTable.length > 0) {
      const filtered = selectedGroupsFromTable.map((user) => {
        return idRequired
          ? user.externalEntityId.toString()
          : user.code.toString();
      });
      let combined = [...groupValues, ...filtered];
      let uniqueArray = [...new Set(combined)];

      onChange && onChange(uniqueArray);
    }
  }, [selectedGroupsFromTable]);

  useEffect(() => {
    searchAndFilterExternalEntities(
      searchValues,
      paginationDetails.perPage,
      paginationDetails.page
    );
  }, [paginationDetails.page, paginationDetails.perPage]);

  const searchAndFilterExternalEntities = async (
    searchCriteria: any = { active: true },
    perPage: number = 10,
    currentPage: number = 1
  ) => {
    setLoading(true);
    const response = await getAllExternalEntities(
      searchCriteria,
      perPage,
      currentPage
    );

    if (response.status === HttpStatus.SUCCESS && response.data) {
      setGroupData(response.data.data ?? []);
      const clonedPagination = { ...paginationDetails };
      clonedPagination.total = response.data.pageDetails.totalCount;
      setPaginationDetails(clonedPagination);
    } else {
      setGroupData([]);
    }

    setLoading(false);
  };

  const onSearchUsers = async (searchObject: any) => {
    setSearchValues(searchObject);

    await searchAndFilterExternalEntities(
      searchObject,
      paginationDetails.perPage,
      paginationDetails.page
    );
  };

  const resetSearchValues = async () => {
    setSearchValues(undefined);
    await searchAndFilterExternalEntities(
      { active: true },
      paginationDetails.perPage,
      paginationDetails.page
    );
  };

  return (
    <Modal
      afterClose={onClose}
      open={visible}
      onCancel={onClose}
      width={900}
      title={
        <>
          <SearchOutlined style={{ marginLeft: 10, marginRight: 10 }} />
          {labels.til.search_ext_ent}
        </>
      }
      footer={<></>}
      centered
      style={{ marginBottom: 50 }}
    >
      <TitleHeader
        heading={labels.til.search_criteria}
        icon={<FilterFilled style={{ color: "#fff" }} />}
      />
      <Col>
        <EntitySearchForm
          onSubmit={onSearchUsers}
          searchValues={searchValues}
          resetValues={resetSearchValues}
          entityClassification={entityClassification}
        />
      </Col>
      <TitleHeader
        heading={labels.til.search_result}
        icon={<TableOutlined style={{ color: "#fff" }} />}
      />
      <EntitySearchTable
        loading={loading}
        paginationDetails={paginationDetails}
        setPaginationDetails={setPaginationDetails}
        groupData={groupData}
        onSelectGroups={(users) => {
          setSelectedGroupsFromTable(users);
        }}
        multiSelect={multiSelect}
        entityClassification={entityClassification}
      />
    </Modal>
  );
}
