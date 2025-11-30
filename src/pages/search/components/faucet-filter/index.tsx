import React from "react";
import { Button, Card, Checkbox } from "antd";
import { FilterOutlined } from "@ant-design/icons";
import { Accordion } from "../../../../components/ui/accordions/accordion";
import { useTheme } from "../../../../context/theme";

interface Props {

    collapsed?: boolean
    setCollapsed?: React.Dispatch<React.SetStateAction<boolean>>


}

const FaucetFilter: React.FC<Props> = ({ collapsed, setCollapsed }) => {
    const { theme } = useTheme();

    const Header = ({ title }: { title?: string }) => (
        <div style={{ display: "flex", alignItems: "center", gap: "8px", color: theme.colors.backgroundText }}>
            <span>{title}</span>
        </div>
    );

    const FilterSection = ({ title, panelKey, options }: { title: string; panelKey: string; options: { label: string; count: number }[] }) => (
        <Accordion header={<Header title={title} />} panelKey={panelKey} collapseContainerStyleProps={{ backgroundColor: theme.colors.primary }} defaultActiveKey={panelKey}>
            {options.map(({ label, count }) => (
                <div key={label}>
                    <Checkbox>{label} <span style={{ color: theme.colors.accent, fontWeight: "bold" }}>{count}</span></Checkbox><br />
                </div>
            ))}
        </Accordion>
    );

    return (
        <div style={{ position: "relative" }}>
            {!collapsed && (
                <Card >
                    <h3 style={{ fontSize: "1.25rem", fontWeight: "bold" }}>Refine by</h3>
                    <FilterSection title="Content Type" panelKey="content-type" options={[{ label: "Folder", count: 16 }, { label: "Document", count: 5 }]} />
                    <FilterSection title="Document Type" panelKey="document-type" options={[{ label: "Images", count: 5 }, { label: "Office", count: 5 }, { label: "PDFs", count: 3 }]} />
                    <FilterSection title="Modified Date" panelKey="modified-date" options={[{ label: "Last week", count: 9 }, { label: "Last month", count: 2 }, { label: "Older", count: 10 }]} />
                    <FilterSection title="File Size" panelKey="file-size" options={[{ label: "Small (< 1MB)", count: 8 }, { label: "Medium (1MB - 10MB)", count: 6 }, { label: "Large (> 10MB)", count: 4 }]} />
                </Card>
            )}
            <Button
                type="primary"
                shape="round"
                icon={<FilterOutlined />}
                style={{ position: "fixed", bottom: "1rem", left: "1rem", zIndex: 50, boxShadow: "0 4px 6px rgba(0,0,0,0.1)" }}
                onClick={() => setCollapsed && setCollapsed(!collapsed)}
            >
                {collapsed ? "Show Facet" : "Hide Facet"}
            </Button>
        </div>
    );
};

export default FaucetFilter;
