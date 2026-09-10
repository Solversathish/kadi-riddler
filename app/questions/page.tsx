"use client";

import { useEffect, useMemo, useState } from "react";
import { supabase } from "../supabase/client";

type Riddle = {
  id: number;
  category: string;
  question?: string | null;
  tanglish_question?: string | null;
};

type KadiJoke = {
  id: number;
  category: string;
  tamil_question?: string | null;
  tanglish_question?: string | null;
  english_question?: string | null;
};

type QuestionItem = {
  id: string;
  source: "riddle" | "kadi";
  category: string;
  tamilQuestion?: string;
  tanglishQuestion?: string;
  question: string;
};

const ITEMS_PER_PAGE = 10;

const categories = [
  ["all", "📚 All Questions"],
  ["English", "🇬🇧 English Riddles"],
  ["Tamil", "🇮🇳 Tamil Riddles"],
  ["Funny", "😂 Funny Riddles"],
  ["Logic", "🧠 Logic Riddles"],
  ["Tricky", "🪄 Tricky Riddles"],
  ["Tamil Kadi", "🤣 Tamil Kadi"],
  ["Funny Questions", "😆 Funny Questions"],
  ["Dad Jokes", "👨 Dad Jokes"],
];

export default function QuestionsPage() {
  const [riddles, setRiddles] = useState<Riddle[]>([]);
  const [kadiJokes, setKadiJokes] = useState<KadiJoke[]>([]);
  const [category, setCategory] = useState("all");
  const [page, setPage] = useState(1);
  const [kadiLanguage, setKadiLanguage] = useState<"tamil" | "tanglish">(
    "tamil"
  );
  const [riddleLanguage, setRiddleLanguage] = useState<"tamil" | "tanglish">(
    "tamil"
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      setLoading(true);

      const [riddlesResult, kadiResult] = await Promise.all([
        supabase
          .from("riddles")
          .select("id, category, question, tanglish_question")
          .order("id", { ascending: true }),
        supabase
          .from("kadi_jokes")
          .select(
            "id, category, tamil_question, tanglish_question, english_question"
          )
          .order("id", { ascending: true }),
      ]);

      if (riddlesResult.error || kadiResult.error) {
        setError(
          riddlesResult.error?.message ||
            kadiResult.error?.message ||
            "Unable to load questions."
        );
      } else {
        setRiddles((riddlesResult.data || []) as Riddle[]);
        setKadiJokes((kadiResult.data || []) as KadiJoke[]);
      }

      setLoading(false);
    }

    load();
  }, []);

  const allQuestions = useMemo<QuestionItem[]>(() => {
    const riddleItems = riddles
      .map((r) => ({
        id: `riddle-${r.id}`,
        source: "riddle" as const,
        category: r.category,
        tamilQuestion: (r.question || "").trim(),
        tanglishQuestion: (r.tanglish_question || "").trim(),
        question: (r.question || "").trim(),
      }))
      .filter((x) => x.question);

    const kadiItems = kadiJokes
      .map((j) => {
        const tamilQuestion = (j.tamil_question || "").trim();
        const tanglishQuestion = (j.tanglish_question || "").trim();
        const englishQuestion = (j.english_question || "").trim();

        return {
          id: `kadi-${j.id}`,
          source: "kadi" as const,
          category: j.category,
          tamilQuestion,
          tanglishQuestion,
          question:
            tamilQuestion || tanglishQuestion || englishQuestion || "",
        };
      })
      .filter((x) => x.question);

    return [...riddleItems, ...kadiItems];
  }, [riddles, kadiJokes]);

  const filtered = useMemo(
    () =>
      category === "all"
        ? allQuestions
        : allQuestions.filter(
            (x) => x.category?.toLowerCase() === category.toLowerCase()
          ),
    [allQuestions, category]
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const safePage = Math.min(page, totalPages);

  const visibleQuestions = filtered.slice(
    (safePage - 1) * ITEMS_PER_PAGE,
    safePage * ITEMS_PER_PAGE
  );

  useEffect(() => {
    setPage(1);
  }, [category]);

  function changePage(nextPage: number) {
    if (nextPage < 1 || nextPage > totalPages) return;
    setPage(nextPage);
    window.setTimeout(
      () => window.scrollTo({ top: 0, behavior: "smooth" }),
      0
    );
  }

  const pageNumbers =
    totalPages <= 7
      ? Array.from({ length: totalPages }, (_, i) => i + 1)
      : safePage <= 3
        ? [1, 2, 3, 4, 5, -1, totalPages]
        : safePage >= totalPages - 2
          ? [
              1,
              -1,
              totalPages - 4,
              totalPages - 3,
              totalPages - 2,
              totalPages - 1,
              totalPages,
            ]
          : [
              1,
              -1,
              safePage - 1,
              safePage,
              safePage + 1,
              -1,
              totalPages,
            ];

  const getQuestionText = (item: QuestionItem) => {
    if (item.source === "riddle") {
      if (category === "Tamil" && riddleLanguage === "tanglish") {
        return item.tanglishQuestion || item.tamilQuestion || item.question;
      }

      return item.tamilQuestion || item.question;
    }

    if (kadiLanguage === "tanglish") {
      return item.tanglishQuestion || item.tamilQuestion || item.question;
    }

    return item.tamilQuestion || item.tanglishQuestion || item.question;
  };

  return (
    <main className="min-h-screen bg-[#070b25] text-white">
      {/* HERO */}
      <section className="mx-auto max-w-7xl px-5 pb-8 pt-10 lg:px-8 lg:pt-14">
        <div className="rounded-[2rem] border border-white/10 bg-gradient-to-br from-purple-500/15 via-transparent to-orange-400/10 p-6 shadow-2xl shadow-black/20 sm:p-8 lg:p-10">
          <div className="max-w-3xl">
            <div className="mb-4 inline-flex rounded-full border border-yellow-300/20 bg-yellow-300/10 px-4 py-2 text-sm font-bold text-yellow-300">
              ❓ Questions
            </div>

            <h1 className="text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl">
              Questions Only.{" "}
              <span className="text-yellow-300">No Answers.</span>
            </h1>

            <p className="mt-4 max-w-2xl text-base leading-7 text-white/65 sm:text-lg">
              Test yourself with questions from Kadi Riddler. The answers and
              punchlines are hidden.
            </p>
          </div>
        </div>
      </section>

      {/* CATEGORY FILTERS */}
      <section className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="mb-5 flex gap-3 overflow-x-auto pb-2">
          {categories.map(([value, label]) => (
            <button
              key={value}
              type="button"
              onClick={() => setCategory(value)}
              className={`shrink-0 rounded-full border px-4 py-2.5 text-sm font-bold transition ${
                category === value
                  ? "border-yellow-300/40 bg-yellow-300 text-[#070b25]"
                  : "border-white/10 bg-white/5 text-white/75 hover:bg-white/10 hover:text-white"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* TAMIL LANGUAGE TOGGLES */}
        {category === "Tamil" && (
          <div className="mb-7 flex items-center justify-center">
            <div className="inline-flex rounded-full border border-white/10 bg-white/5 p-1">
              <button
                type="button"
                onClick={() => setRiddleLanguage("tamil")}
                className={`rounded-full px-5 py-2 text-sm font-bold transition ${
                  riddleLanguage === "tamil"
                    ? "bg-yellow-300 text-[#070b25]"
                    : "text-white/65 hover:text-white"
                }`}
              >
                தமிழ்
              </button>

              <button
                type="button"
                onClick={() => setRiddleLanguage("tanglish")}
                className={`rounded-full px-5 py-2 text-sm font-bold transition ${
                  riddleLanguage === "tanglish"
                    ? "bg-yellow-300 text-[#070b25]"
                    : "text-white/65 hover:text-white"
                }`}
              >
                Tanglish
              </button>
            </div>
          </div>
        )}

        {category === "Tamil Kadi" && (
          <div className="mb-7 flex items-center justify-center">
            <div className="inline-flex rounded-full border border-white/10 bg-white/5 p-1">
              <button
                type="button"
                onClick={() => setKadiLanguage("tamil")}
                className={`rounded-full px-5 py-2 text-sm font-bold transition ${
                  kadiLanguage === "tamil"
                    ? "bg-yellow-300 text-[#070b25]"
                    : "text-white/65 hover:text-white"
                }`}
              >
                தமிழ்
              </button>

              <button
                type="button"
                onClick={() => setKadiLanguage("tanglish")}
                className={`rounded-full px-5 py-2 text-sm font-bold transition ${
                  kadiLanguage === "tanglish"
                    ? "bg-yellow-300 text-[#070b25]"
                    : "text-white/65 hover:text-white"
                }`}
              >
                Tanglish
              </button>
            </div>
          </div>
        )}
      </section>

      {/* QUESTIONS */}
      <section className="mx-auto max-w-7xl px-5 pb-36 lg:px-8 lg:pb-16">
        {loading ? (
          <div className="rounded-3xl border border-white/10 bg-white/5 p-10 text-center text-white/60">
            Loading questions...
          </div>
        ) : error ? (
          <div className="rounded-3xl border border-red-400/20 bg-red-400/10 p-8 text-center">
            ⚠️ Unable to load questions
            <p className="mt-2 text-sm text-white/50">{error}</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="rounded-3xl border border-white/10 bg-white/5 p-10 text-center">
            🤔 No questions found.
          </div>
        ) : (
          <>
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-black sm:text-2xl">
                  {categories.find(([value]) => value === category)?.[1].replace(
                    /^[^ ]+ /,
                    ""
                  )}
                </h2>
                <p className="mt-1 text-sm text-white/45">
                  {filtered.length} question{filtered.length === 1 ? "" : "s"}
                </p>
              </div>

              <div className="hidden rounded-full bg-white/5 px-4 py-2 text-xs font-bold text-white/45 sm:block">
                Page {safePage} of {totalPages}
              </div>
            </div>

            <div className="space-y-4">
              {visibleQuestions.map((item, index) => (
                <article
                  key={item.id}
                  className="group rounded-3xl border border-white/10 bg-white/[0.045] p-5 transition hover:border-yellow-300/20 hover:bg-white/[0.07] sm:p-6"
                >
                  <div className="flex gap-4 sm:gap-5">
                    <div className="grid size-10 shrink-0 place-items-center rounded-2xl bg-yellow-300/10 text-sm font-black text-yellow-300 sm:size-11">
                      {(safePage - 1) * ITEMS_PER_PAGE + index + 1}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="mb-2 flex flex-wrap gap-2">
                        <span className="rounded-full bg-white/5 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white/40">
                          {item.source === "riddle" ? "Riddle" : "Kadi Joke"}
                        </span>

                        <span className="rounded-full bg-purple-400/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-purple-200/70">
                          {item.category}
                        </span>
                      </div>

                      <p className="text-base font-bold leading-7 text-white sm:text-lg sm:leading-8">
                        {getQuestionText(item)}
                      </p>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            {/* PAGINATION */}
            {totalPages > 1 && (
              <div className="mt-10 flex flex-wrap items-center justify-center gap-2">
                <button
                  type="button"
                  onClick={() => changePage(safePage - 1)}
                  disabled={safePage === 1}
                  className="rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-bold text-white/75 transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-30"
                >
                  ← Previous
                </button>

                {pageNumbers.map((num, index) =>
                  num === -1 ? (
                    <span
                      key={`ellipsis-${index}`}
                      className="px-1 text-white/35"
                    >
                      ...
                    </span>
                  ) : (
                    <button
                      key={num}
                      type="button"
                      onClick={() => changePage(num)}
                      className={`grid size-10 place-items-center rounded-xl border text-sm font-black transition ${
                        num === safePage
                          ? "border-yellow-300/40 bg-yellow-300 text-[#070b25]"
                          : "border-white/10 bg-white/5 text-white/70 hover:bg-white/10 hover:text-white"
                      }`}
                    >
                      {num}
                    </button>
                  )
                )}

                <button
                  type="button"
                  onClick={() => changePage(safePage + 1)}
                  disabled={safePage === totalPages}
                  className="rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-bold text-white/75 transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-30"
                >
                  Next →
                </button>
              </div>
            )}

            {/* GO TO TOP */}
            <div className="mt-8 flex justify-center">
              <button
                type="button"
                onClick={() =>
                  window.scrollTo({ top: 0, behavior: "smooth" })
                }
                className="rounded-full border border-white/10 bg-white/5 px-5 py-2.5 text-sm font-bold text-white/60 transition hover:bg-white/10 hover:text-white"
              >
                ↑ Go To Top
              </button>
            </div>
          </>
        )}
      </section>

      {/* ANSWER NOTE */}
      <section className="fixed bottom-0 left-0 right-0 z-40 border-t border-green-400/20 bg-[#070b25]/95 px-5 py-4 shadow-2xl shadow-black/40 backdrop-blur-xl lg:static lg:border-0 lg:bg-transparent lg:px-5 lg:pb-12 lg:pt-0 lg:shadow-none lg:backdrop-blur-none">
        <div className="mx-auto max-w-4xl rounded-2xl border border-green-400/20 bg-green-400/10 px-5 py-4 text-center">
          <p className="text-sm font-bold text-green-200 sm:text-base">
            💡 Want the answer?
          </p>
          <p className="mt-1 text-xs leading-5 text-white/55 sm:text-sm">
            Just type the question in the search bar above to find its answer.
          </p>
        </div>
      </section>
    </main>
  );
}
