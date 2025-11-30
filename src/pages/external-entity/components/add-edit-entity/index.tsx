import { Checkbox, Col, Form, Modal, Row, Typography } from "antd";
import { MaterialInput } from "@/components/ui/material-input";
import { useLanguage } from "../../../../context/language";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CloseOutlined, EditFilled, PlusOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import Picklist from "@/components/shared/picklist";
import { ExternalEntity, getExEntitySchema } from "../../service";
import useGetEntity from "../../hooks/use-get-entity";
import useExternalEntities from "@/store/external-entities/use-external-entities";
import { createExternalEntity } from "@/components/shared/select-external-entity/service";
import ButtonComponent from "@/components/ui/button";
import useUpdateEntity from "../../hooks/use-update-entity";
import useCustomMessage from "@/components/hooks/use-message";

interface CreateEntityModalProps {
  title: string;
  visible: boolean;
  onCancel: () => void;
  externalEntity?: ExternalEntity;
  id?: string | number;
}

export default function CreateEntityModal({
  title,
  visible,
  onCancel,
  externalEntity,
  id,
}: CreateEntityModalProps) {
  const { showMessage } = useCustomMessage();

  const { labels, isEnglish } = useLanguage();
  const [loading, setLoading] = useState<boolean>(false);
  const { updateExternalEntity } = useUpdateEntity();
  const { entity } = useGetEntity(id || "");
  const schema = getExEntitySchema(isEnglish ? "en" : "ar");
  const {
    control,
    handleSubmit,
    formState: { errors },
    getValues,
    setValue,
  } = useForm<ExternalEntity>({
    resolver: zodResolver(schema),
    mode: "all",
    defaultValues: {
      is_active: externalEntity?.is_active ?? true,
      // fax: "",
    },
  });
  console.log({ errors });

  const { refreshAllExternalEntites } = useExternalEntities();
  useEffect(() => {
    if (id) {
      setValue("classify_id", +(entity?.classify_id || 0)!);
      setValue("name_ar", externalEntity?.name_ar || "");
      setValue("name_en", externalEntity?.name_en || "");
      // setValue("name", externalEntity?.name_en);
      setValue("email", entity?.email ?? undefined);
      setValue("fax", entity?.fax ?? undefined);
      // setValue("g2gBranch", externalEntity?.g2gBranch ?? undefined);
      // setValue("g2g_code", externalEntity?.g2g_code ?? undefined);
      setValue("phone", entity?.phone ?? undefined);
      setValue("abbr", externalEntity?.abbr ?? undefined);
      setValue("is_active", externalEntity?.is_active);
      setValue("entity_code", externalEntity?.entity_code);
    }
  }, [entity, externalEntity]);

  const onFinishFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
  };

  // const menuEnSemi: MenuProps["items"] = enSemiMatch.map((item) => ({
  //   key: item.externalEntityId,
  //   label: (
  //     <div style={styles.semiMatchItem}>
  //       <p>{item.desc_en}</p>
  //     </div>
  //   ),
  //   disabled: true,
  // }));

  // const menuArSemi: MenuProps["items"] = arSemiMatch.map((item) => ({
  //   key: item.externalEntityId,
  //   label: (
  //     <div style={styles.semiMatchItem}>
  //       <p>{item.desc_ar}</p>
  //     </div>
  //   ),
  //   disabled: true,
  // }));

  // const menuShortNameSemi: MenuProps["items"] = shortNameSemiMatch.map(
  //   (item) => ({
  //     key: item.externalEntityId,
  //     label: (
  //       <div style={styles.semiMatchItem}>
  //         <p>{item.short_name}</p>
  //       </div>
  //     ),
  //     disabled: true,
  //   })
  // );

  const handleUpdate = async () => {
    try {
      setLoading(true);
      const values = getValues();
      const res = await updateExternalEntity(externalEntity?.id || 0, values);
      console.log("res", res);

      if (res?.ID) {
        showMessage("success", labels.msg.update_ex_success);
        await refreshAllExternalEntites();
        onCancel();
      }
    } catch (error) {
      console.log("Error creating external entity:", error);
    } finally {
      setLoading(false);
    }
  };
  const handleCreate = async () => {
    try {
      setLoading(true);
      const values = getValues();
      const res = await createExternalEntity(values);
      console.log("res", res);

      if (res?.ID) {
        showMessage("success", labels.msg.create_ex_success);
        await refreshAllExternalEntites();
        onCancel();
      }
    } catch (error) {
      console.log("Error creating external entity:", error);
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = () => {
    if (externalEntity?.id) {
      handleUpdate();
    } else {
      handleCreate();
    }
  };
  return (
    <Modal
      title={<Typography>{title}</Typography>}
      centered
      open={visible}
      onCancel={onCancel}
      zIndex={10}
      width={600}
      footer={
        <div style={{ marginTop: 25 }}>
          <ButtonComponent
            buttonLabel={labels.btn.cancel}
            onClick={() => {
              onCancel();
            }}
            icon={<CloseOutlined />}
            style={{ margin: "0 15px" }}
          />

          <ButtonComponent
            icon={externalEntity?.id ? <EditFilled /> : <PlusOutlined />}
            buttonLabel={
              externalEntity?.id ? labels.btn.edit : labels.btn.create
            }
            spinning={loading}
            type="primary"
            onClick={handleSubmit(onSubmit)}
          />
        </div>
      }
    >
      <Form
        name="create-edit-entity"
        onFinish={handleSubmit(onSubmit)}
        onFinishFailed={onFinishFailed}
        layout="vertical"
      >
        <Row gutter={10}>
          <Col span={12} style={{ marginTop: 20 }}>
            <Controller
              name="name_en"
              control={control}
              render={({ field }) => (
                <MaterialInput
                  label={labels.lbl.english_name + " *"}
                  {...field}
                  error={errors.name_en?.message}
                />
              )}
            />
            {/* {enSemiMatch.length > 0 && (
              <Dropdown
                menu={{ items: menuEnSemi }}
                trigger={["click"]}
                onOpenChange={() => setOpenEnSemi(!openEnSemi)}
              >
                <a
                  onClick={(e) => e.preventDefault()}
                  style={styles.semiMatchText}
                >
                  {`${labels.msg.some_external_exist_en} ${
                    openEnSemi
                      ? labels.msg.click_to_hide
                      : labels.msg.click_to_see
                  }`}
                </a>
              </Dropdown>
            )} */}
          </Col>
          <Col span={12} style={{ marginTop: 20 }}>
            <Controller
              name="name_ar"
              control={control}
              render={({ field }) => (
                <MaterialInput
                  label={labels.lbl.arabic_name + " *"}
                  {...field}
                  error={errors.name_ar?.message}
                />
              )}
            />
            {/* {arSemiMatch.length > 0 && (
              <Dropdown
                menu={{ items: menuArSemi }}
                trigger={["click"]}
                onOpenChange={() => setOpenArSemi(!openArSemi)}
              >
                <a
                  onClick={(e) => e.preventDefault()}
                  style={styles.semiMatchText}
                >
                  {`${labels.msg.some_external_exist_ar} ${
                    openEnSemi
                      ? labels.msg.click_to_hide
                      : labels.msg.click_to_see
                  }`}
                </a>
              </Dropdown>
            )} */}
          </Col>
          <Col span={12} style={{ marginTop: 20 }}>
            <Controller
              name="classify_id"
              control={control}
              render={({ field }) => (
                <Picklist
                  code="External Entity Classification"
                  {...field}
                  label={labels.lbl.classification + " *"}
                  error={errors.classify_id?.message}
                />
              )}
            />
          </Col>
          <Col span={12} style={{ marginTop: 20 }}>
            <Controller
              name="abbr"
              control={control}
              render={({ field }) => (
                <MaterialInput
                  label={labels.lbl.short_number}
                  {...field}
                  error={errors.abbr?.message}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    const val =
                      e.target.value === "" ? undefined : e.target.value;
                    field.onChange(val);
                  }}
                />
              )}
            />
            {/* {shortNameSemiMatch.length > 0 && (
              <Dropdown
                menu={{ items: menuShortNameSemi }}
                trigger={["click"]}
                onOpenChange={() => setOpenShortNameSemi(!openShortNameSemi)}
              >
                <a
                  onClick={(e) => e.preventDefault()}
                  style={styles.semiMatchText}
                >
                  {`${labels.msg.some_external_exist_short} ${
                    openShortNameSemi
                      ? labels.msg.click_to_hide
                      : labels.msg.click_to_see
                  }`}
                </a>
              </Dropdown>
            )} */}
          </Col>
          <Col span={12} style={{ marginTop: 20 }}>
            <Controller
              name="phone"
              control={control}
              render={({ field }) => (
                <MaterialInput
                  label={labels.lbl.phone}
                  {...field}
                  error={errors.phone?.message}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    const val =
                      e.target.value === "" ? undefined : e.target.value;
                    field.onChange(val);
                  }}
                />
              )}
            />
          </Col>
          <Col span={12} style={{ marginTop: 20 }}>
            <Controller
              name="fax"
              control={control}
              render={({ field }) => (
                <MaterialInput
                  label={labels.lbl.fax_number}
                  {...field}
                  error={errors.fax?.message}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    const val =
                      e.target.value === "" ? undefined : e.target.value;
                    field.onChange(val);
                  }}
                />
              )}
            />
          </Col>
          <Col span={12} style={{ marginTop: 20 }}>
            <Controller
              name="g2g_code"
              control={control}
              render={({ field }) => (
                <MaterialInput
                  label={labels.lbl.g2gCode}
                  {...field}
                  error={errors.g2g_code?.message}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    const val =
                      e.target.value === "" ? undefined : e.target.value;
                    field.onChange(val);
                  }}
                />
              )}
            />
          </Col>
          <Col span={12} style={{ marginTop: 20 }}>
            <Controller
              name="g2gBranch"
              control={control}
              render={({ field }) => (
                <MaterialInput
                  label={labels.lbl.g2gBranch}
                  {...field}
                  error={errors.g2gBranch?.message}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    const val =
                      e.target.value === "" ? undefined : e.target.value;
                    field.onChange(val);
                  }}
                />
              )}
            />
          </Col>
          <Col span={24} style={{ marginTop: 20 }}>
            <Controller
              name="email"
              control={control}
              render={({ field }) => (
                <MaterialInput
                  label={labels.lbl.email}
                  {...field}
                  error={errors.email?.message}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    const val =
                      e.target.value === "" ? undefined : e.target.value;
                    field.onChange(val);
                  }}
                />
              )}
            />
          </Col>
          {externalEntity && (
            <>
              <Col span={12} style={{ marginTop: 20 }}>
                <Controller
                  name="entity_code"
                  control={control}
                  render={({ field }) => (
                    <MaterialInput
                      {...field}
                      label={labels.lbl.sequence_number}
                      allowEdit={false}
                    />
                  )}
                />
              </Col>
              <Col span={24} style={{ marginTop: 20 }}>
                <Controller
                  name="is_active"
                  control={control}
                  render={({ field }) => (
                    <div
                      style={{
                        height: 40,
                        alignContent: "center",
                        paddingLeft: 10,
                      }}
                    >
                      <Checkbox
                        checked={field.value}
                        onChange={(e) => field.onChange(e.target.checked)}
                      >
                        {labels.lbl.active}
                      </Checkbox>
                    </div>
                  )}
                />
              </Col>
            </>
          )}
        </Row>
      </Form>
    </Modal>
  );
}

// const styles = {
//   semiMatchText: {
//     margin: 0,
//     fontSize: 13,
//     lineHeight: "1.2",
//     display: "block",
//     marginTop: 2,
//   },
//   semiMatchItem: {
//     height: 25,
//     width: 250,
//     display: "flex",
//     alignItems: "center",
//     cursor: "not-allowed",
//   },
// };
