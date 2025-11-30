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
import ModalWrapper from "./modal-wrappers";
import { getAllExternalEntities } from "../../../services/external-entity";
import {
  CreateExternalEntityType,
  ExternalEntityType,
} from "../../../services/external-entity/type";
import { HttpStatus } from "../../../functional/httphelper";

interface UserSearchComponentProps {
  multiSelect?: boolean;
  value?: string[];
  onChange?: (users: string[]) => void;
  label?: string;
  enableSearch?: boolean;
  showMore?: boolean;
  showMoreClicked?: () => void;
  allEntities?: ExternalEntityType[];
  disabled?: boolean;
  idRequired?: boolean;
  onSelect?: (entities: ExternalEntityType[]) => void;
  small?: boolean;
}

export default function ExternalEntitySearch({
  multiSelect = true,
  value,
  onChange,
  label,
  enableSearch = true,
  showMore = false,
  showMoreClicked,
  allEntities,
  disabled = false,
  idRequired = false,
  onSelect,
  small = false,
}: UserSearchComponentProps) {
  const { language } = useLanguage();
  const isEnglish = language === LANGUAGE.ENGLISH_INT;
  const labels = isEnglish ? englishLabels : arabicLabels;
  const { theme } = useTheme();
  const [visible, setVisible] = useState<boolean>(false);
  const [options, setOptions] = useState<{ label: string; value: string }[]>(
    []
  );
  const [allExternalEntities, setAllExternalEntities] = useState<
    ExternalEntityType[]
  >([]);
  const [messageApi, contextHolder] = message.useMessage();
  const [entityValues, setEntityValues] = useState<string[]>([]);
  const [open, setOpen] = useState<boolean>(false);
  const [focused, setFocused] = useState<boolean>(false);

  useEffect(() => {
    init();
  }, []);

  useEffect(() => {
    if (value) {
      setEntityValues(value);
    }
  }, [value]);

  useEffect(() => {
    if (allEntities) {
      setAllExternalEntities(allEntities);
      const formattedOptions = allEntities.map((item) => {
        return {
          label: isEnglish ? item.descEn : item.descAr,
          value: idRequired ? String(item.externalEntityId) : item.code,
        };
      });

      setOptions(formattedOptions);
    }
  }, [allEntities]);

  const init = async () => {
    if (!allEntities) {
      await fetchAllExternalEntities();
    }
  };

  const handleChange = (value: string[]) => {
    if (multiSelect) {
      setEntityValues(value);
      onChange && onChange(value);
    } else {
      if (value.length == 0) {
        setEntityValues(value);
        onChange && onChange(value);
      } else {
        const combined = [...value, ...entityValues];
        const uniqueValues = combined.filter(
          (item, _, array) => array.indexOf(item) === array.lastIndexOf(item)
        );

        setEntityValues(uniqueValues);
        onChange && onChange(uniqueValues);
      }
      setOpen(false);
    }
  };

  const handleSelect = (value: string[]) => {
    const theFilteredEntities = allExternalEntities.filter((item) =>
      idRequired
        ? value.includes(String(item.externalEntityId))
        : value.includes(String(item.code))
    );

    if (multiSelect) {
      onSelect && onSelect(theFilteredEntities);
    } else {
      if (value.length == 0) {
        onSelect && onSelect(theFilteredEntities);
      } else {
        const combined = [...value, ...entityValues];
        const uniqueValues = combined.filter(
          (item, _, array) => array.indexOf(item) === array.lastIndexOf(item)
        );

        const theFilteredEntities = allExternalEntities.filter((item) =>
          idRequired
            ? uniqueValues.includes(String(item.externalEntityId))
            : uniqueValues.includes(String(item.code))
        );

        onSelect && onSelect(theFilteredEntities);
      }
      setOpen(false);
    }
  };

  const fetchAllExternalEntities = async () => {
    try {
      const response = await getAllExternalEntities(
        { isActive: true } as CreateExternalEntityType,
        1000,
        1
      );

      if (response.status === HttpStatus.SUCCESS && response.data) {
        let respData = response.data.data;
        setAllExternalEntities(response.data.data);
        const formattedOptions = respData.map((item: ExternalEntityType) => {
          return {
            label: isEnglish ? item.descEn : item.descAr,
            value: idRequired ? String(item.externalEntityId) : item.code,
          };
        });

        setOptions(formattedOptions);
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
    top: focused || entityValues.length > 0 ? "0px" : "60%",
    transform:
      focused || entityValues.length > 0 ? "translateY(0)" : "translateY(-50%)",
    fontSize:
      focused || entityValues.length > 0 ? (small ? 10 : "12px") : "16px",
    color: focused ? theme.colors.primary : "grey",
    transition: "all 0.3s ease",
    pointerEvents: "none",
    width: "80%",
    display: "-webkit-box",
    WebkitLineClamp: focused || entityValues.length > 0 ? 1 : 2,
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
      label: <a>{`${labels.lbl.show_more} (${entityValues?.length ?? 0})`}</a>,
      icon: <TableOutlined />,
      onClick: () => showMoreClicked && showMoreClicked(),
    },
    {
      key: "2",
      label: <a>{labels.til.search_ext_ent}</a>,
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
          {label ?? labels.lbl.external_entity}
        </label>
        <Select
          mode={"tags"}
          allowClear={false}
          style={{
            ...styles.selectOption,
            overflow: "scroll",
            alignItems: multiSelect ? "flex-end" : "center",
          }}
          onChange={(values) => {
            handleChange(values);
            handleSelect(values);
          }}
          onFocus={() => setFocused(true)}
          disabled={disabled}
          options={options}
          value={entityValues}
          variant="borderless"
          suffixIcon={<></>}
          filterOption={(input, option) =>
            option
              ? option.label.toLowerCase().includes(input.toLowerCase())
              : false
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
                    multiSelect ? false : entityValues.length > 0 ? true : false
                  }
                />
              )
            ) : entityValues.length > 0 ? (
              <></>
            ) : (
              <SearchOutlined
                style={{ fontSize: 20, marginLeft: 5 }}
                onClick={() => setVisible(true)}
                disabled={
                  multiSelect ? false : entityValues.length > 0 ? true : false
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
          idRequired={idRequired}
          onChange={(values: string[]) => {
            setEntityValues(values);
            onChange && onChange(values);
            const theFilteredEntities = allExternalEntities.filter((item) =>
              idRequired
                ? values.includes(String(item.externalEntityId))
                : values.includes(String(item.code))
            );
            onSelect && onSelect(theFilteredEntities);
            setVisible(false);
          }}
          groupValues={entityValues}
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
