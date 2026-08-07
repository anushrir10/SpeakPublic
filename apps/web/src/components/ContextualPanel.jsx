import { useState, useEffect, useRef } from "react";
import { X, Sparkle, PaperPlaneRight, ChatCircleDots, Quotes, Cards, WarningCircle, BookOpen } from "@phosphor-icons/react";
import { SmoothInput } from "./SmoothInput";
import { askQuestion } from "../services/api";

/**
 * Ask FixIt — live AI Q&A side panel (Week 3).
 *
 * Student highlights a passage, asks a question, and gets an answer grounded on
 * retrieved chunks with the sources cited. Calls POST /api/ask directly:
 *   request  { query, selection, topK }
 *   response { answer, citations:[{ chunkId, sectionRef, content, similarity }], grounded }
 *
 * Handles loading, error, and an explicit "no relevant passage found" state.
 * Clicking a cited § scrolls the reader to that section ([data-section]).
 *
 * Props:
 *   open            - boolean, panel visibility
 *   selection       - the selected passage (context sent with the question)
 *   chapterTitle    - label for where the selection came from
 *   onClose         - close handler
 *   onMakeFlashcard - optional; secondary action reusing the flashcard flow
 */
export default function ContextualPanel({
  open,
  selection = "",
  chapterTitle,
  onClose,
  onMakeFlashcard,
}) {
  const [draft, setDraft] = useState("");
  const [thread, setThread] = useState([]);
  const [busy, setBusy] = useState(false);
  const scrollRef = useRef(null);
  const reqIdRef = useRef(0);

  // The parent remounts this panel via key={selection}, so a new selection
  // starts a fresh thread without a reset effect.

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [thread]);

  useEffect(() => {
    if (!open) return;
    const t = setTimeout(() => document.getElementById("ask-input")?.focus(), 380);
    return () => clearTimeout(t);
  }, [open]);

  // Close on Escape (keyboard accessibility)
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => { if (e.key === "Escape") onClose?.(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const suggestions = [
    "Explain this in simple terms",
    "Why does this matter?",
    "Give me an example",
  ];

  const normalize = (res) => {
    if (res === null || res === undefined) return { role: "assistant", error: true };
    const answer = (res.answer ?? res.message ?? "").trim();
    const citations = Array.isArray(res.citations)
      ? res.citations
      : Array.isArray(res.chunks)
      ? res.chunks
      : [];
    const noMatch =
      res.noMatch === true ||
      (!answer && citations.length === 0) ||
      (res.grounded === false && citations.length === 0);
    return { role: "assistant", text: answer, citations, noMatch };
  };

  const submit = async (question) => {
    const q = (question ?? draft).trim();
    if (!q || busy) return;
    setDraft("");
    setThread((prev) => [...prev, { role: "user", text: q }, { role: "assistant", pending: true }]);
    setBusy(true);
    const reqId = ++reqIdRef.current;
    const res = await askQuestion(q, selection, 5);
    if (reqId !== reqIdRef.current) return; // superseded
    setBusy(false);
    const answerMsg = normalize(res);
    setThread((prev) => {
      const next = [...prev];
      for (let i = next.length - 1; i >= 0; i--) {
        if (next[i].role === "assistant" && next[i].pending) {
          next[i] = answerMsg;
          return next;
        }
      }
      next.push(answerMsg);
      return next;
    });
  };

  const gotoSection = (sectionRef) => {
    if (!sectionRef) return;
    const el = document.querySelector(`[data-section="${CSS.escape(String(sectionRef))}"]`);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
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

      {/* Panel */}
      <aside
        id="ask-panel"
        role="dialog"
        aria-modal="true"
        aria-label="Ask FixIt"
        style={{ willChange: "transform" }}
        className={`fixed inset-y-0 right-0 w-[420px] max-w-[90vw] glass-panel rounded-none shadow-2xl z-50 flex flex-col transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
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
                  AI
                </span>
              </h3>
              <p className="text-[11px] text-stone-400 font-body mt-1">Grounded answers from your textbook</p>
            </div>
          </div>
          <button
            id="ask-close"
            onClick={onClose}
            aria-label="Close Ask FixIt"
            className="w-9 h-9 rounded-full border border-[#E6E2D6] flex items-center justify-center hover:bg-stone-100 hover:text-stone-800 transition cursor-pointer text-stone-500 shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-clay/40"
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

        {/* Conversation */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
          {thread.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center px-4">
              <div className="w-12 h-12 rounded-2xl bg-clay-tint flex items-center justify-center mb-3">
                <Sparkle className="w-6 h-6 text-clay" weight="duotone" />
              </div>
              <p className="text-sm text-stone-600 font-medium">Ask a question about this passage</p>
              <p className="text-xs text-stone-400 mt-1 leading-relaxed max-w-[240px]">
                Answers are grounded on your textbook and cite the sections they come from.
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
                  <div className="max-w-[92%] rounded-2xl rounded-bl-md bg-[#FBFAF7] border border-[#E6E2D6] px-3.5 py-3 text-sm leading-relaxed w-full">
                    {m.pending ? (
                      <div className="space-y-2">
                        <div className="flex items-center gap-1.5 text-[10px] uppercase font-semibold tracking-wider text-stone-400">
                          <Sparkle className="w-3 h-3 text-clay animate-pulse" weight="fill" />
                          Thinking…
                        </div>
                        <div className="space-y-2 pt-1">
                          <div className="h-2.5 rounded-full bg-stone-200 animate-pulse w-[92%]" />
                          <div className="h-2.5 rounded-full bg-stone-200 animate-pulse w-[78%]" />
                          <div className="h-2.5 rounded-full bg-stone-200 animate-pulse w-[85%]" />
                        </div>
                      </div>
                    ) : m.error ? (
                      <div className="flex items-start gap-2 text-red-600">
                        <WarningCircle className="w-4 h-4 mt-0.5 shrink-0" weight="fill" />
                        <span>Couldn't reach the AI service. Check your connection and try again.</span>
                      </div>
                    ) : m.noMatch ? (
                      <div className="flex items-start gap-2 text-stone-600">
                        <BookOpen className="w-4 h-4 mt-0.5 shrink-0 text-clay" weight="duotone" />
                        <span>
                          I couldn't find a relevant passage in this material to answer that. Try rephrasing, or
                          highlight a different passage.
                        </span>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <span className="text-stone-700 whitespace-pre-line">{m.text}</span>

                        {m.citations && m.citations.length > 0 && (
                          <div className="pt-3 border-t border-[#E6E2D6] space-y-2">
                            <div className="text-[10px] uppercase font-semibold tracking-wider text-stone-400">
                              Sources
                            </div>
                            {m.citations.map((c, ci) => (
                              <button
                                key={c.chunkId || ci}
                                onClick={() => gotoSection(c.sectionRef)}
                                title="Jump to this section in the reader"
                                className="w-full text-left rounded-lg bg-white border border-[#E6E2D6] p-2.5 hover:border-clay/40 transition cursor-pointer"
                              >
                                <div className="flex items-center justify-between mb-1">
                                  <span className="text-[10px] font-semibold text-clay bg-clay-tint px-2 py-0.5 rounded-full leading-none">
                                    § {c.sectionRef ?? "—"}
                                  </span>
                                  {typeof c.similarity === "number" && (
                                    <span className="text-[10px] text-stone-400 tabular-nums">
                                      {(c.similarity * 100).toFixed(0)}% match
                                    </span>
                                  )}
                                </div>
                                <p className="text-xs text-stone-600 leading-relaxed line-clamp-3">{c.content}</p>
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
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
              disabled={!draft.trim() || busy}
              aria-label="Send question"
              className="w-10 h-10 shrink-0 rounded-xl bg-clay text-white flex items-center justify-center shadow-sm hover:bg-clay-dark transition disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-clay/50"
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
