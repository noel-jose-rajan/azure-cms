import { ExportOutlined, PaperClipOutlined } from "@ant-design/icons";
import { Row, Col, Tag } from "antd";
import { ColumnsType } from "antd/es/table";
import { CorrespondenceType } from "../../../types";
import ActionDropdown from "../../action-dropdown";
import { useLanguage } from "../../../../../context/language";
import { useTheme } from "../../../../../context/theme";
import { useNavigate } from "react-router-dom";

export default function linearRow() {

    const { labels } = useLanguage()
    const { theme } = useTheme()
    const navigate = useNavigate()

    const columns: ColumnsType<CorrespondenceType> = [
        {
            title: '',
            dataIndex: 'corrId',
            key: 'corrId',
            render: (_, record) => (
                <Row>
                    <Col span={12}>
                        <span>
                            <p style={{cursor: "pointer"}} onClick={() => navigate(`details/${record.corrId}`)}>
                                <h3 style={{ color: theme.colors.accent }}>{record.subject} <ExportOutlined /> {record.hasAttachement && <PaperClipOutlined />}</h3>
                            </p>
                            <p>{record.corrTypePickListDescription}</p>
                            <p>{labels.lbl.sending_entity}:{' '}
                                <Tag>
                                    {record.sendingEntityDescription}
                                </Tag>
                            </p>
                            <p>{labels.lbl.receiving_entity}:{' '}
                                <Tag>
                                    {record.receivingEntityDescription}
                                </Tag>
                            </p>
                        </span>
                    </Col>
                    <Col span={12} style={{ display: "flex", flexDirection: "column", justifyContent: "right", alignItems: "end" }}>
                        <span>
                            <p style={{ textAlign: "right" }}><b>{record.correspondenceNo ?? '--'}</b></p>
                            <p style={{ textAlign: "right" }}><b>{record.correspondenceDate ?? '--'}</b></p>
                            <p style={{ textAlign: "right" }}><b>{record.creationDate ?? '--'}</b></p>
                            <p style={{ textAlign: "right" }}><b>{record.corrStatusPickListDescription ?? '--'}</b></p>

                        </span>
                        <ActionDropdown corrId={record.corrId} contentRepositoryId={record.contentRepositoryId!} />
                    </Col>

                </Row>
            )
        },


    ];


    return columns

}

