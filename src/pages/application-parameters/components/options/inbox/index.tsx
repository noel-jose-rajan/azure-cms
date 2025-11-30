import { Radio, Row, Col } from 'antd';
import type { RadioChangeEvent } from 'antd';
import { LANGUAGE } from '../../../../../constants/language';
import { useLanguage } from '../../../../../context/language';
import { englishLabels } from '../../../../../constants/app-constants/en';
import { arabicLabels } from '../../../../../constants/app-constants/ar';
import { useMemo } from 'react';

type BOOLEAN = "FALSE" | "TRUE";

interface Props {
    MakeTaskActionFromInbox?: BOOLEAN | "";
    onChange?: (val: { key: string, value: BOOLEAN | '' }) => void;
}

export default function Inbox({
    MakeTaskActionFromInbox,
    onChange,
}: Props) {
    const { language } = useLanguage();

    const { btn, lbl } = language === LANGUAGE.ENGLISH_INT ? englishLabels : arabicLabels;

    const options = useMemo(
        () => [
            {
                key: "MakeTaskActionFromInbox",
                value: MakeTaskActionFromInbox,
                title: lbl.appParam_MakeTaskActionFromInbox,
                yesText: `${btn.yes}`,
                noText: `${btn.no}`
            },


        ],
        [
            MakeTaskActionFromInbox,
            btn,
            lbl,
        ]
    );

    const handleChange = (key: string) => (e: RadioChangeEvent) => {
        onChange && onChange({ key, value: e.target.value as BOOLEAN });
    };

    return (
        <Row gutter={[16, 16]}>
            {options.map(({ key, value, title, noText, yesText }) => (
                <Col key={key} xs={24} sm={12}>
                    <div style={{ marginBottom: 8, fontWeight: 'bold' }}>{title}</div>
                    <Radio.Group
                        onChange={handleChange(key)}
                        value={value}
                        style={{ display: 'block' }}
                    >
                        <div style={{ marginBottom: 4 }}>
                            <Radio value="TRUE">
                                <div dangerouslySetInnerHTML={{ __html: yesText }}>
                                </div>
                            </Radio>
                        </div>
                        <div>
                            <Radio value="FALSE">
                                <div dangerouslySetInnerHTML={{ __html: noText }}>
                                </div>

                            </Radio>
                        </div>
                    </Radio.Group>
                </Col>
            ))}
        </Row>
    );
}
