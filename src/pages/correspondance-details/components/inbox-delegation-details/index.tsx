import { useLanguage } from "@/context/language";
import { Alert } from "antd";
import React, { useEffect, useState } from "react";
import TextWithValue from "../text-value-wrapper";
import moment from "moment";
import {
  getInboxDelegationDetails,
  InboxDelegationDetailsType,
} from "@/components/services/inbox";

type Props = { id: string | number };
const InboxDelegationDetails = ({ id }: Props) => {
  const [data, setData] = useState<InboxDelegationDetailsType | null>(null);

  const { isEnglish, labels } = useLanguage();
  const getDetails = async () => {
    try {
      const res = await getInboxDelegationDetails(id + "", !isEnglish);
      if (res) {
        setData(res);
      }
    } catch (e) {}
  };

  useEffect(() => {
    if (!id) return;
    getDetails();
  }, [id, isEnglish]);
  return (
    <Alert
      message={
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <TextWithValue
            primaryText={labels.lbl.delegation_from}
            secondaryText={data?.DelegatorUserName}
          />

          <TextWithValue
            primaryText={labels.lbl.delegation_date_from}
            secondaryText={moment(data?.DateFrom).format("YYYY-MM-DD") || "-"}
          />
          <TextWithValue
            primaryText={labels.lbl.delegation_date_to}
            secondaryText={moment(data?.DateTo).format("YYYY-MM-DD") || "-"}
          />
        </div>
      }
      type="warning"
      showIcon
    />
  );
};

export default InboxDelegationDetails;
