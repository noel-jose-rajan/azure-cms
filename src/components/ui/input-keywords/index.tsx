// import { CSSProperties, ChangeEvent, useState } from "react";
// import { Input, Tag } from "antd";
// import { useTheme } from "../../../context/theme";

// interface MaterialInputProps {
//   label: string;
//   error?: string;
//   value?: string[];
//   style?: CSSProperties;
//   onChange?: (values: string[]) => void;
// }
// //not used
// export function MaterialTagInput({
//   label,
//   error,
//   value,
//   style,
//   onChange,
// }: MaterialInputProps) {
//   const [focused, setFocused] = useState(false);
//   const [inputValue, setInputValue] = useState("");
//   const [tags, setTags] = useState<string[]>(value ?? []); // Maintain internal state
//   const { theme } = useTheme();

//   const labelStyles: CSSProperties = {
//     position: "absolute",
//     left: "8px",
//     top: focused || tags.length > 0 || inputValue ? "-10px" : "50%",
//     transform:
//       focused || tags.length > 0 || inputValue
//         ? "translateY(0)"
//         : "translateY(-50%)",
//     fontSize: focused || tags.length > 0 || inputValue ? "12px" : "16px",
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
//     paddingBottom: "4px",
//   };

//   const inputStyles: CSSProperties = {
//     padding: "4px 10px",
//     flex: 1,
//     border: "none",
//     outline: "none",
//     transition: "border-color 0.3s ease",
//     boxShadow: "none",
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
//     return "grey";
//   };

//   const handleClose = (removedTag: string) => {
//     const updatedTags = tags.filter((tag) => tag !== removedTag);
//     setTags(updatedTags);
//     onChange?.(updatedTags);
//   };

//   const handleInputConfirm = () => {
//     if (inputValue.trim() && !tags.includes(inputValue.trim())) {
//       const newTags = [...tags, inputValue.trim()];
//       setTags(newTags);
//       onChange?.(newTags);
//     }
//     setInputValue("");
//   };

//   const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
//     setInputValue(e.target.value);
//   };

//   return (
//     <>
//       <div style={{ ...wrapperStyles, ...style }}>
//         <label style={{ ...labelStyles, color: getColor(), zIndex: 20 }}>
//           {label}
//         </label>
//         <div
//           style={{
//             display: "flex",
//             flexWrap: "wrap",
//             gap: "4px",
//             marginBottom: "4px",
//           }}
//         >
//           {tags.map((tag) => (
//             <Tag key={tag} closable onClose={() => handleClose(tag)}>
//               {tag}
//             </Tag>
//           ))}
//           <Input
//             onFocus={() => setFocused(true)}
//             onBlur={() => setFocused(false)}
//             value={inputValue}
//             onChange={handleInputChange}
//             onPressEnter={handleInputConfirm}
//             style={inputStyles}
//             variant="borderless"
//           />
//         </div>
//         <div style={{ ...underlineStyles, backgroundColor: getColor() }}></div>
//       </div>
//       {error && (
//         <p style={{ color: "red", fontSize: "10px", marginTop: "2px" }}>
//           {error}
//         </p>
//       )}
//     </>
//   );
// }
