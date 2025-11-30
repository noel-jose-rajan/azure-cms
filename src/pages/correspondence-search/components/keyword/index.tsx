import { CSSProperties, useEffect, useRef, useState } from "react";
import { Input } from "antd";
import { ArrowRightOutlined } from "@ant-design/icons";
import { useTheme } from "@/context/theme";
import { useLanguage } from "@/context/language";
import SmartAudioRecorder from "@/components/ui/nlp/voice-to-text";
import AudioFromTextButton from "@/components/ui/nlp/text-to-speech";

interface MaterialInputProps {
  label: string;
  error?: string;
  [x: string]: any;
  allowEdit?: boolean;
  style?: CSSProperties;
  enableTranscript?: boolean;
  applyReverse?: boolean;
}

export function MaterialTextArea({
  label,
  error,
  value,
  onBlur,
  allowEdit = true,
  style,
  onChange,
  enableTranscript = true,
  applyReverse = false,
  ...rest
}: MaterialInputProps) {
  const [focused, setFocused] = useState<boolean>(false);
  const { theme } = useTheme();
  const { isEnglish } = useLanguage();
  const [recording, setRecording] = useState<boolean>(false);
  const [seconds, setSeconds] = useState(0);
  const intervalRef = useRef<any>(null);

  const startTimer = () => {
    if (!recording) {
      intervalRef.current = setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);
    }
  };

  const stopTimer = () => {
    clearInterval(intervalRef.current);
    setSeconds(0);
  };

  useEffect(() => {
    return () => clearInterval(intervalRef.current);
  }, []);

  const labelStyles: CSSProperties = {
    position: "absolute",
    top: focused || value ? "-10px" : "50%",
    transform: focused || value ? "translateY(0)" : "translateY(-50%)",
    fontSize: focused || value ? "12px" : "16px",
    color: focused ? theme.colors.primary : "grey",
    transition: "all 0.3s ease",
    pointerEvents: "none",
  };

  const wrapperStyles: CSSProperties = {
    position: "relative",
    width: "100%",
    borderBottom: `1px solid ${
      error ? theme.colors.danger : theme.colors.success
    }`,
  };

  const inputStyles: CSSProperties = {
    padding: "8px 10px",
    width: "100%",
    border: "none",
    borderRadius: "0",
    outline: "none",
    transition: "border-color 0.3s ease",
    boxShadow: "none",
    resize: "none", // optional: prevent resize
  };

  const underlineStyles: CSSProperties = {
    position: "absolute",
    bottom: "0",
    left: "0",
    height: "2px",
    width: focused ? "100%" : "0",
    transition: "width 0.3s ease",
  };

  const getColor = (): string => {
    if (error) return theme.colors.danger;
    if (focused) return theme.colors.success;
    if (!value) return error ? theme.colors.danger : "grey";
    return "grey";
  };

  const formatTime = (sec: number) => {
    return `${String(Math.floor(sec / 60)).padStart(2, "0")}:${String(
      sec % 60
    ).padStart(2, "0")}`;
  };

  return (
    <>
      <div style={{ ...wrapperStyles, ...style }}>
        <label
          style={{
            ...labelStyles,
            zIndex: 1000,
            color: getColor(),
            ...(isEnglish ? { left: "8px" } : { right: "8px" }),
          }}
        >
          {label}
        </label>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexDirection: !applyReverse || isEnglish ? "row" : "row-reverse",
          }}
        >
          <div
            style={{
              display: "flex",
              position: "relative",
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              minHeight: 45,
            }}
          >
            {recording ? (
              <div
                style={{
                  width: "100%",
                  display: "flex",
                  flex: 1,
                  position: "relative",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <a style={{ marginLeft: 5 }}>{formatTime(seconds)}</a>
                <p style={{ marginLeft: 5, fontSize: 14 }}>
                  {isEnglish ? "Click to Stop" : "اضغط للتوقف"}
                  <ArrowRightOutlined style={{ marginLeft: 5 }} />
                </p>
              </div>
            ) : (
              <Input.TextArea
                onFocus={() => setFocused(true)}
                onBlur={(e) => {
                  if (onBlur) onBlur(e);
                  setFocused(false);
                }}
                value={value}
                disabled={!allowEdit}
                autoComplete="off"
                onChange={onChange}
                style={{
                  ...inputStyles,
                  resize: "vertical",
                }}
                rows={1}
                {...rest}
              />
            )}
          </div>
          {enableTranscript && allowEdit ? (
            <SmartAudioRecorder
              onTranscript={(text: string) =>
                onChange({ target: { value: text } })
              }
              updateRecording={(recording: boolean) => {
                setRecording(recording);
                setFocused(recording);
                if (recording) {
                  startTimer();
                } else {
                  stopTimer();
                }
              }}
            />
          ) : null}
          {enableTranscript && value !== "" && allowEdit ? (
            <AudioFromTextButton text={value} />
          ) : null}
        </div>
        <div
          style={{
            ...underlineStyles,
            backgroundColor: error ? "#DB4437" : "#0F9D58",
          }}
        ></div>
      </div>
      <p style={{ color: "red", fontSize: 10, marginTop: 0, marginBottom: 0 }}>
        {error}
      </p>
    </>
  );
}
