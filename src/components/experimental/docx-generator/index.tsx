import { useState } from "react";
// @ts-ignore
import ImageModule from "docxtemplater-image-module-free";
import PizZip from "pizzip";
import Docxtemplater from "docxtemplater";
import { saveAs } from "file-saver";
import { v4 as uuid } from "uuid";
import { Button } from "@mui/material";
import { useLanguage } from "../../../context/language";

interface Props {
  docxFile: File;
  textPlaceHolders: { [key: string]: string };
  imagePlaceHolders: { [key: string]: string };
}

const DocxImageGenerator: React.FC<Props> = ({
  docxFile,
  textPlaceHolders,
  imagePlaceHolders,
}) => {
  const { isEnglish } = useLanguage();
  const [loading, setLoading] = useState<boolean>(false);
  const [file] = useState<File | null>(docxFile ?? null);

  const fetchImageAsBuffer = async (url: string): Promise<ArrayBuffer> => {
    const response = await fetch(url);
    if (!response.ok)
      throw new Error(isEnglish ? "Failed to load image" : "فشل تحميل الصورة");
    return await response.arrayBuffer();
  };

  const generateDocx = async () => {
    if (!file) {
      alert(isEnglish ? "Please select a DOCX file" : "يرجى اختيار ملف DOCX");
      return;
    }

    setLoading(true);

    try {
      let opts: any = {
        // centered: true,
        fileType: "docx",
      };

      if (Object.entries(imagePlaceHolders).length > 0) {
        let tags: Record<any, any> = {};

        const imageBuffers: Record<string, ArrayBuffer | null> = {};

        for (const [key, url] of Object.entries(imagePlaceHolders)) {
          if (typeof url === "string" && url.startsWith("http")) {
            try {
              imageBuffers[key.replace("%", "")] = await fetchImageAsBuffer(
                url
              );
              tags[key.replace("%", "")] = true;
            } catch (error) {
              console.error(`Failed to fetch image for key ${key}:`, error);
              imageBuffers[key.replace("%", "")] = null;
            }
          }
        }

        // Modify getImage to return the correct image buffer
        const im = (_tagValue: boolean, tag: string) => {
          console.log("Image placeholder:", tag);
          return imageBuffers[tag] || null;
        };

        opts = {
          ...opts,
          getImage: im,
          getSize: () => [200, 100] as [number, number],
          getContentType: () => "image/png",
        };

        const content = await file.arrayBuffer();
        const zip = new PizZip(content);

        const imageModule = new ImageModule(opts);
        const doc = new Docxtemplater(zip, { modules: [imageModule] });
        console.log(tags);

        doc.setData({ ...tags, ...(textPlaceHolders ?? {}) });
        doc.render();

        const blob = doc.getZip().generate({ type: "blob" });
        saveAs(blob, uuid() + "-generated.docx");
      } else {
        const content = await file.arrayBuffer();
        const zip = new PizZip(content);

        const doc = new Docxtemplater(zip, {});

        doc.setData({ ...(textPlaceHolders ?? {}), "%image": "{%image}" });
        doc.render();

        const blob = doc.getZip().generate({ type: "blob" });
        saveAs(blob, uuid() + "-generated.docx");
      }
    } catch (error) {
      console.error(
        isEnglish ? "Error generating document:" : "خطأ في إنشاء المستند:",
        error
      );
    }

    setLoading(false);
  };

  return (
    <div>
      <Button onClick={generateDocx} disabled={loading}>
        {loading
          ? isEnglish
            ? "Generating..."
            : "جاري الإنشاء..."
          : isEnglish
          ? "Generate DOCX"
          : "إنشاء DOCX"}
      </Button>
    </div>
  );
};

export default DocxImageGenerator;
