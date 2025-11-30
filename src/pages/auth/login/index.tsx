import { Card, Col, Divider, Row } from "antd";
import { useTheme } from "../../../context/theme";
import LoginForm from "./form";
import VariableLogo from "../../../components/ui/logo/variable-logo";
import BannerImage from "../../../assets/banner-img.jpeg";
import WhileInViewWrapper from "@/animations/while-in-view-wrapper";
import FadeInWrapperAnimation from "@/animations/fade-in-wrapper-animation";
import ButtonComponent from "@/components/ui/button";
import { useLanguage } from "@/context/language";
import HawytiLogin from "./hawyti-login";
import { useState } from "react";

const Login = () => {
  const { theme } = useTheme();
  const { labels } = useLanguage();
  const [loginType, setLoginType] = useState("1");
  return (
    <FadeInWrapperAnimation
      enableScaleAnimation={false}
      style={{ height: "100%", position: "relative" }}
    >
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          alignItems: "center",
          position: "absolute",
          top: 0,
          left: 0,
        }}
      >
        <img
          src={BannerImage}
          style={{ height: "100%", width: "100%", objectFit: "fill" }}
        />
      </div>
      <Row
        style={{
          height: "100%",
          width: "100%",
        }}
      >
        <Col
          style={{
            height: "100%",
            width: "100%",
            // backgroundColor: theme.colors.overlayColor,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <WhileInViewWrapper key={"login-form" + loginType}>
            <Card
              style={{
                border: `1px solid ${theme.colors.border}`,
                borderRadius: "8px",
                backgroundColor: theme.colors.background,
                boxShadow: `0 2px 8px ${theme.shadows}`,
                padding: "24px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                width: "400px",
                aspectRatio: 1,
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  width: 280,
                }}
              >
                <VariableLogo color={theme.colors.primary} />
              </div>
              {loginType == "1" ? (
                <>
                  <LoginForm />
                  {/* <Divider plain>{labels.lbl.or}</Divider>
                  <ButtonComponent
                    type="text"
                    style={{ width: "100%" }}
                    buttonLabel={labels.btn.login_with_hawyti}
                    onClick={() => setLoginType("2")}
                  /> */}
                </>
              ) : (
                <></>
                // <>
                //   <HawytiLogin />
                //   <Divider plain>{labels.lbl.or}</Divider>
                //   <ButtonComponent
                //     type="text"
                //     style={{ width: "100%" }}
                //     buttonLabel={labels.btn.login}
                //     onClick={() => setLoginType("1")}
                //   />
                // </>
              )}
            </Card>
          </WhileInViewWrapper>
        </Col>
      </Row>
    </FadeInWrapperAnimation>
  );
};

export default Login;
