import { useState, useRef, useEffect } from "react";
import { BookOpen, CaretDown, CircleNotch, Check } from "@phosphor-icons/react";

/**
 * Chapter-wise navigation dropdown.
 * The chapter list from useChapters() is often a flat list of sections
 * (e.g. "The Living World — Introduction", "… — Ernst Mayr", …). This groups
 * those into their parent chapter so the student navigates chapter → section.
 * Live single chapters (no "— section" suffix) render as one row each.
 */
function parseTitle(t) {
  const s = (t || "").trim();
  const parts = s.split(/\s[—–-]\s/); // "Chapter — Section"
  if (parts.length >= 2) return { chapter: parts[0].trim(), section: parts.slice(1).join(" — ").trim() };
  return { chapter: s, section: null };
}

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
  const activeParsed = active ? parseTitle(active.title) : null;

  // Group the flat section list into chapters (order preserved).
  const groups = [];
  const byName = new Map();
  chapters.forEach((c) => {
    const { chapter, section } = parseTitle(c.title);
    if (!byName.has(chapter)) {
      const g = { name: chapter, items: [] };
      byName.set(chapter, g);
      groups.push(g);
    }
    byName.get(chapter).items.push({ ...c, __section: section });
  });

  const choose = (c) => { onSelect?.(c); setOpen(false); };

  return (
    <div className="relative" ref={ref}>
      <button
        id="chapter-nav"
        type="button"
        onClick={() => setOpen((v) => !v)}
        disabled={loading && chapters.length === 0}
        aria-haspopup="listbox"
        aria-expanded={open}
        className="flex items-center gap-2 max-w-[280px] px-3 py-1.5 text-xs font-medium tracking-wide text-stone-700 bg-white border border-[#E6E2D6] rounded-xl shadow-sm hover:border-clay/50 hover:text-clay-dark transition cursor-pointer disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-clay/40"
      >
        {loading && chapters.length === 0 ? (
          <CircleNotch className="w-3.5 h-3.5 animate-spin text-clay" />
        ) : (
          <BookOpen className="w-3.5 h-3.5 text-clay shrink-0" weight="duotone" />
        )}
        <span className="truncate">
          {activeParsed ? (
            <>
              <span className="font-semibold text-stone-700">{activeParsed.chapter}</span>
              {activeParsed.section && (
                <>
                  <span className="mx-1 text-stone-300">›</span>
                  <span className="text-stone-500">{activeParsed.section}</span>
                </>
              )}
            </>
          ) : (
            "Chapters"
          )}
        </span>
        <CaretDown className={`w-3 h-3 shrink-0 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="absolute left-0 top-full mt-2 w-80 max-w-[86vw] max-h-[62vh] overflow-y-auto bg-white border border-[#E6E2D6] rounded-2xl shadow-[0_18px_40px_-18px_rgba(31,30,29,0.35)] z-50 p-2 animate-scale-in origin-top">
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
            <ul className="space-y-1.5">
              {groups.map((group, gi) => {
                const single = group.items.length === 1 && !group.items[0].__section;
                const chapterActive = activeParsed?.chapter === group.name;

                // Single-section chapter → one clickable row.
                if (single) {
                  const c = group.items[0];
                  const isActive = active && c.id === active.id;
                  return (
                    <li key={group.name}>
                      <button
                        type="button"
                        onClick={() => choose(c)}
                        className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-left transition cursor-pointer ${
                          isActive ? "bg-clay-tint" : "hover:bg-stone-100"
                        }`}
                      >
                        <span className={`w-6 h-6 shrink-0 rounded-lg flex items-center justify-center text-[11px] font-semibold ${isActive ? "bg-clay text-white" : "bg-[#F2EFE7] text-stone-500"}`}>
                          {gi + 1}
                        </span>
                        <span className={`flex-1 text-sm leading-snug truncate ${isActive ? "text-clay-dark font-medium" : "text-stone-700"}`}>
                          {group.name}
                        </span>
                        {isActive && <Check className="w-4 h-4 text-clay shrink-0" weight="bold" />}
                      </button>
                    </li>
                  );
                }

                // Chapter with multiple sections → header + nested sections.
                return (
                  <li key={group.name}>
                    <div className="flex items-center gap-2.5 px-2.5 py-1.5">
                      <span className={`w-6 h-6 shrink-0 rounded-lg flex items-center justify-center text-[11px] font-semibold ${chapterActive ? "bg-clay text-white" : "bg-[#F2EFE7] text-stone-500"}`}>
                        {gi + 1}
                      </span>
                      <span className={`flex-1 text-[13px] font-heading font-semibold leading-snug truncate ${chapterActive ? "text-clay-dark" : "text-stone-700"}`}>
                        {group.name}
                      </span>
                      <span className="text-[10px] text-stone-400 shrink-0">{group.items.length} parts</span>
                    </div>
                    <ul className="mt-0.5 ml-[1.15rem] pl-3 border-l border-[#EDE8DB] space-y-0.5">
                      {group.items.map((c) => {
                        const isActive = active && c.id === active.id;
                        return (
                          <li key={c.id}>
                            <button
                              type="button"
                              onClick={() => choose(c)}
                              className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-left transition cursor-pointer ${
                                isActive ? "bg-clay-tint" : "hover:bg-stone-100"
                              }`}
                            >
                              <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${isActive ? "bg-clay" : "bg-stone-300"}`} />
                              <span className={`flex-1 text-[13px] leading-snug truncate ${isActive ? "text-clay-dark font-medium" : "text-stone-600"}`}>
                                {c.__section || c.title}
                              </span>
                              {isActive && <Check className="w-3.5 h-3.5 text-clay shrink-0" weight="bold" />}
                            </button>
                          </li>
                        );
                      })}
                    </ul>
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
