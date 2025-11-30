import React, { SetStateAction, useState } from "react";
import { Table, Pagination, Row, Button } from "antd";
import { CorrespondenceType } from "../../types";

import linearRow from "./linear-row";
import linearThumbnailRow from "./linear-thumbnail-row";
import { AppstoreOutlined, UnorderedListOutlined } from "@ant-design/icons";
import { useLanguage } from "../../../../context/language";

interface Props {
    data: CorrespondenceType[];
    loading?: boolean;
    currentPage: number;
    pageSize: number;
    total?: number;
    setCurrentPage: React.Dispatch<SetStateAction<number>>;
}

const PaginatedTable: React.FC<Props> = ({ data, loading, currentPage, pageSize, setCurrentPage, total }) => {
    const { isEnglish } = useLanguage();
    const [mode, setMode] = useState<"list" | "block">("list");

    const columns = mode === "block" ? linearThumbnailRow() : linearRow();

    return (
        <div>
            <Row align={"middle"} justify={"end"} style={{ gap: "0.5rem", padding: "0.5rem" }}>
                <p>{`${isEnglish ? "View By" : "عرض بواسطة"}:`}</p>
                <Button type={mode === "list" ? "primary" : "dashed"} onClick={() => setMode("list")}>
                    <UnorderedListOutlined />
                </Button>
                <Button type={mode === "block" ? "primary" : "dashed"} onClick={() => setMode("block")}>
                    <AppstoreOutlined />
                </Button>
            </Row>
            <Table
                showHeader={false}
                loading={loading}
                dataSource={data}
                columns={columns}
                rowKey="corrId"
                pagination={false}
            />
            <Pagination
                current={currentPage}
                pageSize={pageSize}
                total={total}
                onChange={setCurrentPage}
                showSizeChanger={false}
            />
        </div>
    );
};

export default PaginatedTable;
