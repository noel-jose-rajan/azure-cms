// import { useEffect, useState } from "react";
// import { Select, Input } from "antd";
// import { useLanguage } from "@/context/language";
// import { englishLabels } from "@/constants/app-constants/en";
// import { arabicLabels } from "@/constants/app-constants/ar";
// import TableComponent from "@/components/ui/table-component";
// import TitleBar from "@/components/ui/bar/title-bar";
// import ButtonComponent from "@/components/ui/button";
// const sectionLabels = {
//   lbl: { en: "Labels", ar: "تسميات" },
//   btn: { en: "Buttons", ar: "أزرار" },
//   til: { en: "Titles", ar: "العناوين" },
//   tbl: { en: "Tables", ar: "الجداول" },
//   msg: { en: "Messages", ar: "الرسائل" },
//   mnu: { en: "Main Menu", ar: "القائمة الرئيسية" },
//   ph: { en: "Page Header", ar: "رأس الصفحة" },
//   pk: { en: "Picklist", ar: "قائمة اختيار" },
// };
// const { Option } = Select;

// const TranslationEditor = () => {
//   const [selectedSection, setSelectedSection] = useState("lbl");
//   const [dataSource, setDataSource] = useState([]);
//   const { isEnglish, labels } = useLanguage();
//   const loadSection = (section) => {
//     const arSection = arabicLabels[section] || {};
//     const enSection = englishLabels[section] || {};
//     const merged = Object.keys(arSection).map((key) => ({
//       key,
//       arabic: arSection[key],
//       english: enSection[key] || "",
//     }));

//     setDataSource(merged);
//   };

//   useEffect(() => {
//     loadSection(selectedSection);
//   }, [selectedSection]);

//   const handleEdit = (index, field, value) => {
//     const updated = [...dataSource];
//     updated[index][field] = value;
//     setDataSource(updated);
//   };

//   const columns = [
//     {
//       title: "Key",
//       dataIndex: "key",
//       key: "key",
//     },
//     {
//       title: "Arabic",
//       dataIndex: "arabic",
//       key: "arabic",
//       render: (text, _, index) => (
//         <Input
//           value={text}
//           onChange={(e) => handleEdit(index, "arabic", e.target.value)}
//         />
//       ),
//     },
//     {
//       title: "English",
//       dataIndex: "english",
//       key: "english",
//       render: (text, _, index) => (
//         <Input
//           value={text}
//           onChange={(e) => handleEdit(index, "english", e.target.value)}
//         />
//       ),
//     },
//   ];

//   return (
//     <div
//       style={{
//         display: "flex",
//         flexDirection: "column",
//         alignItems: isEnglish ? "start" : "end",
//       }}
//     >
//       <TitleBar headerText={labels.mnu.translation_manager} />
//       <div
//         style={{
//           margin: "16px 0",
//           display: "flex",
//           justifyContent: "space-between",
//           width: "100%",
//           flexDirection: !isEnglish ? "row" : "row-reverse",
//           alignItems: "center",
//         }}
//       >
//         <ButtonComponent buttonLabel="حفظ التغييرات" type="primary" />
//         <Select
//           value={selectedSection}
//           onChange={setSelectedSection}
//           style={{ width: 200, marginBlock: 16, border: "1px solid #ccc" }}
//         >
//           {Object.keys(arabicLabels).map((section) => {
//             const value = arabicLabels[section];
//             const isObject =
//               typeof value === "object" &&
//               !Array.isArray(value) &&
//               value !== null;
//             const label = sectionLabels[section];

//             return isObject && label ? (
//               <Option key={section} value={section}>
//                 {isEnglish ? label.en : label.ar}
//               </Option>
//             ) : null;
//           })}
//         </Select>
//       </div>

//       <TableComponent dataSource={dataSource} columns={columns} rowKey="key" />
//     </div>
//   );
// };

// export default TranslationEditor;

import { useEffect, useState } from "react";
import { Select, Input } from "antd";
import type { ColumnsType } from "antd/es/table";
import { useLanguage } from "@/context/language";
import { englishLabels } from "@/constants/app-constants/en";
import { arabicLabels } from "@/constants/app-constants/ar";
import TableComponent from "@/components/ui/table-component";
import TitleBar from "@/components/ui/bar/title-bar";
import ButtonComponent from "@/components/ui/button";

const { Option } = Select;

type LabelRow = {
  key: string;
  arabic: string;
  english: string;
};

type SectionKey = keyof typeof sectionLabels;

const sectionLabels: Record<string, { en: string; ar: string }> = {
  lbl: { en: "Labels", ar: "تسميات" },
  btn: { en: "Buttons", ar: "أزرار" },
  til: { en: "Titles", ar: "العناوين" },
  tbl: { en: "Tables", ar: "الجداول" },
  msg: { en: "Messages", ar: "الرسائل" },
  mnu: { en: "Main Menu", ar: "القائمة الرئيسية" },
  ph: { en: "Page Header", ar: "رأس الصفحة" },
  pk: { en: "Picklist", ar: "قائمة اختيار" },
};

const TranslationEditor = () => {
  const [selectedSection, setSelectedSection] = useState<SectionKey>("lbl");
  const [dataSource, setDataSource] = useState<LabelRow[]>([]);
  const { isEnglish, labels } = useLanguage();

  const loadSection = (section: SectionKey) => {
    const arSection = arabicLabels[section] || {};
    const enSection = englishLabels[section] || {};
    const merged: LabelRow[] = Object.keys(arSection).map((key) => ({
      key,
      arabic: arSection[key],
      english: enSection[key] || "",
    }));
    setDataSource(merged);
  };

  useEffect(() => {
    loadSection(selectedSection);
  }, [selectedSection]);

  const handleEdit = (index: number, field: keyof LabelRow, value: string) => {
    const updated = [...dataSource];
    updated[index][field] = value;
    setDataSource(updated);
  };

  const columns: ColumnsType<LabelRow> = [
    {
      title: "Key",
      dataIndex: "key",
      key: "key",
    },
    {
      title: "Arabic",
      dataIndex: "arabic",
      key: "arabic",
      render: (text: string, _: LabelRow, index: number) => (
        <Input
          value={text}
          onChange={(e) => handleEdit(index, "arabic", e.target.value)}
        />
      ),
    },
    {
      title: "English",
      dataIndex: "english",
      key: "english",
      render: (text: string, _: LabelRow, index: number) => (
        <Input
          value={text}
          onChange={(e) => handleEdit(index, "english", e.target.value)}
        />
      ),
    },
  ];

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: isEnglish ? "start" : "end",
      }}
    >
      <TitleBar headerText={labels.mnu.translation_manager} />
      <div
        style={{
          margin: "16px 0",
          display: "flex",
          justifyContent: "space-between",
          width: "100%",
          flexDirection: !isEnglish ? "row" : "row-reverse",
          alignItems: "center",
        }}
      >
        <ButtonComponent buttonLabel="حفظ التغييرات" type="primary" />
        <Select<SectionKey>
          value={selectedSection}
          onChange={(value) => setSelectedSection(value)}
          style={{ width: 200, marginBlock: 16, border: "1px solid #ccc" }}
        >
          {Object.keys(arabicLabels).map((section) => {
            const value = arabicLabels[section];
            const isObject =
              typeof value === "object" &&
              !Array.isArray(value) &&
              value !== null;
            const label = sectionLabels[section];

            return isObject && label ? (
              <Option key={section} value={section as SectionKey}>
                {isEnglish ? label.en : label.ar}
              </Option>
            ) : null;
          })}
        </Select>
      </div>

      <TableComponent dataSource={dataSource} columns={columns} rowKey="key" />
    </div>
  );
};

export default TranslationEditor;
