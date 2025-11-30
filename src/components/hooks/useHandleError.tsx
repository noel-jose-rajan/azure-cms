import { useAuth } from "@/context/auth";
import { useLanguage } from "@/context/language";
import { message } from "antd";
import { stat } from "fs";
import React from "react";
import { useNavigate } from "react-router-dom";
import useCustomMessage from "./use-message";

const useHandleError = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const { isEnglish, labels } = useLanguage();
  const { showMessage } = useCustomMessage();

  const handleError = (error: any) => {
    const defaultMessage = isEnglish ? "Something went wrong" : "حدث خطأ ما";
    const status = error?.request?.status;
    const code = error?.data?.code || error?.data?.Code;
    const msg = error?.data?.message || error?.data?.Message || defaultMessage;

    if (status === 401) {
      showMessage("error", labels.msg.login_again);
      logout(navigate);
      return;
    }
    if (msg) {
      showMessage("error", msg);
    }
  };

  return { handleError };
};

export default useHandleError;
