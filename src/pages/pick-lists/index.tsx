import { CSSProperties, useEffect, useRef, useState } from "react";
import LoaderComponent from "../../components/ui/loader";
import { useLanguage } from "../../context/language";
import EmptyPickListItems from "./components/empty-list";
import AddNewPickListItem from "./components/add-new";
import PickListTable from "./components/table";
import TitleBar from "../../components/ui/bar/title-bar";
import TitleHeader from "../../components/ui/header";
import { FilterFilled, PlusOutlined } from "@ant-design/icons";
import {
  createNewPickListItem,
  getAllPickLists,
} from "../../components/services/picklist";
import {
  CreatePickListItemType,
  PickList,
  PickListType,
} from "../../components/services/picklist/type";
import { HttpStatus } from "@/components/functional/httphelper";
import {
  filterOutDisctinctPickListItems,
  getPickListsItemsByName,
} from "@/components/functional/picklists";
import { MaterialSelect } from "@/components/ui/dropdown/material-dropdown";
import { useTheme } from "@/context/theme";
import { Button } from "antd";
import SelectComponent from "@/components/ui/form/select";

export default function PickLists() {
  const [pickLists, setPickLists] = useState<PickListType[]>([]);
  const [selected, setSelected] = useState<PickListType>();
  const [pickListItems, setPickListItems] = useState<PickList[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [openCreate, setOpenCreate] = useState<boolean>(false);
  const { isEnglish, labels } = useLanguage();
  const allPickLists = useRef<PickList[]>([]);
  const {
    theme: { colors },
  } = useTheme();

  useEffect(() => {
    init();
  }, []);

  const init = async () => {
    setLoading(true);
    const response = await getAllPickLists();

    if (response.status === HttpStatus.SUCCESS && response.data) {
      allPickLists.current = response.data;
      const filteredDistinct = filterOutDisctinctPickListItems(response.data);
      setPickLists(filteredDistinct);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (selected) {
      fetchPickListItems();
    }
  }, [selected]);

  const fetchPickListItems = async () => {
    setLoading(true);
    const response = getPickListsItemsByName(
      allPickLists.current,
      selected?.picklistName ?? ""
    );

    setPickListItems(response);

    setLoading(false);
  };

  const createANewItem = async (item: CreatePickListItemType) => {
    const picklisId = allPickLists.current.reduce((maxUser, currentUser) => {
      return currentUser.picklist_id > maxUser.picklist_id
        ? currentUser
        : maxUser;
    });

    item.picklist_id = picklisId.picklist_id + 1;

    const response = await createNewPickListItem(item);

    if (response.status === HttpStatus.SUCCESS) {
      const newItem: PickList = {
        picklist_id: response.data.picklist_id,
        picklist_ar_label: item.picklist_ar_label,
        picklist_en_label: item.picklist_en_label,
        picklist_code: item.picklist_code,
        picklist_name: selected?.picklistName ?? "",
        picklist_type: selected?.picklistType ?? "",
        is_enable: true,
        enable_change: true,
      };

      setPickListItems((prev) => [...prev, newItem]);

      const updatedAllPickLists = [...allPickLists.current, newItem];

      allPickLists.current = updatedAllPickLists;
    }

    setOpenCreate(false);
  };

  const customLabels = {
    selectAPickList: isEnglish ? "Select a Picklist" : "حدد قائمة الاختيار",
  };

  const styles: { [x: string]: CSSProperties } = {
    iconStyle: {
      marginLeft: isEnglish ? 0 : 10,
      marginRight: isEnglish ? 10 : 0,
      marginTop: 10,
    },
    plSelectWraper: {
      flexDirection: isEnglish ? "row" : "row-reverse",
      width: "98%",
      display: "flex",
      padding: "0px 1%",
      marginTop: 20,
      alignItems: "center",
      msFlexDirection: "column",
    },
    plTypeWrapper: {
      justifyContent: isEnglish ? "left" : "right",
      display: "flex",
      flex: 1,
      alignItems: "center",
      marginLeft: 20,
    },
  };

  return (
    <>
      <TitleBar headerText={labels.mnu.picklists} />
      <TitleHeader
        heading={labels.til.picklist_filter}
        icon={<FilterFilled style={{ color: "#fff" }} />}
      />
      <div
        style={{
          width: "100%",
          marginTop: 12,
          display: "flex",
          justifyContent: isEnglish ? "start" : "end",
        }}
      >
        <div style={{ width: 300 }}>
          <SelectComponent
            setFirstOptionAsDefault
            label={customLabels.selectAPickList}
            onChange={(value) => {
              const filtered = pickLists.find(
                (item) => item.picklistName === value
              );
              setSelected(filtered);
            }}
            value={selected?.picklistName ?? ""}
            options={pickLists.map((item) => {
              return {
                label: item.picklistName,
                value: item.picklistName,
              };
            })}
          />
        </div>
      </div>

      {selected && (
        <div style={styles.plTypeWrapper}>
          <p style={{ color: colors.primary }}>
            {labels.lbl.picklist_category + " : " + selected?.picklistType}
          </p>
        </div>
      )}

      {selected ? (
        <div style={{ padding: 10 }}>
          <div
            style={{
              flexDirection: !isEnglish ? "row" : "row-reverse",
              display: "flex",
              flexWrap: "wrap",
              marginTop: 10,
            }}
          >
            <Button
              onClick={() => setOpenCreate(true)}
              disabled={selected.picklistType === "System"}
              type="primary"
            >
              <PlusOutlined />
              {labels.btn.add_new}
            </Button>
          </div>
          <div
            style={{
              borderRadius: "2px",
              marginTop: 20,
              border: "1px solid #cbcbcb",
            }}
          >
            <PickListTable
              pickListItems={pickListItems}
              selected={selected}
              updatePickListItems={setPickListItems}
              allPickLists={allPickLists.current}
              updateAllPickLists={(pls: PickList[]) => {
                allPickLists.current = pls;
              }}
            />
          </div>
        </div>
      ) : (
        <EmptyPickListItems />
      )}
      <AddNewPickListItem
        title={
          isEnglish ? "Create New PickList" : "قم بإنشاء قائمة مرجعية جديدة"
        }
        visible={openCreate}
        pickList={selected}
        onSubmit={createANewItem}
        onCancel={() => {
          setOpenCreate(false);
        }}
        allPickLists={allPickLists.current}
      />
      {loading && <LoaderComponent loading={loading} />}
    </>
  );
}
