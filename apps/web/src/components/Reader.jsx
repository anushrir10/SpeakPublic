import { useState, useEffect, useRef } from "react";
import { useLearning } from "../context/LearningContext";
import { CaretLeft, CaretRight, BookOpen, FileText, ArrowLeft, Stack, FloppyDisk, Trash, X, Sparkle, MagnifyingGlass, CursorText, NotePencil, ArrowRight, ChatCircleDots } from "@phosphor-icons/react";
import { retrieveContent } from "../services/api";
import { useChapters } from "../hooks/useChapters";
import { useChunks } from "../hooks/useChunks";
import CentralStudyCard from "./CentralStudyCard";
import ThemeToggle from "./ThemeToggle";
import ChapterNav from "./ChapterNav";
import ContextualPanel from "./ContextualPanel";

export default function Reader() {
  const {
    activeBook,
    activePageNum,
    activeConceptKey,
    activeCustomConcept,
    setActiveBook,
    setActivePageNum,
    selectConcept,
    setActiveTab
  } = useLearning();

  // Chapter navigation — live from /api/chapters, or local fallback
  const { chapters, loading: chaptersLoading, isFallback: chaptersFallback } = useChapters(activeBook);
  const [selectedChapterId, setSelectedChapterId] = useState(null); // set when a live chapter is chosen

  // Contextual "Ask" side panel — the shell Week 3 AI Q&A streams into
  const [askOpen, setAskOpen] = useState(false);
  const [askSelection, setAskSelection] = useState("");

  // Mobile viewport tab: 'book' | 'summary'
  const [mobileTab, setMobileTab] = useState("book");
  
  // Page flip animation state: 'next' | 'prev' | null
  const [isFlipping, setIsFlipping] = useState(null);

  // Active highlighted selection text
  const [selectionText, setSelectionText] = useState("");

  // Slide-out left sidebar state
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Note-taking text input for current selection
  const [noteInput, setNoteInput] = useState("");

  // Dictionary lookup definition
  const [customDefinition, setCustomDefinition] = useState("");

  // User custom highlights array of strings
  const [userHighlights, setUserHighlights] = useState(() => {
    if (!activeBook) return [];
    const saved = localStorage.getItem(`ncert_hl_${activeBook.id}`);
    return saved ? JSON.parse(saved) : [];
  });

  // User notes: object mapping { highlightedText: noteText }
  const [userNotes, setUserNotes] = useState(() => {
    if (!activeBook) return {};
    const saved = localStorage.getItem(`ncert_notes_${activeBook.id}`);
    return saved ? JSON.parse(saved) : {};
  });

  // Reference to summary container to calculate selection boundaries
  const summaryContainerRef = useRef(null);

  // Save custom highlights and notes
  useEffect(() => {
    if (activeBook) {
      localStorage.setItem(`ncert_hl_${activeBook.id}`, JSON.stringify(userHighlights));
      localStorage.setItem(`ncert_notes_${activeBook.id}`, JSON.stringify(userNotes));
    }
  }, [userHighlights, userNotes, activeBook]);

  // Live mode = the API returned real chapters (not the local fallback).
  const liveMode = !chaptersFallback && chapters.length > 0;

  // In live mode, scope the chapter list to the grade and subject the student opened.
  const gradeMatched = activeBook ? chapters.filter((c) => c.grade === activeBook.grade && c.subject === activeBook.subject) : [];
  const navChapters = liveMode ? (gradeMatched.length ? gradeMatched : chapters) : chapters;

  // Derived active chapter (no effect): fallback chapters map 1:1 to pages,
  // live chapters follow the user's selection (defaulting to the first).
  const activeChapterId = chaptersFallback
    ? (navChapters.find((c) => c.__pageNumber === activePageNum)?.id ?? navChapters[0]?.id ?? null)
    : (selectedChapterId ?? navChapters[0]?.id ?? null);

  const activeChapter = navChapters.find((c) => c.id === activeChapterId) || null;

  // Fetch the active chapter's chunks from /api/chunks (live mode only).
  const { chunks: liveChunks, loading: chunksLoading } = useChunks(liveMode ? activeChapterId : null);

  if (!activeBook) return null;

  const currentPage = activeBook.pages.find(p => p.pageNumber === activePageNum) || activeBook.pages[0];
  const conceptMap = currentPage?.concepts || {};

  // Monitor text selections in the summary pane
  const handleTextSelection = () => {
    const selection = window.getSelection();
    const text = selection.toString().trim();

    if (text.length > 2 && selection.rangeCount > 0 && summaryContainerRef.current) {
      const range = selection.getRangeAt(0);
      const rect = range.getBoundingClientRect();
      const containerRect = summaryContainerRef.current.getBoundingClientRect();

      // Ensure selection is inside the summary column
      if (
        rect.left >= containerRect.left &&
        rect.right <= containerRect.right &&
        rect.top >= containerRect.top &&
        rect.bottom <= containerRect.bottom
      ) {
        // Mirror the exact selected passage into the Study Assistant…
        setSelectionText(text);
        setNoteInput(userNotes[text] || "");
        setCustomDefinition(`Selected term "${text}" in the context of ${activeBook.title}. Turn it into a flashcard, quiz and study note.`);
        // …and open it automatically.
        setSidebarOpen(true);
      }
    }
  };

  // Chapter selection: local sections jump to a page; live chapters swap the
  // active chapter id (useChunks then fetches /api/chunks for it).
  const handleSelectChapter = (chapter) => {
    if (chapter.__local) {
      if (chapter.__pageNumber) setActivePageNum(chapter.__pageNumber);
    } else {
      setSelectedChapterId(chapter.id);
    }
  };

  // Open the contextual Ask panel for the current selection
  const handleAsk = (text = selectionText) => {
    if (!text) return;
    // Fire the retrieve call to the backend (non-blocking; Week 3 renders results)
    retrieveContent(text).then((result) => {
      if (result && !result.message?.includes("coming soon")) {
        console.log("[FixIt] Retrieved related content:", result);
      }
    });
    setAskSelection(text);
    setAskOpen(true);
  };

  // Add highlight and generate a dynamic flashcard/MCQ card on selection
  const applyHighlightAndStudy = (targetText = selectionText) => {
    if (!targetText) return;

    if (!userHighlights.includes(targetText)) {
      setUserHighlights(prev => [...prev, targetText]);
    }

    // Build a dynamic study card for the highlighted text
    const customConcept = {
      term: targetText,
      definition: userNotes[targetText] 
        ? `"${targetText}" - Note: ${userNotes[targetText]}`
        : `Searching textbook passages for the definition...`,
      flashcard: {
        front: `What is the significance of the highlighted phrase: "${targetText}"?`,
        back: userNotes[targetText]
          ? `Concept: "${targetText}". Study Note: ${userNotes[targetText]}`
          : `Searching textbook passages for the answer...`
      },
      mcq: {
        question: `Based on your reading, which of the following is associated with the term: "${targetText}"?`,
        options: [
          "It is a key concept that you selected for active study",
          "It is an error code that halts computer processing",
          "It is a biological pathway found in plant walls",
          "None of the above"
        ],
        correctIndex: 0,
        explanation: `You selected "${targetText}" as an important study item to review and remember.`
      }
    };

    selectConcept(customConcept);
    
    // Clear selection
    window.getSelection()?.removeAllRanges();
  };

  // Save custom study note
  const handleSaveNote = () => {
    if (!selectionText) return;
    setUserNotes(prev => ({
      ...prev,
      [selectionText]: noteInput
    }));
  };

  // Delete saved highlight and corresponding note
  const handleDeleteHighlight = (textToDelete) => {
    setUserHighlights(prev => prev.filter(h => h !== textToDelete));
    setUserNotes(prev => {
      const updated = { ...prev };
      delete updated[textToDelete];
      return updated;
    });
  };

  // Parse summary HTML, wrapping pre-configured concepts and custom highlights
  const parseInteractiveText = (rawHTML) => {
    const paragraphs = rawHTML
      .split(/<\/p>\s*<p[^>]*>/)
      .map(p => p.replace(/<\/?p[^>]*>/g, "").trim())
      .filter(p => p.length > 0);

    return paragraphs.map((paraText, pIdx) => {
      let processedText = paraText;
      
      // Sort user highlights by length descending to prevent substring conflicts
      const sortedUserHighlights = [...userHighlights].sort((a, b) => b.length - a.length);
      
      sortedUserHighlights.forEach(hl => {
        const escaped = hl.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
        // Replace occurrences of this highlight that are not already inside braces {}
        const regex = new RegExp(`(${escaped})(?![^{]*})`, 'gi');
        processedText = processedText.replace(regex, '{$1}');
      });

      const parts = [];
      const regex = /\{([^}]+)\}/g;
      let lastIndex = 0;
      let match;

      while ((match = regex.exec(processedText)) !== null) {
        const keyOrValue = match[1];
        const matchIndex = match.index;

        if (matchIndex > lastIndex) {
          parts.push(processedText.substring(lastIndex, matchIndex));
        }

        const conceptData = conceptMap[keyOrValue] || conceptMap[keyOrValue.toLowerCase()];
        
        if (conceptData) {
          // Pre-configured concept highlight
          const displayName = conceptData.term;
          const isActive = activeConceptKey === keyOrValue || activeConceptKey === keyOrValue.toLowerCase();

          parts.push(
            <button
              key={`${pIdx}-${keyOrValue}`}
              id={`highlight-${keyOrValue.toLowerCase()}`}
              onClick={() => selectConcept(keyOrValue.toLowerCase())}
              className={`font-semibold cursor-pointer transition-colors ${isActive ? "text-clay-dark" : "text-stone-800 hover:text-clay-dark"}`}
            >
              {displayName}
            </button>
          );
        } else {
          // Custom user highlight
          const isActive = activeConceptKey === "custom" && activeCustomConcept?.term === keyOrValue;
          
          parts.push(
            <button
              key={`${pIdx}-${keyOrValue}`}
              onClick={() => {
                const customConcept = {
                  term: keyOrValue,
                  definition: userNotes[keyOrValue]
                    ? `"${keyOrValue}" - Study Note: ${userNotes[keyOrValue]}`
                    : `Searching textbook passages for the definition...`,
                  flashcard: {
                    front: `What is the significance of the highlighted phrase: "${keyOrValue}"?`,
                    back: userNotes[keyOrValue]
                      ? `Concept: "${keyOrValue}". Study Note: ${userNotes[keyOrValue]}`
                      : `Searching textbook passages for the answer...`
                  },
                  mcq: {
                    question: `Based on your reading, which of the following is associated with the term: "${keyOrValue}"?`,
                    options: [
                      "It is a key concept that you selected for active study",
                      "It is an error code that halts computer processing",
                      "It is a biological pathway found in plant walls",
                      "None of the above"
                    ],
                    correctIndex: 0,
                    explanation: `You selected "${keyOrValue}" as an important study item to review and remember.`
                  }
                };
                selectConcept(customConcept);
              }}
              className={`font-semibold cursor-pointer transition-colors ${isActive ? "text-clay-dark" : "text-stone-800 hover:text-clay-dark"}`}
            >
              {keyOrValue}
            </button>
          );
        }

        lastIndex = regex.lastIndex;
      }

      if (lastIndex < processedText.length) {
        parts.push(processedText.substring(lastIndex));
      }

      return (
        <p key={pIdx} className="mb-4 leading-relaxed text-sm md:text-base text-stone-800">
          {parts}
        </p>
      );
    });
  };

  // Synchronized page flipping animation triggers
  const handleNextPage = () => {
    if (activePageNum < activeBook.pages.length) {
      setIsFlipping("next");
      setTimeout(() => {
        setActivePageNum(activePageNum + 1);
      }, 300); // Swap page content at 90-degree edge-on midpoint
      setTimeout(() => {
        setIsFlipping(null);
      }, 600); // Complete rotation
    }
  };

  const handlePrevPage = () => {
    if (activePageNum > 1) {
      setIsFlipping("prev");
      setTimeout(() => {
        setActivePageNum(activePageNum - 1);
      }, 300); // Swap page content at midpoint
      setTimeout(() => {
        setIsFlipping(null);
      }, 600);
    }
  };

  return (
    <div className="h-screen w-screen desk-wood flex flex-col relative select-none overflow-hidden p-3 md:p-5">
      
      {/* LEFT DRAWER STUDY SIDEBAR PANEL */}
      <div
        className={`fixed inset-y-0 left-0 w-[380px] max-w-[86vw] bg-white border-r border-[#E6E2D6] shadow-2xl z-30 transition-transform duration-300 transform flex flex-col ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Sidebar Header */}
        <div className="px-5 py-4 bg-white border-b border-[#E6E2D6] flex justify-between items-center shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-clay-tint flex items-center justify-center shrink-0">
              <Stack className="w-5 h-5 text-clay" weight="duotone" />
            </div>
            <div>
              <h3 className="font-heading text-stone-800 text-base tracking-tight font-semibold leading-none">
                Study Assistant
              </h3>
              <p className="text-[11px] text-stone-400 font-body mt-1">Highlights, notes &amp; cards</p>
            </div>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="w-8 h-8 rounded-full border border-[#E6E2D6] flex items-center justify-center hover:bg-stone-100 hover:text-stone-800 transition cursor-pointer text-stone-500 shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Sidebar Body */}
        <div className="flex-1 overflow-y-auto px-5 py-6 space-y-8 font-body text-stone-700 select-text">

          {/* Active Selection */}
          <section className="space-y-3">
            <h4 className="text-[11px] uppercase font-semibold tracking-wider text-stone-400">
              Active Selection
            </h4>

            {selectionText ? (
              <div className="space-y-3.5">
                <div
                  className="p-3.5 rounded-xl bg-clay-tint text-sm italic text-stone-700 leading-relaxed max-h-36 overflow-y-auto"
                  style={{ borderLeft: '3px solid #D97757' }}
                >
                  "{selectionText}"
                </div>

                {/* Definition */}
                <div className="text-xs text-stone-500 bg-[#FBFAF7] p-3 border border-[#E6E2D6] rounded-xl leading-relaxed">
                  <span className="font-semibold text-stone-600 flex items-center gap-1.5 mb-1">
                    <MagnifyingGlass className="w-3.5 h-3.5 text-clay" /> Definition
                  </span>
                  {customDefinition}
                </div>

                {/* Note Input */}
                <div className="space-y-2">
                  <label className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider">
                    Sticky note
                  </label>
                  <textarea
                    value={noteInput}
                    onChange={(e) => setNoteInput(e.target.value)}
                    placeholder="Jot a study reference..."
                    className="w-full text-sm p-3 tactile-input focus:outline-none leading-relaxed"
                    rows={3}
                  />
                  <button
                    onClick={handleSaveNote}
                    className="w-full py-2.5 text-stone-700 tactile-btn font-body text-xs tracking-wide font-medium flex items-center justify-center gap-1.5"
                  >
                    <FloppyDisk className="w-4 h-4" />
                    Save note
                  </button>
                </div>

                {/* Ask + Study actions */}
                <div className="space-y-2">
                  <button
                    onClick={() => handleAsk(selectionText)}
                    className="w-full py-3 tactile-btn-primary font-body text-xs tracking-wide font-semibold flex items-center justify-center gap-1.5"
                  >
                    <ChatCircleDots className="w-4 h-4" weight="fill" />
                    Ask FixIt about this
                  </button>
                  <button
                    onClick={() => applyHighlightAndStudy()}
                    className="w-full py-2.5 tactile-btn font-body text-xs tracking-wide font-medium flex items-center justify-center gap-1.5"
                  >
                    <Sparkle className="w-4 h-4 text-clay" weight="fill" />
                    Highlight &amp; study card
                  </button>
                </div>
              </div>
            ) : (
              <div className="rounded-xl border border-dashed border-[#E6E2D6] bg-[#FBFAF7] px-5 py-8 text-center">
                <div className="w-11 h-11 rounded-full bg-clay-tint mx-auto flex items-center justify-center mb-3">
                  <CursorText className="w-5 h-5 text-clay" weight="duotone" />
                </div>
                <p className="text-xs text-stone-500 leading-relaxed">
                  Select any text in the summary to define it, add a note, or turn it into a flashcard.
                </p>
              </div>
            )}
          </section>

          {/* Saved Highlights */}
          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-[11px] uppercase font-semibold tracking-wider text-stone-400">
                Saved Highlights
              </h4>
              <span className="text-[11px] font-semibold text-clay bg-clay-tint px-2 py-0.5 rounded-full leading-none">
                {userHighlights.length}
              </span>
            </div>

            {userHighlights.length > 0 ? (
              <div className="space-y-3">
                {userHighlights.map((hl, idx) => (
                  <div
                    key={idx}
                    className="group bg-white border border-[#E6E2D6] rounded-xl p-3.5 hover:border-clay/40 hover:shadow-[0_6px_18px_-12px_rgba(31,30,29,0.3)] transition"
                  >
                    <div className="flex gap-2.5">
                      <span className="mt-1 w-1 self-stretch rounded-full bg-clay/45 shrink-0"></span>
                      <p className="flex-1 text-sm text-stone-800 leading-relaxed line-clamp-3">
                        {hl}
                      </p>
                    </div>

                    {userNotes[hl] && (
                      <div className="text-xs text-stone-500 bg-[#FBFAF7] px-3 py-2 rounded-lg mt-2.5 leading-relaxed flex gap-1.5">
                        <NotePencil className="w-3.5 h-3.5 text-stone-400 shrink-0 mt-0.5" />
                        <span>{userNotes[hl]}</span>
                      </div>
                    )}

                    <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-[#F1EEE5]">
                      <button
                        onClick={() => applyHighlightAndStudy(hl)}
                        className="text-xs font-semibold text-clay hover:text-clay-dark transition flex items-center gap-1 cursor-pointer"
                      >
                        Study <ArrowRight className="w-3.5 h-3.5" weight="bold" />
                      </button>
                      <button
                        onClick={() => handleDeleteHighlight(hl)}
                        className="text-stone-300 hover:text-red-500 transition cursor-pointer p-1 -m-1"
                        aria-label="Delete highlight"
                      >
                        <Trash className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-stone-400 italic text-center py-6 bg-[#FBFAF7] rounded-xl border border-dashed border-[#E6E2D6]">
                No highlights saved yet.
              </p>
            )}
          </section>

        </div>

        {/* Sidebar Footer */}
        <div className="px-5 py-3 bg-white border-t border-[#E6E2D6] text-center text-[10px] text-stone-400 font-body tracking-wide shrink-0">
          FixIt · Study assistant
        </div>

        {/* Drawer Pull-Tab Handle */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="absolute top-28 right-[-34px] w-9 h-24 bg-white border-y border-r border-[#E6E2D6] rounded-r-xl flex items-center justify-center cursor-pointer shadow-md select-none text-stone-500 hover:text-clay hover:border-clay/40 transition font-body text-[10px] uppercase tracking-widest"
          style={{
            writingMode: 'vertical-lr',
            textOrientation: 'upright'
          }}
        >
          {sidebarOpen ? "CLOSE" : "STUDY"}
        </button>
      </div>

      {/* Top Bar */}
      <div className="w-full bg-white border border-[#E6E2D6] shadow-sm px-5 py-2.5 flex justify-between items-center z-10 relative rounded-2xl">
        <div className="flex items-center gap-2">
          <button
            id="reader-back"
            onClick={() => setActiveBook(null)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium tracking-wide text-stone-600 bg-white border border-[#E6E2D6] rounded-xl shadow-sm hover:border-clay/50 hover:text-clay-dark transition cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Bookshelf
          </button>
          <ChapterNav
            chapters={navChapters}
            activeChapterId={activeChapterId}
            onSelect={handleSelectChapter}
            loading={chaptersLoading}
            isFallback={chaptersFallback}
          />
        </div>

        <div className="text-center hidden lg:block">
          <span className="text-[10px] uppercase font-semibold text-clay font-body block tracking-[0.15em] leading-none mb-0.5">
            {liveMode && activeChapter
              ? `${activeChapter.subject} • ${activeChapter.grade}`
              : `${activeBook.board} • ${activeBook.grade}`}
          </span>
          <h2 className="text-base md:text-lg font-heading text-stone-800 leading-tight tracking-tight font-semibold">
            {liveMode && activeChapter ? activeChapter.title : activeBook.title}
          </h2>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs font-body text-stone-500 font-medium">
            Page {activePageNum} of {activeBook.pages.length}
          </span>
          <ThemeToggle start="top-right" />
        </div>
      </div>

      {/* Mobile Tab Swapper Header */}
      <div className="md:hidden w-full flex gap-2 p-2 bg-[#ECE9DF] z-10">
        <button
          id="mobile-tab-book"
          onClick={() => setMobileTab("book")}
          className={`flex-1 py-2 font-heading text-sm uppercase tracking-wider rounded border shadow-sm flex items-center justify-center gap-1.5 ${
            mobileTab === "book"
              ? "bg-[#FBFAF7] border-[#E6E2D6] text-stone-800 font-bold"
              : "bg-[#ECE9DF] border-[#E6E2D6] text-stone-600"
          }`}
        >
          <BookOpen className="w-4 h-4" />
          Textbook
        </button>
        <button
          id="mobile-tab-summary"
          onClick={() => setMobileTab("summary")}
          className={`flex-1 py-2 font-heading text-sm uppercase tracking-wider rounded border shadow-sm flex items-center justify-center gap-1.5 ${
            mobileTab === "summary"
              ? "bg-[#FFFFFF] border-[#E6E2D6] text-stone-800 font-bold"
              : "bg-[#ECE9DF] border-[#E6E2D6] text-stone-600"
          }`}
        >
          <FileText className="w-4 h-4" />
          Summary Desk
        </button>
      </div>

      {/* Main Workspace (Split View Book Desk - centered and scaled larger) */}
      <div className="flex-1 w-full max-w-[94vw] mx-auto my-3 flex gap-0 relative items-stretch overflow-hidden rounded-2xl border border-[#E6E2D6] shadow-[0_20px_50px_-28px_rgba(31,30,29,0.35)] bg-white select-none">
        
        {/* LEFT PAGE: Textbook scan (hidden on mobile if summary active) */}
        <div 
          className={`flex-1 printed-page page-stack-left rounded-l-lg flex flex-col justify-center items-center overflow-hidden p-4 bg-[#FBFAF7] relative border-r border-[#E6E2D6] ${
            mobileTab === "book" ? "flex" : "hidden md:flex"
          } ${isFlipping ? "animate-flip-left" : ""}`}
        >
          {currentPage.imageUrl ? (
            <div className="w-full h-full flex items-center justify-center p-1 relative">
              <img
                src={currentPage.imageUrl}
                alt={`${activeBook.title} - Page ${currentPage.pageNumber}`}
                className="max-w-full max-h-[85vh] object-contain rounded-md shadow-lg border border-[#E6E2D6] pointer-events-none select-none"
              />
            </div>
          ) : (
            <div className="prose max-w-none text-stone-900 font-body p-6 w-full h-full flex flex-col justify-between">
              <div className="flex justify-between items-center text-[10px] uppercase font-bold text-stone-400 border-b border-[#E6E2D6] pb-2 mb-6">
                <span>{activeBook.subject} Curriculum</span>
                <span>FixIt Digitized Page</span>
              </div>
              <div 
                className="text-stone-800 leading-relaxed text-sm md:text-base space-y-4"
                dangerouslySetInnerHTML={{ __html: currentPage.originalText }}
              />
              <div className="text-center font-heading text-stone-400 text-xs border-t border-[#E6E2D6] pt-4 mt-8">
                - PAGE {currentPage.pageNumber} -
              </div>
            </div>
          )}
        </div>

        {/* SPIRAL GUTTER BINDER (hidden on mobile) */}
        <div className="hidden md:flex flex-col items-center justify-between w-10 book-gutter z-10 relative">
          {[...Array(12)].map((_, i) => (
            <div key={i} className="w-8 h-3 spiral-ring my-2 shadow"></div>
          ))}
        </div>

        {/* RIGHT PAGE: Interactive Summary (hidden on mobile if book active) */}
        <div 
          ref={summaryContainerRef}
          onMouseUp={handleTextSelection}
          className={`flex-1 bg-[#FFFFFF] page-stack-right rounded-r-lg p-6 md:p-8 flex flex-col justify-between overflow-y-auto index-card relative select-text ${
            mobileTab === "summary" ? "flex" : "hidden md:flex"
          } ${isFlipping ? "animate-flip-right" : ""}`}
          style={{ userSelect: "text" }}
        >
          <div className="flex-1 flex flex-col justify-start">
            <div className="flex justify-between items-center text-[10px] uppercase font-semibold tracking-wider text-clay border-b border-[#E6E2D6] pb-3 mb-6">
              <span className="flex items-center gap-1.5">
                {liveMode ? "Chapter content" : "Chapter summary"}
                <span
                  className={`normal-case tracking-normal text-[9px] font-medium px-1.5 py-0.5 rounded-full ${
                    liveMode ? "bg-clay-tint text-clay-dark" : "bg-amber-50 text-amber-600 border border-amber-200"
                  }`}
                  title={liveMode ? "Streaming from /api/chunks" : "Local content — API not connected"}
                >
                  {liveMode ? "live" : "local"}
                </span>
              </span>
              <span className="flex items-center gap-1 text-stone-400 normal-case tracking-normal font-normal">
                <Stack className="w-3.5 h-3.5" />
                Select text to study it
              </span>
            </div>

            {/* Live chapter chunks from /api/chunks; local interactive summary otherwise */}
            <div className="prose max-w-none">
              {liveMode ? (
                chunksLoading && !liveChunks ? (
                  <div className="space-y-3 animate-pulse">
                    {[...Array(6)].map((_, i) => (
                      <div key={i} className="h-3.5 rounded-full bg-stone-200" style={{ width: `${92 - (i % 3) * 12}%` }} />
                    ))}
                  </div>
                ) : liveChunks && liveChunks.length > 0 ? (
                  liveChunks.map((ch) => (
                    <p
                      key={ch.id}
                      data-section={ch.sectionRef}
                      className="mb-4 leading-relaxed text-sm md:text-base text-stone-800"
                    >
                      {ch.content}
                    </p>
                  ))
                ) : (
                  <p className="text-sm text-stone-400 italic">
                    No content chunks for this chapter yet.
                  </p>
                )
              ) : (
                parseInteractiveText(currentPage.interactiveSummary)
              )}
            </div>
          </div>

          <div className="text-center text-[10px] font-body text-stone-400 pt-4 mt-8 border-t border-dashed border-[#E6E2D6] italic">
            {liveMode
              ? `${liveChunks?.length ?? 0} section${(liveChunks?.length ?? 0) === 1 ? "" : "s"} · select any passage to study or ask about it.`
              : "Keywords trigger definitions, interactive flashcards, and checks on your right panel."}
          </div>
        </div>

        {/* Central Desk Index Card Overlay */}
        <CentralStudyCard key={activeConceptKey || "empty"} />
      </div>

      {/* Bottom Navigation */}
      <div className="w-full bg-white border border-[#E6E2D6] rounded-2xl shadow-sm px-5 py-2.5 flex justify-between items-center gap-4 z-10">
        <button
          id="page-prev"
          onClick={handlePrevPage}
          disabled={activePageNum === 1 || isFlipping !== null}
          className={`flex items-center gap-1.5 px-4 py-2 font-body text-sm font-medium tracking-wide rounded-xl border transition-all cursor-pointer ${
            activePageNum === 1 || isFlipping !== null
              ? "bg-stone-100 text-stone-300 border-stone-200 cursor-not-allowed"
              : "bg-white border-[#E6E2D6] text-stone-700 hover:border-clay/50 hover:text-clay-dark active:translate-y-[1px]"
          }`}
        >
          <CaretLeft className="w-4 h-4" />
          Prev
        </button>

        <div className="bg-[#F2EFE7] border border-[#E6E2D6] px-4 py-1.5 rounded-full text-xs font-body text-stone-600 font-medium">
          Page {activePageNum} of {activeBook.pages.length}
        </div>

        <button
          id="page-next"
          onClick={handleNextPage}
          disabled={activePageNum === activeBook.pages.length || isFlipping !== null}
          className={`flex items-center gap-1.5 px-4 py-2 font-body text-sm font-medium tracking-wide rounded-xl border transition-all cursor-pointer ${
            activePageNum === activeBook.pages.length || isFlipping !== null
              ? "bg-stone-100 text-stone-300 border-stone-200 cursor-not-allowed"
              : "bg-white border-[#E6E2D6] text-stone-700 hover:border-clay/50 hover:text-clay-dark active:translate-y-[1px]"
          }`}
        >
          Next
          <CaretRight className="w-4 h-4" />
        </button>
      </div>

      {/* Contextual side panel shell (Week 3 AI Q&A container) */}
      <ContextualPanel
        key={askSelection}
        open={askOpen}
        selection={askSelection}
        chapterTitle={activeBook.title}
        onClose={() => setAskOpen(false)}
        onMakeFlashcard={() => {
          setAskOpen(false);
          applyHighlightAndStudy(askSelection);
          setActiveTab("flashcard");
        }}
      />

    </div>
  );
}
