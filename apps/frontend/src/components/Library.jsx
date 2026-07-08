import { useLearning } from "../context/LearningContext";
import { textbooks } from "../data/textbooks";
import { SignOut, BookOpen, User, FolderOpen } from "@phosphor-icons/react";
import ThemeToggle from "./ThemeToggle";

export default function Library() {
  const { onboarding, user, selectBook, logout } = useLearning();

  // Filter books to match the user's active grade first, other books go to general catalog
  const filteredBooks = textbooks.filter(book => book.grade === onboarding?.grade);
  const otherBooks = textbooks.filter(book => book.grade !== onboarding?.grade);

  return (
    <div className="min-h-screen w-full p-4 md:p-8 desk-wood flex flex-col items-center animate-slide-in-right-page">
      {/* Header nameplate */}
      <div className="w-full max-w-5xl bg-white border border-[#E6E2D6] rounded-2xl shadow-[0_1px_2px_rgba(31,30,29,0.04),0_14px_32px_-18px_rgba(31,30,29,0.18)] p-4 md:p-5 mb-9 flex flex-col md:flex-row justify-between items-center gap-4 relative animate-fade-up">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-clay flex items-center justify-center shadow-sm text-white">
            <User className="w-5 h-5" weight="duotone" />
          </div>
          <div>
            <h1 className="text-2xl font-heading text-[#1F1E1D] leading-none tracking-tight">
              FixIt
            </h1>
            <p className="text-xs text-ink-soft font-body mt-1.5">
              <span className="font-semibold text-stone-700">{user?.username}</span>
              <span className="text-stone-300 mx-1.5">·</span>{onboarding?.board}
              <span className="text-stone-300 mx-1.5">·</span>{onboarding?.grade}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <ThemeToggle start="top-right" />
          <button
            id="library-logout"
            onClick={logout}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-medium tracking-wide text-stone-600 bg-white border border-[#E6E2D6] rounded-xl shadow-sm hover:border-red-300 hover:text-red-600 hover:bg-red-50/40 transition cursor-pointer"
          >
            <SignOut className="w-3.5 h-3.5" />
            Sign out
          </button>
        </div>
      </div>

      {/* Main Bookshelf */}
      <div className="w-full max-w-5xl flex-1 flex flex-col justify-center">
        {/* Recommended Shelf */}
        <div className="mb-12">
          <div className="flex items-center gap-2 mb-4 px-1">
            <BookOpen className="w-5 h-5 text-clay" weight="duotone" />
            <h2 className="text-xl font-heading text-[#1F1E1D] tracking-tight">
              Your {onboarding?.grade} shelf
            </h2>
          </div>

          <div className="bookshelf-wood rounded-2xl relative px-6 md:px-12 py-9 min-h-[300px] flex items-end justify-center md:justify-start gap-12 flex-wrap stagger">

            {filteredBooks.length > 0 ? (
              filteredBooks.map((book) => (
                <div
                  key={book.id}
                  id={`book-card-${book.id}`}
                  onClick={() => selectBook(book.id)}
                  className="w-44 h-64 cursor-pointer relative book-cover flex-shrink-0"
                >
                  {/* Book Body */}
                  <div className={`w-full h-full rounded-l-md bg-gradient-to-br ${book.coverColor} p-4 flex flex-col justify-between shadow-2xl relative border-r border-[#ffffff20]`}>
                    
                    {/* 3D Spine effect shadow overlay */}
                    <div className="book-spine-effect"></div>
                    
                    {/* Simulated white pages border on the right */}
                    <div className="book-pages-strip"></div>

                    {/* Gold Leaf Border Frame */}
                    <div className="absolute inset-2.5 border border-yellow-500/35 rounded pointer-events-none"></div>

                    {/* Foil gold typography */}
                    <div className="relative z-10 text-center mt-3">
                      <span className="text-[10px] uppercase font-bold tracking-widest text-yellow-400/90 font-heading">
                        {book.board}
                      </span>
                      <h3 className="text-lg font-heading uppercase text-white leading-tight mt-1 font-bold">
                        {book.title}
                      </h3>
                      <div className="w-8 h-0.5 bg-yellow-500/50 mx-auto mt-2"></div>
                    </div>

                    <div className="relative z-10 text-center mb-2">
                      <p className="text-[9px] uppercase tracking-wider text-white/70 font-body font-medium">
                        FixIt Text
                      </p>
                      <p className="text-[10px] text-yellow-400 font-bold font-body mt-1">
                        {book.subject}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="w-full text-center text-stone-400 py-12 font-body italic">
                No active textbooks found matching your class. See the archive below.
              </div>
            )}
          </div>
        </div>

        {/* Catalog / Archive Shelf */}
        <div>
          <div className="flex items-center gap-2 mb-4 px-1">
            <FolderOpen className="w-5 h-5 text-clay" weight="duotone" />
            <h2 className="text-xl font-heading text-[#1F1E1D] tracking-tight">
              Archive · other grades
            </h2>
          </div>

          <div className="bookshelf-wood rounded-2xl relative px-6 md:px-12 py-9 min-h-[300px] flex items-end justify-center md:justify-start gap-12 flex-wrap mb-8 stagger">

            {otherBooks.map((book) => (
              <div
                key={book.id}
                id={`book-card-${book.id}`}
                onClick={() => selectBook(book.id)}
                className="w-44 h-64 cursor-pointer relative book-cover flex-shrink-0"
              >
                {/* Book Body */}
                <div className={`w-full h-full rounded-l-md bg-gradient-to-br ${book.coverColor} p-4 flex flex-col justify-between shadow-2xl relative border-r border-[#ffffff20]`}>
                  
                  {/* Spine & Pages */}
                  <div className="book-spine-effect"></div>
                  <div className="book-pages-strip"></div>
                  <div className="absolute inset-2.5 border border-yellow-500/35 rounded pointer-events-none"></div>

                  <div className="relative z-10 text-center mt-3">
                    <span className="text-[10px] uppercase font-bold tracking-widest text-yellow-400/90 font-heading">
                      {book.board}
                    </span>
                    <h3 className="text-lg font-heading uppercase text-white leading-tight mt-1 font-bold">
                      {book.title}
                    </h3>
                    <p className="text-[10px] text-yellow-400/70 font-semibold mt-1">
                      {book.grade}
                    </p>
                    <div className="w-8 h-0.5 bg-yellow-500/50 mx-auto mt-2"></div>
                  </div>

                  <div className="relative z-10 text-center mb-2">
                    <p className="text-[9px] uppercase tracking-wider text-white/70 font-body font-medium">
                      FixIt Text
                    </p>
                    <p className="text-[10px] text-yellow-400 font-bold font-body mt-1">
                      {book.subject}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
