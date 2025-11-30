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

import { useTheme } from "../../../../context/theme";
import TitleHeader from "../../header";
import SearchOrgUnitTable from "./components/table";
import OrgUnitSearchForm from "./components/search";
import { getAllOrganizationUnits } from "../../../services/organization-units";
import { HttpStatus } from "../../../functional/httphelper";
import {
  OrganizationUnitType,
  OUSearchModelType,
} from "../../../services/organization-units/type";

interface OrgUnitSearchComponentProps {
  multiSelect?: boolean;
  value?: string[];
  onChange?: (orgUnits: string[]) => void;
  label?: string;
  enableSearch?: boolean;
  showMore?: boolean;
  showMoreClicked?: () => void;
  allOrgUnits?: OrganizationUnitType[];
  code?: boolean;
  disabled?: boolean;
  onSelect?: (ous: OrganizationUnitType[]) => void;
  small?: boolean;
}

export default function OrgUnitSearchOption({
  multiSelect = false,
  value,
  onChange,
  allOrgUnits,
  enableSearch,
  label,
  showMore,
  showMoreClicked,
  code = false,
  disabled = false,
  onSelect,
  small = false,
}: OrgUnitSearchComponentProps) {
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
  const [orgUnitData, setOrgUnitData] = useState<OrganizationUnitType[]>([]);
  const [allOU, setAllOU] = useState<OrganizationUnitType[]>([]);
  const [searchValues, setSearchValues] = useState<OUSearchModelType>();
  const [selectedOrgUnitsFromTable, setSelectedOrgUnitsFromTable] = useState<
    OrganizationUnitType[]
  >([]);
  const [orgUnitValues, setOrgUnitValues] = useState<string[]>([]);
  const [open, setOpen] = useState<boolean>(false);
  const [focused, setFocused] = useState<boolean>(false);

  const handleChange = (value: string[]) => {
    const theFilteredOUs = allOU.filter((item) =>
      code
        ? value.includes(String(item.entity_code))
        : value.includes(String(item.entity_id))
    );

    if (multiSelect) {
      setOrgUnitValues(value);
      onChange && onChange(value);
      onSelect && onSelect(theFilteredOUs);
    } else {
      if (value.length == 0) {
        setOrgUnitValues(value);
        onChange && onChange(value);
        onSelect && onSelect(theFilteredOUs);
      } else {
        const combined = [...value, ...orgUnitValues];
        const uniqueValues = combined.filter(
          (item, _, array) => array.indexOf(item) === array.lastIndexOf(item)
        );

        const theFilteredOUs = allOU.filter((item) =>
          code
            ? uniqueValues.includes(String(item.entity_code))
            : uniqueValues.includes(String(item.entity_id))
        );

        setOrgUnitValues(uniqueValues);
        onChange && onChange(uniqueValues);
        onSelect && onSelect(theFilteredOUs);
      }
      setOpen(false);
    }
  };

  const init = async () => {
    if (!allOrgUnits) {
      await fetchAllOrgUnitsWithOptions();
    }
    if (visible) {
      await searchAndFilterOrgUnits();
    }
  };

  useEffect(() => {
    init();
  }, []);

  useEffect(() => {
    if (value) {
      setOrgUnitValues(value);
    }
  }, [value]);

  useEffect(() => {
    if (allOrgUnits) {
      setAllOU(allOrgUnits);
      const formattedOptions = allOrgUnits.map((item) => {
        return {
          label: isEnglish ? item.entity_desc_en : item.entity_desc_ar,
          value: code ? item.entity_code : item.entity_id.toString(),
        };
      });

      setOptions(formattedOptions);
    }
  }, [allOrgUnits]);

  useEffect(() => {
    if (selectedOrgUnitsFromTable.length > 0) {
      const filtered = selectedOrgUnitsFromTable.map((orgUnit) =>
        code ? orgUnit.entity_code : orgUnit.entity_id.toString()
      );
      const uniqueArray = [...new Set([...orgUnitValues, ...filtered])];
      setOrgUnitValues(uniqueArray);

      const theFilteredOUs = allOU.filter((item) =>
        code
          ? uniqueArray.includes(String(item.entity_code))
          : uniqueArray.includes(String(item.entity_id))
      );

      onChange && onChange(uniqueArray);
      onSelect && onSelect(theFilteredOUs);
    }
  }, [selectedOrgUnitsFromTable]);

  useEffect(() => {
    searchAndFilterOrgUnits(
      {},
      paginationDetails.perPage,
      paginationDetails.page
    );
  }, [paginationDetails.page, paginationDetails.perPage]);

  const searchAndFilterOrgUnits = async (
    searchCriteria: any = {},
    perPage: number = 10,
    currentPage: number = 1
  ) => {
    setLoading(true);
    const response = await getAllOrganizationUnits(
      searchCriteria,
      currentPage,
      perPage
    );

    if (response.status === HttpStatus.SUCCESS && response.data) {
      setOrgUnitData(response.data.data ?? []);

      const clonedPagination = { ...paginationDetails };
      clonedPagination.total = response.data.total_records;
      setPaginationDetails(clonedPagination);
    } else if (response.status === HttpStatus.NOTFOUND) {
      setOrgUnitData([]);
      const clonedPagination = { ...paginationDetails };
      clonedPagination.total = 0;
      setPaginationDetails(clonedPagination);
    } else {
      messageApi.error(
        isEnglish ? "Failed to get OrgUnits" : "فشل في الحصول على المستخدمين"
      );
    }

    setLoading(false);
  };

  const fetchAllOrgUnitsWithOptions = async () => {
    try {
      const response = await getAllOrganizationUnits(undefined, 1, 100);

      if (response.status === HttpStatus.SUCCESS && response.data) {
        const formattedOptions = (response.data.data ?? []).map((item) => {
          return {
            label: isEnglish ? item.entity_desc_en : item.entity_desc_ar,
            value: code ? item.entity_code : item.entity_id.toString(),
          };
        });
        setAllOU(response.data.data);
        setOptions(formattedOptions);
      } else {
        messageApi.error(
          isEnglish ? "Failed to get OrgUnits" : "فشل في الحصول على المستخدمين"
        );
      }
    } catch (error) {
      console.error("Error fetching options:", error);
      messageApi.error(
        isEnglish ? "Failed to get OrgUnits" : "فشل في الحصول على المستخدمين"
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

  const onSearchOrgUnits = async (searchObject: OUSearchModelType) => {
    setSearchValues(searchObject);

    await searchAndFilterOrgUnits(
      searchObject,
      paginationDetails.perPage,
      paginationDetails.page
    );
  };

  const resetSearchValues = async () => {
    setSearchValues(undefined);
    await searchAndFilterOrgUnits(
      {},
      paginationDetails.perPage,
      paginationDetails.page
    );
  };

  const generalLabelStyle: CSSProperties = {
    position: "absolute",
    top: focused || orgUnitValues.length > 0 ? "0px" : "60%",
    transform:
      focused || orgUnitValues.length > 0
        ? "translateY(0)"
        : "translateY(-50%)",
    fontSize:
      focused || orgUnitValues.length > 0 ? (small ? 10 : "12px") : "16px",
    color: focused ? theme.colors.primary : "grey",
    transition: "all 0.3s ease",
    pointerEvents: "none",
    width: "80%",
    display: "-webkit-box",
    WebkitLineClamp: focused || orgUnitValues.length > 0 ? 1 : 2,
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

  // const labelEnglishStyles: CSSProperties = {
  //   position: "absolute",
  //   left: "8px",
  //   top: focused || orgUnitValues.length > 0 ? "0px" : "60%",
  //   transform:
  //     focused || orgUnitValues.length > 0
  //       ? "translateY(0)"
  //       : "translateY(-50%)",
  //   fontSize: focused || orgUnitValues.length > 0 ? "12px" : "16px",
  //   color: focused ? theme.colors.primary : "grey",
  //   transition: "all 0.3s ease",
  //   pointerEvents: "none",
  // };

  // const labelArabicStyles: CSSProperties = {
  //   position: "absolute",
  //   right: "8px",
  //   top: focused || orgUnitValues.length > 0 ? "0px" : "60%",
  //   transform:
  //     focused || orgUnitValues.length > 0
  //       ? "translateY(0)"
  //       : "translateY(-50%)",
  //   fontSize: focused || orgUnitValues.length > 0 ? "12px" : "16px",
  //   color: focused ? theme.colors.primary : "grey",
  //   transition: "all 0.3s ease",
  //   pointerEvents: "none",
  // };

  const items: MenuProps["items"] = [
    {
      key: "1",
      label: <a>{`${labels.lbl.show_more} (${orgUnitValues?.length ?? 0})`}</a>,
      icon: <TableOutlined />,
      onClick: () => showMoreClicked && showMoreClicked(),
    },
    {
      key: "2",
      label: <a>{labels.til.search_org_unit}</a>,
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
          flexDirection: isEnglish ? "row" : "row-reverse",
        }}
      >
        <label style={isEnglish ? labelEnglishStyles : labelArabicStyles}>
          {label ?? labels.lbl.user_orgunit}
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
          options={options}
          value={orgUnitValues}
          disabled={disabled}
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
                    multiSelect
                      ? false
                      : orgUnitValues.length > 0
                      ? true
                      : false
                  }
                />
              )
            ) : orgUnitValues.length > 0 ? (
              <></>
            ) : (
              <SearchOutlined
                style={{ fontSize: 20, marginLeft: 5 }}
                onClick={() => setVisible(true)}
                disabled={
                  multiSelect ? false : orgUnitValues.length > 0 ? true : false
                }
              />
            )}
          </Col>
        )}
      </Col>

      <Modal
        afterClose={() => setVisible(false)}
        open={visible}
        onCancel={() => setVisible(false)}
        width={900}
        height={"90%"}
        title={
          <>
            <SearchOutlined style={{ marginLeft: 10, marginRight: 10 }} />
            {labels.til.search_org_unit}
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
          <OrgUnitSearchForm
            onSubmit={onSearchOrgUnits}
            searchValues={searchValues}
            resetValues={resetSearchValues}
          />
        </Col>
        <TitleHeader
          heading={labels.til.search_result}
          icon={<TableOutlined style={{ color: "#fff" }} />}
        />
        <SearchOrgUnitTable
          loading={loading}
          paginationDetails={paginationDetails}
          setPaginationDetails={setPaginationDetails}
          orgUnitData={orgUnitData}
          onSelectOrgUnits={(orgUnits) => {
            setSelectedOrgUnitsFromTable(orgUnits);
            setVisible(false);
          }}
          multiSelect={multiSelect}
        />
      </Modal>
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
