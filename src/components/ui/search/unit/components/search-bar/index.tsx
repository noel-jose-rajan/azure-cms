import { FilterFilled, SearchOutlined } from '@ant-design/icons'
import { Card, Row, Col, Button } from 'antd'
import { useState } from 'react'
import { arabicLabels } from '../../../../../../constants/app-constants/ar'
import { englishLabels } from '../../../../../../constants/app-constants/en'
import { useLanguage } from '../../../../../../context/language'
import { useTheme } from '../../../../../../context/theme'
import TitleHeader from '../../../../header'
import { TextField } from '@mui/material'

interface Props {
    onSearch?: (data: {
        orgUnitDesc?: string,
        orgUnitCode?: string,
        orgUnitEmail?: string
    }) => any,
    value?: {
        orgUnitDesc?: string,
        orgUnitCode?: string,
        orgUnitEmail?: string
    }
}



export default function SearchBar({ onSearch, value = {} }: Props) {


    //context
    const { isEnglish } = useLanguage()
    const { theme: { colors } } = useTheme()


    //states
    const [search, setSearch] = useState(value)

    //computed
    const { btn, til, lbl } = isEnglish ? englishLabels : arabicLabels

    //handlers
    const handleOnSearch = () => {
        onSearch && onSearch(search)
    }

    return (


        <Card>
            <TitleHeader

                heading={til.search_criteria}
                icon={<FilterFilled style={{ color: colors.backgroundText }} />}
            />
            <br />
            <Row gutter={20}>
                <Col span={8}>
                    <TextField
                        variant="standard"
                        value={search?.orgUnitDesc}
                        placeholder={lbl.org_unit_name}
                        label={lbl.org_unit_name}

                        onChange={(e) => setSearch((val) => ({ ...val, orgUnitDesc: e.target.value }))
                        }
                    />
                </Col>
                <Col span={8}>
                    <TextField
                        variant="standard"
                        value={search?.orgUnitCode}
                        placeholder={lbl.org_unit_code}
                        label={lbl.org_unit_code}

                        onChange={(e) => setSearch((val) => ({ ...val, orgUnitCode: e.target.value }))}
                    />
                </Col>
                <Col span={8}>
                    <TextField
                        variant="standard"
                        value={search?.orgUnitEmail}
                        placeholder={lbl.org_unit_email}
                        label={lbl.org_unit_email}

                        onChange={(e) => setSearch((val) => ({ ...val, orgUnitEmail: e.target.value }))}
                    />
                </Col>
                <Col span={24}>
                    <div>
                        <br />
                        <Button onClick={handleOnSearch}>
                            <SearchOutlined /> {btn.search}
                        </Button>
                    </div>
                </Col>
            </Row>
        </Card>


    )
}
