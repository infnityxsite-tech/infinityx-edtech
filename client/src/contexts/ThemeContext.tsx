import React, { createContext, useContext, useEffect, useState } from "react";
import { trpc } from "@/lib/trpc";

type Theme = "light" | "dark";

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: "dark",
  toggleTheme: () => {},
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { data: defaults } = trpc.admin.getSiteDefaults.useQuery(undefined, { staleTime: 1000 * 60 * 5 });

  // Read the cached server default (populated by this provider on first API response)
  const cachedServerDefault = (localStorage.getItem("infx-site-default-theme") as Theme) || "dark";

  const [theme, setTheme] = useState<Theme>(() => {
    // Only trust localStorage if the user manually chose a theme
    if (localStorage.getItem("infx-theme-manual") === "true") {
      return (localStorage.getItem("infx-theme") as Theme) || cachedServerDefault;
    }
    // Use cached server default — matches what the FOUC script already applied
    return cachedServerDefault;
  });

  // Cache server default and apply if user hasn't manually chosen a preference
  useEffect(() => {
    if (defaults?.defaultTheme) {
      // Always cache for the FOUC script on next page load
      localStorage.setItem("infx-site-default-theme", defaults.defaultTheme);
      // Only change the active theme if user hasn't manually chosen
      if (localStorage.getItem("infx-theme-manual") !== "true") {
        setTheme(defaults.defaultTheme as Theme);
      }
    }
  }, [defaults]);

  useEffect(() => {
    const root = document.documentElement;
    localStorage.setItem("infx-theme", theme);
    root.setAttribute("data-theme", theme);

    if (theme === "light") {
      root.classList.add("light-mode");
      root.classList.remove("dark-mode");
    } else {
      root.classList.add("dark-mode");
      root.classList.remove("light-mode");
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
