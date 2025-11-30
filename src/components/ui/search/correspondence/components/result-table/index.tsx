import { useState, useEffect } from 'react';
import { Table, Pagination, Card, Button, InputNumber } from 'antd';
import TitleHeader from '../../../../header';
import { FilterFilled } from '@ant-design/icons';
import { useLanguage } from '../../../../../../context/language';
import { useTheme } from '../../../../../../context/theme';
import { arabicLabels } from '../../../../../../constants/app-constants/ar';
import { englishLabels } from '../../../../../../constants/app-constants/en';
import { ColumnsType } from 'antd/es/table';
import { CorrespondenceType } from '../../../../../../types/correspondence';
import { search, searchCount } from '../../service';
import { CorrespondenceSearchCriteria } from '../../types';

interface Props {
    onSelect?: (organizationUnit: CorrespondenceType) => any;
    onRemove?: (removeId?: string | null) => any;
    onQueryUpdate: (query: CorrespondenceSearchCriteria) => any
    value?: CorrespondenceType[];
    searchProps: CorrespondenceSearchCriteria;
    multiple?: boolean;
}

const ResultTable = ({ onSelect, value: defaultValue, searchProps, multiple = false, onRemove, onQueryUpdate }: Props) => {
    // Context
    const { isEnglish } = useLanguage();
    const { theme: { colors } } = useTheme();

    // State to store the data and count from the APIs
    const [data, setData] = useState<CorrespondenceType[]>([]);
    const [totalCount, setTotalCount] = useState(0); // Total count for pagination
    const [loading, setLoading] = useState(false);

    // Computed values based on selected language
    const { til, btn } = isEnglish ? englishLabels : arabicLabels;

    const fetchCounts = async () => {

        try {
            const response = await searchCount(searchProps)
            setTotalCount(response?.resultStatistics["all Result Count"]!);
        } catch (error) {
            console.error("Error fetching count:", error);
        }
    };

    const fetchData = async () => {
        setLoading(true);

        try {
            const response = await search(searchProps)


            setData(response?.content!);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchCounts();
        fetchData();
    }, [searchProps]);

    const handleActionClick = (orgUnit: CorrespondenceType) => {
        if (multiple) {
            onSelect && onSelect(orgUnit);
        } else {
            onSelect && onSelect(orgUnit);
        }
    };

    const columns: ColumnsType<CorrespondenceType> = [
        {
            title: 'Correspondence No',
            dataIndex: 'correspondenceNo',
            key: 'correspondenceNo',
        },
        {
            title: 'Subject',
            dataIndex: 'subject',
            key: 'subject',
        },
        {
            title: 'Sending Entity',
            dataIndex: 'sendingEntityDescription',
            key: 'sendingEntityDescription',
        },
        {
            title: 'Receiving Entity',
            dataIndex: 'receivingEntityDescription',
            key: 'receivingEntityDescription',
            render: (value) => value?.join(', '),
        },
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => (
                !!!defaultValue?.find((f) => f.corrId === record.corrId) ? (
                    <Button
                        type="primary"
                        onClick={() => handleActionClick(record)}
                    >
                        {btn.select}
                    </Button>
                ) : (
                    <Button
                        type="dashed"
                        onClick={() => onRemove && onRemove(record.corrId!)}
                    >
                        {btn.reset}
                    </Button>
                )
            ),
        },
    ];


    const handlePageUpdate = (page: number) => {

        onQueryUpdate({
            ...searchProps,
            query: {
                ...searchProps.query,
                page
            }
        })
    }

    const handlePageSizeUpdate = (size: number) => {

        onQueryUpdate({
            ...searchProps,
            query: {
                ...searchProps.query,
                size
            }
        })
    }

    return (
        <Card>
            <TitleHeader
                heading={til.search_result}
                icon={<FilterFilled style={{ color: colors.backgroundText }} />}
            />
            <Table
                columns={columns}
                dataSource={data}
                rowKey="corrId"
                loading={loading}
                pagination={false}
            />
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginTop: 16,
                }}
            >
                <Pagination
                    current={searchProps.query.page}
                    total={totalCount}
                    pageSize={searchProps.query.size}
                    onChange={(page, pageSize) => {
                        handlePageUpdate(page);
                        handlePageSizeUpdate(pageSize);
                    }}
                    showSizeChanger
                    showTotal={(total) => `Total ${total} items`}
                />
                <InputNumber
                    min={1}
                    max={Math.ceil(totalCount / searchProps.query.size)}
                    value={searchProps.query.page}
                    onChange={(value) => value && handlePageUpdate(value)}
                    style={{ width: 100 }}
                    placeholder="Go to page"
                />
            </div>
        </Card>
    );
};

export default ResultTable;
