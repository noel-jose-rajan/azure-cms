import { useEffect, useState } from "react";
import TitleBar from "../../components/ui/bar/title-bar";
import ActionMenuItem from "../../components/ui/menu-item";
import { useLanguage } from "../../context/language";
import GroupListTable from "./components/group-list-table";
import {
  getAllAppPrivilege,
  getAllAppViews,
} from "@/components/services/application-privilege/service";
import { HttpStatus } from "@/components/functional/httphelper";
import { AppPrivilegeType } from "@/components/services/application-privilege/type";
import CreateEditAppPrivilege from "./components/create-privileges";
import { set } from "lodash";
import { Button } from "antd";
import { PlusOutlined } from "@ant-design/icons";

export default function ApplicationPrivileges() {
  const { labels, isEnglish } = useLanguage();

  const [open, setOpen] = useState<boolean>(false);
  const [privileges, setPrivileges] = useState<AppPrivilegeType[]>([]);
  const [edit, setEdit] = useState<AppPrivilegeType>();
  const [applicationViews, setApplicationViews] = useState<AppPrivilegeType[]>(
    []
  );

  const { mnu, btn } = labels;

  useEffect(() => {
    init();
  }, []);

  const init = async () => {
    await getAllApplicationPrivileges();
    await getAllApplicationViews();
  };

  const getAllApplicationPrivileges = async () => {
    const response = await getAllAppPrivilege();

    if (response.status === HttpStatus.SUCCESS && response.data) {
      setPrivileges(response.data);
    }
  };

  const getAllApplicationViews = async () => {
    try {
      const response = await getAllAppViews();
      if (response.status === HttpStatus.SUCCESS && response.data) {
        setApplicationViews(response.data);
      } else {
        setApplicationViews([]);
      }
    } catch (error) {
      setApplicationViews([]);
    }
  };

  return (
    <>
      <TitleBar headerText={mnu.accessibility_priviliges} />
      <br />

      <div
        style={{
          flexDirection: !isEnglish ? "row" : "row-reverse",
          display: "flex",
        }}
      >
        <Button type="primary" onClick={() => setOpen(() => true)}>
          <PlusOutlined />
          {btn.add_new}
        </Button>
      </div>

      {open && (
        <CreateEditAppPrivilege
          privileges={privileges}
          open={open}
          onClose={async (refresh: boolean) => {
            setOpen(false);
            setEdit(undefined);
            if (refresh) {
              await init();
            }
          }}
          key={`${JSON.stringify(edit)}`}
          editValue={edit}
          applicationViews={applicationViews}
        />
      )}

      <GroupListTable
        privileges={privileges}
        onEdit={(e: AppPrivilegeType) => {
          setEdit(e);
          setOpen(true);
        }}
        applicationViews={applicationViews}
        updatePrivileges={setPrivileges}
      />
    </>
  );
}
