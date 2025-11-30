import { useLanguage } from "../../../../context/language";
import { useEffect, useRef, useState } from "react";
import { Accordion } from "../../../../components/ui/accordions/accordion";
import { Checkbox } from "antd";
import { getAllNotificationPreferences } from "@/components/services/user-preference";
import { HttpStatus } from "@/components/functional/httphelper";
import { NotificationPreferencesType } from "@/components/services/user-preference/type";

interface Props {
  userId?: number;
  changedOptedTypes: number[];
  updateChangesOnOptType: (types: number[]) => void;
}

const Header = ({ title }: { title?: string }) => (
  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
    <span>{title}</span>
  </div>
);

const CheckboxList = ({
  userId,
  changedOptedTypes,
  updateChangesOnOptType,
}: Props) => {
  const {
    labels: { lbl },
    isEnglish,
  } = useLanguage();
  const [includedUINotifications, setIncludedUINotifications] = useState<
    NotificationPreferencesType[]
  >([]);
  const [includedEmailNotifications, setIncludedEmailNotifications] = useState<
    NotificationPreferencesType[]
  >([]);

  useEffect(() => {
    init();
  }, [userId]);

  const init = async () => {
    if (userId) {
      await fetchNotificationTypes();
    }
  };

  const fetchNotificationTypes = async () => {
    const response = await getAllNotificationPreferences();

    if (response.status === HttpStatus.SUCCESS && response.data) {
      const filterEmail = response.data.filter(
        (type) => type.type_code === "EMAIL"
      );

      const filterUINotifications = response.data.filter(
        (type) => type.type_code === "UI_NOTIFICATION"
      );

      setIncludedEmailNotifications(filterEmail);
      setIncludedUINotifications(filterUINotifications);
    }
  };

  //   const handleChange = (
  //     item: NotificationPreferencesType,
  //     isChecked: boolean
  //   ) => {
  //     if (!isChecked) {
  //       setExcludedNotifications((val) => [...val, item]);

  //       onChange && onChange([...excludedNotifications, item], true);
  //     } else {
  //       const newData = excludedNotifications.filter((f) => f.code !== item.code);
  //       setExcludedNotifications(() => newData);
  //       onChange && onChange(newData, true);
  //     }
  //   };

  return (
    <>
      <br />
      <Accordion
        children={
          <div style={{ maxHeight: "300px", overflow: "scroll" }}>
            {includedUINotifications.map((item, key) => {
              return (
                <div key={key}>
                  <Checkbox
                    checked={changedOptedTypes.includes(item.id)}
                    onChange={(e) => {
                      if (changedOptedTypes.includes(item.id)) {
                        const filterItem = [...changedOptedTypes].filter(
                          (options) => options !== item.id
                        );
                        updateChangesOnOptType(filterItem);
                      } else {
                        updateChangesOnOptType([...changedOptedTypes, item.id]);
                      }
                    }}
                  />{" "}
                  {isEnglish ? item.name_en : item.name_ar}
                </div>
              );
            })}
          </div>
        }
        header={<Header title={lbl.user_pref_receiving_notifications} />}
        panelKey="0"
      />

      <br />

      <Accordion
        children={
          <div style={{ maxHeight: "300px", overflow: "scroll" }}>
            {includedEmailNotifications.map((item, key) => (
              <div key={key}>
                <Checkbox
                  checked={changedOptedTypes.includes(item.id)}
                  onChange={(e) => {
                    if (changedOptedTypes.includes(item.id)) {
                      const filterItem = [...changedOptedTypes].filter(
                        (options) => options !== item.id
                      );
                      updateChangesOnOptType(filterItem);
                    } else {
                      updateChangesOnOptType([...changedOptedTypes, item.id]);
                    }
                  }}
                />{" "}
                {isEnglish ? item.name_en : item.name_ar}
              </div>
            ))}
          </div>
        }
        header={<Header title={lbl.user_pref_receiving_emails} />}
        panelKey="1"
      />
    </>
  );
};

export default CheckboxList;
