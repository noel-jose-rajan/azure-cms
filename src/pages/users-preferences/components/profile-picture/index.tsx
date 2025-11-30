import { HttpStatus } from "@/components/functional/httphelper";
import { uploadUserImage } from "@/components/services/user-preference";
import { API_URL } from "@/constants/api";
import { UploadOutlined } from "@ant-design/icons";
import { Button, message, Upload } from "antd";
import type { RcFile } from "antd/es/upload/interface";
import React, { useState } from "react";
import { arabicLabels } from "../../../../constants/app-constants/ar";
import { englishLabels } from "../../../../constants/app-constants/en";
import { LANGUAGE } from "../../../../constants/language";
import LOCALSTORAGE from "../../../../constants/local-storage";
import { useLanguage } from "../../../../context/language";
import Storage from "../../../../lib/storage";

interface ProfilePictureProps {
  userid?: number;
  mode: "profile" | "signature";
}

const ProfilePicture: React.FC<ProfilePictureProps> = ({ userid, mode }) => {
  const { language } = useLanguage();
  const { btn } =
    language === LANGUAGE.ENGLISH_INT ? englishLabels : arabicLabels;
  const [reset, setReset] = useState<number>(0);
  const token = Storage.getItem(LOCALSTORAGE.ACCESS_TOKEN);

  const handleUpload = async (file: RcFile) => {
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await uploadUserImage(formData, mode, userid);

      if (response.status === HttpStatus.SUCCESS) {
        message.success("Profile picture uploaded successfully!");
        setReset((num) => num + 1);
      } else {
        message.error("Failed to upload profile picture.");
      }
    } catch (error) {
      message.error("Error uploading profile picture.");
    }
  };

  const beforeUpload = (file: RcFile) => {
    handleUpload(file);
    // Prevent default upload behavior
    return false;
  };

  console.log({
    url:
      API_URL +
      `/users/file/${userid}/${mode}?accessToken=${token}&cb=${reset}`,
  });

  return (
    <div style={{ textAlign: "center" }}>
      <div
        key={reset}
        style={{
          width: "100%",
          height: 239,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
        }}
      >
        <img
          key={reset}
          src={
            API_URL +
            `/users/file/${userid}/${mode}?accessToken=${token}&cb=${reset}`
          }
          style={{
            width: "100%",
            objectFit: "cover",
            height: "100%",
          }}
          alt={mode}
        />
      </div>
      <Upload showUploadList={false} beforeUpload={beforeUpload}>
        <Button icon={<UploadOutlined />} style={{ marginTop: 25 }}>
          <p style={{ fontSize: 12 }}>
            {mode === "signature"
              ? btn.change_profile_image
              : btn.change_signature_image}
          </p>
        </Button>
      </Upload>
    </div>
  );
};

export default ProfilePicture;
