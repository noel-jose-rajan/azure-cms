import { Radio, Row, Col } from 'antd';
import type { RadioChangeEvent } from 'antd';
import { LANGUAGE } from '../../../../../constants/language';
import { useLanguage } from '../../../../../context/language';
import { englishLabels } from '../../../../../constants/app-constants/en';
import { arabicLabels } from '../../../../../constants/app-constants/ar';
import { useMemo } from 'react';

type BOOLEAN = "FALSE" | "TRUE";

interface Props {
    SkipPdfConverter?: BOOLEAN | "";
    DigitalSignatureMandatory?: BOOLEAN | "";
    DigitalSignatureType?: "mobile_app" | "card_reader" | "all" | "";
    InboundOCREnabled?: BOOLEAN | "";
    EnableOnlineEditor?: BOOLEAN | "";
    TwoFactorAuthenticationEnabled?: BOOLEAN | "";

    onChange?: (val: { key: string, value: BOOLEAN | '' }) => void;
}

export default function ExternalApplications({
    DigitalSignatureMandatory,
    DigitalSignatureType,
    EnableOnlineEditor,
    InboundOCREnabled,
    SkipPdfConverter,
    TwoFactorAuthenticationEnabled,
    onChange,
}: Props) {
    const { language } = useLanguage();

    const { btn, lbl } = language === LANGUAGE.ENGLISH_INT ? englishLabels : arabicLabels;

    const options = useMemo(
        () => [
            {
                key: "SkipPdfConverter",
                value: SkipPdfConverter,
                title: lbl.appParam_digitalSignature,
                yesText: `${btn.yes}`,
                noText: `${btn.no}`
            },
            {
                key: "DigitalSignatureMandatory",
                value: DigitalSignatureMandatory,
                title: lbl.appParam_DigitalSignatureMandatory,
                yesText: `${btn.yes}`,
                noText: `${btn.no}`
            },
            {
                key: "DigitalSignatureType",
                value: DigitalSignatureType,
                title: lbl.appParam_DigitalSignatureType,
                yesText: `${btn.yes}`,
                noText: `${btn.no}`,
                options: [
                    { label: "All", value: "all" },
                    { label: "Mobile App", value: "mobile_app" },
                    { label: "Card Reader", value: "card_reader" },

                ]
            },
            {
                key: "InboundOCREnabled",
                value: InboundOCREnabled,
                title: lbl.appParam_InboundOCREnabled,
                yesText: `${btn.yes} - ${lbl.appParam_InboundOCREnabled_True}`,
                noText: `${btn.no} - ${lbl.appParam_InboundOCREnabled_False}`
            },

            {
                key: "EnableOnlineEditor",
                value: EnableOnlineEditor,
                title: lbl.gen_announce_schema,
                yesText: `${btn.yes}`,
                noText: `${btn.no}`
            },
            {
                key: "TwoFactorAuthenticationEnabled",
                value: TwoFactorAuthenticationEnabled,
                title: lbl.gen_announce_schema,
                yesText: `${btn.yes}`,
                noText: `${btn.no}`
            },

        ],
        [
            DigitalSignatureMandatory,
            DigitalSignatureType,
            EnableOnlineEditor,
            InboundOCREnabled,
            SkipPdfConverter,
            TwoFactorAuthenticationEnabled,
            btn,
            lbl,
        ]
    );

    const handleChange = (key: string) => (e: RadioChangeEvent) => {
        onChange && onChange({ key, value: e.target.value as BOOLEAN });
    };

    return (
        <Row gutter={[16, 16]}>
            {options.map(({ key, value, title, noText, yesText, options }) => (
                <Col key={key} xs={24} sm={12}>
                    <div style={{ marginBottom: 8, fontWeight: 'bold' }}>{title}</div>
                    <Radio.Group
                        onChange={handleChange(key)}
                        value={value}
                        style={{ display: 'block' }}
                        disabled={title === lbl.appParam_DigitalSignatureMandatory && SkipPdfConverter === 'FALSE'}
                    >
                        {options ?
                            <>
                                {options.map((item, index) => (<div style={{ marginBottom: 4 }}>
                                    <Radio key={index} value={item.value}>{item.label}</Radio>
                                </div>))}
                            </>

                            : (
                                <>
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
                                </>
                            )

                        }

                    </Radio.Group>
                </Col>
            ))}
        </Row>
    );
}
