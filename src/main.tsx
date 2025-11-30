import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "./pages/default/style.css";

import App from "./App.tsx";
import { LanguageProvider } from "./context/language/index.tsx";
import { ThemeProvider } from "./context/theme/index.tsx";
import { AuthProvider } from "./context/auth/index.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <LanguageProvider>
      <ThemeProvider>
        <AuthProvider>
          <App />
        </AuthProvider>
      </ThemeProvider>
    </LanguageProvider>
  </StrictMode>
);

window.addEventListener("DOMContentLoaded", () => {
  const preloader = document.getElementById("container-svg");
  if (preloader) preloader.remove();
});
