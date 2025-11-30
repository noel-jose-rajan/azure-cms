import { FilterFilled, SearchOutlined, UndoOutlined } from "@ant-design/icons";
import { Card, Row, Col, Button } from "antd";
import { CSSProperties, useState } from "react";
import { useLanguage } from "../../../../context/language";
import { useTheme } from "../../../../context/theme";
import { englishLabels } from "../../../../constants/app-constants/en";
import { arabicLabels } from "../../../../constants/app-constants/ar";
import TitleHeader from "../../../../components/ui/header";
import { MaterialInput } from "../../../../components/ui/material-input";
import { SearchGroupsType } from "@/components/services/announcement-groups/type";

interface Props {
  handleReset: () => any;
  value: SearchGroupsType;
  updateSearch: (data: SearchGroupsType) => any;
}

export default function SearchBar({ handleReset, value, updateSearch }: Props) {
  //context
  const { isEnglish } = useLanguage();
  const {
    theme: { colors },
  } = useTheme();

  //computed
  const { btn, til, lbl } = isEnglish ? englishLabels : arabicLabels;

  return (
    <>
      <TitleHeader
        heading={til.search_criteria}
        icon={<FilterFilled style={{ color: colors.backgroundText }} />}
      />
      <br />
      <Row gutter={20} style={{ marginBottom: 20 }}>
        <Col xs={24} sm={24} md={12} lg={7} xl={7}>
          <MaterialInput
            applyReverse
            label={lbl.announce_grp_name}
            value={value.name_en}
            enableTranscript
            onChange={(e: any) =>
              updateSearch({ ...value, name_en: e.target.value })
            }
            style={{ marginTop: 15 }}
          />
        </Col>
        <Col xs={24} sm={24} md={12} lg={7} xl={7}>
          <MaterialInput
            applyReverse
            label={lbl.announce_grp_code}
            value={value.entity_code}
            onChange={(e: any) =>
              updateSearch({ ...value, entity_code: e.target.value })
            }
            style={{ marginTop: 15 }}
          />
        </Col>
        <Col xs={24} sm={24} md={12} lg={7} xl={7}>
          <MaterialInput
            applyReverse
            label={lbl.announce_grp_email}
            value={value.email}
            onChange={(e: any) =>
              updateSearch({ ...value, email: e.target.value })
            }
            style={{ marginTop: 15 }}
          />
        </Col>
        <Col xs={24} sm={24} md={12} lg={3} xl={3} style={styles.buttonWrapper}>
          <Button
            type="link"
            size="small"
            onClick={handleReset}
            style={{ marginRight: 10 }}
          >
            <UndoOutlined /> {btn.reset}
          </Button>
        </Col>
      </Row>
    </>
  );
}

const styles: { [x: string]: CSSProperties } = {
  buttonWrapper: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    marginTop: 20,
  },
};
