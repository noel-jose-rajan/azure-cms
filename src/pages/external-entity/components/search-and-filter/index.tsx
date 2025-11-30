import { Col, Form, Row } from "antd";
import { Controller, useForm } from "react-hook-form";
import { ExternalEntity, getExEntitySchema } from "../../service";
import { zodResolver } from "@hookform/resolvers/zod";
import { MaterialInput } from "../../../../components/ui/material-input";
import { useLanguage } from "../../../../context/language";
import SelectComponent from "@/components/ui/form/select";
import Picklist from "@/components/shared/picklist";
import { useEffect } from "react";
import useExternalEntities from "@/store/external-entities/use-external-entities";

interface SearchAndFilterProps {
  setFilteredExternalEntities: React.Dispatch<
    React.SetStateAction<ExternalEntity[]>
  >;
}

export default function SearchAndFilter({
  setFilteredExternalEntities,
}: SearchAndFilterProps) {
  const { entites } = useExternalEntities();
  const { labels, isEnglish } = useLanguage();
  const schema = getExEntitySchema(isEnglish ? "en" : "ar");
  const { control, watch } = useForm<ExternalEntity>({
    resolver: zodResolver(schema),
    mode: "all",
  });

  const {
    name,
    entity_code,
    abbr,
    classify_id,
    is_active = undefined,
  } = watch();

  useEffect(() => {
    setFilteredExternalEntities(() => {
      return entites?.filter((entity) => {
        return (
          (entity_code
            ? entity?.entity_code
                ?.toLowerCase()
                ?.includes(entity_code.toLowerCase())
            : true) &&
          ((name
            ? entity.name_ar.toLowerCase().includes(name.toLowerCase())
            : true) ||
            (name
              ? entity.name_en.toLowerCase().includes(name.toLowerCase())
              : true)) &&
          (is_active !== undefined ? entity.is_active === is_active : true) &&
          (classify_id ? entity.classify_id === classify_id : true) &&
          (abbr
            ? entity?.abbr?.toLowerCase().includes(abbr.toLowerCase())
            : true)
        );
      });
    });
  }, [entity_code, name, is_active, abbr, classify_id]);

  // const resetValues = async () => {
  //   setValue("descEn", "");
  //   setValue("classifyPickListCode", "");
  //   setValue("shortName", "");
  //   setValue("externalEntityId", "");
  //   setValue("email", "");
  //   setValue("fax", "");
  //   setValue("phone", "");
  //   setValue("isActive", undefined);
  //   // await onSearchClicked();
  // };
  // const onSearchClicked = async (value?: CreateExternalEntityType) => {

  //   const response = await getAllExternalEntities(value);

  //   if (response.status === HttpStatus.SUCCESS && response.data) {
  //     updateSearchedEntities(response.data.data);
  //   } else if (response.status === HttpStatus.NOTFOUND) {
  //     updateSearchedEntities([]);
  //   } else {
  //     message.error(
  //       isEnglish
  //         ? "Something went wrong! Please contact your system administrator"
  //         : "حدث خطأ ما، يرجى الاتصال بمسؤول النظام"
  //     );
  //   }

  //   activateLoader(false);
  // };

  return (
    <Col>
      <Form
        name="search-entity"
        onFinish={() => {}}
        onFinishFailed={() => {}}
        layout="vertical"
      >
        <Row
          gutter={10}
          style={{
            padding: 5,
            display: "flex",
            flexDirection: isEnglish ? "row" : "row-reverse",
          }}
        >
          <Col span={8} lg={8} md={12} xs={24} style={{ marginTop: 20 }}>
            <Controller
              name="name"
              control={control}
              render={({ field }) => (
                <MaterialInput
                  label={labels.lbl.ext_ent_name}
                  {...field}
                  applyReverse={true}
                />
              )}
            />
          </Col>
          <Col span={8} lg={8} md={12} xs={24} style={{ marginTop: 20 }}>
            <Controller
              name="entity_code"
              control={control}
              render={({ field }) => (
                <MaterialInput
                  applyReverse={true}
                  label={labels.lbl.sequence_number}
                  {...field}
                />
              )}
            />
          </Col>
          <Col span={8} lg={8} md={12} xs={24} style={{ marginTop: 20 }}>
            <Controller
              name="abbr"
              control={control}
              render={({ field }) => (
                <MaterialInput
                  label={labels.lbl.short_number}
                  {...field}
                  applyReverse={true}
                />
              )}
            />
          </Col>
          <Col span={8} lg={8} md={12} xs={24} style={{ marginTop: 20 }}>
            <Controller
              name="classify_id"
              control={control}
              render={({ field }) => (
                <Picklist
                  canClear
                  code="External Entity Classification"
                  {...field}
                  label={labels.lbl.classification}
                />
              )}
            />
          </Col>
          {/* <Col span={8} lg={8} md={12} xs={24} style={{ marginTop: 20 }}>
            <Controller
              name="email"
              control={control}
              render={({ field }) => (
                <MaterialInput
                  label={labels.lbl.email}
                  {...field}
                  applyReverse={true}
                />
              )}
            />
          </Col> */}
          {/* <Col span={8} lg={8} md={12} xs={24} style={{ marginTop: 20 }}>
            <Controller
              name="phone"
              control={control}
              render={({ field }) => (
                <MaterialInput
                  label={labels.lbl.phone}
                  {...field}
                  applyReverse={true}
                />
              )}
            />
          </Col> */}
          {/* <Col span={8} lg={8} md={12} xs={24} style={{ marginTop: 20 }}>
            <Controller
              name="fax"
              control={control}
              render={({ field }) => (
                <MaterialInput
                  label={labels.lbl.fax_number}
                  {...field}
                  applyReverse={true}
                />
              )}
            />
          </Col> */}
          <Col span={8} lg={8} md={12} xs={24} style={{ marginTop: 20 }}>
            <Controller
              name="is_active"
              control={control}
              render={({ field }) => (
                <SelectComponent
                  {...field}
                  allowClear
                  label={labels.lbl.status}
                  value={
                    field.value !== undefined
                      ? field.value === true
                        ? "1"
                        : "2"
                      : undefined
                  }
                  onChange={(val) =>
                    field.onChange(
                      val === "1" ? true : val === "2" ? false : undefined
                    )
                  }
                  options={[
                    {
                      label: labels.lbl.active,
                      value: "1",
                    },
                    {
                      label: labels.lbl.not_active,
                      value: "2",
                    },
                  ]}
                />
              )}
            />
          </Col>
        </Row>
      </Form>
      {/* <Col
        style={{
          display: "flex",
          justifyContent: isEnglish ? "flex-end" : "flex-start",
          marginTop: 10,
        }}
      >
        <Button onClick={resetValues}>
          <ReloadOutlined />
          {labels.btn.reset}
        </Button>
        <Button
          onClick={() => onSearchClicked(getValues())}
          type="primary"
          style={{ margin: "0 10px" }}
        >
          <SearchOutlined />
          {labels.btn.search}
        </Button>
      </Col> */}
    </Col>
  );
}
