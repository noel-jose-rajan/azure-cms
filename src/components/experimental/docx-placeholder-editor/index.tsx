import React, { useState } from "react";
import PizZip from "pizzip";
import Docxtemplater from "docxtemplater";
import { saveAs } from "file-saver";
import Card from "antd/es/card/Card";
import { Button, Input, Space, Spin } from "antd";
import Title from "antd/es/typography/Title";

const ExperimentalDocxPlaceholderEditor: React.FC = () => {
    const [file, setFile] = useState<File | null>(null);
    const [placeholders, setPlaceholders] = useState<string[]>([]);
    const [replacements, setReplacements] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(false);

    // Handle file upload
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            const uploadedFile = event.target.files[0];
            setFile(uploadedFile);
            extractPlaceholders(uploadedFile);
        }
    };

    // Extract placeholders from the .docx file
    const extractPlaceholders = async (file: File) => {
        setLoading(true);
        const reader = new FileReader();
        reader.readAsArrayBuffer(file);

        reader.onload = (e) => {
            if (!e.target?.result) return;
            const zip = new PizZip(e.target.result as ArrayBuffer);
            const doc = new Docxtemplater(zip, {
                paragraphLoop: true,
                linebreaks: true,
                delimiters: { start: "«", end: "»" }, // Recognize «placeholders»
            });

            const text = doc.getFullText();

            // Match placeholders in the format «placeholder»
            const placeholderPattern = /«(.*?)»/g;
            const matches = new Set<string>();

            let match;
            while ((match = placeholderPattern.exec(text)) !== null) {
                matches.add(match[1]);
            }

            setPlaceholders([...matches]);
            setReplacements(Object.fromEntries([...matches].map((key) => [key, ""])));
            setLoading(false);
        };
    };

    // Handle input change for replacements
    const handleReplacementChange = (key: string, value: string) => {
        setReplacements((prev) => ({ ...prev, [key]: value }));
    };

    // Replace placeholders in the original document and generate new .docx
    const generateNewDocx = async () => {
        if (!file) return;
        setLoading(true);

        const reader = new FileReader();
        reader.readAsArrayBuffer(file);
        reader.onload = (e) => {
            if (!e.target?.result) return;

            const zip = new PizZip(e.target.result as ArrayBuffer);
            const doc = new Docxtemplater(zip, {
                paragraphLoop: true,
                linebreaks: true,
                delimiters: { start: "«", end: "»" }, // Recognize custom delimiters
            });

            // Apply replacements
            doc.setData(replacements);

            try {
                doc.render(); // Apply changes inside the document

                // Generate and download the new docx file
                const outputBlob = new Blob(
                    [doc.getZip().generate({ type: "uint8array", compression: "DEFLATE" })],
                    { type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document" }
                );
                saveAs(outputBlob, "output.docx");
            } catch (error) {
                console.error("Error generating document:", error);
            }

            setLoading(false);
        };
    };

    return (
        <Card title="Docx Placeholder Replacer" bordered={false} style={{ maxWidth: 600, margin: "auto" }}>
            {/* <Upload beforeUpload={() => false}  showUploadList={false}>
                <Button icon={<UploadOutlined />}>Upload .docx File</Button>
            </Upload> */}


            <input
                type="file"
                accept=".docx"
                onChange={handleFileChange}
                className="border p-2 rounded w-full mb-4"
            />

            {loading && <Spin tip="Processing..." style={{ marginTop: 10 }} />}
            {placeholders.length > 0 && (
                <Space direction="vertical" style={{ width: "100%", marginTop: 20 }}>
                    <Title level={4}>Fill Placeholders</Title>
                    {placeholders.map((placeholder) => (
                        <div key={placeholder}>
                            <b>{placeholder}</b>
                            <Input
                                value={replacements[placeholder] || ""}
                                onChange={(e) => handleReplacementChange(placeholder, e.target.value)}
                                placeholder={`Enter value for ${placeholder}`}
                            />
                        </div>
                    ))}
                    <Button type="primary" onClick={generateNewDocx} loading={loading}>
                        Generate Document
                    </Button>
                </Space>
            )}
        </Card>
    );
};

export default ExperimentalDocxPlaceholderEditor;
