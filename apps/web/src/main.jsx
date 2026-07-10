import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ClerkProvider } from "@clerk/clerk-react";
import "./index.css";
import App from "./App.jsx";

const CLERK_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
const isClerkEnabled = CLERK_KEY && !CLERK_KEY.includes("REPLACE_WITH");

if (!isClerkEnabled) {
  console.warn(
    "[FixIt] Clerk auth is disabled. " +
    "Set a valid VITE_CLERK_PUBLISHABLE_KEY in .env to enable it. " +
    "Running in local-only fallback mode."
  );
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    {isClerkEnabled ? (
      <ClerkProvider publishableKey={CLERK_KEY}>
        <App />
      </ClerkProvider>
    ) : (
      <App />
    )}
  </StrictMode>
);
