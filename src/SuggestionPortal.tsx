import React, { createContext, useEffect, useRef } from "react";
import ReactDOM from "react-dom";
import { useContext, useState } from "react";

// Theme Manager
type Theme = "dark" | "light" | "system";

type ThemeProviderProps = {
  children: React.ReactNode;
  defaultTheme?: string;
  storageKey?: string;
};

type ThemeProviderState = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
};

const initialState: ThemeProviderState = {
  theme: "system",
  setTheme: () => null,
};

const ThemeProviderContext = createContext<ThemeProviderState>(initialState);

export function ThemeProvider({
  children,
  defaultTheme = "system",
  storageKey = "vite-ui-theme",
  ...props
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(
    () => (localStorage.getItem(storageKey) as Theme) || defaultTheme
  );

  useEffect(() => {
    const root = window.document.documentElement;

    root.classList.remove("light", "dark");

    if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
        .matches
        ? "dark"
        : "light";

      root.classList.add(systemTheme);
      return;
    }

    root.classList.add(theme);
  }, [theme]);

  const value = {
    theme,
    setTheme: (theme: Theme) => {
      localStorage.setItem(storageKey, theme);
      setTheme(theme);
    },
  };

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext);

  if (context === undefined)
    throw new Error("useTheme must be used within a ThemeProvider");

  return context;
};

// Emoji Adder
interface Emoji {
  name: string;
  symbol: string;
}

interface SuggestionPortalProps {
  activeElement: HTMLElement | null;
  suggestions: Emoji[];
  onSelect: (emoji: Emoji) => void;
  onClose: () => void;
}

const SuggestionPortal: React.FC<SuggestionPortalProps> = ({
  activeElement,
  suggestions,
  onSelect,
  onClose,
}) => {
  const portalRef = useRef<HTMLDivElement>(document.createElement("div"));

  useEffect(() => {
    const portalNode = portalRef.current;
    if (suggestions.length > 0) {
      document.body.appendChild(portalNode);
    } else {
      if (document.body.contains(portalNode)) {
        document.body.removeChild(portalNode);
      }
    }
    return () => {
      if (document.body.contains(portalNode)) {
        document.body.removeChild(portalNode);
      }
    };
  }, [suggestions.length]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        portalRef.current &&
        !portalRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  useEffect(() => {
    if (activeElement && portalRef.current) {
      const rect = activeElement.getBoundingClientRect();
      portalRef.current.style.position = "absolute";
      portalRef.current.style.top = `${rect.bottom + window.scrollY}px`;
      portalRef.current.style.left = `${rect.left + window.scrollX}px`;
      portalRef.current.style.zIndex = "1000";
      portalRef.current.style.background = "rgb(9, 9, 11)";
      portalRef.current.style.border = "1px solid rgb(39, 39, 42)";
      portalRef.current.style.borderRadius = "10px";
      portalRef.current.style.maxHeight = "200px";
      portalRef.current.style.maxWidth = "300px";
      portalRef.current.style.overflowY = "auto";
      portalRef.current.style.scrollbarWidth = "none";
      portalRef.current.style.backdropFilter = "blur(5px)";
      // portalRef.current.style.webkitBackdropFilter = "blur(5px)"; // For Safari support
    }
  }, [activeElement]);

  return suggestions.length > 0
    ? ReactDOM.createPortal(
        <div>
          {suggestions.map((emoji, index) => (
            <div
              key={index}
              tabIndex={0}
              style={{
                cursor: "pointer",
                margin: "5px",
                padding: "5px",
                display: "inline-block",
                outline: "none",
                transition: "background-color 0.2s ease-in-out",
              }}
              onClick={() => onSelect(emoji)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  onSelect(emoji);
                }
              }}
              onFocus={(e) =>
                ((e.target as HTMLDivElement).style.backgroundColor =
                  "rgba(0, 0, 0, 0.1)")
              }
              onBlur={(e) =>
                ((e.target as HTMLDivElement).style.backgroundColor = "")
              }
              onMouseEnter={(e) =>
                ((e.target as HTMLDivElement).style.backgroundColor =
                  "rgba(0, 0, 0, 0.1)")
              }
              onMouseLeave={(e) =>
                ((e.target as HTMLDivElement).style.backgroundColor = "")
              }
            >
              {emoji.symbol}
            </div>
          ))}
        </div>,
        portalRef.current
      )
    : null;
};

export default SuggestionPortal;
