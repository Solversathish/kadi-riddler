"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "../supabase/client";

/* =========================================================
   DATABASE TYPE
   ========================================================= */

type Joke = {
  id: number;
  category: string;

  // Tamil Kadi
  tamil_question: string | null;
  tamil_answer: string | null;

  // Tanglish
  tanglish_question: string | null;
  tanglish_answer: string | null;

  // English jokes
  english_question: string | null;
  english_answer: string | null;

  likes: number | null;
  shares: number | null;
};

/* =========================================================
   CATEGORIES
   ========================================================= */

const categories = [
  "All",
  "Tamil Kadi",
  "Funny Questions",
  "Dad Jokes",
];

/* =========================================================
   MAIN CONTENT
   ========================================================= */

function KadiJokesContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  /* =========================================================
     GLOBAL SEARCH
     ========================================================= */

  const globalSearch =
    searchParams.get("search") || "";

  /* =========================================================
     HIGHLIGHTED JOKE
     ========================================================= */

  const highlightId =
    Number(searchParams.get("highlight")) || null;

  /* =========================================================
     STATE
     ========================================================= */

  const [jokes, setJokes] =
    useState<Joke[]>([]);

  const [selectedCategory, setSelectedCategory] =
    useState("All");

  const [revealed, setRevealed] =
    useState<number[]>([]);

  /*
    Tamil Kadi:
      Tamil
      Tanglish

    Other categories:
      English
  */
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

  /* =========================================================
     PAGINATION
     ========================================================= */

  const ITEMS_PER_PAGE = 10;

  const [currentPage, setCurrentPage] =
    useState(1);

  /* =========================================================
     GO TO TOP
     ========================================================= */

  const [showGoToTop, setShowGoToTop] =
    useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowGoToTop(window.scrollY > 500);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  /* =========================================================
     LOAD JOKES
     ========================================================= */

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
        "KADI JOKES LOAD ERROR:",
        error
      );

      setError(
        error.message ||
          "Unable to load jokes."
      );

      setLoading(false);
      return;
    }

    setJokes((data || []) as Joke[]);
    setLoading(false);
  };

  useEffect(() => {
    loadJokes();
  }, []);

  /* =========================================================
     CATEGORY FILTER
     ========================================================= */

  const filteredJokes = useMemo(() => {
    if (selectedCategory === "All") {
      return jokes;
    }

    return jokes.filter(
      (joke) =>
        joke.category ===
        selectedCategory
    );
  }, [
    jokes,
    selectedCategory,
  ]);

  /* =========================================================
     SEARCH / HIGHLIGHT
     
     Same concept as Riddles page:
     - Header search gives highlight ID
     - Matching joke goes to top
     - Other jokes remain visible
     ========================================================= */

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

  /* =========================================================
     PAGINATION CALCULATIONS
     ========================================================= */

  const totalPages = Math.max(
    1,
    Math.ceil(
      orderedJokes.length /
        ITEMS_PER_PAGE
    )
  );

  const safeCurrentPage = Math.min(
    currentPage,
    totalPages
  );

  const paginatedJokes = useMemo(() => {
    const start =
      (safeCurrentPage - 1) *
      ITEMS_PER_PAGE;

    return orderedJokes.slice(
      start,
      start + ITEMS_PER_PAGE
    );
  }, [
    orderedJokes,
    safeCurrentPage,
  ]);

  /*
    Numeric page list only.
    -1 is used only as the visual "..." marker.
    It is never passed to changePage().
  */
  const visiblePageNumbers =
    useMemo(() => {
      if (totalPages <= 5) {
        return Array.from(
          { length: totalPages },
          (_, index) => index + 1
        );
      }

      if (safeCurrentPage <= 3) {
        return [1, 2, 3, 4, -1, totalPages];
      }

      if (safeCurrentPage >= totalPages - 2) {
        return [
          1,
          -1,
          totalPages - 3,
          totalPages - 2,
          totalPages - 1,
          totalPages,
        ];
      }

      return [
        1,
        -1,
        safeCurrentPage - 1,
        safeCurrentPage,
        safeCurrentPage + 1,
        -1,
        totalPages,
      ];
    }, [
      totalPages,
      safeCurrentPage,
    ]);

  const changePage = (page: number) => {
    if (
      page < 1 ||
      page > totalPages ||
      page === safeCurrentPage
    ) {
      return;
    }

    setCurrentPage(page);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  /*
    Keep pagination valid when the category or
    highlighted search result changes.
  */
  useEffect(() => {
    setCurrentPage(1);
  }, [
    selectedCategory,
    highlightId,
  ]);

  /*
    If the number of pages becomes smaller,
    keep the current page inside the valid range.
  */
  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [
    currentPage,
    totalPages,
  ]);

  /* =========================================================
     SCROLL TO HIGHLIGHTED JOKE
     ========================================================= */

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

  /* =========================================================
     REVEAL / HIDE ANSWER
     ========================================================= */

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

  /* =========================================================
     GET QUESTION
     
     IMPORTANT:
     
     Tamil Kadi + Tamil:
       tamil_question
     
     Tamil Kadi + Tanglish:
       tanglish_question
     
     Funny Questions / Dad Jokes:
       english_question
     ========================================================= */

  const getQuestion = (
    joke: Joke
  ) => {
    if (
      joke.category ===
      "Tamil Kadi"
    ) {
      if (language === "Tamil") {
        return (
          joke.tamil_question ||
          "தமிழ் கேள்வி கிடைக்கவில்லை"
        );
      }

      return (
        joke.tanglish_question ||
        "Tanglish question not available"
      );
    }

    return (
      joke.english_question ||
      "Question not available"
    );
  };

  /* =========================================================
     GET ANSWER
     
     IMPORTANT:
     
     Tamil Kadi + Tamil:
       tamil_answer
     
     Tamil Kadi + Tanglish:
       tanglish_answer
     
     Funny Questions / Dad Jokes:
       english_answer
     ========================================================= */

  const getAnswer = (
    joke: Joke
  ) => {
    if (
      joke.category ===
      "Tamil Kadi"
    ) {
      if (language === "Tamil") {
        return (
          joke.tamil_answer ||
          "தமிழ் பதில் கிடைக்கவில்லை"
        );
      }

      return (
        joke.tanglish_answer ||
        "Tanglish answer not available"
      );
    }

    return (
      joke.english_answer ||
      "Answer not available"
    );
  };

  /* =========================================================
     LIKE
     ========================================================= */

  const handleLike = async (
    id: number
  ) => {
    if (
      likedJokes.includes(id)
    ) {
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

    /* -----------------------------------------
       Optimistic UI
       ----------------------------------------- */

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

    /* -----------------------------------------
       Supabase
       ----------------------------------------- */

    const { error } =
      await supabase
        .from("kadi_jokes")
        .update({
          likes: newLikes,
        })
        .eq("id", id);

    /* -----------------------------------------
       Revert if failed
       ----------------------------------------- */

    if (error) {
      console.error(
        "LIKE ERROR:",
        error
      );

      setJokes((current) =>
        current.map((item) =>
          item.id === id
            ? {
                ...item,
                likes:
                  currentLikes,
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

  /* =========================================================
     COPY FALLBACK
     
     Used when navigator.share is unavailable.
     ========================================================= */

  const copyToClipboard = async (
    text: string
  ) => {
    /*
      Modern clipboard API
    */

    if (
      navigator.clipboard &&
      window.isSecureContext
    ) {
      await navigator.clipboard.writeText(
        text
      );

      return true;
    }

    /*
      Older browser fallback
    */

    const textarea =
      document.createElement(
        "textarea"
      );

    textarea.value = text;

    textarea.style.position =
      "fixed";

    textarea.style.left =
      "-9999px";

    textarea.style.top =
      "-9999px";

    document.body.appendChild(
      textarea
    );

    textarea.focus();
    textarea.select();

    let copied = false;

    try {
      copied =
        document.execCommand(
          "copy"
        );
    } catch {
      copied = false;
    }

    document.body.removeChild(
      textarea
    );

    return copied;
  };

  /* =========================================================
     SHARE
     
     IMPORTANT:
     The shared URL points directly to the
     selected Kadi joke.
     
     Example:
     /kadi-jokes?highlight=36
     ========================================================= */

 const handleShare = async (joke: Joke) => {
  if (sharingJokes.includes(joke.id)) {
    return;
  }

  setSharingJokes((current) => [
    ...current,
    joke.id,
  ]);

  try {
    // Direct Kadi-Joke URL
    const shareUrl =
      `${window.location.origin}/kadi-jokes?highlight=${joke.id}`;

    // Get the question in the currently selected language
    const question = getQuestion(joke);

    // IMPORTANT:
    // Do NOT include the answer/punchline.
    const shareText =
      `${question}\n\nCan you solve this?`;

    const fullShareText =
      `${shareText}\n\n${shareUrl}`;

    let shareSuccessful = false;

    // Native share
    if (
      typeof navigator !== "undefined" &&
      typeof navigator.share === "function"
    ) {
      await navigator.share({
        title: "Kadi Riddler",
        text: shareText,
        url: shareUrl,
      });

      shareSuccessful = true;
    } else {
      // Desktop fallback
      const copied =
        await copyToClipboard(fullShareText);

      if (!copied) {
        throw new Error(
          "Unable to copy share link."
        );
      }

      alert(
        "Kadi joke link copied! 😂"
      );

      shareSuccessful = true;
    }

    // Increase share count only after successful sharing
    if (shareSuccessful) {
      const newShares =
        (joke.shares || 0) + 1;

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

      const { error } = await supabase
        .from("kadi_jokes")
        .update({
          shares: newShares,
        })
        .eq("id", joke.id);

      if (error) {
        console.error(
          "SHARE COUNT ERROR:",
          error
        );
      }
    }
  } catch (error) {
    console.log(
      "Share cancelled:",
      error
    );
  } finally {
    setSharingJokes((current) =>
      current.filter(
        (id) => id !== joke.id
      )
    );
  }
};

  /* =========================================================
     CANCEL SEARCH
     ========================================================= */

  const cancelSearch = () => {
    const params = new URLSearchParams(
      window.location.search
    );

    params.delete("search");
    params.delete("highlight");

    const query = params.toString();

    router.replace(
      query
        ? `${window.location.pathname}?${query}`
        : window.location.pathname,
      { scroll: false }
    );

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  /* =========================================================
     PAGE
     ========================================================= */

  return (
    <main className="min-h-screen bg-[#07091f] text-white">

      {/* =====================================================
          HERO
      ===================================================== */}

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

      {/* =====================================================
          CATEGORIES
      ===================================================== */}

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

      {/* =====================================================
          JOKES
      ===================================================== */}

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
            {orderedJokes.length}{" "}
            {orderedJokes.length === 1
              ? "joke"
              : "jokes"}
          </span>

        </div>

        {/* =====================================================
            SEARCH RESULT
        ===================================================== */}

        {globalSearch && (
          <div className="mb-8 flex items-center justify-between gap-4 rounded-2xl border border-orange-400/20 bg-orange-400/10 px-5 py-4">

            <div className="min-w-0">
              <p className="text-sm text-white/60">
                Search result for
              </p>

              <p className="mt-1 truncate text-lg font-bold text-orange-300">
                "{globalSearch}"
              </p>
            </div>

            <button
              type="button"
              onClick={cancelSearch}
              aria-label="Cancel search"
              title="Cancel search"
              className="flex size-11 shrink-0 items-center justify-center rounded-full border border-orange-300/30 bg-black/20 text-2xl font-bold leading-none text-orange-200 transition hover:scale-105 hover:bg-orange-400 hover:text-black"
            >
              ×
            </button>

          </div>
        )}

        {/* =====================================================
            LOADING
        ===================================================== */}

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

        {/* =====================================================
            ERROR
        ===================================================== */}

        {!loading &&
          error && (

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
                onClick={
                  loadJokes
                }
                className="mt-7 rounded-2xl bg-orange-400 px-7 py-4 font-bold text-black transition hover:scale-105"
              >
                Try Again
              </button>

            </div>

          )}

        {/* =====================================================
            NO JOKES
        ===================================================== */}

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

        {/* =====================================================
            JOKE CARDS
        ===================================================== */}

        {!loading &&
          !error &&
          orderedJokes.length >
            0 && (

            <div className="grid gap-6 md:grid-cols-2">

              {paginatedJokes.map(
                (joke) => {

                  const isRevealed =
                    revealed.includes(
                      joke.id
                    );

                  const isTamilKadi =
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

                      {/* =================================================
                          MATCHING RESULT
                      ================================================= */}

                      {isHighlighted && (

                        <div className="-mx-7 -mt-7 mb-6 rounded-t-3xl bg-orange-400 px-5 py-2 text-center text-sm font-black uppercase tracking-widest text-black">
                          🔍 Matching Result
                        </div>

                      )}

                      {/* =================================================
                          CATEGORY
                      ================================================= */}

                      <div className="mb-6 flex items-center justify-between">

                        <span className="rounded-full bg-orange-500/20 px-3 py-1 text-xs font-bold text-orange-300">
                          {joke.category}
                        </span>

                        <span className="text-2xl">
                          😂
                        </span>

                      </div>

                      {/* =================================================
                          TAMIL / TANGLISH
                          
                          ONLY FOR TAMIL KADI
                      ================================================= */}

                      {isTamilKadi && (

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

                      {/* =================================================
                          QUESTION ICON
                      ================================================= */}

                      <div className="mb-6 text-4xl">
                        🤔
                      </div>

                      {/* =================================================
                          QUESTION
                      ================================================= */}

                      <h3 className="min-h-[100px] text-2xl font-bold leading-relaxed">

                        {getQuestion(
                          joke
                        )}

                      </h3>

                      {/* =================================================
                          PUNCHLINE
                      ================================================= */}

                      {isRevealed && (

                        <div className="mt-6 rounded-2xl border border-orange-400/20 bg-orange-400/10 p-5">

                          <p className="text-xs font-bold uppercase tracking-widest text-orange-400">
                            😂 Punchline
                          </p>

                          <p className="mt-2 text-xl font-black">
                            {getAnswer(
                              joke
                            )}
                          </p>

                        </div>

                      )}

                      {/* =================================================
                          REVEAL BUTTON
                      ================================================= */}

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

                      {/* =================================================
                          LIKE + SHARE
                      ================================================= */}

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
                            : "🤍 Like"}

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
                            : "🔗 Share"}

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

        {/* =====================================================
            PAGINATION
        ===================================================== */}

        {!loading &&
          !error &&
          orderedJokes.length > 0 &&
          totalPages > 1 && (
            <>
              {/* Desktop pagination */}
              <div className="mt-12 hidden items-center justify-center gap-2 md:flex">
                <button
                  type="button"
                  onClick={() =>
                    changePage(
                      safeCurrentPage - 1
                    )
                  }
                  disabled={
                    safeCurrentPage === 1
                  }
                  className="rounded-xl border border-white/10 bg-white/[0.06] px-5 py-3 text-sm font-bold text-white transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-30"
                >
                  ← Previous
                </button>

                {visiblePageNumbers.map(
                  (page, index) =>
                    page === -1 ? (
                      <span
                        key={`desktop-ellipsis-${index}`}
                        className="px-2 text-white/40"
                      >
                        ...
                      </span>
                    ) : (
                      <button
                        key={`desktop-page-${page}`}
                        type="button"
                        onClick={() =>
                          changePage(page)
                        }
                        className={`min-w-11 rounded-xl px-4 py-3 text-sm font-bold transition ${
                          safeCurrentPage === page
                            ? "bg-orange-400 text-black shadow-lg shadow-orange-400/20"
                            : "border border-white/10 bg-white/[0.06] text-white hover:bg-white/10"
                        }`}
                      >
                        {page}
                      </button>
                    )
                )}

                <button
                  type="button"
                  onClick={() =>
                    changePage(
                      safeCurrentPage + 1
                    )
                  }
                  disabled={
                    safeCurrentPage ===
                    totalPages
                  }
                  className="rounded-xl border border-white/10 bg-white/[0.06] px-5 py-3 text-sm font-bold text-white transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-30"
                >
                  Next →
                </button>
              </div>

              {/* Mobile fixed pagination */}
              <div className="fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-[#07091f]/90 px-3 py-3 backdrop-blur-xl md:hidden">
                <div className="mx-auto flex max-w-7xl items-center justify-center gap-1.5">
                  <button
                    type="button"
                    onClick={() =>
                      changePage(
                        safeCurrentPage - 1
                      )
                    }
                    disabled={
                      safeCurrentPage === 1
                    }
                    className="rounded-xl border border-white/10 bg-white/[0.06] px-3 py-2.5 text-xs font-bold text-white transition disabled:cursor-not-allowed disabled:opacity-30"
                    aria-label="Previous page"
                  >
                    ←
                  </button>

                  {visiblePageNumbers.map(
                    (page, index) =>
                      page === -1 ? (
                        <span
                          key={`mobile-ellipsis-${index}`}
                          className="px-1 text-xs text-white/40"
                        >
                          ...
                        </span>
                      ) : (
                        <button
                          key={`mobile-page-${page}`}
                          type="button"
                          onClick={() =>
                            changePage(page)
                          }
                          className={`min-w-9 rounded-xl px-2.5 py-2.5 text-xs font-bold transition ${
                            safeCurrentPage === page
                              ? "bg-orange-400 text-black shadow-lg shadow-orange-400/20"
                              : "border border-white/10 bg-white/[0.06] text-white hover:bg-white/10"
                          }`}
                        >
                          {page}
                        </button>
                      )
                  )}

                  <button
                    type="button"
                    onClick={() =>
                      changePage(
                        safeCurrentPage + 1
                      )
                    }
                    disabled={
                      safeCurrentPage ===
                      totalPages
                    }
                    className="rounded-xl border border-white/10 bg-white/[0.06] px-3 py-2.5 text-xs font-bold text-white transition disabled:cursor-not-allowed disabled:opacity-30"
                    aria-label="Next page"
                  >
                    →
                  </button>
                </div>
              </div>

              {/* Extra bottom space for fixed mobile pagination */}
              <div className="h-20 md:hidden" />
            </>
          )}

      </section>

      {/* =====================================================
          BOTTOM CTA
      ===================================================== */}

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

      {/* =====================================================
          FOOTER
      ===================================================== */}

      <footer className="border-t border-white/10 px-5 py-8 text-center text-sm text-white/40">
        © 2026 Kadi Riddler. Think. Laugh.
        Get Tricked. 💜
      </footer>

      {/* =====================================================
          GO TO TOP
      ===================================================== */}

      {showGoToTop && (
        <button
          type="button"
          onClick={scrollToTop}
          aria-label="Go to top"
          className="fixed bottom-24 right-5 z-50 flex size-12 items-center justify-center rounded-full bg-orange-400 text-2xl font-black text-black shadow-xl shadow-orange-400/20 transition hover:scale-105 md:bottom-8 md:right-8"
        >
          ↑
        </button>
      )}

    </main>
  );
}

/* =========================================================
   SUSPENSE WRAPPER
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