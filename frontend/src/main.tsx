// main.tsx or App.tsx
import ReactDOM from "react-dom/client";
import App from "./App";
import ThemeProvider from "./context/ThemeProvider";
import { StrictMode } from "react";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </StrictMode>,
);
