import { useState, useEffect, useRef } from "react";
import { X, Sparkle, PaperPlaneRight, ChatCircleDots, Quotes, Cards } from "@phosphor-icons/react";
import { SmoothInput } from "./SmoothInput";

/**
 * Contextual side-panel SHELL (Week 2).
 *
 * Opens on a text selection ("Ask" action) and holds the conversation UI that
 * Week 3's AI Q&A will stream into. There is **no live AI here yet** — sending a
 * question renders a clearly-labelled placeholder answer so the streaming
 * container is visible and ready to be wired.
 *
 * Week 3 can drive it directly by passing `messages` (array of
 * { role: "user" | "assistant", text, pending? }); when omitted, the panel
 * manages a local demo thread of questions + placeholder answers.
 *
 * Props:
 *   open           - boolean, panel visibility
 *   selection      - the selected passage text (context for the question)
 *   chapterTitle   - label for where the selection came from
 *   onClose        - close handler
 *   onMakeFlashcard- optional; secondary action reusing the flashcard flow
 *   messages       - optional controlled thread (Week 3)
 *   onAsk          - optional; called with the question string (Week 3 hook)
 */
export default function ContextualPanel({
  open,
  selection = "",
  chapterTitle,
  onClose,
  onMakeFlashcard,
  messages,
  onAsk,
}) {
  const [draft, setDraft] = useState("");
  const [localThread, setLocalThread] = useState([]);
  const scrollRef = useRef(null);

  const controlled = Array.isArray(messages);
  const thread = controlled ? messages : localThread;

  // Note: the parent remounts this panel via `key={selection}`, so a new
  // selection starts a fresh thread/draft without a reset effect.

  // Autoscroll to the newest message
  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [thread]);

  // Focus the input once the panel has slid in
  useEffect(() => {
    if (!open) return;
    const t = setTimeout(() => document.getElementById("ask-input")?.focus(), 380);
    return () => clearTimeout(t);
  }, [open]);

  const suggestions = [
    "Explain this in simple terms",
    "Why does this matter?",
    "Give me an example",
  ];

  const submit = (question) => {
    const q = (question ?? draft).trim();
    if (!q) return;
    setDraft("");

    // Week 3 owns the real flow when a handler is provided
    if (onAsk) {
      onAsk(q);
      return;
    }
    // Shell behaviour: record the question and a placeholder answer slot
    setLocalThread((prev) => [
      ...prev,
      { role: "user", text: q },
      { role: "assistant", pending: true },
    ]);
  };

  return (
    <>
      {/* Scrim */}
      <div
        onClick={onClose}
        className={`fixed inset-0 bg-black/30 backdrop-blur-[2px] z-40 transition-opacity duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          open ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      />

      {/* Panel — smooth slide-in */}
      <aside
        id="ask-panel"
        role="dialog"
        aria-label="Ask FixIt"
        style={{ willChange: "transform" }}
        className={`fixed inset-y-0 right-0 w-[420px] max-w-[90vw] bg-white border-l border-[#E6E2D6] shadow-2xl z-50 flex flex-col transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="px-5 py-4 border-b border-[#E6E2D6] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-clay-tint flex items-center justify-center shrink-0">
              <ChatCircleDots className="w-5 h-5 text-clay" weight="duotone" />
            </div>
            <div>
              <h3 className="font-heading text-stone-800 text-base tracking-tight font-semibold leading-none flex items-center gap-2">
                Ask FixIt
                <span className="text-[9px] font-body font-semibold uppercase tracking-wider text-clay bg-clay-tint px-1.5 py-0.5 rounded-full">
                  AI · Week 3
                </span>
              </h3>
              <p className="text-[11px] text-stone-400 font-body mt-1">Answers about your selection</p>
            </div>
          </div>
          <button
            id="ask-close"
            onClick={onClose}
            className="w-8 h-8 rounded-full border border-[#E6E2D6] flex items-center justify-center hover:bg-stone-100 hover:text-stone-800 transition cursor-pointer text-stone-500 shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Selection context */}
        {selection && (
          <div className="px-5 pt-4 shrink-0">
            <div className="rounded-xl bg-[#FBFAF7] border border-[#E6E2D6] p-3.5">
              <div className="flex items-center gap-1.5 mb-1.5 text-[10px] uppercase font-semibold tracking-wider text-stone-400">
                <Quotes className="w-3.5 h-3.5 text-clay" weight="fill" />
                {chapterTitle ? `From ${chapterTitle}` : "Selected passage"}
              </div>
              <p className="text-sm text-stone-700 leading-relaxed italic max-h-28 overflow-y-auto">
                "{selection}"
              </p>
            </div>
          </div>
        )}

        {/* Conversation shell */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
          {thread.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center px-4">
              <div className="w-12 h-12 rounded-2xl bg-clay-tint flex items-center justify-center mb-3">
                <Sparkle className="w-6 h-6 text-clay" weight="duotone" />
              </div>
              <p className="text-sm text-stone-600 font-medium">Ask a question about this passage</p>
              <p className="text-xs text-stone-400 mt-1 leading-relaxed max-w-[240px]">
                Type below or pick a starter. Live AI answers arrive in Week 3 — this panel is the container they'll stream into.
              </p>
              <div className="flex flex-wrap justify-center gap-2 mt-4">
                {suggestions.map((s) => (
                  <button
                    key={s}
                    onClick={() => submit(s)}
                    className="text-xs px-3 py-1.5 rounded-full border border-[#E6E2D6] text-stone-600 hover:border-clay/50 hover:text-clay-dark transition cursor-pointer"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            thread.map((m, i) =>
              m.role === "user" ? (
                <div key={i} className="flex justify-end">
                  <div className="max-w-[85%] rounded-2xl rounded-br-md bg-clay text-white px-3.5 py-2.5 text-sm leading-relaxed shadow-sm">
                    {m.text}
                  </div>
                </div>
              ) : (
                <div key={i} className="flex justify-start">
                  <div className="max-w-[90%] rounded-2xl rounded-bl-md bg-[#FBFAF7] border border-[#E6E2D6] px-3.5 py-3 text-sm leading-relaxed w-full">
                    {m.pending ? (
                      <div className="space-y-2">
                        <div className="flex items-center gap-1.5 text-[10px] uppercase font-semibold tracking-wider text-stone-400">
                          <Sparkle className="w-3 h-3 text-clay animate-pulse" weight="fill" />
                          Answer will stream here
                        </div>
                        <div className="space-y-2 pt-1">
                          <div className="h-2.5 rounded-full bg-stone-200 animate-pulse w-[92%]" />
                          <div className="h-2.5 rounded-full bg-stone-200 animate-pulse w-[78%]" />
                          <div className="h-2.5 rounded-full bg-stone-200 animate-pulse w-[85%]" />
                        </div>
                        <p className="text-[11px] text-stone-400 pt-1 not-italic">
                          Placeholder — Week 3 wires live AI Q&amp;A into this bubble.
                        </p>
                      </div>
                    ) : (
                      <span className="text-stone-700">{m.text}</span>
                    )}
                  </div>
                </div>
              )
            )
          )}
        </div>

        {/* Composer */}
        <div className="border-t border-[#E6E2D6] px-4 py-3 shrink-0 space-y-2.5">
          <div className="flex items-center gap-2">
            {/* Smooth animated-caret input — same feel as the login screen */}
            <div className="flex-1 min-w-0">
              <SmoothInput
                id="ask-input"
                type="text"
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    submit();
                  }
                }}
                placeholder="Ask about this passage…"
                className="text-sm"
              />
            </div>
            <button
              id="ask-send"
              onClick={() => submit()}
              disabled={!draft.trim()}
              aria-label="Send question"
              className="w-10 h-10 shrink-0 rounded-xl bg-clay text-white flex items-center justify-center shadow-sm hover:bg-clay-dark transition disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              <PaperPlaneRight className="w-4 h-4" weight="fill" />
            </button>
          </div>

          {onMakeFlashcard && (
            <button
              onClick={onMakeFlashcard}
              className="w-full flex items-center justify-center gap-1.5 text-xs font-medium text-stone-500 hover:text-clay-dark transition cursor-pointer py-1"
            >
              <Cards className="w-3.5 h-3.5" />
              Or turn this selection into a flashcard
            </button>
          )}
        </div>
      </aside>
    </>
  );
}
