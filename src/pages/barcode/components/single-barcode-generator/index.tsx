import { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button, Row, Col, Card, message } from 'antd';
import { PrinterFilled } from '@ant-design/icons';
import { useLanguage } from '../../../../context/language';
import { LANGUAGE } from '../../../../constants/language';
import { englishLabels } from '../../../../constants/app-constants/en';
import { arabicLabels } from '../../../../constants/app-constants/ar';

import { generateBarcodePDF } from "../../service";
import { TextField } from '@mui/material';

export default function SingleBarCodeGenerator() {
    const { language } = useLanguage();
    const isEnglish = language === LANGUAGE.ENGLISH_INT;

    const { lbl, btn } = isEnglish ? englishLabels : arabicLabels;

    // Zod Schema
    const formSchema = z.object({
        barcodeNumber: z.string().regex(/^[0-9]+$/, isEnglish ? 'Please enter a valid barcode number' : 'الرجاء إدخال رقم باركود صالح').nonempty(isEnglish ? 'Barcode number is required' : 'رقم الباركود مطلوب'),
        yearInput: z.string().regex(/^[0-9]{4}$/, isEnglish ? 'Year must be 4 digits' : 'يجب أن تتكون السنة من 4 أرقام').nonempty(isEnglish ? 'Year is required' : 'السنة مطلوبة'),
    });

    type FormData = z.infer<typeof formSchema>;

    const {
        handleSubmit,
        control,
        formState: { isValid },
        reset,
    } = useForm<FormData>({
        resolver: zodResolver(formSchema),
        mode: 'onChange',
        defaultValues: {
            barcodeNumber: '',
            yearInput: '2024',
        },
    });

    const onSubmit = async ({ barcodeNumber, yearInput }: FormData) => {
        const status = await generateBarcodePDF({
            customYear: yearInput,
            valueFrom: barcodeNumber,
            valueTo: barcodeNumber
        });

        if (status) {
            message.success(isEnglish ? "Generated barcode successfully" : "تم إنشاء الباركود بنجاح");
        } else {
            message.error(isEnglish ? "Failed to generate barcode" : "فشل في إنشاء الباركود");
        }
    };

    useEffect(() => {
        reset({
            barcodeNumber: '',
            yearInput: '2024',
        });
    }, [language, reset]);

    return (
        <Card>
            <form onSubmit={handleSubmit(onSubmit)}>
                <Row gutter={16}>
                    {/* Column 1: Barcode Number */}
                    <Col span={8}>
                        <Controller
                            name="barcodeNumber"
                            control={control}
                            render={({ field, fieldState }) => (
                                <div>
                                    <TextField
                                        variant='standard'
                                        {...field}
                                        placeholder={lbl.br_no}
                                        label={lbl.br_no}

                                        error={!!fieldState.error}
                                    />
                                    <p style={{ color: 'red' }}>{fieldState.error?.message}</p>
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
                                        variant='standard'
                                        {...field}
                                        placeholder={lbl.br_year}
                                        label={lbl.br_year}

                                        error={!!fieldState.error}
                                    />
                                    <p style={{ color: 'red' }}>{fieldState.error?.message}</p>
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
                                style={{ width: '100%', direction: isEnglish ? 'ltr' : "rtl" }}
                            >
                                <PrinterFilled /> {btn.print_barcode}
                            </Button>
                        </div>
                    </Col>
                </Row>
            </form>
        </Card>
    );
}
