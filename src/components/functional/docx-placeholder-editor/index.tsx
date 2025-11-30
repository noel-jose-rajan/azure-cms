import { useState, useEffect } from "react";
import PizZip from "pizzip";
import Docxtemplater from "docxtemplater";
import { Button, Input, Space, Spin, Typography, Alert } from "antd";
import { z } from "zod";
import { useLanguage } from "../../../context/language";

const { Title } = Typography;

const fileSchema = z.object({
    type: z.string().refine((type) => type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document", {
        // @ts-ignore
        message: {
            en: "Invalid file format. Please upload a .docx file.",
            ar: "تنسيق الملف غير صالح. يرجى تحميل ملف .docx فقط."
        }
    })
});

const DocxPlaceholderEditor = ({ file, onApply }: { file?: File | null; onApply?: (updatedFile: Blob) => void }) => {
    const [placeholders, setPlaceholders] = useState<string[]>([]);
    const [replacements, setReplacements] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<{
        en: string,
        ar: string
    } | null>(null);
    const { isEnglish } = useLanguage()

    useEffect(() => {
        if (file) {
            validateAndExtract(file);
        }
    }, [file]);

    const validateAndExtract = (file: File) => {
        setError(null);
        setLoading(true);

        const validation = fileSchema.safeParse({ type: file.type });
        if (!validation.success) {
            // @ts-ignore
            setError(validation.error.issues[0].message);
            setLoading(false);
            return;
        }

        extractPlaceholders(file);
    };

    const extractPlaceholders = (file: File) => {
        const reader = new FileReader();
        reader.readAsArrayBuffer(file);

        reader.onload = (e) => {
            if (!e.target?.result) return;
            try {
                const zip = new PizZip(new Uint8Array(e.target.result as ArrayBuffer));
                const doc = new Docxtemplater(zip, {
                    paragraphLoop: true,
                    linebreaks: true,
                    delimiters: { start: "«", end: "»" },
                });

                const text = doc.getFullText();
                const placeholderPattern = /«(.*?)»/g;
                const matches = new Set<string>();
                let match;
                while ((match = placeholderPattern.exec(text)) !== null) {
                    matches.add(match[1]);
                }

                setPlaceholders([...matches]);
                setReplacements(Object.fromEntries([...matches].map((key) => [key, ""])));
            } catch (err) {
                setError({ en: "Error processing file.", ar: "خطأ في معالجة الملف." });
            }
            setLoading(false);
        };
    };

    const handleReplacementChange = (key: string, value: string) => {
        setReplacements((prev) => ({ ...prev, [key]: value }));
    };

    const applyChanges = () => {
        if (!file) return;
        setLoading(true);

        try {
            const reader = new FileReader();
            reader.readAsArrayBuffer(file);
            reader.onload = (e) => {
                if (!e.target?.result) return;
                const zip = new PizZip(new Uint8Array(e.target.result as ArrayBuffer));
                const doc = new Docxtemplater(zip, {
                    paragraphLoop: true,
                    linebreaks: true,
                    delimiters: { start: "«", end: "»" },
                });

                doc.setData(replacements);
                doc.render();

                const outputBlob = new Blob(
                    [doc.getZip().generate({ type: "uint8array", compression: "DEFLATE" })],
                    { type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document" }
                );
                onApply && onApply(outputBlob);
            };
        } catch (error) {
            setError({ en: "Error applying changes.", ar: "خطأ في تطبيق التغييرات." });
        }

        setLoading(false);
    };

    return (
        <>
            {error && <Alert message={isEnglish ? error.en : error.ar} type="error" showIcon style={{ marginBottom: 10 }} />}
            {loading && <Spin tip={isEnglish ? "Processing..." : "جارٍ المعالجة..."} style={{ marginTop: 10 }} />}
            <Space direction="vertical" style={{ width: "100%", marginTop: 20 }}>
                {placeholders.length > 0 && <Title level={4}>{isEnglish ? "Fill Placeholders" : "املأ العناصر النائبة"}</Title>}
                {placeholders.map((placeholder) => (
                    <div key={placeholder}>
                        <b>{placeholder}</b>
                        <Input
                            value={replacements[placeholder] || ""}
                            onChange={(e) => handleReplacementChange(placeholder, e.target.value)}
                            placeholder={isEnglish ? `Enter value for ${placeholder}` : `أدخل قيمة لـ ${placeholder}`}
                        />
                    </div>
                ))}
                {file !== null && <Button type="primary" onClick={applyChanges} loading={loading}>
                    {isEnglish ? (placeholders.length > 0 ? "Apply Changes" : "Continue to Upload") : (placeholders.length > 0 ? "تطبيق التغييرات" : "متابعة التحميل")}
                </Button>}
            </Space>
        </>
    );
};

export default DocxPlaceholderEditor;
