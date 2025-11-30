import { Modal } from "antd";
import Text from "@/components/ui/text/text";
import usePicklist from "@/store/picklists/use-picklist";
import { ExternalEntity } from "../../service";
import { useLanguage } from "@/context/language";
import useGetEntity from "../../hooks/use-get-entity";
import WhileInViewWrapper from "@/animations/while-in-view-wrapper";
import LoaderComponent from "@/components/ui/loader";

interface ViewEntityModalProps {
  title: string;
  onCancel: () => void;
  id: string | number;
  entity: ExternalEntity;
}

export default function ViewEntityDetails({
  title,
  onCancel,
  id,
  entity,
}: ViewEntityModalProps) {
  const { labels } = useLanguage();
  const { getPicklistById } = usePicklist();
  const { entity: moreData = {}, loading } = useGetEntity(id || 1);

  const entityItem = { ...entity, ...moreData };
  const picklist = getPicklistById(
    "External Entity Classification",
    entityItem?.classify_id || "-"
  );
  return (
    <Modal
      title={title}
      centered
      open={true}
      width={500}
      onCancel={onCancel}
      footer={<></>}
      styles={{
        body: {
          minHeight: 220,
        },
      }}
    >
      {loading ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: 220,
          }}
        >
          <LoaderComponent loading={loading} size="default" />
        </div>
      ) : (
        <WhileInViewWrapper once={false}>
          <Text
            style={{ ...styles.text, marginTop: 20 }}
            en={labels.lbl.english_name + " : " + (entityItem?.name_en || "-")}
            ar={labels.lbl.english_name + " : " + (entityItem?.name_ar || "-")}
          />
          <Text
            style={styles.text}
            en={labels.lbl.arabic_name + " : " + (entityItem?.name_ar || "-")}
            ar={labels.lbl.arabic_name + " : " + (entityItem?.name_ar || "-")}
          />
          <Text
            style={styles.text}
            en={`${labels.lbl.short_number} : ${
              entityItem?.abbr ? entityItem?.abbr : "-"
            }`}
            ar={`${labels.lbl.short_number} : ${
              entityItem?.abbr ? entityItem?.abbr : "-"
            }`}
          />
          <Text
            style={styles.text}
            en={`${labels.lbl.sequence_number} : ${entityItem?.id ?? "-"}`}
            ar={`${labels.lbl.sequence_number} : ${entityItem?.id ?? "-"}`}
          />
          <Text
            style={styles.text}
            en={
              labels.lbl.classification +
              " : " +
              (picklist?.picklist_en_label || "-")
            }
            ar={
              labels.lbl.classification +
              " : " +
              (picklist?.picklist_ar_label || "-")
            }
          />
          {/* <Text
          style={styles.text}
          en={`${labels.lbl.email} : ${
            entityItem?.email !== null ? entityItem?.email : "-"
          }`}
          ar={`${labels.lbl.email} : ${
            entityItem?.email !== null ? entityItem?.email : "-"
          }`}
        /> */}
          <Text
            style={styles.text}
            en={`${labels.lbl.phone} : ${
              entityItem?.phone ? entityItem?.phone : "-"
            }`}
            ar={`${labels.lbl.phone} : ${
              entityItem?.phone ? entityItem?.phone : "-"
            }`}
          />
          <Text
            style={styles.text}
            en={`${labels.lbl.fax_number} : ${
              entityItem?.fax ? entityItem?.fax : "-"
            }`}
            ar={`${labels.lbl.fax_number} : ${
              entityItem?.fax ? entityItem?.fax : "-"
            }`}
          />
          {/* <Text
          style={styles.text}
          en={`${labels.lbl.g2gCode} : ${
            entityItem?.g2g_code ? entityItem?.g2g_code : "-"
          }`}
          ar={`${labels.lbl.g2gCode} : ${
            entityItem?.g2g_code ? entityItem?.g2g_code : "-"
          }`}
        /> */}
          {/* <Text
          style={styles.text}
          en={`${labels.lbl.g2gBranch} : ${
            entityItem?.g2gBranch !== null ? entityItem?.g2gBranch : "-"
          }`}
          ar={`${labels.lbl.g2gBranch} : ${
            entityItem?.g2gBranch !== null ? entityItem?.g2gBranch : "-"
          }`}
        /> */}
        </WhileInViewWrapper>
      )}
    </Modal>
  );
}

const styles = {
  text: {
    marginBottom: 10,
  },
};
