"use client";

import { useState } from "react";

const riddles = [
  {
    id: 1,
    category: "English",
    difficulty: "Easy",
    question: "I have hands but cannot clap. What am I?",
    answer: "A clock",
  },
  {
    id: 2,
    category: "English",
    difficulty: "Easy",
    question: "What has many keys but cannot open a single door?",
    answer: "A piano",
  },
  {
    id: 3,
    category: "Funny",
    difficulty: "Easy",
    question: "What gets wetter the more it dries?",
    answer: "A towel",
  },
  {
    id: 4,
    category: "Logic",
    difficulty: "Medium",
    question:
      "A farmer has 17 sheep. All but 9 run away. How many sheep are left?",
    answer: "9 sheep",
  },
  {
    id: 5,
    category: "Tricky",
    difficulty: "Medium",
    question: "How many months have 28 days?",
    answer: "All 12 months",
  },
  {
    id: 6,
    category: "Tamil",
    difficulty: "Easy",
    question: "கால்கள் உண்டு, ஆனால் நடக்க முடியாது. அது என்ன?",
    answer: "மேசை",
  },
];

const categories = [
  "All",
  "English",
  "Tamil",
  "Funny",
  "Logic",
  "Tricky",
];

export default function RiddlesPage() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [revealed, setRevealed] = useState<number[]>([]);
  const [menuOpen, setMenuOpen] = useState(false);

  const filteredRiddles =
    selectedCategory === "All"
      ? riddles
      : riddles.filter(
          (riddle) => riddle.category === selectedCategory
        );

  const toggleAnswer = (id: number) => {
    setRevealed((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id]
    );
  };

  return (
    <main className="min-h-screen bg-[#07091f] text-white">

      {/* ================= HEADER ================= */}
      <header className="sticky top-0 z-50 border-b border-white/10 bg-[#07091f]/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4">

          {/* LOGO */}
          <a
            href="/"
            className="flex items-center gap-3"
            onClick={() => setMenuOpen(false)}
          >
            <div className="grid size-12 shrink-0 place-items-center rounded-2xl bg-pink-400 text-3xl shadow-lg shadow-pink-500/20">
              🧠
            </div>

            <div className="leading-none">
              <div className="text-2xl font-black tracking-tight">
                <span className="text-white">KADI</span>{" "}
                <span className="text-yellow-300">RIDDLER</span>
              </div>

              <div className="mt-1 text-[10px] font-bold uppercase tracking-[.22em] text-white/60">
                Think. Laugh. Get Tricked.
              </div>
            </div>
          </a>

          {/* DESKTOP NAVIGATION */}
          <nav className="hidden items-center gap-8 text-sm font-bold md:flex">

            <a
              href="/"
              className="text-white/70 transition hover:text-yellow-400"
            >
              Home
            </a>

            <a
              href="/riddles"
              className="text-yellow-400"
            >
              Riddles
            </a>

            <a
              href="/kadi-jokes"
              className="text-white/70 transition hover:text-orange-400"
            >
              Kadi Jokes
            </a>

            <a
              href="/facts"
              className="text-white/70 transition hover:text-green-400"
            >
              Amazing Facts
            </a>

          </nav>

          {/* DESKTOP SEARCH */}
          <div className="hidden rounded-full bg-white/10 px-4 py-2 text-lg md:block">
            🔍
          </div>

          {/* MOBILE MENU BUTTON */}
          <button
            type="button"
            onClick={() => setMenuOpen((current) => !current)}
            className="grid size-12 place-items-center rounded-full bg-white/10 text-xl md:hidden"
            aria-label="Toggle menu"
          >
            {menuOpen ? "✕" : "☰"}
          </button>
        </div>

        {/* MOBILE MENU */}
        {menuOpen && (
          <div className="border-t border-white/10 bg-[#07091f] px-5 py-4 md:hidden">

            <nav className="flex flex-col gap-2">

              <a
                href="/"
                onClick={() => setMenuOpen(false)}
                className="rounded-2xl px-5 py-4 font-bold text-white/80 hover:bg-white/10"
              >
                🏠 Home
              </a>

              <a
                href="/riddles"
                onClick={() => setMenuOpen(false)}
                className="rounded-2xl bg-white/10 px-5 py-4 font-bold text-yellow-400"
              >
                🧩 Riddles
              </a>

              <a
                href="/kadi-jokes"
                onClick={() => setMenuOpen(false)}
                className="rounded-2xl px-5 py-4 font-bold text-white/80 hover:bg-white/10"
              >
                😂 Kadi Jokes
              </a>

              <a
                href="/facts"
                onClick={() => setMenuOpen(false)}
                className="rounded-2xl px-5 py-4 font-bold text-white/80 hover:bg-white/10"
              >
                🤯 Amazing Facts
              </a>

            </nav>
          </div>
        )}
      </header>

      {/* ================= HERO ================= */}
      <section className="relative overflow-hidden">

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,#3b176f,transparent_55%)]" />

        <div className="relative mx-auto max-w-5xl px-5 pb-14 pt-20 text-center">

          <div className="mb-5 text-6xl">
            🧩
          </div>

          <h1 className="text-5xl font-black tracking-tight md:text-7xl">
            RIDDLE <span className="text-yellow-400">TIME!</span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-white/70">
            Think carefully, trust your brain, and don't let these tricky
            questions fool you!
          </p>

        </div>
      </section>

      {/* ================= CATEGORIES ================= */}
      <section className="mx-auto max-w-7xl px-5">

        <div className="flex flex-wrap justify-center gap-3">

          {categories.map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => setSelectedCategory(category)}
              className={`touch-manipulation rounded-full px-5 py-3 text-sm font-bold transition ${
                selectedCategory === category
                  ? "bg-yellow-400 text-black shadow-lg shadow-yellow-400/20"
                  : "bg-white/10 text-white hover:bg-white/20"
              }`}
            >
              {category}
            </button>
          ))}

        </div>
      </section>

      {/* ================= RIDDLES ================= */}
      <section className="mx-auto max-w-7xl px-5 py-14">

        <div className="mb-8 flex items-end justify-between">

          <div>

            <p className="mb-2 text-sm font-bold uppercase tracking-widest text-purple-400">
              Challenge your brain
            </p>

            <h2 className="text-3xl font-black md:text-4xl">
              {selectedCategory === "All"
                ? "All Riddles"
                : `${selectedCategory} Riddles`}
            </h2>

          </div>

          <span className="rounded-full bg-white/10 px-4 py-2 text-sm text-white/60">
            {filteredRiddles.length} riddles
          </span>

        </div>

        <div className="grid gap-6 md:grid-cols-2">

          {filteredRiddles.map((riddle) => {

            const isRevealed = revealed.includes(riddle.id);

            return (
              <article
                key={riddle.id}
                className="group rounded-3xl border border-white/10 bg-white/[0.06] p-7 shadow-xl transition hover:-translate-y-1 hover:bg-white/[0.09]"
              >

                <div className="mb-6 flex items-center justify-between">

                  <span className="rounded-full bg-purple-500/20 px-3 py-1 text-xs font-bold text-purple-300">
                    {riddle.category}
                  </span>

                  <span className="text-xs font-semibold text-white/40">
                    {riddle.difficulty}
                  </span>

                </div>

                <div className="mb-8 text-4xl">
                  ❓
                </div>

                <h3 className="min-h-[100px] text-2xl font-bold leading-relaxed">
                  {riddle.question}
                </h3>

                {isRevealed && (
                  <div className="mt-6 rounded-2xl border border-yellow-400/20 bg-yellow-400/10 p-5">

                    <p className="text-xs font-bold uppercase tracking-widest text-yellow-400">
                      💡 Answer
                    </p>

                    <p className="mt-2 text-xl font-black">
                      {riddle.answer}
                    </p>

                  </div>
                )}

                <button
                  type="button"
                  onClick={() => toggleAnswer(riddle.id)}
                  className="mt-7 w-full touch-manipulation rounded-2xl bg-gradient-to-r from-purple-600 to-fuchsia-500 px-5 py-4 font-bold transition hover:scale-[1.02] active:scale-[0.98]"
                >
                  {isRevealed
                    ? "🙈 Hide Answer"
                    : "👀 Reveal Answer"}
                </button>

              </article>
            );
          })}

        </div>
      </section>

      {/* ================= BOTTOM CTA ================= */}
      <section className="mx-auto max-w-5xl px-5 pb-20">

        <div className="rounded-3xl border border-yellow-400/20 bg-gradient-to-r from-purple-700/40 to-yellow-500/10 p-8 text-center">

          <div className="text-4xl">
            🧠
          </div>

          <h2 className="mt-4 text-3xl font-black">
            Think you can solve them all?
          </h2>

          <p className="mt-3 text-white/60">
            More riddles, funny questions and brain teasers are coming!
          </p>

        </div>

      </section>

      {/* ================= FOOTER ================= */}
      <footer className="border-t border-white/10 px-5 py-8 text-center text-sm text-white/40">
        © 2026 Kadi Riddler. Think. Laugh. Get Tricked. 💜
      </footer>

    </main>
  );
}