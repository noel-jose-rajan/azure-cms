import SelectUsers from "@/components/shared/select-users";
import { useLanguage } from "@/context/language";
import { Col, Row } from "antd";
import { Controller, useFormContext } from "react-hook-form";
import { DelegationType } from "../../schema";
import DateComponent from "@/components/ui/form/date";
import Picklist from "@/components/shared/picklist";
import ButtonComponent from "@/components/ui/button";
import { SearchOutlined } from "@ant-design/icons";

type Props = {
  onSearch: () => Promise<void>;
};
const DelegationForm = ({ onSearch }: Props) => {
  const { isEnglish, labels } = useLanguage();
  const { control } = useFormContext<DelegationType>();
  const handleSearch = async () => {
    await onSearch();
  };
  return (
    <Row
      gutter={[14, 30]}
      style={{
        padding: 5,
        marginTop: 12,
        display: "flex",
        flexDirection: isEnglish ? "row" : "row-reverse",
      }}
    >
      <Col xs={24} lg={8}>
        <Controller
          name="delegator_user_id"
          control={control}
          render={({ field }) => (
            <SelectUsers
              canClear
              label={labels.lbl.delegation_from}
              {...field}
              multiSelect={false}
            />
          )}
        />
      </Col>
      <Col xs={24} lg={8}>
        <Controller
          name="delegate_to_user_id"
          control={control}
          render={({ field }) => (
            <SelectUsers
              removeCurrentUser
              canClear
              label={labels.lbl.delegation_to}
              {...field}
              multiSelect={false}
            />
          )}
        />
      </Col>

      <Col xs={24} lg={8}>
        <Controller
          name="status"
          control={control}
          render={({ field }) => (
            <Picklist
              canClear
              code="DelegationStatus"
              label={labels.lbl.status}
              {...field}
            />
          )}
        />
      </Col>
      <Col xs={24} lg={8}>
        <Controller
          name="date_from"
          control={control}
          render={({ field }) => (
            <DateComponent {...field} label={labels.lbl.delegation_date_from} />
          )}
        />
      </Col>
      <Col xs={24} lg={8}>
        <Controller
          name="date_to"
          control={control}
          render={({ field }) => (
            <DateComponent {...field} label={labels.lbl.delegation_date_to} />
          )}
        />
      </Col>

      <Col
        xs={24}
        style={{ display: "flex", justifyContent: isEnglish ? "start" : "end" }}
      >
        <ButtonComponent
          type="primary"
          buttonLabel={labels.btn.search}
          icon={<SearchOutlined />}
          onClick={handleSearch}
        />
      </Col>
    </Row>
  );
};

export default DelegationForm;
