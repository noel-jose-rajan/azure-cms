import { useEffect, useRef, useState } from "react";
import { message, Card, Button, Row, Col } from "antd";
import UserTitleList from "./user-title-list";
import { useLanguage } from "../../../../context/language";
import { MaterialInput } from "../../../../components/ui/material-input";
import TitleHeader from "../../../../components/ui/header";
import {
  ReloadOutlined,
  SaveOutlined,
  SettingOutlined,
  ThunderboltOutlined,
  WarningOutlined,
} from "@ant-design/icons";
import { useTheme } from "../../../../context/theme";
import CheckboxList from "../check-box-list";
import ToggleSwitch from "../../../../components/ui/switch/toggle-swich";
import {
  getFullUserInformation,
  getUserOptedotifications,
  saveUserInformation,
  updateUserNotifiactionPermissions,
} from "../../../../components/services/user-preference";
import { UserPreferenceType } from "../../../../components/services/user-preference/type";
import { HttpStatus } from "../../../../components/functional/httphelper";

interface Props {
  selectedUser?: number;
  myPreferences?: boolean;
}

export default function UserPreferences({
  selectedUser,
  myPreferences = false,
}: Props) {
  const {
    labels: { til, lbl, btn },
    isEnglish,
  } = useLanguage();
  const { theme } = useTheme();

  const [userFullInfo, setUserFullInfo] = useState<UserPreferenceType>();
  const [user, setUser] = useState<UserPreferenceType>();
  const userOptedTypes = useRef<number[]>([]);
  const [changedOptedTypes, setChnagedOptedTypes] = useState<number[]>([]);

  const isUserInfoModified =
    JSON.stringify(userFullInfo) !== JSON.stringify(user);
  const isOptedTypesModified =
    JSON.stringify(userOptedTypes.current.sort()) !==
    JSON.stringify(changedOptedTypes.sort());
  const isModified = isUserInfoModified || isOptedTypesModified;

  const isValid = !(user?.user_name_ar === "" || user?.user_name_eng === "");

  useEffect(() => {
    if (selectedUser) {
      getUserConfigs(selectedUser);
    }
  }, [selectedUser]);

  const getUserConfigs = async (userId: number) => {
    await getUserInformation(userId);
    await fetchnotificationAvailForAUser(userId);
  };

  const fetchnotificationAvailForAUser = async (id: number) => {
    const response = await getUserOptedotifications(id);

    if (response.status === HttpStatus.SUCCESS && response.data) {
      userOptedTypes.current = response.data;
      setChnagedOptedTypes(response.data);
    }
  };

  const getUserInformation = async (id?: number) => {
    const response = await getFullUserInformation(id ?? selectedUser!);

    if (response.status === HttpStatus.SUCCESS && response.data) {
      if (response.data.data) {
        setUserFullInfo(response.data.data);
        setUser(response.data.data);
      } else {
        setUserFullInfo(undefined);
        setUser(undefined);
      }
    } else {
      setUserFullInfo(undefined);
      setUser(undefined);
    }
  };

  // Handle form submission
  const handleSubmit = async () => {
    try {
      if (isValid && isModified && user) {
        const updateRes = await saveUserInformation(user, selectedUser);

        if (updateRes.status === HttpStatus.SUCCESS) {
          message.success("User Notification Preference updated");
        }
      }
      const response = await updateUserNotifiactionPermissions(
        changedOptedTypes,
        selectedUser
      );

      if (response.status === HttpStatus.SUCCESS) {
        message.success("User Notification Preference updated");
      }
    } catch (error: any) {
      console.log("the error ", error);
      if (error.name === "ZodError") {
        message.error(
          isEnglish
            ? "Validation error: Please check the input fields"
            : "خطأ في التحقق: يرجى التحقق من الحقول المدخلة"
        );
      } else {
        message.error(
          isEnglish ? "Failed to update the user" : "فشل في تحديث المستخدم"
        );
      }
    }
  };

  return (
    <Card>
      <Card style={{ marginBottom: 16 }}>
        <Row gutter={20}>
          <Col span={12}>
            <MaterialInput
              error={user?.user_name_ar === "" ? "Error" : undefined}
              label={lbl.arabic_name}
              value={user?.user_name_ar}
              onChange={(e: any) =>
                user &&
                setUser((val) =>
                  val ? { ...val, user_name_ar: e.target.value } : undefined
                )
              }
            />
          </Col>
          <Col span={12}>
            <MaterialInput
              error={user?.user_name_eng === "" ? "Error" : undefined}
              label={lbl.english_name}
              value={user?.user_name_eng}
              onChange={(e: any) =>
                user &&
                setUser((val) =>
                  val ? { ...val, user_name_eng: e.target.value } : undefined
                )
              }
              style={{ marginBottom: 8 }}
            />
          </Col>
        </Row>
      </Card>
      {selectedUser && !myPreferences && (
        <UserTitleList userId={selectedUser} />
      )}
      <Col span={24}>
        <TitleHeader
          applyReverse={false}
          heading={til.user_preferences}
          icon={
            <SettingOutlined style={{ color: theme.colors.backgroundText }} />
          }
        />
        <CheckboxList
          userId={selectedUser}
          changedOptedTypes={changedOptedTypes}
          updateChangesOnOptType={setChnagedOptedTypes}
        />
        {user && !myPreferences && (
          <ToggleSwitch
            label={lbl.appParam_TwoFactorAuthenticationEnabled}
            isChecked={user?.is_two_factor_auth_enabled}
            onToggle={(e) =>
              setUser(() => ({ ...user, is_two_factor_auth_enabled: e }))
            }
          />
        )}
        <br />
        {user && (
          <div style={{ display: "flex", gap: 20 }}>
            <Button
              disabled={!isModified || !isValid}
              type="primary"
              onClick={handleSubmit}
            >
              <SaveOutlined /> {btn.save}
            </Button>

            <Button type="primary" onClick={() => getUserInformation()}>
              <ReloadOutlined />
              {btn.reset}
            </Button>
            {!myPreferences && (
              <Button
                type="primary"
                onClick={() =>
                  setUser(() => ({
                    ...user,
                    is_active: !user.is_active,
                  }))
                }
              >
                {user.is_active ? <WarningOutlined /> : <ThunderboltOutlined />}
                {user.is_active ? btn.deactivate : btn.activate}
              </Button>
            )}
          </div>
        )}
      </Col>
    </Card>
  );
}
