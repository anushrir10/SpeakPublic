import { useState } from "react";
import { useLearning } from "../context/LearningContext";
import { X, Book, Question, ArrowsCounterClockwise, CheckCircle } from "@phosphor-icons/react";
import confetti from "canvas-confetti";
import { reviewFlashcard } from "../services/api";

export default function CentralStudyCard() {
  const {
    activeBook,
    activePageNum,
    activeConceptKey,
    activeCustomConcept,
    sidePanelOpen,
    activeTab,
    completedMCQs,
    setSidePanelOpen,
    setActiveTab,
    markMCQComplete
  } = useLearning();

  const [selectedOption, setSelectedOption] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);

  // Retrieve the concept data (case-insensitive key match)
  const pageData = activeBook?.pages?.find(p => p.pageNumber === activePageNum);
  const lookupConcept = (key) => {
    if (!key || !pageData?.concepts) return null;
    if (pageData.concepts[key]) return pageData.concepts[key];
    const hit = Object.entries(pageData.concepts).find(
      ([k]) => k.toLowerCase() === key.toLowerCase()
    );
    return hit ? hit[1] : null;
  };
  const concept = activeConceptKey === "custom"
    ? activeCustomConcept
    : lookupConcept(activeConceptKey);

  if (!sidePanelOpen || !concept) return null;

  const handleOptionSelect = (idx) => {
    if (submitted) return; // Prevent change after submit
    setSelectedOption(idx);
  };

  const handleMCQSubmit = () => {
    if (selectedOption === null) return;
    setSubmitted(true);
    const isCorrect = selectedOption === concept.mcq.correctIndex;
    if (isCorrect) {
      markMCQComplete(activeBook.id, activeConceptKey);
      // Trigger canvas-confetti
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.5 } // Center explosion
      });
    }
    // Submit FSRS review to backend (non-blocking)
    // Rating: 4 = easy (correct), 1 = again (incorrect)
    const cardId = `${activeBook.id}-${activeConceptKey}`;
    reviewFlashcard(cardId, isCorrect ? 4 : 1).then((result) => {
      if (result && !result.message?.includes("coming soon")) {
        console.log("[FixIt] FSRS review recorded:", result);
      }
    });
  };

  const handleRetry = () => {
    setSelectedOption(null);
    setSubmitted(false);
  };

  const isMCQSolved = completedMCQs[`${activeBook.id}-${activeConceptKey}`];

  // Helper to sync tab switches with card resets
  const handleTabChange = (tabId) => {
    // When switching away from flashcard tab and card was flipped, record a review
    if (activeTab === "flashcard" && isFlipped && concept) {
      const cardId = `${activeBook.id}-${activeConceptKey}`;
      reviewFlashcard(cardId, 3).then((result) => {
        if (result && !result.message?.includes("coming soon")) {
          console.log("[FixIt] FSRS flashcard review recorded:", result);
        }
      });
    }
    setActiveTab(tabId);
    setIsFlipped(false);
    setSelectedOption(null);
    setSubmitted(false);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-6 select-none">
      
      {/* Central Card Container */}
      <div className="w-full max-w-4xl bg-transparent relative flex flex-col items-center animate-card-in">
        {/* Card Body */}
        <div className="w-full index-card p-7 md:p-10 flex flex-col relative z-20 min-h-[520px]">
          
          {/* Card Close button */}
          <button
            id="center-card-close"
            onClick={() => setSidePanelOpen(false)}
            className="absolute top-4 right-4 w-8 h-8 rounded-full border border-[#E6E2D6] hover:bg-stone-100 flex items-center justify-center text-stone-500 hover:text-stone-800 transition shadow-sm cursor-pointer z-30"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Segmented tabs */}
          <div className="inline-flex gap-1 mb-6 p-1 rounded-xl bg-[#F2EFE7] border border-[#E6E2D6] w-fit">
            {[
              { id: "definition", label: "Definition", icon: Book },
              { id: "flashcard", label: "Flashcard", icon: ArrowsCounterClockwise },
              { id: "mcq", label: "Concept Quiz", icon: Question }
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  id={`center-tab-${tab.id}`}
                  key={tab.id}
                  onClick={() => handleTabChange(tab.id)}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg font-body text-xs font-medium tracking-wide transition-all duration-200 cursor-pointer ${
                    isActive
                      ? "bg-white text-clay-dark shadow-sm"
                      : "text-stone-500 hover:text-stone-800"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" weight={isActive ? "fill" : "regular"} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Content Area */}
          <div className="flex-1 flex flex-col justify-between mt-2">
            
            {/* TAB 1: DEFINITION */}
            {activeTab === "definition" && (
              <div className="flex-1 flex flex-col justify-between text-stone-800 font-body animate-tab-in">
                <div className="space-y-4">
                  <div>
                    <span className="text-[11px] uppercase font-semibold text-clay font-body tracking-wider block mb-1.5">
                      Target Term
                    </span>
                    <h3 className="text-3xl font-heading text-[#1F1E1D] tracking-tight border-b border-[#E6E2D6] pb-2 font-semibold">
                      {concept.term}
                    </h3>
                  </div>
                  <div>
                    <h4 className="text-xs uppercase tracking-wider font-bold text-stone-400 mb-1">
                      Definition
                    </h4>
                    <p className="text-sm md:text-base leading-relaxed bg-[#FBFAF7] p-4 border border-[#E6E2D6] rounded shadow-inner">
                      {concept.definition}
                    </p>
                  </div>
                </div>
                
                <div className="pt-6 border-t border-dashed border-[#E6E2D6] mt-6">
                  <button
                    id="center-go-flashcard"
                    onClick={() => handleTabChange("flashcard")}
                    className="w-full py-2.5 font-heading tracking-wide uppercase text-xs tactile-btn"
                  >
                    Open Flashcard →
                  </button>
                </div>
              </div>
            )}

            {/* TAB 2: FLASHCARD (3D flip) */}
            {activeTab === "flashcard" && (
              <div className="flex-1 flex flex-col justify-between animate-tab-in">
                <div className="text-center">
                  <h3 className="text-2xl font-heading text-[#1F1E1D] tracking-tight font-semibold">
                    {concept.term}
                  </h3>
                  <p className="text-xs text-stone-400 font-body mt-1.5">
                    Click the card to flip and reveal the answer.
                  </p>
                </div>

                <div className="my-7 flex items-center justify-center">
                  <div
                    id="center-flashcard"
                    onClick={() => setIsFlipped(!isFlipped)}
                    className={`w-full max-w-2xl h-96 flip-card cursor-pointer select-none ${isFlipped ? "is-flipped" : ""}`}
                  >
                    <div className="flip-card-inner">
                      {/* Front */}
                      <div className="flip-card-front bg-white border border-[#E6E2D6] p-8 flex flex-col justify-between shadow-[0_16px_40px_-16px_rgba(31,30,29,0.28)]">
                        <span className="text-[11px] font-semibold tracking-wider uppercase text-stone-400 font-body">Concept</span>
                        <div className="text-center font-heading text-[#1F1E1D] text-2xl px-3 flex-grow flex items-center justify-center leading-snug">
                          {concept.flashcard.front}
                        </div>
                        <span className="text-center text-[11px] text-stone-400 font-body italic">Click to reveal answer</span>
                      </div>

                      {/* Back */}
                      <div className="flip-card-back bg-clay-tint border border-clay/40 p-8 flex flex-col justify-between shadow-[0_16px_40px_-16px_rgba(189,93,58,0.38)]">
                        <span className="text-[11px] font-semibold tracking-wider uppercase text-clay-dark font-body">Answer</span>
                        <div className="text-center font-body text-stone-800 text-base md:text-lg px-3 overflow-y-auto flex-grow flex items-center justify-center leading-relaxed">
                          {concept.flashcard.back}
                        </div>
                        <span className="text-center text-[11px] text-clay-dark font-body italic">Click to flip back</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-dashed border-[#E6E2D6]">
                  <button
                    id="center-go-quiz"
                    onClick={() => handleTabChange("mcq")}
                    className="w-full py-2.5 font-heading tracking-wide uppercase text-xs tactile-btn-primary"
                  >
                    Test with Quick Quiz →
                  </button>
                </div>
              </div>
            )}

            {/* TAB 3: MCQ (Quiz) */}
            {activeTab === "mcq" && (
              <div className="flex-1 flex flex-col justify-between font-body text-stone-800 animate-tab-in">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-heading text-[#1F1E1D] tracking-tight font-semibold">
                      {concept.term} · Quiz
                    </h3>
                    {isMCQSolved && (
                      <span className="text-[9px] bg-[#FBEFE8] text-chalkboard-dark px-2 py-0.5 border border-[#D97757] rounded font-semibold flex items-center gap-1">
                        <CheckCircle className="w-2.5 h-2.5 text-chalkboard-green" />
                        Complete
                      </span>
                    )}
                  </div>

                  <p className="text-xs md:text-sm font-semibold bg-[#FBFAF7] p-3 border border-[#E6E2D6] rounded shadow-sm">
                    {concept.mcq.question}
                  </p>

                  <div className="space-y-2">
                    {concept.mcq.options.map((option, idx) => {
                      const isSelected = selectedOption === idx;
                      let optionClass = "bg-white border border-[#E6E2D6] hover:bg-[#FBFAF7]";
                      
                      if (submitted) {
                        if (idx === concept.mcq.correctIndex) {
                          optionClass = "bg-[#FBEFE8] border-2 border-green-500 mcq-correct-glow text-green-800";
                        } else if (isSelected) {
                          optionClass = "bg-red-50 border-2 border-red-500 mcq-incorrect-inset text-red-800";
                        }
                      } else if (isSelected) {
                        optionClass = "bg-[#ECE9DF] border-2 border-[#D97757]";
                      }

                      return (
                        <div
                          id={`center-mcq-option-${idx}`}
                          key={idx}
                          onClick={() => handleOptionSelect(idx)}
                          className={`p-2.5 rounded-lg flex items-center gap-2.5 cursor-pointer text-xs font-medium transition-all duration-100 ${optionClass}`}
                        >
                          <input
                            type="radio"
                            name="center-concept-quiz"
                            checked={isSelected}
                            onChange={() => {}}
                            disabled={submitted}
                            className="punch-hole-radio"
                          />
                          <span>{option}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="pt-4 border-t border-dashed border-[#E6E2D6] mt-4">
                  {submitted ? (
                    <div className="space-y-2.5">
                      <p className={`text-xs p-2 rounded text-center font-medium ${
                        selectedOption === concept.mcq.correctIndex 
                          ? "bg-green-50 text-green-700 border border-green-200"
                          : "bg-red-50 text-red-700 border border-red-200"
                      }`}>
                        {selectedOption === concept.mcq.correctIndex 
                          ? `Correct! ${concept.mcq.explanation}`
                          : `Incorrect. Try again! Hint: ${concept.mcq.explanation.split('.')[0]}.`
                        }
                      </p>
                      
                      {selectedOption !== concept.mcq.correctIndex && (
                        <button
                          id="center-quiz-retry"
                          type="button"
                          onClick={handleRetry}
                          className="w-full py-2 font-heading tracking-wide uppercase text-xs tactile-btn"
                        >
                          Try Again
                        </button>
                      )}
                    </div>
                  ) : (
                    <button
                      id="center-quiz-submit"
                      type="button"
                      onClick={handleMCQSubmit}
                      disabled={selectedOption === null}
                      className={`w-full py-2.5 font-heading tracking-wide uppercase text-xs ${
                        selectedOption !== null
                          ? "tactile-btn-primary"
                          : "bg-stone-200 text-stone-400 border border-stone-300 cursor-not-allowed"
                      }`}
                    >
                      Submit Answer
                    </button>
                  )}
                </div>
              </div>
            )}

          </div>

        </div>
      </div>

    </div>
  );
}
