import { Col } from "antd";
import TextWithValue from "../../../text-value-wrapper";
import { useLanguage } from "../../../../../../context/language";
import { Routes } from "@/components/services/inbox";
import useGetAllOU from "@/store/orgs/use-get-all-ou";
import usePicklist from "@/store/picklists/use-picklist";
import useGetAllUsers from "@/store/users/use-get-all-users";
import moment from "moment";

export default function RoutingRouteComponent({
  route,
}: {
  route?: Routes | null;
}) {
  const { labels, isEnglish } = useLanguage();

  const { getOrgById } = useGetAllOU();
  const { getPicklistById } = usePicklist();
  const { getUserById } = useGetAllUsers();

  const _from_entity = getOrgById(route?.from_entity_id || 0);
  const _to_entity = getOrgById(route?.to_entity_id || 0);
  const _from_user = getUserById(route?.perfomer_id || 0);
  const _to_user = getUserById(route?.to_user_id || 0);

  const _requird_action = getPicklistById(
    "Required Action",
    route?.required_action || 0
  );
  const _urgency = getPicklistById(
    "Urgency Level",
    route?.urgency_level_id || 0
  );
  const _status = getPicklistById("Status", route?.status_id || 0);

  return (
    <>
      {route?.id && (
        <Col style={{ padding: 10 }}>
          <TextWithValue
            primaryText={labels.lbl.route_from_org}
            secondaryText={
              isEnglish ? _from_entity?.name_en : _from_entity?.name_ar
            }
          />
          <TextWithValue
            primaryText={labels.lbl.route_from_user}
            secondaryText={
              (isEnglish ? _from_user?.name_en : _from_user?.name_ar) || "-"
            }
          />
          <TextWithValue
            primaryText={labels.lbl.route_to}
            secondaryText={
              route?.is_to_entity
                ? (isEnglish ? _to_entity?.name_en : _to_entity?.name_ar) || "-"
                : (isEnglish ? _to_user?.name_en : _to_user?.name_ar) || "-"
            }
          />
          <TextWithValue
            primaryText={labels.lbl.status}
            secondaryText={
              (isEnglish
                ? _status?.picklist_en_label
                : _status?.picklist_ar_label) || "-"
            }
          />
          <TextWithValue
            primaryText={labels.lbl.route_type}
            secondaryText={
              (isEnglish
                ? _requird_action?.picklist_en_label
                : _requird_action?.picklist_ar_label) || "-"
            }
          />
          <TextWithValue
            primaryText={labels.lbl.urgency_level}
            secondaryText={
              (isEnglish
                ? _urgency?.picklist_en_label
                : _urgency?.picklist_ar_label) || "-"
            }
          />
          <TextWithValue
            primaryText={labels.lbl.route_date}
            secondaryText={
              (moment(route.route_date).isValid()
                ? moment(route.route_date).format("DD/MM/YYYY HH:mm")
                : "") || ""
            }
          />
          <TextWithValue
            primaryText={labels.lbl.route_comment}
            secondaryText={route.comments}
          />
          {route?.reply_comment && (
            <>
              <hr />
              <TextWithValue
                primaryText={labels.lbl.reply_comment}
                secondaryText={route.reply_comment || ""}
              />
              <TextWithValue
                primaryText={labels.lbl.reply_date}
                secondaryText={
                  (moment(route.reply_date).isValid()
                    ? moment(route.reply_date).format("DD/MM/YYYY HH:mm")
                    : "") || ""
                }
              />
            </>
          )}
        </Col>
      )}
    </>
  );
}
