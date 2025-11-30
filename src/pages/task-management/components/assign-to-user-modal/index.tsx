import SelectUsers from "@/components/shared/select-users";
import ButtonComponent from "@/components/ui/button";
import { useLanguage } from "@/context/language";
import { CloseOutlined, PlusOutlined } from "@ant-design/icons";
import { TextField } from "@mui/material";
import { Col, Modal, Row } from "antd";
import React, { useState } from "react";
type Props = {
  onCancel: () => void;
};
const AssignUsersModal = ({ onCancel }: Props) => {
  const [selectedUsers, setSelectedUsers] = React.useState<number[]>([]);
  const [date, setDate] = useState<string>("");
  const { isEnglish, labels } = useLanguage();
  return (
    <Modal
      title={isEnglish ? "Assign Users" : "تعيين المستخدم الجديد"}
      centered
      open={true}
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
            icon={<PlusOutlined />}
            buttonLabel={labels.btn.assign}
            type="primary"
          />
        </div>
      }
    >
      <Row gutter={10}>
        <Col span={24}>
          <SelectUsers
            label={labels.lbl.user_name + " *"}
            value={selectedUsers}
            onChange={(value: number[] | number) =>
              setSelectedUsers(Array.isArray(value) ? value : [value])
            }
          />
        </Col>
        {/* <Col span={24}>
          <TextField
            slotProps={{
              inputLabel: {
                shrink: true,
                style: {
                  left: isEnglish ? "0" : "auto",
                  right: isEnglish ? "auto" : "0",
                },
              },
            }}
            sx={{
              "& input[type='date']::-webkit-calendar-picker-indicator": {
                position: "absolute",
                left: !isEnglish ? "0" : "auto",
                right: isEnglish ? "0" : "auto",
                marginRight: isEnglish ? "0px" : "4px",
              },
              "& input[type='date']": {
                textAlign: isEnglish ? "left" : "right",
              },
            }}
            value={date}
            onChange={(e) => setDate(e.target.value)}
            margin="normal"
            variant="standard"
            fullWidth
            type="date"
            label={"التاريخ الجديد لإنهاء المهمة"}
            InputLabelProps={{ shrink: true }}
          />
        </Col> */}
      </Row>
    </Modal>
  );
};

export default AssignUsersModal;
