import HeightAnimationWrapper from "@/animations/height-wrapper-animation";
import SelectUsers from "@/components/shared/select-users";
import DateComponent from "@/components/ui/form/date";
import { useLanguage } from "@/context/language";
import { CreateDelegationAdminType } from "@/pages/delegationa-admin/schema";
import { Checkbox, Col, Form, Row } from "antd";
import { Controller, useFormContext } from "react-hook-form";
type Props = {
  len: number;
};
const CreateDelegationForm = ({ len }: Props) => {
  const { isEnglish, labels } = useLanguage();
  const {
    control,
    watch,
    formState: { errors },
  } = useFormContext<CreateDelegationAdminType>();
  const { delegate_all } = watch();

  return (
    <Form name="create-edit-entity" layout="vertical" style={{ marginTop: 20 }}>
      <Row gutter={10} style={{ alignItems: "flex-end", display: "flex" }}>
        <Col xs={8}>
          <Controller
            name="delegator_user_id"
            control={control}
            render={({ field }) => (
              <SelectUsers
                disabled={len != 0}
                label={labels.lbl.delegation_from + " *"}
                {...field}
                error={errors?.delegator_user_id?.message}
              />
            )}
          />
        </Col>

        <Col xs={8}>
          <Controller
            name="date_from"
            control={control}
            render={({ field }) => (
              <DateComponent
                {...field}
                label={labels.lbl.delegation_date_from + "*"}
                error={errors?.date_from?.message}
              />
            )}
          />
        </Col>
        <Col xs={8}>
          <Controller
            name="date_to"
            control={control}
            render={({ field }) => (
              <DateComponent
                {...field}
                label={labels.lbl.delegation_date_to + "*"}
                error={errors?.date_to?.message}
              />
            )}
          />
        </Col>
        <Col xs={8}>
          <HeightAnimationWrapper>
            {delegate_all && (
              <Controller
                name="delegate_to_user_id"
                control={control}
                render={({ field }) => (
                  <SelectUsers
                    removeCurrentUser
                    label={labels.lbl.delegation_to + " *"}
                    {...field}
                  />
                )}
              />
            )}
          </HeightAnimationWrapper>
        </Col>

        {/* <Col span={12} style={{ marginTop: 8 }}>
            <Controller
              name="security"
              control={control}
              render={({ field }) => (
                <Picklist
                  code="Security Level"
                  label={labels.lbl.security_level + " *"}
                  {...field}
                  multiSelect
                />
              )}
            />
          </Col>
          <Col span={12}>
            <Controller
              name="orgs"
              control={control}
              render={({ field }) => (
                <SelectOU
                  multiSelect
                  label={labels.lbl.org_unit + " *"}
                  {...field}
                />
              )}
            />
          </Col>
          <Col span={12}>
            <Controller
              name="keywards"
              control={control}
              render={({ field }) => (
                <KeywordInput
                  values={field.value}
                  handleValuesChange={field.onChange}
                />
              )}
            />
          </Col>
          <Col span={12} style={{ marginTop: 8 }}>
            <Controller
              name="docs"
              control={control}
              render={({ field }) => (
                <Picklist
                  code="Document Type"
                  label={labels.lbl.document_type + " *"}
                  {...field}
                  multiSelect
                />
              )}
            />
          </Col> */}

        <Col style={{ marginTop: 12 }} xs={24}>
          <Controller
            name="delegate_all"
            control={control}
            render={({ field }) => (
              <Checkbox
                {...field}
                checked={field.value}
                onChange={(e) => {
                  field.onChange(e.target.checked);
                }}
              >
                {labels.lbl.delegate_all}
              </Checkbox>
            )}
          />
        </Col>
      </Row>
    </Form>
  );
};

export default CreateDelegationForm;
