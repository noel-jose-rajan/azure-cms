import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button, Row, Col, Card, message } from 'antd';
import { PrinterFilled } from '@ant-design/icons';
import { useLanguage } from '../../../../context/language';
import { LANGUAGE } from '../../../../constants/language';
import { englishLabels } from '../../../../constants/app-constants/en';
import { arabicLabels } from '../../../../constants/app-constants/ar';
import { generateBarcodePDF } from '../../service';
import { TextField } from '@mui/material';



export default function MultiBarCodeGenerator() {
    const { language } = useLanguage();
    const isEnglish = language === LANGUAGE.ENGLISH_INT;

    const { lbl, btn } = isEnglish ? englishLabels : arabicLabels;

    // Zod Schema
    const formSchema = z
        .object({
            barcodeNumberFrom: z
                .string()
                .regex(/^[0-9]+$/, isEnglish ? 'Please enter a valid barcode number' : 'الرجاء إدخال رقم باركود صالح')
                .nonempty(isEnglish ? 'Barcode number is required' : 'رقم الباركود مطلوب'),
            barcodeNumberTo: z
                .string()
                .regex(/^[0-9]+$/, isEnglish ? 'Please enter a valid barcode number' : 'الرجاء إدخال رقم باركود صالح')
                .nonempty(isEnglish ? 'Barcode number is required' : 'رقم الباركود مطلوب'),
            yearInput: z
                .string()
                .regex(/^[0-9]{4}$/, isEnglish ? 'Year must be 4 digits' : 'يجب أن تتكون السنة من 4 أرقام')
                .nonempty(isEnglish ? 'Year is required' : 'السنة مطلوبة'),
        })
        .refine(
            (data) => Number(data.barcodeNumberFrom) <= Number(data.barcodeNumberTo),
            isEnglish
                ? { message: "'From' barcode number should be less than or equal to 'To' barcode number", path: ['barcodeNumberFrom'] }
                : { message: 'رقم الباركود "من" يجب أن يكون أقل من أو يساوي رقم الباركود "إلى"', path: ['barcodeNumberFrom'] }
        )
        .refine(
            (data) => Number(data.barcodeNumberFrom) <= Number(data.barcodeNumberTo),
            isEnglish
                ? { message: "'From' barcode number should be less than or equal to 'To' barcode number", path: ['barcodeNumberTo'] }
                : { message: 'رقم الباركود "من" يجب أن يكون أقل من أو يساوي رقم الباركود "إلى"', path: ['barcodeNumberTo'] }
        )



    type FormData = z.infer<typeof formSchema>;

    const {
        handleSubmit,
        control,
        formState: { isValid, errors },
        reset,
    } = useForm<FormData>({
        resolver: zodResolver(formSchema),
        mode: 'onChange', // Trigger validation on change
        defaultValues: {
            yearInput: '2024',
        },
    });

    const onSubmit = async ({ barcodeNumberFrom, barcodeNumberTo, yearInput }: FormData) => {

        const status = await generateBarcodePDF({
            customYear: yearInput,
            valueFrom: barcodeNumberFrom,
            valueTo: barcodeNumberTo
        })

        if (status) {
            message.success(isEnglish ? "Generated barcode successfully" : "تم إنشاء الباركود بنجاح");
        } else {
            message.error(isEnglish ? "Failed to generate barcode" : "فشل في إنشاء الباركود");
        }


    };

    // Watch the language and reset form
    React.useEffect(() => {
        reset();
    }, [language, reset]);

    console.log(errors);


    return (
        <Card>
            <form onSubmit={handleSubmit(onSubmit)}>
                <Row gutter={16}>
                    {/* Column 1: Start Barcode Number */}
                    <Col span={6}>
                        <Controller
                            name="barcodeNumberFrom"
                            control={control}
                            render={({ field, fieldState }) => (
                                <div>

                                    <TextField
                                        {...field}
                                        variant='standard'
                                        placeholder={lbl.br_no}
                                        label={lbl.br_no}

                                        error={!!fieldState.error}
                                    />
                                    <p style={{ color: 'red' }}>{fieldState.error?.message}</p>
                                </div>
                            )}
                        />
                    </Col>

                    {/* Column 2: End Barcode Number */}
                    <Col span={6}>
                        <Controller
                            name="barcodeNumberTo"
                            control={control}
                            render={({ field, fieldState }) => (
                                <div>

                                    <TextField
                                        {...field}
                                        variant='standard'
                                        placeholder={lbl.br_no}
                                        label={lbl.br_no}
                                        error={!!fieldState.error}
                                    />
                                    <p style={{ color: 'red' }}>{fieldState.error?.message}</p>
                                </div>
                            )}
                        />
                    </Col>

                    {/* Column 3: Year Input */}
                    <Col span={6}>
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

                    {/* Column 4: Save Button */}
                    <Col span={6}>

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
