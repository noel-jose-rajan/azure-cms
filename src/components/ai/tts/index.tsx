import React, { useMemo, useState, useEffect, useRef } from "react";
import { Spin } from "antd";
import { SoundOutlined, ReloadOutlined } from "@ant-design/icons";
import ENV from "@/constants/env";
import { franc } from "franc-min";

interface Props {
  text: string;
}

export function detectLanguage(text: string): {
  lang: "ar" | "en" | "other";
  voice: string;
} {
  if (!text || text.trim().length < 2) {
    return { lang: "other", voice: "coqui-tts:en_ljspeech" };
  }

  const langCode = franc(text);
  if (langCode === "arb") return { lang: "ar", voice: "festival:ara_norm_ziad_hts" };
  if (langCode === "eng") return { lang: "en", voice: "coqui-tts:en_ljspeech" };
  return { lang: "other", voice: "coqui-tts:en_ljspeech" };
}

export default function TextToSpeech({ text }: Props) {
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [paused, setPaused] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const [bars, setBars] = useState<number[]>([0, 0, 0, 0, 0]);
  const rafRef = useRef<number>();

  const handleSpeak = async (voice: string, lang: string) => {
    if (audioUrl && !error) {
      if (!audioRef.current) {
        audioRef.current = new Audio(audioUrl);
      }
      audioRef.current.currentTime = 0;
      audioRef.current.play();
      setPlaying(true);
      setPaused(false);
      return;
    }

    try {
      setLoading(true);
      setError(false);
      const res = await fetch(
        `${ENV.AI_BASE_URL}/api/tts?voice=${voice}&lang=${lang}&vocoder=high&denoiserStrength=0.005&text=${encodeURIComponent(
          text
        )}`
      );
      if (!res.ok) throw new Error("TTS fetch failed");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      setAudioUrl(url);
      audioRef.current = new Audio(url);
      audioRef.current.onended = () => {
        setPlaying(false);
        setPaused(false);
      };
      audioRef.current.play();
      setPlaying(true);
      setPaused(false);
    } catch (err) {
      console.error(err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  const handlePause = () => {
    if (audioRef.current && playing) {
      audioRef.current.pause();
      setPaused(true);
      setPlaying(false);
    }
  };

  const handleResume = () => {
    if (audioRef.current && paused) {
      audioRef.current.play();
      setPaused(false);
      setPlaying(true);
    }
  };

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    setAudioUrl(null);
    setPlaying(false);
    setPaused(false);
  }, [text]);

  useEffect(() => {
    if (!playing || !audioRef.current) return;

    const ctx = new AudioContext();
    const src = ctx.createMediaElementSource(audioRef.current);
    const analyser = ctx.createAnalyser();
    analyser.fftSize = 256;
    src.connect(analyser);
    analyser.connect(ctx.destination);

    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const draw = () => {
      analyser.getByteFrequencyData(dataArray);
      const slice = Math.floor(bufferLength / 5);
      const newBars = Array.from({ length: 5 }, (_, i) => {
        const start = i * slice;
        const end = i === 4 ? bufferLength : (i + 1) * slice;
        let sum = 0;
        for (let j = start; j < end; j++) sum += dataArray[j];
        return sum / (end - start);
      });
      setBars(newBars);
      rafRef.current = requestAnimationFrame(draw);
    };
    draw();

    return () => cancelAnimationFrame(rafRef.current!);
  }, [playing]);

  const { lang, voice } = useMemo(() => detectLanguage(text), [text]);
  if (lang === "other") return null;

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
      <div style={{ position: "relative", width: 40, height: 40, display: "flex", justifyContent: "center", alignItems: "center", backgroundColor: "#f0f0f0", borderRadius:"100px" }}>
        {loading && <ReloadOutlined spin style={{ fontSize: 20, color: "green", cursor: "pointer" }} onClick={() => handleSpeak(voice, lang)} />}
        {!loading && !error && !playing && !paused && (
          <SoundOutlined style={{ fontSize: 20, color: "#000", cursor: "pointer" }} onClick={() => handleSpeak(voice, lang)} />
        )}
        {!loading && !error && playing && (
          <svg onClick={handlePause} style={{ cursor: "pointer" }} width="20" height="20" viewBox="0 0 20 20">
            <rect x="4" y="4" width="4" height="12" fill="#1890ff" />
            <rect x="12" y="4" width="4" height="12" fill="#1890ff" />
          </svg>
        )}
        {!loading && !error && paused && (
          <svg onClick={handleResume} style={{ cursor: "pointer" }} width="20" height="20" viewBox="0 0 20 20">
            <polygon points="5,4 17,10 5,16" fill="#1890ff" />
          </svg>
        )}
        {!loading && error && (
          <ReloadOutlined style={{ fontSize: 20, color: "red", cursor: "pointer" }} onClick={() => handleSpeak(voice, lang)} />
        )}
      </div>

      {true && (
        <div style={{ display: "flex", alignItems: "flex-end", height: "24px", gap: "3px" }}>
          {bars.map((value, i) => (
            <div key={i} style={{ width: "4px", height: `${(value / 255) * 30}px`, backgroundColor: "green" }} />
          ))}
        </div>
      )}
    </div>
  );
}
