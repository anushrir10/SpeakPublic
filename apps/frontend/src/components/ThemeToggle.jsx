import { motion } from "framer-motion";
import { useCallback } from "react";
import { useTheme } from "../context/ThemeContext";
import { createAnimation } from "./theme/themeAnimations";

const STYLE_ID = "theme-transition-styles";

function injectStyles(css) {
  if (typeof window === "undefined") return;
  let el = document.getElementById(STYLE_ID);
  if (!el) {
    el = document.createElement("style");
    el.id = STYLE_ID;
    document.head.appendChild(el);
  }
  el.textContent = css;
}

/**
 * Animated light/dark toggle using the View Transitions API.
 * variant: "circle" | "rectangle" | "polygon" | "circle-blur" | "gif"
 * start:   directional origin (e.g. "top-right", "bottom-up", "center")
 */
export default function ThemeToggle({
  variant = "circle",
  start = "top-right",
  blur = false,
  className = "",
}) {
  const { theme, setTheme } = useTheme();
  const isDark = theme === "dark";

  const toggleTheme = useCallback(() => {
    const animation = createAnimation(variant, start, blur);
    injectStyles(animation.css);

    const switchTheme = () => setTheme(theme === "dark" ? "light" : "dark");

    if (typeof document === "undefined" || !document.startViewTransition) {
      switchTheme();
      return;
    }
    document.startViewTransition(switchTheme);
  }, [theme, setTheme, variant, start, blur]);

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label="Toggle light / dark theme"
      title={isDark ? "Switch to light" : "Switch to dark"}
      className={`size-9 shrink-0 cursor-pointer rounded-full border border-[#E6E2D6] bg-white p-2 shadow-sm transition-all duration-300 hover:border-clay/50 active:scale-95 ${className}`}
    >
      <span className="sr-only">Toggle theme</span>
      <svg viewBox="0 0 240 240" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        <motion.g
          animate={{ rotate: isDark ? -180 : 0 }}
          transition={{ ease: "easeInOut", duration: 0.5 }}
          style={{ transformOrigin: "120px 120px" }}
        >
          <path
            d="M120 67.5C149.25 67.5 172.5 90.75 172.5 120C172.5 149.25 149.25 172.5 120 172.5"
            fill="#D97757"
          />
          <path
            d="M120 67.5C90.75 67.5 67.5 90.75 67.5 120C67.5 149.25 90.75 172.5 120 172.5"
            fill="#1F1E1D"
          />
        </motion.g>
        <motion.path
          animate={{ rotate: isDark ? 180 : 0 }}
          transition={{ ease: "easeInOut", duration: 0.5 }}
          style={{ transformOrigin: "120px 120px" }}
          d="M120 3.75C55.5 3.75 3.75 55.5 3.75 120C3.75 184.5 55.5 236.25 120 236.25C184.5 236.25 236.25 184.5 236.25 120C236.25 55.5 184.5 3.75 120 3.75ZM120 214.5V172.5C90.75 172.5 67.5 149.25 67.5 120C67.5 90.75 90.75 67.5 120 67.5V25.5C172.5 25.5 214.5 67.5 214.5 120C214.5 172.5 172.5 214.5 120 214.5Z"
          fill="#D97757"
        />
      </svg>
    </button>
  );
}
