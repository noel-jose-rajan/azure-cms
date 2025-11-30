//Core
import React, { ChangeEvent, useState } from "react";

//3rd Party
import { Button, Space, message, Modal } from "antd";
import {
  PlusOutlined,
  DeleteOutlined,
  SwapOutlined,
  SaveOutlined,
  ReloadOutlined,
  LockOutlined,
} from "@ant-design/icons";

//Data
import { getSegmentTypeList } from "../../lib/data";

//Hooks
import { useLanguage } from "../../../../context/language";
import { LANGUAGE } from "../../../../constants/language";
import { MaterialSelect } from "../../../../components/ui/dropdown/material-dropdown";
import { MaterialInput } from "../../../../components/ui/material-input";

interface Props {
  schemaType?: string;
  onAddSegment?: (
    segment: {
      segmentEnType: string;
      segmentArType: string;
      segmentKey: string;
    },
    value: string | number
  ) => any;
  isDelete?: boolean;
  onDeleteSegment?: () => unknown;
  showSave?: boolean;
  onSave?: () => any;
  onReset?: () => any;
  isRearrange?: boolean;
  onRearrange?: () => any;
}

const CorrespondenceSchemaSegmentManager: React.FC<Props> = ({
  schemaType,
  onAddSegment,
  onDeleteSegment,
  showSave,
  onReset,
  onSave,
  isRearrange,
  onRearrange,
  isDelete,
}) => {
  const segment = getSegmentTypeList(schemaType);
  const { language, labels, isEnglish } = useLanguage();
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [selectedSegmentType, setSelectedSegmentType] = useState<
    | {
        segmentEnType: string;
        segmentArType: string;
        segmentKey: string;
      }
    | undefined
  >();
  const [inputValue, setInputValue] = useState<string | number>("");

  const addSegment = () => {
    setIsModalVisible(true);
  };

  const handleSegmentTypeSelect = (value: string) => {
    const findSelectedSegment = segment?.find(
      (term) => term.segmentKey === value
    );
    setSelectedSegmentType(findSelectedSegment);
  };

  const handleModalOk = () => {
    if (!selectedSegmentType) {
      message.warning(
        language === LANGUAGE.ENGLISH_INT
          ? "Please select a segment type!"
          : "يرجى اختيار نوع القسم!"
      );
      setSelectedSegmentType(() => undefined);
      setIsModalVisible(false);
      return;
    }

    setIsModalVisible(false);
    setSelectedSegmentType(() => undefined);
    onAddSegment && onAddSegment(selectedSegmentType, inputValue);
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
    setSelectedSegmentType(() => undefined);
  };

  return (
    <div
      style={{
        padding: "16px",
        display: "flex",
        justifyContent:
          language === LANGUAGE.ENGLISH_INT ? "flex-start" : "flex-end",
      }}
    >
      <Space style={{ marginBottom: "16px" }}>
        <Button
          disabled={!schemaType}
          type="primary"
          icon={<PlusOutlined />}
          onClick={addSegment}
        >
          {language === LANGUAGE.ENGLISH_INT ? "Add Segment" : "إضافة قسم"}
        </Button>
        <Button
          type={isDelete ? "default" : "dashed"}
          disabled={!schemaType}
          danger
          icon={isDelete ? <DeleteOutlined /> : <LockOutlined />}
          onClick={() => onDeleteSegment && onDeleteSegment()}
        >
          {labels.btn.delete}
        </Button>
        <Button
          type={isRearrange ? "default" : "dashed"}
          disabled={!schemaType}
          icon={isRearrange ? <SwapOutlined /> : <LockOutlined />}
          onClick={onRearrange}
        >
          {language === LANGUAGE.ENGLISH_INT ? "Rearrange" : "إعادة ترتيب"}
        </Button>
        {showSave && (
          <Button
            type="primary"
            icon={<SaveOutlined />}
            onClick={() => onSave && onSave()}
          >
            {labels.btn.save_changes}
          </Button>
        )}
        {showSave && (
          <Button
            type="text"
            icon={<ReloadOutlined />}
            onClick={() => onReset && onReset()}
          >
            {language === LANGUAGE.ENGLISH_INT ? "Reset" : "إعادة ضبط"}
          </Button>
        )}
      </Space>

      {isModalVisible && (
        <Modal
          title={
            language === LANGUAGE.ENGLISH_INT
              ? "Select Segment Type"
              : "اختر نوع القسم"
          }
          open={true}
          onOk={handleModalOk}
          onCancel={handleModalCancel}
        >
          <MaterialSelect
            label={labels.tbl.segment_type + " *"}
            value={selectedSegmentType?.segmentKey}
            options={
              segment?.map((classification: any) => {
                return {
                  label: isEnglish
                    ? classification.segmentEnType
                    : classification.segmentArType,
                  value: classification.segmentKey,
                };
              }) ?? []
            }
            onChange={(value: string) => {
              handleSegmentTypeSelect(value);
            }}
            style={{ height: 45, marginBottom: 20 }}
          />
          {selectedSegmentType?.segmentKey === "fixed" ||
          selectedSegmentType?.segmentKey === "sequence.no" ? (
            <MaterialInput
              label={
                (selectedSegmentType?.segmentKey !== "fixed"
                  ? labels.tbl.seq_num_length
                  : labels.tbl.value) + " *"
              }
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setInputValue(e.target.value)
              }
              value={inputValue}
            />
          ) : (
            <></>
          )}
        </Modal>
      )}
    </div>
  );
};

export default CorrespondenceSchemaSegmentManager;
