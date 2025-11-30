import { useEffect, useState } from "react";
import DocxGenerator from "../../components/experimental/docx-generator";
import PizZip from "pizzip";
import { Button, Input } from "@mui/material";
import { UploadOutlined } from "@ant-design/icons";
import { Card, Col, Row } from "antd";
import TitleBar from "../../components/ui/bar/title-bar";
import { useLanguage } from "../../context/language";

async function extractPlaceholders(
  file: File
): Promise<Record<string, boolean>> {
  try {
    const content = await file.arrayBuffer();
    const zip = new PizZip(content);
    let xml = zip.files["word/document.xml"].asText();

    // Remove XML tags to get plain text
    xml = xml.replace(/<[^>]+>/g, "");

    // Extract placeholders
    const placeholders: Record<string, boolean> = {};
    const placeholderMatches = [...xml.matchAll(/\{(.*?)\}/g)];

    placeholderMatches.forEach((match) => {
      placeholders[match[1]] = match[0].includes("%");
    });

    return placeholders;
  } catch (error) {
    console.error("Error extracting placeholders:", error);
    return {};
  }
}

export default function Experimental() {
  const { isEnglish } = useLanguage();

  const [file, setFile] = useState<File | undefined>();
  const [placeholders, setPlaceholders] = useState<Record<string, boolean>>({});
  const [placeholderValues, setPlaceholderValues] = useState<
    Record<string, string>
  >({});

  const handleChange = (value: any) => {
    if (value.target.files.length > 0) {
      setFile(value.target.files[0]);
    }
  };

  useEffect(() => {
    if (file) {
      extractPlaceholders(file).then((d) => {
        const stringRecord: Record<string, string> = Object.fromEntries(
          Object.entries(d).map(([key]) => [key, ""])
        );
        setPlaceholders(() => d);
        setPlaceholderValues(() => stringRecord);
      });
    }
    return () => {};
  }, [file]);

  function getOnlyTextPlaceHolders(ph: Record<string, any>): any {
    return Object.fromEntries(
      Object.entries(ph).filter(([key]) => !key.startsWith("%"))
    );
  }

  function getOnlyImagePlaceHolders(ph: Record<string, any>): any {
    return Object.fromEntries(
      Object.entries(ph).filter(([key]) => key.startsWith("%"))
    );
  }

  return (
    <>
      <TitleBar
        headerText={
          isEnglish ? "Experimental Stamp Component" : "مكون ختم تجريبي"
        }
      />
      <Card>
        <Col style={{ width: "100%" }}>
          <Row>
            <Button
              component="label"
              role={undefined}
              variant="contained"
              tabIndex={-1}
              startIcon={<UploadOutlined />}
            >
              {isEnglish
                ? "Upload files To Replace Placeholder"
                : "تحميل الملفات لاستبدال العنصر النائب"}
              <input
                style={{ display: "none" }}
                type="file"
                onChange={handleChange}
              />
            </Button>
          </Row>
          <Row gutter={50} style={{ width: "100%", margin: "1rem 0" }}>
            {JSON.stringify(placeholders) !== "{}" &&
              Object.entries(placeholders).map((i, k) => (
                <Col span={12} style={{ margin: "1rem 0" }}>
                  <Input
                    fullWidth
                    key={k}
                    placeholder={
                      i[1]
                        ? isEnglish
                          ? `Enter ${i[0].replace("%", "")} URL`
                          : `أدخل رابط ${i[0].replace("%", "")}`
                        : isEnglish
                        ? i[0]
                        : i[0] // Maintain placeholder text in original format
                    }
                    onChange={(e) =>
                      setPlaceholderValues((v) => ({
                        ...v,
                        [i[0]]: e.target.value,
                      }))
                    }
                  />
                </Col>
              ))}
          </Row>
          {file && (
            <DocxGenerator
              docxFile={file}
              textPlaceHolders={getOnlyTextPlaceHolders(placeholderValues)}
              imagePlaceHolders={getOnlyImagePlaceHolders(placeholderValues)}
            />
          )}
        </Col>
      </Card>
    </>
  );
}
