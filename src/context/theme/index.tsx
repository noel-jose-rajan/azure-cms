import { createContext, useState, useContext, ReactNode, useMemo } from "react";
import { ThemeType } from "../../types/theme";
import themes, { ThemeName } from "../../configs/theme/register-theme";

import LOCALSTORAGE from "../../constants/local-storage";
import Storage from "../../lib/storage";
import legacy from "@/configs/theme/themes/legacy";

// Create Theme Context
type ThemeContextType = {
  theme: ThemeType;
  toggleTheme: (themeName: ThemeName) => void;
  updateTheme: (themeUpdates: Partial<ThemeType>) => void;
  saveCustomTheme: (customTheme: ThemeType) => void;
  currentThemeName: ThemeName;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [themeName, setThemeName] = useState<ThemeName>(() => {
    // Retrieve the initial theme name from Storage
    const storedTheme = Storage.getItem<ThemeName>(LOCALSTORAGE.THEME);
    return storedTheme || "legacy";
  });

  const [customThemes, setCustomThemes] = useState<Record<string, ThemeType>>(
    () => {
      // Load custom themes from localStorage
      const stored = Storage.getItem<Record<string, ThemeType>>(
        LOCALSTORAGE.CUSTOM_THEMES
      );
      return stored || {};
    }
  );

  const updateCSSVariables = (themeData: ThemeType) => {
    const root = document.documentElement;

    if (!themeData) {
      return;
    }

    Object.entries(themeData.colors).forEach(([key, value]) => {
      root.style.setProperty(
        `--color-${key.replace(/([A-Z])/g, "-$1").toLowerCase()}`,
        String(value)
      );
    });
    // Update typography variables
    root.style.setProperty(
      "--font-family",
      themeData.typography.fontFamily ?? "inherit"
    );
    root.style.setProperty(
      "--font-size",
      String(themeData.typography.fontSize ?? "16px")
    );
    root.style.setProperty(
      "--font-weight-light",
      String(themeData.typography.fontWeightLight ?? "400")
    );
    root.style.setProperty(
      "--font-weight-regular",
      String(themeData.typography.fontWeightRegular ?? "500")
    );
    root.style.setProperty(
      "--font-weight-bold",
      String(themeData.typography.fontWeightBold ?? "700")
    );

    // Update spacing variables
    Object.entries(themeData.spacing).forEach(([key, value]) => {
      root.style.setProperty(`--spacing-${key}`, String(value ?? "0px"));
    });

    // Update border radius variables
    Object.entries(themeData.borderRadius).forEach(([key, value]) => {
      root.style.setProperty(`--border-radius-${key}`, String(value));
    });

    // Update shadow variables
    Object.entries(themeData.shadows).forEach(([key, value]) => {
      root.style.setProperty(`--shadow-${key}`, String(value));
    });
  };

  const theme = useMemo(() => {
    // Check if it's a custom theme first
    if (customThemes[themeName]) {
      return customThemes[themeName];
    }

    return themes[themeName];
  }, [themeName, customThemes]);

  // Initialize CSS variables on theme change
  useMemo(() => {
    updateCSSVariables(theme);
  }, [theme]);

  const toggleTheme = (newThemeName: ThemeName) => {
    setThemeName(newThemeName);
    Storage.setItem(LOCALSTORAGE.THEME, newThemeName);
  };

  const updateTheme = (themeUpdates: Partial<ThemeType>) => {
    const updatedTheme = { ...theme, ...themeUpdates };

    // Save as custom theme
    const newCustomThemes = {
      ...customThemes,
      [themeName]: updatedTheme,
    };

    setCustomThemes(newCustomThemes);
    Storage.setItem(LOCALSTORAGE.CUSTOM_THEMES, newCustomThemes);

    // Update CSS custom properties immediately
    updateCSSVariables(updatedTheme);
  };

  const saveCustomTheme = (customTheme: ThemeType) => {
    const themeName = customTheme.name as ThemeName;

    const newCustomThemes = {
      ...customThemes,
      [themeName]: customTheme,
    };

    setCustomThemes(newCustomThemes);
    setThemeName(themeName);
    Storage.setItem(LOCALSTORAGE.CUSTOM_THEMES, newCustomThemes);
    Storage.setItem(LOCALSTORAGE.THEME, themeName);

    // Update CSS custom properties immediately
    updateCSSVariables(customTheme);
  };

  return (
    <ThemeContext.Provider
      value={{
        theme: theme ?? legacy,
        toggleTheme,
        updateTheme,
        saveCustomTheme,
        currentThemeName: themeName,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
