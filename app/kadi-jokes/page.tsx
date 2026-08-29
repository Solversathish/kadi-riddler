"use client";

import { useState } from "react";
import SearchBar from "../components/SearchBar";

const jokes = [
  {
    id: 1,
    category: "Tamil Kadi",
    question: "ஒரு பூனை ஏன் computer-ஐ பயன்படுத்தாது? 🐱💻",
    answer: "அதுக்கு mouse பிடிக்காது! 🐭😂",
    tanglishQuestion:
      "Oru poonai yen computer-ai payanpaduthaadhu? 🐱💻",
    tanglishAnswer:
      "Adhukku mouse pidikkaadhu! 🐭😂",
  },
  {
    id: 2,
    category: "Tamil Kadi",
    question: "முட்டை ஏன் பள்ளிக்கூடம் போகாது? 🥚",
    answer: "அது already broken record! 😂",
    tanglishQuestion:
      "Muttai yen pallikkoodam pogaadhu? 🥚",
    tanglishAnswer:
      "Adhu already broken record! 😂",
  },
  {
    id: 3,
    category: "Funny Questions",
    question: "What kind of room has no doors or windows?",
    answer: "A mushroom! 🍄😂",
  },
  {
    id: 4,
    category: "Dad Jokes",
    question: "Why don't eggs tell jokes?",
    answer: "Because they might crack each other up! 🥚😂",
  },
  {
    id: 5,
    category: "Funny Questions",
    question: "Why did the math book look sad?",
    answer: "Because it had too many problems! 📚😂",
  },
  {
    id: 6,
    category: "Dad Jokes",
    question: "Why did the bicycle fall over?",
    answer: "Because it was two-tired! 🚲😂",
  },
];

const categories = [
  "All",
  "Tamil Kadi",
  "Funny Questions",
  "Dad Jokes",
];

export default function KadiJokesPage() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [revealed, setRevealed] = useState<number[]>([]);
  const [menuOpen, setMenuOpen] = useState(false);

  const [tamilLanguage, setTamilLanguage] = useState<
    "Tamil" | "Tanglish"
  >("Tamil");

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

  return (
    <main className="min-h-screen bg-[#07091f] text-white">

      {/* Header */}
      

      {/* Hero */}
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

      {/* Categories */}
      <section className="mx-auto max-w-7xl px-5">

        <div className="flex flex-wrap justify-center gap-3">

          {categories.map((category) => (
            <button
              key={category}
              type="button"
              onClick={() =>
                setSelectedCategory(category)
              }
              className={`rounded-full px-5 py-3 text-sm font-bold transition ${
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

      {/* Joke Cards */}
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

            const isTamil =
              joke.category === "Tamil Kadi";

            const displayedQuestion =
              isTamil &&
              tamilLanguage === "Tanglish"
                ? joke.tanglishQuestion
                : joke.question;

            const displayedAnswer =
              isTamil &&
              tamilLanguage === "Tanglish"
                ? joke.tanglishAnswer
                : joke.answer;

            return (
              <article
                key={joke.id}
                className="group rounded-3xl border border-white/10 bg-white/[0.06] p-7 shadow-xl transition hover:-translate-y-1 hover:bg-white/[0.09]"
              >

                {/* Category */}
                <div className="mb-6 flex items-center justify-between">

                  <span className="rounded-full bg-orange-500/20 px-3 py-1 text-xs font-bold text-orange-300">
                    {joke.category}
                  </span>

                  <span className="text-2xl">
                    😂
                  </span>

                </div>

                {/* Tamil / Tanglish Toggle */}
                {isTamil && (
                  <div className="mb-6 flex justify-center">

                    <div className="flex rounded-full border border-white/10 bg-white/[0.06] p-1">

                      <button
                        type="button"
                        onClick={() =>
                          setTamilLanguage("Tamil")
                        }
                        className={`rounded-full px-5 py-2 text-sm font-bold transition ${
                          tamilLanguage === "Tamil"
                            ? "bg-orange-400 text-black"
                            : "text-white/60 hover:text-white"
                        }`}
                      >
                        தமிழ்
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          setTamilLanguage("Tanglish")
                        }
                        className={`rounded-full px-5 py-2 text-sm font-bold transition ${
                          tamilLanguage === "Tanglish"
                            ? "bg-orange-400 text-black"
                            : "text-white/60 hover:text-white"
                        }`}
                      >
                        Tanglish
                      </button>

                    </div>
                  </div>
                )}

                {/* Question Icon */}
                <div className="mb-6 text-4xl">
                  🤔
                </div>

                {/* Question */}
                <h3 className="min-h-[100px] text-2xl font-bold leading-relaxed">
                  {displayedQuestion}
                </h3>

                {/* Punchline */}
                {isRevealed && (
                  <div className="mt-6 rounded-2xl border border-orange-400/20 bg-orange-400/10 p-5">

                    <p className="text-xs font-bold uppercase tracking-widest text-orange-400">
                      😂 Punchline
                    </p>

                    <p className="mt-2 text-xl font-black">
                      {displayedAnswer}
                    </p>

                  </div>
                )}

                {/* Reveal Button */}
                <button
                  type="button"
                  onClick={() =>
                    toggleAnswer(joke.id)
                  }
                  className="mt-7 w-full rounded-2xl bg-gradient-to-r from-orange-500 to-yellow-400 px-5 py-4 font-bold text-black transition hover:scale-[1.02]"
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

      {/* Bottom CTA */}
      <section className="mx-auto max-w-5xl px-5 pb-20">

        <div className="rounded-3xl border border-orange-400/20 bg-gradient-to-r from-orange-700/30 to-yellow-500/10 p-8 text-center">

          <div className="text-4xl">
            🤣
          </div>

          <h2 className="mt-4 text-3xl font-black">
            Warning: Side effects may include laughing!
          </h2>

          <p className="mt-3 text-white/60">
            More terrible jokes are coming.
            You've been warned.
          </p>

        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 px-5 py-8 text-center text-sm text-white/40">
        © 2026 Kadi Riddler. Think. Laugh. Get Tricked. 💜
      </footer>

    </main>
  );
}