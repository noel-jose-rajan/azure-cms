import { useEffect, useRef, useState } from "react";
import ENV from "@/constants/env";
import { useLanguage } from "@/context/language";
import { useTheme } from "@/context/theme";
import {
  Button,
  ConfigProvider,
  Drawer,
  Dropdown,
  FloatButton,
  Input,
  Spin,
  message,
} from "antd";

import "./drawer-scrollbar.css";
import {
  SendOutlined,
  CopyOutlined,
  MessageOutlined,
  WechatWorkOutlined,
} from "@ant-design/icons";
import "highlight.js/styles/github.css";
import DeepSeek from "../../../../assets/deepseek.png";
import Llama from "../../../../assets/llama.png";
import MistralAi from "../../../../assets/mistralai.png";

import Markdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";
import { ItemType } from "antd/es/menu/interface";
import AISTT from "@/components/ai/ai-stt";
import Suggestions from "./components/Suggestions";
import { downloadCorrespondencePDF } from "@/components/services/advanced-ai";
import { motion } from "framer-motion";

const { TextArea } = Input;

type Lang = "English" | "Arabic";

interface MessageType {
  role: "user" | "assistant";
  content: string;
}

const translations: Record<Lang, Record<string, string>> = {
  English: {
    appTitle: "Ask AI",
    askPlaceholder: "Ask me anything...",
    askButton: "Ask AI",
    initialAnswer: "Ask a question to get started...",
    uploadSuccess: "Upload successful! File is ready for questions.",
    uploadError: "Upload failed. Please try again.",
  },
  Arabic: {
    appTitle: "اسأل الذكاء الاصطناعي",
    askPlaceholder: "اسألني أي شيء...",
    askButton: "اسأل الذكاء الاصطناعي",
    initialAnswer: "ابدأ بطرح سؤال...",
    uploadSuccess: "تم الرفع بنجاح! الملف جاهز للأسئلة.",
    uploadError: "فشل الرفع. حاول مرة أخرى.",
  },
};

interface Props {
  correspondenceId: string;
  subject: string;
  isPdf: boolean;
}

export default function CorrespondenceExplainerAI({
  correspondenceId,
  subject,
  isPdf,
}: Props) {
  const { isEnglish } = useLanguage();
  const { theme } = useTheme();
  const [query, setQuery] = useState("");
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [fileList, setFileList] = useState<any[]>([]);
  const [files, setFiles] = useState<string[]>([]);
  const [chatId, setChatId] = useState<string>("");
  const [model, setModel] = useState("llama3.1:8b");
  const [open, setOpen] = useState(false);
  const [drawerWidth, setDrawerWidth] = useState(600);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [initialUpload, setInitialUpload] = useState<{
    completed: boolean;
    error: boolean;
    retryCount: number;
  }>({ completed: false, error: false, retryCount: 1 });

  const t = translations[isEnglish ? "English" : "Arabic"];

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      message.success("Code copied to clipboard!");
    } catch (err) {
      message.error("Failed to copy code");
    }
  };

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  useEffect(() => {
    const initChat = async () => {
      try {
        const res = await fetch(`${ENV.AI_BASE_URL}/chat/id`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ user: { id: "noel" } }),
        });
        if (!res.ok) throw new Error("Failed to create chat");
        const data = await res.json();
        setChatId(data.chatId);
      } catch {
        message.error("Could not initialize chat");
      }
    };
    initChat();
  }, []);

  useEffect(() => {
    if (open && !initialUpload.completed) {
      downloadPDF();
    }
  }, [open]);

  const downloadPDF = async () => {
    if (!chatId) return;
    const result = await downloadCorrespondencePDF(correspondenceId, isPdf);
    if (result) {
      await uploadDocToChat(result, true);
    } else {
      message.error("Failed to download PDF");
    }
  };

  const uploadDocToChat = async (file: File | Blob, initialUpload: boolean) => {
    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    fetch(`${ENV.AI_BASE_URL}/${chatId}/upload`, {
      method: "POST",
      body: formData,
    })
      .then(async (res) => {
        if (res.ok) {
          message.success(t.uploadSuccess);
          setFileList([]);
          await fetchFiles();
          if (initialUpload) {
            setInitialUpload((prev) => ({
              ...prev,
              error: false,
              completed: true,
            }));
          }
        } else {
          throw new Error("Upload failed");
        }
      })
      .catch(() => {
        if (initialUpload) {
          setInitialUpload((prev) => ({
            ...prev,
            error: true,
            completed: true,
          }));
        }
        message.error(t.uploadError);
      })
      .finally(() => setUploading(false));
  };

  const fetchFiles = async () => {
    try {
      const res = await fetch(`${ENV.AI_BASE_URL}/chats/${chatId}/files`);
      if (!res.ok) throw new Error("Failed to fetch files");
      const data = await res.json();
      setFiles(data.files || []);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAsk = async (query: string) => {
    if (!query.trim()) return;
    setMessages((prev) => [...prev, { role: "user", content: query }]);
    setQuery("");
    setLoading(true);
    let assistantMessage = "";
    setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 60000); // auto abort after 60s

    try {
      const response = await fetch(`${ENV.AI_BASE_URL}/ask`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query,
          language: isEnglish ? "English" : "Arabic",
          chatId,
          documentNames: files,
          model,
        }),
        signal: controller.signal,
      });

      if (!response.ok || !response.body) throw new Error("No response");
      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { value, done } = await reader.read();
        if (done) break; // ✅ ensures exit
        const chunk = decoder.decode(value, { stream: true });
        if (chunk) {
          assistantMessage += chunk;
          setMessages((prev) => {
            const updated = [...prev];
            updated[updated.length - 1] = {
              role: "assistant",
              content: assistantMessage,
            };
            return updated;
          });
        }
      }
    } catch (err: any) {
      if (err.name === "AbortError") {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: "Request timed out. Please try again.",
          },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: `${t.uploadError} (${err.message})` },
        ]);
      }
    } finally {
      clearTimeout(timeout);
      setLoading(false); // ✅ always called
    }
  };

  // const handleAsk = async () => {
  //   if (!query.trim()) return;
  //   setMessages((prev) => [...prev, { role: "user", content: query }]);
  //   setQuery("");
  //   setLoading(true);
  //   let assistantMessage = "";
  //   setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

  //   try {
  //     const response = await fetch(`${ENV.AI_BASE_URL}/ask`, {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({
  //         query,
  //         language: isEnglish ? "English" : "Arabic",
  //         chatId,
  //         documentNames: files,
  //         model,
  //       }),
  //     });
  //     if (!response.ok || !response.body) throw new Error("No response");
  //     const reader = response.body.getReader();
  //     const decoder = new TextDecoder();
  //     while (true) {
  //       const { value, done } = await reader.read();
  //       if (done) break;
  //       const chunk = decoder.decode(value, { stream: true });
  //       if (chunk) {
  //         assistantMessage += chunk;
  //         setMessages((prev) => {
  //           const updated = [...prev];
  //           updated[updated.length - 1] = {
  //             role: "assistant",
  //             content: assistantMessage,
  //           };
  //           return updated;
  //         });
  //       }
  //     }
  //     setLoading(false);
  //   } catch (err: any) {
  //     setMessages((prev) => [
  //       ...prev,
  //       { role: "assistant", content: `${t.uploadError} (${err.message})` },
  //     ]);
  //     setLoading(false);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const styles: { [x: string]: React.CSSProperties } = {
    dropdownItem: {
      display: "flex",
      alignItems: "center",
      gap: "8px",
    },
    modelIcons: {
      width: 20,
      height: 20,
    },
  };

  const modelMenu: ItemType[] = [
    {
      key: "mistral:7b",
      label: (
        <div style={styles.dropdownItem}>
          <img src={MistralAi} alt="Mistral 7B" style={styles.modelIcons} />
          <span>Mistral 7B</span>
        </div>
      ),
      style: {
        margin: 0,
        backgroundColor:
          model === "mistral:7b" ? theme.colors.accent : "transparent",
        color: model === "llama3.1:8b" ? theme.colors.text : "inherit",
      },
    },
    {
      key: "deepseek-r1:7b",
      label: (
        <div style={styles.dropdownItem}>
          <img src={DeepSeek} alt="DeepSeek R1 7B" style={styles.modelIcons} />
          <span>DeepSeek R1 7B</span>
        </div>
      ),
      style: {
        margin: 0,
        backgroundColor:
          model === "deepseek-r1:7b" ? theme.colors.accent : "transparent",
        color: model === "llama3.1:8b" ? theme.colors.text : "inherit",
      },
    },
    {
      key: "llama3.1:8b",

      label: (
        <div style={styles.dropdownItem}>
          <img src={Llama} alt="Llama 3.1 8B" style={styles.modelIcons} />
          <span>Llama 3.1 8B</span>
        </div>
      ),
      style: {
        margin: 0,
        backgroundColor:
          model === "llama3.1:8b" ? theme.colors.accent : "transparent",
        color:
          model === "llama3.1:8b" ? theme.colors.backgroundText : "inherit",
      },
    },
  ];

  return (
    <>
      <FloatButton
        icon={<MessageOutlined />}
        type="primary"
        style={{ right: 24, bottom: 24, zIndex: 1300 }}
        onClick={() => setOpen((v) => !v)}
      />

      {/* Collapse Arrow on Drawer Edge */}
      {/* {open && (
        <div
          style={{
            position: 'fixed',
            // top: '50%',
            // right: drawerWidth - 16,
            right: 24, bottom: 24,
            transform: 'translateY(-50%)',
            zIndex: 1300,
            background: '#fff',
            borderRadius: '50%',
            boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
            width: 32,
            height: 32,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            border: '1px solid #eee',
            transition: 'background 0.2s',
          }}
          onClick={() => setOpen(false)}
          onMouseOver={e => (e.currentTarget.style.background = '#f5f5f5')}
          onMouseOut={e => (e.currentTarget.style.background = '#fff')}
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M13 10L8 5V15L13 10Z" fill="#888" />
          </svg>
        </div>
      )} */}

      <Drawer
        // title={correspondenceId + " - " + subject}
        placement="right"
        width={drawerWidth}
        onClose={() => setOpen(false)}
        open={open}
        styles={{
          wrapper: {
            margin: "1rem 2rem 6rem 0px",
            borderRadius: "10px",
            overflow: "hidden",
          },
          mask: {
            background: "rgba(0,0,0,0.2)",
          },
          header: {
            height: 0,
            padding: "1px 0px",
            display: "flex",
            alignItems: "center",
            fontSize: "1rem",
            background: "#fafafa",
            borderBottom: "1px solid #eee",
            opacity: 0,
          },
          body: {
            padding: 0,
            display: "flex",
            flexDirection: "column",
            height: "100%",
          },
        }}
        //@ts-ignore
        resizable
        //@ts-ignore
        onResize={(e) => setDrawerWidth(Math.min(800, Math.max(360, e.width)))}
        title={null}
      >
        <ConfigProvider direction={isEnglish ? "ltr" : "rtl"}>
          {!initialUpload.completed && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                height: "100vh",
                backgroundColor: "#fff",
              }}
            >
              <motion.div
                style={{
                  width: "128px",
                  height: "128px",
                  borderRadius: "50%",
                  background:
                    "linear-gradient(90deg, indigo, purple, deeppink)",
                }}
                animate={{
                  borderRadius: ["50%", "40%", "60%", "50%"],
                  scale: [1, 1.1, 0.9, 1],
                  rotate: [0, 90, 180, 360],
                }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            </div>
          )}
          {initialUpload.error && (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                flexDirection: "column",
                alignItems: "center",
                textAlign: "center",
                color: "#888",
                height: 400,
              }}
            >
              {isEnglish
                ? "Failed to initiate AI assistant"
                : "فشل تحميل المساعد الذكي"}
              {initialUpload.retryCount < 3 && (
                <Button
                  type="primary"
                  loading={uploading}
                  onClick={async () => {
                    if (initialUpload.retryCount < 3) {
                      await downloadPDF();
                      setInitialUpload((prev) => ({
                        ...prev,
                        retryCount: prev.retryCount + 1,
                      }));
                    }
                  }}
                  style={{ marginTop: 30 }}
                >
                  {isEnglish ? "Retry" : "إعادة المحاولة"}
                </Button>
              )}
            </div>
          )}
          {initialUpload.completed && !initialUpload.error && (
            <>
              <div
                ref={scrollContainerRef}
                style={{
                  flex: 1,
                  overflowY: "auto",
                  padding: 16,
                  //   background: "#fafafa",
                  scrollbarWidth: "thin",
                  scrollbarColor: "#e0e0e0 #fafafa",
                }}
                className="drawer-scroll-area"
              >
                {messages.length === 0 && (
                  <div style={{ textAlign: "center", color: "#888" }}>
                    {t.initialAnswer}
                  </div>
                )}
                {messages.map((msg, idx) => (
                  <div
                    key={idx}
                    style={{
                      display: "flex",
                      justifyContent:
                        msg.role === "user" ? "flex-end" : "flex-start",
                      marginBottom: 12,
                    }}
                  >
                    <div
                      style={{
                        maxWidth: "80%",
                        padding: "10px 14px",
                        borderRadius: 16,
                        background:
                          msg.role === "user"
                            ? theme.colors.accent
                            : theme.colors.background,
                        // boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
                        wordBreak: "break-word",
                        color: msg.role === "user" ? "#fff" : theme.colors.text,
                      }}
                    >
                      <div style={{ width: "100%" }}>
                        {msg.role !== "user" && (
                          <WechatWorkOutlined
                            style={{ color: theme.colors.accent, fontSize: 30 }}
                          />
                        )}
                      </div>
                      <Markdown
                        remarkPlugins={[remarkGfm]}
                        rehypePlugins={[rehypeRaw, rehypeHighlight]}
                        components={{
                          code: ({
                            node,
                            className,
                            children,
                            ...props
                          }: any) => {
                            const match = /language-(\w+)/.exec(
                              className || ""
                            );
                            const inline = !match;
                            const codeText = String(children).replace(
                              /\n$/,
                              ""
                            );

                            return !inline ? (
                              <div
                                style={{
                                  position: "relative",
                                  margin: "8px 0",
                                }}
                              >
                                <pre
                                  style={{
                                    background: "rgba(255,255,255,0.1)",
                                    padding: "12px 40px 12px 12px",
                                    borderRadius: "6px",
                                    overflow: "auto",
                                    border: "1px solid rgba(255,255,255,0.2)",
                                    margin: 0,
                                  }}
                                >
                                  <Button
                                    type="text"
                                    size="small"
                                    icon={<CopyOutlined />}
                                    onClick={() => copyToClipboard(codeText)}
                                    style={{
                                      position: "absolute",
                                      top: "8px",
                                      right: "8px",
                                      border: "none",
                                      padding: "4px 8px",
                                    }}
                                  />
                                  <code className={className} {...props}>
                                    {children}
                                  </code>
                                </pre>
                              </div>
                            ) : (
                              <code
                                style={{
                                  background: "rgba(255,255,255,0.2)",
                                  borderRadius: "4px",
                                  fontSize: "0.9em",
                                  padding: "2px 6px",
                                }}
                                {...props}
                              >
                                {children}
                              </code>
                            );
                          },
                          p: ({ children }) => (
                            <p style={{ margin: "8px 0", lineHeight: "1.5" }}>
                              {children}
                            </p>
                          ),
                          h1: ({ children }) => (
                            <h1
                              style={{
                                margin: "16px 0 8px 0",
                                fontSize: "1.4em",
                                fontWeight: "bold",
                              }}
                            >
                              {children}
                            </h1>
                          ),
                          h2: ({ children }) => (
                            <h2
                              style={{
                                margin: "14px 0 6px 0",
                                fontSize: "1.2em",
                                fontWeight: "bold",
                              }}
                            >
                              {children}
                            </h2>
                          ),
                          h3: ({ children }) => (
                            <h3
                              style={{
                                margin: "12px 0 4px 0",
                                fontSize: "1.1em",
                                fontWeight: "bold",
                              }}
                            >
                              {children}
                            </h3>
                          ),
                          blockquote: ({ children }) => (
                            <blockquote
                              style={{
                                borderLeft: "4px solid rgba(255,255,255,0.3)",
                                paddingLeft: "16px",
                                margin: "16px 0",
                                fontStyle: "italic",
                                background: "rgba(255,255,255,0.05)",
                                padding: "8px 16px",
                                borderRadius: "4px",
                              }}
                            >
                              {children}
                            </blockquote>
                          ),
                          ul: ({ children }) => (
                            <ul
                              style={{ paddingLeft: "20px", margin: "8px 0" }}
                            >
                              {children}
                            </ul>
                          ),
                          ol: ({ children }) => (
                            <ol
                              style={{ paddingLeft: "20px", margin: "8px 0" }}
                            >
                              {children}
                            </ol>
                          ),
                          li: ({ children }) => (
                            <li style={{ margin: "4px 0" }}>{children}</li>
                          ),
                          strong: ({ children }) => (
                            <strong style={{ fontWeight: "bold" }}>
                              {children}
                            </strong>
                          ),
                          em: ({ children }) => (
                            <em style={{ fontStyle: "italic" }}>{children}</em>
                          ),
                        }}
                      >
                        {/* replace all instances of the correspondenceId with "Correspondence Document" */}
                        {msg.content
                          .replace(
                            correspondenceId + ".pdf",
                            "Correspondence Document"
                          )
                          .replace(
                            /([a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12})-/g,
                            ""
                          )
                          .replace(correspondenceId + ".pdf", "C")}
                      </Markdown>
                      {/* <TextToSpeech text={msg.content} /> */}
                    </div>
                  </div>
                ))}
                {loading && (
                  <div
                    style={{ display: "flex", justifyContent: "flex-start" }}
                  >
                    <Spin />
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              <div
                style={{
                  margin: 0,
                  borderRadius: 0,
                  borderBottom: "1px solid #f0f0f0",
                  padding: 10,
                }}
              >
                <div
                  style={{
                    borderRadius: 0,
                    margin: "5px 0",
                  }}
                >
                  <Suggestions
                    fileList={files}
                    handleAsk={(query) => handleAsk(query)}
                  />
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    width: "100%",
                    flex: 1,
                    gap: 8,
                    alignItems: "center",
                  }}
                >
                  <div
                    style={{
                      flex: 1,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <TextArea
                      rows={1}
                      value={query}
                      style={{ flex: 1 }}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder={t.askPlaceholder}
                      onPressEnter={(e) => {
                        if (e.ctrlKey || e.metaKey) handleAsk(query);
                      }}
                    />
                  </div>

                  <div
                    style={{
                      display: "flex",
                      gap: 8,
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <AISTT
                      width={50}
                      onTranscriptionComplete={(transcription) =>
                        setQuery((q) => (q ? q + " " : "") + transcription)
                      }
                    />
                    <Button
                      type="primary"
                      icon={<SendOutlined style={{ fontSize: 20 }} />}
                      style={{ height: 40, width: 40, borderRadius: 12 }}
                      loading={loading}
                      onClick={() => handleAsk(query)}
                      disabled={uploading || query.trim() === ""}
                    ></Button>
                    <Dropdown
                      menu={{
                        items: modelMenu,
                        onClick: ({ key }) => setModel(key),
                        style: { margin: 0 },
                      }}
                      placement="bottomRight"
                      trigger={["click"]}
                      disabled={uploading}
                    >
                      <Button
                        type="text"
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "4px",
                          padding: "4px 8px",
                        }}
                      >
                        {model === "mistral:7b" && (
                          <img
                            src={MistralAi}
                            alt="Mistral 7B"
                            style={styles.modelIcons}
                          />
                        )}
                        {model === "deepseek-r1:7b" && (
                          <img
                            src={DeepSeek}
                            alt="DeepSeek R1 7B"
                            style={styles.modelIcons}
                          />
                        )}
                        {model === "llama3.1:8b" && (
                          <img
                            src={Llama}
                            alt="Llama 3.1 8B"
                            style={styles.modelIcons}
                          />
                        )}
                      </Button>
                    </Dropdown>
                    {/* <Upload
                      beforeUpload={async (file) => {
                        setFileList([file]);
                        await uploadDocToChat(file, false);
                        return false;
                      }}
                      fileList={fileList}
                      onRemove={() => setFileList([])}
                      accept="application/pdf"
                      showUploadList={false}
                      disabled={loading || uploading}
                    >
                      <Button
                        type="text"
                        icon={<PaperClipOutlined />}
                        loading={uploading}
                      />
                    </Upload> */}
                  </div>
                </div>
              </div>
            </>
          )}
        </ConfigProvider>
      </Drawer>
    </>
  );
}
