"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "../supabase/client";

type Riddle = {
  id: number;
  category: string;
  difficulty: string;

  question: string;
  answer: string;

  // Support both camelCase and snake_case Supabase column names
  tanglishQuestion?: string;
  tanglishAnswer?: string;

  tanglish_question?: string;
  tanglish_answer?: string;

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
  const router = useRouter();
  const searchParams = useSearchParams();

  /*
    Global search comes from the SearchBar/header.

    Example:
    /riddles?search=kaalgal
  */
  const globalSearch = searchParams.get("search") || "";

  /*
    Optional highlighted riddle.
    Used when sharing a particular riddle.
  */
  const highlightId =
    Number(searchParams.get("highlight")) || null;

  /* =========================================================
     STATE
     ========================================================= */

  const [riddles, setRiddles] = useState<Riddle[]>([]);

  const [selectedCategory, setSelectedCategory] =
    useState("All");

  /*
    Local search is kept separately so the page can work
    even if a search input is later added here.
  */
  const [search, setSearch] = useState("");

  /*
    Answers currently revealed.
  */
  const [revealed, setRevealed] =
    useState<number[]>([]);

  /*
    IMPORTANT:
    Language is stored PER RIDDLE.

    Example:
    {
      1: "Tamil",
      2: "Tanglish"
    }
  */
  const [language, setLanguage] = useState<
    Record<number, "Tamil" | "Tanglish">
  >({});

  /*
    Riddles liked by this browser.
  */
  const [liked, setLiked] = useState<number[]>([]);

  /*
    Share loading state.
  */
  const [sharingId, setSharingId] =
    useState<number | null>(null);

  /* =========================================================
     PAGINATION / GO TO TOP
     ========================================================= */

  const ITEMS_PER_PAGE = 10;
  const [currentPage, setCurrentPage] = useState(1);
  const [showGoTop, setShowGoTop] = useState(false);

  /* =========================================================
     LOAD RIDDLES
     ========================================================= */

  useEffect(() => {
    async function loadRiddles() {
      const { data, error } = await supabase
        .from("riddles")
        .select("*")
        .order("id", { ascending: true });

      if (error) {
        console.error(
          "SUPABASE RIDDLES ERROR:",
          error
        );
        return;
      }

      const loadedRiddles = (data || []) as Riddle[];

      setRiddles(loadedRiddles);

      /*
        Set every riddle to Tamil by default.
      */
      const initialLanguages: Record<
        number,
        "Tamil" | "Tanglish"
      > = {};

      loadedRiddles.forEach((riddle) => {
        initialLanguages[riddle.id] = "Tamil";
      });

      setLanguage(initialLanguages);
    }

    loadRiddles();
  }, []);

  /* =========================================================
     LOAD LIKED RIDDLES FROM LOCAL STORAGE
     ========================================================= */

  useEffect(() => {
    try {
      const saved =
        localStorage.getItem(
          "kadi-liked-riddles"
        );

      if (!saved) {
        return;
      }

      const parsed = JSON.parse(saved);

      if (Array.isArray(parsed)) {
        setLiked(parsed);
      }
    } catch {
      // Ignore localStorage errors
    }
  }, []);

  /* =========================================================
     GLOBAL SEARCH
     ========================================================= */

  /*
    If the search bar in the header sends:

      ?search=something

    this updates the page search.

    We also keep local search available.
  */
  useEffect(() => {
    setSearch(globalSearch);
  }, [globalSearch]);


 /* =========================================================
   CATEGORY FILTER
   ---------------------------------------------------------
   IMPORTANT:
   Search should NOT remove other riddles.

   When a global search is used:
   - Keep ALL riddles visible
   - The matching riddle is moved to the top
   - The matching riddle is highlighted
   ========================================================= */

const filteredRiddles = useMemo(() => {
  let result = [...riddles];

  /* -------------------------------------------------------
     CATEGORY FILTER
     ------------------------------------------------------- */

  if (selectedCategory !== "All") {
    result = result.filter(
      (riddle) =>
        (riddle.category || "").toLowerCase() ===
        selectedCategory.toLowerCase()
    );
  }

  return result;
}, [
  riddles,
  selectedCategory,
]);

  /* =========================================================
     MOVE HIGHLIGHTED RIDDLE TO TOP
     ========================================================= */

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

  /* =========================================================
     PAGINATION
     ========================================================= */

  const totalPages = Math.max(
    1,
    Math.ceil(orderedRiddles.length / ITEMS_PER_PAGE)
  );

  const paginatedRiddles = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return orderedRiddles.slice(
      start,
      start + ITEMS_PER_PAGE
    );
  }, [orderedRiddles, currentPage]);

  /* Keep the current page valid when data/category changes. */
  useEffect(() => {
    setCurrentPage((page) =>
      Math.min(page, totalPages)
    );
  }, [totalPages]);

  /* Always start from page 1 when category/search changes. */
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, globalSearch]);

  /* =========================================================
     GO TO TOP BUTTON
     ========================================================= */

  useEffect(() => {
    function handleScroll() {
      setShowGoTop(window.scrollY > 500);
    }

    handleScroll();
    window.addEventListener("scroll", handleScroll, {
      passive: true,
    });

    return () =>
      window.removeEventListener("scroll", handleScroll);
  }, []);

  function scrollToTop() {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  function changePage(page: number) {
    const nextPage = Math.min(
      Math.max(page, 1),
      totalPages
    );

    setCurrentPage(nextPage);
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  /* =========================================================
     PAGINATION NUMBER WINDOW
     ========================================================= */

  const paginationPages = useMemo(() => {
    if (totalPages <= 1) {
      return [1];
    }

    if (totalPages <= 5) {
      return Array.from(
        { length: totalPages },
        (_, index) => index + 1
      );
    }

    /*
      Keep the active page at the start of the visible window.

      Examples:
        Page 1 -> 1 2 3 ... FINAL
        Page 2 -> 2 3 4 ... FINAL
        Page 3 -> 3 4 5 ... FINAL

      Near the end, show the final three pages.
    */
    if (currentPage <= totalPages - 3) {
      return [
        currentPage,
        currentPage + 1,
        currentPage + 2,
        -1,
        totalPages,
      ];
    }

    return [
      totalPages - 2,
      totalPages - 1,
      totalPages,
    ];
  }, [currentPage, totalPages]);

  /* =========================================================
     SCROLL TO HIGHLIGHTED RIDDLE
     ========================================================= */

  useEffect(() => {
    if (!highlightId) {
      return;
    }

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
    }, 500);

    return () => {
      clearTimeout(timer);
    };
  }, [
    highlightId,
    orderedRiddles,
  ]);

  /* =========================================================
     REVEAL / HIDE ANSWER
     ========================================================= */

  function toggleAnswer(id: number) {
    setRevealed((current) => {
      if (current.includes(id)) {
        return current.filter(
          (item) => item !== id
        );
      }

      return [...current, id];
    });
  }

  /* =========================================================
     TAMIL / TANGLISH TOGGLE
     ========================================================= */

  function toggleLanguage(
    id: number,
    selectedLanguage:
      | "Tamil"
      | "Tanglish"
  ) {
    setLanguage((current) => ({
      ...current,
      [id]: selectedLanguage,
    }));
  }

  /* =========================================================
     LIKE
     ========================================================= */

  async function handleLike(
    riddle: Riddle
  ) {
    /*
      Prevent multiple likes from the same browser.
    */
    if (liked.includes(riddle.id)) {
      return;
    }

    const oldLikes = riddle.likes || 0;
    const newLikes = oldLikes + 1;

    /*
      Optimistic UI update.
    */
    setLiked((current) => {
      const updated = [
        ...current,
        riddle.id,
      ];

      try {
        localStorage.setItem(
          "kadi-liked-riddles",
          JSON.stringify(updated)
        );
      } catch {
        // Ignore localStorage errors
      }

      return updated;
    });

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

    /*
      Update Supabase.
    */
    const { error } = await supabase
      .from("riddles")
      .update({
        likes: newLikes,
      })
      .eq("id", riddle.id);

    /*
      If database update fails,
      restore the old number.
    */
    if (error) {
      console.error(
        "LIKE ERROR:",
        error
      );

      setRiddles((current) =>
        current.map((item) =>
          item.id === riddle.id
            ? {
                ...item,
                likes: oldLikes,
              }
            : item
        )
      );

      setLiked((current) => {
        const updated =
          current.filter(
            (id) => id !== riddle.id
          );

        try {
          localStorage.setItem(
            "kadi-liked-riddles",
            JSON.stringify(updated)
          );
        } catch {
          // Ignore
        }

        return updated;
      });
    }
  }

  /* =========================================================
     SHARE
     ========================================================= */

  async function handleShare(
    riddle: Riddle
  ) {
    if (sharingId === riddle.id) {
      return;
    }

    setSharingId(riddle.id);

    try {
      const shareUrl =
        `${window.location.origin}/riddles?highlight=${riddle.id}`;

      const shareText =
        `${riddle.question}\n\nCan you solve this?`;

      /*
        Mobile / supported browser sharing.
      */
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
        /*
          Desktop fallback.
        */
        if (
          navigator.clipboard &&
          navigator.clipboard.writeText
        ) {
          await navigator.clipboard.writeText(
            `${shareText}\n\n${shareUrl}`
          );

          alert(
            "Riddle link copied!"
          );
        }
      }

      /*
        Increase share count.
      */
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

      const { error } =
        await supabase
          .from("riddles")
          .update({
            shares: newShares,
          })
          .eq("id", riddle.id);

      if (error) {
        console.error(
          "SHARE COUNT ERROR:",
          error
        );
      }
    } catch (error) {
      /*
        User cancelled share dialog.
      */
      console.log(
        "Share cancelled/error:",
        error
      );
    } finally {
      setSharingId(null);
    }
  }

  /* =========================================================
     UI
     ========================================================= */

  return (
    <main className="min-h-screen bg-[#07091f] text-white">

      {/* =====================================================
          HERO
      ===================================================== */}

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

      {/* =====================================================
          CATEGORIES
      ===================================================== */}

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

      {/* =====================================================
          RIDDLES
      ===================================================== */}

      <section className="mx-auto max-w-7xl px-5 pb-28 pt-14 md:pb-14">

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

        {/* ===================================================
            SEARCH RESULT MESSAGE
        =================================================== */}

        {search && (
          <div className="mb-8 flex items-center justify-between gap-4 rounded-2xl border border-purple-400/20 bg-purple-400/10 px-5 py-4">
            <div>
              <p className="text-sm text-white/60">
                Search result for
              </p>

              <p className="mt-1 text-lg font-bold text-purple-300">
                "{search}"
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                setSearch("");
                setCurrentPage(1);
                router.replace("/riddles");
                window.scrollTo({
                  top: 0,
                  behavior: "smooth",
                });
              }}
              aria-label="Cancel search"
              className="flex size-10 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/[0.06] text-lg font-bold text-white/70 transition hover:bg-white/10 hover:text-white"
            >
              ×
            </button>
          </div>
        )}

        {/* ===================================================
            RIDDLE CARDS
        =================================================== */}

        <div className="grid gap-6 md:grid-cols-2">

          {paginatedRiddles.map(
            (riddle) => {

              const isRevealed =
                revealed.includes(
                  riddle.id
                );

              const isHighlighted =
                highlightId ===
                riddle.id;

              const isTamil =
                (
                  riddle.category ||
                  ""
                ).toLowerCase() ===
                "tamil";

              /*
                Every riddle defaults to Tamil.
              */
              const currentLanguage =
                language[riddle.id] ||
                "Tamil";

              /*
                Get Tanglish data from either:
                  tanglishQuestion
                OR
                  tanglish_question
              */
              const tanglishQuestion =
                riddle.tanglishQuestion ||
                riddle.tanglish_question ||
                "";

              const tanglishAnswer =
                riddle.tanglishAnswer ||
                riddle.tanglish_answer ||
                "";

              /*
                Determine displayed question.
              */
              const displayedQuestion =
                isTamil &&
                currentLanguage ===
                  "Tanglish"
                  ? tanglishQuestion ||
                    riddle.question
                  : riddle.question;

              /*
                Determine displayed answer.
              */
              const displayedAnswer =
                isTamil &&
                currentLanguage ===
                  "Tanglish"
                  ? tanglishAnswer ||
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

                  {/* =========================================
                      SEARCH MATCH LABEL
                  ========================================= */}

                  {isHighlighted && (
                    <div className="bg-purple-400 px-5 py-2 text-center text-sm font-black uppercase tracking-widest text-black">
                      🔍 Matching Result
                    </div>
                  )}

                  <div className="p-7">

                    {/* =======================================
                        CATEGORY
                    ======================================= */}

                    <div className="mb-6 flex items-center justify-between">

                      <span className="rounded-full bg-purple-500/20 px-3 py-1 text-xs font-bold text-purple-300">
                        {riddle.category}
                      </span>

                      <span className="text-2xl">
                        🧩
                      </span>

                    </div>

                    {/* =======================================
                        TAMIL / TANGLISH
                    ======================================= */}

                    {isTamil && (
                      <div className="mb-6 flex justify-center">

                        <div className="flex rounded-full border border-white/10 bg-white/[0.06] p-1">

                          {/* TAMIL BUTTON */}

                          <button
                            type="button"
                            onClick={() =>
                              toggleLanguage(
                                riddle.id,
                                "Tamil"
                              )
                            }
                            className={`rounded-full px-5 py-2 text-sm font-bold transition ${
                              currentLanguage ===
                              "Tamil"
                                ? "bg-purple-400 text-black"
                                : "text-white/60 hover:text-white"
                            }`}
                          >
                            தமிழ்
                          </button>

                          {/* TANGLISH BUTTON */}

                          <button
                            type="button"
                            onClick={() =>
                              toggleLanguage(
                                riddle.id,
                                "Tanglish"
                              )
                            }
                            className={`rounded-full px-5 py-2 text-sm font-bold transition ${
                              currentLanguage ===
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

                    {/* =======================================
                        QUESTION ICON
                    ======================================= */}

                    <div className="mb-6 text-4xl">
                      🤔
                    </div>

                    {/* =======================================
                        QUESTION
                    ======================================= */}

                    <h3 className="min-h-[100px] text-2xl font-bold leading-relaxed">
                      {displayedQuestion}
                    </h3>

                    {/* =======================================
                        ANSWER
                    ======================================= */}

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

                    {/* =======================================
                        REVEAL BUTTON
                    ======================================= */}

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

                  {/* =========================================
                      CARD ACTIONS
                  ========================================= */}

                  <div className="border-t border-white/10 px-6 py-5">

                    <div className="grid grid-cols-2 gap-3">

                      {/* =====================================
                          LIKE
                      ===================================== */}

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

                      {/* =====================================
                          SHARE
                      ===================================== */}

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

        {/* ===================================================
            PAGINATION
        =================================================== */}

        {totalPages > 1 && (
          <>
            {/* Desktop pagination */}
            <div className="mt-10 hidden items-center justify-center gap-2 md:flex">
              <button
                type="button"
                onClick={() => changePage(currentPage - 1)}
                disabled={currentPage === 1}
                className="rounded-xl border border-white/10 bg-white/[0.06] px-4 py-3 text-sm font-bold text-white transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-30"
              >
                ← Previous
              </button>

              {paginationPages.map((page, index) =>
                page === -1 ? (
                  <span
                    key={`ellipsis-${index}`}
                    className="px-2 text-white/40"
                  >
                    ...
                  </span>
                ) : (
                  <button
                    key={page}
                    type="button"
                    onClick={() => changePage(page)}
                    className={`min-w-11 rounded-xl px-4 py-3 text-sm font-bold transition ${
                      currentPage === page
                        ? "bg-purple-400 text-black shadow-lg shadow-purple-400/20"
                        : "border border-white/10 bg-white/[0.06] text-white hover:bg-white/10"
                    }`}
                  >
                    {page}
                  </button>
                )
              )}

              <button
                type="button"
                onClick={() => changePage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="rounded-xl border border-white/10 bg-white/[0.06] px-4 py-3 text-sm font-bold text-white transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-30"
              >
                Next →
              </button>
            </div>

            {/* Mobile fixed pagination */}
            <div className="fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-[#07091f]/90 px-3 py-3 backdrop-blur-xl md:hidden">
              <div className="mx-auto flex max-w-xl items-center justify-center gap-1.5">
                <button
                  type="button"
                  onClick={() => changePage(currentPage - 1)}
                  disabled={currentPage === 1}
                  aria-label="Previous page"
                  className="rounded-xl border border-white/10 bg-white/[0.06] px-3 py-2.5 text-sm font-bold text-white transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-30"
                >
                  ←
                </button>

                {paginationPages.map((page, index) =>
                  page === -1 ? (
                    <span
                      key={`mobile-ellipsis-${index}`}
                      className="px-1 text-sm text-white/40"
                    >
                      ...
                    </span>
                  ) : (
                    <button
                      key={`mobile-${page}`}
                      type="button"
                      onClick={() => changePage(page)}
                      className={`min-w-9 rounded-xl px-2.5 py-2.5 text-sm font-bold transition ${
                        currentPage === page
                          ? "bg-purple-400 text-black"
                          : "border border-white/10 bg-white/[0.06] text-white hover:bg-white/10"
                      }`}
                    >
                      {page}
                    </button>
                  )
                )}

                <button
                  type="button"
                  onClick={() => changePage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  aria-label="Next page"
                  className="rounded-xl border border-white/10 bg-white/[0.06] px-3 py-2.5 text-sm font-bold text-white transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-30"
                >
                  →
                </button>
              </div>
            </div>
          </>
        )}

        {/* ===================================================
            NO RESULTS
        =================================================== */}

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

      {/* =====================================================
          CTA
      ===================================================== */}

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

      {/* =====================================================
          FOOTER
      ===================================================== */}

      <footer className="border-t border-white/10 px-5 py-8 text-center text-sm text-white/40">
        © 2026 Kadi Riddler. Think.
        Laugh. Get Tricked. 💜
      </footer>

      {/* =====================================================
          GO TO TOP
      ===================================================== */}

      {showGoTop && (
        <button
          type="button"
          onClick={scrollToTop}
          aria-label="Go to top"
          className="fixed bottom-20 right-4 z-50 flex size-12 items-center justify-center rounded-full border border-purple-400/30 bg-purple-400 text-xl font-black text-black shadow-xl shadow-purple-400/20 transition hover:scale-105 md:bottom-6 md:right-6"
        >
          ↑
        </button>
      )}

    </main>
  );
}