import { Col } from "antd";
import Text from "../text/text";
import { useTheme } from "../../../context/theme";
import {
  CloudUploadOutlined,
  DeleteFilled,
  DownloadOutlined,
  EditFilled,
  EyeFilled,
  HistoryOutlined,
  InboxOutlined,
  MailOutlined,
  PlusOutlined,
  StopOutlined,
  TableOutlined,
  ThunderboltFilled,
} from "@ant-design/icons";
import ButtonComponent from "../button";

interface ActionItemsProps {
  onClick: () => void;
  isActive?: boolean;
  label: string;
  loading?: boolean;
  type?:
    | "edit"
    | "add"
    | "delete"
    | "activate"
    | "deactivate"
    | "eye"
    | "upload"
    | "download"
    | "history"
    | "mail"
    | "mailOpened"
    | "list";
}

export default function ActionMenuItem({
  onClick,
  isActive = false,
  label,
  type,
  loading = false,
}: ActionItemsProps) {
  const { theme } = useTheme();

  const getIcon = () => {
    if (type == "add") {
      return (
        <PlusOutlined
          style={{
            fontSize: 20,
            marginRight: 10,
            color: !isActive ? "grey" : theme.colors.primary,
          }}
        />
      );
    }
    if (type === "edit") {
      return (
        <EditFilled
          style={{
            fontSize: 20,
            marginRight: 10,
            color: !isActive ? "grey" : theme.colors.primary,
          }}
        />
      );
    }

    if (type === "delete") {
      return (
        <DeleteFilled
          style={{
            fontSize: 20,
            marginRight: 10,
            color: !isActive ? "grey" : theme.colors.primary,
          }}
        />
      );
    }

    if (type === "deactivate") {
      return (
        <StopOutlined
          style={{
            fontSize: 20,
            marginRight: 10,
            color: !isActive ? "grey" : theme.colors.primary,
          }}
        />
      );
    }

    if (type === "activate") {
      return (
        <ThunderboltFilled
          style={{
            fontSize: 20,
            marginRight: 10,
            color: !isActive ? "grey" : theme.colors.primary,
          }}
        />
      );
    }

    if (type === "eye") {
      return (
        <EyeFilled
          style={{
            fontSize: 20,
            marginRight: 10,
            color: !isActive ? "grey" : theme.colors.primary,
          }}
        />
      );
    }

    if (type === "upload") {
      return (
        <CloudUploadOutlined
          style={{
            fontSize: 20,
            marginRight: 10,
            color: !isActive ? "grey" : theme.colors.primary,
          }}
        />
      );
    }

    if (type === "download") {
      return (
        <DownloadOutlined
          style={{
            fontSize: 20,
            marginRight: 10,
            color: !isActive ? "grey" : theme.colors.primary,
          }}
        />
      );
    }

    if (type === "history") {
      return (
        <HistoryOutlined
          style={{
            fontSize: 20,
            marginRight: 10,
            color: !isActive ? "grey" : theme.colors.primary,
          }}
        />
      );
    }

    if (type === "mail") {
      return (
        <MailOutlined
          style={{
            fontSize: 20,
            marginRight: 10,
            color: !isActive ? "grey" : theme.colors.primary,
          }}
        />
      );
    }

    if (type === "mailOpened") {
      return (
        <InboxOutlined
          style={{
            fontSize: 20,
            marginRight: 10,
            color: !isActive ? "grey" : theme.colors.primary,
          }}
        />
      );
    }

    if (type === "list") {
      return (
        <TableOutlined
          style={{
            fontSize: 20,
            marginRight: 10,
            color: !isActive ? "grey" : theme.colors.primary,
          }}
        />
      );
    }
  };
  return (
    <ButtonComponent
      disabled={!isActive}
      buttonLabel={label}
      type="text"
      spinning={loading}
      icon={getIcon()}
      onClick={() => {
        if (isActive) {
          onClick();
        }
      }}
      className="action-item"
      style={{
        height: 55,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "0px 20px",
        cursor: isActive ? "pointer" : "not-allowed",
      }}
    />
  );
}
