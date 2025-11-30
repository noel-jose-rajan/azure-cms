import { getAppParameterValueByKey } from "@/components/services/application-parameters";
import { getAllOutboundTemplate } from "@/components/services/outbound-templates";
import { OutboundTemplateType } from "@/components/services/outbound-templates/type";
import TitleBar from "@/components/ui/bar/title-bar";
import { useLanguage } from "@/context/language";
import { useTheme } from "@/context/theme";
import { PlusOutlined } from "@ant-design/icons";
import { Button, message } from "antd";
import { useEffect, useState } from "react";
import AddTemplate from "./components/add-template";
import OutboundTemplatesTable from "./components/result-table";
import { HttpStatus } from "@/components/functional/httphelper";

export default function OutboundTemplate() {
  const {
    labels: { til, btn },
    isEnglish,
  } = useLanguage();
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [attachmentSize, setAttachmentSize] = useState<number>(80);
  const [data, setData] = useState<OutboundTemplateType[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedTemplateId, setSelectedTemplateId] = useState<number>();

  useEffect(() => {
    init();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await getAllOutboundTemplate();
      if (response.status === HttpStatus.SUCCESS && response.data) {
        setData(response.data.Data);
      } else if (response.status === HttpStatus.NOTFOUND) {
        setData([]);
      } else {
        setData([]);
      }
    } catch (error) {
      message.error("Failed to fetch outbound templates.");
      setData([]);
    }
    setLoading(false);
  };

  const init = async () => {
    await fetchData();
    const response = await getAppParameterValueByKey("AttachmentSize");

    if (response.status === HttpStatus.SUCCESS && response.data) {
      const data = response.data;
      if (data.param_value) {
        setAttachmentSize(Number(data.param_value));
      }
    }
  };

  return (
    <>
      <TitleBar headerText={til.outbound_templates} />
      <br />
      <div
        style={{
          flexDirection: !isEnglish ? "row" : "row-reverse",
          display: "flex",
        }}
      >
        <Button type="primary" onClick={() => setOpenModal(() => true)}>
          <PlusOutlined />
          {btn.add_new}
        </Button>
      </div>
      <br />
      <OutboundTemplatesTable
        data={data}
        loading={loading}
        updateData={setData}
        onEdit={(id) => {
          setSelectedTemplateId(id);
          setOpenModal(() => true);
        }}
      />
      {openModal && (
        <AddTemplate
          visible={openModal}
          templateId={selectedTemplateId}
          onClose={() => {
            setOpenModal(false);
            setSelectedTemplateId(undefined);
          }}
          attachmentSize={attachmentSize}
          refresh={async () => {
            setOpenModal(false);
            await fetchData();
            setSelectedTemplateId(undefined);
          }}
        />
      )}
    </>
  );
}
