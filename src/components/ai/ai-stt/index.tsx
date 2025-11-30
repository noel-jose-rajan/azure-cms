import React, { useState, useRef, useEffect } from "react";
import { pipeline, env, type AutomaticSpeechRecognitionPipeline } from "@xenova/transformers";
import { Button, Progress, Typography, message } from "antd";
import { useLanguage } from "@/context/language";
import { AudioOutlined } from "@ant-design/icons";

// Configure transformers environment
env.useBrowserCache = false;
env.allowRemoteModels = false;
env.allowLocalModels = true;

const { Text } = Typography;

interface Props {
  onTranscriptionComplete?: (transcription: string) => void;
  onError?: (error: string) => void;
  width?: number;
}

export default function AISTT({ onTranscriptionComplete, onError, width = 60 }: Props) {
  const { isEnglish } = useLanguage();
  const [status, setStatus] = useState<string>("Ready to load model");
  const [progress, setProgress] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [output, setOutput] = useState<string>("");
  const [modelReady, setModelReady] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [retryCount, setRetryCount] = useState<number>(0);
  const [micRetryCount, setMicRetryCount] = useState<number>(0);

  const transcriberRef = useRef<AutomaticSpeechRecognitionPipeline | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  // ---------------------------
  // Initialize ASR Model with Retry
  // ---------------------------
  const initializeTranscriber = async (attempt: number = 1) => {
    if (transcriberRef.current) return;

    const maxAttempts = 3;
    const modelOptions = ["Xenova/whisper-base"];

    try {
      setError("");
      setStatus(`Loading model (attempt ${attempt}/${maxAttempts})...`);
      setIsLoading(true);
      setProgress(0);

      const modelName = modelOptions[0];
      console.log(`Attempting to load model: ${modelName}`);

      transcriberRef.current = await pipeline("automatic-speech-recognition", modelName, {
        progress_callback: (progress: any) => {
          const percentage = progress.progress || 0;
          setStatus(`Loading: ${progress.file} (${percentage.toFixed(1)}%)`);
          setProgress(percentage);
        },
        revision: "main",
      });

      setStatus(`Model loaded successfully (${modelName}). Ready to record.`);
      setModelReady(true);
      setProgress(100);
      setRetryCount(0);

      setTimeout(() => setProgress(0), 2000);
    } catch (error: any) {
      console.error(`Model loading failed (attempt ${attempt}):`, error);

      if (attempt < maxAttempts) {
        setRetryCount(attempt);
        setStatus(`Attempt ${attempt} failed. Retrying...`);

        await new Promise((resolve) => setTimeout(resolve, 2000));
        return initializeTranscriber(attempt + 1);
      } else {
        const errorMessage = error.message || error.toString();
        setError(errorMessage);
        onError?.(errorMessage);
        setStatus("Error: Could not load model.");
        message.error("Failed to load speech recognition model. Please refresh.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      initializeTranscriber();
    }, 100);
    return () => clearTimeout(timeoutId);
  }, []);

  // ---------------------------
  // Microphone Request with Retry
  // ---------------------------
  const requestMicrophoneAccess = async (attempt: number = 1): Promise<MediaStream | null> => {
    const maxAttempts = 2;

    try {
      setStatus(`Requesting microphone access (attempt ${attempt}/${maxAttempts})...`);
      return await navigator.mediaDevices.getUserMedia({
        audio: {
          channelCount: 1,
          sampleRate: 16000,
          echoCancellation: true,
          noiseSuppression: true,
        },
      });
    } catch (error: any) {
      console.error("Microphone request failed:", error);

      if (attempt < maxAttempts) {
        setMicRetryCount(attempt);
        setStatus(`Microphone request failed. Retrying...`);
        await new Promise((resolve) => setTimeout(resolve, 1500));
        return requestMicrophoneAccess(attempt + 1);
      } else {
        setStatus("Microphone access denied.");
        message.error("Could not access microphone. Please check permissions.");
        onError?.("Microphone access denied");
        return null;
      }
    }
  };

  // ---------------------------
  // Recording Controls
  // ---------------------------
  const startRecording = async () => {
    if (!modelReady) {
      message.error("Model not ready yet. Please wait.");
      return;
    }

    const stream = await requestMicrophoneAccess();
    if (!stream) return;

    try {
      const mimeType = MediaRecorder.isTypeSupported("audio/webm;codecs=opus")
        ? "audio/webm;codecs=opus"
        : "audio/webm";

      mediaRecorderRef.current = new MediaRecorder(stream, {
        mimeType,
        audioBitsPerSecond: 16000,
      });
      chunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRecorderRef.current.onstop = handleTranscribe;

      mediaRecorderRef.current.onerror = (e) => {
        console.error("MediaRecorder error:", e);
        message.error("Recording error occurred.");
        setStatus("Recording error.");
      };

      mediaRecorderRef.current.start(1000);
      setStatus("Recording... (click Stop when finished)");
      setOutput("");
    } catch (error: any) {
      console.error("Recording start failed:", error);
      message.error("Failed to start recording.");
      setStatus("Recording failed to start.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop();

      if (mediaRecorderRef.current.stream) {
        mediaRecorderRef.current.stream.getTracks().forEach((track) => track.stop());
      }

      setStatus("Processing recording...");
    }
  };

  // ---------------------------
  // Transcription
  // ---------------------------
  const convertAudio = async (buffer: ArrayBuffer): Promise<Float32Array> => {
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)({
        sampleRate: 16000,
      });

      const decodedAudio = await audioContext.decodeAudioData(buffer);

      if (decodedAudio.sampleRate !== 16000) {
        const offlineContext = new OfflineAudioContext(1, Math.ceil(decodedAudio.duration * 16000), 16000);

        const source = offlineContext.createBufferSource();
        source.buffer = decodedAudio;
        source.connect(offlineContext.destination);
        source.start();

        const resampled = await offlineContext.startRendering();
        return resampled.getChannelData(0);
      }

      return decodedAudio.getChannelData(0);
    } catch (error) {
      console.error("Audio conversion failed:", error);
      throw new Error(`Audio processing failed: ${error}`);
    }
  };

  const handleTranscribe = async () => {
    if (!transcriberRef.current || chunksRef.current.length === 0) {
      message.warning("No audio data to transcribe.");
      return;
    }

    try {
      setIsLoading(true);
      setOutput("");
      setStatus("Transcribing audio...");

      const blob = new Blob(chunksRef.current, { type: "audio/webm" });
      if (blob.size === 0) throw new Error("No audio data recorded");

      const buffer = await blob.arrayBuffer();
      const audioData = await convertAudio(buffer);

      if (audioData.length === 0) throw new Error("Audio conversion returned empty data");

      // @ts-ignore
      const result = await transcriberRef.current(audioData, {
        chunk_length_s: 30,
        stride_length_s: 5,
        language: isEnglish ? "english" : "arabic",
        task: "transcribe",
        return_timestamps: false,
      });

      // @ts-ignore
      const transcription = result.text.trim();

      if (transcription) {
        setOutput(transcription);
        onTranscriptionComplete?.(transcription);
        setStatus("Transcription complete.");
        message.success("Transcription completed!");
      } else {
        setOutput("No speech detected.");
        setStatus("No speech detected.");
        message.info("No speech was detected in the recording.");
      }
    } catch (error: any) {
      console.error("Transcription failed:", error);
      const errorMsg = error.message || "Unknown transcription error";
      setStatus(`Transcription failed: ${errorMsg}`);
      setOutput(`Error: ${errorMsg}`);
      message.error("Transcription failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const isRecording = mediaRecorderRef.current?.state === "recording";
  const buttonSize = width * 0.8;

  return (
    <>
      <div
        style={{
          position: "relative",
          width: width,
          height: width,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Progress
          type="circle"
          percent={isLoading ? progress : 100}
          width={width}
          strokeWidth={5}
          strokeColor={isRecording ? "transparent" : isLoading ? "#1890ff" : "#f0f0f0"}
          trailColor="transparent"
          format={() => ""}
          style={{ position: "absolute" }}
        />

        {isRecording && (
          <div className="siri-waves-container">
            <div className="wave-ring" style={{ "--wave-color": "#68c4ff", animationDelay: "0s" } as any}></div>
            <div className="wave-ring" style={{ "--wave-color": "#ff68c4", animationDelay: "-0.5s" } as any}></div>
            <div className="wave-ring" style={{ "--wave-color": "#c4ff68", animationDelay: "-1s" } as any}></div>
            <div className="wave-ring" style={{ "--wave-color": "#ffc468", animationDelay: "-1.5s" } as any}></div>
          </div>
        )}

        <Button
          type="primary"
          shape="circle"
          icon={<AudioOutlined style={{ color: isRecording ? "#fff" : "#555" }} />}
          size="large"
          onClick={isRecording ? stopRecording : startRecording}
          disabled={!modelReady && isLoading}
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: buttonSize,
            height: buttonSize,
            fontSize: width / 3.5,
            background: isRecording ? "#ff4d4f" : "#ffffff",
            border: "1px solid #e0e0e0",
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            zIndex: 10,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        />
      </div>

      <style>{`
        .siri-waves-container {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
        }

        .wave-ring {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          border-radius: 50%;
          border: 2px solid var(--wave-color);
          opacity: 0;
          animation-name: siri-pulse;
          animation-duration: 2s;
          animation-iteration-count: infinite;
          animation-timing-function: cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }

        @keyframes siri-pulse {
          0% {
            transform: scale(0.8);
            opacity: 0;
          }
          50% {
            opacity: 1;
          }
          100% {
            transform: scale(1.4);
            opacity: 0;
          }
        }
      `}</style>
    </>
  );
}
