import { Select, Typography, type SelectProps } from "antd";
import { useEffect, useState } from "react";
import Label from "../label";

import ErrorComponent from "../error";
import CaretDownOutlined from "@ant-design/icons/lib/icons/CaretDownOutlined";
import Spinner from "../../spinner";
import { useLanguage } from "../../../../context/language";
import { DefaultOptionType } from "antd/es/select";

type Props = {
  value: string | number | number[] | string[] | undefined | null;
  label: string;
  Icon?: React.ReactNode;
  spinning?: boolean;
  error?: string | undefined;
  disabled?: boolean;
  onChange?: (value: number | number[]) => void;
  isRequired?: boolean;
  options?: DefaultOptionType[];
  mode?: "multiple" | "tags" | undefined;
  canClear?: boolean;
  showDefaultValueIfOneOption?: boolean;
  setFirstOptionAsDefault?: boolean;
  listHeight?: number;
} & SelectProps;
const SelectComponent = ({
  setFirstOptionAsDefault,
  mode,
  error,
  value,
  label,
  Icon,
  spinning,
  onChange,
  canClear = true,
  disabled = false,
  isRequired = false,
  showDefaultValueIfOneOption = false,
  options = [],
  listHeight = 200,
  ...props
}: Props) => {
  const [isFocus, setIsFocus] = useState(false);
  const [filteredOptions, setFilteredOptions] =
    useState<DefaultOptionType[]>(options);
  const hasValue =
    !(
      value?.length == 0 ||
      value == undefined ||
      value == 0 ||
      value == -1 ||
      value == ""
    ) || value === "0";
  const disableSelect = props.loading || disabled;

  useEffect(() => {
    if (filteredOptions.length > 0) return;
    if (options?.length == 0) return;
    setFilteredOptions(options || []);
    if (
      ((options.length === 1 && showDefaultValueIfOneOption) ||
        setFirstOptionAsDefault) &&
      mode != "multiple"
    ) {
      onChange?.(options[0]?.value);
    }
  }, [options]);

  const checkAllowClear = mode != "multiple" && canClear ? true : false;
  return (
    <div
      style={{
        paddingBlock: 12,
        backgroundColor: "transparent",
        position: "relative",
      }}
    >
      <div
        style={{
          position: "relative",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          gap: 8,
        }}
        className={`select-parent  ${isFocus ? "focus" : "blur"}  ${
          hasValue && !error ? "valid" : ""
        } ${error ? "error" : ""}`}
      >
        <Select
          {...props}
          allowClear={checkAllowClear}
          mode={mode}
          onChange={onChange}
          listHeight={listHeight}
          value={value === -1 || value == 0 ? undefined : value}
          showSearch
          variant="underlined"
          disabled={disableSelect}
          options={filteredOptions}
          filterOption={false}
          onSearch={(searchValue: string) => {
            if (searchValue) {
              const filtered = options?.filter((option) =>
                option?.label
                  ?.toString()
                  .toLowerCase()
                  .includes(searchValue.toLowerCase())
              );
              setFilteredOptions(filtered || []);
            } else {
              setFilteredOptions(options || []);
            }
          }}
          style={{
            width: "100%",
          }}
          notFoundContent={<NoDataFound />}
          onFocus={() => setIsFocus(true)}
          onBlur={() => {
            setIsFocus(false);
          }}
          suffixIcon={
            <>
              {spinning ? (
                <Spinner />
              ) : Icon && !disableSelect ? (
                Icon
              ) : (
                <CaretDownOutlined />
              )}{" "}
            </>
          }
          onClear={() => onChange?.([])}
        />
        <Label
          shouldAnimate={isFocus || hasValue}
          label={label + (isRequired ? " *" : "")}
          hasError={!!error}
        />
      </div>
      <ErrorComponent error={error} />
    </div>
  );
};

export default SelectComponent;

const NoDataFound = () => {
  const { isEnglish } = useLanguage();
  return (
    <div
      style={{
        minHeight: 100,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Typography style={{}}>
        {isEnglish ? "No Data Found" : "لا يوجد بيانات"}
      </Typography>
    </div>
  );
};
