import { Button, Checkbox, Col, Divider, Modal, Row } from "antd";
import { useLanguage } from "../../../../context/language";
import { CloseOutlined, PrinterFilled } from "@ant-design/icons";
import { CSSProperties, useState } from "react";

interface PrintTaskProps {
  visible: boolean;
  onClose: () => void;
  onSubmit?: (values: SelectedType) => void;
  correspondenceId?: string;
  canViewHistory: boolean;
}

export interface SelectedType {
  isContentRequired: boolean;
  isDocumentVersionRequired: boolean;
  isElectAttachmentsRequired: boolean;
  isFollowUpRequired: boolean;
  isHistoryRequired: boolean;
  isMainDetailsRequired: boolean;
  isMoreDetailsRequired: boolean;
  isPhyAttachmentsRequired: boolean;
  isRoutingRequired: boolean;
}

const defaultValue: SelectedType = {
  isContentRequired: false,
  isDocumentVersionRequired: false,
  isElectAttachmentsRequired: false,
  isFollowUpRequired: false,
  isHistoryRequired: false,
  isMainDetailsRequired: false,
  isMoreDetailsRequired: false,
  isPhyAttachmentsRequired: false,
  isRoutingRequired: false,
};

type Keys = keyof typeof defaultValue;

export default function PrintTaskModal({
  onClose,
  visible,
  onSubmit,
  canViewHistory,
}: PrintTaskProps) {
  const { labels, isEnglish } = useLanguage();
  const [requiredValues, setRequiredValues] =
    useState<SelectedType>(defaultValue);
  const [markAllChecked, setMarkAllChecked] = useState<boolean>(false);

  const options: { label: string; key: Keys }[] = [
    {
      label: labels.lbl.content,
      key: "isContentRequired",
    },
    {
      label: labels.lbl.corr_details,
      key: "isMainDetailsRequired",
    },
    {
      label: labels.til.more_info,
      key: "isMoreDetailsRequired",
    },
    {
      label: labels.til.physical_attachment,
      key: "isPhyAttachmentsRequired",
    },
    {
      label: labels.til.electronic_attachment,
      key: "isElectAttachmentsRequired",
    },
    {
      label: labels.til.history,
      key: "isHistoryRequired",
    },
    {
      label: labels.til.versions,
      key: "isDocumentVersionRequired",
    },
    {
      label: labels.til.routes,
      key: "isRoutingRequired",
    },
    {
      label: labels.til.followup,
      key: "isFollowUpRequired",
    },
  ];

  const iconStyle: CSSProperties = {
    marginLeft: isEnglish ? 0 : 10,
    marginRight: isEnglish ? 10 : 0,
  };

  const selectAll = () => {
    if (markAllChecked) {
      const updatedObj = Object.keys(requiredValues).reduce(
        (acc, key) => {
          acc[key as Keys] = false;
          return acc;
        },
        { ...defaultValue }
      );
      setMarkAllChecked(false);
      setRequiredValues(updatedObj);
    } else {
      const updatedObj = Object.keys(requiredValues).reduce(
        (acc, key) => {
          acc[key as Keys] = true;
          return acc;
        },
        { ...defaultValue }
      );
      setMarkAllChecked(true);
      setRequiredValues(updatedObj);
    }
  };

  const onSubmitClicked = async () => {
    onSubmit && onSubmit(requiredValues);
  };

  return (
    <Modal
      open={visible}
      onCancel={onClose}
      title={
        <>
          <PrinterFilled style={iconStyle} />
          {labels.btn.print_task_corr}
        </>
      }
      centered
      footer={<></>}
      width={700}
    >
      <Col
        span={8}
        style={{
          ...styles.checkboxWrapper,
          ...styles.selectAllCheckboxWrapper,
        }}
      >
        <Checkbox checked={markAllChecked} onChange={selectAll}>
          {labels.btn.auto_selectAll}
        </Checkbox>
      </Col>
      <Divider />
      <Row gutter={10}>
        {options.map((item) => {
          if (
            item.key === "isDocumentVersionRequired" &&
            canViewHistory === false
          ) {
            return <></>;
          }
          return (
            <Col
              span={8}
              style={{
                ...styles.checkboxWrapper,
              }}
            >
              <Checkbox
                checked={requiredValues[item.key]}
                onChange={() => {
                  const clonedValues = { ...requiredValues };
                  clonedValues[item.key] = !clonedValues[item.key];
                  if (clonedValues[item.key] === false) {
                    setMarkAllChecked(false);
                  }
                  setRequiredValues(clonedValues);
                }}
              >
                {item.label}
              </Checkbox>
            </Col>
          );
        })}
      </Row>
      <Col
        span={24}
        style={{
          ...styles.buttonWrapper,
        }}
      >
        <Button style={{ marginLeft: 10, marginRight: 10 }} onClick={onClose}>
          <CloseOutlined />
          {labels.btn.cancel}
        </Button>
        <Button type="primary" onClick={onSubmitClicked}>
          <PrinterFilled />
          {labels.btn.print_task_corr}
        </Button>
      </Col>
    </Modal>
  );
}

const styles = {
  buttonWrapper: {
    marginTop: 30,
    display: "flex",
    justifyContent: "flex-end",
  },
  selectAllCheckboxWrapper: {
    marginTop: 40,
  },
  checkboxWrapper: {
    paddingTop: 10,
    paddingBottom: 10,
    display: "flex",
    alignItems: "center",
  },
};
