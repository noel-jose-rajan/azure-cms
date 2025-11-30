import { Spin, SpinProps } from "antd";
import Spinner from "../spinner";

type LoaderProps = {
  text?: string;
  loading: boolean;
  size?: SpinProps["size"];
  delay?: number;
  fullscreen?: boolean;
} & SpinProps;

export default function LoaderComponent({
  loading,
  size = "default",
  delay = 400,
  fullscreen = false,
  text = "Loading...",
  ...props
}: LoaderProps) {
  return (
    // <Modal open={loading} centered closable={false} footer={<></>} zIndex={100}>
    //   <div
    //     style={{
    //       height: 120,
    //       display: "flex",
    //       justifyContent: "center",
    //       alignItems: "center",
    //       flexDirection: "column",
    //     }}
    //   >
    //     <Spin size="large"></Spin>
    //     <p style={{ marginTop: 10 }}>{text}</p>
    //   </div>
    // </Modal>

    <div
      style={
        fullscreen
          ? {}
          : {
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              // minHeight: "90vh",
            }
      }
    >
      <Spin
        {...props}
        spinning={loading}
        fullscreen={fullscreen}
        style={{
          color: "grey",
          ...props.style,
        }}
        size={fullscreen ? "large" : size}
        //  this delay to show the spinner only after a certain time if still loading  to avoid show indiacator for a very small time
        delay={delay}
        indicator={<Spinner size={size} />}
      />
    </div>
  );
}
