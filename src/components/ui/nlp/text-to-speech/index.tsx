import { useEffect, useRef, useState } from "react";
import ENV from "../../../../constants/env";
import Storage from "../../../../lib/storage";
import LOCALSTORAGE from "../../../../constants/local-storage";
import { Button } from "antd";
import Lottie from "lottie-react";
import { useTheme } from "../../../../context/theme";
import AudioPlay from "../../../../assets/animations/audio-play.json";
import { PauseCircleFilled, PlayCircleFilled } from "@ant-design/icons";

const AudioFromTextButton = ({ text }: { text: string }) => {
  const [audioUrl, setAudioUrl] = useState<string>("");
  const audioRef = useRef<any>();
  const lastTextRef = useRef<any>(text);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const {
    theme: { colors },
  } = useTheme();

  useEffect(() => {
    if (lastTextRef.current !== text) {
      lastTextRef.current = text;
      setAudioUrl("");
      setIsPlaying(false);

      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = "";
      }
    }
  }, [text]);

  const handleButtonClick = async () => {
    if (isPlaying) {
      audioRef.current?.pause();
      setIsPlaying(false);
    } else {
      // Play the audio
      if (audioUrl) {
        audioRef.current?.play();
        setIsPlaying(true);
      } else {
        try {
          const token = await Storage.getItem(LOCALSTORAGE.ACCESS_TOKEN);

          const response = await fetch(ENV.API_URL + "/utils/tts", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: token + "",
            },
            body: JSON.stringify({ text: text }),
          });

          if (!response.ok) throw new Error("Audio fetch failed");

          const blob = await response.blob();
          const url = URL.createObjectURL(blob);
          setAudioUrl(url);

          audioRef.current.src = url;
          audioRef.current.play();
          setIsPlaying(true);
        } catch (error) {
          console.error("Error fetching audio:", error);
        }
      }
    }
  };

  const changeColorInLottie = (
    data: any,
    fromColor = "#000000",
    toColor = "#FF0000"
  ) => {
    const jsonString = JSON.stringify(data);
    const replaced = jsonString.replace(
      new RegExp(fromColor.replace("#", ""), "g"),
      toColor.replace("#", "")
    );
    return JSON.parse(replaced);
  };

  const animationData = changeColorInLottie(
    AudioPlay,
    "#000000",
    colors.primary
  );

  const handleAudioEnd = () => {
    setIsPlaying(false);
  };

  return (
    <>
      <Button
        type="text"
        disabled={text === undefined || text?.trim() === ""}
        onClick={handleButtonClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{ paddingLeft: 5, paddingRight: 5 }}
      >
        {isPlaying ? (
          isHovered ? (
            <PauseCircleFilled />
          ) : (
            <Lottie
              animationData={animationData}
              loop={true}
              style={{ height: 15, width: 15 }}
            />
          )
        ) : (
          <PlayCircleFilled />
        )}
      </Button>
      <audio ref={audioRef} onEnded={handleAudioEnd} />
    </>
  );
};

export default AudioFromTextButton;
