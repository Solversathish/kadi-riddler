"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { supabase } from "../supabase/client";

type Joke = {
  id: number;
  category: string;

  question: string | null;
  tanglish_question: string | null;
  english_question: string | null;

  answer: string | null;
  tanglish_answer: string | null;
  english_answer: string | null;

  likes: number | null;
  shares: number | null;
};

const categories = [
  "All",
  "Tamil Kadi",
  "Funny Questions",
  "Dad Jokes",
];

/* =========================================================
   MAIN KADI JOKES CONTENT
   ========================================================= */

function KadiJokesContent() {
  const searchParams = useSearchParams();

  // ============================================================
  // GLOBAL SEARCH
  // ============================================================

  const globalSearch = searchParams.get("search") || "";

  const highlightId =
    Number(searchParams.get("highlight")) || null;

  const [jokes, setJokes] = useState<Joke[]>([]);

  const [selectedCategory, setSelectedCategory] =
    useState("All");

  const [revealed, setRevealed] =
    useState<number[]>([]);

  // ONLY TWO LANGUAGES
  const [language, setLanguage] =
    useState<"Tamil" | "Tanglish">("Tamil");

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [likedJokes, setLikedJokes] =
    useState<number[]>([]);

  const [sharingJokes, setSharingJokes] =
    useState<number[]>([]);

  // ============================================================
  // LOAD JOKES
  // ============================================================

  const loadJokes = async () => {
    setLoading(true);
    setError("");

    const { data, error } = await supabase
      .from("kadi_jokes")
      .select("*")
      .order("id", {
        ascending: true,
      });

    if (error) {
      console.error(
        "Error loading kadi jokes:",
        error
      );

      setError(
        error.message ||
          "Unable to load jokes."
      );

      setLoading(false);

      return;
    }

    setJokes(data || []);
    setLoading(false);
  };

  useEffect(() => {
    loadJokes();
  }, []);

  // ============================================================
  // FILTER JOKES
  // ============================================================

  const filteredJokes =
    selectedCategory === "All"
      ? jokes
      : jokes.filter(
          (joke) =>
            joke.category ===
            selectedCategory
        );

  // ============================================================
  // GLOBAL SEARCH
  //
  // Move matching joke to the top.
  // Keep all other jokes underneath.
  // ============================================================

  const orderedJokes = useMemo(() => {
    if (!highlightId) {
      return filteredJokes;
    }

    const highlighted =
      filteredJokes.find(
        (joke) =>
          joke.id === highlightId
      );

    if (!highlighted) {
      return filteredJokes;
    }

    return [
      highlighted,
      ...filteredJokes.filter(
        (joke) =>
          joke.id !== highlightId
      ),
    ];
  }, [
    filteredJokes,
    highlightId,
  ]);

  // ============================================================
  // SCROLL TO MATCHING RESULT
  // ============================================================

  useEffect(() => {
    if (!highlightId) {
      return;
    }

    const timer = setTimeout(() => {
      const element =
        document.getElementById(
          `kadi-joke-${highlightId}`
        );

      if (element) {
        element.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }
    }, 500);

    return () => {
      clearTimeout(timer);
    };
  }, [
    highlightId,
    orderedJokes,
  ]);

  // ============================================================
  // REVEAL / HIDE ANSWER
  // ============================================================

  const toggleAnswer = (
    id: number
  ) => {
    setRevealed((current) =>
      current.includes(id)
        ? current.filter(
            (item) => item !== id
          )
        : [...current, id]
    );
  };

  // ============================================================
  // GET QUESTION
  //
  // Tamil mode -> Tamil question
  // Tanglish mode -> Tanglish question
  // ============================================================

  const getQuestion = (
    joke: Joke
  ) => {
    if (language === "Tamil") {
      return (
        joke.question ||
        "தமிழ் கேள்வி கிடைக்கவில்லை"
      );
    }

    return (
      joke.tanglish_question ||
      "Tanglish question not available"
    );
  };

  // ============================================================
  // GET ANSWER
  //
  // Tamil mode -> Tamil answer
  // Tanglish mode -> Tanglish answer
  // ============================================================

  const getAnswer = (
    joke: Joke
  ) => {
    if (language === "Tamil") {
      return (
        joke.answer ||
        "தமிழ் பதில் கிடைக்கவில்லை"
      );
    }

    return (
      joke.tanglish_answer ||
      "Tanglish answer not available"
    );
  };

  // ============================================================
  // LIKE
  // ============================================================

  const handleLike = async (
    id: number
  ) => {
    if (likedJokes.includes(id)) {
      return;
    }

    const joke = jokes.find(
      (item) => item.id === id
    );

    if (!joke) {
      return;
    }

    const currentLikes =
      joke.likes || 0;

    const newLikes =
      currentLikes + 1;

    // Update UI immediately
    setJokes((current) =>
      current.map((item) =>
        item.id === id
          ? {
              ...item,
              likes: newLikes,
            }
          : item
      )
    );

    setLikedJokes((current) => [
      ...current,
      id,
    ]);

    // Update Supabase
    const { error } =
      await supabase
        .from("kadi_jokes")
        .update({
          likes: newLikes,
        })
        .eq("id", id);

    if (error) {
      console.error(
        "Error updating likes:",
        error
      );

      // Revert UI
      setJokes((current) =>
        current.map((item) =>
          item.id === id
            ? {
                ...item,
                likes: currentLikes,
              }
            : item
        )
      );

      setLikedJokes((current) =>
        current.filter(
          (item) => item !== id
        )
      );
    }
  };

  // ============================================================
  // SHARE
  // ============================================================

  const handleShare = async (
    joke: Joke
  ) => {
    if (
      sharingJokes.includes(
        joke.id
      )
    ) {
      return;
    }

    setSharingJokes((current) => [
      ...current,
      joke.id,
    ]);

    const question =
      getQuestion(joke);

    const answer =
      getAnswer(joke);

    const shareText =
      `${question}\n\n😂 ${answer}`;

    try {
      // Mobile / supported browsers
      if (navigator.share) {
        await navigator.share({
          title: "Kadi Riddler",
          text: shareText,
          url: window.location.href,
        });
      } else {
        // Desktop fallback
        await navigator.clipboard.writeText(
          shareText
        );

        alert(
          "Joke copied to clipboard! 😂"
        );
      }

      // Update share count
      const currentShares =
        joke.shares || 0;

      const newShares =
        currentShares + 1;

      setJokes((current) =>
        current.map((item) =>
          item.id === joke.id
            ? {
                ...item,
                shares: newShares,
              }
            : item
        )
      );

      const { error } =
        await supabase
          .from("kadi_jokes")
          .update({
            shares: newShares,
          })
          .eq(
            "id",
            joke.id
          );

      if (error) {
        console.error(
          "Error updating shares:",
          error
        );
      }
    } catch (error) {
      console.log(
        "Share cancelled:",
        error
      );
    } finally {
      setSharingJokes(
        (current) =>
          current.filter(
            (item) =>
              item !== joke.id
          )
      );
    }
  };

  // ============================================================
  // PAGE
  // ============================================================

  return (
    <main className="min-h-screen bg-[#07091f] text-white">

      {/* ======================================================
          HERO
      ====================================================== */}

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
            Warning: These jokes may be
            terrible. That's exactly why
            they're funny! 😆
          </p>

        </div>

      </section>

      {/* ======================================================
          CATEGORIES
      ====================================================== */}

      <section className="mx-auto max-w-7xl px-5">

        <div className="flex flex-wrap justify-center gap-3">

          {categories.map(
            (category) => (

              <button
                key={category}
                type="button"
                onClick={() =>
                  setSelectedCategory(
                    category
                  )
                }
                className={`rounded-full px-5 py-3 text-sm font-bold transition ${
                  selectedCategory ===
                  category
                    ? "bg-orange-400 text-black shadow-lg shadow-orange-400/20"
                    : "bg-white/10 text-white hover:bg-white/20"
                }`}
              >
                {category}
              </button>

            )
          )}

        </div>

      </section>

      {/* ======================================================
          JOKES
      ====================================================== */}

      <section className="mx-auto max-w-7xl px-5 py-14">

        {/* Heading */}

        <div className="mb-8 flex items-end justify-between">

          <div>

            <p className="mb-2 text-sm font-bold uppercase tracking-widest text-orange-400">
              Prepare to cringe
            </p>

            <h2 className="text-3xl font-black md:text-4xl">
              {selectedCategory ===
              "All"
                ? "All Kadi Jokes"
                : selectedCategory}
            </h2>

          </div>

          <span className="rounded-full bg-white/10 px-4 py-2 text-sm text-white/60">
            {orderedJokes.length} jokes
          </span>

        </div>

        {/* ====================================================
            GLOBAL SEARCH RESULT
        ==================================================== */}

        {globalSearch && (

          <div className="mb-8 rounded-2xl border border-orange-400/20 bg-orange-400/10 px-5 py-4">

            <p className="text-sm text-white/60">
              Search result for
            </p>

            <p className="mt-1 text-lg font-bold text-orange-300">
              "{globalSearch}"
            </p>

          </div>

        )}

        {/* ====================================================
            LOADING
        ==================================================== */}

        {loading && (

          <div className="rounded-3xl border border-white/10 bg-white/[0.06] p-16 text-center">

            <div className="mb-5 animate-bounce text-5xl">
              😂
            </div>

            <h3 className="text-2xl font-bold">
              Loading jokes...
            </h3>

            <p className="mt-2 text-white/50">
              Getting the terrible jokes ready!
            </p>

          </div>

        )}

        {/* ====================================================
            ERROR
        ==================================================== */}

        {!loading && error && (

          <div className="rounded-3xl border border-red-400/20 bg-red-400/10 p-16 text-center">

            <div className="mb-5 text-5xl">
              😵
            </div>

            <h3 className="text-2xl font-bold">
              Something went wrong
            </h3>

            <p className="mt-3 text-white/60">
              {error}
            </p>

            <button
              type="button"
              onClick={loadJokes}
              className="mt-7 rounded-2xl bg-orange-400 px-7 py-4 font-bold text-black transition hover:scale-105"
            >
              Try Again
            </button>

          </div>

        )}

        {/* ====================================================
            NO JOKES
        ==================================================== */}

        {!loading &&
          !error &&
          orderedJokes.length ===
            0 && (

          <div className="rounded-3xl border border-white/10 bg-white/[0.06] p-16 text-center">

            <div className="mb-5 text-5xl">
              👀
            </div>

            <h3 className="text-2xl font-bold">
              No jokes found
            </h3>

            <p className="mt-3 text-white/50">
              Try another category.
            </p>

          </div>

        )}

        {/* ====================================================
            JOKE CARDS
        ==================================================== */}

        {!loading &&
          !error &&
          orderedJokes.length >
            0 && (

          <div className="grid gap-6 md:grid-cols-2">

            {orderedJokes.map(
              (joke) => {

                const isRevealed =
                  revealed.includes(
                    joke.id
                  );

                const isTamil =
                  joke.category ===
                  "Tamil Kadi";

                const isHighlighted =
                  highlightId ===
                  joke.id;

                return (

                  <article
                    id={`kadi-joke-${joke.id}`}
                    key={joke.id}
                    className={`group rounded-3xl border p-7 shadow-xl transition hover:-translate-y-1 ${
                      isHighlighted
                        ? "border-orange-400 bg-orange-400/[0.12] shadow-orange-400/20 ring-2 ring-orange-400/60"
                        : "border-white/10 bg-white/[0.06] hover:bg-white/[0.09]"
                    }`}
                  >

                    {/* ==================================================
                        MATCHING RESULT LABEL
                    ================================================== */}

                    {isHighlighted && (

                      <div className="-mx-7 -mt-7 mb-6 rounded-t-3xl bg-orange-400 px-5 py-2 text-center text-sm font-black uppercase tracking-widest text-black">
                        🔍 Matching Result
                      </div>

                    )}

                    {/* ==================================================
                        CATEGORY
                    ================================================== */}

                    <div className="mb-6 flex items-center justify-between">

                      <span className="rounded-full bg-orange-500/20 px-3 py-1 text-xs font-bold text-orange-300">
                        {joke.category}
                      </span>

                      <span className="text-2xl">
                        😂
                      </span>

                    </div>

                    {/* ==================================================
                        LANGUAGE TOGGLE
                    ================================================== */}

                    {isTamil && (

                      <div className="mb-6 flex justify-center">

                        <div className="flex rounded-full border border-white/10 bg-white/[0.06] p-1">

                          {/* TAMIL */}

                          <button
                            type="button"
                            onClick={() =>
                              setLanguage(
                                "Tamil"
                              )
                            }
                            className={`rounded-full px-7 py-2 text-sm font-bold transition ${
                              language ===
                              "Tamil"
                                ? "bg-orange-400 text-black"
                                : "text-white/60 hover:text-white"
                            }`}
                          >
                            தமிழ்
                          </button>

                          {/* TANGLISH */}

                          <button
                            type="button"
                            onClick={() =>
                              setLanguage(
                                "Tanglish"
                              )
                            }
                            className={`rounded-full px-7 py-2 text-sm font-bold transition ${
                              language ===
                              "Tanglish"
                                ? "bg-orange-400 text-black"
                                : "text-white/60 hover:text-white"
                            }`}
                          >
                            Tanglish
                          </button>

                        </div>

                      </div>

                    )}

                    {/* ==================================================
                        QUESTION ICON
                    ================================================== */}

                    <div className="mb-6 text-4xl">
                      🤔
                    </div>

                    {/* ==================================================
                        QUESTION
                    ================================================== */}

                    <h3 className="min-h-[100px] text-2xl font-bold leading-relaxed">

                      {isTamil
                        ? getQuestion(
                            joke
                          )
                        : joke.english_question ||
                          "Question not available"}

                    </h3>

                    {/* ==================================================
                        PUNCHLINE
                    ================================================== */}

                    {isRevealed && (

                      <div className="mt-6 rounded-2xl border border-orange-400/20 bg-orange-400/10 p-5">

                        <p className="text-xs font-bold uppercase tracking-widest text-orange-400">
                          😂 Punchline
                        </p>

                        <p className="mt-2 text-xl font-black">

                          {isTamil
                            ? getAnswer(
                                joke
                              )
                            : joke.english_answer ||
                              "Answer not available"}

                        </p>

                      </div>

                    )}

                    {/* ==================================================
                        REVEAL BUTTON
                    ================================================== */}

                    <button
                      type="button"
                      onClick={() =>
                        toggleAnswer(
                          joke.id
                        )
                      }
                      className="mt-7 w-full rounded-2xl bg-gradient-to-r from-orange-500 to-yellow-400 px-5 py-4 font-bold text-black transition hover:scale-[1.02]"
                    >
                      {isRevealed
                        ? "🙈 Hide Punchline"
                        : "😂 Reveal Punchline"}
                    </button>

                    {/* ==================================================
                        LIKE + SHARE
                    ================================================== */}

                    <div className="mt-5 grid grid-cols-2 gap-3">

                      {/* LIKE */}

                      <button
                        type="button"
                        onClick={() =>
                          handleLike(
                            joke.id
                          )
                        }
                        disabled={likedJokes.includes(
                          joke.id
                        )}
                        className={`rounded-2xl border px-5 py-4 font-bold transition ${
                          likedJokes.includes(
                            joke.id
                          )
                            ? "border-pink-400/30 bg-pink-500/20 text-pink-300"
                            : "border-white/10 bg-white/[0.06] text-white hover:bg-white/10"
                        }`}
                      >

                        {likedJokes.includes(
                          joke.id
                        )
                          ? "❤️ Liked"
                          : "🤍 Like"}{" "}

                        <span className="ml-1 text-white/50">
                          {joke.likes ||
                            0}
                        </span>

                      </button>

                      {/* SHARE */}

                      <button
                        type="button"
                        onClick={() =>
                          handleShare(
                            joke
                          )
                        }
                        disabled={sharingJokes.includes(
                          joke.id
                        )}
                        className="rounded-2xl border border-white/10 bg-white/[0.06] px-5 py-4 font-bold text-white transition hover:bg-white/10"
                      >

                        {sharingJokes.includes(
                          joke.id
                        )
                          ? "⏳ Sharing..."
                          : "🔗 Share"}{" "}

                        <span className="ml-1 text-white/50">
                          {joke.shares ||
                            0}
                        </span>

                      </button>

                    </div>

                  </article>

                );
              }
            )}

          </div>

        )}

      </section>

      {/* ======================================================
          BOTTOM CTA
      ====================================================== */}

      <section className="mx-auto max-w-5xl px-5 pb-20">

        <div className="rounded-3xl border border-orange-400/20 bg-gradient-to-r from-orange-700/30 to-yellow-500/10 p-8 text-center">

          <div className="text-4xl">
            🤣
          </div>

          <h2 className="mt-4 text-3xl font-black">
            Warning: Side effects may
            include laughing!
          </h2>

          <p className="mt-3 text-white/60">
            More terrible jokes are coming.
            You've been warned.
          </p>

        </div>

      </section>

      {/* ======================================================
          FOOTER
      ====================================================== */}

      <footer className="border-t border-white/10 px-5 py-8 text-center text-sm text-white/40">
        © 2026 Kadi Riddler. Think. Laugh.
        Get Tricked. 💜
      </footer>

    </main>
  );
}

/* =========================================================
   SUSPENSE WRAPPER
   IMPORTANT FOR NEXT.JS 16
   ========================================================= */

export default function KadiJokesPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-[#07091f] text-white">
          <div className="flex min-h-screen items-center justify-center">
            <div className="text-center">

              <div className="mb-5 animate-bounce text-5xl">
                😂
              </div>

              <h2 className="text-2xl font-bold">
                Loading Kadi Jokes...
              </h2>

              <p className="mt-2 text-white/50">
                Getting the terrible jokes ready!
              </p>

            </div>
          </div>
        </main>
      }
    >
      <KadiJokesContent />
    </Suspense>
  );
}