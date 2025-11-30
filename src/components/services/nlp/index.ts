import axios from "axios";
import ENV from "../../../constants/env";
import { LANGUAGE } from "../../../constants/language";
import { GENDER } from "../../../constants/gender";
import Storage from "../../../lib/storage";
import LOCALSTORAGE from "../../../constants/local-storage";
import { HttpClient, ServiceResult } from "../../functional/httphelper";
import { GenericApiResponseType } from "../../../types/api";

interface ChatResponseType {
  prvChat: string;
  response: string;
  session_id: string;
}

export const gCPSpeechToText = async (audioFile: FormData) => {
  try {
    const token = await Storage.getItem(LOCALSTORAGE.ACCESS_TOKEN);
    const httpClient = new HttpClient(ENV.API_URL);

    const response = await httpClient.post<any, any>(`/utils/stt`, audioFile, {
      headers: {
        Authorization: token + "",
        "Content-Type": "multipart/form-data",
      },
    });

    return response;
  } catch (error) {
    return ServiceResult.failed(null, "Something went wrong");
  }
};

export const askWithAIChatBot = async (payLoad: FormData) => {
  try {
    const token = await Storage.getItem(LOCALSTORAGE.ACCESS_TOKEN);
    const httpClient = new HttpClient(ENV.API_URL);

    const response = await httpClient.post<
      GenericApiResponseType<ChatResponseType>,
      any
    >(`/utils/chat`, payLoad, {
      headers: {
        Authorization: token + "",
        "Content-Type": "multipart/form-data",
      },
    });

    return response;
  } catch (error) {
    return ServiceResult.failed(null, "Something went wrong");
  }
};

interface Props {
  text: string;
  gender?: GENDER;
  language: LANGUAGE;
}

export async function GCPTextToSpeech({ text, gender, language }: Props) {
  const url = `https://texttospeech.googleapis.com/v1/text:synthesize?key=${ENV.GCP_API_KEY}`;
  const requestBody = {
    input: { text },
    voice: { languageCode: language, ssmlGender: gender },
    audioConfig: { audioEncoding: "MP3" },
  };

  try {
    const response = await axios.post(url, requestBody, {
      headers: { "Content-Type": "application/json" },
    });

    const audioContent = response.data.audioContent;

    const audioBuffer = Uint8Array.from(atob(audioContent), (c) =>
      c.charCodeAt(0)
    ).buffer;

    const audioContext = new (window.AudioContext || window.AudioContext)();
    const decodedData = await audioContext.decodeAudioData(audioBuffer);

    const source = audioContext.createBufferSource();
    source.buffer = decodedData;
    source.connect(audioContext.destination);
    source.start(0);
  } catch (error) {
    console.error("Error during text-to-speech:", error);
  }
}

export default async function gCPTextTranslate(
  text: string,
  language: LANGUAGE
): Promise<string | null> {
  const url = `https://translation.googleapis.com/language/translate/v2?key=${ENV.GCP_API_KEY}`;

  const requestBody = {
    q: text,
    target: language,
  };

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      throw new Error("Failed to fetch translation");
    }

    const data = await response.json();
    return data.data.translations[0].translatedText;
  } catch (error) {
    console.error("Error translating text:", error);
    return null;
  }
}
