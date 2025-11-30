import { useEffect, useMemo, useState } from 'react'
import ApplicationParametersAccordion from '../application-parameters-accordion'
import { BellOutlined } from '@ant-design/icons'
import { arabicLabels } from '../../../../constants/app-constants/ar'
import { englishLabels } from '../../../../constants/app-constants/en'
import { LANGUAGE } from '../../../../constants/language'
import { useLanguage } from '../../../../context/language'
import Option, { UrgencyNotificationType } from './option'
import { getAllNotificationPickList, getAllUrgencyUnits } from '../../../../components/services/urgency-notifications'
import { HttpStatus } from '../../../../components/functional/httphelper'
import { UrgencyNotificationPickListType } from '../../../../components/services/urgency-notifications/type'

export default function ManageUrgencyNotifications() {


    //Context
    const { language } = useLanguage();

    //states
    const [notificationInfo, setNotificationInfo] = useState<UrgencyNotificationPickListType[]>([]);
    const [units, setUnits] = useState<string[]>([])

    //Processed Data
    const label = useMemo(() => (language === LANGUAGE.ENGLISH_INT ? englishLabels : arabicLabels), [language]);


    //Life Cycle
    useEffect(() => {
        init()
    }, []);

    const init = async () => {
        await getAllDurationUnits()
        await getAllUrgencyNotifications()
    }

    const getAllDurationUnits = async () => {
        const response = await getAllUrgencyUnits() 

        if (response.status === HttpStatus.SUCCESS && response.data) {
            setUnits(() => response.data.data)
        }
    }

    const getAllUrgencyNotifications = async () => {
        const response = await getAllNotificationPickList()

        if (response.status === HttpStatus.SUCCESS && response.data) { 
            setNotificationInfo(response.data.data)
        }
    }


    return (

        <>

            <ApplicationParametersAccordion title={label.til.urgency_notification} icon={<BellOutlined />} >

                <Option
                    notifications={notificationInfo as unknown as UrgencyNotificationType[]}
                    units={units}
                    onChange={init}
                />

            </ApplicationParametersAccordion></>
    )
}
