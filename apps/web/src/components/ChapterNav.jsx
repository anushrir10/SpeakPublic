import { useState, useRef, useEffect } from "react";
import { BookOpen, CaretDown, CircleNotch, Check } from "@phosphor-icons/react";

/**
 * Chapter navigation dropdown (Week 2).
 * Renders chapters from useChapters() — live from /api/chapters, or the local
 * fallback until the endpoint is seeded. Selecting a chapter calls onSelect().
 */
export default function ChapterNav({
  chapters = [],
  activeChapterId,
  onSelect,
  loading = false,
  isFallback = false,
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [open]);

  const active = chapters.find((c) => c.id === activeChapterId) || chapters[0];

  return (
    <div className="relative" ref={ref}>
      <button
        id="chapter-nav"
        type="button"
        onClick={() => setOpen((v) => !v)}
        disabled={loading && chapters.length === 0}
        className="flex items-center gap-2 max-w-[240px] px-3 py-1.5 text-xs font-medium tracking-wide text-stone-700 bg-white border border-[#E6E2D6] rounded-xl shadow-sm hover:border-clay/50 hover:text-clay-dark transition cursor-pointer disabled:opacity-60"
      >
        {loading && chapters.length === 0 ? (
          <CircleNotch className="w-3.5 h-3.5 animate-spin text-clay" />
        ) : (
          <BookOpen className="w-3.5 h-3.5 text-clay" weight="duotone" />
        )}
        <span className="truncate">
          {active ? (
            <>
              <span className="text-stone-400">Ch {active.number}</span>
              <span className="mx-1.5 text-stone-300">·</span>
              {active.title}
            </>
          ) : (
            "Chapters"
          )}
        </span>
        <CaretDown className={`w-3 h-3 shrink-0 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="absolute left-0 top-full mt-2 w-72 max-h-[60vh] overflow-y-auto bg-white border border-[#E6E2D6] rounded-2xl shadow-[0_18px_40px_-18px_rgba(31,30,29,0.35)] z-50 p-2 animate-scale-in origin-top">
          <div className="flex items-center justify-between px-2 py-1.5">
            <span className="text-[11px] uppercase font-semibold tracking-wider text-stone-400">
              Chapters
            </span>
            <span
              className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${
                isFallback
                  ? "bg-amber-50 text-amber-600 border border-amber-200"
                  : "bg-clay-tint text-clay-dark"
              }`}
              title={isFallback ? "Showing local sections — /api/chapters not connected yet" : "Live from /api/chapters"}
            >
              {isFallback ? "local" : "live"}
            </span>
          </div>

          {chapters.length === 0 ? (
            <p className="text-xs text-stone-400 italic text-center py-6">
              {loading ? "Loading chapters…" : "No chapters available."}
            </p>
          ) : (
            <ul className="space-y-0.5">
              {chapters.map((c) => {
                const isActive = active && c.id === active.id;
                return (
                  <li key={c.id}>
                    <button
                      type="button"
                      onClick={() => {
                        onSelect?.(c);
                        setOpen(false);
                      }}
                      className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-left transition cursor-pointer ${
                        isActive ? "bg-clay-tint" : "hover:bg-stone-100"
                      }`}
                    >
                      <span
                        className={`w-6 h-6 shrink-0 rounded-lg flex items-center justify-center text-[11px] font-semibold ${
                          isActive ? "bg-clay text-white" : "bg-[#F2EFE7] text-stone-500"
                        }`}
                      >
                        {c.number}
                      </span>
                      <span className={`flex-1 text-sm leading-snug truncate ${isActive ? "text-clay-dark font-medium" : "text-stone-700"}`}>
                        {c.title}
                      </span>
                      {isActive && <Check className="w-4 h-4 text-clay shrink-0" weight="bold" />}
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
