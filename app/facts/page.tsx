"use client";

import { useState } from "react";

const facts = [
  {
    id: 1,
    category: "Animals",
    emoji: "🐙",
    fact: "Octopuses have three hearts.",
    detail:
      "Two hearts pump blood to the gills, while the third pumps blood to the rest of the body.",
  },
  {
    id: 2,
    category: "Space",
    emoji: "🌌",
    fact: "A day on Venus is longer than a year on Venus.",
    detail:
      "Venus rotates so slowly that one rotation takes longer than the time it takes Venus to orbit the Sun.",
  },
  {
    id: 3,
    category: "Human Body",
    emoji: "🧠",
    fact: "The human brain uses a surprisingly large amount of energy.",
    detail:
      "Even though the brain is only a small part of body mass, it requires a significant share of the body's energy.",
  },
  {
    id: 4,
    category: "Animals",
    emoji: "🦈",
    fact: "Sharks are older than trees.",
    detail:
      "Shark ancestors appeared hundreds of millions of years ago, before the first trees evolved.",
  },
  {
    id: 5,
    category: "Science",
    emoji: "⚡",
    fact: "Lightning can heat the air to temperatures hotter than the surface of the Sun.",
    detail:
      "The intense electrical discharge rapidly heats the surrounding air, producing the explosive sound we know as thunder.",
  },
  {
    id: 6,
    category: "Ocean",
    emoji: "🌊",
    fact: "Most of Earth's volcanic activity happens underwater.",
    detail:
      "A huge amount of volcanic activity occurs along underwater mountain ranges and other areas of the ocean floor.",
  },
  {
    id: 7,
    category: "India",
    emoji: "🇮🇳",
    fact: "India is home to one of the world's largest railway networks.",
    detail:
      "Indian Railways operates an enormous passenger and freight railway system connecting cities and regions across the country.",
  },
  {
    id: 8,
    category: "Technology",
    emoji: "💻",
    fact: "The first computer mouse was made from wood.",
    detail:
      "An early computer mouse prototype was built with a wooden casing and wheels for tracking movement.",
  },
  {
    id: 9,
    category: "History",
    emoji: "🏛️",
    fact: "The Great Pyramid of Giza was the tallest human-made structure for thousands of years.",
    detail:
      "Its original height was roughly 146 meters, and it remained taller than any other known human-made structure for a very long period.",
  },
  {
    id: 10,
    category: "Weird & Crazy",
    emoji: "🤯",
    fact: "Bananas are botanically berries, but strawberries are not.",
    detail:
      "Botanical definitions of berries are based on how fruits develop, which produces some surprising classifications.",
  },
];

const categories = [
  "All",
  "Animals",
  "Space",
  "Science",
  "Human Body",
  "India",
  "History",
  "Technology",
  "Ocean",
  "Weird & Crazy",
];

export default function FactsPage() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [expanded, setExpanded] = useState<number[]>([]);
  const [menuOpen, setMenuOpen] = useState(false);

  const filteredFacts =
    selectedCategory === "All"
      ? facts
      : facts.filter((fact) => fact.category === selectedCategory);

  const toggleFact = (id: number) => {
    setExpanded((current) =>
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
            onClick={() => setMenuOpen(false)}
            className="flex items-center gap-3"
          >

            <div className="grid size-12 shrink-0 place-items-center rounded-2xl bg-pink-400 text-3xl shadow-lg shadow-pink-500/20">
              🧠
            </div>

            <div className="leading-none">

              <div className="text-2xl font-black tracking-tight">
                <span className="text-white">
                  KADI
                </span>{" "}
                <span className="text-yellow-300">
                  RIDDLER
                </span>
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
              className="text-white/70 transition hover:text-yellow-400"
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
              className="text-green-400"
            >
              Amazing Facts
            </a>

          </nav>

          {/* SEARCH */}

          <div className="hidden rounded-full bg-white/10 px-4 py-2 text-lg md:block">
            🔍
          </div>

          {/* MOBILE MENU BUTTON */}

          <button
            type="button"
            onClick={() =>
              setMenuOpen((current) => !current)
            }
            className="grid size-12 place-items-center rounded-full bg-white/10 text-xl md:hidden touch-manipulation"
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
                className="rounded-2xl px-5 py-4 font-bold text-white/80 hover:bg-white/10 touch-manipulation"
              >
                🏠 Home
              </a>

              <a
                href="/riddles"
                onClick={() => setMenuOpen(false)}
                className="rounded-2xl px-5 py-4 font-bold text-white/80 hover:bg-white/10 touch-manipulation"
              >
                🧩 Riddles
              </a>

              <a
                href="/kadi-jokes"
                onClick={() => setMenuOpen(false)}
                className="rounded-2xl px-5 py-4 font-bold text-white/80 hover:bg-white/10 touch-manipulation"
              >
                😂 Kadi Jokes
              </a>

              <a
                href="/facts"
                onClick={() => setMenuOpen(false)}
                className="rounded-2xl bg-white/10 px-5 py-4 font-bold text-green-400 touch-manipulation"
              >
                🤯 Amazing Facts
              </a>

            </nav>

          </div>
        )}

      </header>


      {/* ================= HERO ================= */}

      <section className="relative overflow-hidden">

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,#123f36,transparent_55%)]" />

        <div className="relative mx-auto max-w-5xl px-5 pb-14 pt-20 text-center">

          <div className="mb-5 text-6xl">
            🤯
          </div>

          <h1 className="text-5xl font-black tracking-tight md:text-7xl">
            AMAZING{" "}
            <span className="text-green-400">
              FACTS!
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-white/70">
            Strange, surprising and fascinating facts from our world and
            beyond.
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
                  ? "bg-green-400 text-black shadow-lg shadow-green-400/20"
                  : "bg-white/10 text-white hover:bg-white/20"
              }`}
            >
              {category}
            </button>

          ))}

        </div>

      </section>


      {/* ================= FACTS ================= */}

      <section className="mx-auto max-w-7xl px-5 py-14">

        <div className="mb-8 flex items-end justify-between">

          <div>

            <p className="mb-2 text-sm font-bold uppercase tracking-widest text-green-400">
              Feed your curiosity
            </p>

            <h2 className="text-3xl font-black md:text-4xl">
              {selectedCategory === "All"
                ? "Amazing Facts"
                : selectedCategory}
            </h2>

          </div>

          <span className="rounded-full bg-white/10 px-4 py-2 text-sm text-white/60">
            {filteredFacts.length} facts
          </span>

        </div>


        <div className="grid gap-6 md:grid-cols-2">

          {filteredFacts.map((fact) => {

            const isExpanded = expanded.includes(fact.id);

            return (

              <article
                key={fact.id}
                className="group rounded-3xl border border-white/10 bg-white/[0.06] p-7 shadow-xl transition hover:-translate-y-1 hover:bg-white/[0.09]"
              >

                {/* CATEGORY + EMOJI */}

                <div className="mb-6 flex items-center justify-between">

                  <span className="rounded-full bg-green-500/20 px-3 py-1 text-xs font-bold text-green-300">
                    {fact.category}
                  </span>

                  <span className="text-4xl">
                    {fact.emoji}
                  </span>

                </div>


                {/* TITLE */}

                <p className="mb-4 text-sm font-bold uppercase tracking-widest text-green-400">
                  🤯 Did You Know?
                </p>


                {/* FACT */}

                <h3 className="text-2xl font-black leading-relaxed">
                  {fact.fact}
                </h3>


                {/* DETAIL */}

                {isExpanded && (

                  <div className="mt-6 rounded-2xl border border-green-400/20 bg-green-400/10 p-5">

                    <p className="text-base leading-7 text-white/80">
                      {fact.detail}
                    </p>

                  </div>

                )}


                {/* BUTTON */}

                <button
                  type="button"
                  onClick={() => toggleFact(fact.id)}
                  className="mt-7 w-full touch-manipulation rounded-2xl bg-gradient-to-r from-green-500 to-emerald-400 px-5 py-4 font-bold text-black transition hover:scale-[1.02] active:scale-[0.98]"
                >
                  {isExpanded
                    ? "🙈 Hide Detail"
                    : "🤯 Tell Me More"}
                </button>

              </article>

            );

          })}

        </div>

      </section>


      {/* ================= BOTTOM CTA ================= */}

      <section className="mx-auto max-w-5xl px-5 pb-20">

        <div className="rounded-3xl border border-green-400/20 bg-gradient-to-r from-green-700/30 to-emerald-500/10 p-8 text-center">

          <div className="text-4xl">
            🌎
          </div>

          <h2 className="mt-4 text-3xl font-black">
            The world is full of surprises!
          </h2>

          <p className="mt-3 text-white/60">
            Keep exploring. You never know what you'll discover next.
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