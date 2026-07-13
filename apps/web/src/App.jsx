import React, { Suspense, lazy } from "react";
import { LearningProvider, useLearning } from "./context/LearningContext";
import { ThemeProvider } from "./context/ThemeContext";
import Login from "./components/Login";

const Onboarding = lazy(() => import("./components/Onboarding"));
const Library = lazy(() => import("./components/Library"));
const Reader = lazy(() => import("./components/Reader"));

function AppContent() {
  const { user, onboarding, activeBook } = useLearning();

  if (!user) {
    return <Login />;
  }

  if (!onboarding) {
    return <Onboarding />;
  }

  if (!activeBook) {
    return <Library />;
  }

  return <Reader />;
}

export default function App() {
  return (
    <ThemeProvider>
      <LearningProvider>
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-stone-500">Loading...</div>}>
          <AppContent />
        </Suspense>
      </LearningProvider>
    </ThemeProvider>
  );
}
