import React, { useEffect, useRef, useState } from "react";
import { CorrespondenceSearchCriteria } from "./types";
import { search as corrSearch, searchCount } from "./service";
import MiniSearch from "./components/mini-search";
import { Button, Modal, Tag } from "antd";
import { useLanguage } from "../../../../context/language";
import { CorrespondenceType } from "../../../../types/correspondence";
import { useTheme } from "../../../../context/theme";
import ResultTable from "./components/result-table";
import SearchBar from "./components/search-bar";
import { AxiosRequestConfig } from "axios";
import apiRequest from "../../../../lib/api";
import ENV from "../../../../constants/env";
import Storage from "../../../../lib/storage";
import LOCALSTORAGE from "../../../../constants/local-storage";
import { LoadingOutlined } from "@ant-design/icons";

interface Props {
  label?: string;
  multiple?: boolean;
  onSelect?: (corr: CorrespondenceType[]) => any;
  values?: CorrespondenceType[];
}

const TheTag = React.memo(
  ({
    corrId,
    value,
    handleRemove,
  }: {
    corrId: string;
    value?: string;
    handleRemove: (
      e?: React.MouseEvent<HTMLElement>,
      removeId?: string | null
    ) => any;
  }) => {
    const {
      theme: { colors },
    } = useTheme();

    const [val, setVal] = useState<string>("");

    // Ref to hold the initial value of `val` to prevent unnecessary API calls
    const valueRef = useRef<string | null>(null);

    const getCorrespondenceDetails = async (id: string) => {
      const token = Storage.getItem(LOCALSTORAGE.LEGACY_ACCESS_TOKEN);

      try {
        let url = `/correspodence/${id}?isInCreateMode=true`;

        const headers: AxiosRequestConfig["headers"] = {
          Authorization: "Bearer " + token,
        };

        const response = await apiRequest(
          "GET",
          url,
          {},
          { headers },
          ENV.API_URL_LEGACY
        );

        if (valueRef.current === null) {
          setVal(response.correspondenceNo);
          valueRef.current = response.correspondenceNo; // Store the value to avoid re-fetching
        }
      } catch (error: unknown) {
        console.error("Error fetching correspondence details", error);
      }
    };

    useEffect(() => {
      if (!value && val === "") {
        getCorrespondenceDetails(corrId);
      } else {
        valueRef.current = value ?? val; // Store the value if it is provided externally
      }

      return () => {};
    }, [corrId, value, val]);

    return (
      <Tag
        style={{ margin: "5px" }}
        color={colors.primary} // Replace with the correct color from your context
        closeIcon
        onClose={(e) => handleRemove(e, corrId)}
      >
        {value ?? val} {!value && val === "" && <LoadingOutlined />}
      </Tag>
    );
  }
);

//not used
export default function CorrespondenceSearch({
  label,
  multiple,
  onSelect,
  values,
}: Props) {
  //context
  const { labels } = useLanguage();

  // States
  const [open, setOpen] = useState<boolean>(false);

  const [search, setSearch] = useState<CorrespondenceSearchCriteria>({
    query: {
      correspondenceTypeCode: "all",
      criteriaValue: "",
      page: 0,
      receivingEntityType: 0,
      sendingEntityType: 0,
      size: 10,
      sort: "correspondenceDate,desc",
    },
    singleCriteria: {
      finalApproverOrgUnitId: -1,
      correspondenceNo: "",
      subject: "",
      createdByMe: false,
      isDeleted: false,
      contentSearch: false,
      externalReferenceNo: "",
      barcode: "",
      inboundSenderName: "",
      correspondenceDateFrom: "",
      correspondenceDateTo: "",
      recieveDateFrom: "",
      recieveDateTo: "",
      createdDateFrom: "",
      createdDateTo: "",
      signDateFrom: "",
      signDateTo: "",
      sentDateFrom: "",
      sentDateTo: "",
    },
    multiCriteria: {
      statusPicklistIDs: [],
      securityPicklistIDs: [],
      urgencyPicklistIDs: [],
      documentTypePicklistIDs: [],
      keywords: [],
      recievingEntityIDs: [],
      sendingEntityIDs: [],
      relatedCorrespondenceIDs: [],
    },
  });

  const handleOnClose = () => {
    setOpen(() => false);
  };

  const handleRemove = (
    e?: React.MouseEvent<HTMLElement>,
    removeId?: string | null
  ) => {
    if (Array.isArray(values)) {
      let fin = values.filter((f) => f.corrId !== removeId);
      onSelect && onSelect(fin);
    }
    e?.preventDefault();
  };

  const renderTags = () => {
    return values?.map((corr, key) => (
      <TheTag
        key={key}
        corrId={corr.corrId}
        value={corr.correspondenceNo}
        handleRemove={handleRemove}
      />
    ));
  };

  useEffect(() => {
    corrSearch(search).then((d) => console.log(d));

    searchCount(search).then((d) => console.log(d));

    return () => {};
  }, []);

  const handleOnSelect = (corr: CorrespondenceType) => {
    const newCorr = values?.find((f) => f.corrId === corr.corrId);

    if (!newCorr) {
      onSelect && onSelect([...(values ?? []), corr]);
    }
  };

  return (
    <>
      <MiniSearch
        label={label}
        onSelect={handleOnSelect}
        onAdvanceSearch={() => setOpen(() => true)}
      />
      <span>{renderTags()}</span>

      <Modal
        open={open}
        onClose={handleOnClose}
        onCancel={handleOnClose}
        title={labels.til.search_corres}
        style={{ maxWidth: "1500px" }}
        width={"90vw"}
        footer={
          multiple
            ? [
                <Button key="ok" type="primary" onClick={handleOnClose}>
                  {labels.btn.ok}
                </Button>,
              ]
            : null
        }
      >
        <SearchBar values={search} onChange={(e: any) => setSearch(e)} />

        <br />
        <ResultTable
          // key={JSON.stringify(value)}
          // onSelect={(unit) => onSelect && onSelect(unit)}
          value={values}
          onRemove={(id) => handleRemove(undefined, id)}
          onSelect={(unit) => {
            handleOnSelect(unit);
            !multiple && setOpen(() => false);
          }}
          searchProps={search}
          multiple={multiple}
          onQueryUpdate={(e) => setSearch(e)}
        />
      </Modal>
    </>
  );
}
