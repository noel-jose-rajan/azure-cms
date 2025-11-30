//core
import { ChangeEvent, useEffect, useState } from "react";

//3rd Party Components
import { DeleteOutlined, EditFilled } from "@ant-design/icons";
import { Button, Modal, Row, message } from "antd";

//UI Components
import TitleBar from "../../components/ui/bar/title-bar";
import Text from "../../components/ui/text/text";
import Dropdown, {
  DropdownOption,
} from "../../components/ui/dropdown/dropdown";
import DraggableTable, {
  CustomColumn,
} from "../../components/ui/table/draggable-table";
import CorrespondenceSchemaSegmentManager from "./components/correspondence-schema-segment-manager";

//data
import { getSegmentTypeList, schemaTypeList } from "./lib/data";
import {
  CorrespondenceSchemaType,
  SegmentType,
} from "../../components/services/correspondence-schema/type";
import {
  updateSchemaDetails,
  getSchemaDetails,
} from "../../components/services/correspondence-schema";

//Hooks
import { useLanguage } from "../../context/language";
import { LANGUAGE } from "../../constants/language";
import useCompareState from "../../components/hooks/use-compare-hook";
import { HttpStatus } from "../../components/functional/httphelper";
import { MaterialSelect } from "../../components/ui/dropdown/material-dropdown";
import { MaterialInput } from "../../components/ui/material-input";

const schemaTypeListInDropdownFormat: DropdownOption[] = schemaTypeList.map(
  (item) => ({ label: item.display_text, value: item.key })
);

export default function CorrespondenceSchema() {
  //Hooks
  const { language, labels, isEnglish } = useLanguage();

  //States
  const [reload, setReload] = useState(0);
  const [selectedSchemaType, setSelectedSchemaType] =
    useState<DropdownOption | null>(null);
  const {
    currentState: currentSchemaDetails,
    setCurrentState: setCurrentSchemaDetails,
    isModified,
    setReference: setCurrentSchemaDetailsReference,
    resetState,
  } = useCompareState<SegmentType[] | null>(null);
  const [showDelete, setShowDelete] = useState(false);
  const [isRearrangable, setIsRearrangable] = useState(false);
  const [schema, setSchema] = useState<CorrespondenceSchemaType>();
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [selectedSegment, setSelectedSegment] = useState<SegmentType>();

  //Handler Functions

  // Handler Function 1: Handlers updating schema selected
  const handleChangeSelectSchemaType = (
    key: string,
    list: DropdownOption[]
  ) => {
    const value = list.find((identifier) => identifier.value === key);
    setSelectedSchemaType(() => value ?? null);
  };

  // Handler Function 2: Handles updating the state when the draggable table give updated row order
  const handleSchemaOrderChange = (list: SegmentType[]) => {
    const newOrder = list.map((item, index) => ({
      ...item,
      order: `${index + 1}`,
    }));

    setCurrentSchemaDetails(() => newOrder);
  };

  // Handler Function 3: Handles Adding New Segment
  const handleAddSegment = (key: string, value: string | number) => {
    if (Array.isArray(currentSchemaDetails) && selectedSchemaType) {
      const newSegment: SegmentType = {
        segmentKey: key,
        value: key === "fixed" ? String(value) : "",
        sequenceNumberLength: key === "sequence.no" ? Number(value) : 0,
        order: `${currentSchemaDetails.length + 1}`,
        segmentType: `${selectedSchemaType.value}`,
      };

      setCurrentSchemaDetails(() => [...currentSchemaDetails, newSegment]);
    }
  };

  // Handler Function 3: Handles removing selected Segment
  const handleRemoveSegment = (value: string) => {
    if (Array.isArray(currentSchemaDetails)) {
      const updatedSchemaDetails = currentSchemaDetails.filter(
        (segment) => segment.order !== value
      );
      setCurrentSchemaDetails(() => updatedSchemaDetails);
    }
  };

  // Handler Function 3: Handles removing selected Segment
  const handleSaveSegment = async (
    segmentName?: string,
    segments?: SegmentType[]
  ) => {
    if (!segmentName || !segments || !Array.isArray(segments)) {
      message.error("The data is not correct, failed to update the changes");
      setReload((val) => val + 1);
      return;
    }

    if (!schema) return;

    const request = await updateSchemaDetails(schema, segments);

    if (!request) {
      message.error("The data is not correct, failed to update the changes");
      setReload((val) => val + 1);
      return;
    }

    message.success(`${segmentName} updated!`);
    setReload((val) => val + 1);
  };

  //Component Life Cycle management
  useEffect(() => {
    if (selectedSchemaType !== null) {
      getSegmentDetails(selectedSchemaType.value as string);
    }

    return () => {};
  }, [selectedSchemaType, reload]);

  const getSegmentDetails = async (key: string) => {
    const response = await getSchemaDetails(key);

    if (response.status === HttpStatus.SUCCESS && response.data) {
      if (response.data.data.length > 0) {
        let segmentData = response.data.data[0];
        const filteredSegmentData = segmentData.segments.sort(
          (a, b) => Number(a.order) - Number(b.order)
        );
        segmentData.segments = filteredSegmentData;
        setSchema(segmentData);
        setCurrentSchemaDetailsReference(segmentData.segments);
      } else {
        setSchema(undefined);
        setCurrentSchemaDetailsReference([]);
      }
    } else if (response.status === HttpStatus.NOTFOUND) {
      setSchema(undefined);
      setCurrentSchemaDetailsReference([]);
    } else {
      setSchema(undefined);
      setCurrentSchemaDetailsReference([]);
    }
  };

  const getTRheSegmentName = (row: SegmentType) => {
    const segmentTypes = getSegmentTypeList(row.segmentType);

    if (segmentTypes) {
      const segmentFound = segmentTypes.find(
        (seg) => seg.segmentKey === row.segmentKey
      );

      if (segmentFound) {
        return isEnglish
          ? segmentFound.segmentEnType
          : segmentFound.segmentArType;
      } else {
        ("-");
      }
    } else {
      ("-");
    }
  };

  const onEditSegment = async () => {
    if (currentSchemaDetails) {
      const clonedDetails = [...currentSchemaDetails];

      const filteredDetails = clonedDetails.map((detail) => {
        if (detail.order === selectedSegment?.order) {
          return selectedSegment;
        } else {
          return detail;
        }
      });
      setIsModalVisible(false);
      setCurrentSchemaDetails(filteredDetails);
    }
  };

  // Building Columns for the table
  const columns: CustomColumn<SegmentType>[] = [
    {
      field: "order",
      headerName: labels.lbl.user_title_order,
      width: 100,
      sortable: true,
    },
    {
      field: "segmentType",
      headerName: labels.tbl.segment_type,
      width: 150,
      sortable: true,
      renderCell: (row: SegmentType) => <p>{getTRheSegmentName(row)}</p>,
    },
    {
      field: "value",
      headerName: labels.tbl.value,
      width: 100,
      sortable: true,
    },
    {
      field: "sequenceNumberLength",
      headerName: labels.tbl.seq_num_length,
      width: 200,
      sortable: true,
    },
    {
      field: "action",
      headerName: "Action",
      width: 100,
      sortable: false,
      renderCell: (row) => (
        <Row style={{ display: "flex", flexWrap: "nowrap" }}>
          <Button
            disabled={!showDelete || row.order === "1"}
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleRemoveSegment(row.order)}
            style={{ marginRight: 10 }}
          />
          <Button
            disabled={row.order === "1"}
            danger
            icon={<EditFilled />}
            onClick={() => {
              setSelectedSegment(row);
              setIsModalVisible(true);
            }}
            style={{ marginRight: 10 }}
          />
        </Row>
      ),
    },
  ];

  return (
    <>
      <TitleBar
        title={{
          ar: "إدارة مخطط المراسلات",
          en: "Correspondence Schema Management",
        }}
      />
      <br />

      <Dropdown
        placeholder={
          language === LANGUAGE.ENGLISH_INT
            ? "Select type of schema"
            : "اختر نوع المخطط"
        }
        onChange={(key) =>
          handleChangeSelectSchemaType(
            key as string,
            schemaTypeListInDropdownFormat
          )
        }
        options={schemaTypeListInDropdownFormat}
        defaultValue={selectedSchemaType?.value}
      />

      <CorrespondenceSchemaSegmentManager
        schemaType={selectedSchemaType?.value as string}
        onAddSegment={(item, value) => handleAddSegment(item.segmentKey, value)}
        showSave={isModified}
        isDelete={showDelete}
        onDeleteSegment={() => setShowDelete((val) => !val)}
        onReset={resetState}
        onSave={() =>
          handleSaveSegment(
            selectedSchemaType?.value as string,
            currentSchemaDetails as SegmentType[]
          )
        }
        onRearrange={() => setIsRearrangable((val) => !val)}
        isRearrange={isRearrangable}
      />

      {currentSchemaDetails ? (
        <DraggableTable
          columns={columns}
          data={
            currentSchemaDetails.map((item) => ({
              ...item,
              key: item.order,
            })) as any
          }
          onChange={handleSchemaOrderChange}
          paginationProps={{
            size: "small",
            defaultPageSize: 10,
            showTotal: (total) => `Total ${total} items`,
            showSizeChanger: true,
            pageSizeOptions: [5, 10, 20],
          }}
          draggable={isRearrangable}
        />
      ) : (
        <Text ar="لا توجد قطاعات متاحة" en=" No segments available" />
      )}

      {isModalVisible && (
        <Modal
          title={
            language === LANGUAGE.ENGLISH_INT
              ? "Select Segment Type"
              : "اختر نوع القسم"
          }
          open={isModalVisible}
          onOk={onEditSegment}
          onCancel={() => setIsModalVisible(false)}
        >
          <MaterialSelect
            label={labels.tbl.segment_type + " *"}
            value={selectedSegment?.segmentKey}
            options={
              (
                getSegmentTypeList(selectedSchemaType?.value as string) ?? []
              ).map((classification: any) => {
                return {
                  label: isEnglish
                    ? classification.segmentEnType
                    : classification.segmentArType,
                  value: classification.segmentKey,
                };
              }) ?? []
            }
            onChange={(value: string) => {
              const clonedValues = { ...selectedSegment };
              clonedValues.segmentKey = value;
              if (value !== "fixed" && value !== "sequence.no") {
                clonedValues.value = "";
                clonedValues.sequenceNumberLength = 0;
              }
              setSelectedSegment(clonedValues as SegmentType);
            }}
            style={{ height: 45, marginBottom: 20 }}
          />
          {selectedSegment?.segmentKey === "fixed" ||
          selectedSegment?.segmentKey === "sequence.no" ? (
            <MaterialInput
              label={
                (selectedSegment?.segmentKey !== "fixed"
                  ? labels.tbl.seq_num_length
                  : labels.tbl.value) + " *"
              }
              onChange={(e: ChangeEvent<HTMLInputElement>) => {
                const clonedValues = { ...selectedSegment };
                if (selectedSegment?.segmentKey === "fixed") {
                  clonedValues.value = String(e.target.value);
                  clonedValues.sequenceNumberLength = 0;
                } else if (selectedSegment?.segmentKey === "sequence.no") {
                  clonedValues.value = "";
                  clonedValues.sequenceNumberLength = Number(e.target.value);
                } else {
                  clonedValues.value = "";
                  clonedValues.sequenceNumberLength = 0;
                }

                setSelectedSegment(clonedValues);
              }}
              value={
                selectedSegment?.segmentKey === "fixed"
                  ? selectedSegment.value
                  : selectedSegment.sequenceNumberLength
              }
            />
          ) : (
            <></>
          )}
        </Modal>
      )}
    </>
  );
}
