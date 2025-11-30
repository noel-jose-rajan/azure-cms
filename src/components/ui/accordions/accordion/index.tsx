import React, { createContext, useContext, useState } from "react";
import { Collapse } from "antd";

import { ReactNode } from "react";
import { CaretDownOutlined, CaretRightOutlined } from "@ant-design/icons";
import { useTheme } from "../../../../context/theme";
const { Panel } = Collapse;

// Context to manage multiple accordions
interface AccordionContextProps {
    openKey: string | null;
    setOpenKey: (key: string | null) => void;
}

const AccordionContext = createContext<AccordionContextProps | null>(null);

interface AccordionGroupProps {
    children: ReactNode;
}

export const AccordionGroup: React.FC<AccordionGroupProps> = ({ children }) => {
    const [openKey, setOpenKey] = useState<string | null>(null);

    return (
        <AccordionContext.Provider value={{ openKey, setOpenKey }}>
            {children}
        </AccordionContext.Provider>
    );
};

interface AccordionProps {
    header: ReactNode;
    icon?: ReactNode; // Antd icons or any custom icon
    children: ReactNode;
    panelKey: string; // Unique key for the panel
    defaultActiveKey?: string | string[] | number
    collapseContainerStyleProps?: React.CSSProperties
    collapsePanelStyleProps?: React.CSSProperties
}

export const Accordion: React.FC<AccordionProps> = ({
    header,
    children,
    panelKey,
    collapseContainerStyleProps = {},
    defaultActiveKey
}) => {
    const { theme } = useTheme()
    const accordionContext = useContext(AccordionContext);

    const handleChange = (key: string | string[]) => {
        if (accordionContext) {
            accordionContext.setOpenKey(
                accordionContext.openKey === key ? null : (key as string)
            );
        }
    };

    const isActive = accordionContext?.openKey === panelKey;

    return (
        <Collapse
            style={collapseContainerStyleProps}
            defaultActiveKey={defaultActiveKey}

            activeKey={accordionContext ? (isActive ? panelKey : undefined) : undefined}
            onChange={accordionContext ? handleChange : undefined}

            expandIcon={({ isActive }) => (
                <p style={{ color: theme.colors.backgroundText }}>{isActive ? <CaretRightOutlined /> : <CaretDownOutlined />}</p>
            )}

        >
            <Panel

                header={header}
                key={panelKey}
            >
                {children}
            </Panel>
        </Collapse>
    );
};
