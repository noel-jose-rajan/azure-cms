import { Row, Col, InputNumber } from 'antd';
import { LANGUAGE } from '../../../../../constants/language';
import { useLanguage } from '../../../../../context/language';
import { englishLabels } from '../../../../../constants/app-constants/en';
import { arabicLabels } from '../../../../../constants/app-constants/ar';
import { useMemo } from 'react';

interface Props {
    NotificationCleanerDays?: string;
    onChange?: (val: { key: string, value: string }) => void;
}

export default function ApplicationNotifications({
    NotificationCleanerDays,
    onChange,
}: Props) {
    const { language } = useLanguage();

    const { btn, lbl } = language === LANGUAGE.ENGLISH_INT ? englishLabels : arabicLabels;

    const options = useMemo(
        () => [
            {
                key: "NotificationCleanerDays",
                value: NotificationCleanerDays,
                title: lbl.notify_cleaner_days
            },
        ],
        [
            NotificationCleanerDays,
            btn,
            lbl
        ]
    );

    const handleNumberChange = (key: string) => (value: number | null) => {
        if (onChange && value !== null) {
            onChange({ key, value: value.toString() });
        }
    };

    return (
        <Row gutter={[16, 16]}>
            {options.map(({ key, value, title }) => (
                <Col key={key} xs={24} sm={12}>
                    <div style={{ marginBottom: 8, fontWeight: 'bold' }}>{title}</div>
                    <InputNumber

                        value={value ? parseInt(value, 10) : undefined}
                        onChange={handleNumberChange(key)}
                        style={{ width: '100%' }}
                    />
                </Col>
            ))}
        </Row>
    );
}
