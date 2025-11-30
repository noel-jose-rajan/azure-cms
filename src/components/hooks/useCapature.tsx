import ENV from "@/constants/env";
import apiRequest from "@/lib/api";
import { AxiosRequestConfig } from "axios";
import useCustomMessage from "./use-message";
import { abbyConstants } from "@/constants/app-constants/abby-constants";
import * as XLSX from "xlsx";
import { useState } from "react";
import { useLanguage } from "@/context/language";

export type Locale = "en" | "ar";

export interface ProcessLabels {
  createSession: Record<Locale, string>;
  openProject: Record<Locale, string>;
  addBatch: Record<Locale, string>;
  openBatch: Record<Locale, string>;
  addImage: Record<Locale, string>;
  closeBatch: Record<Locale, string>;
  processBatch: Record<Locale, string>;
  waitForCompletion: Record<Locale, string>;
  getResultList: Record<Locale, string>;
  loadResult: Record<Locale, string>;
  readFile: Record<Locale, string>;
}

export const PROCESS_LABELS: ProcessLabels = {
  createSession: { en: "Creating session", ar: "بدء الجلسة" },
  openProject: { en: "Opening project", ar: "فتح المشروع" },
  addBatch: { en: "Adding new batch", ar: "إضافة دفعة جديدة" },
  openBatch: { en: "Opening batch", ar: "فتح الدُفعة" },
  addImage: { en: "Uploading image", ar: "تحميل الصورة" },
  closeBatch: { en: "Closing batch", ar: "إغلاق الدُفعة" },
  processBatch: { en: "Processing Image", ar: "معالجة الصورة" },
  waitForCompletion: { en: "Waiting for completion", ar: "انتظار الانتهاء" },
  getResultList: { en: "Fetching result list", ar: "جلب قائمة النتائج" },
  loadResult: { en: "Loading document", ar: "تحميل المستند" },
  readFile: { en: "Reading file contents", ar: "قراءة محتوى الملف" },
};
const blobToBase64 = async (blob: Blob): Promise<string> => {
  const buffer = await blob.arrayBuffer();
  const bytes = new Uint8Array(buffer);
  let binary = "";
  for (const b of bytes) binary += String.fromCharCode(b);
  return btoa(binary);
};

const useCapature = (onClose: () => void) => {
  const { isEnglish } = useLanguage();
  const lang: Locale = isEnglish ? "en" : "ar";
  const label = (key: keyof typeof PROCESS_LABELS) => PROCESS_LABELS[key][lang];
  const [rows, setRows] = useState<Record<string, string>[]>([]);
  const [startProcess, setStartProcess] = useState(false);

  const [currentProcess, setCurrentProcess] = useState("");
  const handleReadFile = (file: Blob) => {
    const reader = new FileReader();
    reader.onload = (evt: ProgressEvent<FileReader>) => {
      const binaryStr = evt.target?.result;
      const workbook = XLSX.read(binaryStr, { type: "binary" });

      const sheetName = workbook.SheetNames[0]; // You can loop through all sheets if needed
      const sheet = workbook.Sheets[sheetName];
      const data = XLSX.utils.sheet_to_json<Record<string, string>>(sheet, {
        defval: "",
      });

      console.log({ data });

      setRows(data);
    };

    reader.readAsBinaryString(file);
  };

  const { showMessage } = useCustomMessage();

  const handleCreateSession = async () => {
    try {
      setRows([]);
      setStartProcess(true);
      setCurrentProcess(label("createSession"));
      const sessionId = await createASession();
      return sessionId;
    } catch (err: unknown) {
      onClose();
      showMessage(
        "error",
        isEnglish
          ? "error occurred while creating a session"
          : "حدث خطأ أثناء إنشاء الجلسة"
      );
    }
  };
  const handleOpenProject = async (sessionId: number) => {
    try {
      await openAProject(sessionId);
    } catch (err: unknown) {
      onClose();

      showMessage(
        "error",
        isEnglish
          ? "Something went wrong while opening a project"
          : "حدث خطأ عند فتح المشروع"
      );
    }
  };

  const handleAddNewBatch = async (sessionId: number) => {
    try {
      const batchId = await addNewBatch(
        sessionId,
        abbyConstants.projectId,
        abbyConstants.batchId,
        { name: "test", description: "test" }
      );
      return batchId;
    } catch (err: unknown) {
      onClose();

      showMessage(
        "error",
        isEnglish
          ? "something went wrong while adding a batch"
          : "حدث خطأ ما أثناء  إضافة الدفعة "
      );
    }
  };

  const handleOpenBatch = async (sessionId: number, batchId: number) => {
    try {
      await openBatch(sessionId, batchId);
    } catch (err: unknown) {
      onClose();

      showMessage(
        "error",
        isEnglish
          ? "Something went wrong while opening a batch"
          : "حدث خطأ أثناء فتح الدفعة"
      );
    }
  };
  const handleUploadImg = async (
    sessionId: number,
    batchId: number,
    blob: Blob
  ) => {
    try {
      await addNewImage(sessionId, batchId, blob);
    } catch (err: unknown) {
      onClose();

      showMessage(
        "error",
        isEnglish
          ? "something went wrong while uploading an image"
          : "حدث خطأ أثناء تحميل الصورة"
      );
    }
  };

  const handleCloseBatch = async (sessionId: number, batchId: number) => {
    try {
      await closeBatch(sessionId, batchId);
    } catch (err: unknown) {
      onClose();

      showMessage(
        "error",
        isEnglish
          ? "Something went wrong while closing a batch"
          : "حدث خطأ أثناء إغلاق الدفعة"
      );
    }
  };

  const handleProcessBatch = async (sessionId: number, batchId: number) => {
    try {
      await processBatch(sessionId, batchId);
    } catch (err: unknown) {
      onClose();

      showMessage(
        "error",
        isEnglish
          ? "Something went wrong while processing a batch"
          : "حدث خطأ أثناء معالجة الدفعة"
      );
    }
  };

  const handleCheckCompletion = async (batchId: number) => {
    try {
      await waitForBatchCompletion(batchId);
    } catch (err: unknown) {
      onClose();

      showMessage(
        "error",
        isEnglish
          ? "Something went wrong while waiting for completion"
          : "حدث خطأ أثناء انتظار الانتهاء"
      );
    }
  };

  const handleGetFilePath = async (sessionId: number, batchId: number) => {
    try {
      const filePAth = await getDocumentResultsList(sessionId, batchId);
      return filePAth;
    } catch (err: unknown) {
      onClose();

      showMessage(
        "error",
        isEnglish
          ? "Something went wrong while getting file path"
          : "حدث خطأ أثناء الحصول على المسار للملف"
      );
    }
  };

  const handleLoadResults = async (
    sessionId: number,
    batchId: number,
    filePath: string
  ) => {
    try {
      const file = await loadDocumentResult(sessionId, batchId, 1, filePath);
      if (file) {
        handleReadFile(file);
      }
    } catch (err: unknown) {
      onClose();

      showMessage(
        "error",
        isEnglish
          ? "Something went wrong while loading results"
          : "حدث خطأ أثناء تحميل النتائج"
      );
    }
  };
  const handleStartABBYY = async (blob: Blob) => {
    const sessionId = await handleCreateSession();
    if (sessionId) {
      await handleOpenProject(sessionId);
      const batchId = await handleAddNewBatch(sessionId);

      if (batchId) {
        setCurrentProcess(label("addImage"));

        await handleOpenBatch(sessionId, batchId);

        await handleUploadImg(sessionId, batchId, blob);

        await handleCloseBatch(sessionId, batchId);
        setCurrentProcess(label("processBatch"));

        await handleProcessBatch(sessionId, batchId);
        // setCurrentProcess(label("waitForCompletion"));

        await handleCheckCompletion(batchId);
        setCurrentProcess(label("readFile"));

        const filePath = await handleGetFilePath(sessionId, batchId);
        if (filePath) {
          await handleLoadResults(sessionId, batchId, filePath);
        }
      } else {
        // showMessage("error", "Something went wrong while adding a batch");
      }
    } else {
      // showMessage("error", "Something went wrong while creating a session");
    }
  };

  return {
    handleStartABBYY,
    currentProcess,
    startProcess,
    rows,
    setStartProcess,
  };
};

export default useCapature;

export const convertXMLDataToJSON = (xmlString: string) => {
  try {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlString, "text/xml");
    // Helper function to recursively convert XML nodes to JSON
    const xmlNodeToJson = (node: any) => {
      const obj: any = {};
      if (node.nodeType === 1) {
        // element
        if (node.attributes.length > 0) {
          obj["@attributes"] = {};
          for (let j = 0; j < node.attributes.length; j++) {
            obj["@attributes"][node.attributes[j].nodeName] =
              node.attributes[j].nodeValue;
          }
        }
      } else if (node.nodeType === 3) {
        // text
        return node.nodeValue.trim();
      }
      // process child nodes
      if (node.hasChildNodes()) {
        for (let i = 0; i < node.childNodes.length; i++) {
          const item = node.childNodes[i];
          const nodeName = item.nodeName;
          const value = xmlNodeToJson(item);
          if (typeof value === "string" && value === "") continue;
          if (obj[nodeName] === undefined) {
            obj[nodeName] = value;
          } else {
            if (!Array.isArray(obj[nodeName])) {
              obj[nodeName] = [obj[nodeName]];
            }
            obj[nodeName].push(value);
          }
        }
      }
      return obj;
    };
    return xmlNodeToJson(xmlDoc.documentElement);
  } catch (error) {
    console.error("Error converting XML to JSON:", error);
    return null;
  }
};
export const extractSessionId = (xmlString: string): number | null => {
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(xmlString, "text/xml");

  // Grab any <sessionId> element, ignore namespace
  const sessionEl = xmlDoc.querySelector("sessionId");
  if (!sessionEl?.textContent) return null;

  const raw = sessionEl.textContent.trim();
  return raw ? parseInt(raw, 10) : null;
};

export const createASession = async (): Promise<number | null> => {
  const raw = `<?xml version="1.0" encoding="utf-8"?>
<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/" xmlns:tns="urn:http://www.abbyy.com/FlexiCapture">
  <soap:Body>
    <tns:OpenSession>
      <tns:roleType>${abbyConstants.role}</tns:roleType>
      <tns:stationType>${abbyConstants.station}</tns:stationType>
    </tns:OpenSession>
  </soap:Body>
</soap:Envelope>`;

  const headers: AxiosRequestConfig["headers"] = {
    "Content-Type": "text/xml",
    SOAPAction: "OpenSession",
    Authorization: abbyConstants.token,
  };

  const response = await apiRequest(
    "POST",
    "FlexiCapture12/Server/API/v1/Soap",
    raw,
    { headers },
    ENV.ABBYY_BASE_URL
  );

  const sessionId = extractSessionId(response);
  console.log("Session ID:", sessionId);
  return sessionId;
};

export const openAProject = async (
  sessionId: string | number
): Promise<any | null> => {
  const headers: AxiosRequestConfig["headers"] = {
    "Content-Type": "text/xml",
    SOAPAction: "OpenProject",
    Authorization: abbyConstants.token,
  };

  const raw = `<?xml version="1.0" encoding="utf-8"?>
        <soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/" xmlns:tns="urn:http://www.abbyy.com/FlexiCapture">
        <soap:Body>
            <tns:OpenProject>
                <tns:sessionId>${sessionId}</tns:sessionId>
                <tns:projectNameOrGuid>6F57F48C-568A-45C2-935B-5E16D5138269</tns:projectNameOrGuid>
            </tns:OpenProject>
        </soap:Body>
        </soap:Envelope>`;

  const response = await apiRequest(
    "POST",
    "FlexiCapture12/Server/API/v1/Soap",
    raw,
    { headers },
    ENV.ABBYY_BASE_URL
  );
  return null;
};
export const extractBatchId = (xml: string): number | null => {
  const doc = new DOMParser().parseFromString(xml, "text/xml");

  // 1. Try the exact namespace
  const nsNode = doc.getElementsByTagNameNS(
    "urn:http://www.abbyy.com/FlexiCapture",
    "batchId"
  )[0];
  if (nsNode?.textContent) {
    return parseInt(nsNode.textContent.trim(), 10);
  }

  // 2. Fallback to any <batchId>
  const anyNode = doc.querySelector("batchId");
  if (anyNode?.textContent) {
    return parseInt(anyNode.textContent.trim(), 10);
  }

  return null;
};
export const addNewBatch = async (
  sessionId: string | number,
  projectId: string | number,
  batchId: string | number,
  batchDetails: {
    name: string;
    description: string;
  }
): Promise<any | null> => {
  const raw = `<soapenv:Envelope xmlns:soapenv=\"http://schemas.xmlsoap.org/soap/envelope/\"  xmlns:flex=\"urn:http://www.abbyy.com/FlexiCapture\"  xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\">   
        <soapenv:Header/>
        <soapenv:Body>    
            <flex:AddNewBatch>
                <flex:sessionId>${sessionId}</flex:sessionId>
                <flex:projectId>${projectId}</flex:projectId>
                <flex:batch>
                    <flex:Id>0</flex:Id>   
                    <flex:Name>${batchDetails.name}</flex:Name>   
                    <flex:ProjectId>${projectId}</flex:ProjectId>   
                    <flex:BatchTypeId>${batchId}</flex:BatchTypeId>
                    <flex:Priority>0</flex:Priority>
                    <flex:Description>${batchDetails.description}</flex:Description>   
                    <flex:HasAttachments>false</flex:HasAttachments>   
                    <flex:Properties xsi:nil=\"true\"/> 
                    <flex:CreationDate>0</flex:CreationDate>   
                    <flex:DocumentsCount>0</flex:DocumentsCount>   
                    <flex:PagesCount>0</flex:PagesCount>   
                    <flex:RecognizedSymbolsCount>0</flex:RecognizedSymbolsCount>   
                    <flex:VerificationSymbolsCount>0</flex:VerificationSymbolsCount>   
                    <flex:UncertainSymbolsCount>0</flex:UncertainSymbolsCount>   
                    <flex:AssembledDocumentsCount>0</flex:AssembledDocumentsCount>   
                    <flex:RecognizedDocumentsCount>0</flex:RecognizedDocumentsCount>   
                    <flex:VerifiedDocumentsCount>0</flex:VerifiedDocumentsCount>   
                    <flex:ExportedDocumentsCount>0</flex:ExportedDocumentsCount>   
                    <flex:StageExternalId>0</flex:StageExternalId>   
                    <flex:ErrorText></flex:ErrorText>  
                    <flex:OwnerId>0</flex:OwnerId>
                    <flex:CreatorId>5</flex:CreatorId>
                    <flex:SLAStartDate>0</flex:SLAStartDate>
                    <flex:SLAExpirationDate>0</flex:SLAExpirationDate>
                    <flex:ElapsedProcessingSeconds>0</flex:ElapsedProcessingSeconds>
                </flex:batch>
                <flex:ownerId>0</flex:ownerId> 
            </flex:AddNewBatch>
        </soapenv:Body>
        </soapenv:Envelope>`;
  const headers: AxiosRequestConfig["headers"] = {
    "Content-Type": "text/xml",
    SOAPAction: "AddNewBatch",
    Authorization: abbyConstants.token,
  };
  const response = await apiRequest(
    "POST",
    "FlexiCapture12/Server/API/v1/Soap",
    raw,
    { headers },
    ENV.ABBYY_BASE_URL
  );
  const id = extractBatchId(response);

  return id;
};

export const openBatch = async (
  sessionId: number,
  batchId: number
): Promise<boolean> => {
  const xml = `<?xml version="1.0" encoding="utf-8"?>
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:flex="urn:http://www.abbyy.com/FlexiCapture">
  <soapenv:Header/>
  <soapenv:Body>
    <flex:OpenBatch>
      <flex:sessionId>${sessionId}</flex:sessionId>
      <flex:batchId>${batchId}</flex:batchId>
    </flex:OpenBatch>
  </soapenv:Body>
</soapenv:Envelope>`;

  const headers: AxiosRequestConfig["headers"] = {
    "Content-Type": "text/xml;charset=utf-8",
    SOAPAction: "OpenBatch",
    Authorization: abbyConstants.token,
  };

  const response = await apiRequest(
    "POST",
    "FlexiCapture12/Server/API/v1/Soap",
    xml,
    { headers },
    ENV.ABBYY_BASE_URL
  );

  // 4. Check for SOAP Fault
  const doc = new DOMParser().parseFromString(response.data, "text/xml");
  const fault = doc.querySelector("faultstring");
  if (fault?.textContent) {
    console.error("OpenBatch fault:", fault.textContent.trim());
    return false;
  }

  return true;
};

export const addNewImage = async (
  sessionId: number,
  batchId: number,
  file: Blob
): Promise<void> => {
  const base64 = await blobToBase64(file);
  const fileName = (file as any).name || "contract1.pdf";

  // 2. Build SOAP Envelope matching the API docs
  const xml = `<?xml version="1.0" encoding="utf-8"?>
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
                  xmlns:flex="urn:http://www.abbyy.com/FlexiCapture">
  <soapenv:Header/>
  <soapenv:Body>
    <flex:AddNewImage>
      <flex:sessionId>${sessionId}</flex:sessionId>
      <flex:batchId>${batchId}</flex:batchId>
      <flex:file>
        <flex:Name>${fileName}</flex:Name>
        <flex:Bytes>${base64}</flex:Bytes>
      </flex:file>
    </flex:AddNewImage>
  </soapenv:Body>
</soapenv:Envelope>`;

  // 3. Send request
  const headers: AxiosRequestConfig["headers"] = {
    "Content-Type": "text/xml;charset=utf-8",
    SOAPAction: "AddNewImage",
    Authorization: abbyConstants.token,
  };

  await apiRequest(
    "POST",
    "FlexiCapture12/Server/API/v1/Soap",
    xml,
    { headers },
    ENV.ABBYY_BASE_URL
  );

  console.log("AddNewImage succeeded for batch", batchId);
};

export const closeBatch = async (
  sessionId: number,
  batchId: number
): Promise<any> => {
  const xml = `<?xml version="1.0" encoding="utf-8"?>
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
                  xmlns:flex="urn:http://www.abbyy.com/FlexiCapture">
  <soapenv:Header/>
  <soapenv:Body>
    <flex:CloseBatch>
      <flex:sessionId>${sessionId}</flex:sessionId>
      <flex:batchId>${batchId}</flex:batchId>
    </flex:CloseBatch>
  </soapenv:Body>
</soapenv:Envelope>`;

  // 2. Configure headers
  const headers: AxiosRequestConfig["headers"] = {
    "Content-Type": "text/xml;charset=utf-8",
    SOAPAction: "CloseBatch",
    Authorization: abbyConstants.token,
  };

  // 3. Send request
  const response = await apiRequest(
    "POST",
    "FlexiCapture12/Server/API/v1/Soap",
    xml,
    { headers },
    ENV.ABBYY_BASE_URL
  );
};

export const processBatch = async (
  sessionId: number,
  batchId: number
): Promise<any> => {
  const xml = `
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
                  xmlns:flex="urn:http://www.abbyy.com/FlexiCapture">
  <soapenv:Header/>
  <soapenv:Body>
    <flex:ProcessBatch>
      <flex:sessionId>${sessionId}</flex:sessionId>
      <flex:batchId>${batchId}</flex:batchId>
    </flex:ProcessBatch>
  </soapenv:Body>
</soapenv:Envelope>`;

  const headers: AxiosRequestConfig["headers"] = {
    "Content-Type": "application/xml",
    // SOAPAction: "ProcessBatch",
    Authorization: abbyConstants.token,
  };

  const response = await apiRequest(
    "POST",
    "FlexiCapture12/Server/API/v1/Soap",
    xml,
    { headers },
    ENV.ABBYY_BASE_URL
  );
};

export const getDocumentResultsList = async (
  sessionId: number,
  batchId: number,
  documentId = 1
): Promise<any | null> => {
  const xml = `
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
                  xmlns:flex="urn:http://www.abbyy.com/FlexiCapture">
        <soapenv:Header />
        <soapenv:Body>
            <flex:GetDocumentResultsList>
                <flex:sessionId>${sessionId}</flex:sessionId>
                <flex:batchId>${batchId}</flex:batchId>
                <flex:documentId>${documentId}</flex:documentId>
            </flex:GetDocumentResultsList>
        </soapenv:Body>
    </soapenv:Envelope>`;

  const headers: AxiosRequestConfig["headers"] = {
    "Content-Type": "application/xml",
    Authorization: abbyConstants.token,
  };

  const response = await apiRequest(
    "POST",
    "FlexiCapture12/Server/API/v1/Soap",
    xml,
    { headers },
    ENV.ABBYY_BASE_URL
  );

  // Parse as XML
  const doc = new DOMParser().parseFromString(response, "application/xml");

  // Detect SOAP Fault
  const fault = doc.getElementsByTagNameNS(
    "http://schemas.xmlsoap.org/soap/envelope/",
    "Fault"
  );
  if (fault.length) {
    const msg = fault[0]
      .getElementsByTagName("faultstring")[0]
      ?.textContent?.trim();
    console.error("GetDocumentResultsList SOAP Fault:", msg);
    return null;
  }

  // XPath: all <string> under <fileNames>
  const snapshot = doc.evaluate(
    "//*[local-name()='GetDocumentResultsListResponse']" +
      "/*[local-name()='fileNames']/*[local-name()='string']",
    doc,
    null,
    XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
    null
  );

  const fileNames: string[] = [];
  for (let i = 0; i < snapshot.snapshotLength; i++) {
    const node = snapshot.snapshotItem(i);
    if (node?.textContent) {
      fileNames.push(node.textContent.trim());
    }
  }

  return fileNames;
};

export const loadDocumentResult = async (
  sessionId: number,
  batchId: number,
  documentId = 1,
  expectedFileName: string
): Promise<Blob | null> => {
  const xml = `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
                  xmlns:flex="urn:http://www.abbyy.com/FlexiCapture">
  <soapenv:Header/>
  <soapenv:Body>
    <flex:LoadDocumentResult>
      <flex:sessionId>${sessionId}</flex:sessionId>
      <flex:batchId>${batchId}</flex:batchId>
      <flex:documentId>${documentId}</flex:documentId>
      <flex:fileName>${expectedFileName}</flex:fileName>
    </flex:LoadDocumentResult>
  </soapenv:Body>
</soapenv:Envelope>`;

  const headers: AxiosRequestConfig["headers"] = {
    "Content-Type": "application/xml",
    SOAPAction: "LoadDocumentResult",
    Authorization: abbyConstants.token,
  };

  const response = await apiRequest(
    "POST",
    "FlexiCapture12/Server/API/v1/Soap",
    xml,
    { headers },
    ENV.ABBYY_BASE_URL
  );

  const doc = new DOMParser().parseFromString(response, "application/xml");

  // Fault check
  const fault = doc.getElementsByTagNameNS(
    "http://schemas.xmlsoap.org/soap/envelope/",
    "Fault"
  );
  if (fault.length) {
    console.error(
      "SOAP Fault:",
      fault[0].getElementsByTagName("faultstring")[0]?.textContent
    );
    return null;
  }

  // Find <file>
  const fileEl = doc.evaluate(
    "//*[local-name()='file']",
    doc,
    null,
    XPathResult.FIRST_ORDERED_NODE_TYPE,
    null
  ).singleNodeValue as Element | null;

  if (!fileEl) {
    console.error("No <file> element in response");
    return null;
  }

  const b64 =
    fileEl.getElementsByTagName("Bytes")[0]?.textContent?.trim() || "";

  if (!b64) {
    console.error("No <Bytes> content found");
    return null;
  }

  // Build a real File
  //   const bytes = base64ToUint8Array(b64);
  //   const mime = getMimeType(name);
  //   const file = new File([bytes], name, { type: mime });

  //   return file;
  // };

  const binary = atob(b64);
  const len = binary.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) bytes[i] = binary.charCodeAt(i);
  const blob = new Blob([bytes], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
  return blob;
};
// const url = URL.createObjectURL(blob);
// const a = document.createElement("a");
// a.href = url;
// a.download = name;
// document.body.appendChild(a);
// a.click();
// a.remove();
// URL.revokeObjectURL(url);

// console.log("✅ Downloaded document:", name);
// };

export const getBatchPercentCompleted = async (
  batchId: string | number
): Promise<number | null> => {
  try {
    const xml = `<?xml version="1.0" encoding="utf-8"?>
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
                  xmlns:flex="urn:http://www.abbyy.com/FlexiCapture">
  <soapenv:Header/>
  <soapenv:Body>
    <flex:GetBatchPercentCompleted>
      <flex:batchId>${batchId}</flex:batchId>
    </flex:GetBatchPercentCompleted>
  </soapenv:Body>
</soapenv:Envelope>`;

    const headers: AxiosRequestConfig["headers"] = {
      "Content-Type": "text/xml;charset=utf-8",
      Authorization: abbyConstants.token,
    };

    const response = await apiRequest(
      "POST",
      "FlexiCapture12/Server/API/v1/Soap",
      xml,
      { headers },
      ENV.ABBYY_BASE_URL
    );
    const parser = new DOMParser();
    const doc = parser.parseFromString(response, "application/xml");

    // Check for SOAP Fault
    const fault = doc.getElementsByTagNameNS(
      "http://schemas.xmlsoap.org/soap/envelope/",
      "Fault"
    );
    if (fault.length) {
      const msg = fault[0]
        .getElementsByTagName("faultstring")[0]
        ?.textContent?.trim();
      console.error("SOAP Fault:", msg);
      return null;
    }

    // Extract <result> value from GetBatchPercentCompletedResponse
    const resultEl = doc.evaluate(
      "//*[local-name()='GetBatchPercentCompletedResponse']/*[local-name()='result']",
      doc,
      null,
      XPathResult.FIRST_ORDERED_NODE_TYPE,
      null
    ).singleNodeValue;

    const percent = resultEl?.textContent?.trim();
    const value = percent ? parseInt(percent, 10) : null;

    console.log("📊 Batch Percent Completed:", value);
    return value;
  } catch (error) {
    console.error("❌ Failed to get batch percent:", error);
    return null;
  }
};

export const waitForBatchCompletion = async (
  batchId: string | number,
  maxRetries = 100,
  delayMs = 2000
): Promise<number> => {
  for (let i = 1; i <= maxRetries; i++) {
    const percent = await getBatchPercentCompleted(batchId);
    const val = percent ?? 0;

    console.log(`🔄 Attempt ${i}/${maxRetries}: ${val}%`);
    if (val >= 100) {
      console.log("✅ Batch reached 100%");
      return 100;
    }

    if (i < maxRetries) {
      await new Promise((r) => setTimeout(r, delayMs));
    }
  }

  console.warn("⚠️ Max retries reached without getting 100%");
  const last = await getBatchPercentCompleted(batchId);
  return last ?? 0;
};
