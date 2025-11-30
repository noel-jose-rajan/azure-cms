import { useState, useEffect, useRef, CSSProperties } from "react";
import { Button, Drawer, Input, Upload, UploadProps } from "antd";
import {
  MessageOutlined,
  PaperClipOutlined,
  SendOutlined,
} from "@ant-design/icons";
import { useLanguage } from "../../../../context/language";
import { askWithAIChatBot } from "../../../services/nlp";
import { HttpStatus } from "../../../functional/httphelper";
import {
  downloadCorrespondenceDocument,
  uploadNewDocumentToChat,
} from "@/components/services/advanced-ai";

interface Props {
  taskData: Record<string, any>;
}

interface ChatMessage {
  role: "user" | "ai" | "system";
  content: string;
}

export default function AiChatModal({ taskData }: Props) {
  const [question, setQuestion] = useState("");
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const { isEnglish } = useLanguage();
  const [sessionId, setSessionid] = useState<string>("");
  const [selectedFile, setSelectedFile] = useState<File>();

  // useEffect(() => {
  //   if (taskData) {
  //     getCorresDocuments(taskData.corrDetails.id);
  //   }
  // }, [taskData]);

  // const getCorresDocuments = async (taskId: string) => {
  //   const response = await downloadCorrespondenceDocument(taskId);

  //   if (response.status === HttpStatus.SUCCESS) {
  //     const documents = response.data;
  //     await uploadCorrespondenceDocument(documents);
  //   } else {
  //     console.log("Failed to fetch task documents.");
  //   }
  // };

  const uploadCorrespondenceDocument = async (data: any) => {
    const formData = new FormData();
    formData.append("file", data);
    const response = await uploadNewDocumentToChat(formData);
    if (response.status === HttpStatus.SUCCESS) {
      console.log("Document uploaded successfully.", response.data);
    } else {
    }
  };

  useEffect(() => {
    if (selectedFile) {
      uploadCorrespondenceDocument(selectedFile);
    }
  }, [selectedFile]);

  const handleQuestionSubmit = async () => {
    if (!question.trim()) return;
    setLoading(true);

    try {
      const formData = new FormData();
      const parameter = `Task Details: ${JSON.stringify(
        taskData
      )}\nQuestion: ${question}\ndont mention the data as json or anything. just try to answer the like a co-worker asking help to understand the task in english\n and politely refuse if the question is not related to the task`;
      formData.append("parameter", parameter);
      formData.append("prompt", question);
      if (sessionId) {
        formData.append("session_id", sessionId);
      }

      setChatHistory((prev) => [...prev, { role: "user", content: question }]);
      const response = await askWithAIChatBot(formData);
      const data = response?.data?.data;
      if (
        response.status === HttpStatus.SUCCESS &&
        Array.isArray(data) &&
        data.length > 0
      ) {
        const aiResponse = data[0];

        setChatHistory((prev) => [
          ...prev,
          {
            role: "ai",
            content: aiResponse.response || "No response from AI.",
          },
        ]);

        if (aiResponse.session_id) {
          setSessionid(aiResponse.session_id);
        }

        setQuestion("");
      } else {
        setChatHistory((prev) => [
          ...prev,
          {
            role: "system",
            content: "There was an error with the AI service.",
          },
        ]);
      }
    } catch (error) {
      setChatHistory((prev) => [
        ...prev,
        {
          role: "system",
          content: "There was an error with the AI service.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [chatHistory]);

  const buttonStyle = isEnglish ? { right: 24 } : { left: 24 };

  const props: UploadProps = {
    beforeUpload: (file) => {
      setSelectedFile(file as File);
      return false;
    },
    type: "select",
    showUploadList: false,
    maxCount: 1,
    accept: "application/pdf",
    onRemove: () => {
      setSelectedFile(undefined);
    },
  };

  return (
    <>
      <Drawer
        placement="right"
        closable={true}
        onClose={() => setOpen(false)}
        open={open}
        width={500}
        title={<div style={{ backgroundColor: "#fff" }}>Ask me Something.</div>}
        style={{
          borderTopLeftRadius: 10,
          borderTopRightRadius: 10,
          backgroundColor: "#fff",
        }}
        bodyStyle={{
          display: "flex",
          flexDirection: "column",
          height: "100%",
          padding: "8px",
          backgroundColor: "transparent",
        }}
        maskStyle={{
          backgroundColor: "transparent",
        }}
      >
        <div style={styles.chatContainer} ref={scrollRef}>
          {chatHistory.map((msg, idx) => (
            <div
              style={{
                display: "flex",
                width: "100%",
                ...(msg.role === "user"
                  ? { justifyContent: "right" }
                  : msg.role === "ai"
                  ? { justifyContent: "left" }
                  : { justifyContent: "center" }),
              }}
            >
              <div
                key={idx}
                style={{
                  ...styles.messageBubble,
                  ...(msg.role === "user"
                    ? styles.userBubble
                    : msg.role === "ai"
                    ? styles.aiBubble
                    : styles.systemBubble),
                }}
              >
                <p
                  style={msg.role === "user" ? styles.userText : styles.aiText}
                >
                  {msg.content}
                </p>
              </div>
            </div>
          ))}
        </div>
        <div style={styles.inputContainer}>
          <Input
            type="text"
            placeholder="Ask a question about this task..."
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            disabled={loading}
            style={styles.input}
            suffix={
              <>
                <Upload {...props}>
                  <PaperClipOutlined style={{ marginRight: 15 }} />
                </Upload>
                <SendOutlined
                  onClick={handleQuestionSubmit}
                  disabled={loading || !question.trim()}
                />
              </>
            }
          />
        </div>
      </Drawer>
      <Button
        type="primary"
        shape="circle"
        icon={<MessageOutlined />}
        size="large"
        onClick={() => setOpen(true)}
        style={{
          position: "fixed",
          bottom: 24,
          zIndex: 5,
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
          ...buttonStyle,
        }}
      />
    </>
  );
}

const styles: { [x: string]: CSSProperties } = {
  chatContainer: {
    flex: 1,
    padding: 20,
    overflowY: "auto",
    width: "100%",
  },
  messageBubble: {
    maxWidth: "75%",
    padding: "10px 15px",
    borderRadius: 20,
    marginBottom: 10,
  },
  userBubble: {
    backgroundColor: "#007aff",
    color: "#fff",
    alignSelf: "flex-end",
    borderTopRightRadius: 0,
  },
  aiBubble: {
    backgroundColor: "#e5e5ea",
    color: "#000",
    alignSelf: "flex-start",
    borderTopLeftRadius: 0,
  },
  systemBubble: {
    backgroundColor: "#ffe5e5",
    color: "#900",
    alignSelf: "center",
    textAlign: "center",
  },
  userText: {
    color: "#fff",
    margin: 0,
  },
  aiText: {
    color: "#000",
    margin: 0,
  },
  inputContainer: {
    display: "flex",
    padding: 10,
    borderTop: "1px solid #ccc",
    gap: 10,
    alignItems: "center",
    paddingTop: 20,
  },
  input: {
    flex: 1,
    padding: 10,
    borderRadius: 20,
    border: "1px solid #ccc",
    outline: "none",
  },
};
