"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@supabase/supabase-js";

type Fact = {
  id: number;
  category: string;
  emoji: string | null;
  fact: string;
  detail: string;
  likes: number;
  shares: number;
};

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

function FactsPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // ============================================
  // GLOBAL SEARCH
  // ============================================

  const globalSearch =
    searchParams.get("search") || "";

  const highlightId =
    Number(searchParams.get("highlight")) || null;

  const [facts, setFacts] = useState<Fact[]>([]);
  const [selectedCategory, setSelectedCategory] =
    useState("All");
  const [expanded, setExpanded] =
    useState<number[]>([]);
  const [likedFacts, setLikedFacts] =
    useState<number[]>([]);
  const [sharingId, setSharingId] =
    useState<number | null>(null);
  const [loading, setLoading] =
    useState(true);
  const [error, setError] =
    useState("");

  // ============================================
  // PAGINATION
  // ============================================

  const ITEMS_PER_PAGE = 10;

  const [currentPage, setCurrentPage] =
    useState(1);

  // ============================================
  // GO TO TOP
  // ============================================

  const [showGoToTop, setShowGoToTop] =
    useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowGoToTop(window.scrollY > 500);
    };

    window.addEventListener(
      "scroll",
      handleScroll
    );

    return () => {
      window.removeEventListener(
        "scroll",
        handleScroll
      );
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // ============================================
  // LOAD LIKED FACTS FROM LOCAL STORAGE
  // ============================================

  useEffect(() => {
    try {
      const saved = localStorage.getItem(
        "kadi-liked-facts"
      );

      if (saved) {
        setLikedFacts(JSON.parse(saved));
      }
    } catch {
      // Ignore localStorage errors
    }
  }, []);

  // ============================================
  // FETCH FACTS
  // ============================================

  useEffect(() => {
    fetchFacts();
  }, []);

  const fetchFacts = async () => {
    setLoading(true);
    setError("");

    try {
      const { data, error } = await supabase
        .from("facts")
        .select(
          "id, category, emoji, fact, detail, likes, shares"
        )
        .order("id", {
          ascending: true,
        });

      if (error) {
        console.error(
          "FACTS LOAD ERROR:",
          error
        );

        setError(
          error.message ||
            "Unable to load facts."
        );

        setLoading(false);
        return;
      }

      setFacts(
        (data || []).map((item) => ({
          id: Number(item.id),
          category: item.category || "",
          emoji: item.emoji || null,
          fact: item.fact || "",
          detail: item.detail || "",
          likes: Number(item.likes || 0),
          shares: Number(item.shares || 0),
        }))
      );
    } catch (err) {
      console.error(
        "FACTS FETCH ERROR:",
        err
      );

      setError(
        "Unable to load facts. Please try again."
      );
    }

    setLoading(false);
  };

  // ============================================
  // CATEGORIES
  // ============================================

  const categories = [
    "All",
    ...Array.from(
      new Set(
        facts.map(
          (fact) => fact.category
        )
      )
    ),
  ];

  // ============================================
  // FILTER
  // ============================================

  const filteredFacts =
    selectedCategory === "All"
      ? facts
      : facts.filter(
          (fact) =>
            fact.category ===
            selectedCategory
        );

  // ============================================
  // GLOBAL SEARCH RESULT
  //
  // Move the highlighted fact to the top.
  // ============================================

  const orderedFacts = useMemo(() => {
    if (!highlightId) {
      return filteredFacts;
    }

    const highlighted =
      filteredFacts.find(
        (fact) =>
          fact.id === highlightId
      );

    if (!highlighted) {
      return filteredFacts;
    }

    return [
      highlighted,
      ...filteredFacts.filter(
        (fact) =>
          fact.id !== highlightId
      ),
    ];
  }, [
    filteredFacts,
    highlightId,
  ]);

  // ============================================
  // PAGINATION CALCULATIONS
  // ============================================

  const totalPages = Math.max(
    1,
    Math.ceil(
      orderedFacts.length /
        ITEMS_PER_PAGE
    )
  );

  const safeCurrentPage = Math.min(
    currentPage,
    totalPages
  );

  const paginatedFacts = useMemo(() => {
    const start =
      (safeCurrentPage - 1) *
      ITEMS_PER_PAGE;

    return orderedFacts.slice(
      start,
      start + ITEMS_PER_PAGE
    );
  }, [
    orderedFacts,
    safeCurrentPage,
  ]);

  /*
    Page numbers are numeric only.
    -1 is only a visual marker for "...".
    It is never sent to changePage().
  */
  const visiblePageNumbers =
    useMemo(() => {
      if (totalPages <= 5) {
        return Array.from(
          { length: totalPages },
          (_, index) => index + 1
        );
      }

      /*
        Pagination format:

        Page 1:
        1  2  3  ...  FINAL

        Page 2:
        2  3  4  ...  FINAL

        Middle:
        1  ...  current-1  current  current+1  ...  FINAL

        Near the end:
        1  ...  FINAL-3  FINAL-2  FINAL-1  FINAL
      */
      if (safeCurrentPage <= 2) {
        return [
          safeCurrentPage,
          safeCurrentPage + 1,
          safeCurrentPage + 2,
          -1,
          totalPages,
        ];
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

  // Reset to page 1 when the category
  // or highlighted search result changes.
  useEffect(() => {
    setCurrentPage(1);
  }, [
    selectedCategory,
    highlightId,
  ]);

  // Keep the current page valid if the
  // number of facts/pages becomes smaller.
  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [
    currentPage,
    totalPages,
  ]);

  // ============================================
  // SCROLL TO GLOBAL SEARCH RESULT
  // ============================================

  useEffect(() => {
    if (!highlightId) {
      return;
    }

    const timer = setTimeout(() => {
      const element =
        document.getElementById(
          `fact-${highlightId}`
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
    orderedFacts,
  ]);

  // ============================================
  // EXPAND / COLLAPSE
  // ============================================

  const toggleFact = (
    id: number
  ) => {
    setExpanded((current) =>
      current.includes(id)
        ? current.filter(
            (item) => item !== id
          )
        : [...current, id]
    );
  };

  // ============================================
  // LIKE
  // ============================================

  const handleLike = async (
    fact: Fact
  ) => {
    // Prevent this browser from liking
    // the same fact twice
    if (likedFacts.includes(fact.id)) {
      return;
    }

    const oldLikes =
      fact.likes || 0;

    const newLikes =
      oldLikes + 1;

    // Update screen immediately
    setFacts((current) =>
      current.map((item) =>
        item.id === fact.id
          ? {
              ...item,
              likes: newLikes,
            }
          : item
      )
    );

    const updatedLikedFacts = [
      ...likedFacts,
      fact.id,
    ];

    setLikedFacts(
      updatedLikedFacts
    );

    // Save liked state locally
    try {
      localStorage.setItem(
        "kadi-liked-facts",
        JSON.stringify(
          updatedLikedFacts
        )
      );
    } catch {
      // Ignore localStorage errors
    }

    // Update Supabase
    try {
      const { error } =
        await supabase
          .from("facts")
          .update({
            likes: newLikes,
          })
          .eq("id", fact.id);

      if (error) {
        console.error(
          "LIKE ERROR:",
          error
        );

        // Roll back screen
        setFacts((current) =>
          current.map((item) =>
            item.id === fact.id
              ? {
                  ...item,
                  likes: oldLikes,
                }
              : item
          )
        );

        // Roll back local storage
        setLikedFacts(likedFacts);

        try {
          localStorage.setItem(
            "kadi-liked-facts",
            JSON.stringify(
              likedFacts
            )
          );
        } catch {
          // Ignore
        }

        return;
      }

      // Reload from Supabase so the
      // displayed number is always real
      await fetchFacts();
    } catch (err) {
      console.error(
        "LIKE EXCEPTION:",
        err
      );

      // Roll back
      setFacts((current) =>
        current.map((item) =>
          item.id === fact.id
            ? {
                ...item,
                likes: oldLikes,
              }
            : item
        )
      );

      setLikedFacts(likedFacts);

      try {
        localStorage.setItem(
          "kadi-liked-facts",
          JSON.stringify(
            likedFacts
          )
        );
      } catch {
        // Ignore
      }
    }
  };

  // ============================================
  // SHARE
  // ============================================

  const handleShare = async (
    fact: Fact
  ) => {
    setSharingId(fact.id);

    const shareUrl =
      typeof window !==
      "undefined"
        ? `${window.location.origin}/facts#fact-${fact.id}`
        : "";

    const shareText =
      `${fact.fact}\n\nDid you know this? 🤯`;

    try {
      let shareCompleted =
        false;

      // Native browser share
      if (
        typeof navigator !==
          "undefined" &&
        navigator.share
      ) {
        await navigator.share({
          title:
            "Kadi Riddler - Amazing Facts",
          text: shareText,
          url: shareUrl,
        });

        shareCompleted = true;
      } else {
        // Desktop fallback
        if (
          typeof navigator !==
            "undefined" &&
          navigator.clipboard
        ) {
          await navigator.clipboard.writeText(
            `${shareText}\n\n${shareUrl}`
          );

          alert(
            "Fact link copied!"
          );

          shareCompleted = true;
        }
      }

      // Only increase share count if
      // sharing actually happened
      if (!shareCompleted) {
        setSharingId(null);
        return;
      }

      const oldShares =
        fact.shares || 0;

      const newShares =
        oldShares + 1;

      // Update screen immediately
      setFacts((current) =>
        current.map((item) =>
          item.id === fact.id
            ? {
                ...item,
                shares: newShares,
              }
            : item
        )
      );

      // Update Supabase
      const { error } =
        await supabase
          .from("facts")
          .update({
            shares: newShares,
          })
          .eq("id", fact.id);

      if (error) {
        console.error(
          "SHARE ERROR:",
          error
        );

        // Roll back screen
        setFacts((current) =>
          current.map((item) =>
            item.id === fact.id
              ? {
                  ...item,
                  shares: oldShares,
                }
              : item
          )
        );

        return;
      }

      // Reload real database values
      await fetchFacts();
    } catch (err) {
      // User cancelled native sharing
      console.log(
        "Share cancelled:",
        err
      );
    } finally {
      setSharingId(null);
    }
  };

  // ============================================
  // CANCEL SEARCH
  // ============================================

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

  // ============================================
  // LOADING
  // ============================================

  if (loading) {
    return (
      <main className="min-h-screen bg-[#07091f] text-white">

        <section className="flex min-h-screen items-center justify-center px-5">

          <div className="text-center">

            <div className="mb-5 text-6xl">
              🤯
            </div>

            <h1 className="text-3xl font-black">
              Loading Facts...
            </h1>

            <p className="mt-3 text-white/50">
              Preparing something
              interesting for you.
            </p>

            <div className="mx-auto mt-6 h-2 w-48 overflow-hidden rounded-full bg-white/10">

              <div className="h-full w-1/2 animate-pulse rounded-full bg-green-400" />

            </div>

          </div>

        </section>

      </main>
    );
  }

  // ============================================
  // ERROR
  // ============================================

  if (error) {
    return (
      <main className="min-h-screen bg-[#07091f] text-white">

        <section className="flex min-h-screen items-center justify-center px-5">

          <div className="w-full max-w-2xl rounded-3xl border border-red-400/20 bg-red-500/10 p-10 text-center">

            <div className="text-6xl">
              😵
            </div>

            <h1 className="mt-5 text-3xl font-black">
              Something went wrong
            </h1>

            <p className="mt-3 text-white/60">
              {error}
            </p>

            <button
              type="button"
              onClick={fetchFacts}
              className="mt-7 rounded-2xl bg-green-400 px-7 py-4 font-bold text-black transition hover:scale-105"
            >
              Try Again
            </button>

          </div>

        </section>

      </main>
    );
  }

  // ============================================
  // MAIN PAGE
  // ============================================

  return (
    <main className="min-h-screen bg-[#07091f] text-white">

      {/* ========================================
          HERO
      ======================================== */}

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
            Strange, surprising and
            fascinating facts from our
            world and beyond.
          </p>

        </div>

      </section>

      {/* ========================================
          CATEGORIES
      ======================================== */}

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
                    ? "bg-green-400 text-black shadow-lg shadow-green-400/20"
                    : "bg-white/10 text-white hover:bg-white/20"
                }`}
              >
                {category}
              </button>

            )
          )}

        </div>

      </section>

      {/* ========================================
          FACTS SECTION
      ======================================== */}

      <section className="mx-auto max-w-7xl px-5 py-14">

        <div className="mb-8 flex items-end justify-between">

          <div>

            <p className="mb-2 text-sm font-bold uppercase tracking-widest text-green-400">
              Feed your curiosity
            </p>

            <h2 className="text-3xl font-black md:text-4xl">
              {selectedCategory ===
              "All"
                ? "Amazing Facts"
                : selectedCategory}
            </h2>

          </div>

          <span className="rounded-full bg-white/10 px-4 py-2 text-sm text-white/60">

            {orderedFacts.length}{" "}

            {orderedFacts.length ===
            1
              ? "fact"
              : "facts"}

          </span>

        </div>

        {/* ========================================
            GLOBAL SEARCH RESULT
        ======================================== */}

        {globalSearch && (

          <div className="mb-8 flex items-center justify-between gap-4 rounded-2xl border border-green-400/20 bg-green-400/10 px-5 py-4">

            <div className="min-w-0">
              <p className="text-sm text-white/60">
                Search result for
              </p>

              <p className="mt-1 truncate text-lg font-bold text-green-300">
                "{globalSearch}"
              </p>
            </div>

            <button
              type="button"
              onClick={cancelSearch}
              aria-label="Cancel search"
              title="Cancel search"
              className="flex size-11 shrink-0 items-center justify-center rounded-full border border-green-300/30 bg-black/20 text-2xl font-bold leading-none text-green-200 transition hover:scale-105 hover:bg-green-400 hover:text-black"
            >
              ×
            </button>

          </div>

        )}

        {/* ========================================
            NO FACTS
        ======================================== */}

        {orderedFacts.length ===
          0 && (

          <div className="rounded-3xl border border-white/10 bg-white/[0.06] p-12 text-center">

            <div className="text-6xl">
              🔍
            </div>

            <h3 className="mt-5 text-2xl font-black">
              No facts found
            </h3>

            <p className="mt-3 text-white/50">
              There are no facts in this
              category yet.
            </p>

          </div>

        )}

        {/* ========================================
            FACT CARDS
        ======================================== */}

        <div className="grid gap-6 md:grid-cols-2">

          {paginatedFacts.map(
            (fact) => {

              const isExpanded =
                expanded.includes(
                  fact.id
                );

              const isLiked =
                likedFacts.includes(
                  fact.id
                );

              const isSharing =
                sharingId ===
                fact.id;

              const isHighlighted =
                highlightId ===
                fact.id;

              return (

                <article
                  key={fact.id}
                  id={`fact-${fact.id}`}
                  className={`group rounded-3xl border p-7 shadow-xl transition hover:-translate-y-1 ${
                    isHighlighted
                      ? "border-green-400 bg-green-400/[0.12] shadow-green-400/20 ring-2 ring-green-400/60"
                      : "border-white/10 bg-white/[0.06] hover:bg-white/[0.09]"
                  }`}
                >

                  {/* ==================================
                      MATCHING RESULT
                  ================================== */}

                  {isHighlighted && (

                    <div className="-mx-7 -mt-7 mb-6 rounded-t-3xl bg-green-400 px-5 py-2 text-center text-sm font-black uppercase tracking-widest text-black">
                      🔍 Matching Result
                    </div>

                  )}

                  {/* ==================================
                      CATEGORY + EMOJI
                  ================================== */}

                  <div className="mb-6 flex items-center justify-between">

                    <span className="rounded-full bg-green-500/20 px-3 py-1 text-xs font-bold text-green-300">
                      {fact.category}
                    </span>

                    <span className="text-4xl">
                      {fact.emoji ||
                        "🤯"}
                    </span>

                  </div>

                  {/* ==================================
                      LABEL
                  ================================== */}

                  <p className="mb-4 text-sm font-bold uppercase tracking-widest text-green-400">
                    🤯 Did You Know?
                  </p>

                  {/* ==================================
                      FACT
                  ================================== */}

                  <h3 className="text-2xl font-black leading-relaxed">
                    {fact.fact}
                  </h3>

                  {/* ==================================
                      DETAIL
                  ================================== */}

                  {isExpanded && (

                    <div className="mt-6 rounded-2xl border border-green-400/20 bg-green-400/10 p-5">

                      <p className="text-base leading-7 text-white/80">
                        {fact.detail}
                      </p>

                    </div>

                  )}

                  {/* ==================================
                      TELL ME MORE
                  ================================== */}

                  <button
                    type="button"
                    onClick={() =>
                      toggleFact(
                        fact.id
                      )
                    }
                    className="mt-7 w-full rounded-2xl bg-gradient-to-r from-green-500 to-emerald-400 px-5 py-4 font-bold text-black transition hover:scale-[1.02]"
                  >

                    {isExpanded
                      ? "🙈 Hide Detail"
                      : "🤯 Tell Me More"}

                  </button>

                  {/* ==================================
                      LIKE + SHARE
                  ================================== */}

                  <div className="mt-4 grid grid-cols-2 gap-3">

                    {/* LIKE */}

                    <button
                      type="button"
                      onClick={() =>
                        handleLike(
                          fact
                        )
                      }
                      disabled={isLiked}
                      className={`rounded-2xl border px-5 py-4 font-bold transition ${
                        isLiked
                          ? "border-pink-400/30 bg-pink-500/20 text-pink-300"
                          : "border-white/10 bg-white/[0.06] text-white hover:bg-white/10"
                      }`}
                    >

                      {isLiked
                        ? "❤️ Liked"
                        : "🤍 Like"}{" "}

                      <span className="ml-1 text-white/50">
                        {fact.likes}
                      </span>

                    </button>

                    {/* SHARE */}

                    <button
                      type="button"
                      onClick={() =>
                        handleShare(
                          fact
                        )
                      }
                      disabled={
                        isSharing
                      }
                      className="rounded-2xl border border-white/10 bg-white/[0.06] px-5 py-4 font-bold text-white transition hover:bg-white/10"
                    >

                      {isSharing
                        ? "⏳ Sharing..."
                        : "🔗 Share"}{" "}

                      <span className="ml-1 text-white/50">
                        {fact.shares}
                      </span>

                    </button>

                  </div>

                </article>

              );

            }
          )}

        </div>

        {/* ========================================
            PAGINATION
        ======================================== */}

        {orderedFacts.length > 0 &&
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
                            ? "bg-green-400 text-black shadow-lg shadow-green-400/20"
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
                              ? "bg-green-400 text-black shadow-lg shadow-green-400/20"
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

              {/* Prevent fixed mobile pagination from covering content */}
              <div className="h-20 md:hidden" />
            </>
          )}

      </section>

      {/* ========================================
          BOTTOM CTA
      ======================================== */}

      <section className="mx-auto max-w-5xl px-5 pb-20">

        <div className="rounded-3xl border border-green-400/20 bg-gradient-to-r from-green-700/30 to-emerald-500/10 p-8 text-center">

          <div className="text-4xl">
            🌎
          </div>

          <h2 className="mt-4 text-3xl font-black">
            The world is full of surprises!
          </h2>

          <p className="mt-3 text-white/60">
            Keep exploring. You never know
            what you'll discover next.
          </p>

        </div>

      </section>

      {/* ========================================
          FOOTER
      ======================================== */}

      <footer className="border-t border-white/10 px-5 py-8 text-center text-sm text-white/40">
        © 2026 Kadi Riddler. Think. Laugh.
        Get Tricked. 💜
      </footer>

      {/* ========================================
          GO TO TOP
      ======================================== */}

      {showGoToTop && (
        <button
          type="button"
          onClick={scrollToTop}
          aria-label="Go to top"
          className="fixed bottom-24 right-5 z-50 flex size-12 items-center justify-center rounded-full bg-green-400 text-2xl font-black text-black shadow-xl shadow-green-400/20 transition hover:scale-105 md:bottom-8 md:right-8"
        >
          ↑
        </button>
      )}

    </main>
  );
}

// Next.js requires useSearchParams() to be rendered inside a Suspense boundary.
export default function FactsPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-[#08091f] text-white" />
      }
    >
      <FactsPageContent />
    </Suspense>
  );
}
