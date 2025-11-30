import {
  Button,
  Col,
  Modal,
  Typography,
  Upload,
  UploadProps,
  message,
} from "antd";
import {
  CloseOutlined,
  CloudUploadOutlined,
  EditFilled,
  PlusOutlined,
} from "@ant-design/icons";
import { useLanguage } from "../../../../context/language";
import { CSSProperties, useEffect, useState } from "react";
import { StampItemType } from "@/components/services/stamps/type";
import {
  createNewOrgStamp,
  updateAStamp,
} from "@/components/services/stamps/service";
import { HttpStatus } from "../../../../components/functional/httphelper";
import { useTheme } from "../../../../context/theme";
import { MaterialInput } from "../../../../components/ui/material-input";
import { OrgUnitType } from "../../../../components/services/organization-units/type";
import SelectOU from "@/components/shared/select-org-units";
import useGetAllOU from "@/store/orgs/use-get-all-ou";

interface AddEditStampModalProps {
  visible: boolean;
  onClose: () => void;
  orgUnits: OrgUnitType[];
  existingStamps: StampItemType[];
  activateLoader: (loading: boolean) => void;
  refreshPage: () => void;
  stamp?: StampItemType;
  resetSelections?: () => void;
}

export default function AddEditStampModal({
  onClose,
  visible,
  existingStamps,
  activateLoader,
  refreshPage,
  stamp,
  resetSelections,
}: AddEditStampModalProps) {
  const { labels, isEnglish } = useLanguage();
  const { theme } = useTheme();
  const [selectedFile, setSelectedFile] = useState<File>();
  const [fileName, setFileName] = useState<string>("");
  const [orgUnitCode, setOrgUnitCode] = useState<number>();
  const [error, setError] = useState<boolean>(false);
  const [fileList, setFileList] = useState<any[]>([]);
  const [description, setDescription] = useState<string>("");
  const { orgUnits } = useGetAllOU();

  useEffect(() => {
    if (stamp) {
      // setOrgUnitCode(stamp.organizationUnitCode ?? "");
      let contentName = stamp.Description + ".png";
      setFileList([{ uid: "-1", name: contentName, status: "done" }]);
      setFileName(stamp.Description);
      setDescription(stamp.Description);
    }
  }, [stamp]);

  const props: UploadProps = {
    beforeUpload: (file) => {
      setSelectedFile(file as File);
      setFileList([{ uid: "-1", name: file.name, status: "done" }]);
      return false;
    },
    fileList,
    type: "select",
    showUploadList: true,
    maxCount: 1,
    accept: "image/png",
    onRemove: () => {
      setSelectedFile(undefined);
      setFileList([]);
    },
  };

  const validateTheOrgUnit = (code?: number) => {
    let existingOnes: StampItemType[] = [];

    if (stamp) {
      existingOnes = existingStamps.filter(
        (val) => val.EntityID !== stamp.EntityID
      );
    }

    const find = existingOnes.find((val) => val.EntityID === code);

    if (find) {
      setError(true);
    } else {
      setError(false);
    }
  };

  const findOUUsingCode = (id: number) => {
    let ou = orgUnits.find((orgUnit) => orgUnit.id === id);

    return ou;
  };

  const uploadANewStamp = async () => {
    try {
      activateLoader(true);
      if (!selectedFile && orgUnitCode === undefined && !error) {
        return;
      }

      const formData = new FormData();
      formData.append("file", selectedFile as Blob);
      formData.append("is_general", "false");
      formData.append("entity_id", orgUnitCode?.toString() ?? "");
      if (orgUnitCode) {
        formData.append(
          "description",
          "Stamp " + `${findOUUsingCode(orgUnitCode)?.name_en ?? ""}`
        );
      }

      await createNewStamp(formData);
    } catch (error) {
      message.error(
        isEnglish
          ? "Something went wrong! Please contact your system administrator"
          : "حدث خطأ ما، يرجى الاتصال بمسؤول النظام"
      );
    } finally {
      resetSelections && resetSelections();
      onClose();
      activateLoader(false);
    }
  };

  const createNewStamp = async (payload: FormData) => {
    try {
      const response = await createNewOrgStamp(payload);

      if (response.status === HttpStatus.SUCCESS) {
        refreshPage();
        message.success(
          isEnglish
            ? "Successfully Created"
            : "حدث خطأ ما، يرجى الاتصال بمسؤول النظام"
        );
      } else {
        message.error(
          isEnglish
            ? "Something went wrong! Please try again"
            : "حدث خطأ ما، يرجى الاتصال بمسؤول النظام"
        );
      }
    } catch (error) {
      message.error(
        isEnglish
          ? "Something went wrong! Please contact your system administrator"
          : "حدث خطأ ما، يرجى الاتصال بمسؤول النظام"
      );
    }
  };

  const checkButtonVisibility = (): boolean => {
    if (stamp) {
      return !(fileName !== "" && description !== "" && error === false);
    }
    return !(selectedFile !== undefined && orgUnitCode && error === false);
  };

  const iconStyle: CSSProperties = {
    marginLeft: isEnglish ? 0 : 10,
    marginRight: isEnglish ? 10 : 0,
  };

  const updateExistingStamp = async () => {
    if (!stamp) return;

    try {
      activateLoader(true);
      if (selectedFile) {
        const formData = new FormData();
        formData.append("file", selectedFile as Blob);

        const response = await updateAStamp(formData, stamp.ID);

        if (response.status === HttpStatus.SUCCESS) {
          refreshPage();
          message.success(
            isEnglish ? "Successfully updated" : "تم التحديث بنجاح"
          );
        } else {
          message.error(
            isEnglish
              ? "Something went wrong! Please contact your system administrator"
              : "حدث خطأ ما، يرجى الاتصال بمسؤول النظام"
          );
        }
      }
    } catch (error) {
      message.error(
        isEnglish
          ? "Something went wrong! Please contact your system administrator"
          : "حدث خطأ ما، يرجى الاتصال بمسؤول النظام"
      );
    } finally {
      activateLoader(false);
      onClose();
      resetSelections && resetSelections();
    }
  };

  return (
    <Modal
      open={visible}
      onCancel={onClose}
      onClose={onClose}
      title={"Add Stamp"}
      centered
      footer={<></>}
      width={500}
      zIndex={10}
    >
      {stamp ? (
        <MaterialInput
          label={labels.tbl.description}
          value={description}
          onChange={(e: any) => setDescription(e.target.value)}
          error={
            description.length === 0
              ? isEnglish
                ? "The field is required"
                : "الحقل مطلوب"
              : description.length < 5
              ? isEnglish
                ? "This field required minimum length of 5"
                : "يتطلب هذا الحقل الحد الأدنى للطول 5"
              : ""
          }
        />
      ) : (
        <SelectOU
          multiSelect={false}
          label={labels.lbl.org_unit}
          value={orgUnitCode ? [orgUnitCode] : []}
          onChange={(units) => {
            if (Array.isArray(units)) {
              setOrgUnitCode(units[0]);
              validateTheOrgUnit(units[0]);
            } else if (units) {
              setOrgUnitCode(units);
              validateTheOrgUnit(units);
            } else {
              setOrgUnitCode(undefined);
              setError(true);
            }
          }}
        />
      )}
      {error && (
        <Typography style={{ color: theme.colors.danger }}>
          {labels.msg.stamp_orgunit_duplicated}
        </Typography>
      )}

      <Upload {...props}>
        <Button type="primary" style={{ marginTop: 30 }}>
          <CloudUploadOutlined style={iconStyle} />
          {labels.btn.upload_template}
        </Button>
      </Upload>

      <Col span={24} style={{ display: "flex", justifyContent: "flex-end" }}>
        <Button type="text" style={{ marginTop: 30 }} onClick={onClose}>
          <CloseOutlined style={iconStyle} />
          {labels.btn.cancel}
        </Button>
        <Button
          type="primary"
          style={{ marginTop: 30 }}
          disabled={checkButtonVisibility()}
          onClick={() => (stamp ? updateExistingStamp() : uploadANewStamp())}
        >
          {stamp ? (
            <EditFilled style={iconStyle} />
          ) : (
            <PlusOutlined style={iconStyle} />
          )}
          {stamp ? labels.btn.edit : labels.btn.create}
        </Button>
      </Col>
    </Modal>
  );
}
