import { Button, Col, Row } from "antd";
import { useLanguage } from "../../../../context/language";
import { CloseOutlined } from "@ant-design/icons";
import { useState } from "react";

interface ColorGroupPickerProps {
  onSelectColor: (color: string | null) => void;
}

export default function ColorGroupPicker({
  onSelectColor,
}: ColorGroupPickerProps) {
  const { labels } = useLanguage();
  const [hoveredColor, setHoveredColor] = useState<string | null>(null);
  let ColorLists: string[] = [
    "#ff9797",
    "#96b2f0",
    "#f7c985",
    "#8ae184",
    "#dc2127",
    "#5484ed",
    "#eaad47",
    "#51b749",
    "#93181c",
    "#233459",
    "#d8860e",
    "#40683d",
  ];

  return (
    <Row style={{ width: 200 }} gutter={5}>
      {ColorLists.map((color) => {
        return (
          <Col
            span={6}
            style={{
              backgroundColor: color,
              height: 30,
              width: 30,
              cursor: "pointer",
              transform: hoveredColor === color ? "scale(1.2)" : "scale(1)",
              transition: "all 0.2s ease-in-out",
              position: "relative",
              zIndex: hoveredColor === color ? 10 : 1,
            }}
            onClick={() => onSelectColor(color)}
            onMouseEnter={() => setHoveredColor(color)}
            onMouseLeave={() => setHoveredColor(null)}
          ></Col>
        );
      })}
      <Col span={24}>
        <Button
          type="text"
          style={{ width: "100%", marginTop: 10 }}
          onClick={() => onSelectColor(null)}
        >
          <CloseOutlined />
          {labels.btn.clear}
        </Button>
      </Col>
    </Row>
  );
}
