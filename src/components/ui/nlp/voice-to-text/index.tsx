import { AudioOutlined } from "@ant-design/icons";
import { Button } from "antd";
import Lottie from "lottie-react";
import { useEffect, useRef, useState } from "react";
import Animation from "../../../../assets/animations/recording.json";
import { gCPSpeechToText } from "../../../services/nlp";
import PermissionManager from "../../../functional/permissions";
import {
  PermissionStatus,
  PermissionTypes,
} from "../../../../constants/permissions";
import { HttpStatus } from "../../../functional/httphelper";

declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

const SmartAudioRecorder = ({
  onTranscript,
  updateRecording,
}: {
  onTranscript?: (text: string) => void;
  updateRecording?: (recording: boolean) => void;
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const recognitionRef = useRef<any>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const [useWebAPI, setUseWebAPI] = useState<boolean>(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = "en-US";

      recognition.onresult = (event: any) => {
        let finalTranscript = "";
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          finalTranscript += event.results[i][0].transcript;
        }

        if (finalTranscript.trim()) {
          onTranscript?.(finalTranscript);
          stopRecording();
        }
      };

      recognitionRef.current = recognition;
      // setUseWebAPI(true); // Enable if preferred
    } else {
      setUseWebAPI(false);
    }
  }, []);

  const startRecording = async () => {
    let permission = await PermissionManager.getPermissionStatus(
      PermissionTypes.MICROPHONE
    );

    if (permission !== PermissionStatus.GRANTED) {
      return;
    }

    setIsRecording(true);
    updateRecording?.(true);

    timerRef.current = setTimeout(() => {
      stopRecording();
    }, 29000);

    if (useWebAPI && recognitionRef.current) {
      recognitionRef.current.start();
    } else {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.addEventListener("dataavailable", (event) => {
        audioChunksRef.current.push(event.data);
      });

      mediaRecorder.addEventListener("stop", async () => {
        const audioBlob = new Blob(audioChunksRef.current, {
          type: "audio/webm",
        });

        await uploadAudio(audioBlob);
      });

      mediaRecorder.start();
    }
  };

  const stopRecording = () => {
    setIsRecording(false);
    updateRecording?.(false);

    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }

    if (useWebAPI && recognitionRef.current) {
      recognitionRef.current.stop();
    } else {
      mediaRecorderRef.current?.stop();
    }
  };

  const uploadAudio = async (audioBlob: Blob) => {
    try {
      const formData = new FormData();
      formData.append("audio", audioBlob, "recording.webm");

      const response = await gCPSpeechToText(formData);

      if (response.status === HttpStatus.SUCCESS && response.data) {
        const transcript = response.data.transcript?.trim();
        if (transcript) {
          onTranscript?.(transcript);
        }
      }
    } catch (error) {
      console.error("Audio upload/transcription failed:", error);
    }
  };

  return (
    <div>
      <Button
        onClick={isRecording ? stopRecording : startRecording}
        type="text"
        style={{ paddingLeft: 5, paddingRight: 5 }}
      >
        {!isRecording ? (
          <AudioOutlined />
        ) : (
          <Lottie
            animationData={Animation}
            loop={true}
            style={{ height: 18, width: 18 }}
          />
        )}
      </Button>
    </div>
  );
};

export default SmartAudioRecorder;
