import TitleBar from "@/components/ui/bar/title-bar";
import { useLanguage } from "@/context/language";
import { useEffect, useState } from "react";
import { DelegationDetails, getDelegationDetails } from "./service";
import { useParams } from "react-router-dom";
import LoaderComponent from "@/components/ui/loader";
import TitleHeader from "@/components/ui/header";
import { InfoCircleFilled } from "@ant-design/icons";
import TextWithValue from "../correspondance-details/components/text-value-wrapper";
import usePicklist from "@/store/picklists/use-picklist";
import moment from "moment";
import UserRoleViewer from "./components/roles";
import { getUserRoles, UserRole } from "../delegationa-admin/service";

const DelegationView = () => {
  const { labels, isEnglish } = useLanguage();
  const { id } = useParams();
  const [data, setData] = useState<DelegationDetails | null>(null);
  const [userRoles, setUserRoles] = useState<UserRole[]>([]);

  const [loading, setLoading] = useState(true);
  const { getPicklistById } = usePicklist();
  const getDetails = async () => {
    try {
      const res = await getDelegationDetails(id + "", !isEnglish);
      if (res) {
        setData(res);
      }
    } catch (e) {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!id) return;
    getDetails();
  }, [id, isEnglish]);

  const fetchRoles = async () => {
    const res = await getUserRoles(data?.delegator_user_id + "");
    if (res) {
      setUserRoles(res);
    }
  };

  useEffect(() => {
    if (!data?.delegator_user_id) return;
    fetchRoles();
  }, [data?.delegator_user_id]);

  const _st = getPicklistById("DelegationStatus", data?.status_id + "");
  return (
    <>
      {loading ? (
        <LoaderComponent loading={true} delay={0} fullscreen={false} />
      ) : (
        <>
          <TitleBar headerText={labels.mnu.delegation} />
          <TitleHeader
            heading={labels.mnu.view_delegation}
            icon={<InfoCircleFilled style={{ color: "#fff" }} />}
          />
          <div style={{ direction: isEnglish ? "ltr" : "rtl" }}>
            <TextWithValue
              primaryText={labels.lbl.delegation_from}
              secondaryText={data?.delegator_user_name}
            />

            <TextWithValue
              primaryText={labels.lbl.delegation_date_from}
              secondaryText={
                moment(data?.date_from).format("YYYY-MM-DD") || "-"
              }
            />
            <TextWithValue
              primaryText={labels.lbl.delegation_date_to}
              secondaryText={moment(data?.date_to).format("YYYY-MM-DD") || "-"}
            />
            <TextWithValue
              primaryText={labels.lbl.status}
              secondaryText={
                (isEnglish ? _st?.picklist_en_label : _st?.picklist_ar_label) ||
                (isEnglish ? "Created" : "تم الأنشاء")
              }
            />
            <TextWithValue
              primaryText={labels.lbl.delegate_all}
              secondaryText={
                (data?.delegate_all ? labels.lbl.true : labels.lbl.false) || "-"
              }
            />
            {!data?.delegate_all && (
              <UserRoleViewer
                delegateTo={data?.delegate_to || []}
                roles={userRoles}
              />
            )}
          </div>
        </>
      )}
    </>
  );
};

export default DelegationView;
