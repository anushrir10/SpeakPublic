import { useState } from "react";
import { useLearning } from "../context/LearningContext";
import {
  GraduationCap, Bank, Buildings, MapPinLine, Code, Leaf,
  CheckCircle, ArrowRight, Sparkle
} from "@phosphor-icons/react";
import ThemeToggle from "./ThemeToggle";

export default function Onboarding() {
  const { onboard, user } = useLearning();
  const [grade, setGrade] = useState("Class 10");
  const [board, setBoard] = useState("CBSE (NCERT)");
  const [selectedSubjects, setSelectedSubjects] = useState(["Computer Science"]);
  const [exiting, setExiting] = useState(false);

  const grades = [
    { value: "Class 10", sub: "Grade X" },
    { value: "Class 11", sub: "Grade XI" },
    { value: "Class 12", sub: "Grade XII" }
  ];
  const boards = [
    { value: "CBSE (NCERT)", label: "CBSE", sub: "NCERT", icon: Bank },
    { value: "ICSE", label: "ICSE", sub: "Board", icon: Buildings },
    { value: "State Board", label: "State", sub: "Board", icon: MapPinLine }
  ];
  const subjects = [
    { value: "Computer Science", icon: Code, blurb: "Data structures, logic & code" },
    { value: "Biology", icon: Leaf, blurb: "Life sciences & the living world" }
  ];

  const handleSubjectToggle = (subj) => {
    if (selectedSubjects.includes(subj)) {
      if (selectedSubjects.length > 1) {
        setSelectedSubjects(selectedSubjects.filter((s) => s !== subj));
      }
    } else {
      setSelectedSubjects([...selectedSubjects, subj]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (exiting) return;
    // Slide the card to the right, then hand off to the Library
    setExiting(true);
    setTimeout(() => onboard(grade, board, selectedSubjects), 480);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-6 desk-wood relative overflow-hidden select-none">
      <div className="grain-overlay"></div>
      <div className="absolute top-4 right-4 z-20">
        <ThemeToggle start="top-right" />
      </div>

      <div
        className={`w-full max-w-3xl relative z-10 ${exiting ? "animate-slide-out-right" : "animate-fade-up"}`}
      >
        <div className="leather-mat overflow-hidden">
          {/* Header band */}
          <div className="relative px-8 md:px-11 pt-9 pb-7 border-b border-[#E6E2D6]">
            <div
              className="absolute inset-0 opacity-90"
              style={{ background: "radial-gradient(600px 200px at 0% 0%, rgba(217,119,87,0.10), rgba(217,119,87,0) 70%)" }}
            ></div>
            <div className="relative flex items-center gap-2 mb-3">
              <Sparkle className="w-4 h-4 text-clay" weight="fill" />
              <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-clay font-body">
                Set up your desk
              </span>
            </div>
            <h2 className="relative text-3xl md:text-4xl font-heading text-[#1F1E1D] tracking-tight">
              Hi {user?.username || "there"}, let's build your shelf
            </h2>
            <p className="relative text-sm text-ink-soft font-body mt-2">
              Pick your grade, board and subjects — we'll stock the right textbooks for you.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="p-8 md:p-11 space-y-8">
            {/* Grade */}
            <section>
              <label className="flex items-center gap-1.5 text-[11px] font-semibold text-ink-soft uppercase tracking-wider mb-3 font-body">
                <GraduationCap className="w-4 h-4 text-clay" weight="duotone" />
                Academic grade
              </label>
              <div className="grid grid-cols-3 gap-3">
                {grades.map((g) => {
                  const active = grade === g.value;
                  return (
                    <button
                      key={g.value}
                      type="button"
                      id={`onboard-grade-${g.value.split(" ")[1]}`}
                      onClick={() => setGrade(g.value)}
                      className={`rounded-2xl py-4 px-2 text-center border transition-all duration-200 cursor-pointer ${
                        active
                          ? "bg-clay text-white border-clay shadow-[0_10px_22px_-12px_rgba(217,119,87,0.85)]"
                          : "bg-white border-[#E6E2D6] text-stone-700 hover:border-clay/50 hover:-translate-y-0.5"
                      }`}
                    >
                      <div className="font-heading text-lg tracking-tight">{g.value}</div>
                      <div className={`text-[11px] font-body mt-0.5 ${active ? "text-white/80" : "text-stone-400"}`}>
                        {g.sub}
                      </div>
                    </button>
                  );
                })}
              </div>
            </section>

            {/* Board */}
            <section>
              <label className="flex items-center gap-1.5 text-[11px] font-semibold text-ink-soft uppercase tracking-wider mb-3 font-body">
                <Bank className="w-4 h-4 text-clay" weight="duotone" />
                Educational board
              </label>
              <div className="grid grid-cols-3 gap-3">
                {boards.map((b) => {
                  const Icon = b.icon;
                  const active = board === b.value;
                  return (
                    <button
                      key={b.value}
                      type="button"
                      onClick={() => setBoard(b.value)}
                      className={`rounded-2xl py-4 px-3 flex flex-col items-center gap-1.5 border transition-all duration-200 cursor-pointer ${
                        active
                          ? "bg-clay-tint border-clay text-clay-dark shadow-[0_0_0_4px_rgba(217,119,87,0.10)]"
                          : "bg-white border-[#E6E2D6] text-stone-600 hover:border-clay/50 hover:-translate-y-0.5"
                      }`}
                    >
                      <Icon className={`w-6 h-6 ${active ? "text-clay" : "text-stone-400"}`} weight="duotone" />
                      <div className="font-heading text-base tracking-tight leading-none">{b.label}</div>
                      <div className={`text-[10px] font-body ${active ? "text-clay-dark/70" : "text-stone-400"}`}>{b.sub}</div>
                    </button>
                  );
                })}
              </div>
            </section>

            {/* Subjects */}
            <section>
              <label className="flex items-center gap-1.5 text-[11px] font-semibold text-ink-soft uppercase tracking-wider mb-3 font-body">
                <Leaf className="w-4 h-4 text-clay" weight="duotone" />
                Study subjects
              </label>
              <div className="grid grid-cols-2 gap-4">
                {subjects.map((s) => {
                  const Icon = s.icon;
                  const active = selectedSubjects.includes(s.value);
                  return (
                    <button
                      id={`subject-stamp-${s.value.toLowerCase().replace(/\s+/g, "-")}`}
                      key={s.value}
                      type="button"
                      onClick={() => handleSubjectToggle(s.value)}
                      className={`relative rounded-2xl p-5 flex items-center gap-4 text-left border transition-all duration-200 cursor-pointer ${
                        active
                          ? "bg-clay-tint border-clay shadow-[0_0_0_4px_rgba(217,119,87,0.10)]"
                          : "bg-white border-[#E6E2D6] hover:border-clay/50 hover:-translate-y-0.5"
                      }`}
                    >
                      <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${active ? "bg-clay text-white" : "bg-[#F2EFE7] text-stone-500"}`}>
                        <Icon className="w-6 h-6" weight="duotone" />
                      </div>
                      <div className="min-w-0">
                        <div className={`font-heading text-lg tracking-tight ${active ? "text-clay-dark" : "text-[#1F1E1D]"}`}>
                          {s.value}
                        </div>
                        <div className="text-xs text-stone-500 font-body mt-0.5 truncate">{s.blurb}</div>
                      </div>
                      {active && (
                        <CheckCircle className="w-5 h-5 text-clay absolute top-3 right-3" weight="fill" />
                      )}
                    </button>
                  );
                })}
              </div>
            </section>

            <button
              id="onboard-submit"
              type="submit"
              className="w-full py-3.5 font-body font-semibold tracking-wide text-base tactile-btn-primary flex items-center justify-center gap-2"
            >
              Enter your library
              <ArrowRight className="w-4 h-4" weight="bold" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
