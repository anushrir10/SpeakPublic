import { LearningProvider, useLearning } from "./context/LearningContext";
import { ThemeProvider } from "./context/ThemeContext";
import Login from "./components/Login";
import Onboarding from "./components/Onboarding";
import Library from "./components/Library";
import Reader from "./components/Reader";

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
        <AppContent />
      </LearningProvider>
    </ThemeProvider>
  );
}
