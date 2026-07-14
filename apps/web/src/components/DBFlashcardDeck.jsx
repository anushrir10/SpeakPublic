import { useState } from "react";
import { X, Cards, ArrowLeft, ArrowRight, CheckCircle, WarningCircle, Sparkle } from "@phosphor-icons/react";
import confetti from "canvas-confetti";
import { reviewFlashcard, logAnalyticsEvent } from "../services/api";

/**
 * DBFlashcardDeck
 *
 * Full-screen modal for studying DB-backed flashcards (Flashcard model).
 * Supports both "qa" (flip) and "mcq" (multiple-choice) card types.
 *
 * Props:
 *   open        – boolean
 *   flashcards  – Flashcard[] from the DB (useFlashcards hook)
 *   chapterTitle– string label
 *   onClose     – close handler
 */
export default function DBFlashcardDeck({ open, flashcards = [], chapterTitle, onClose }) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [completed, setCompleted] = useState([]); // array of booleans

  if (!open || flashcards.length === 0) return null;

  const card = flashcards[currentIdx];
  const isLastCard = currentIdx === flashcards.length - 1;
  const isQA = card.type === "qa";
  const isMCQ = card.type === "mcq";
  const difficultyColors = {
    easy: "text-emerald-600 bg-emerald-50 border-emerald-200",
    medium: "text-amber-600 bg-amber-50 border-amber-200",
    hard: "text-red-600 bg-red-50 border-red-200",
  };

  const handleFlip = () => {
    if (isQA) setIsFlipped(!isFlipped);
  };

  const handleRating = async (rating) => {
    // Fire FSRS review (non-blocking)
    reviewFlashcard(card.id, rating);
    logAnalyticsEvent("review", card.chunkId, { rating, cardType: card.type });

    if (rating >= 3) {
      confetti({ particleCount: 60, spread: 50, origin: { y: 0.55 }, scalar: 0.8 });
    }

    const newCompleted = [...completed];
    newCompleted[currentIdx] = rating >= 3;
    setCompleted(newCompleted);

    // Advance after a short pause
    setTimeout(() => {
      if (isLastCard) {
        onClose();
      } else {
        setCurrentIdx(currentIdx + 1);
        setIsFlipped(false);
        setSelectedOption(null);
        setSubmitted(false);
      }
    }, 600);
  };

  const handleMCQSubmit = () => {
    if (selectedOption === null) return;
    setSubmitted(true);
    const correctIdx = card.options ? card.options.indexOf(card.answer) : -1;
    const isCorrect = selectedOption === correctIdx || card.options?.[selectedOption] === card.answer;
    handleRating(isCorrect ? 4 : 1);
  };

  const handleSkip = () => {
    reviewFlashcard(card.id, 1); // rating=1 (again)
    const newCompleted = [...completed];
    newCompleted[currentIdx] = false;
    setCompleted(newCompleted);
    if (!isLastCard) {
      setCurrentIdx(currentIdx + 1);
      setIsFlipped(false);
      setSelectedOption(null);
      setSubmitted(false);
    } else {
      onClose();
    }
  };

  const progress = ((currentIdx) / flashcards.length) * 100;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-[60] flex items-center justify-center p-4 md:p-8 select-none">
      <div className="w-full max-w-2xl flex flex-col gap-4 animate-card-in">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-clay/20 backdrop-blur flex items-center justify-center">
              <Cards className="w-5 h-5 text-white" weight="duotone" />
            </div>
            <div>
              <p className="text-white/90 text-sm font-heading font-semibold leading-none">{chapterTitle}</p>
              <p className="text-white/50 text-[10px] font-body mt-0.5">
                Card {currentIdx + 1} of {flashcards.length}
              </p>
            </div>
          </div>
          <button
            id="db-deck-close"
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/70 hover:text-white transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Progress bar */}
        <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full bg-clay rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Card */}
        <div className="bg-white rounded-3xl shadow-[0_32px_80px_-20px_rgba(0,0,0,0.6)] overflow-hidden">

          {/* Card header bar */}
          <div className="px-6 pt-5 pb-4 border-b border-[#E6E2D6] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full border ${difficultyColors[card.difficulty] || difficultyColors.medium}`}>
                {card.difficulty}
              </span>
              <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full border border-[#E6E2D6] text-stone-500 bg-[#FBFAF7]">
                {isQA ? "Q & A" : "MCQ"}
              </span>
            </div>
            {/* Progress dots */}
            <div className="flex items-center gap-1">
              {flashcards.map((_, i) => (
                <div
                  key={i}
                  className={`rounded-full transition-all duration-300 ${
                    i === currentIdx
                      ? "w-4 h-2 bg-clay"
                      : completed[i] === true
                      ? "w-2 h-2 bg-emerald-400"
                      : completed[i] === false
                      ? "w-2 h-2 bg-red-300"
                      : "w-2 h-2 bg-stone-200"
                  }`}
                />
              ))}
            </div>
          </div>

          {/* ── Q&A Flip Card ── */}
          {isQA && (
            <div className="px-6 py-6">
              <div
                id="db-flashcard-flip"
                onClick={handleFlip}
                className={`w-full h-56 flip-card cursor-pointer ${isFlipped ? "is-flipped" : ""}`}
              >
                <div className="flip-card-inner">
                  {/* Front */}
                  <div className="flip-card-front bg-[#FBFAF7] border border-[#E6E2D6] p-7 flex flex-col justify-between shadow-sm">
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-stone-400">Question</span>
                    <p className="text-center text-stone-800 font-heading text-xl leading-snug px-2">
                      {card.question}
                    </p>
                    <span className="text-center text-[10px] text-stone-400 italic">Click to reveal answer</span>
                  </div>
                  {/* Back */}
                  <div className="flip-card-back bg-clay-tint border border-clay/30 p-7 flex flex-col justify-between shadow-sm">
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-clay-dark">Answer</span>
                    <p className="text-center text-stone-800 font-body text-base leading-relaxed px-2 overflow-y-auto">
                      {card.answer}
                    </p>
                    <span className="text-center text-[10px] text-clay-dark italic">Click to flip back</span>
                  </div>
                </div>
              </div>

              {/* Rating buttons — shown after flip */}
              {isFlipped && (
                <div className="mt-5 flex items-center gap-2.5 animate-fade-up">
                  <button
                    id="db-rating-hard"
                    onClick={() => handleRating(1)}
                    className="flex-1 py-2.5 text-xs font-semibold font-body tracking-wide rounded-xl border border-red-200 bg-red-50 text-red-600 hover:bg-red-100 transition cursor-pointer"
                  >
                    Again
                  </button>
                  <button
                    id="db-rating-medium"
                    onClick={() => handleRating(2)}
                    className="flex-1 py-2.5 text-xs font-semibold font-body tracking-wide rounded-xl border border-amber-200 bg-amber-50 text-amber-600 hover:bg-amber-100 transition cursor-pointer"
                  >
                    Hard
                  </button>
                  <button
                    id="db-rating-good"
                    onClick={() => handleRating(3)}
                    className="flex-1 py-2.5 text-xs font-semibold font-body tracking-wide rounded-xl border border-blue-200 bg-blue-50 text-blue-600 hover:bg-blue-100 transition cursor-pointer"
                  >
                    Good
                  </button>
                  <button
                    id="db-rating-easy"
                    onClick={() => handleRating(4)}
                    className="flex-1 py-2.5 text-xs font-semibold font-body tracking-wide rounded-xl border border-emerald-200 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 transition cursor-pointer"
                  >
                    Easy
                  </button>
                </div>
              )}

              {!isFlipped && (
                <div className="mt-4 flex justify-center">
                  <button
                    onClick={handleSkip}
                    className="text-xs text-stone-400 hover:text-stone-600 transition cursor-pointer underline underline-offset-2"
                  >
                    Skip this card
                  </button>
                </div>
              )}
            </div>
          )}

          {/* ── MCQ Card ── */}
          {isMCQ && (
            <div className="px-6 py-6 space-y-4">
              <p className="text-stone-800 font-heading text-base md:text-lg leading-snug">
                {card.question}
              </p>
              <div className="space-y-2">
                {(card.options || []).map((opt, idx) => {
                  const correctIdx = card.options.indexOf(card.answer);
                  const isSelected = selectedOption === idx;
                  const isCorrectOpt = idx === correctIdx;
                  let cls = "bg-white border border-[#E6E2D6] hover:bg-[#FBFAF7]";
                  if (submitted) {
                    if (isCorrectOpt) cls = "bg-emerald-50 border-2 border-emerald-400 text-emerald-800";
                    else if (isSelected) cls = "bg-red-50 border-2 border-red-400 text-red-800";
                  } else if (isSelected) {
                    cls = "bg-[#ECE9DF] border-2 border-clay";
                  }
                  return (
                    <div
                      id={`db-mcq-opt-${idx}`}
                      key={idx}
                      onClick={() => !submitted && setSelectedOption(idx)}
                      className={`p-3 rounded-xl flex items-center gap-3 cursor-pointer text-sm font-medium transition-all duration-150 ${cls}`}
                    >
                      <input
                        type="radio"
                        checked={isSelected}
                        onChange={() => {}}
                        disabled={submitted}
                        className="punch-hole-radio"
                      />
                      {opt}
                      {submitted && isCorrectOpt && (
                        <CheckCircle className="w-4 h-4 text-emerald-500 ml-auto shrink-0" weight="fill" />
                      )}
                      {submitted && isSelected && !isCorrectOpt && (
                        <WarningCircle className="w-4 h-4 text-red-400 ml-auto shrink-0" weight="fill" />
                      )}
                    </div>
                  );
                })}
              </div>

              {!submitted ? (
                <button
                  id="db-mcq-submit"
                  onClick={handleMCQSubmit}
                  disabled={selectedOption === null}
                  className={`w-full py-3 font-heading tracking-wide uppercase text-xs ${
                    selectedOption !== null
                      ? "tactile-btn-primary"
                      : "bg-stone-100 text-stone-400 border border-stone-200 cursor-not-allowed rounded-xl"
                  }`}
                >
                  Submit Answer
                </button>
              ) : (
                <p className={`text-xs text-center py-2 rounded-xl font-medium ${
                  selectedOption === card.options?.indexOf(card.answer)
                    ? "bg-emerald-50 text-emerald-700"
                    : "bg-red-50 text-red-700"
                }`}>
                  {selectedOption === card.options?.indexOf(card.answer)
                    ? "Correct! Moving on…"
                    : "Incorrect. The correct answer is highlighted."}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Footer hint */}
        <p className="text-center text-white/30 text-[10px] font-body">
          <Sparkle className="inline w-3 h-3 mr-1" weight="fill" />
          Your answers are synced with spaced-repetition scheduling
        </p>
      </div>
    </div>
  );
}
