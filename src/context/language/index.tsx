import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import LOCALSTORAGE from "../../constants/local-storage";
import { LanguageType } from "../../types/language";
import { languageValidatorSchema } from "../../validators/language";
import Storage from "../../lib/storage";
import { LANGUAGE } from "../../constants/language";
import { englishLabels } from "../../constants/app-constants/en";
import { arabicLabels } from "../../constants/app-constants/ar";

interface LanguageContextProps {
  language: LanguageType;
  changeLanguage: (language: LanguageType) => void;
  isEnglish: boolean;
  labels: typeof englishLabels;
}

const LanguageContext = createContext<LanguageContextProps | undefined>(
  undefined
);

interface LanguageProviderProps {
  children: ReactNode;
}

const LANGUAGE_KEY = LOCALSTORAGE.LANGUAGE;

export const LanguageProvider: React.FC<LanguageProviderProps> = ({
  children,
}) => {
  const storedLanguage = Storage.getItem<LanguageType>(LANGUAGE_KEY);
  const [language, setLanguage] = useState<LanguageType>(
    storedLanguage || "en-INT"
  );

  const isEnglish = language === LANGUAGE.ENGLISH_INT;

  const labels = isEnglish ? englishLabels : arabicLabels;

  useEffect(() => {
    if (storedLanguage) {
      const validation = languageValidatorSchema.safeParse(storedLanguage);
      if (validation.success) {
        setLanguage(validation.data);
      } else {
        // If validation fails, fall back to default language
        setLanguage("en-INT");
      }
    } else {
      // If no language is found in localStorage, use the default
      setLanguage("en-INT");
      Storage.setItem(LOCALSTORAGE.LANGUAGE, "en-INT");
    }
  }, []);

  const changeLanguage = (newLanguage: LanguageType) => {
    setLanguage(newLanguage);
    Storage.setItem(LANGUAGE_KEY, newLanguage);
  };

  return (
    <LanguageContext.Provider
      value={{ language, changeLanguage, isEnglish, labels }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextProps => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};
