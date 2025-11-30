import {
  CSSProperties,
  ReactElement,
  cloneElement,
  useState,
} from "react";
import { useTheme } from "../../../../context/theme";
import { Col } from "antd";

interface TabItemProps {
  icon: ReactElement;
  label: ReactElement;
  badge?: ReactElement;
  selected: boolean;
  style?: CSSProperties;
  onSelect?: () => void;
}

export default function CustomTabItem({
  icon,
  label,
  badge,
  selected,
  onSelect,
}: TabItemProps) {
  const [hoverd, setHovered] = useState<boolean>(true);
  const { theme } = useTheme();
  return (
    <Col
      onClick={onSelect}
      style={{
        padding: 10,
        height: 45,
        // ...style,
        backgroundColor: selected ? theme.colors.primary : "inherit",
      }}
      onMouseEnter={(e) => {
        if (selected) return;
        e.currentTarget.style.backgroundColor = theme.colors.primary;
        setHovered(true);
      }}
      onMouseLeave={(e) => {
        if (selected) return;
        e.currentTarget.style.backgroundColor = "inherit";
        setHovered(false);
      }}
    >
      {cloneElement(icon, {
        style: {
          color: hoverd ? "#fff" : theme.colors.primary,
        },
      })}
      {cloneElement(label, {
        style: {
          color: hoverd ? "#fff" : theme.colors.primary,
        },
      })}
      {badge}
    </Col>
  );
}
