import { Radio, Row, Col } from 'antd';
import type { RadioChangeEvent } from 'antd';
import { LANGUAGE } from '../../../../../constants/language';
import { useLanguage } from '../../../../../context/language';
import { englishLabels } from '../../../../../constants/app-constants/en';
import { arabicLabels } from '../../../../../constants/app-constants/ar';
import { useMemo } from 'react';

type BOOLEAN = "FALSE" | "TRUE";

interface Props {
    InboundCCEmailOption?: "1" | "2";
    InboundFyiEmailOption?: "1" | "2";
    GrantReadAccessToInboundIssuersGroup?: BOOLEAN | "";

    onChange?: (val: { key: string, value: BOOLEAN | '' }) => void;
}

export default function ValuesRelatedToInboundWorkflow({
    InboundCCEmailOption,
    InboundFyiEmailOption,
    GrantReadAccessToInboundIssuersGroup,
    onChange,
}: Props) {
    const { language } = useLanguage();

    const { btn, lbl, til } = language === LANGUAGE.ENGLISH_INT ? englishLabels : arabicLabels;

    const options = useMemo(
        () => [

            {
                key: "GrantReadAccessToInboundIssuersGroup",
                value: GrantReadAccessToInboundIssuersGroup,
                title: lbl.param_grant_read_inbound_issuer,
                yesText: `${btn.yes}`,
                noText: `${btn.no}`
            },


        ],
        [
            GrantReadAccessToInboundIssuersGroup,
            btn,
            lbl,
            til
        ]
    );

    const options2 = useMemo(
        () => [
            {
                key: "InboundCCEmailOption",
                value: InboundCCEmailOption,
                title: lbl.inbound_cc_email_option,
                yesText: `${lbl.send_email_to_cc}`,
                noText: `${lbl.send_task_to_cc}`
            },
            {
                key: "InboundFyiEmailOption",
                value: InboundFyiEmailOption,
                title: lbl.param_inbound_fyi_route_option,
                yesText: `${lbl.send_email_fyi_routing}`,
                noText: `${lbl.send_task_fyi_routing}`
            },
        ],
        [
            InboundCCEmailOption,
            InboundFyiEmailOption,
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
            {options2.map(({ key, value, title, noText, yesText }) => (
                <Col key={key} xs={24} sm={12}>
                    <div style={{ marginBottom: 8, fontWeight: 'bold' }}>{title}</div>
                    <Radio.Group
                        onChange={handleChange(key)}
                        value={value}
                        style={{ display: 'block' }}
                    >
                        <div style={{ marginBottom: 4 }}>
                            <Radio value="1">
                                <div dangerouslySetInnerHTML={{ __html: yesText }}>
                                </div>
                            </Radio>
                        </div>
                        <div>
                            <Radio value="2">
                                <div dangerouslySetInnerHTML={{ __html: noText }}>
                                </div>

                            </Radio>
                        </div>
                    </Radio.Group>
                </Col>
            ))}
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
