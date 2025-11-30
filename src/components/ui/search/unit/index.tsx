import { useState } from 'react'
import { OrganizationUnit } from './types';
import { Modal, Tag } from 'antd';
import { useLanguage } from '../../../../context/language';
import { englishLabels } from '../../../../constants/app-constants/en';
import { arabicLabels } from '../../../../constants/app-constants/ar';

import { useTheme } from '../../../../context/theme';
import SearchBar from './components/search-bar';
import ResultTable from './components/result-table';
import MiniSearch from './components/mini-search';


interface Props {
    value?: OrganizationUnit;
    onChange?: (orgUnit: OrganizationUnit) => void;
    onSelect?: (unit: OrganizationUnit | undefined) => any
}



export default function OrganizationUnitSearch({
    value,
    onSelect

}: Props) {

    //context
    const { isEnglish } = useLanguage()
    const { theme: { colors } } = useTheme()
    const [_search, setSearch] = useState<any>({})


    //states
    const [open, setOpen] = useState<boolean>(false)

    //computed
    const { btn, til } = isEnglish ? englishLabels : arabicLabels


    //handlers
    const handleOnClose = () => {
        setOpen(() => false)
    }

    const preventDefault = (e: React.MouseEvent<HTMLElement>) => {
        e.preventDefault();
        console.log('Clicked! But prevent default.');
        onSelect && onSelect(undefined)
    };


    console.log(value);



    return (
        <>
            {
                value && value.organizationUnitId
                    ? <Tag closeIcon color={colors.primary} onClose={preventDefault}>
                        {isEnglish ? value.orgUnitDescEn : value.orgUnitDescAr}
                    </Tag>
                    : <MiniSearch
                        onSelect={(unit) => onSelect && onSelect(unit)}
                        onAdvanceSearch={() => setOpen(() => true)}
                    />
            }



            <Modal
                open={open}
                onClose={handleOnClose}
                onCancel={handleOnClose}
                onOk={handleOnClose}
                okText={btn.ok}
                cancelText={btn.cancel}
                title={til.search_org_unit}
                style={{ maxWidth: "1500px" }}
                width={"90vw"}
            >



                <SearchBar onSearch={search => setSearch(search)} />
                <br />
                <ResultTable onSelect={(unit) => onSelect && onSelect(unit)} searchProps={_search} />


            </Modal >
        </>
    )
}
