import { ExportOutlined } from "@ant-design/icons";
import { Row, Col, Tag } from "antd";
import { ColumnsType } from "antd/es/table";
import { CorrespondenceType } from "../../../types";
import ActionDropdown from "../../action-dropdown";
import { useLanguage } from "../../../../../context/language";
import { useTheme } from "../../../../../context/theme";
import { useNavigate } from "react-router-dom";

export default function linearThumbnailRow() {
    const { labels } = useLanguage();
    const { theme } = useTheme();
    const navigate = useNavigate()

    const columns: ColumnsType<CorrespondenceType> = [
        {
            title: '',
            dataIndex: 'corrId',
            key: 'corrId',
            render: (_, record) => (
                <Row style={{ width: '100%', alignItems: 'flex-start' }}>
                    {/* Left Column: Correspondence Details */}
                    <Col span={18} style={{ paddingRight: '20px' }}>
                        <h3 style={{ color: theme.colors.accent }} onClick={() => navigate(`details/${record.corrId}`)}>
                            {record.subject} <ExportOutlined />
                        </h3>
                        <p>{record.corrTypePickListDescription}</p>
                        <p>{labels.lbl.sending_entity}:{' '}
                            <Tag>{record.sendingEntityDescription}</Tag>
                        </p>
                        <p>{labels.lbl.receiving_entity}:{' '}
                            <Tag>{record.receivingEntityDescription}</Tag>
                        </p>
                        <p><b>{record.correspondenceNo ?? '--'}</b></p>
                        <p><b>{record.correspondenceDate ?? '--'}</b></p>
                        <p><b>{record.creationDate ?? '--'}</b></p>
                        <p><b>{record.corrStatusPickListDescription ?? '--'}</b></p>
                        <ActionDropdown corrId={record.corrId} contentRepositoryId={record.contentRepositoryId!} />
                    </Col>

                    {/* Right Column: Image (A4 Ratio Thumbnail) */}
                    <Col span={6}>
                        <img
                            src={'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT_XbQLYzmaMZWIMtjqjEkDRVhv4zpyWW5uNQ&s'} // Assuming the image URL is available in the record
                            alt="Correspondence Image"
                            style={{
                                width: '100%',  // Fit within the width of the column
                                height: 'auto',
                                aspectRatio: '210 / 297', // Maintain A4 aspect ratio
                                objectFit: 'contain',  // Preserve aspect ratio and fit image inside
                            }}
                        />
                    </Col>
                </Row>
            ),
        },
    ];

    return columns;
}
