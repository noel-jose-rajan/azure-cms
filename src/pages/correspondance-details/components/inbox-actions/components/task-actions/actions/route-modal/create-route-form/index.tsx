import { SubActionDetails } from "@/components/shared/actions/service";
import { Col, Form, Row } from "antd";
import React, { ChangeEvent } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { RouteFormType, RoutingType } from "./schema";
import ActionSelect from "@/components/shared/actions/select";
import { useLanguage } from "@/context/language";
import { MaterialInput } from "@/components/ui/material-input";
import Picklist from "@/components/shared/picklist";
import ButtonComponent from "@/components/ui/button";

type Props = {
  routingList: RoutingType[];
  routings: RoutingType[];
  setRoutings: React.Dispatch<React.SetStateAction<RoutingType[] | undefined>>;
};
const CreateRouteForm = ({ routingList, routings, setRoutings }: Props) => {
  const { labels, isEnglish } = useLanguage();
  const { control, getValues, watch, reset } = useFormContext<RouteFormType>();

  const { required_action, route_list } = watch();

  const resetFields = (arr: RoutingType[]) => {
    const { notify_me, result_as_task } = getValues();

    reset({
      notify_me,
      result_as_task,
      comments: "",
      required_action: 0,
      route_list: [],
      ccUsers: handleCCListChange(arr),
    });
  };

  const handleCCListChange = (arr: RoutingType[]) => {
    const { ccUsers } = getValues();

    const filteredCCRoutingList = ccUsers?.filter((item) => {
      if (
        item.to_entity_id &&
        arr?.some((route) => route.to_entity_id == item.to_entity_id)
      ) {
        return false;
      }
      if (
        item.to_user_id &&
        arr?.some((route) => route.to_user_id == item.to_user_id)
      ) {
        return false;
      }
      return true;
    });

    return filteredCCRoutingList;
  };
  const handleCreateRoute = () => {
    const { required_action, comments, route_list } = getValues();
    const routes =
      route_list?.map((item) => ({
        id: Date.now() + Math.random(),
        is_cc: item.is_cc,
        to_entity_id: item.to_entity_id,
        to_user_id: item.to_user_id,
        required_action: required_action,
        comments: comments || "",
      })) || [];
    setRoutings((prev = []) => [...routes, ...prev]);
    resetFields([...routes, ...routings]);
  };
  const disableButton = !required_action || !route_list?.length;

  return (
    <Form name="create-route" layout="vertical">
      <Row gutter={8} style={{ display: "flex", alignItems: "flex-end" }}>
        <Col span={7}>
          <Controller
            control={control}
            name="route_list"
            render={({ field }) => (
              <ActionSelect
                label={labels.lbl.route_to}
                value={field?.value?.map(
                  (item) => item.to_entity_id || item.to_user_id || 0
                )}
                data={routingList as unknown as SubActionDetails[]}
                multiSelect
                onChange={(value: number | string | number[]) => {
                  if (Array.isArray(value)) {
                    const filtered = routingList.filter(
                      (item) =>
                        value?.includes(item.to_entity_id || 0) ||
                        value?.includes(item.to_user_id || 0)
                    );

                    field.onChange(filtered);
                  }
                }}
              />
            )}
          />
        </Col>
        <Col span={7}>
          <Controller
            control={control}
            name="required_action"
            render={({ field }) => (
              <Picklist
                label={labels.lbl.reqired_action}
                code="Required Action"
                value={field.value}
                onChange={(value: number | string) => {
                  field.onChange(value);
                }}
              />
            )}
          />
        </Col>
        <Col span={7} style={{ paddingBlock: 12 }}>
          <Controller
            name="comments"
            control={control}
            render={({ field }) => (
              <MaterialInput
                label={labels.lbl.route_comment}
                value={field.value}
                onChange={(e: ChangeEvent<HTMLInputElement>) => {
                  field.onChange(e.target.value);
                }}
              />
            )}
          />
        </Col>
        <Col span={2.5} style={{ marginBottom: 10 }}>
          <ButtonComponent
            type="primary"
            onClick={handleCreateRoute}
            disabled={disableButton}
            buttonLabel={isEnglish ? "add" : "إضافة"}
          />
        </Col>
      </Row>
    </Form>
  );
};

export default CreateRouteForm;
