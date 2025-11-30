import { AnimatePresence } from "framer-motion";
import React from "react";
import { useLanguage } from "../../../../context/language";

type Props = {
  error?: string | undefined;
};
const ErrorComponent = ({ error }: Props) => {
  const { isEnglish } = useLanguage();
  return (
    <AnimatePresence mode="wait">
      {error && (
        <p className="error-message">
          {isEnglish ? "this field is required" : "هذا الحقل مطلوب"}
        </p>
      )}
    </AnimatePresence>
  );
};

export default ErrorComponent;
