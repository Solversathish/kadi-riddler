"use client";

import { useState } from "react";

const jokes = [
  {
    id: 1,
    category: "Tamil Kadi",
    tamilQuestion: "ஒரு பூனை ஏன் computer-ஐ பயன்படுத்தாது? 🐱💻",
    tanglishQuestion: "Oru poonai yen computer-ai payanpaduthaadhu? 🐱💻",
    englishQuestion: "Why doesn't a cat use a computer? 🐱💻",

    tamilAnswer: "அதுக்கு mouse பிடிக்காது! 🐭😂",
    tanglishAnswer: "Adhukku mouse pidikkaadhu! 🐭😂",
    englishAnswer: "Because it doesn't like the mouse! 🐭😂",
  },

  {
    id: 2,
    category: "Tamil Kadi",
    tamilQuestion: "முட்டை ஏன் பள்ளிக்கூடம் போகாது? 🥚",
    tanglishQuestion: "Muttai yen pallikkoodam pogaadhu? 🥚",
    englishQuestion: "Why doesn't an egg go to school? 🥚",

    tamilAnswer: "அது ஏற்கனவே உடைந்த record! 😂",
    tanglishAnswer: "Adhu yerkanave udaindha record! 😂",
    englishAnswer: "Because it is already a broken record! 😂",
  },

  {
    id: 3,
    category: "English Kadi",
    tamilQuestion: "",
    tanglishQuestion: "",
    englishQuestion: "Why did the bicycle fall over? 🚲",

    tamilAnswer: "",
    tanglishAnswer: "",
    englishAnswer: "Because it was two-tired! 🚲😂",
  },

  {
    id: 4,
    category: "English Kadi",
    tamilQuestion: "",
    tanglishQuestion: "",
    englishQuestion: "Why can't your nose be 12 inches long? 👃",

    tamilAnswer: "",
    tanglishAnswer: "",
    englishAnswer: "Because then it would be a foot! 👃🦶😂",
  },

  {
    id: 5,
    category: "Funny Questions",
    tamilQuestion: "",
    tanglishQuestion: "",
    englishQuestion: "What kind of room has no doors or windows? 🍄",

    tamilAnswer: "",
    tanglishAnswer: "",
    englishAnswer: "A mushroom! 🍄😂",
  },

  {
    id: 6,
    category: "Dad Jokes",
    tamilQuestion: "",
    tanglishQuestion: "",
    englishQuestion: "Why don't eggs tell jokes? 🥚",

    tamilAnswer: "",
    tanglishAnswer: "",
    englishAnswer: "Because they might crack each other up! 🥚😂",
  },
];

const categories = [
  "All",
  "Tamil Kadi",
  "English Kadi",
  "Funny Questions",
  "Dad Jokes",
];

type Language = "Tamil" | "Tanglish" | "English";

export default function KadiJokesPage() {
  const [selectedCategory, setSelectedCategory] = useState("All");

  const [language, setLanguage] =
    useState<Language>("Tanglish");

  const [revealed, setRevealed] = useState<number[]>([]);

  const [menuOpen, setMenuOpen] = useState(false);

  const filteredJokes =
    selectedCategory === "All"
      ? jokes
      : jokes.filter(
          (joke) => joke.category === selectedCategory
        );

  const toggleAnswer = (id: number) => {
    setRevealed((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id]
    );
  };

  const getQuestion = (joke: (typeof jokes)[number]) => {
    if (language === "Tamil") {
      return joke.tamilQuestion || joke.englishQuestion;
    }

    if (language === "Tanglish") {
      return joke.tanglishQuestion || joke.englishQuestion;
    }

    return joke.englishQuestion;
  };

  const getAnswer = (joke: (typeof jokes)[number]) => {
    if (language === "Tamil") {
      return joke.tamilAnswer || joke.englishAnswer;
    }

    if (language === "Tanglish") {
      return joke.tanglishAnswer || joke.englishAnswer;
    }

    return joke.englishAnswer;
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
              className="text-orange-400"
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
                className="rounded-2xl px-5 py-4 font-bold text-white/80 hover:bg-white/10"
              >
                🧩 Riddles
              </a>

              <a
                href="/kadi-jokes"
                onClick={() => setMenuOpen(false)}
                className="rounded-2xl bg-white/10 px-5 py-4 font-bold text-orange-400"
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

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,#6b2a12,transparent_55%)]" />

        <div className="relative mx-auto max-w-5xl px-5 pb-14 pt-20 text-center">

          <div className="mb-5 text-6xl">
            😂
          </div>

          <h1 className="text-5xl font-black tracking-tight md:text-7xl">
            KADI{" "}
            <span className="text-orange-400">
              CORNER!
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-white/70">
            Warning: These jokes may be terrible.
            That's exactly why they're funny! 😆
          </p>

        </div>

      </section>

      {/* ================= LANGUAGE SELECTOR ================= */}

      <section className="mx-auto max-w-7xl px-5 pb-6">

        <div className="rounded-3xl border border-orange-400/20 bg-white/[0.05] p-5">

          <div className="mb-4 text-center">

            <p className="text-xs font-black uppercase tracking-widest text-orange-400">
              Choose Language
            </p>

            <p className="mt-1 text-sm text-white/50">
              Tamil jokes are also available in Tanglish
            </p>

          </div>

          <div className="flex flex-wrap justify-center gap-3">

            <button
              type="button"
              onClick={() => setLanguage("Tamil")}
              className={`touch-manipulation rounded-full px-6 py-3 text-sm font-bold transition ${
                language === "Tamil"
                  ? "bg-orange-400 text-black shadow-lg shadow-orange-400/20"
                  : "bg-white/10 text-white hover:bg-white/20"
              }`}
            >
              🇮🇳 Tamil
            </button>

            <button
              type="button"
              onClick={() => setLanguage("Tanglish")}
              className={`touch-manipulation rounded-full px-6 py-3 text-sm font-bold transition ${
                language === "Tanglish"
                  ? "bg-orange-400 text-black shadow-lg shadow-orange-400/20"
                  : "bg-white/10 text-white hover:bg-white/20"
              }`}
            >
              🔤 Tanglish
            </button>

            <button
              type="button"
              onClick={() => setLanguage("English")}
              className={`touch-manipulation rounded-full px-6 py-3 text-sm font-bold transition ${
                language === "English"
                  ? "bg-orange-400 text-black shadow-lg shadow-orange-400/20"
                  : "bg-white/10 text-white hover:bg-white/20"
              }`}
            >
              🇬🇧 English
            </button>

          </div>

        </div>

      </section>

      {/* ================= CATEGORIES ================= */}

      <section className="mx-auto max-w-7xl px-5">

        <div className="flex flex-wrap justify-center gap-3">

          {categories.map((category) => (

            <button
              key={category}
              type="button"
              onClick={() =>
                setSelectedCategory(category)
              }
              className={`touch-manipulation rounded-full px-5 py-3 text-sm font-bold transition ${
                selectedCategory === category
                  ? "bg-orange-400 text-black shadow-lg shadow-orange-400/20"
                  : "bg-white/10 text-white hover:bg-white/20"
              }`}
            >
              {category}
            </button>

          ))}

        </div>

      </section>

      {/* ================= JOKE CARDS ================= */}

      <section className="mx-auto max-w-7xl px-5 py-14">

        <div className="mb-8 flex items-end justify-between">

          <div>

            <p className="mb-2 text-sm font-bold uppercase tracking-widest text-orange-400">
              Prepare to cringe
            </p>

            <h2 className="text-3xl font-black md:text-4xl">
              {selectedCategory === "All"
                ? "All Kadi Jokes"
                : selectedCategory}
            </h2>

          </div>

          <span className="rounded-full bg-white/10 px-4 py-2 text-sm text-white/60">
            {filteredJokes.length} jokes
          </span>

        </div>

        <div className="grid gap-6 md:grid-cols-2">

          {filteredJokes.map((joke) => {

            const isRevealed =
              revealed.includes(joke.id);

            return (

              <article
                key={joke.id}
                className="group rounded-3xl border border-white/10 bg-white/[0.06] p-7 shadow-xl transition hover:-translate-y-1 hover:bg-white/[0.09]"
              >

                {/* CATEGORY */}

                <div className="mb-6 flex items-center justify-between">

                  <span className="rounded-full bg-orange-500/20 px-3 py-1 text-xs font-bold text-orange-300">
                    {joke.category}
                  </span>

                  <span className="text-2xl">
                    😂
                  </span>

                </div>

                {/* THINKING ICON */}

                <div className="mb-6 text-4xl">
                  🤔
                </div>

                {/* QUESTION */}

                <h3 className="min-h-[100px] text-2xl font-bold leading-relaxed">

                  {getQuestion(joke)}

                </h3>

                {/* ANSWER */}

                {isRevealed && (

                  <div className="mt-6 rounded-2xl border border-orange-400/20 bg-orange-400/10 p-5">

                    <p className="text-xs font-bold uppercase tracking-widest text-orange-400">

                      😂 Punchline

                    </p>

                    <p className="mt-2 text-xl font-black">

                      {getAnswer(joke)}

                    </p>

                  </div>

                )}

                {/* REVEAL BUTTON */}

                <button
                  type="button"
                  onClick={() =>
                    toggleAnswer(joke.id)
                  }
                  className="mt-7 w-full touch-manipulation rounded-2xl bg-gradient-to-r from-orange-500 to-yellow-400 px-5 py-4 font-bold text-black transition hover:scale-[1.02] active:scale-[0.98]"
                >

                  {isRevealed
                    ? "🙈 Hide Punchline"
                    : "😂 Reveal Punchline"}

                </button>

              </article>

            );
          })}

        </div>

      </section>

      {/* ================= BOTTOM CTA ================= */}

      <section className="mx-auto max-w-5xl px-5 pb-20">

        <div className="rounded-3xl border border-orange-400/20 bg-gradient-to-r from-orange-700/30 to-yellow-500/10 p-8 text-center">

          <div className="text-4xl">
            🤣
          </div>

          <h2 className="mt-4 text-3xl font-black">
            Warning: Side effects may include laughing!
          </h2>

          <p className="mt-3 text-white/60">
            More terrible jokes are coming. You've been warned.
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