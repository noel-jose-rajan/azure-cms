import { Radio, Row, Col } from 'antd';
import type { RadioChangeEvent } from 'antd';
import { LANGUAGE } from '../../../../../constants/language';
import { useLanguage } from '../../../../../context/language';
import { englishLabels } from '../../../../../constants/app-constants/en';
import { arabicLabels } from '../../../../../constants/app-constants/ar';
import { useMemo } from 'react';

type BOOLEAN = "FALSE" | "TRUE";

interface Props {
    GenInboundCorrNumonUnitAcquisition?: BOOLEAN | "";
    GenOutboundInternalCorrNumOnApproval?: BOOLEAN | "";

    onChange?: (val: { key: string, value: BOOLEAN | '' }) => void;
}

export default function GenerateCorrespondenceNumberTiming({
    GenInboundCorrNumonUnitAcquisition,
    GenOutboundInternalCorrNumOnApproval,
    onChange,
}: Props) {
    const { language } = useLanguage();

    const { btn, lbl, til } = language === LANGUAGE.ENGLISH_INT ? englishLabels : arabicLabels;

    const options = useMemo(
        () => [
            {
                key: "GenInboundCorrNumonUnitAcquisition",
                value: GenInboundCorrNumonUnitAcquisition,
                title: til.gen_corr_num_acquisition,
                yesText: `${btn.yes} - ${lbl.gen_corr_num_acquis_info1}`,
                noText: `${btn.no} - ${lbl.gen_corr_num_acquis_info2}`
            },
            {
                key: "GenOutboundInternalCorrNumOnApproval",
                value: GenOutboundInternalCorrNumOnApproval,
                title: til.gen_out_approval,
                yesText: `${btn.yes} - ${lbl.gen_out_approv_info1}`,
                noText: `${btn.no} - ${lbl.gen_out_approv_info2}`
            },


        ],
        [
            GenInboundCorrNumonUnitAcquisition,
            GenOutboundInternalCorrNumOnApproval,
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
