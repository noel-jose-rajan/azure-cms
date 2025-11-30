import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button, Row, Col, Card, message, Modal } from "antd";
import { PrinterFilled } from "@ant-design/icons";
import { useLanguage } from "../../../../context/language";
import { LANGUAGE } from "../../../../constants/language";
import { englishLabels } from "../../../../constants/app-constants/en";
import { arabicLabels } from "../../../../constants/app-constants/ar";

import { resetBarcode } from "../../service";
import { TextField } from "@mui/material";

export default function ResetBarCode() {
  const { language } = useLanguage();
  const isEnglish = language === LANGUAGE.ENGLISH_INT;

  const { lbl, btn } = isEnglish ? englishLabels : arabicLabels;

  // Zod Schema
  const formSchema = z.object({
    barcodeNumber: z
      .string()
      .regex(
        /^[0-9]+$/,
        isEnglish
          ? "Please enter a valid barcode number"
          : "الرجاء إدخال رقم باركود صالح"
      )
      .nonempty(
        isEnglish ? "Barcode number is required" : "رقم الباركود مطلوب"
      ),
    yearInput: z
      .string()
      .regex(
        /^[0-9]{4}$/,
        isEnglish ? "Year must be 4 digits" : "يجب أن تتكون السنة من 4 أرقام"
      )
      .nonempty(isEnglish ? "Year is required" : "السنة مطلوبة"),
  });

  type FormData = z.infer<typeof formSchema>;

  const {
    handleSubmit,
    control,
    formState: { isValid },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    mode: "onChange", // Trigger validation on change
    defaultValues: {
      barcodeNumber: "",
      yearInput: "2024",
    },
  });

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [formData, setFormData] = useState<FormData | null>(null);

  const onSubmit = async ({ barcodeNumber, yearInput }: FormData) => {
    try {
      await resetBarcode({
        customYear: yearInput,
        customValue: barcodeNumber,
      });

      message.success(
        isEnglish
          ? "Barcode reset successfully"
          : "تم إعادة تعيين الباركود بنجاح"
      );
    } catch (error) {
      message.error(
        isEnglish ? "Failed to reset barcode" : "فشل في إعادة تعيين الباركود"
      );
    }
  };

  const showConfirmationModal = (data: FormData) => {
    setFormData(data);
    setIsModalVisible(true);
  };

  const handleConfirmReset = () => {
    if (formData) {
      onSubmit(formData);
    }
    setIsModalVisible(false);
  };

  const handleCancelReset = () => {
    setIsModalVisible(false);
  };

  // Watch the language and reset form
  React.useEffect(() => {
    reset({
      barcodeNumber: "",
      yearInput: "2024",
    });
  }, [language, reset]);

  return (
    <Card>
      <form onSubmit={handleSubmit(showConfirmationModal)}>
        <Row gutter={16}>
          {/* Column 1: Barcode Number */}
          <Col span={8}>
            <Controller
              name="barcodeNumber"
              control={control}
              render={({ field, fieldState }) => (
                <div>
                  <TextField
                    variant="standard"
                    error={!!fieldState.error}
                    {...field}
                    placeholder={lbl.br_no}
                    label={lbl.br_no}
                  />
                  <p style={{ color: "red" }}>{fieldState.error?.message}</p>
                </div>
              )}
            />
          </Col>

          {/* Column 2: Year Input */}
          <Col span={8}>
            <Controller
              name="yearInput"
              control={control}
              render={({ field, fieldState }) => (
                <div>
                  <TextField
                    variant="standard"
                    error={!!fieldState.error}
                    {...field}
                    placeholder={lbl.br_year}
                    label={lbl.br_year}
                  />
                  <p style={{ color: "red" }}>{fieldState.error?.message}</p>
                </div>
              )}
            />
          </Col>

          {/* Column 3: Save Button */}
          <Col span={8}>
            <div>
              <Button
                type="primary"
                htmlType="submit"
                disabled={!isValid}
                style={{ width: "100%", direction: isEnglish ? "ltr" : "rtl" }}
              >
                <PrinterFilled /> {btn.reset_barcode}
              </Button>
            </div>
          </Col>
        </Row>
      </form>

      {/* Confirmation Modal */}
      <Modal
        title={isEnglish ? "Confirm Reset" : "تأكيد إعادة التعيين"}
        open={isModalVisible}
        onOk={handleConfirmReset}
        onCancel={handleCancelReset}
        okText={isEnglish ? "Yes" : "نعم"}
        cancelText={isEnglish ? "No" : "لا"}
      >
        <p>
          {isEnglish
            ? "Are you sure you want to reset the barcode?"
            : "هل أنت متأكد أنك تريد إعادة تعيين الباركود؟"}
        </p>
      </Modal>
    </Card>
  );
}
