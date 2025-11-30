import { useLanguage, } from '../../../../context/language'
import { LANGUAGE } from '../../../../constants/language'
import { Typography } from 'antd'
import { useTheme } from '../../../../context/theme'


interface Props {
    en: string,
    ar: string,
    style?: React.CSSProperties
}
export default function Text({ ar, en, style = {} }: Props) {

    const { language } = useLanguage()
    const { theme } = useTheme()

    return (
        <Typography
            style={{
                color: theme.colors.text,
                ...style,
                direction: language === LANGUAGE.ENGLISH_INT ? "ltr" : "rtl"
            }}>
            {language === LANGUAGE.ENGLISH_INT ? en : ar}
        </Typography>



    )
}

