import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { TextField } from "@mui/material";
import dayjs from "dayjs";
import { useLanguage } from "../../../../../../context/language";
import DocumentTypesSelect from "./DocumentTypesSelect";
import SecurityLevelSelect from "./SecurityLevelSelect";
import KeywordInput from "./KeyWordInput";
import OutboundTypesSelect from "./OutboundTypesSelect";
import UrgencyLevelSelect from "./UrgencyLevelSelect";
import StampTypesSelect from "./StampTypesSelect";
import LanguageSelect from "./LanguageSelect";
import CorrespondenceSearch from "../../../../../../components/ui/search/correspondence";
import OrganizationUnitSearch from "../../../../../../components/ui/search/unit-2";
import UserSearch from "../../../../../../components/ui/search/user";
import { Correspondence, correspondenceSchema } from "../../../../types";
import { Card } from "antd";
import TitleHeader from "../../../../../../components/ui/header";
import { TableOutlined } from "@ant-design/icons";
import ExternalEntitySearch from "../../../../../../components/ui/search/external-entity";

export default function FormComponents() {
  const { labels } = useLanguage();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<Correspondence>({
    resolver: zodResolver(correspondenceSchema),
    defaultValues: {
      correspondenceDTO: {},
      genericActionDTO: {},
    },
  });

  const values = watch();

  const onSubmit = (data: Correspondence) => {
    console.log("Form Submitted", data);
  };

  return (
    <Card>
      <TitleHeader
        heading={labels.til.outbound_form}
        icon={<TableOutlined style={{ color: "#fff" }} />}
      />

      <form onSubmit={handleSubmit(onSubmit)}>
        <TextField
          fullWidth
          variant="standard"
          margin="normal"
          label={labels.lbl.corr_subject}
          {...register("correspondenceDTO.subject")}
          error={!!errors.correspondenceDTO?.subject}
          helperText={errors.correspondenceDTO?.subject?.message}
        />

        <KeywordInput
          values={values}
          handleValuesChange={(keywords) =>
            setValue("correspondenceDTO.documentKeyword", keywords)
          }
        />

        <TextField
          fullWidth
          variant="standard"
          margin="normal"
          label={labels.lbl.remarks}
          {...register("correspondenceDTO.remarks")}
          error={!!errors.correspondenceDTO?.remarks}
          helperText={errors.correspondenceDTO?.remarks?.message}
        />

        <CorrespondenceSearch
          values={values.correspondenceDTO.relatedCorrespondenceIds}
          label={labels.lbl.related_ref_num}
          onSelect={(e) =>
            setValue("correspondenceDTO.relatedCorrespondenceIds", e)
          }
        />

        <TextField
          margin="normal"
          variant="standard"
          fullWidth
          type="date"
          label={labels.lbl.corr_date}
          slotProps={{
            inputLabel: {
              shrink: true,
            },
          }}
          value={
            dayjs(values.correspondenceDTO.correspondenceDate).format(
              "YYYY-MM-DD"
            ) || ""
          }
          onChange={(e) =>
            setValue(
              "correspondenceDTO.correspondenceDate",
              dayjs(e.target.value).format("DD-MM-YYYY")
            )
          }
        />

        <OutboundTypesSelect
          values={values}
          handleValuesChange={(e) =>
            setValue("correspondenceDTO.outboundTypePickListCode", e)
          }
        />

        <UrgencyLevelSelect
          values={values}
          handleValuesChange={(e) =>
            setValue("correspondenceDTO.urgencyPickListCode", e)
          }
        />

        <StampTypesSelect
          values={values}
          handleValuesChange={(e) =>
            setValue("correspondenceDTO.stampTypePickListCode", e)
          }
        />

        <DocumentTypesSelect
          values={values}
          handleValuesChange={(e) =>
            setValue("correspondenceDTO.docTypePickListCode", e)
          }
        />

        <SecurityLevelSelect
          values={values}
          handleValuesChange={(e) =>
            setValue("correspondenceDTO.securityLevelPickListCode", e)
          }
        />

        <LanguageSelect
          values={values}
          handleValuesChange={(e) =>
            setValue("correspondenceDTO.correspondenceLanguage", e)
          }
        />

        <UserSearch
          label={labels.lbl.cc_user}
          multiSelect={true}
          value={values.correspondenceDTO.ccUsers}
          onChange={(e) => setValue("correspondenceDTO.ccUsers", e)}
        />

        <ExternalEntitySearch />

        <OrganizationUnitSearch
          multiple={true}
          value={values.correspondenceDTO.ccInternalCodes ?? []}
          label={labels.lbl.cc_internal}
          onSelect={(e) => {
            setValue("correspondenceDTO.ccInternalCodes", [
              ...(values.correspondenceDTO.ccInternalCodes ?? []),
              e,
            ]);
          }}
          onChange={(e) => {
            // @ts-ignore
            setValue("correspondenceDTO.ccInternalCodes", e);
          }}
        />

        <br />
      </form>
    </Card>
  );
}
