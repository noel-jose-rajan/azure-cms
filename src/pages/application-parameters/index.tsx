import { useEffect, useMemo, useState } from "react";
import {
    BellOutlined,
    DesktopOutlined,
    ForkOutlined,
    LoginOutlined,
    LogoutOutlined,
    MailOutlined,
    PaperClipOutlined,
    ScheduleOutlined,
    SearchOutlined,
} from "@ant-design/icons";
import { message } from "antd";
import TitleBar from "../../components/ui/bar/title-bar";
import ApplicationParametersAccordion from "./components/application-parameters-accordion";
import { useLanguage } from "../../context/language";
import { LANGUAGE } from "../../constants/language";
import { englishLabels } from "../../constants/app-constants/en";
import { arabicLabels } from "../../constants/app-constants/ar";
import GenerateCorrespondenceSequenceNumberBasedOnSchema from "./components/options/generate-correspondence-sequence-number-based-on-schema";
import ApplicationParametersControls from "./components/application-parameters-controls";
import GenerateCorrespondenceNumberTiming from "./components/options/generate-correspondence-number-timing";
import ValuesRelatedtoOutboundWorkflow from "./components/options/values-related-to-outbound-workflow";
import ValuesRelatedToInboundWorkflow from "./components/options/values-related-to-inbound-workflow";
import ValuesRelatedToAdhocWorkflow from "./components/options/values-related-to-adhoc-workflow";
import Inbox from "./components/options/inbox";
import Attachments from "./components/options/attachments";
import Search from "./components/options/search";
import ApplicationNotifications from "./components/options/application-notifications";
import WebApplicationSettings from "./components/options/web-application-settings";
import ExternalApplications from "./components/options/external-applications";
import ManageUrgencyNotifications from "./components/manage-urgency-notifications";
import { getAllAppParameters, updateApplicationParameters } from "../../components/services/application-parameters";
import { HttpStatus } from "../../components/functional/httphelper";


export default function ApplicationParameters() {
    const { language } = useLanguage();
    const label = useMemo(() => (language === LANGUAGE.ENGLISH_INT ? englishLabels : arabicLabels), [language]);

    const [applicationParameters, setApplicationParameters] = useState<Record<string, any>>({});
    const [originalParameters, setOriginalParameters] = useState<Record<string, any>>({});
    const [isModified, setIsModified] = useState(false);
    const [loading, setLoading] = useState(false);
    const [reload, setReload] = useState(0);

    const [params, setParams] = useState({});
    const [errors, setErrors] = useState<Record<string, string>>({
        WebappVersion: "",
        NotificationCleanerDays: "",
        AttachmentSize: "",
    });

    const showMessage = (type: "success" | "error", messageText: string) => {
        const translatedMessage = language === LANGUAGE.ENGLISH_INT ? messageText : messageText;
        message[type](translatedMessage);
    };

    const validateParameter = (key: string, value: any) => {

        setErrors(() => ({
            WebappVersion: "",
            NotificationCleanerDays: "",
            AttachmentSize: "",
        }))
        try {
            switch (key) {
                case "WebappVersion":
                    if (typeof parseInt(value) !== "number" || value < 0)
                        throw new Error("Web Version can't be less then 0");
                    break;
                case "NotificationCleanerDays":
                    if (typeof parseInt(value) !== "number" || value >= 366 || value < 1)
                        throw new Error("Max period for keeping the notification is 365.");
                    break;
                case "AttachmentSize":
                    if (typeof parseInt(value) !== "number" || value < 0)
                        throw new Error("Attachment Size is required.");
                    if (typeof parseInt(value) !== "number" || value >= 201)
                        throw new Error("Attachment Size should be less than 200MB.");

                    break;
                default:
                    break;
            }
            setErrors((prev) => ({ ...prev, [key]: "" })); // Clear error if valid
        } catch (error: any) {
            setErrors((prev) => ({
                ...prev,
                [key]: error.message, // Use specific error message
            }));
        }
    };


    useEffect(() => {
        const fetchParameters = async () => {
            setLoading(true);
            try {
                const response = await getAllAppParameters();

                if (response.status === HttpStatus.SUCCESS && response.data) {
                    if (response.data.Data) {
                        const params = response.data.Data
                        if (Array.isArray(params)) {
                            const data = params.reduce((acc, { param_key, param_value }) => ({ ...acc, [param_key]: param_value }), {});
                            setApplicationParameters(data);
                            setOriginalParameters(data);
                        }
                    }
                }
        
            } catch (error) {
                showMessage("error", "Error fetching application parameters.");
            } finally {
                setLoading(false);
            }
        };

        fetchParameters();
    }, [reload]);

    const handleParameterChange = ({ key, value }: { key: string; value: any }) => {
        setApplicationParameters((prev) => {
            const updatedParameters = { ...prev, [key]: value };
            setIsModified(JSON.stringify(updatedParameters) !== JSON.stringify(originalParameters));
            return updatedParameters;
        });
        setParams((prev) => ({ ...prev, [key]: value }));

        if (["WebappVersion", "NotificationCleanerDays", "AttachmentSize"].includes(key)) {
            validateParameter(key, value);
        }
    };

    const resetParameters = () => {
        setApplicationParameters(originalParameters);
        setParams(() => ({}));
        setIsModified(false);
        setErrors({
            WebappVersion: "",
            NotificationCleanerDays: "",
            AttachmentSize: "",
        });
    };

    const handleOnSave = async () => {
        // Check for any remaining errors
        if (Object.values(errors).some((error) => error)) {
            showMessage(
                "error",
                language === LANGUAGE.ENGLISH_INT
                    ? "Please fix the errors before saving."
                    : "يرجى تصحيح الأخطاء قبل الحفظ."
            );
            return;
        }

        const updates = Object.entries(params).map(([key, value]) => ({ param_key: key, param_value: `${value}` }));
        setLoading(true);
        try {
            const response = await updateApplicationParameters(updates);
            if (response.status === HttpStatus.SUCCESS) {
                showMessage("success", "Parameters updated successfully.");
                setReload((val) => val + 1);
            } else {
                showMessage("error", "Error saving application parameters.");
            }
        } catch (error) {
            showMessage("error", "Error saving application parameters.");
        } finally {
            setLoading(false);
            resetParameters();
        }
    };

    if (loading) return <div>{language === LANGUAGE.ENGLISH_INT ? "Loading..." : "جاري التحميل..."}</div>;

    return (
        <>
            <TitleBar
                title={{
                    ar: "معلمات التطبيق",
                    en: "Application Parameters",
                }}
            />
            <br />
            <ApplicationParametersControls
                isReset={isModified}
                isSave={isModified}
                onReset={resetParameters}
                onSave={handleOnSave}
            />
            <ApplicationParametersAccordion title={label.til.gen_corr_num_schema} icon={<ScheduleOutlined />}>
                <GenerateCorrespondenceSequenceNumberBasedOnSchema
                    GenCorrSeqNumBasedOnSchemaAnnounce={applicationParameters.GenCorrSeqNumBasedOnSchemaAnnounce}
                    GenCorrSeqNumBasedOnSchemaInbound={applicationParameters.GenCorrSeqNumBasedOnSchemaInbound}
                    GenCorrSeqNumBasedOnSchemaInternal={applicationParameters.GenCorrSeqNumBasedOnSchemaInternal}
                    GenCorrSeqNumBasedOnSchemaOutbound={applicationParameters.GenCorrSeqNumBasedOnSchemaOutbound}
                    onChange={handleParameterChange}
                />
            </ApplicationParametersAccordion>

            <ApplicationParametersAccordion title={label.til.param_generate_corres_num_timing} icon={<ScheduleOutlined />} >
                <GenerateCorrespondenceNumberTiming

                    GenInboundCorrNumonUnitAcquisition={applicationParameters.GenInboundCorrNumonUnitAcquisition}
                    GenOutboundInternalCorrNumOnApproval={applicationParameters.GenOutboundInternalCorrNumOnApproval}
                    onChange={handleParameterChange}
                />
            </ApplicationParametersAccordion>
            <ApplicationParametersAccordion title={label.til.param_related_outbound_workflow} icon={<LogoutOutlined />} >
                <ValuesRelatedtoOutboundWorkflow

                    OutboundMultipleReceivingEnabled={applicationParameters.OutboundMultipleReceivingEnabled}
                    OutboundSenderbasedonFinalApproval={applicationParameters.OutboundSenderbasedonFinalApproval}
                    ShowOutboundCorrespondenceDate={applicationParameters.ShowOutboundCorrespondenceDate}

                    onChange={handleParameterChange} />
            </ApplicationParametersAccordion>
            <ApplicationParametersAccordion title={label.til.param_related_inbound_workflow} icon={<LoginOutlined />} >
                <ValuesRelatedToInboundWorkflow

                    GrantReadAccessToInboundIssuersGroup={applicationParameters.GrantReadAccessToInboundIssuersGroup}
                    InboundCCEmailOption={applicationParameters.InboundCCEmailOption}
                    InboundFyiEmailOption={applicationParameters.InboundFyiEmailOption}
                    onChange={handleParameterChange}

                />
            </ApplicationParametersAccordion>
            <ApplicationParametersAccordion title={label.til.param_related_adhoc_workflow} icon={<ForkOutlined />} >
                <ValuesRelatedToAdhocWorkflow
                    AdhocEnabled={applicationParameters.AdhocEnabled}
                    AdhocSendToAll={applicationParameters.AdhocSendToAll}
                    onChange={handleParameterChange}
                />
            </ApplicationParametersAccordion>
            <ApplicationParametersAccordion title={label.til.param_inbox} icon={<MailOutlined />} >
                <Inbox
                    MakeTaskActionFromInbox={applicationParameters.MakeTaskActionFromInbox}
                    onChange={handleParameterChange}
                />
            </ApplicationParametersAccordion>



            <ApplicationParametersAccordion title={label.til.attachments} icon={<PaperClipOutlined />} >
                <div>
                    <Attachments
                        AttachmentSize={applicationParameters.AttachmentSize}
                        onChange={handleParameterChange}
                    />
                    {errors.AttachmentSize && (
                        <div style={{ color: "red", fontSize: "small" }}>{errors.AttachmentSize}</div>
                    )}
                </div>
            </ApplicationParametersAccordion>

            <ApplicationParametersAccordion title={label.til.externalApplications} icon={<DesktopOutlined />} >
                <ExternalApplications
                    DigitalSignatureMandatory={applicationParameters.DigitalSignatureMandatory}
                    DigitalSignatureType={applicationParameters.DigitalSignatureType}
                    EnableOnlineEditor={applicationParameters.EnableOnlineEditor}
                    InboundOCREnabled={applicationParameters.InboundOCREnabled}
                    SkipPdfConverter={applicationParameters.SkipPdfConverter}
                    TwoFactorAuthenticationEnabled={applicationParameters.TwoFactorAuthenticationEnabled}
                    onChange={handleParameterChange}
                />
            </ApplicationParametersAccordion>

            <ApplicationParametersAccordion title={label.til.search} icon={<SearchOutlined />} >
                <Search ContentSearchEnabled={applicationParameters.ContentSearchEnabled} onChange={handleParameterChange} />
            </ApplicationParametersAccordion>

            <ApplicationParametersAccordion title={label.til.app_notifications} icon={<BellOutlined />} >
                <div>
                    <ApplicationNotifications
                        NotificationCleanerDays={applicationParameters.NotificationCleanerDays}
                        onChange={handleParameterChange}
                    />
                    {errors.NotificationCleanerDays && (
                        <div style={{ color: "red", fontSize: "small" }}>{errors.NotificationCleanerDays}</div>
                    )}
                </div>
            </ApplicationParametersAccordion>

            <ApplicationParametersAccordion title={label.til.param_webapp_setting} icon={<BellOutlined />} >
                <div>
                    <WebApplicationSettings
                        WebappVersion={applicationParameters.WebappVersion}
                        onChange={handleParameterChange}
                    />
                    {errors.WebappVersion && (
                        <div style={{ color: "red", fontSize: "small" }}>{errors.WebappVersion}</div>
                    )}
                </div>
            </ApplicationParametersAccordion>



            <br />
            <ApplicationParametersControls
                isReset={isModified}
                isSave={isModified}
                onReset={resetParameters}
                onSave={handleOnSave}
            />

            <ManageUrgencyNotifications />

        </>
    );
}
