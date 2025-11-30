import { useState } from "react";
// @ts-ignore
import ImageModule from "docxtemplater-image-module-free";
import PizZip from "pizzip";
import Docxtemplater from "docxtemplater";
import { saveAs } from "file-saver";
import { v4 as uuid } from "uuid";

const DocxImageGenerator: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [file, setFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string>("");

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setFile(event.target.files[0]);
    }
  };

  const handleImageUrlChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setImageUrl(event.target.value);
  };

  const fetchImageAsBuffer = async (url: string): Promise<ArrayBuffer> => {
    const response = await fetch(url);
    if (!response.ok) throw new Error("Failed to load image");
    return await response.arrayBuffer();
  };

  const generateDocx = async () => {
    if (!file || !imageUrl) {
      alert("Please select a DOCX file and enter an image URL");
      return;
    }

    setLoading(true);

    try {
      const imageBuffer = await fetchImageAsBuffer(imageUrl);

      const opts = {
        centered: true,
        fileType: "docx",
        getImage: () => imageBuffer,
        getSize: () => [300, 300] as [number, number],
        getContentType: () => "image/png", // Adjust MIME type if needed
      };

      const imageModule = new ImageModule(opts);
      const content = await file.arrayBuffer();
      const zip = new PizZip(content);
      const doc = new Docxtemplater(zip, { modules: [imageModule] });

      doc.setData({ image: true });
      doc.render();

      const blob = doc.getZip().generate({ type: "blob" });
      saveAs(blob, uuid() + "-generated.docx");
    } catch (error) {
      console.error("Error generating document:", error);
    }

    setLoading(false);
  };

  return (
    <div>
      <input type="file" accept=".docx" onChange={handleFileChange} />
      <input
        type="text"
        placeholder="Enter Image URL"
        value={imageUrl}
        onChange={handleImageUrlChange}
      />
      <button onClick={generateDocx} disabled={loading}>
        {loading ? "Generating..." : "Generate DOCX"}
      </button>
    </div>
  );
};

export default DocxImageGenerator;
