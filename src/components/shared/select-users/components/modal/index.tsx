import TitleHeader from "../../../../ui/header";
import { FilterFilled, SearchOutlined, TableOutlined } from "@ant-design/icons";
import { Col, Modal, Typography } from "antd";
import { useLanguage } from "../../../../../context/language";
import UserSearchForm from "../search";
import SearchUserTable from "../table";
import { UserSearchType } from "../../schema";
import { UserType } from "../../service";
import { useState } from "react";
type Props = {
  visible: boolean;
  onClose: () => void;
  multiSelect?: boolean;
  users: UserType[];
  onSelectUsers: (users: number[]) => void;
  selectedUsers: number[];
  label?: string;
};
const SearchUsersModal = ({
  onSelectUsers,
  users = [],
  visible,
  onClose,
  multiSelect = false,
  selectedUsers = [],
  label,
}: Props) => {
  const { labels } = useLanguage();
  const [filteredUsers, setFilteredUsers] = useState<UserType[]>(users);

  const onSearchUsers = ({
    userLoginName = "",
    userName = "",
  }: UserSearchType) => {
    const filteredUsers = users?.filter(
      (user) =>
        (user.name_ar.toLowerCase().includes(userName.toLowerCase()) ||
          user.name_en.toLowerCase().includes(userName.toLowerCase())) &&
        user.username.toLowerCase().includes(userLoginName.toLowerCase())
    );
    setFilteredUsers(filteredUsers);
  };

  // const onResetSearch = () => {
  //   setFilteredUsers(users);
  // };

  return (
    <>
      <Modal
        afterClose={() => onClose()}
        open={visible}
        onCancel={() => onClose()}
        width={900}
        height={"90%"}
        title={
          <Typography>
            <SearchOutlined style={{ marginLeft: 10, marginRight: 10 }} />
            {label}
          </Typography>
        }
        footer={<></>}
        centered
        style={{ marginBottom: 50 }}
      >
        <TitleHeader
          heading={labels.til.search_criteria}
          applyReverse={false}
          icon={<FilterFilled style={{ color: "#fff" }} />}
        />
        <Col>
          <UserSearchForm
            onSubmit={onSearchUsers}
            // onResetSearch={onResetSearch}
          />
        </Col>
        <TitleHeader
          applyReverse={false}
          heading={labels.til.search_result}
          icon={<TableOutlined style={{ color: "#fff" }} />}
        />

        <SearchUserTable
          selectedUsers={selectedUsers}
          userData={filteredUsers}
          onClose={onClose}
          onSelectUsers={(ids: number[]) => {
            console.log("Selected User IDs:", ids);
            onSelectUsers(ids);
          }}
          multiSelect={multiSelect}
        />
      </Modal>
    </>
  );
};

export default SearchUsersModal;
