"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import SearchBar from "../components/SearchBar";
import { supabase } from "../supabase/client";

type Riddle = {
  id: number;
  category: string;
  difficulty: string;
  question: string;
  answer: string;
  tanglishQuestion?: string;
  tanglishAnswer?: string;
  likes?: number;
  shares?: number;
};

const categories = [
  "All",
  "English",
  "Tamil",
  "Funny",
  "Logic",
  "Tricky",
];

/* =========================================================
   PAGE WRAPPER
   ---------------------------------------------------------
   IMPORTANT:
   useSearchParams() is used inside RiddlesContent.
   Keeping it inside Suspense prevents the Next.js/Vercel
   prerender error.
========================================================= */

export default function RiddlesPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-[#07091f] text-white">
          <div className="flex min-h-screen items-center justify-center">
            <div className="text-lg font-bold text-white/60">
              Loading riddles...
            </div>
          </div>
        </main>
      }
    >
      <RiddlesContent />
    </Suspense>
  );
}

/* =========================================================
   RIDDLES CONTENT
========================================================= */

function RiddlesContent() {
  const searchParams = useSearchParams();

  const globalSearch =
    searchParams.get("search") || "";

  const highlightId =
    Number(searchParams.get("highlight")) || null;

  const [riddles, setRiddles] = useState<Riddle[]>([]);
  const [selectedCategory, setSelectedCategory] =
    useState("All");

  const [search, setSearch] = useState("");

  const [revealed, setRevealed] =
    useState<number[]>([]);

  const [tamilLanguage, setTamilLanguage] =
    useState<"Tamil" | "Tanglish">("Tamil");

  const [liked, setLiked] =
    useState<number[]>([]);

  const [sharingId, setSharingId] =
    useState<number | null>(null);

  // --------------------------------------------------
  // LOAD RIDDLES FROM SUPABASE
  // --------------------------------------------------

  useEffect(() => {
    async function loadRiddles() {
      const { data, error } = await supabase
        .from("riddles")
        .select("*")
        .order("id", { ascending: true });

      if (error) {
        console.error(
          "Error loading riddles:",
          error
        );

        return;
      }

      setRiddles(data || []);
    }

    loadRiddles();
  }, []);

  // --------------------------------------------------
  // APPLY GLOBAL SEARCH TO LOCAL SEARCH
  // --------------------------------------------------

  useEffect(() => {
    if (globalSearch) {
      setSearch(globalSearch);
    }
  }, [globalSearch]);

  // --------------------------------------------------
  // FILTER RIDDLES BY CATEGORY ONLY
  // --------------------------------------------------
  //
  // IMPORTANT:
  // Global search should NOT remove the other riddles.
  // It only moves the matching riddle to the top and
  // highlights it. This keeps all riddles visible,
  // just like the Amazing Facts page.

  const filteredRiddles = useMemo(() => {
    if (selectedCategory === "All") {
      return [...riddles];
    }

    return riddles.filter(
      (riddle) =>
        riddle.category === selectedCategory
    );
  }, [
    riddles,
    selectedCategory,
  ]);

  // --------------------------------------------------
  // MOVE GLOBAL SEARCH RESULT TO TOP
  // --------------------------------------------------

  const orderedRiddles = useMemo(() => {
    if (!highlightId) {
      return filteredRiddles;
    }

    const highlighted = filteredRiddles.find(
      (riddle) =>
        riddle.id === highlightId
    );

    if (!highlighted) {
      return filteredRiddles;
    }

    return [
      highlighted,
      ...filteredRiddles.filter(
        (riddle) =>
          riddle.id !== highlightId
      ),
    ];
  }, [
    filteredRiddles,
    highlightId,
  ]);

  // --------------------------------------------------
  // SCROLL TO GLOBAL SEARCH RESULT
  // --------------------------------------------------

  useEffect(() => {
    if (!highlightId) return;

    const timer = setTimeout(() => {
      const element =
        document.getElementById(
          `riddle-${highlightId}`
        );

      if (element) {
        element.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [
    highlightId,
    orderedRiddles,
  ]);

  // --------------------------------------------------
  // REVEAL ANSWER
  // --------------------------------------------------

  const toggleAnswer = (id: number) => {
    setRevealed((current) =>
      current.includes(id)
        ? current.filter(
            (item) => item !== id
          )
        : [...current, id]
    );
  };

  // --------------------------------------------------
  // LIKE
  // --------------------------------------------------

  const handleLike = async (
    riddle: Riddle
  ) => {
    if (liked.includes(riddle.id)) {
      return;
    }

    setLiked((current) => [
      ...current,
      riddle.id,
    ]);

    const newLikes =
      (riddle.likes || 0) + 1;

    setRiddles((current) =>
      current.map((item) =>
        item.id === riddle.id
          ? {
              ...item,
              likes: newLikes,
            }
          : item
      )
    );

    const { error } = await supabase
      .from("riddles")
      .update({
        likes: newLikes,
      })
      .eq("id", riddle.id);

    if (error) {
      console.error(
        "Error updating like:",
        error
      );
    }
  };

  // --------------------------------------------------
  // SHARE
  // --------------------------------------------------

  const handleShare = async (
    riddle: Riddle
  ) => {
    if (sharingId === riddle.id) {
      return;
    }

    setSharingId(riddle.id);

    try {
      const shareUrl =
        `${window.location.origin}/riddles?highlight=${riddle.id}`;

      if (navigator.share) {
        await navigator.share({
          title: "Kadi Riddler",
          text: riddle.question,
          url: shareUrl,
        });
      } else {
        await navigator.clipboard.writeText(
          shareUrl
        );
      }

      const newShares =
        (riddle.shares || 0) + 1;

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

      await supabase
        .from("riddles")
        .update({
          shares: newShares,
        })
        .eq("id", riddle.id);
    } catch (error) {
      console.error(
        "Share cancelled/error:",
        error
      );
    } finally {
      setSharingId(null);
    }
  };

  // --------------------------------------------------
  // UI
  // --------------------------------------------------

  return (
    <main className="min-h-screen bg-[#07091f] text-white">

      {/* HERO */}

      <section className="relative overflow-hidden">

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,#35206b,transparent_55%)]" />

        <div className="relative mx-auto max-w-5xl px-5 pb-14 pt-20 text-center">

          <div className="mb-5 text-6xl">
            🧩
          </div>

          <h1 className="text-5xl font-black tracking-tight md:text-7xl">
            RIDDLE{" "}
            <span className="text-purple-400">
              TIME!
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-white/70">
            Think carefully. Some are easy,
            some are tricky, and some will
            completely fool you! 🧠
          </p>

        </div>
      </section>

      {/* CATEGORIES */}

      <section className="mx-auto max-w-7xl px-5">

        <div className="flex flex-wrap justify-center gap-3">

          {categories.map((category) => (

            <button
              key={category}
              type="button"
              onClick={() =>
                setSelectedCategory(
                  category
                )
              }
              className={`rounded-full px-5 py-3 text-sm font-bold transition ${
                selectedCategory === category
                  ? "bg-purple-400 text-black shadow-lg shadow-purple-400/20"
                  : "bg-white/10 text-white hover:bg-white/20"
              }`}
            >
              {category}
            </button>

          ))}

        </div>
      </section>

      {/* RIDDLES */}

      <section className="mx-auto max-w-7xl px-5 py-14">

        <div className="mb-8 flex items-end justify-between">

          <div>

            <p className="mb-2 text-sm font-bold uppercase tracking-widest text-purple-400">
              Challenge your brain
            </p>

            <h2 className="text-3xl font-black md:text-4xl">
              {selectedCategory ===
              "All"
                ? "All Riddles"
                : selectedCategory}
            </h2>

          </div>

          <span className="rounded-full bg-white/10 px-4 py-2 text-sm text-white/60">
            {filteredRiddles.length}{" "}
            {filteredRiddles.length === 1
              ? "riddle"
              : "riddles"}
          </span>

        </div>

        {/* SEARCH RESULT MESSAGE */}

        {globalSearch && (
          <div className="mb-8 rounded-2xl border border-purple-400/20 bg-purple-400/10 px-5 py-4">

            <p className="text-sm text-white/60">
              Search result for
            </p>

            <p className="mt-1 text-lg font-bold text-purple-300">
              "{globalSearch}"
            </p>

          </div>
        )}

        {/* CARDS */}

        <div className="grid gap-6 md:grid-cols-2">

          {orderedRiddles.map(
            (riddle) => {

              const isRevealed =
                revealed.includes(
                  riddle.id
                );

              const isHighlighted =
                highlightId ===
                riddle.id;

              const isTamil =
                riddle.category ===
                "Tamil";

              const displayedQuestion =
                isTamil &&
                tamilLanguage ===
                  "Tanglish"
                  ? riddle.tanglishQuestion ||
                    riddle.question
                  : riddle.question;

              const displayedAnswer =
                isTamil &&
                tamilLanguage ===
                  "Tanglish"
                  ? riddle.tanglishAnswer ||
                    riddle.answer
                  : riddle.answer;

              const alreadyLiked =
                liked.includes(
                  riddle.id
                );

              return (

                <article
                  id={`riddle-${riddle.id}`}
                  key={riddle.id}
                  className={`group overflow-hidden rounded-3xl border p-0 shadow-xl transition ${
                    isHighlighted
                      ? "border-purple-400 bg-purple-400/[0.12] shadow-purple-400/20 ring-2 ring-purple-400/60"
                      : "border-white/10 bg-white/[0.06] hover:-translate-y-1 hover:bg-white/[0.09]"
                  }`}
                >

                  {/* SEARCH MATCH LABEL */}

                  {isHighlighted && (
                    <div className="bg-purple-400 px-5 py-2 text-center text-sm font-black uppercase tracking-widest text-black">
                      🔍 Matching Result
                    </div>
                  )}

                  <div className="p-7">

                    {/* CATEGORY */}

                    <div className="mb-6 flex items-center justify-between">

                      <span className="rounded-full bg-purple-500/20 px-3 py-1 text-xs font-bold text-purple-300">
                        {riddle.category}
                      </span>

                      <span className="text-2xl">
                        🧩
                      </span>

                    </div>

                    {/* TAMIL / TANGLISH */}

                    {isTamil && (

                      <div className="mb-6 flex justify-center">

                        <div className="flex rounded-full border border-white/10 bg-white/[0.06] p-1">

                          <button
                            type="button"
                            onClick={() =>
                              setTamilLanguage(
                                "Tamil"
                              )
                            }
                            className={`rounded-full px-5 py-2 text-sm font-bold transition ${
                              tamilLanguage ===
                              "Tamil"
                                ? "bg-purple-400 text-black"
                                : "text-white/60 hover:text-white"
                            }`}
                          >
                            தமிழ்
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              setTamilLanguage(
                                "Tanglish"
                              )
                            }
                            className={`rounded-full px-5 py-2 text-sm font-bold transition ${
                              tamilLanguage ===
                              "Tanglish"
                                ? "bg-purple-400 text-black"
                                : "text-white/60 hover:text-white"
                            }`}
                          >
                            Tanglish
                          </button>

                        </div>

                      </div>
                    )}

                    {/* QUESTION ICON */}

                    <div className="mb-6 text-4xl">
                      🤔
                    </div>

                    {/* QUESTION */}

                    <h3 className="min-h-[100px] text-2xl font-bold leading-relaxed">
                      {displayedQuestion}
                    </h3>

                    {/* ANSWER */}

                    {isRevealed && (

                      <div className="mt-6 rounded-2xl border border-purple-400/20 bg-purple-400/10 p-5">

                        <p className="text-xs font-bold uppercase tracking-widest text-purple-400">
                          💡 Answer
                        </p>

                        <p className="mt-2 text-xl font-black">
                          {displayedAnswer}
                        </p>

                      </div>
                    )}

                    {/* REVEAL */}

                    <button
                      type="button"
                      onClick={() =>
                        toggleAnswer(
                          riddle.id
                        )
                      }
                      className="mt-7 w-full rounded-2xl bg-gradient-to-r from-purple-500 to-pink-400 px-5 py-4 font-bold text-white transition hover:scale-[1.02]"
                    >
                      {isRevealed
                        ? "🙈 Hide Answer"
                        : "💡 Reveal Answer"}
                    </button>

                  </div>

                  {/* CARD ACTIONS */}

                  <div className="border-t border-white/10 px-6 py-5">

                    <div className="grid grid-cols-2 gap-3">

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
                        className={`rounded-2xl border px-5 py-4 font-bold transition ${
                          alreadyLiked
                            ? "border-pink-400/30 bg-pink-500/20 text-pink-300"
                            : "border-white/10 bg-white/[0.06] text-white hover:bg-white/10"
                        }`}
                      >
                        {alreadyLiked
                          ? "❤️ Liked"
                          : "🤍 Like"}{" "}

                        <span className="ml-1 text-white/50">
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
                        className="rounded-2xl border border-white/10 bg-white/[0.06] px-5 py-4 font-bold text-white transition hover:bg-white/10"
                      >
                        {sharingId ===
                        riddle.id
                          ? "⏳ Sharing..."
                          : "🔗 Share"}{" "}

                        <span className="ml-1 text-white/50">
                          {riddle.shares ||
                            0}
                        </span>
                      </button>

                    </div>

                  </div>

                </article>
              );
            }
          )}

        </div>

        {/* NO RESULTS */}

        {filteredRiddles.length ===
          0 && (

          <div className="py-20 text-center">

            <div className="text-6xl">
              🤔
            </div>

            <h3 className="mt-5 text-2xl font-black">
              No riddles found
            </h3>

            <p className="mt-2 text-white/50">
              Try another search or
              category.
            </p>

          </div>
        )}

      </section>

      {/* CTA */}

      <section className="mx-auto max-w-5xl px-5 pb-20">

        <div className="rounded-3xl border border-purple-400/20 bg-gradient-to-r from-purple-700/30 to-pink-500/10 p-8 text-center">

          <div className="text-4xl">
            🧠
          </div>

          <h2 className="mt-4 text-3xl font-black">
            Think you can solve them all?
          </h2>

          <p className="mt-3 text-white/60">
            Keep challenging your brain!
          </p>

        </div>

      </section>

      {/* FOOTER */}

      <footer className="border-t border-white/10 px-5 py-8 text-center text-sm text-white/40">
        © 2026 Kadi Riddler. Think.
        Laugh. Get Tricked. 💜
      </footer>

    </main>
  );
}