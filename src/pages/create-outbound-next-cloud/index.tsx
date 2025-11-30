import React, { useState } from "react";
import { Button, Card, Col, Row, Upload } from "antd";
import {
  DeleteOutlined,
  SaveOutlined,
  SendOutlined,
  TableOutlined,
  UploadOutlined,
} from "@ant-design/icons";

import TitleBar from "../../components/ui/bar/title-bar";
import TitleHeader from "../../components/ui/header";
import DocxPlaceholderEditor from "../../components/functional/docx-placeholder-editor";
import CorrespondenceAttachments from "../../components/ui/draft-attachments";
import AccreditationForm from "./components/accreditation-form";
import NextcloudUploader from "./components/next-cloud";
import SelectSendingEntity from "./components/select-sending-entity";
import OutBoundForm from "./components/out-bound-form";
import { useLanguage } from "../../context/language";

const CreateOutbound: React.FC = () => {
  const { labels } = useLanguage();
  const [file, setFile] = useState<File | null>(null);
  const [appliedFile, setAppliedFile] = useState<File | null>(null);

  const handleFileChange = (info: any) => {
    if (info.fileList.length > 0) {
      const uploadedFile =
        info.fileList[info.fileList.length - 1].originFileObj;
      setFile(uploadedFile);
    } else {
      setFile(null);
    }
  };

  const handleApply = (blob: Blob) => {
    const newFile = new File([blob], "applied_document.docx", {
      type: blob.type,
    });
    setAppliedFile(newFile);
    setFile(null);
  };

  return (
    <>
      <TitleBar headerText={labels.mnu.outbound} />
      <br />

      <Row
        gutter={20}
        style={{
          justifyContent: "right",
        }}
      >
        <Col>
          <Button type="primary">
            {labels.btn.save_draft} <SaveOutlined />
          </Button>
        </Col>
        <Col>
          <Button type="primary">
            {labels.btn.submit} <SendOutlined />
          </Button>
        </Col>
        <Col>
          <Button type="primary">
            {labels.btn.delete} <DeleteOutlined />
          </Button>
        </Col>
      </Row>

      <TitleHeader
        heading={labels.til.inbound_form}
        icon={<TableOutlined style={{ color: "#fff" }} />}
      />

      <Row>
        <Col span={12} style={{ padding: "2rem" }}>
          {appliedFile && <NextcloudUploader file={appliedFile} />}
        </Col>

        <Col span={12}>
          <Card>
            <TitleHeader
              heading={labels.til.outbound_templates}
              icon={<TableOutlined style={{ color: "#fff" }} />}
            />
            <SelectSendingEntity />

            <Upload
              multiple={false}
              beforeUpload={() => false}
              onChange={handleFileChange}
            >
              <Button icon={<UploadOutlined />}>
                {labels.btn.upload_template}
              </Button>
            </Upload>

            {!appliedFile && (
              <DocxPlaceholderEditor file={file} onApply={handleApply} />
            )}
          </Card>
          <br />

          <OutBoundForm />
        </Col>

        <Col span={24}>
          <Row>
            <CorrespondenceAttachments corrId="" />
          </Row>
        </Col>
      </Row>

      <AccreditationForm />
    </>
  );
};

export default CreateOutbound;
