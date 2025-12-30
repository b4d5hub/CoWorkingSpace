import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

export type AppTheme = "light" | "darkBlue";

type ThemeContextValue = {
  theme: AppTheme;
  setTheme: (t: AppTheme) => void;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

const STORAGE_KEY = "app_theme";
const ROOT = typeof document !== "undefined" ? document.documentElement : undefined as any;
const THEME_CLASS_MAP: Record<AppTheme, string> = {
  light: "",
  darkBlue: "dark-blue",
};

function applyThemeClass(theme: AppTheme) {
  if (!ROOT) return;
  // Remove known classes first
  ROOT.classList.remove("dark", "dark-blue");
  const cls = THEME_CLASS_MAP[theme];
  if (cls) ROOT.classList.add(cls);
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<AppTheme>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY) as AppTheme | null;
      const t = stored === "darkBlue" ? "darkBlue" : "light";
      // Apply immediately to avoid FOUC
      applyThemeClass(t);
      return t;
    } catch {
      applyThemeClass("light");
      return "light";
    }
  });

  useEffect(() => {
    applyThemeClass(theme);
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch {}
  }, [theme]);

  const setTheme = (t: AppTheme) => setThemeState(t);
  const toggleTheme = () => setThemeState(prev => (prev === "light" ? "darkBlue" : "light"));

  const value = useMemo(() => ({ theme, setTheme, toggleTheme }), [theme]);
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}
