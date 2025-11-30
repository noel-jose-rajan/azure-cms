import { FilterFilled, SaveFilled } from "@ant-design/icons";
import TitleBar from "../../components/ui/bar/title-bar";
import TitleHeader from "../../components/ui/header";
import { useLanguage } from "../../context/language";
import { Button, Col, Radio, RadioChangeEvent, Row, message } from "antd";
import { useTheme } from "../../context/theme";
import GeneralStamps from "./components/general-stamps";
import OrgUnitStamps from "./components/org-unit-stamps";
import { useEffect, useState } from "react";
import LoaderComponent from "../../components/ui/loader";
import { getAllStamps } from "@/components/services/stamps/service";
import { StampItemType } from "@/components/services/stamps/type";
import { HttpStatus } from "../../components/functional/httphelper";
import {
  getAllAppParameters,
  updateApplicationParameters,
} from "@/components/services/application-parameters";
import { AppParameterType } from "@/components/services/application-parameters/type";

export default function StampManagementPage() {
  const { labels, isEnglish } = useLanguage();
  const { theme } = useTheme();
  const [loading, setLoading] = useState<boolean>(false);
  const [stamps, setStamps] = useState<StampItemType[]>([]);
  const [stampSettings, setStampSettings] = useState<{
    StampSenderbasedonFinalApproval: "TRUE" | "FALSE";
    GeneralStampOnly: "TRUE" | "FALSE";
  }>({
    StampSenderbasedonFinalApproval: "FALSE",
    GeneralStampOnly: "FALSE",
  });

  const [stampSettingsOg, setStampSettingsOg] = useState<AppParameterType[]>(
    []
  );

  useEffect(() => {
    init();
  }, []);

  const init = async () => {
    setLoading(true);
    fetchAllStamps();
    getStampSettings();
    setLoading(false);
  };

  const getStampSettings = async () => {
    const response = await getAllAppParameters();

    if (response.status === HttpStatus.SUCCESS) {
      const clonedSettings = { ...stampSettings };
      response.data?.Data.map((item) => {
        if (item.param_key === "StampSenderbasedonFinalApproval") {
          clonedSettings.StampSenderbasedonFinalApproval =
            item.param_value === "TRUE" ? "TRUE" : "FALSE";
        } else if (item.param_key === "GeneralStampOnly") {
          clonedSettings.GeneralStampOnly =
            item.param_value === "TRUE" ? "TRUE" : "FALSE";
        }
      });
      setStampSettings(clonedSettings);
      setStampSettingsOg(response.data?.Data ? response.data.Data : []);
    }
  };

  const fetchAllStamps = async () => {
    const response = await getAllStamps();

    if (response.status === HttpStatus.SUCCESS && response.data) {
      setStamps(response.data);
    } else if (response.status === HttpStatus.NOTFOUND) {
      setStamps([]);
    } else {
      message.error(
        isEnglish
          ? "Something went wrong! Please contact your system administrator"
          : "حدث خطأ ما، يرجى الاتصال بمسؤول النظام"
      );
    }
  };

  const onSaveSettingsChanges = async () => {
    setLoading(true);

    let general = stampSettingsOg.find(
      (ap) => ap.param_key === "GeneralStampOnly"
    );

    let finalApproval = stampSettingsOg.find(
      (ap) => ap.param_key === "StampSenderbasedonFinalApproval"
    );

    if (general?.param_value !== stampSettings.GeneralStampOnly) {
      let payLoad: AppParameterType = {
        param_key: "GeneralStampOnly",
        param_value: stampSettings.GeneralStampOnly,
      };

      await updateAppParameter(payLoad);
    }

    if (
      finalApproval?.param_value !==
      stampSettings.StampSenderbasedonFinalApproval
    ) {
      let payLoad: AppParameterType = {
        param_key: "StampSenderbasedonFinalApproval",
        param_value: stampSettings.StampSenderbasedonFinalApproval,
      };

      await updateAppParameter(payLoad);
    }

    setLoading(false);
  };

  const updateAppParameter = async (payLoad: AppParameterType) => {
    const response = await updateApplicationParameters([payLoad]);

    if (response.status === HttpStatus.SUCCESS) {
      message.success(isEnglish ? "Successfully updated" : "تم التحديث بنجاح");
      setStampSettingsOg((prev) =>
        prev.map((item) =>
          item.param_key === payLoad.param_key ? payLoad : item
        )
      );
    } else {
      message.error(
        isEnglish
          ? "Something went wrong! Please contact your system administrator"
          : "حدث خطأ ما، يرجى الاتصال بمسؤول النظام"
      );
    }
  };

  return (
    <>
      <TitleBar headerText={labels.mnu.stamps} />
      <TitleHeader
        heading={labels.til.settings}
        icon={<FilterFilled style={{ color: "#fff" }} />}
      />
      <Row gutter={16}>
        <Col span={12} sm={24} md={24} lg={12} style={{ padding: "10px 20px" }}>
          <label
            style={{
              marginTop: 10,
              marginBottom: 20,
              color: theme.colors.primary,
              textAlign: isEnglish ? "start" : "end",
              width: "100%",
              display: "block",
            }}
          >
            {labels.lbl.appParam_GeneralStampOnly}
          </label>
          <Radio.Group
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 8,
              marginTop: 10,
            }}
            onChange={(e: RadioChangeEvent) => {
              const clonedValues = { ...stampSettings };
              clonedValues.GeneralStampOnly = e.target.value;
              setStampSettings(clonedValues);
            }}
            value={stampSettings.GeneralStampOnly}
            options={[
              {
                value: "TRUE",
                label: labels.lbl.appParam_GeneralStampOnly_True,
              },
              {
                value: "FALSE",
                label: labels.lbl.appParam_GeneralStampOnly_False,
              },
            ]}
          />
        </Col>
        <Col span={12} sm={24} md={24} lg={12} style={{ padding: "10px 20px" }}>
          <label
            style={{
              marginTop: 10,
              marginBottom: 20,
              color: theme.colors.primary,
              textAlign: isEnglish ? "start" : "end",
              width: "100%",
              display: "block",
            }}
          >
            {labels.lbl.appParam_StampSenderbasedonFinalApproval}
          </label>
          <Radio.Group
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 8,
              marginTop: 10,
            }}
            onChange={(e: RadioChangeEvent) => {
              const clonedValues = { ...stampSettings };
              clonedValues.StampSenderbasedonFinalApproval = e.target.value;
              setStampSettings(clonedValues);
            }}
            value={stampSettings.StampSenderbasedonFinalApproval}
            options={[
              {
                value: "TRUE",
                label: labels.lbl.appParam_StampSenderbasedonFinalApproval_True,
              },
              {
                value: "FALSE",
                label:
                  labels.lbl.appParam_StampSenderbasedonFinalApproval_False,
              },
            ]}
          />
        </Col>
        <Col
          span={24}
          style={{
            display: "flex",
            justifyContent: "flex-end",
            padding: 20,
          }}
        >
          <Button type="primary" onClick={onSaveSettingsChanges}>
            <SaveFilled />
            {labels.btn.save}
          </Button>
        </Col>
      </Row>
      {stampSettings.GeneralStampOnly === "FALSE" && (
        <GeneralStamps
          stamps={stamps.filter((st) => st.IsGeneral)}
          activateLoader={setLoading}
          refreshPage={init}
        />
      )}
      <br />
      <OrgUnitStamps
        stamps={stamps.filter((st) => st.IsGeneral === false)}
        activateLoader={setLoading}
        allStamps={stamps}
        updateStamps={setStamps}
        refreshPage={init}
      />
      {loading && <LoaderComponent loading={loading} />}
    </>
  );
}
