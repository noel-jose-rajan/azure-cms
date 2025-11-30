import { Button, type ButtonProps } from "antd";
import Spinner from "../spinner";
// import React from "react";
// import LoadingSpinner from "../loading";

type Props = {
  buttonLabel?: string;
  spinning?: boolean;
  Icon?: React.ReactNode;
  disabled?: boolean;
} & ButtonProps;
const ButtonComponent = ({
  disabled,
  buttonLabel,
  spinning,
  ...props
}: Props) => {
  return (
    <Button
      disabled={spinning || disabled}
      {...props}
      icon={spinning ? <Spinner /> : props.icon}
    >
      {buttonLabel && (
        <span
          style={{
            whiteSpace: "nowrap",
            textTransform: "capitalize",
          }}
        >
          {buttonLabel}
        </span>
      )}
    </Button>
  );
};

export default ButtonComponent;
