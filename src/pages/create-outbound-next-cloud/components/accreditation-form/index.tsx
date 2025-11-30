import { Modal, Form, Input, Select, Checkbox, Button } from "antd";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod"; // Zod schema library
import ApproverTitleSelect from "./ApproverTitleSelect";
import SignaturePositionSelect from "./SignaturePositionSelect";
import ApprovalSubTypeSelect from "./ApprovalSubTypeSelect";
import { TextField } from "@mui/material";
import { useLanguage } from "../../../../context/language";

const { Option } = Select;

// Zod Schema for validation
const schema = z.object({
  approverTitle: z.any(),
  accreditationText: z
    .string()
    .min(1, { message: "Accreditation Text is required" }),
  signaturePosition: z
    .string()
    .min(1, { message: "Digital Signature Position is required" }),
  approverOrgUnit: z
    .string()
    .min(1, { message: "Approver Organization Unit is required" }),
  approverComment: z
    .string()
    .min(1, { message: "Approver Comment is required" }),
  reviewUser: z.string().min(1, { message: "Review User is required" }),
  readReceipt: z.boolean(),
});

interface Props {
  open?: boolean;
  onCancel?: () => any;
  onClose?: () => any;
}
const AccreditationForm: React.FC<Props> = ({ open, onCancel, onClose }) => {
  const { labels } = useLanguage();

  // React Hook Form setup with Zod resolver
  const {
    control,
    handleSubmit,
    formState: { errors },
    getValues,
    setValue,
    watch,
    register,
  } = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
  });

  // Handle form submission
  const onSubmit = (data: any) => {
    console.log(data);
    onClose && onClose();
  };

  const handleCancel = () => {
    onCancel && onCancel();
  };

  return (
    <div>
      <Modal
        title="Accreditation Form"
        open={open}
        onCancel={handleCancel}
        footer={null}
      >
        <Form layout="vertical" onFinish={handleSubmit(onSubmit)}>
          <ApproverTitleSelect
            key={watch("approverTitle") && getValues("approverTitle")}
            value={getValues("approverTitle")}
            onChange={(value) => setValue("approverTitle", value.userTitleId)}
          />

          <ApprovalSubTypeSelect
            key={watch("accreditationText") && getValues("accreditationText")}
            values={getValues("accreditationText")}
            handleValuesChange={(value) =>
              setValue("accreditationText", value + "")
            }
          />

          <SignaturePositionSelect
            key={watch("signaturePosition") && getValues("signaturePosition")}
            value={getValues("signaturePosition")}
            onChange={(value) => setValue("signaturePosition", value)}
          />

          <TextField
            fullWidth
            variant="standard"
            margin="normal"
            label={labels.lbl.enter_comment}
            {...register("reviewUser")}
            error={!!errors.reviewUser}
            helperText={errors.reviewUser?.message}
          />

          <Form.Item name="readReceipt" valuePropName="checked">
            <Controller
              name="readReceipt"
              control={control}
              render={({ field }) => (
                <Checkbox {...field}>Read Receipt</Checkbox>
              )}
            />
          </Form.Item>

          <Form.Item
            label="Approver Organization Unit"
            validateStatus={errors.approverOrgUnit ? "error" : ""}
            help={errors.approverOrgUnit?.message?.toString()}
          >
            <Controller
              name="approverOrgUnit"
              control={control}
              render={({ field }) => (
                <Select {...field} style={{ width: "100%" }}>
                  <Option value="unit1">Unit 1</Option>
                  <Option value="unit2">Unit 2</Option>
                  <Option value="unit3">Unit 3</Option>
                </Select>
              )}
            />
          </Form.Item>

          <Form.Item
            label="Approver User Comment"
            validateStatus={errors.approverComment ? "error" : ""}
            help={errors.approverComment?.message?.toString()}
          >
            <Controller
              name="approverComment"
              control={control}
              render={({ field }) => <Input.TextArea {...field} />}
            />
          </Form.Item>

          <Form.Item
            label="Review User"
            validateStatus={errors.reviewUser ? "error" : ""}
            help={errors.reviewUser?.message?.toString()}
          >
            <Controller
              name="reviewUser"
              control={control}
              render={({ field }) => (
                <Select {...field} style={{ width: "100%" }}>
                  <Option value="user1">User 1</Option>
                  <Option value="user2">User 2</Option>
                  <Option value="user3">User 3</Option>
                </Select>
              )}
            />
          </Form.Item>

          <div style={{ textAlign: "right" }}>
            <Button onClick={handleCancel} style={{ marginRight: 8 }}>
              Cancel
            </Button>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default AccreditationForm;
