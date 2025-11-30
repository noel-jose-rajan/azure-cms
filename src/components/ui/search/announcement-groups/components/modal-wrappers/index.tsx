import { FilterFilled, SearchOutlined, TableOutlined } from "@ant-design/icons";
import { Col, Modal, message } from "antd";
import { useEffect, useRef, useState } from "react";
import { useLanguage } from "../../../../../../context/language";
import { LANGUAGE } from "../../../../../../constants/language";
import { englishLabels } from "../../../../../../constants/app-constants/en";
import { arabicLabels } from "../../../../../../constants/app-constants/ar";
import TitleHeader from "../../../../header";
import AnnouncementGroupSearchTable from "../table";
import GroupSearchForm from "../search";
import { getAllAnnouncementGroups } from "../../../../../services/announcement-groups";
import { HttpStatus } from "../../../../../functional/httphelper";
import {
  AnnouncementGroupsType,
  SearchGroupsType,
} from "../../../../../services/announcement-groups/type";
import { useForm } from "react-hook-form";
import { searchAnnouncementGroups } from "@/components/functional/announcement-groups";

interface ModalProps {
  visible: boolean;
  onClose: () => void;
  multiSelect: boolean;
  onChange?: (users: number[]) => void;
  groupValues: number[];
  allGroups: AnnouncementGroupsType[];
}

export default function ModalWrapper({
  onClose,
  visible,
  multiSelect,
  onChange,
  groupValues,
  allGroups,
}: ModalProps) {
  const { language } = useLanguage();
  const isEnglish = language === LANGUAGE.ENGLISH_INT;
  const labels = isEnglish ? englishLabels : arabicLabels;
  const [loading, setLoading] = useState<boolean>(false);
  const [groupData, setGroupData] = useState<AnnouncementGroupsType[]>([]);
  const [selectedGroupsFromTable, setSelectedGroupsFromTable] = useState<
    AnnouncementGroupsType[]
  >([]);

  const form = useForm<SearchGroupsType>({
    defaultValues: {
      is_active: true,
    },
  });

  useEffect(() => {
    setGroupData(allGroups);
  }, [allGroups]);

  useEffect(() => {
    if (selectedGroupsFromTable.length > 0) {
      const filtered = selectedGroupsFromTable.map((u) => u.id);
      let combined = [...groupValues, ...filtered];
      let uniqueArray = [...new Set(combined)];

      onChange && onChange(uniqueArray);
    }
  }, [selectedGroupsFromTable]);

  const onSearchUsers = async (searchObject: SearchGroupsType) => {
    const filtered = searchAnnouncementGroups(allGroups, searchObject, isEnglish);
    setGroupData(filtered);
  };

  const resetSearchValues = async () => {
    form.reset();
    setGroupData(allGroups);
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
          {labels.til.announce_grp_search}
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
        <GroupSearchForm
          onSubmit={onSearchUsers}
          resetValues={resetSearchValues}
          form={form}
        />
      </Col>
      <TitleHeader
        heading={labels.til.search_result}
        icon={<TableOutlined style={{ color: "#fff" }} />}
      />
      <AnnouncementGroupSearchTable
        loading={loading}
        groupData={groupData}
        onSelectGroups={(users) => {
          setSelectedGroupsFromTable(users);
        }}
        multiSelect={multiSelect}
      />
    </Modal>
  );
}
