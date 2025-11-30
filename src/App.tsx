import { RouterProvider } from "react-router-dom";
import { ConfigProvider as AntdConfigProvider } from "antd";
import {
  ThemeProvider as MUIThemeProvider,
  createTheme,
} from "@mui/material/styles";
import { useTheme } from "./context/theme";
import { useLanguage } from "./context/language";
import { LANGUAGE } from "./constants/language";
import { router } from "./navigation/routes";
import { AllowedViewsProvider } from "./context/allowed-views";
import { Suspense } from "react";
import RouteFallback from "./navigation/routes/route-fallback";

function App() {
  console.log("New ENV's: ",import.meta.env);
  
  const { theme } = useTheme();
  const { language } = useLanguage();

  const parseThemeValue = (
    value: string | number | undefined,
    fallback: number = 0
  ): number => {
    if (typeof value === "number") return value;
    if (typeof value === "string") {
      return parseInt(value.replace(/px|rem|em/g, "")) || fallback;
    }
    return fallback;
  };

  const parsePaddingValue = (
    padding: string | undefined,
    index: number,
    fallback: number
  ): number => {
    if (!padding) return fallback;
    const parts = padding.split(" ");
    if (parts.length > index) {
      return parseThemeValue(parts[index], fallback);
    }
    return fallback;
  };

  // Create MUI theme based on your context
  const muiTheme = createTheme({
    palette: {
      primary: {
        main: theme?.colors?.primary || "#1890ff",
        dark: theme?.colors?.primaryDark || "#096dd9",
        light: theme?.colors?.primaryLight || "#40a9ff",
      },
      secondary: {
        main: theme?.colors?.secondary || "#722ed1",
      },
      text: {
        primary: theme?.colors?.text || "#000000",
        secondary: theme?.colors?.textSecondary || "#666666",
        disabled: theme?.colors?.disabled || "#cccccc",
      },
      background: {
        default: theme?.colors?.background || "#ffffff",
        paper: theme?.colors?.surface || "#ffffff",
      },
      success: {
        main: theme?.colors?.success || "#52c41a",
      },
      warning: {
        main: theme?.colors?.warning || "#faad14",
      },
      error: {
        main: theme?.colors?.danger || "#ff4d4f",
      },
      info: {
        main: theme?.colors?.info || "#1890ff",
      },
      divider: theme?.colors?.border || "#d9d9d9",
    },
    typography: {
      fontFamily: theme?.typography?.fontFamily || "'Inter', sans-serif",
      fontSize: theme?.typography?.fontSize || 14,
      fontWeightLight: theme?.typography?.fontWeightLight || 300,
      fontWeightRegular: theme?.typography?.fontWeightRegular || 400,
      fontWeightBold: theme?.typography?.fontWeightBold || 600,
      h1: {
        fontSize: theme?.typography?.headings?.h1?.fontSize || "2rem",
        fontWeight: theme?.typography?.headings?.h1?.fontWeight || 600,
        lineHeight: theme?.typography?.headings?.h1?.lineHeight || 1.2,
      },
      h2: {
        fontSize: theme?.typography?.headings?.h2?.fontSize || "1.75rem",
        fontWeight: theme?.typography?.headings?.h2?.fontWeight || 600,
        lineHeight: theme?.typography?.headings?.h2?.lineHeight || 1.3,
      },
      h3: {
        fontSize: theme?.typography?.headings?.h3?.fontSize || "1.5rem",
        fontWeight: theme?.typography?.headings?.h3?.fontWeight || 600,
        lineHeight: theme?.typography?.headings?.h3?.lineHeight || 1.4,
      },
      h4: {
        fontSize: theme?.typography?.headings?.h4?.fontSize || "1.25rem",
        fontWeight: theme?.typography?.headings?.h4?.fontWeight || 600,
        lineHeight: theme?.typography?.headings?.h4?.lineHeight || 1.4,
      },
      h5: {
        fontSize: theme?.typography?.headings?.h5?.fontSize || "1rem",
        fontWeight: theme?.typography?.headings?.h5?.fontWeight || 600,
        lineHeight: theme?.typography?.headings?.h5?.lineHeight || 1.5,
      },
      h6: {
        fontSize: theme?.typography?.headings?.h6?.fontSize || "0.875rem",
        fontWeight: theme?.typography?.headings?.h6?.fontWeight || 600,
        lineHeight: theme?.typography?.headings?.h6?.lineHeight || 1.5,
      },
      body1: {
        fontSize: theme?.typography?.headings?.body?.fontSize || "1rem",
        fontWeight: theme?.typography?.headings?.body?.fontWeight || 400,
        lineHeight: theme?.typography?.headings?.body?.lineHeight || 1.5,
      },
    },
    shape: {
      borderRadius: parseInt(theme?.borderRadius?.medium || "8px"),
    },
    shadows: [
      "none",
      theme?.shadows?.small || "0 2px 4px rgba(0,0,0,0.1)",
      theme?.shadows?.small || "0 2px 4px rgba(0,0,0,0.1)",
      theme?.shadows?.medium || "0 4px 8px rgba(0,0,0,0.15)",
      theme?.shadows?.medium || "0 4px 8px rgba(0,0,0,0.15)",
      theme?.shadows?.large || "0 6px 12px rgba(0,0,0,0.2)",
      theme?.shadows?.large || "0 6px 12px rgba(0,0,0,0.2)",
      theme?.shadows?.xl || "0 8px 24px rgba(0,0,0,0.25)",
      theme?.shadows?.xl || "0 8px 24px rgba(0,0,0,0.25)",
      theme?.shadows?.xl || "0 8px 24px rgba(0,0,0,0.25)",
      theme?.shadows?.xl || "0 8px 24px rgba(0,0,0,0.25)",
      theme?.shadows?.xl || "0 8px 24px rgba(0,0,0,0.25)",
      theme?.shadows?.xl || "0 8px 24px rgba(0,0,0,0.25)",
      theme?.shadows?.xl || "0 8px 24px rgba(0,0,0,0.25)",
      theme?.shadows?.xl || "0 8px 24px rgba(0,0,0,0.25)",
      theme?.shadows?.xl || "0 8px 24px rgba(0,0,0,0.25)",
      theme?.shadows?.xl || "0 8px 24px rgba(0,0,0,0.25)",
      theme?.shadows?.xl || "0 8px 24px rgba(0,0,0,0.25)",
      theme?.shadows?.xl || "0 8px 24px rgba(0,0,0,0.25)",
      theme?.shadows?.xl || "0 8px 24px rgba(0,0,0,0.25)",
      theme?.shadows?.xl || "0 8px 24px rgba(0,0,0,0.25)",
      theme?.shadows?.xl || "0 8px 24px rgba(0,0,0,0.25)",
      theme?.shadows?.xl || "0 8px 24px rgba(0,0,0,0.25)",
      theme?.shadows?.xl || "0 8px 24px rgba(0,0,0,0.25)",
      theme?.shadows?.xl || "0 8px 24px rgba(0,0,0,0.25)",
    ] as any,
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius:
              theme?.components?.button?.primary?.borderRadius || "8px",
            padding: theme?.components?.button?.primary?.padding || "12px 24px",
            boxShadow: theme?.shadows?.small || "0 2px 4px rgba(0,0,0,0.1)",
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: theme?.components?.card?.borderRadius || "8px",
            boxShadow:
              theme?.components?.card?.shadow ||
              theme?.shadows?.medium ||
              "0 4px 8px rgba(0,0,0,0.15)",
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: "none",
          },
        },
      },
    },
  });

  return (
    <MUIThemeProvider theme={muiTheme}>
      <AntdConfigProvider
        direction={language === LANGUAGE.ARABIC_KW ? "rtl" : "ltr"}
        theme={{
          token: {
            // Basic colors
            colorBgBase: theme?.colors?.background || "#ffffff",
            colorBgContainer: theme?.colors?.surface || "#ffffff",
            colorBgElevated: theme?.colors?.surfaceHover || "#f5f5f5",
            colorTextBase: theme?.colors?.text || "#000000",
            colorTextSecondary: theme?.colors?.textSecondary || "#666666",
            colorTextTertiary: theme?.colors?.textMuted || "#999999",
            colorTextDisabled: theme?.colors?.disabled || "#cccccc",

            // Primary colors
            colorPrimary: theme?.colors?.primary || "#1890ff",
            colorPrimaryBg: theme?.colors?.primaryLight || "#e6f7ff",
            colorPrimaryHover: theme?.colors?.primaryLight || "#40a9ff",
            colorPrimaryActive: theme?.colors?.primaryDark || "#096dd9",

            // Status colors
            colorSuccess: theme?.colors?.success || "#52c41a",
            colorWarning: theme?.colors?.warning || "#faad14",
            colorError: theme?.colors?.danger || "#ff4d4f",
            colorInfo: theme?.colors?.info || "#1890ff",

            // Border and shadows
            colorBorder: theme?.colors?.border || "#d9d9d9",
            colorBorderSecondary: theme?.colors?.border || "#d9d9d9",
            boxShadow: theme?.shadows?.small || "0 2px 4px rgba(0,0,0,0.1)",
            boxShadowSecondary:
              theme?.shadows?.medium || "0 4px 8px rgba(0,0,0,0.15)",

            // Typography
            fontFamily: theme?.typography?.fontFamily || "'Inter', sans-serif",
            fontSize: theme?.typography?.fontSize || 14,
            fontSizeHeading1: parseInt(
              theme?.typography?.headings?.h1?.fontSize || "32px"
            ),
            fontSizeHeading2: parseInt(
              theme?.typography?.headings?.h2?.fontSize || "28px"
            ),
            fontSizeHeading3: parseInt(
              theme?.typography?.headings?.h3?.fontSize || "24px"
            ),
            fontSizeHeading4: parseInt(
              theme?.typography?.headings?.h4?.fontSize || "20px"
            ),
            fontSizeHeading5: parseInt(
              theme?.typography?.headings?.h5?.fontSize || "16px"
            ),
            fontWeightStrong: theme?.typography?.fontWeightBold || 600,
            lineHeight: theme?.typography?.lineHeight?.normal || 1.5,
            lineHeightHeading1: parseFloat(
              theme?.typography?.headings?.h1?.lineHeight || "1.2"
            ),
            lineHeightHeading2: parseFloat(
              theme?.typography?.headings?.h2?.lineHeight || "1.3"
            ),
            lineHeightHeading3: parseFloat(
              theme?.typography?.headings?.h3?.lineHeight || "1.4"
            ),

            // Border radius
            borderRadius: parseInt(theme?.borderRadius?.small || "4px"),
            borderRadiusLG: parseInt(theme?.borderRadius?.medium || "8px"),
            borderRadiusSM: parseInt(theme?.borderRadius?.small || "4px"),

            // Spacing
            padding: parseInt(theme?.spacing?.md || "16px"),
            paddingLG: parseInt(theme?.spacing?.lg || "24px"),
            paddingSM: parseInt(theme?.spacing?.sm || "12px"),
            paddingXS: parseInt(theme?.spacing?.xs || "8px"),
            margin: parseInt(theme?.spacing?.md || "16px"),
            marginLG: parseInt(theme?.spacing?.lg || "24px"),
            marginSM: parseInt(theme?.spacing?.sm || "12px"),
            marginXS: parseInt(theme?.spacing?.xs || "8px"),

            // Animation
            motionDurationFast: theme?.animations?.duration?.fast || "0.1s",
            motionDurationMid: theme?.animations?.duration?.normal || "0.2s",
            motionDurationSlow: theme?.animations?.duration?.slow || "0.3s",
            motionEaseInOut:
              theme?.animations?.easing?.easeInOut || "ease-in-out",
            motionEaseOut: theme?.animations?.easing?.easeOut || "ease-out",

            // Links
            colorLink:
              theme?.colors?.link || theme?.colors?.primary || "#1890ff",
            colorLinkHover:
              theme?.colors?.linkHover ||
              theme?.colors?.primaryLight ||
              "#40a9ff",
            colorLinkActive:
              theme?.colors?.linkHover ||
              theme?.colors?.primaryDark ||
              "#096dd9",

            // Z-index
            zIndexPopupBase: theme?.zIndex?.dropdown || 1000,
          },
          components: {
            Button: {
              primaryShadow:
                theme?.shadows?.small || "0 2px 4px rgba(0,0,0,0.1)",
              defaultShadow:
                theme?.shadows?.small || "0 2px 4px rgba(0,0,0,0.1)",
              borderRadius: parseThemeValue(
                theme?.components?.button?.primary?.borderRadius,
                8
              ),
              paddingBlock: parsePaddingValue(
                theme?.components?.button?.primary?.padding,
                0,
                12
              ),
              paddingInline: parsePaddingValue(
                theme?.components?.button?.primary?.padding,
                1,
                24
              ),
            },
            Input: {
              borderRadius: parseThemeValue(
                theme?.components?.input?.borderRadius,
                8
              ),
              paddingBlock: parsePaddingValue(
                theme?.components?.input?.padding,
                0,
                12
              ),
              paddingInline: parsePaddingValue(
                theme?.components?.input?.padding,
                1,
                16
              ),
            },
            Card: {
              borderRadius: parseThemeValue(
                theme?.components?.card?.borderRadius,
                8
              ),
              paddingLG: parseThemeValue(theme?.components?.card?.padding, 24),
              boxShadow:
                theme?.components?.card?.shadow ||
                theme?.shadows?.medium ||
                "0 4px 8px rgba(0,0,0,0.15)",
            },
            Layout: {
              headerBg:
                theme?.layout?.header?.background ||
                theme?.colors?.surface ||
                "#ffffff",
              headerColor:
                theme?.layout?.header?.textColor ||
                theme?.colors?.text ||
                "#000000",
              headerHeight: parseInt(theme?.layout?.header?.height || "64px"),
              siderBg:
                theme?.layout?.sidebar?.background ||
                theme?.colors?.surface ||
                "#ffffff",
              footerBg:
                theme?.layout?.footer?.background ||
                theme?.colors?.surface ||
                "#ffffff",
            },
            Menu: {
              itemBg: theme?.colors?.surface || "#ffffff",
              itemSelectedBg: theme?.colors?.surfaceActive || "#f0f0f0",
              itemHoverBg: theme?.colors?.surfaceHover || "#f5f5f5",
            },
            Modal: {
              borderRadius: parseThemeValue(theme?.borderRadius?.large, 12),
              boxShadow: theme?.shadows?.xl || "0 8px 24px rgba(0,0,0,0.2)",
            },
            Dropdown: {
              borderRadius: parseThemeValue(theme?.borderRadius?.medium, 8),
              boxShadow: theme?.shadows?.medium || "0 4px 8px rgba(0,0,0,0.15)",
            },
            Tooltip: {
              borderRadius: parseThemeValue(theme?.borderRadius?.small, 4),
              boxShadow: theme?.shadows?.small || "0 2px 4px rgba(0,0,0,0.1)",
            },
          },
        }}
      >
        <AllowedViewsProvider>
          <Suspense fallback={<RouteFallback />}>
            <RouterProvider router={router} />
          </Suspense>
        </AllowedViewsProvider>
      </AntdConfigProvider>
    </MUIThemeProvider>
  );
}

export default App;
