// // import { CSSProperties, useState } from "react";
// // import { Input } from "antd";
// // import { useTheme } from "../../../../context/theme";
// // import { useLanguage } from "../../../../context/language";

// // interface MaterialInputProps {
// //   label: string;
// //   error?: string;
// //   [x: string]: any;
// //   allowEdit?: boolean;
// //   style?: CSSProperties;
// //   options?: string[];
// // }

// // export function MaterialInputSearch({
// //   label,
// //   error,
// //   value,
// //   onBlur,
// //   allowEdit = true,
// //   style,
// //   options,
// //   ...rest
// // }: MaterialInputProps) {
// //   const [focused, setFocused] = useState(false);
// //   const { theme } = useTheme();
// //   const { isEnglish } = useLanguage();

// //   const labelStyles: CSSProperties = {
// //     position: "absolute",
// //     top: focused || value ? "-10px" : "50%",
// //     transform: focused || value ? "translateY(0)" : "translateY(-50%)",
// //     fontSize: focused || value ? "12px" : "16px",
// //     color: focused ? theme.colors.primary : "grey",
// //     transition: "all 0.3s ease",
// //     pointerEvents: "none",
// //   };

// //   const wrapperStyles: CSSProperties = {
// //     position: "relative",
// //     width: "100%",
// //     borderBottom: `1px solid ${
// //       error ? theme.colors.danger : theme.colors.success
// //     }`,
// //   };

// //   const inputStyles: CSSProperties = {
// //     padding: "8px 10px",
// //     width: "100%",
// //     border: "none",
// //     borderRadius: "0",
// //     outline: "none",
// //     transition: "border-color 0.3s ease",
// //     boxShadow: "none",
// //   };

// //   const underlineStyles: CSSProperties = {
// //     position: "absolute",
// //     bottom: "0",
// //     left: "0",
// //     height: "2px",
// //     width: focused ? "100%" : "0",
// //     transition: "width 0.3s ease",
// //   };

// //   const getColor = (): string => {
// //     if (error) return theme.colors.danger;
// //     if (focused) return theme.colors.success;
// //     if (!value) return error ? theme.colors.danger : "grey";
// //     return "grey";
// //   };

// //   return (
// //     <>
// //       <div style={{ ...wrapperStyles, ...style }}>
// //         <label
// //           style={{
// //             ...labelStyles,
// //             color: getColor(),
// //             ...(isEnglish ? { left: "8px" } : { right: "8px" }),
// //           }}
// //         >
// //           {label}
// //         </label>
// //         <Input
// //           onFocus={() => setFocused(true)}
// //           onBlur={(e) => {
// //             if (onBlur) onBlur(e);
// //             setFocused(false);
// //           }}
// //           value={value}
// //           disabled={!allowEdit}
// //           {...rest}
// //           style={{
// //             ...inputStyles,
// //           }}
// //           variant="borderless"
// //         />
// //         <div
// //           style={{
// //             ...underlineStyles,
// //             backgroundColor: error ? "#DB4437" : "#0F9D58",
// //           }}
// //         ></div>
// //       </div>
// //       <p style={{ color: "red", fontSize: 10, marginTop: 0, marginBottom: 0 }}>
// //         {error}
// //       </p>
// //     </>
// //   );
// // }

// import { CSSProperties, useState } from "react";
// import { AutoComplete } from "antd";
// import { useTheme } from "../../../../context/theme";
// import { useLanguage } from "../../../../context/language";

// interface MaterialInputProps {
//   label: string;
//   error?: string;
//   [x: string]: any;
//   allowEdit?: boolean;
//   style?: CSSProperties;
//   options?: string[];
// }

// export function MaterialInputSearch({
//   label,
//   error,
//   value,
//   onBlur,
//   allowEdit = true,
//   style,
//   options = [],
//   onChange,
//   ...rest
// }: MaterialInputProps) {
//   const [focused, setFocused] = useState(false);
//   const [inputValue, setInputValue] = useState(value || "");
//   const { theme } = useTheme();
//   const { isEnglish } = useLanguage();

//   const labelStyles: CSSProperties = {
//     position: "absolute",
//     top: focused || inputValue ? "-10px" : "50%",
//     transform: focused || inputValue ? "translateY(0)" : "translateY(-50%)",
//     fontSize: focused || inputValue ? "12px" : "16px",
//     color: focused ? theme.colors.primary : "grey",
//     transition: "all 0.3s ease",
//     pointerEvents: "none",
//   };

//   const wrapperStyles: CSSProperties = {
//     position: "relative",
//     width: "100%",
//     borderBottom: `1px solid ${
//       error ? theme.colors.danger : theme.colors.success
//     }`,
//   };

//   const inputStyles: CSSProperties = {
//     padding: "0px 10px",
//     width: "100%",
//     border: "none",
//     borderRadius: "0",
//     outline: "none",
//     transition: "border-color 0.3s ease",
//     boxShadow: "none",
//     backgroundColor: "transparent",
//     marginTop: 4,
//   };

//   const underlineStyles: CSSProperties = {
//     position: "absolute",
//     bottom: "0",
//     left: "0",
//     height: "2px",
//     width: focused ? "100%" : "0",
//     transition: "width 0.3s ease",
//   };

//   const getColor = (): string => {
//     if (error) return theme.colors.danger;
//     if (focused) return theme.colors.success;
//     if (!inputValue) return error ? theme.colors.danger : "grey";
//     return "grey";
//   };

//   const filteredOptions = options
//     ?.filter((opt) =>
//       opt.toLowerCase().includes(inputValue?.toLowerCase?.() || "")
//     )
//     .map((opt) => ({ value: opt }));

//   return (
//     <>
//       <div style={{ ...wrapperStyles, ...style }}>
//         <label
//           style={{
//             ...labelStyles,
//             color: getColor(),
//             ...(isEnglish ? { left: "8px" } : { right: "8px" }),
//           }}
//         >
//           {label}
//         </label>
//         <AutoComplete
//           value={inputValue}
//           onFocus={() => setFocused(true)}
//           onBlur={(e) => {
//             if (onBlur) onBlur(e);
//             setFocused(false);
//             if (onChange) onChange(e.target.textContent);
//           }}
//           onChange={(val) => {
//             setInputValue(val);
//             if (onChange) onChange(val);
//           }}
//           options={filteredOptions}
//           disabled={!allowEdit}
//           style={inputStyles}
//           {...rest}
//           bordered={false}
//         />
//         <div
//           style={{
//             ...underlineStyles,
//             backgroundColor: error ? "#DB4437" : "#0F9D58",
//           }}
//         ></div>
//       </div>
//       <p style={{ color: "red", fontSize: 10, marginTop: 0, marginBottom: 0 }}>
//         {error}
//       </p>
//     </>
//   );
// }

import { CSSProperties, useState } from "react";
import { AutoComplete } from "antd";
import { useTheme } from "../../../../context/theme";
import { useLanguage } from "../../../../context/language";

interface MaterialInputProps {
  label: string;
  error?: string;
  [x: string]: any;
  allowEdit?: boolean;
  style?: CSSProperties;
  options?: string[];
}

export function MaterialInputSearch({
  label,
  error,
  value,
  onBlur,
  allowEdit = true,
  style,
  options = [],
  onChange,
  ...rest
}: MaterialInputProps) {
  const [focused, setFocused] = useState(false);
  const [inputValue, setInputValue] = useState(value || "");
  const { theme } = useTheme();
  const { isEnglish } = useLanguage();

  const labelStyles: CSSProperties = {
    position: "absolute",
    top: focused || inputValue ? "-10px" : "50%",
    transform: focused || inputValue ? "translateY(0)" : "translateY(-50%)",
    fontSize: focused || inputValue ? "12px" : "16px",
    color: focused ? theme.colors.primary : "grey",
    transition: "all 0.3s ease",
    pointerEvents: "none",
  };

  const wrapperStyles: CSSProperties = {
    position: "relative",
    width: "100%",
    borderBottom: `1px solid ${
      error ? theme.colors.danger : theme.colors.success
    }`,
  };

  const inputStyles: CSSProperties = {
    padding: "8px 10px",
    width: "100%",
    border: "none",
    borderRadius: "0",
    outline: "none",
    transition: "border-color 0.3s ease",
    boxShadow: "none",
    backgroundColor: "transparent",
    marginTop: 5,
  };

  const underlineStyles: CSSProperties = {
    position: "absolute",
    bottom: "0",
    left: "0",
    height: "2px",
    width: focused ? "100%" : "0",
    transition: "width 0.3s ease",
  };

  const getColor = (): string => {
    if (error) return theme.colors.danger;
    if (focused) return theme.colors.success;
    if (!inputValue) return error ? theme.colors.danger : "grey";
    return "grey";
  };

  const filteredOptions = Array.from(
    new Set(
      options.filter((opt) =>
        opt?.toLowerCase().includes(inputValue?.toLowerCase?.() || "")
      )
    )
  ).map((opt) => ({ value: opt }));

  return (
    <>
      <div style={{ ...wrapperStyles, ...style }}>
        <label
          style={{
            ...labelStyles,
            color: getColor(),
            ...(isEnglish ? { left: "8px" } : { right: "8px" }),
          }}
        >
          {label}
        </label>
        <AutoComplete
          value={inputValue}
          onFocus={() => setFocused(true)}
          onBlur={(e) => {
            if (onBlur) onBlur(e);
            setFocused(false);
          }}
          onChange={(val) => {
            setInputValue(val);
            if (onChange) onChange(val);
          }}
          options={filteredOptions}
          disabled={!allowEdit}
          style={inputStyles}
          filterOption={false} // We do manual filtering
          {...rest}
          bordered={false}
        />
        <div
          style={{
            ...underlineStyles,
            backgroundColor: error ? "#DB4437" : "#0F9D58",
          }}
        ></div>
      </div>
      <p style={{ color: "red", fontSize: 10, marginTop: 0, marginBottom: 0 }}>
        {error}
      </p>
    </>
  );
}
