import { SaveOutlined, ReloadOutlined } from '@ant-design/icons';
import { Space, Button, Spin } from 'antd';
import { LANGUAGE } from '../../../../constants/language';
import { useLanguage } from '../../../../context/language';

interface Props {
    isSave?: boolean
    onSave?: () => any
    isReset?: boolean
    onReset?: () => any
    isLoading?: boolean
}

export default function ApplicationParametersControls({ isReset, isSave, onReset, onSave, isLoading = false }: Props) {

    const { language } = useLanguage()

    const ReloadIcon = () => (
        <Spin indicator={<ReloadOutlined color='#fff' spin />} />
    );

    return (
        <>
            <div style={{ padding: "16px", display: "flex", justifyContent: language === LANGUAGE.ENGLISH_INT ? "flex-start" : "flex-end" }}>
                <Space style={{ marginBottom: "16px" }}>

                    {isLoading && <ReloadIcon />}

                    {isSave && <Button disabled={isLoading} type="primary" icon={<SaveOutlined />} onClick={() => onSave && onSave()}>
                        {language === LANGUAGE.ENGLISH_INT ? "Save Changes" : "حفظ التغييرات"}
                    </Button>}

                    {isReset && <Button disabled={isLoading} type="text" icon={<ReloadOutlined />} onClick={() => onReset && onReset()}>
                        {language === LANGUAGE.ENGLISH_INT ? "Reset" : "إعادة ضبط"}
                    </Button>}

                </Space>
            </div>
        </>
    );
}
