import { Col, Row } from "antd";
import { ReactElement, cloneElement, useState } from "react";
import { RightCircleFilled } from "@ant-design/icons";

interface ExtensiveWrapperProps {
  child1: ReactElement;
  child2: ReactElement;
  child3: ReactElement;
}

export default function ExtensiveWrapper({
  child1,
  child2,
  child3,
}: ExtensiveWrapperProps) {
  const [expandValues, setExpandValues] = useState<{
    span1: number;
    span2: number;
    span3: number;
  }>({
    span1: 7,
    span2: 8,
    span3: 7,
  });

  const expand1 = () => {
    const clonedValues = { ...expandValues };

    if (expandValues.span2 === 8 && expandValues.span3 === 7) {
      clonedValues.span1 = 23;
      clonedValues.span2 = 11;
      clonedValues.span3 = 11;
    } else if (expandValues.span2 === 23 && expandValues.span3 === 23) {
      clonedValues.span1 = 7;
      clonedValues.span2 = 8;
      clonedValues.span3 = 7;
    } else {
      clonedValues.span1 = 23;
      clonedValues.span2 = 23;
      clonedValues.span3 = 23;
    }

    setExpandValues(clonedValues);
  };

  const expand2 = () => {
    const clonedValues = { ...expandValues };

    if (expandValues.span1 === 7 && expandValues.span3 === 7) {
      clonedValues.span1 = 23;
      clonedValues.span2 = 23;
      clonedValues.span3 = 23;
    } else if (expandValues.span1 === 23 && expandValues.span3 === 23) {
      clonedValues.span1 = 7;
      clonedValues.span2 = 8;
      clonedValues.span3 = 7;
    } else {
      clonedValues.span1 = 23;
      clonedValues.span2 = 23;
      clonedValues.span3 = 23;
    }

    setExpandValues(clonedValues);
  };

  const expand3 = () => {
    const clonedValues = { ...expandValues };
    if (expandValues.span1 === 7 && expandValues.span2 === 8) {
      clonedValues.span1 = 11;
      clonedValues.span2 = 11;
      clonedValues.span3 = 23;
    } else if (expandValues.span1 === 11 && expandValues.span2 === 11) {
      clonedValues.span1 = 7;
      clonedValues.span2 = 8;
      clonedValues.span3 = 7;
    } else if (expandValues.span1 === 23 && expandValues.span2 === 23) {
      clonedValues.span1 = 7;
      clonedValues.span2 = 8;
      clonedValues.span3 = 7;
    } else {
      clonedValues.span1 = 23;
      clonedValues.span2 = 23;
      clonedValues.span3 = 23;
    }

    setExpandValues(clonedValues);
  };

  return (
    <Row
      gutter={0}
      style={{
        marginTop: 10,
        display: "flex",
        alignItems: "center",
      }}
    >
      <Col span={expandValues.span1} style={{}}>
        {cloneElement(child1, {
          showMore: true,
          showMoreClicked: () => expand1(),
        })}
      </Col>
      <Col
        span={1}
        style={{
          ...styles.iconWrapper,
        }}
      >
        <RightCircleFilled style={{ marginTop: 10 }} />
      </Col>
      <Col span={expandValues.span2}>
        {cloneElement(child2, {
          showMore: true,
          showMoreClicked: () => expand2(),
        })}
      </Col>
      <Col
        span={1}
        style={{
          ...styles.iconWrapper,
        }}
      >
        <RightCircleFilled style={{ marginTop: 10 }} />
      </Col>
      <Col span={expandValues.span3}>
        {cloneElement(child3, {
          showMore: true,
          showMoreClicked: () => expand3(),
        })}
      </Col>
    </Row>
  );
}

const styles = {
  iconWrapper: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
};
