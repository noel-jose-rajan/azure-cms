import { CSSProperties, useEffect, useState } from "react";
import { arabicLabels } from "../../../../constants/app-constants/ar";
import { englishLabels } from "../../../../constants/app-constants/en";
import { LANGUAGE } from "../../../../constants/language";
import { useLanguage } from "../../../../context/language";
import {
  CaretDownFilled,
  CheckOutlined,
  SearchOutlined,
  TableOutlined,
} from "@ant-design/icons";
import { Col, Dropdown, MenuProps, Select, Tag, message } from "antd";
import { useTheme } from "../../../../context/theme";
import ModalWrapper from "./components/modal-wrappers";
import { AnnouncementGroupsType } from "../../../services/announcement-groups/type";
import { getAllAnnouncementGroups } from "@/components/services/announcement-groups";
import { HttpStatus } from "../../../functional/httphelper";

interface UserSearchComponentProps {
  multiSelect?: boolean;
  value?: number[];
  onChange?: (users: number[]) => void;
  label?: string;
  enableSearch?: boolean;
  showMore?: boolean;
  showMoreClicked?: () => void;
  disabled?: boolean;
}

export default function AnnouncementGroupSearch({
  multiSelect = true,
  value,
  onChange,
  label,
  enableSearch = true,
  showMore = false,
  showMoreClicked,
  disabled = false,
}: UserSearchComponentProps) {
  const { language } = useLanguage();
  const isEnglish = language === LANGUAGE.ENGLISH_INT;
  const labels = isEnglish ? englishLabels : arabicLabels;
  const { theme } = useTheme();
  const [visible, setVisible] = useState<boolean>(false);
  const [options, setOptions] = useState<{ label: string; value: number }[]>(
    []
  );
  const [messageApi, contextHolder] = message.useMessage();
  const [groupValues, setGroupValues] = useState<number[]>([]);
  const [open, setOpen] = useState<boolean>(false);
  const [focused, setFocused] = useState<boolean>(false);
  const [allAnnouncementGroups, setAllAnnouncementGroups] = useState<
    AnnouncementGroupsType[]
  >([]);

  useEffect(() => {
    init();
  }, []);

  useEffect(() => {
    if (value) {
      setGroupValues(value);
    }
  }, [value]);

  const init = async () => {
    await fetchAllAnnouncementGroups();
  };

  const handleChange = (value: number[]) => {
    if (multiSelect) {
      setGroupValues(value);
      onChange && onChange(value);
    } else {
      if (value.length == 0) {
        setGroupValues(value);
        onChange && onChange(value);
      } else {
        const combined = [...value, ...groupValues];
        const uniqueValues = combined.filter(
          (item, _, array) => array.indexOf(item) === array.lastIndexOf(item)
        );

        setGroupValues(uniqueValues);
        onChange && onChange(uniqueValues);
      }
      setOpen(false);
    }
  };

  const fetchAllAnnouncementGroups = async () => {
    try {
      const response = await getAllAnnouncementGroups();

      if (response.status === HttpStatus.SUCCESS && response.data) {
        const data = response.data;
        setAllAnnouncementGroups(data.Data ?? []);
        const formattedOptions = data.Data?.map((item) => {
          return {
            label: isEnglish ? item.name_ar : item.name_ar,
            value: item.id,
          };
        });

        setOptions(formattedOptions ?? []);
      } else {
        messageApi.error(
          isEnglish ? "Failed to get Users" : "فشل في الحصول على المستخدمين"
        );
      }
    } catch (error) {
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

  const generalLabelStyle: CSSProperties = {
    position: "absolute",
    top: focused || groupValues.length > 0 ? "0px" : "60%",
    transform:
      focused || groupValues.length > 0 ? "translateY(0)" : "translateY(-50%)",
    fontSize: focused || groupValues.length > 0 ? "12px" : "16px",
    color: focused ? theme.colors.primary : "grey",
    transition: "all 0.3s ease",
    pointerEvents: "none",
    width: "80%",
    display: "-webkit-box",
    WebkitLineClamp: focused || groupValues.length > 0 ? 1 : 2,
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
      label: <a>{`${labels.lbl.show_more} (${groupValues?.length ?? 0})`}</a>,
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
          flexDirection: isEnglish ? "row" : "row-reverse",
        }}
      >
        <label style={isEnglish ? labelEnglishStyles : labelArabicStyles}>
          {label ?? labels.lbl.announce_grp}
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
          value={groupValues}
          variant="borderless"
          suffixIcon={<></>}
          filterOption={(input, option) => {
            return (
              option?.label?.toLowerCase().includes(input.toLowerCase()) ||
              false
            );
          }}
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
                    multiSelect ? false : groupValues.length > 0 ? true : false
                  }
                />
              )
            ) : groupValues.length > 0 ? (
              <></>
            ) : (
              <SearchOutlined
                style={{ fontSize: 20, marginLeft: 5 }}
                onClick={() => setVisible(true)}
                disabled={
                  multiSelect ? false : groupValues.length > 0 ? true : false
                }
              />
            )}
          </Col>
        )}
      </Col>
      {visible && (
        <ModalWrapper
          visible={visible}
          onClose={() => setVisible(false)}
          multiSelect={multiSelect}
          onChange={(values: number[]) => {
            setGroupValues(values);
            onChange && onChange(values);
            setVisible(false);
          }}
          groupValues={groupValues}
          allGroups={allAnnouncementGroups}
        />
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
