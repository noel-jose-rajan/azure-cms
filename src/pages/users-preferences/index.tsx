import TitleBar from "../../components/ui/bar/title-bar";
import { useLanguage } from "../../context/language";
import TitleHeader from "../../components/ui/header";
import {
  FilterOutlined,
  GoldOutlined,
  IdcardOutlined,
} from "@ant-design/icons";
import { useTheme } from "../../context/theme";
import { Col, Row } from "antd";
import SyncUsers from "./components/sync-users";
import { startTransition, useEffect, useState } from "react";
import SelectUserCard from "./components/select-user-card";
import UserPreferences from "./components/user-preferences";
import ProfilePicture from "./components/profile-picture";
import SelectUsers from "@/components/shared/select-users";
import AddOrEditOURoles from "./components/add-edit-orgunit-roles";
import { useLocation } from "react-router-dom";
import useGetAllUsers from "@/store/users/use-get-all-users";
import { useAuth } from "@/context/auth";

export default function UsersPreferences() {
  const {
    labels: { lbl, til, mnu },
  } = useLanguage();
  const { isEnglish } = useLanguage();
  const { theme } = useTheme();
  const location = useLocation();
  const { users, refreshAllUsers } = useGetAllUsers();
  const { user } = useAuth();

  const [selectedUser, setSelectedUser] = useState<number>();
  const [myPreferences, setMyPreferences] = useState<boolean>(false);
  const [addedUserName, setAddedUserName] = useState<string>("");
  const handleSelectedUser = () => {
    const user = users.find((u) => u.username == addedUserName);
    if (user) {
      setSelectedUser(user?.id);
      setAddedUserName("");
    }
  };
  useEffect(() => {
    if (location.pathname.includes("my-preferences")) {
      const getUser = users.find((u) => u.username === user?.uid);
      setSelectedUser(getUser?.id);
      setMyPreferences(true);
    } else {
      setMyPreferences(false);
    }
  }, [location.pathname, users, user?.uid]);

  useEffect(() => {
    if (addedUserName) {
      handleSelectedUser();
    }
  }, [users, addedUserName]);
  return (
    <div style={{ maxWidth: "100%" }}>
      <TitleBar headerText={mnu.users_preferences} />
      <div>
        {!myPreferences && (
          <div>
            <Col span={24}>
              <SyncUsers
                handleSelectedUser={async (username: string) => {
                  await refreshAllUsers();
                  setAddedUserName(username);
                }}
              />
            </Col>
            <>
              <TitleHeader
                heading={til.user_filter}
                icon={
                  <FilterOutlined
                    style={{ color: theme.colors.backgroundText }}
                  />
                }
              />
            </>
            <br />
            <Row
              style={{
                display: "flex",
                gap: 8,
                justifyContent: isEnglish ? "start" : "end",
              }}
            >
              <Col span={24} sm={24} lg={12} xl={8}>
                <SelectUsers
                  key={users?.length + addedUserName}
                  multiSelect={false}
                  onChange={function (value: number[] | number): void {
                    if (Array.isArray(value)) {
                      setSelectedUser(value[0]);
                    } else {
                      setSelectedUser(value);
                    }
                  }}
                  value={selectedUser ? [selectedUser] : []}
                  label={lbl.user}
                />
              </Col>
            </Row>
          </div>
        )}
        <Col span={24}>
          <TitleHeader
            heading={til.user_data}
            icon={
              <IdcardOutlined style={{ color: theme.colors.backgroundText }} />
            }
          />
          <br />
          {selectedUser ? (
            <Row>
              <Col md={17} xxl={20}>
                <UserPreferences
                  selectedUser={selectedUser}
                  myPreferences={myPreferences}
                />
                {!myPreferences && (
                  <>
                    <TitleHeader
                      heading={til.userPerferenceOrgunitsRolesSection}
                      icon={
                        <GoldOutlined
                          style={{ color: theme.colors.backgroundText }}
                        />
                      }
                    />
                    <AddOrEditOURoles userId={selectedUser} />
                  </>
                )}
              </Col>

              <Col md={7} xxl={4} style={{ padding: 10 }}>
                <br />
                <ProfilePicture userid={selectedUser} mode="profile" />
                <br />
                <ProfilePicture userid={selectedUser} mode="signature" />
              </Col>
            </Row>
          ) : (
            <SelectUserCard />
          )}
        </Col>
      </div>
    </div>
  );
}
