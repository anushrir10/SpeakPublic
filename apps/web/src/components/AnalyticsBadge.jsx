import { useState, useEffect } from "react";
import { Lightning } from "@phosphor-icons/react";

/**
 * AnalyticsBadge
 *
 * Ambient "today's reviews" chip that increments on each FSRS review logged.
 * Uses localStorage to persist the count, resetting it daily.
 * Non-blocking — works entirely client-side regardless of API status.
 *
 * Props:
 *   reviewCount  – number  (current session review count driven from parent)
 *   animate      – boolean (pulse briefly when a new review fires)
 */
export default function AnalyticsBadge({ reviewCount = 0, animate = false }) {
  const [todayCount, setTodayCount] = useState(0);

  // Load + merge on mount
  useEffect(() => {
    const today = new Date().toISOString().slice(0, 10);
    const stored = localStorage.getItem("fixit_reviews_today");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (parsed.date === today) {
          setTodayCount(parsed.count || 0);
        } else {
          // New day — reset
          localStorage.setItem("fixit_reviews_today", JSON.stringify({ date: today, count: 0 }));
          setTodayCount(0);
        }
      } catch {
        setTodayCount(0);
      }
    }
  }, []);

  // Increment when reviewCount prop increases
  useEffect(() => {
    if (reviewCount <= 0) return;
    const today = new Date().toISOString().slice(0, 10);
    const newCount = todayCount + 1;
    setTodayCount(newCount);
    localStorage.setItem("fixit_reviews_today", JSON.stringify({ date: today, count: newCount }));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reviewCount]);

  if (todayCount === 0) return null;

  return (
    <div
      id="analytics-badge"
      title={`You've reviewed ${todayCount} card${todayCount !== 1 ? "s" : ""} today`}
      className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-clay/30 bg-clay-tint transition-all duration-300 ${
        animate ? "scale-105" : "scale-100"
      }`}
    >
      <Lightning className="w-3 h-3 text-clay" weight="fill" />
      <span className="text-[10px] font-semibold text-clay-dark font-body leading-none">
        {todayCount} today
      </span>
    </div>
  );
}
