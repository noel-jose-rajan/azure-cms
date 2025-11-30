import { Card, Typography } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { arabicLabels } from '../../../../constants/app-constants/ar';
import { englishLabels } from '../../../../constants/app-constants/en';
import { LANGUAGE } from '../../../../constants/language';
import { useLanguage } from '../../../../context/language';





export default function SelectUserCard() {

    //contexts
    const { language } = useLanguage()

    //computed states
    const isEnglish = language === LANGUAGE.ENGLISH_INT
    const { msg } = isEnglish ? englishLabels : arabicLabels

    return (
        <Card
            style={{ textAlign: 'center' }}
        >
            <div style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: "1rme"
            }}
            >

                <UserOutlined /> <Typography>{msg.select_user}</Typography>

            </div>

        </Card>
    );
}
