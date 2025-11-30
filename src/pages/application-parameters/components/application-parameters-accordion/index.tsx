import { Accordion } from '../../../../components/ui/accordions/accordion';
import { ReactNode } from 'react';
import { useTheme } from '../../../../context/theme';

interface Props {
    icon?: ReactNode,
    title?: string,
    children?: ReactNode
}

export default function ApplicationParametersAccordion({ children, icon, title }: Props) {

    const { theme } = useTheme()

    const Header = ({ title }: { title?: string }) => (
        <div style={{ display: "flex", alignItems: "center", gap: "8px", color: theme.colors.backgroundText }}>
            {icon && <span>{icon}</span>}
            <span>{title}</span>
        </div>
    )
    return (
        <>
            <Accordion header={<Header title={title} />} panelKey='' icon={icon}
                collapseContainerStyleProps={{ backgroundColor: theme.colors.primary }}
            >
                <>{children}</>
            </Accordion>
            <br />
        </>
    )
}
