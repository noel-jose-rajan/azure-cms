import { HttpStatus } from "@/components/functional/httphelper";
import { OrgUnitType } from "@/components/services/organization-units/type";
import { getOutboundTemplateById } from "@/components/services/outbound-templates";
import { OutboundTemplateType } from "@/components/services/outbound-templates/type";
import { useLanguage } from "@/context/language";
import useGetAllOU from "@/store/orgs/use-get-all-ou";
import { EyeFilled, EyeInvisibleFilled } from "@ant-design/icons";
import { Button, Modal, Tag } from "antd";
import { FC, useState } from "react";

interface OrgUnitListProps {
  template: OutboundTemplateType;
}

const OrgUnitList: FC<OrgUnitListProps> = ({ template }) => {
  const {
    labels: { btn },
    isEnglish,
  } = useLanguage();

  const { orgUnits } = useGetAllOU();
  const [templateOUs, setTemplateOUs] = useState<OrgUnitType[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const getTemplateDetails = async () => {
    if (templateOUs.length > 0) {
      setTemplateOUs([]);
    } else {
      try {
        setLoading(true);
        const response = await getOutboundTemplateById(template.id);

        if (response.status === HttpStatus.SUCCESS && response.data) {
          const templateDetails = response.data.Data;
          const filteredOUS = orgUnits.filter((id) =>
            templateDetails.EntityIdList.includes(id.id!)
          );

          setTemplateOUs(filteredOUS);
        }
        setLoading(false);
      } catch (error) {
        setLoading(false);
      }
    }
  };

  return (
    <div>
      <Button
        type={templateOUs.length === 0 ? "dashed" : "text"}
        onClick={getTemplateDetails}
        disabled={template.is_general_template}
        loading={loading}
      >
        {templateOUs.length === 0 && <EyeFilled />}
        {templateOUs.length > 0 ? (
          <>
            {templateOUs.map((ou) => (
              <Tag>{isEnglish ? ou.name_en : ou.name_ar}</Tag>
            ))}
          </>
        ) : (
          btn.view
        )}
      </Button>
    </div>
  );
};

export default OrgUnitList;
