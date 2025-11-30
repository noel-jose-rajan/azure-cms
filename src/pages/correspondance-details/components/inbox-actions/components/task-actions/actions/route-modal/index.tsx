import useHandleError from "@/components/hooks/useHandleError";
import {
  Actions,
  completeTask,
  CompleteTaskPayload,
} from "@/components/services/inbox";
import ActionSelect from "@/components/shared/actions/select";
import {
  getRouteSubActions,
  SubActionDetails,
} from "@/components/shared/actions/service";
import Picklist from "@/components/shared/picklist";
import ButtonComponent from "@/components/ui/button";
import { useLanguage } from "@/context/language";
import { SendOutlined } from "@ant-design/icons";
import { Button, Checkbox, Col, Form, Modal, Row, Typography } from "antd";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import CreateRouteForm from "./create-route-form";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  routeFormSchema,
  RouteFormType,
  RoutingType,
} from "./create-route-form/schema";
import { CONST_DATA } from "@/constants/app";
import { MaterialInput } from "@/components/ui/material-input";
import RoutingTable from "./components/routing-table";
import HeightAnimationWrapper from "@/animations/height-wrapper-animation";
import useCustomMessage from "@/components/hooks/use-message";

type Props = {
  action: Actions | undefined;
  onCancel: () => void;
  label: string;
  urgency_level: number;
};
type FieldState = {
  cc_list: RoutingType[];
  route_list: RoutingType[];
};
const RouteActionModal = ({
  action,
  onCancel,
  label,
  urgency_level,
}: Props) => {
  const { showMessage } = useCustomMessage();

  const { id } = useParams();
  const { labels, isEnglish } = useLanguage();
  const navigate = useNavigate();
  const { handleError } = useHandleError();
  const methods = useForm<RouteFormType>({
    resolver: zodResolver(routeFormSchema),
    defaultValues: {
      urgency_level,
    },
  });
  const [routings, setRoutings] = useState<RoutingType[] | undefined>();

  const { getValues, control, watch } = methods;
  const [fields, setFields] = useState<FieldState>({
    cc_list: [],
    route_list: [],
  });
  const { ccUsers, comments } = watch();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fetchSubActions = async (action: Actions) => {
    if (!action?.action) return;
    const subActions = await getRouteSubActions(id || "", action);

    if (subActions && subActions.Message == "ROUTE") {
      const modifiedRouteList =
        subActions?.Data?.ROUTE?.map((item) => ({
          is_cc: false,
          to_entity_id: item?.ID,
          ...item,
        })) || [];

      const modifiedRouteUsersList =
        subActions?.Data?.ROUTE_USER?.map((item) => ({
          is_cc: false,
          to_user_id: item?.ID,
          ...item,
        })) || [];

      const modifiedCCRouteList =
        subActions?.Data?.ROUTE_CC?.map((item) => ({
          is_cc: true,
          to_entity_id: item?.ID,
          ...item,
        })) || [];

      const modifiedCCRouteUsersList =
        subActions?.Data?.ROUTE_CC_USER?.map((item) => ({
          is_cc: true,
          to_user_id: item?.ID,
          ...item,
        })) || [];

      handleFieldsChange("cc_list", [
        ...modifiedCCRouteList,
        ...modifiedCCRouteUsersList,
      ]);
      handleFieldsChange("route_list", [
        ...modifiedRouteList,
        ...modifiedRouteUsersList,
      ]);
    }
    if (subActions && subActions.Message == "ROUTE_CC") {
      const modifiedCCRouteList =
        subActions?.Data?.ROUTE_CC?.map((item) => ({
          is_cc: true,
          to_entity_id: item?.ID,
          ...item,
        })) || [];

      const modifiedCCRouteUsersList =
        subActions?.Data?.ROUTE_CC_USER?.map((item) => ({
          is_cc: true,
          to_user_id: item?.ID,
          ...item,
        })) || [];

      handleFieldsChange("cc_list", [
        ...modifiedCCRouteList,
        ...modifiedCCRouteUsersList,
      ]);
    }
  };
  const handleCompleteTask = async () => {
    const {
      urgency_level,
      ccUsers,
      comments = "",
      result_as_task = false,
      notify_me = false,
    } = getValues();

    const ModifiedCCUsers = ccUsers?.map((item) => ({
      is_cc: item.is_cc,
      to_entity_id: item.to_entity_id || undefined,
      to_user_id: item.to_user_id || undefined,
      urgency_level: item.urgency_level || urgency_level,
      comments: item.comments || "",
      required_action: item.required_action || undefined,
    }));

    const modifiedRouteList = routings?.map((item) => ({
      is_cc: item.is_cc,
      to_entity_id: item.to_entity_id || undefined,
      to_user_id: item.to_user_id || undefined,
      urgency_level: item.urgency_level || urgency_level,
      comments: item.comments || "",
      required_action: item.required_action || undefined,
    }));

    try {
      setIsSubmitting(true);
      const payload: CompleteTaskPayload = {
        comments,
        data: {
          result_as_task,
          notify_me,
          route_list: [
            ...(modifiedRouteList || []),
            ...(ModifiedCCUsers || []),
          ],
        },
        id: action?.ID || 0,
      };

      const response = await completeTask(id || "", payload);
      if (response) {
        showMessage("success", labels.msg.routes_sent);
        navigate("/user/inbox", { replace: true });
      }
    } catch (error) {
      handleError(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFieldsChange = (key: keyof typeof fields, value: any) => {
    setFields((prevFields) => ({
      ...prevFields,
      [key]: value,
    }));
  };
  useEffect(() => {
    if (!action) return;
    fetchSubActions(action);
  }, [action]);

  const filteredRoutingList = fields?.route_list?.filter((item) => {
    if (
      item.to_entity_id &&
      routings?.some((route) => route.to_entity_id == item.to_entity_id)
    ) {
      return false;
    }
    if (
      item.to_user_id &&
      routings?.some((route) => route.to_user_id == item.to_user_id)
    ) {
      return false;
    }
    return true;
  });

  const filteredCCRoutingList = fields?.cc_list?.filter((item) => {
    if (
      item.to_entity_id &&
      routings?.some((route) => route.to_entity_id == item.to_entity_id)
    ) {
      return false;
    }
    if (
      item.to_user_id &&
      routings?.some((route) => route.to_user_id == item.to_user_id)
    ) {
      return false;
    }
    return true;
  });
  const isRouteTask = action?.ID == CONST_DATA.Route_Task_Id;
  const disableButton =
    (isRouteTask && (!routings || routings?.length == 0)) ||
    (!isRouteTask && (ccUsers?.length == 0 || !ccUsers)) ||
    (action?.comment_required && !comments);
  return (
    <Modal
      title={<Typography>{label}</Typography>}
      open={true}
      onCancel={onCancel}
      footer={null}
      width={800}
      centered
      style={{ marginBlock: 5 }}
    >
      <FormProvider {...methods}>
        <HeightAnimationWrapper>
          <Form layout="vertical">
            <Row style={{ display: "flex", alignItems: "flex-end" }}>
              <Col xs={24}>
                <Controller
                  control={control}
                  name="urgency_level"
                  render={({ field }) => (
                    <Picklist
                      label={labels.lbl.urgency_level}
                      code="Urgency Level"
                      value={field.value}
                      onChange={(value: number | string) => {
                        field.onChange(value);
                      }}
                    />
                  )}
                />
              </Col>
            </Row>

            <Controller
              control={control}
              name="ccUsers"
              render={({ field }) => (
                <ActionSelect
                  label={labels.lbl.cc_list}
                  value={field?.value?.map(
                    (item) => item.to_entity_id || item.to_user_id || 0
                  )}
                  data={filteredCCRoutingList as unknown as SubActionDetails[]}
                  multiSelect
                  onChange={(value: number | string | number[]) => {
                    if (Array.isArray(value)) {
                      const filtered = filteredCCRoutingList.filter(
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

            {isRouteTask && (
              <CreateRouteForm
                routings={routings || []}
                routingList={filteredRoutingList}
                setRoutings={setRoutings}
              />
            )}

            {/* </HeightAnimationWrapper> */}

            {!isRouteTask && (
              <Controller
                control={control}
                name="comments"
                render={({ field }) => (
                  <MaterialInput
                    {...field}
                    label={labels.lbl.comment}
                    enableTranscript
                    style={{ marginTop: 10, marginBottom: 10 }}
                  />
                )}
              />
            )}
            {isRouteTask && (
              <RoutingTable
                routings={routings || []}
                setRoutings={setRoutings}
              />
            )}

            <Col style={{ marginTop: 16 }}>
              <Controller
                name="notify_me"
                control={control}
                render={({ field }) => (
                  <Checkbox
                    {...field}
                    onChange={(e) => {
                      field.onChange(e.target.checked);
                    }}
                  >
                    {labels?.lbl.read_receipt}
                  </Checkbox>
                )}
              />
            </Col>
            {isRouteTask && (
              <Col style={{ marginTop: 8 }}>
                <Controller
                  name="result_as_task"
                  control={control}
                  render={({ field }) => (
                    <Checkbox
                      {...field}
                      onChange={(e) => {
                        field.onChange(e.target.checked);
                      }}
                    >
                      {isEnglish
                        ? "Send Routing Replies as Task"
                        : "إرسال نتائج التوجية كمهمة"}
                    </Checkbox>
                  )}
                />
              </Col>
            )}

            <div
              style={{
                textAlign: isEnglish ? "right" : "left",
                display: "flex",
                flexDirection: !isEnglish ? "row-reverse" : "row",
                alignItems: "center",
              }}
            >
              <Button onClick={onCancel} style={{ margin: 8 }}>
                {labels.lbl.cancel}
              </Button>
              <ButtonComponent
                spinning={isSubmitting}
                buttonLabel={label}
                type="primary"
                htmlType="submit"
                onClick={handleCompleteTask}
                icon={<SendOutlined />}
                disabled={disableButton}
              />
            </div>
          </Form>
        </HeightAnimationWrapper>
      </FormProvider>
    </Modal>
  );
};

export default RouteActionModal;
