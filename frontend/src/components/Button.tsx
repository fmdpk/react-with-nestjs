// Button.tsx
import { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";

export function ThemedButton() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error("ThemedButton must be used within ThemeProvider");
  }

  const { theme, toggleTheme } = context;

  return (
    <button
      onClick={toggleTheme}
      style={{
        background: theme === "light" ? "#fff" : "#333",
        color: theme === "light" ? "#000" : "#fff",
      }}
    >
      Toggle Theme
    </button>
  );
}
