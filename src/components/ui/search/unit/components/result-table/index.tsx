import { useState, useEffect } from 'react';
import { Table, Pagination, Card, Button, InputNumber } from 'antd';
import axios from 'axios';
import Storage from '../../../../../../lib/storage';
import LOCALSTORAGE from '../../../../../../constants/local-storage';
import TitleHeader from '../../../../header';
import { FilterFilled } from '@ant-design/icons';
import { useLanguage } from '../../../../../../context/language';
import { useTheme } from '../../../../../../context/theme';
import { arabicLabels } from '../../../../../../constants/app-constants/ar';
import { englishLabels } from '../../../../../../constants/app-constants/en';
import { ColumnsType } from 'antd/es/table';
import { OrganizationUnit } from '../../types';
import ENV from '../../../../../../constants/env';


interface Props {
    onSelect?: (organizationUnit: OrganizationUnit) => any
    default?: OrganizationUnit,
    searchProps?: {
        orgUnitDesc?: string,
        orgUnitCode?: string,
        orgUnitEmail?: string
    }
}

const ResultTable = ({ onSelect, searchProps }: Props) => {

    console.log("searchProps", searchProps);


    // Context
    const { isEnglish } = useLanguage();
    const { theme: { colors } } = useTheme();

    // State to store the data from the API
    const [data, setData] = useState([]);
    const [totalCount, setTotalCount] = useState(0); // Total count for pagination
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1); // Current page
    const [pageSize, setPageSize] = useState(10); // Page size
    const [isStatisticsFetched, setIsStatisticsFetched] = useState(false); // Flag to control statistics fetching

    // Computed values based on selected language
    const { til, btn } = isEnglish ? englishLabels : arabicLabels;

    function cleanObject(obj: Record<string, string> = {}) {
        return Object.entries(obj).reduce((acc, [key, value]) => {
            if (value !== "" && value !== null && value !== undefined) {
                // @ts-ignore
                acc[key] = value;
            }
            return acc;
        }, {});
    }

    // Fetch data from the API
    const fetchData = async (page: number, pageSize: number) => {
        setLoading(true);
        const token = Storage.getItem(LOCALSTORAGE.LEGACY_ACCESS_TOKEN);

        const data = cleanObject(searchProps)

        try {
            const response = await axios.post(
                ENV.API_URL_LEGACY + `/org-unit/search?page=${page - 1}&size=${pageSize}&sort=orgUnitCode,asc`,
                {
                    isActive: "1",
                    ...data
                },
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    }
                }
            );

            setData(response.data.searchResultContent);

            // Only fetch statistics for page 1 (page 0 in API terms)
            if (!isStatisticsFetched) {
                setTotalCount(response.data.searchResultStatistics.resultStatistics['Result Count']);
                setIsStatisticsFetched(true); // Set the flag to true after the first request
            }

        } catch (error) {
            console.error('Error fetching data:', error);
        }
        setLoading(false);
    };

    // useEffect to fetch data on component mount or when page/pageSize changes
    useEffect(() => {
        fetchData(page, pageSize);
    }, [page, pageSize, searchProps]);

    // Handle action button click (custom function)
    const handleActionClick = (orgUnit?: OrganizationUnit) => {
        console.log('Action clicked for Org Unit ID:', orgUnit);
        onSelect && orgUnit && onSelect(orgUnit)
        // You can perform any action here (e.g., navigate, open a modal, etc.)
    };

    // Columns configuration for the table
    const columns: ColumnsType<OrganizationUnit> = [
        {
            title: 'Org Unit Code',
            dataIndex: 'orgUnitCode',
            key: 'orgUnitCode',
        },
        {
            title: 'Org Unit Abbreviation',
            dataIndex: 'orgUnitAbbreviation',
            key: 'orgUnitAbbreviation',
        },
        {
            title: 'Org Unit Description (English)',
            dataIndex: 'orgUnitDescEn',
            key: 'orgUnitDescEn',
        },
        {
            title: 'Org Unit Manager',
            dataIndex: 'orgUnitManager',
            key: 'orgUnitManager',
        },
        {
            title: 'Org Unit Level',
            dataIndex: 'orgUnitLevel',
            key: 'orgUnitLevel',
        },
        {
            title: 'Action', // New column for the action button
            key: 'action',
            render: (_, record) => (
                <Button
                    type="primary"
                    onClick={() => handleActionClick(record)} // Passing the orgUnitId
                >
                    {btn.select}
                </Button>
            ),
        },
    ];

    return (
        <Card>
            <TitleHeader
                heading={til.search_result}
                icon={<FilterFilled style={{ color: colors.backgroundText }} />}
            />
            <Table
                columns={columns}
                dataSource={data}
                rowKey="organizationUnitId"
                loading={loading}
                pagination={false}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 16 }}>
                <Pagination
                    current={page}
                    total={totalCount}
                    pageSize={pageSize}
                    onChange={(page, pageSize) => {
                        setPage(page);
                        setPageSize(pageSize);
                    }}
                    showSizeChanger
                    showTotal={(total) => `Total ${total} items`}
                />
                <InputNumber
                    min={1}
                    max={Math.ceil(totalCount / pageSize)} // Maximum pages
                    value={page}
                    onChange={(value) => value && setPage(value)} // Handle page jump
                    style={{ width: 100 }}
                    placeholder="Go to page"
                />
            </div>
        </Card>
    );
};

export default ResultTable;
