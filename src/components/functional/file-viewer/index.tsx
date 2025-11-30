import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

// Plugin system
type Plugin = (fileUrl: string, fileExtension: string) => React.ReactNode | null;
const plugins: Plugin[] = [];

export function registerPlugin(plugin: Plugin): void {
    plugins.push(plugin);
}

const FileViewer: React.FC = () => {
    const [searchParams] = useSearchParams();
    const [fileUrl, setFileUrl] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);


    registerPlugin((fileUrl: string, fileExtension: string): React.ReactNode | null => {
        if (fileExtension === "txt") {
            return (
                <iframe
                    src={fileUrl}
                    title="Text File Viewer"
                    style={{
                        width: "100%", height: "100vh", border: "none", backgroundColor: "#fff"

                    }}
                ></iframe>
            );
        }
        return null;
    });


    useEffect(() => {
        const url = searchParams.get("fileUrl");
        if (url) {
            setFileUrl(url);
        } else {
            setErrorMessage("No file URL provided in the query parameter.");
        }
    }, [searchParams]);

    const renderFile = (): React.ReactNode => {
        if (!fileUrl) return null;

        const fileExtension = fileUrl.split(".").pop()?.toLowerCase() || "";

        // Check plugins for handling the file
        for (const plugin of plugins) {
            const pluginResult = plugin(fileUrl, fileExtension);
            if (pluginResult) return pluginResult;
        }

        // Default handling for known file types
        if (/(jpg|jpeg|png|gif|webp)$/i.test(fileExtension)) {
            return <img src={fileUrl} alt="Preview" style={{ maxWidth: "100%", height: "auto" }} />;
        }

        if (/pdf$/i.test(fileExtension)) {
            return (
                <iframe
                    src={fileUrl}
                    title="PDF Viewer"
                    style={{ width: "100%", height: "80vh", border: "none" }}
                ></iframe>
            );
        }

        return <p>File cannot be opened.</p>;
    };

    return (
        <div>
            {errorMessage ? (
                <p style={{ color: "red" }}>{errorMessage}</p>
            ) : (
                <div>{renderFile()}</div>
            )}
        </div>
    );
};

export default FileViewer;

// registerPlugin((fileUrl: string, fileExtension: string): React.ReactNode | null => {
//     if (fileExtension === "docx") {
//         const collaboraUrl = `https://localhost:9980/loleaflet/dist/loleaflet.html?WOPISrc=${encodeURIComponent(
//             fileUrl
//         )}`;
//         return (
//             <iframe
//                 src={collaboraUrl}
//                 title="DOCX Viewer"
//                 style={{ width: "100%", height: "80vh", border: "none" }}
//             ></iframe>
//         );
//     }
//     return null;
// });




registerPlugin((fileUrl: string, fileExtension: string): React.ReactNode | null => {
    if (fileExtension === "docx" || fileExtension === "doc" || fileExtension === "xlsx" || fileExtension === 'xls' || fileExtension === "pptx" || fileExtension === 'ppt') {
        return (
            <iframe
                src={`https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(fileUrl)}`}
                title="DOCX Viewer"
                style={{ width: "100%", height: "100vh", border: "none" }}
            ></iframe>
        );
    }
    return null;
});
