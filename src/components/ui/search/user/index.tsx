import { CSSProperties, useEffect, useState } from "react";
import { arabicLabels } from "../../../../constants/app-constants/ar";
import { englishLabels } from "../../../../constants/app-constants/en";
import { LANGUAGE } from "../../../../constants/language";
import { useLanguage } from "../../../../context/language";
import {
  CaretDownFilled,
  CheckOutlined,
  FilterFilled,
  SearchOutlined,
  TableOutlined,
} from "@ant-design/icons";
import { Col, Dropdown, MenuProps, Modal, Select, Tag, message } from "antd";
// import { UserSearchType, UserType } from "./service";
import { useTheme } from "../../../../context/theme";
import TitleHeader from "../../header";
import SearchUserTable from "./components/table";
import UserSearchForm from "./components/search";
import {
  advancedUserSearch,
  getAllUsers,
} from "../../../services/user-preference";
import { HttpStatus } from "../../../functional/httphelper";
import {
  UserSearchType,
  UserType,
} from "../../../services/user-preference/type";

interface UserSearchComponentProps {
  multiSelect: boolean;
  value?: string[];
  onChange?: (users: string[]) => void;
  label?: string;
  enableSearch?: boolean;
  showMore?: boolean;
  showMoreClicked?: () => void;
  allUsers?: UserType[];
  disabled?: boolean;
  nameRequired?: boolean;
  small?: boolean;
}
//not used
export default function UserSearch({
  multiSelect,
  value,
  onChange,
  label,
  enableSearch = true,
  showMore = false,
  showMoreClicked,
  allUsers,
  disabled = false,
  nameRequired = false,
  small = false,
}: UserSearchComponentProps) {
  const { language } = useLanguage();
  const isEnglish = language === LANGUAGE.ENGLISH_INT;
  const labels = isEnglish ? englishLabels : arabicLabels;
  const { theme } = useTheme();
  const [visible, setVisible] = useState<boolean>(false);
  const [options, setOptions] = useState<any[]>([]);
  const [messageApi, contextHolder] = message.useMessage();
  const [paginationDetails, setPaginationDetails] = useState<{
    page: number;
    perPage: number;
    total: number;
  }>({ page: 1, perPage: 5, total: 10 });
  const [loading, setLoading] = useState<boolean>(false);
  const [userData, setUserData] = useState<UserType[]>([]);
  const [searchValues, setSearchValues] = useState<UserSearchType>();
  const [selectedUsersFromTable, setSelectedUsersFromTable] = useState<
    UserType[]
  >([]);
  const [userValues, setUserValues] = useState<string[]>([]);
  const [open, setOpen] = useState<boolean>(false);
  const [focused, setFocused] = useState<boolean>(false);

  const handleChange = (value: string[]) => {
    if (multiSelect) {
      setUserValues(value);
      onChange && onChange(value);
    } else {
      if (value.length == 0) {
        setUserValues(value);
        onChange && onChange(value);
      } else {
        const combined = [...value, ...userValues];
        const uniqueValues = combined.filter(
          (item, _, array) => array.indexOf(item) === array.lastIndexOf(item)
        );

        setUserValues(uniqueValues);
        onChange && onChange(uniqueValues);
      }
      setOpen(false);
    }
  };

  useEffect(() => {
    init();
  }, []);

  useEffect(() => {
    if (value) {
      setUserValues(value);
    }
  }, [value]);

  useEffect(() => {
    if (visible === true) {
      searchAndFilterUsers(
        {},
        paginationDetails.perPage,
        paginationDetails.page
      );
    }
  }, [visible]);

  useEffect(() => {
    if (allUsers) {
      const formattedOptions = allUsers.map((item) => {
        return {
          label: item.username,
          value: nameRequired ? item.username : item.userId,
        };
      });

      setOptions(formattedOptions);
    }
  }, [allUsers]);

  const init = async () => {
    if (!allUsers) {
      await fetchAllUsersWithOptions();
    }
  };

  useEffect(() => {
    if (selectedUsersFromTable.length > 0) {
      const filtered = selectedUsersFromTable.map((user) =>
        nameRequired ? user.username : user.userId
      );

      let combined = [...userValues, ...filtered];

      let uniqueArray = [...new Set(combined)];

      setUserValues(uniqueArray);
      onChange && onChange(uniqueArray);
    }
  }, [selectedUsersFromTable]);

  useEffect(() => {
    if (visible) {
      searchAndFilterUsers(
        {},
        paginationDetails.perPage,
        paginationDetails.page
      );
    }
  }, [paginationDetails.page, paginationDetails.perPage]);

  const searchAndFilterUsers = async (
    searchCriteria: any = {},
    perPage: number = 10,
    currentPage: number = 1
  ) => {
    setLoading(true);
    const response = await advancedUserSearch(
      currentPage,
      perPage,
      searchCriteria
    );

    if (response.status === HttpStatus.SUCCESS && response.data) {
      setUserData(response.data.data);
      const clonedPagination = { ...paginationDetails };
      clonedPagination.total = response.data.pageDetails.totalCount;
      setPaginationDetails(clonedPagination);
    } else {
      setUserData([]);
      const clonedPagination = { ...paginationDetails };
      clonedPagination.total = 0;
      setPaginationDetails(clonedPagination);
    }

    setLoading(false);
  };

  const fetchAllUsersWithOptions = async () => {
    try {
      const response = await getAllUsers();

      if (response.status === HttpStatus.SUCCESS && response.data) {
        const formattedOptions = response.data.data.map((item) => {
          return {
            label: item.username,
            value: nameRequired ? item.username : item.userId,
          };
        });

        setOptions(formattedOptions);
      } else {
        messageApi.error(
          isEnglish ? "Failed to get Users" : "فشل في الحصول على المستخدمين"
        );
      }
    } catch (error) {
      console.error("Error fetching options:", error);
      messageApi.error(
        isEnglish ? "Failed to get Users" : "فشل في الحصول على المستخدمين"
      );
    }
  };

  const customTagRender = (props: any) => {
    const { label, onClose } = props;

    return (
      <Tag
        color={theme.colors.primary}
        closable
        onClose={onClose}
        style={{ marginRight: 4, marginLeft: 4 }}
      >
        {label}
      </Tag>
    );
  };

  const onSearchUsers = async (searchObject: UserSearchType) => {
    setSearchValues(searchObject);

    await searchAndFilterUsers(
      searchObject,
      paginationDetails.perPage,
      paginationDetails.page
    );
  };

  const resetSearchValues = async () => {
    setSearchValues(undefined);
    await searchAndFilterUsers(
      {},
      paginationDetails.perPage,
      paginationDetails.page
    );
  };

  const generalLabelStyle: CSSProperties = {
    position: "absolute",
    top: focused || userValues.length > 0 ? "0px" : "60%",
    transform:
      focused || userValues.length > 0 ? "translateY(0)" : "translateY(-50%)",
    fontSize: focused || userValues.length > 0 ? (small ? 10 : "12px") : "16px",
    color: focused ? theme.colors.primary : "grey",
    transition: "all 0.3s ease",
    pointerEvents: "none",
    width: "80%",
    display: "-webkit-box",
    WebkitLineClamp: focused || userValues.length > 0 ? 1 : 2,
    WebkitBoxOrient: "vertical",
    overflow: "hidden",
    textOverflow: "ellipsis",
  };

  const labelEnglishStyles: CSSProperties = {
    left: "8px",
    ...generalLabelStyle,
  };

  const labelArabicStyles: CSSProperties = {
    right: "8px",
    textAlign: "right",
    ...generalLabelStyle,
  };

  const items: MenuProps["items"] = [
    {
      key: "1",
      label: <a>{`${labels.lbl.show_more} (${userValues?.length ?? 0})`}</a>,
      icon: <TableOutlined />,
      onClick: () => showMoreClicked && showMoreClicked(),
    },
    {
      key: "2",
      label: <a>{labels.til.search_user}</a>,
      icon: <SearchOutlined />,
      onClick: () => setVisible(true),
    },
    {
      key: "3",
      label: <a>{labels.btn.auto_selectAll}</a>,
      icon: <CheckOutlined />,
      onClick: () => {
        handleChange(options.map((u) => u.value));
      },
    },
  ];

  return (
    <>
      {contextHolder}
      <Col
        style={{
          ...styles.wrapper,
          position: "relative",
          borderBottom: `1.5px solid ${theme.colors.success}`,
        }}
      >
        <label style={isEnglish ? labelEnglishStyles : labelArabicStyles}>
          {label ?? labels.lbl.user}
        </label>
        <Select
          mode={"tags"}
          allowClear={false}
          style={{
            ...styles.selectOption,
            overflow: "scroll",
            alignItems: multiSelect ? "flex-end" : "center",
          }}
          onChange={handleChange}
          onFocus={() => setFocused(true)}
          disabled={disabled}
          options={options}
          value={userValues}
          variant="borderless"
          suffixIcon={<></>}
          filterOption={(input, option) =>
            option?.label?.toLowerCase().includes(input.toLowerCase())
          }
          tagRender={customTagRender}
          open={open}
          onDropdownVisibleChange={(visible) => setOpen(visible)}
          onBlur={() => setFocused(false)}
        />
        {enableSearch && (
          <Col style={styles.searchIcon}>
            {multiSelect ? (
              showMore ? (
                <Dropdown menu={{ items }} trigger={["click"]}>
                  <CaretDownFilled style={{ fontSize: 20, marginLeft: 5 }} />
                </Dropdown>
              ) : (
                <SearchOutlined
                  style={{ fontSize: 20, marginLeft: 5 }}
                  onClick={() => setVisible(true)}
                  disabled={
                    multiSelect ? false : userValues.length > 0 ? true : false
                  }
                />
              )
            ) : userValues.length > 0 ? (
              <></>
            ) : (
              <SearchOutlined
                style={{ fontSize: 20, marginLeft: 5 }}
                onClick={() => setVisible(true)}
                disabled={
                  multiSelect ? false : userValues.length > 0 ? true : false
                }
              />
            )}
          </Col>
        )}
      </Col>
      {visible && (
        <Modal
          afterClose={() => setVisible(false)}
          open={visible}
          onCancel={() => setVisible(false)}
          width={900}
          height={"90%"}
          title={
            <>
              <SearchOutlined style={{ marginLeft: 10, marginRight: 10 }} />
              {labels.til.search_user}
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
            <UserSearchForm
              onSubmit={onSearchUsers}
              searchValues={searchValues}
              resetValues={resetSearchValues}
            />
          </Col>
          <TitleHeader
            heading={labels.til.search_result}
            icon={<TableOutlined style={{ color: "#fff" }} />}
          />
          {}
          <SearchUserTable
            loading={loading}
            paginationDetails={paginationDetails}
            setPaginationDetails={setPaginationDetails}
            userData={userData}
            onSelectUsers={(users) => {
              setSelectedUsersFromTable(users);
              setVisible(false);
            }}
            multiSelect={multiSelect}
          />
        </Modal>
      )}
    </>
  );
}

const styles = {
  selectOption: {
    width: "100%",
    minHeight: 45,
    maxHeight: 50,
    display: "flex",
    marginTop: 8,
  },
  wrapper: {
    display: "flex",
    alignItems: "center",
    paddingTop: 5,
    position: "relative",
  },
  searchIcon: {
    width: 25,
    display: "flex",
    alignItems: "flex-end",
    height: 40,
  },
};
