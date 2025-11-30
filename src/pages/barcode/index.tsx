import { useMemo } from "react";
import TitleBar from "../../components/ui/bar/title-bar";
import { useLanguage } from "../../context/language";
import { LANGUAGE } from "../../constants/language";
import { englishLabels } from "../../constants/app-constants/en";
import { arabicLabels } from "../../constants/app-constants/ar";
import TitleHeader from "../../components/ui/header";
import {
  PrinterOutlined,
  SwapOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import { useTheme } from "../../context/theme";
import SingleBarCodeGenerator from "./components/single-barcode-generator";
import { Col } from "antd";
import MultiBarCodeGenerator from "./components/multi-barcode-generator";
import ResetBarCode from "./components/reset-barcode";

export default function Barcode() {
  //context
  const { language } = useLanguage();
  const { theme } = useTheme();

  //Calculated data
  const { mnu, til } = useMemo(
    () => (language === LANGUAGE.ENGLISH_INT ? englishLabels : arabicLabels),
    [language]
  );

  return (
    <>
      <TitleBar headerText={mnu.barcode} />
      <Col>
        <TitleHeader
          heading={til.print_specific_barcode}
          icon={
            <PrinterOutlined style={{ color: theme.colors.backgroundText }} />
          }
        />
        <SingleBarCodeGenerator />
      </Col>

      <Col>
        <TitleHeader
          heading={til.print_range_barcode}
          icon={<SwapOutlined style={{ color: theme.colors.backgroundText }} />}
        />
        <MultiBarCodeGenerator />
      </Col>

      <Col>
        <TitleHeader
          heading={til.reset_barcode}
          icon={
            <ReloadOutlined style={{ color: theme.colors.backgroundText }} />
          }
        />
        <ResetBarCode />
      </Col>
    </>
  );
}
