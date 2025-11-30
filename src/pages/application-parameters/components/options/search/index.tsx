import { Radio, Row, Col } from 'antd';
import type { RadioChangeEvent } from 'antd';
import { LANGUAGE } from '../../../../../constants/language';
import { useLanguage } from '../../../../../context/language';
import { englishLabels } from '../../../../../constants/app-constants/en';
import { arabicLabels } from '../../../../../constants/app-constants/ar';
import { useMemo } from 'react';

type BOOLEAN = "FALSE" | "TRUE";

interface Props {
    ContentSearchEnabled?: BOOLEAN | "";

    onChange?: (val: { key: string, value: BOOLEAN | '' }) => void;
}

export default function Search({
    ContentSearchEnabled,
    onChange,
}: Props) {
    const { language } = useLanguage();

    const { btn, lbl, til } = language === LANGUAGE.ENGLISH_INT ? englishLabels : arabicLabels;

    const options = useMemo(
        () => [
            {
                key: "ContentSearchEnabled",
                value: ContentSearchEnabled,
                title: lbl.appParam_ContentSearchEnabled,
                yesText: `${btn.yes}`,
                noText: `${btn.no}`
            },

        ],
        [
            ContentSearchEnabled,
            btn,
            lbl,
            til
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
