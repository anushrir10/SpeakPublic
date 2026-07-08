import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { textbooks } from "../data/textbooks";
import { setAuthTokenGetter } from "../services/api";

// Determine if Clerk is enabled at module load time
const clerkKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
const isClerkEnabled = Boolean(clerkKey) && !clerkKey.includes("REPLACE_WITH");

// Only import Clerk hooks if actually enabled
let useUserHook = null;
let useAuthHook = null;
let useClerkHook = null;

if (isClerkEnabled) {
  try {
    const clerk = await import("@clerk/clerk-react");
    useUserHook = clerk.useUser;
    useAuthHook = clerk.useAuth;
    useClerkHook = clerk.useClerk;
  } catch {
    // Clerk module not available
  }
}

const LearningContext = createContext(null);

// ─── Clerk-Aware Provider ──────────────────────────────
const ClerkAwareProvider = ({ children }) => {
  const clerkUser = useUserHook();
  const clerkAuth = useAuthHook();
  const clerkInstance = useClerkHook();

  // Derive user from Clerk
  const user = clerkUser.isSignedIn
    ? {
        username: clerkUser.user?.firstName || clerkUser.user?.emailAddresses?.[0]?.emailAddress || "Student",
        loggedIn: true,
        clerkId: clerkUser.user?.id,
      }
    : null;

  // Wire Clerk token into API service
  useEffect(() => {
    if (clerkAuth.getToken) {
      setAuthTokenGetter(() => clerkAuth.getToken());
    }
  }, [clerkAuth.getToken]);

  const logout = useCallback(async () => {
    if (clerkInstance) {
      await clerkInstance.signOut();
    }
  }, [clerkInstance]);

  return (
    <SharedProvider user={user} logout={logout} isClerkMode={true}>
      {children}
    </SharedProvider>
  );
};

// ─── Local Fallback Provider ───────────────────────────
const LocalProvider = ({ children }) => {
  const [localUser, setLocalUser] = useState(() => {
    const saved = localStorage.getItem("ncert_user");
    return saved ? JSON.parse(saved) : null;
  });

  // Sync to localStorage
  useEffect(() => {
    if (localUser) {
      localStorage.setItem("ncert_user", JSON.stringify(localUser));
    } else {
      localStorage.removeItem("ncert_user");
    }
  }, [localUser]);

  const login = useCallback((username) => {
    const userData = { username, loggedIn: true };
    setLocalUser(userData);
    return true;
  }, []);

  const logout = useCallback(() => {
    setLocalUser(null);
    localStorage.removeItem("ncert_user");
  }, []);

  return (
    <SharedProvider user={localUser} login={login} logout={logout} isClerkMode={false}>
      {children}
    </SharedProvider>
  );
};

// ─── Shared Provider (common state) ────────────────────
const SharedProvider = ({ children, user, login, logout: logoutFn, isClerkMode }) => {
  // Onboarding configurations
  const [onboarding, setOnboarding] = useState(() => {
    const saved = localStorage.getItem("ncert_onboarding");
    return saved ? JSON.parse(saved) : null;
  });

  // Reading interface state
  const [activeBook, setActiveBook] = useState(null);
  const [activePageNum, setActivePageNum] = useState(1);
  const [activeConceptKey, setActiveConceptKey] = useState(null);
  const [activeCustomConcept, setActiveCustomConcept] = useState(null);
  const [sidePanelOpen, setSidePanelOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("definition");

  // MCQ completion tracker
  const [completedMCQs, setCompletedMCQs] = useState(() => {
    const saved = localStorage.getItem("ncert_mcq_progress");
    return saved ? JSON.parse(saved) : {};
  });

  useEffect(() => {
    if (onboarding) {
      localStorage.setItem("ncert_onboarding", JSON.stringify(onboarding));
    } else {
      localStorage.removeItem("ncert_onboarding");
    }
  }, [onboarding]);

  useEffect(() => {
    localStorage.setItem("ncert_mcq_progress", JSON.stringify(completedMCQs));
  }, [completedMCQs]);

  const onboard = (grade, board, subjects) => {
    setOnboarding({ grade, board, subjects });
  };

  const selectBook = (bookId) => {
    const book = textbooks.find((b) => b.id === bookId);
    if (book) {
      setActiveBook(book);
      setActivePageNum(1);
      setActiveConceptKey(null);
      setActiveCustomConcept(null);
      setSidePanelOpen(false);
    }
  };

  const selectConcept = (conceptKeyOrObject) => {
    if (typeof conceptKeyOrObject === "string") {
      setActiveConceptKey(conceptKeyOrObject);
      setActiveCustomConcept(null);
    } else {
      setActiveConceptKey("custom");
      setActiveCustomConcept(conceptKeyOrObject);
    }
    setSidePanelOpen(true);
    setActiveTab("definition");
  };

  const markMCQComplete = (bookId, conceptKey) => {
    setCompletedMCQs((prev) => ({
      ...prev,
      [`${bookId}-${conceptKey}`]: true,
    }));
  };

  const logout = useCallback(async () => {
    setOnboarding(null);
    setActiveBook(null);
    setActiveConceptKey(null);
    setActiveCustomConcept(null);
    setSidePanelOpen(false);
    setCompletedMCQs({});
    localStorage.removeItem("ncert_onboarding");
    localStorage.removeItem("ncert_mcq_progress");
    if (logoutFn) await logoutFn();
  }, [logoutFn]);

  return (
    <LearningContext.Provider
      value={{
        user,
        onboarding,
        activeBook,
        activePageNum,
        activeConceptKey,
        activeCustomConcept,
        sidePanelOpen,
        activeTab,
        completedMCQs,
        isClerkMode,
        login: login || (() => false),
        onboard,
        selectBook,
        setActiveBook,
        setActivePageNum,
        setActiveConceptKey,
        selectConcept,
        setSidePanelOpen,
        setActiveTab,
        markMCQComplete,
        logout,
      }}
    >
      {children}
    </LearningContext.Provider>
  );
};

// ─── Exported Provider ─────────────────────────────────
export const LearningProvider = ({ children }) => {
  if (isClerkEnabled && useUserHook) {
    return <ClerkAwareProvider>{children}</ClerkAwareProvider>;
  }
  return <LocalProvider>{children}</LocalProvider>;
};

// eslint-disable-next-line react-refresh/only-export-components
export const useLearning = () => {
  const context = useContext(LearningContext);
  if (!context) {
    throw new Error("useLearning must be used within a LearningProvider");
  }
  return context;
};
