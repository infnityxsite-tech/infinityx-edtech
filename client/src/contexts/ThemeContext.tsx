import React, { createContext, useContext, useEffect, useState } from "react";
import { trpc } from "@/lib/trpc";

type Theme = "light" | "dark";

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: "light",
  toggleTheme: () => {},
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { data: defaults } = trpc.admin.getSiteDefaults.useQuery(undefined, { staleTime: 1000 * 60 * 5 });

  const [theme, setTheme] = useState<Theme>(() => {
    // Light mode is ALWAYS the default.
    // Only use dark if user EXPLICITLY toggled the theme switch.
    if (localStorage.getItem("infx-theme-manual") === "true") {
      return (localStorage.getItem("infx-theme") as Theme) === "dark" ? "dark" : "light";
    }
    return "light";
  });

  // Cache server default for admin reference, but never auto-switch the active theme
  useEffect(() => {
    if (defaults?.defaultTheme) {
      localStorage.setItem("infx-site-default-theme", defaults.defaultTheme);
    }
  }, [defaults]);

  useEffect(() => {
    const root = document.documentElement;
    localStorage.setItem("infx-theme", theme);
    root.setAttribute("data-theme", theme);

    if (theme === "light") {
      root.classList.add("light-mode");
      root.classList.remove("dark-mode");
      root.classList.remove("dark");
    } else {
      root.classList.add("dark-mode");
      root.classList.remove("light-mode");
      root.classList.add("dark");
    }
  }, [theme]);

  const toggleTheme = () => {
    localStorage.setItem("infx-theme-manual", "true");
    setTheme(prev => (prev === "light" ? "dark" : "light"));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return context;
}
