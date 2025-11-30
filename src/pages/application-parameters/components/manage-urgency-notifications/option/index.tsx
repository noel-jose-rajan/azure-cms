import { Row, Col, InputNumber, Button, Dropdown, message } from 'antd';
import type { MenuProps } from 'antd';
import { LANGUAGE } from '../../../../../constants/language';
import { useLanguage } from '../../../../../context/language';
import { englishLabels } from '../../../../../constants/app-constants/en';
import { arabicLabels } from '../../../../../constants/app-constants/ar';
import { useMemo, useState } from 'react';
import { CaretDownOutlined } from '@ant-design/icons';
import Text from '../../../../../components/ui/text/text';
import ApplicationParametersControls from '../../application-parameters-controls';
import { z } from 'zod';
import { updateUrgencyNotification } from '../../../../../components/services/urgency-notifications';
import { HttpStatus } from '../../../../../components/functional/httphelper';

// Zod schemas for validation
export const UrgencyNotificationSchema = z.object({
    id: z.number(),
    actionDuration: z.number().min(1, 'Action duration must be at least 1'),
    durationUnit: z.string().nonempty('Duration unit is required'),
    notificationFrequency: z.number().min(1, 'Notification frequency must be at least 1'),
    picklistCode: z.string().nonempty('Picklist code is required'),
    picklistEnLabel: z.string().nonempty('Picklist description is required'),
    picklistArLabel: z.string().nonempty('Picklist description is required'),
    links: z.array(z.any()).optional(),
}).passthrough();

export type UrgencyNotificationType = z.infer<typeof UrgencyNotificationSchema>

const PropsSchema = z.object({
    units: z.array(z.string()).optional(),
    notifications: z.array(UrgencyNotificationSchema).optional(),
    onChange: z.function().returns(z.void()).optional(),
});

// Define TypeScript interfaces
interface UrgencyNotificationProps extends z.infer<typeof UrgencyNotificationSchema> { }
interface Props extends z.infer<typeof PropsSchema> { }

export default function Option({ units, notifications, onChange }: Props) {
    const { language, isEnglish } = useLanguage();

    // State management
    const [loading, setLoading] = useState(false);
    const [selectedNotification, setSelectedNotification] = useState<UrgencyNotificationProps | null>(notifications ? notifications[0] : null);
    const [initialState, setInitialState] = useState<UrgencyNotificationProps | null>(notifications ? notifications[0] : null);
    const [errors, setErrors] = useState<string | null>(null);

    // Check if the form is modified
    const isModified = useMemo(
        () => JSON.stringify(selectedNotification) !== JSON.stringify(initialState),
        [selectedNotification, initialState]
    );

    const { btn, lbl } = language === LANGUAGE.ENGLISH_INT ? englishLabels : arabicLabels;

    // Handle field changes
    const handleChange = (key: string, value: string | number) => {
        console.log(1);

        if (selectedNotification) {
            console.log(2);

            setSelectedNotification((prev) => (prev ? { ...prev, [key]: value } : null));
        }
    };

    // Menu for notifications
    const menu: MenuProps['items'] = useMemo(
        () =>
            (notifications || []).map((item) => ({
                key: item.id,
                label: (
                    <Text
                        style={{ textTransform: 'capitalize' }}
                        ar={item.picklistArLabel}
                        en={item.picklistEnLabel}
                    />
                ),
                onClick: () => {
                    setSelectedNotification(item);
                    setInitialState(item);
                },
            })),
        [notifications]
    );

    // Menu for units
    const unitMenu: MenuProps['items'] = useMemo(
        () =>
            units?.map((unit) => ({
                key: unit,
                label: <Text style={{ textTransform: 'capitalize' }} ar={unit} en={unit} />,
                onClick: () => handleChange('durationUnit', unit),
            })) || [],
        [units]
    );



    // Validate selected notification
    const validateNotification = () => {
        if (selectedNotification) {
            try {
                const parsedNotification = {
                    id: selectedNotification.id,
                    actionDuration: selectedNotification.actionDuration,
                    durationUnit: selectedNotification.durationUnit,
                    notificationFrequency: selectedNotification.notificationFrequency,
                    picklistCode: selectedNotification.picklistCode,
                    picklistEnLabel: selectedNotification.picklistEnLabel,
                    picklistArLabel: selectedNotification.picklistArLabel,
                    links: selectedNotification.links
                }

                UrgencyNotificationSchema.parse(parsedNotification)
                setErrors(null);
                return true;
            } catch (error) {
                if (error instanceof z.ZodError) {
                    setErrors(error.errors.map((err) => err.message).join(', '));
                }
                return false;
            }
        }
        return false;
    };

    // Handle save operation
    const handleSave = async () => {
        if (validateNotification()) {
            setLoading(true);

            try {
                const response = await updateUrgencyNotification(
                    selectedNotification?.id ?? 0,
                    {
                        //@ts-ignore
                        actionDuration: selectedNotification?.actionDuration,
                        //@ts-ignore
                        durationUnit: selectedNotification?.durationUnit,
                        //@ts-ignore
                        notificationFrequency: selectedNotification?.notificationFrequency,
                        //@ts-ignore
                        urgencyLevelPickListCode: selectedNotification?.urgencyLevelPickListCode,
                    }
                );

                if (response.status === HttpStatus.SUCCESS) {
                    message.success(
                        language === LANGUAGE.ENGLISH_INT
                            ? 'Urgency Notifications: Updated Successfully'
                            : 'إشعارات الطوارئ: تم التحديث بنجاح'
                    );
                    onChange?.();
                } else {
                    message.error(
                        language === LANGUAGE.ENGLISH_INT
                            ? 'Urgency Notifications: Update Failed'
                            : 'إشعارات الطوارئ: فشل التحديث'
                    );
                }
            } catch {
                message.error(
                    language === LANGUAGE.ENGLISH_INT
                        ? 'Urgency Notifications: Update Failed'
                        : 'إشعارات الطوارئ: فشل التحديث'
                );
            } finally {
                setLoading(false);
            }
        }
    };

    // Reset the form to initial state
    const handleReset = () => {
        setSelectedNotification(initialState);
        setErrors(null);
    };

    return (
        <>

            {errors && <div style={{ color: 'red', marginBottom: 8 }}>{errors}</div>}
            <Row gutter={[16, 16]}>
                {/* Urgency Notification Dropdown */}
                <Col xs={24} sm={12}>
                    <div style={{ marginBottom: 8, fontWeight: 'bold' }}>{lbl.urgency_notification}</div>
                    <Dropdown menu={{ items: menu }} trigger={['click']}>
                        <Button type="text">
                            {selectedNotification
                                ? isEnglish ? selectedNotification.picklistEnLabel : selectedNotification.picklistArLabel
                                : btn.select}{' '}
                            <CaretDownOutlined />
                        </Button>
                    </Dropdown>
                </Col>

                {/* Action Duration */}
                <Col xs={24} sm={12}>
                    <div style={{ marginBottom: 8, fontWeight: 'bold' }}>{lbl.duration_unit}</div>
                    <InputNumber
                        min={1}
                        value={selectedNotification?.actionDuration || undefined}
                        onChange={(value) => handleChange('actionDuration', value as number)}
                        style={{ width: '100%' }}
                    />
                </Col>

                {/* Duration Unit Dropdown */}
                <Col xs={24} sm={12}>
                    <div style={{ marginBottom: 8, fontWeight: 'bold' }}>{lbl.duration_unit}</div>
                    <Dropdown key={`${selectedNotification?.durationUnit}`} menu={{ items: unitMenu }} trigger={['click']}>
                        <Button type="text">
                            {selectedNotification?.durationUnit || btn.select}{' '}
                            <CaretDownOutlined />
                        </Button>
                    </Dropdown>
                </Col>

                {/* Notification Frequency */}
                <Col xs={24} sm={12}>
                    <div style={{ marginBottom: 8, fontWeight: 'bold' }}>
                        {lbl.escalation_after_how_many_reminders}
                    </div>
                    <InputNumber
                        min={1}
                        value={selectedNotification?.notificationFrequency || undefined}
                        onChange={(value) => handleChange('notificationFrequency', value as number)}
                        style={{ width: '100%' }}
                    />
                </Col>
            </Row>
            {/* Controls */}
            <ApplicationParametersControls
                isReset={isModified}
                isSave={isModified}
                onSave={handleSave}
                onReset={handleReset}
                isLoading={loading}
            />
        </>
    );
}
