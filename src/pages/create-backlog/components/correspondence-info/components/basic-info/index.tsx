import { Col, Form, message } from "antd";
import { MaterialInput } from "../../../../../../components/ui/material-input";
import ExternalEntitySearch from "../../../../../../components/ui/search/external-entity";
import OrgUnitSearchOption from "../../../../../../components/ui/search/ou-search-actions";
import { useEffect, useState } from "react";
import {
  MultiInitiatorRoleType,
  getMultiInitiatorRole,
} from "../../../../service";
import { HttpStatus } from "../../../../../../components/functional/httphelper";
import { useLanguage } from "../../../../../../context/language";
import { MaterialSelect } from "../../../../../../components/ui/dropdown/material-dropdown";
import { PickListItemType } from "../../../../../pick-lists/service";
import { PickListHelper } from "../../../../../../components/functional/picklists";
import {
  Control,
  Controller,
  UseFormSetValue,
  useWatch,
} from "react-hook-form";
import { CorrespondenceType } from "../../../../types";
import { TextField } from "@mui/material";
import { DateHelper } from "../../../../../../components/functional/date";
import moment from "moment";

interface CorrespondenceInfoProps {
  control: Control<CorrespondenceType>;
  setValue: UseFormSetValue<CorrespondenceType>;
}

export default function BasicInfo({
  control,
  setValue,
}: CorrespondenceInfoProps) {
  const { labels, isEnglish } = useLanguage();
  const [_, setInitiatorRole] = useState<MultiInitiatorRoleType>();
  const [docType, setDocType] = useState<PickListItemType[]>([]);
  const [urgencyLevels, setUrgencyLevels] = useState<PickListItemType[]>([]);
  const [securityLevels, setSecurityLevels] = useState<PickListItemType[]>([]);
  const [languages, setLanguages] = useState<PickListItemType[]>([]);
  const { correspondenceDTO } = useWatch({ control: control });

  useEffect(() => {
    init();
  }, []);

  useEffect(() => {
    setValue(
      "correspondenceDTO.correspondanc_date",
      correspondenceDTO?.correspondanc_date ?? moment().format("DD/MM/YYYY")
    );

    setValue(
      "correspondenceDTO.document_type",
      correspondenceDTO?.document_type
        ? correspondenceDTO?.document_type
        : docType.length > 0
        ? docType[0].picklistCode
        : ""
    );

    setValue(
      "correspondenceDTO.urgency_level",
      correspondenceDTO?.urgency_level &&
        correspondenceDTO?.urgency_level !== ""
        ? correspondenceDTO?.urgency_level
        : urgencyLevels.length > 0
        ? urgencyLevels[0].picklistCode
        : ""
    );

    // setValue(
    //   "correspondenceDTO.securityLevelPickListCode",
    //   correspondenceDTO?.securityLevelPickListCode &&
    //     correspondenceDTO?.securityLevelPickListCode !== ""
    //     ? correspondenceDTO?.securityLevelPickListCode
    //     : securityLevels.length > 0
    //     ? securityLevels[0].picklistCode
    //     : ""
    // );

    setValue(
      "correspondenceDTO.language",
      correspondenceDTO?.language
        ? correspondenceDTO?.language
        : languages.length > 0
        ? languages[0].picklistCode
        : ""
    );
  }, [docType, urgencyLevels, securityLevels, languages]);

  const getAllPickLists = async () => {
    try {
      const [docTypes, urgencyLevels, securityLevels, languages] =
        await Promise.all([
          PickListHelper.documentType(),
          PickListHelper.urgencyLevel(),
          PickListHelper.securityLevels(),
          PickListHelper.language(),
        ]);

      setDocType(docTypes);
      setUrgencyLevels(urgencyLevels);
      setSecurityLevels(securityLevels);
      setLanguages(languages);
      console.log(" a;; are completed ");
    } catch (error) {
      console.error("Error fetching picklists:", error);
    }
  };

  const init = async () => {
    await getAllPickLists();
    const response = await getMultiInitiatorRole();

    if (response.status === HttpStatus.SUCCESS) {
      if (response.data !== null) {
        // setValue(
        //   "correspondenceDTO.custom1",
        //   correspondenceDTO?.custom1 && correspondenceDTO.custom1 !== ""
        //     ? correspondenceDTO?.custom1
        //     : response.data.OrgUnits[0].orgUnitCode
        // );
        setInitiatorRole(response.data);
      }
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
      <Form name="basic-info" layout="vertical">
        <Col style={{ marginTop: 12 }}>
          <Controller
            name="correspondenceDTO.correspondence_number"
            control={control}
            render={({ field }) => (
              <MaterialInput label={labels.lbl.corr_number} {...field} />
            )}
          />
        </Col>
        <Col style={{ marginTop: 20 }}>
          <Controller
            name="correspondenceDTO.subject"
            control={control}
            render={({ field }) => (
              <MaterialInput label={labels.lbl.corr_subject} {...field} />
            )}
          />
        </Col>
        <Col style={{ marginTop: 12 }}>
          <Controller
            name="correspondenceDTO.sending_entity"
            control={control}
            render={({ field }) => (
              <ExternalEntitySearch
                multiSelect={false}
                label={labels.lbl.sending_entity}
                enableSearch
                value={field.value ? [field.value] : undefined}
                onChange={(users: string[]) =>
                  field.onChange(users.length > 0 ? users[0] : "")
                }
              />
            )}
          />
        </Col>
        <Col style={{ marginTop: 12 }}>
          <Controller
            name="correspondenceDTO.receiving_entity"
            control={control}
            render={({ field }) => (
              <OrgUnitSearchOption
                label={labels.lbl.receiving_entity}
                enableSearch
                multiSelect={false}
                code
                value={field.value ? [field.value] : []}
                onChange={(values: string[]) => {
                  if (values.length > 0) {
                    field.onChange(values[0]);
                  } else {
                    field.onChange("");
                  }
                }}
              />
            )}
          />
        </Col>
        <Col style={{ marginTop: 12 }} className="correspondence-date">
          <Controller
            name="correspondenceDTO.correspondanc_date"
            control={control}
            render={({ field }) => (
              <TextField
                margin="normal"
                variant="standard"
                fullWidth
                type="date"
                label={labels.lbl.corr_date}
                InputLabelProps={{ shrink: true }}
                value={DateHelper.swapFormat(field.value, true)}
                onChange={(e) => {
                  console.log("the onchange vale", e.target.value);
                  field.onChange(DateHelper.swapFormat(e.target.value, false));
                }}
              />
            )}
          />
        </Col>
        <Col style={{ marginTop: 20 }}>
          <Controller
            name="correspondenceDTO.document_type"
            control={control}
            render={({ field }) => (
              <MaterialSelect
                label={labels.lbl.document_type + " *"}
                options={docType.map((classification: PickListItemType) => {
                  return {
                    label: isEnglish
                      ? classification.picklistEnLabel
                      : classification.picklistArLabel,
                    value: classification.picklistCode,
                  };
                })}
                {...field}
                onChange={(value: string) => {
                  field.onChange(value);
                }}
                style={{ height: 45, marginBottom: 20 }}
              />
            )}
          />
        </Col>
        <Col style={{ marginTop: 20 }}>
          <Controller
            name="correspondenceDTO.urgency_level"
            control={control}
            render={({ field }) => (
              <MaterialSelect
                label={labels.lbl.urgency_level + " *"}
                options={urgencyLevels.map(
                  (classification: PickListItemType) => {
                    return {
                      label: isEnglish
                        ? classification.picklistEnLabel
                        : classification.picklistArLabel,
                      value: classification.picklistCode,
                    };
                  }
                )}
                {...field}
                onChange={(value: string) => {
                  field.onChange(value);
                }}
                style={{ height: 45, marginBottom: 20 }}
              />
            )}
          />
        </Col>
        <Col style={{ marginTop: 20 }}>
          <Controller
            name="correspondenceDTO.language"
            control={control}
            render={({ field }) => (
              <MaterialSelect
                label={labels.lbl.language + " *"}
                options={languages.map((classification: PickListItemType) => {
                  return {
                    label: isEnglish
                      ? classification.picklistEnLabel
                      : classification.picklistArLabel,
                    value: classification.picklistCode,
                  };
                })}
                {...field}
                onChange={(value: string) => {
                  field.onChange(value);
                }}
                style={{ height: 45, marginBottom: 20 }}
              />
            )}
          />
        </Col>
      </Form>
    </>
  );
}
