"use client";

import { useEffect, useMemo, useState } from "react";
import { supabase } from "../supabase/client";

type Riddle = {
  id: number;
  category: string;
  difficulty: string;
  question: string;
  answer: string;
  tanglish_question?: string | null;
  tanglish_answer?: string | null;
  likes: number;
  shares: number;
  created_at?: string;
};

const CATEGORIES = [
  "All",
  "English",
  "Tamil",
  "Funny",
  "Logic",
  "Tricky",
];

export default function RiddlesPage() {
  const [riddles, setRiddles] = useState<Riddle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [openAnswers, setOpenAnswers] = useState<number[]>([]);
  const [likedRiddles, setLikedRiddles] = useState<number[]>([]);
  const [language, setLanguage] = useState<
    Record<number, "tamil" | "tanglish">
  >({});
  const [sharingId, setSharingId] = useState<number | null>(null);

  // --------------------------------------------------
  // LOAD RIDDLES
  // --------------------------------------------------

  useEffect(() => {
    loadRiddles();

    // Restore liked riddles from browser
    try {
      const saved = localStorage.getItem("kadi-liked-riddles");

      if (saved) {
        setLikedRiddles(JSON.parse(saved));
      }
    } catch {
      // Ignore localStorage errors
    }
  }, []);

  async function loadRiddles() {
    setLoading(true);
    setError("");

    const { data, error } = await supabase
      .from("riddles")
      .select("*")
      .order("id", { ascending: true });

    if (error) {
      console.error("SUPABASE RIDDLES ERROR:", error);
      setError(error.message);
      setLoading(false);
      return;
    }

    setRiddles((data || []) as Riddle[]);
    setLoading(false);
  }

  // --------------------------------------------------
  // SEARCH + CATEGORY FILTER
  // --------------------------------------------------

  const filteredRiddles = useMemo(() => {
    const searchText = search.trim().toLowerCase();

    return riddles.filter((riddle) => {
      const matchesCategory =
        selectedCategory === "All" ||
        riddle.category?.toLowerCase() ===
          selectedCategory.toLowerCase();

      const matchesSearch =
        searchText === "" ||
        riddle.question?.toLowerCase().includes(searchText) ||
        riddle.answer?.toLowerCase().includes(searchText) ||
        riddle.category?.toLowerCase().includes(searchText) ||
        riddle.difficulty?.toLowerCase().includes(searchText);

      return matchesCategory && matchesSearch;
    });
  }, [riddles, search, selectedCategory]);

  // --------------------------------------------------
  // ANSWER
  // --------------------------------------------------

  function toggleAnswer(id: number) {
    setOpenAnswers((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id]
    );
  }

  // --------------------------------------------------
  // TAMIL / TANGLISH TOGGLE
  // --------------------------------------------------

  function toggleLanguage(id: number) {
    setLanguage((current) => ({
      ...current,
      [id]:
        current[id] === "tanglish"
          ? "tamil"
          : "tanglish",
    }));
  }

  // --------------------------------------------------
  // LIKE
  // --------------------------------------------------

  async function handleLike(riddle: Riddle) {
    // Prevent liking the same riddle multiple times
    if (likedRiddles.includes(riddle.id)) {
      return;
    }

    const newLikes = (riddle.likes || 0) + 1;

    // Optimistic UI update
    setRiddles((current) =>
      current.map((item) =>
        item.id === riddle.id
          ? { ...item, likes: newLikes }
          : item
      )
    );

    const newLikedList = [
      ...likedRiddles,
      riddle.id,
    ];

    setLikedRiddles(newLikedList);

    try {
      localStorage.setItem(
        "kadi-liked-riddles",
        JSON.stringify(newLikedList)
      );
    } catch {
      // Ignore localStorage errors
    }

    // Update Supabase
    const { error } = await supabase
      .from("riddles")
      .update({ likes: newLikes })
      .eq("id", riddle.id);

    if (error) {
      console.error("LIKE ERROR:", error);

      // Roll back if database update fails
      setRiddles((current) =>
        current.map((item) =>
          item.id === riddle.id
            ? {
                ...item,
                likes: riddle.likes || 0,
              }
            : item
        )
      );

      const rollbackList = likedRiddles;

      setLikedRiddles(rollbackList);

      try {
        localStorage.setItem(
          "kadi-liked-riddles",
          JSON.stringify(rollbackList)
        );
      } catch {
        // Ignore
      }
    }
  }

  // --------------------------------------------------
  // SHARE
  // --------------------------------------------------

  async function handleShare(riddle: Riddle) {
    setSharingId(riddle.id);

    const shareUrl =
      typeof window !== "undefined"
        ? `${window.location.origin}/riddles#riddle-${riddle.id}`
        : "";

    const shareText = `${riddle.question}\n\nCan you solve this?`;

    try {
      // Native mobile/browser share
      if (
        typeof navigator !== "undefined" &&
        navigator.share
      ) {
        await navigator.share({
          title: "Kadi Riddler",
          text: shareText,
          url: shareUrl,
        });
      } else {
        // Desktop fallback
        await navigator.clipboard.writeText(
          `${shareText}\n\n${shareUrl}`
        );

        alert("Riddle link copied!");
      }

      // Increase share count
      const newShares = (riddle.shares || 0) + 1;

      setRiddles((current) =>
        current.map((item) =>
          item.id === riddle.id
            ? {
                ...item,
                shares: newShares,
              }
            : item
        )
      );

      const { error } = await supabase
        .from("riddles")
        .update({ shares: newShares })
        .eq("id", riddle.id);

      if (error) {
        console.error(
          "SHARE COUNT ERROR:",
          error
        );
      }
    } catch (error) {
      // User cancelled share dialog
      console.log(
        "Share cancelled:",
        error
      );
    } finally {
      setSharingId(null);
    }
  }

  // --------------------------------------------------
  // CATEGORY
  // --------------------------------------------------

  function handleCategory(category: string) {
    setSelectedCategory(category);

    // Clear search when selecting a category
    setSearch("");

    // We do NOT use router.push().
    // This keeps everything on /riddles.
  }

  // --------------------------------------------------
  // CLEAR FILTERS
  // --------------------------------------------------

  function clearFilters() {
    setSearch("");
    setSelectedCategory("All");
  }

  // --------------------------------------------------
  // LOADING
  // --------------------------------------------------

  if (loading) {
    return (
      <main className="min-h-screen bg-[#07091f] text-white">
        <div className="mx-auto flex min-h-screen max-w-6xl items-center justify-center px-6">
          <div className="text-center">

            <div className="mb-5 animate-bounce text-6xl">
              🧩
            </div>

            <h2 className="text-2xl font-bold">
              Loading riddles...
            </h2>

            <p className="mt-2 text-white/50">
              Getting your brain teasers ready
            </p>

          </div>
        </div>
      </main>
    );
  }

  // --------------------------------------------------
  // PAGE
  // --------------------------------------------------

  return (
    <main className="min-h-screen bg-[#07091f] text-white">

      {/* BACKGROUND GLOW */}

      <div className="pointer-events-none fixed inset-0 overflow-hidden">

        <div className="absolute left-1/2 top-0 h-[500px] w-[700px] -translate-x-1/2 rounded-full bg-purple-600/10 blur-[140px]" />

        <div className="absolute right-0 top-[500px] h-[400px] w-[400px] rounded-full bg-pink-500/5 blur-[130px]" />

      </div>

      <div className="relative mx-auto max-w-7xl px-5 pb-20 sm:px-8 lg:px-10">

        {/* ==================================================
            HERO
        ================================================== */}

        <section className="relative overflow-hidden pb-14 pt-20">

          {/* Hero glow */}

          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,#3b176f,transparent_55%)]" />

          <div className="relative mx-auto max-w-5xl px-5 text-center">

            {/* PUZZLE ICON */}

            <div className="mb-5 text-6xl">
              🧩
            </div>

            {/* HERO TITLE */}

            <h1 className="text-5xl font-black tracking-tight sm:text-6xl md:text-7xl">

              RIDDLE{" "}

              <span className="text-yellow-400">
                TIME!
              </span>

            </h1>

            {/* HERO SUBTITLE */}

            <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-white/70">

              Think carefully, trust your brain, and don't let
              these tricky questions fool you!

            </p>

            {/* ==================================================
                SEARCH
            ================================================== */}

            <div className="mx-auto mt-12 max-w-3xl">

              <div className="relative">

                <span className="pointer-events-none absolute left-5 top-1/2 -translate-y-1/2 text-2xl">
                  🔍
                </span>

                <input
                  type="search"
                  value={search}
                  onChange={(event) =>
                    setSearch(event.target.value)
                  }
                  placeholder="Search riddles..."
                  className="w-full rounded-2xl border border-white/10 bg-[#202237] px-14 py-5 text-base font-medium text-white outline-none transition placeholder:text-white/35 focus:border-purple-400/50 focus:ring-4 focus:ring-purple-500/10"
                />

                {search && (
                  <button
                    type="button"
                    onClick={() => setSearch("")}
                    className="absolute right-5 top-1/2 -translate-y-1/2 text-xl text-white/40 transition hover:text-white"
                  >
                    ×
                  </button>
                )}

              </div>

            </div>

            {/* ==================================================
                CATEGORY BUTTONS
            ================================================== */}

            <div className="mt-10 flex flex-wrap justify-center gap-3">

              {CATEGORIES.map((category) => {

                const active =
                  selectedCategory === category;

                return (
                  <button
                    key={category}
                    type="button"
                    onClick={() =>
                      handleCategory(category)
                    }
                    className={`rounded-full px-7 py-3 text-sm font-bold transition-all duration-200 ${
                      active
                        ? "bg-yellow-400 text-black shadow-lg shadow-yellow-400/20"
                        : "bg-[#202237] text-white hover:bg-[#2b2e49] hover:-translate-y-0.5"
                    }`}
                  >
                    {category}
                  </button>
                );

              })}

            </div>

          </div>

        </section>

        {/* ==================================================
            RIDDLES SECTION
        ================================================== */}

        <section className="pt-10">

          {/* TITLE */}

          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">

            <div>

              <p className="mb-2 text-sm font-bold uppercase tracking-[0.15em] text-purple-400">
                CHALLENGE YOUR BRAIN
              </p>

              <h2 className="text-4xl font-black sm:text-5xl">

                {search
                  ? "Search Results"
                  : selectedCategory === "All"
                  ? "All Riddles"
                  : `${selectedCategory} Riddles`}

              </h2>

            </div>

            <div className="self-start rounded-full bg-[#202237] px-5 py-3 text-sm font-semibold text-white/60 sm:self-auto">

              {filteredRiddles.length}{" "}

              {filteredRiddles.length === 1
                ? "riddle"
                : "riddles"}

            </div>

          </div>

          {/* ==================================================
              ERROR
          ================================================== */}

          {error && (
            <div className="mb-10 rounded-3xl border border-red-500/30 bg-red-500/10 p-8 text-center">

              <div className="mb-3 text-4xl">
                ⚠️
              </div>

              <h3 className="text-xl font-bold text-red-300">
                Unable to load riddles
              </h3>

              <p className="mt-3 text-sm text-white/60">
                {error}
              </p>

              <button
                type="button"
                onClick={loadRiddles}
                className="mt-6 rounded-xl bg-red-500 px-6 py-3 font-bold transition hover:bg-red-400"
              >
                🔄 Try Again
              </button>

            </div>
          )}

          {/* ==================================================
              NO RESULTS
          ================================================== */}

          {!error &&
            filteredRiddles.length === 0 && (
              <div className="rounded-3xl border border-white/10 bg-[#15172b] px-6 py-20 text-center">

                <div className="mb-5 text-6xl">
                  🔎
                </div>

                <h3 className="text-2xl font-bold">
                  No riddles found
                </h3>

                <p className="mt-3 text-white/50">
                  Try another search or category.
                </p>

                <button
                  type="button"
                  onClick={clearFilters}
                  className="mt-6 rounded-xl bg-purple-600 px-6 py-3 font-bold transition hover:bg-purple-500"
                >
                  Clear Filters
                </button>

              </div>
            )}

          {/* ==================================================
              RIDDLE GRID
          ================================================== */}

          {!error &&
            filteredRiddles.length > 0 && (
              <section className="grid gap-6 lg:grid-cols-2">

                {filteredRiddles.map(
                  (riddle, index) => {

                    const answerVisible =
                      openAnswers.includes(
                        riddle.id
                      );

                    const alreadyLiked =
                      likedRiddles.includes(
                        riddle.id
                      );

                    const isTamil =
                      riddle.category
                        ?.trim()
                        .toLowerCase() ===
                      "tamil";

                    const isTanglish =
                      language[riddle.id] ===
                      "tanglish";

                    const displayedQuestion =
                      isTamil &&
                      isTanglish &&
                      riddle.tanglish_question
                        ? riddle.tanglish_question
                        : riddle.question;

                    const displayedAnswer =
                      isTamil &&
                      isTanglish &&
                      riddle.tanglish_answer
                        ? riddle.tanglish_answer
                        : riddle.answer;

                    return (
                      <article
                        key={riddle.id}
                        id={`riddle-${riddle.id}`}
                        className="group overflow-hidden rounded-3xl border border-white/10 bg-[#15172b] shadow-xl shadow-black/10 transition duration-300 hover:-translate-y-1 hover:border-purple-400/20 hover:shadow-purple-900/10"
                      >

                        {/* CARD TOP */}

                        <div className="flex items-center justify-between px-6 pt-6">

                          <span className="rounded-full bg-purple-600/25 px-4 py-2 text-xs font-bold text-purple-300">
                            {riddle.category}
                          </span>

                          <span className="text-xs font-bold uppercase tracking-wider text-white/40">
                            {riddle.difficulty}
                          </span>

                        </div>

                        {/* QUESTION */}

                        <div className="px-6 pb-6 pt-5">

                          <div className="mb-4 text-5xl">
                            ❓
                          </div>

                          <div className="mb-2 text-xs font-bold uppercase tracking-widest text-white/25">
                            RIDDLE #{index + 1}
                          </div>

                          <h3 className="text-xl font-bold leading-8 text-white sm:text-2xl">
                            {displayedQuestion}
                          </h3>

                          {/* TAMIL / TANGLISH */}

                          {isTamil &&
                            riddle.tanglish_question &&
                            riddle.tanglish_answer && (
                              <div className="mt-4 inline-flex overflow-hidden rounded-full border border-white/10 bg-[#202237] p-1">

                                <button
                                  type="button"
                                  onClick={() => {
                                    if (
                                      isTanglish
                                    ) {
                                      toggleLanguage(
                                        riddle.id
                                      );
                                    }
                                  }}
                                  className={`rounded-full px-4 py-2 text-sm font-bold transition ${
                                    !isTanglish
                                      ? "bg-yellow-400 text-black"
                                      : "text-white/60 hover:text-white"
                                  }`}
                                >
                                  தமிழ்
                                </button>

                                <button
                                  type="button"
                                  onClick={() => {
                                    if (
                                      !isTanglish
                                    ) {
                                      toggleLanguage(
                                        riddle.id
                                      );
                                    }
                                  }}
                                  className={`rounded-full px-4 py-2 text-sm font-bold transition ${
                                    isTanglish
                                      ? "bg-yellow-400 text-black"
                                      : "text-white/60 hover:text-white"
                                  }`}
                                >
                                  Tanglish
                                </button>

                              </div>
                            )}

                        </div>

                        {/* ANSWER */}

                        <div className="px-6 pb-6">

                          <button
                            type="button"
                            onClick={() =>
                              toggleAnswer(
                                riddle.id
                              )
                            }
                            className={`w-full rounded-2xl px-5 py-4 text-left font-bold transition ${
                              answerVisible
                                ? "bg-purple-600/20 text-purple-200"
                                : "bg-blue-500 hover:bg-blue-500"
                            }`}
                          >

                            <div className="flex items-center justify-between">

                              <span>
                                {answerVisible
                                  ? "💡 Answer"
                                  : "👀 Show Answer"}
                              </span>

                              <span
                                className={`transition-transform ${
                                  answerVisible
                                    ? "rotate-180"
                                    : ""
                                }`}
                              >
                                ↓
                              </span>

                            </div>

                          </button>

                          {answerVisible && (
                            <div className="mt-3 rounded-2xl border border-purple-400/20 bg-purple-500/10 p-5">

                              <p className="text-lg font-bold text-purple-200">
                                {displayedAnswer}
                              </p>

                              {riddle.tanglish_answer && (
                                <p className="mt-3 border-t border-white/10 pt-3 text-sm text-white/50">
                                  {riddle.tanglish_answer}
                                </p>
                              )}

                            </div>
                          )}

                        </div>

                        {/* ==================================================
                            CARD ACTIONS
                        ================================================== */}

                        <div className="flex items-center justify-between border-t border-white/10 px-6 py-5">

                          <div className="flex items-center gap-3">

                            {/* LIKE */}

                            <button
                              type="button"
                              onClick={() =>
                                handleLike(
                                  riddle
                                )
                              }
                              disabled={
                                alreadyLiked
                              }
                              className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold transition ${
                                alreadyLiked
                                  ? "bg-pink-500/15 text-pink-300"
                                  : "bg-[#202237] text-white/60 hover:bg-pink-500/10 hover:text-pink-300"
                              }`}
                            >

                              <span className="text-lg">
                                {alreadyLiked
                                  ? "❤️"
                                  : "🤍"}
                              </span>

                              <span>
                                {riddle.likes ||
                                  0}
                              </span>

                            </button>

                            {/* SHARE */}

                            <button
                              type="button"
                              onClick={() =>
                                handleShare(
                                  riddle
                                )
                              }
                              disabled={
                                sharingId ===
                                riddle.id
                              }
                              className="flex items-center gap-2 rounded-xl bg-[#202237] px-4 py-2.5 text-sm font-bold text-white/60 transition hover:bg-blue-500/10 hover:text-blue-300"
                            >

                              <span className="text-lg">
                                🔗
                              </span>

                              <span>
                                {sharingId ===
                                riddle.id
                                  ? "Sharing..."
                                  : riddle.shares ||
                                    0}
                              </span>

                            </button>

                          </div>

                          {/* NUMBER */}

                          <span className="text-xs font-bold text-white/20">
                            #{riddle.id}
                          </span>

                        </div>

                      </article>
                    );
                  }
                )}

              </section>
            )}

          {/* ==================================================
              BOTTOM CTA
          ================================================== */}

          <section className="mt-20 overflow-hidden rounded-[2rem] border border-purple-400/20 bg-gradient-to-r from-purple-900/60 to-[#191a2c] px-6 py-14 text-center">

            <div className="mb-5 text-5xl">
              🧠
            </div>

            <h2 className="text-3xl font-black sm:text-4xl">
              Think you can solve them all?
            </h2>

            <p className="mx-auto mt-4 max-w-xl text-white/55">
              More riddles, funny questions and brain teasers
              are coming!
            </p>

          </section>

        </section>

      </div>

    </main>
  );
}