import { InfoCircleOutlined, PlusCircleOutlined } from "@ant-design/icons";
import { Tabs } from "antd";
import TabPane from "antd/es/tabs/TabPane";
import { useState } from "react";
import { Control, UseFormSetValue } from "react-hook-form";
import { CorrespondenceType } from "../../types";
import { useLanguage } from "../../../../context/language";
import { useTheme } from "../../../../context/theme";
import MoreInfo from "./components/more-info";
import BasicInfo from "./components/basic-info";

interface CorrespondenceInfoProps {
  control: Control<CorrespondenceType>;
  setValue: UseFormSetValue<CorrespondenceType>;
}

export default function CorrespondenceInfo({
  control,
  setValue,
}: CorrespondenceInfoProps) {
  const { labels } = useLanguage();
  const {
    theme: {
      colors: { backgroundText, primary },
    },
  } = useTheme();

  const [activeKey, setActiveKey] = useState<string>("basic");

  const tabStyle = (key: string) => ({
    padding: "8px 16px",
    backgroundColor: activeKey === key ? primary : "unset",
    color: activeKey === key ? backgroundText : "inherit",
    display: "flex",
    alignItems: "center",
    borderRadius: "5px",
  });

  const renderTab = (icon: any, text: string, key: string) => (
    <span style={tabStyle(key)}>
      {icon}
      <span style={{ marginLeft: 8 }}>{text}</span>
    </span>
  );

  return (
    <Tabs
      defaultActiveKey={activeKey}
      onChange={(key) => {
        setActiveKey(key);
      }}
      style={{ padding: "5px 10px" }}
    >
      <TabPane
        tab={renderTab(<InfoCircleOutlined />, labels.til.basic_info, "basic")}
        key="basic"
        children={<BasicInfo control={control} setValue={setValue} />}
        style={{ overflow: "auto" }}
      />
      <TabPane
        tab={renderTab(<PlusCircleOutlined />, labels.til.more_info, "more")}
        key="more"
        children={<MoreInfo control={control} />}
        style={{ overflow: "auto" }}
      />
    </Tabs>
  );
}
