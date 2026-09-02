"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../supabase/client";

/* =========================================================
   TYPES
========================================================= */

type SupabaseRiddle = {
  id: number;
  category?: string | null;
  difficulty?: string | null;

  question?: string | null;
  answer?: string | null;

  tamil_question?: string | null;
  tamil_answer?: string | null;

  tanglish_question?: string | null;
  tanglish_answer?: string | null;
};

type SupabaseKadi = {
  id: number;
  category?: string | null;

  tamil_question?: string | null;
  tanglish_question?: string | null;
  english_question?: string | null;

  tamil_answer?: string | null;
  tanglish_answer?: string | null;
  english_answer?: string | null;
};

type SupabaseFact = {
  id: number;
  category?: string | null;

  fact?: string | null;
  detail?: string | null;

  title?: string | null;
  description?: string | null;
};

type SearchResult = {
  id: string;
  numericId: number;
  type: "Riddle" | "Kadi Joke" | "Fact";
  category: string;
  title: string;
  href: string;
};

/* =========================================================
   SEARCH BAR
========================================================= */

export default function SearchBar() {
  const router = useRouter();

  const [query, setQuery] = useState("");
  const [focused, setFocused] = useState(false);

  /* =======================================================
     SUPABASE DATA
  ======================================================= */

  const [riddles, setRiddles] = useState<SupabaseRiddle[]>([]);
  const [kadiJokes, setKadiJokes] = useState<SupabaseKadi[]>([]);
  const [facts, setFacts] = useState<SupabaseFact[]>([]);

  const [loading, setLoading] = useState(true);

  /* =======================================================
     LOAD ALL 3 TABLES FROM SUPABASE
  ======================================================= */

  useEffect(() => {
    let mounted = true;

    async function loadAllData() {
      try {
        setLoading(true);

        const [
          riddlesResponse,
          kadiResponse,
          factsResponse,
        ] = await Promise.all([
          supabase
            .from("riddles")
            .select("*")
            .order("id", { ascending: true }),

          supabase
            .from("kadi_jokes")
            .select("*")
            .order("id", { ascending: true }),

          supabase
            .from("facts")
            .select("*")
            .order("id", { ascending: true }),
        ]);

        /* =================================================
           RIDDLES
        ================================================= */

        if (riddlesResponse.error) {
          console.error(
            "SEARCH BAR - RIDDLES ERROR:",
            riddlesResponse.error
          );
        } else if (mounted) {
          setRiddles(
            (riddlesResponse.data || []) as SupabaseRiddle[]
          );
        }

        /* =================================================
           KADI JOKES
        ================================================= */

        if (kadiResponse.error) {
          console.error(
            "SEARCH BAR - KADI JOKES ERROR:",
            kadiResponse.error
          );
        } else if (mounted) {
          setKadiJokes(
            (kadiResponse.data || []) as SupabaseKadi[]
          );
        }

        /* =================================================
           FACTS
        ================================================= */

        if (factsResponse.error) {
          console.error(
            "SEARCH BAR - FACTS ERROR:",
            factsResponse.error
          );
        } else if (mounted) {
          setFacts(
            (factsResponse.data || []) as SupabaseFact[]
          );
        }
      } catch (error) {
        console.error(
          "SEARCH BAR - FAILED TO LOAD DATA:",
          error
        );
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadAllData();

    return () => {
      mounted = false;
    };
  }, []);

  /* =======================================================
     GLOBAL SEARCH
  ======================================================= */

  const results = useMemo<SearchResult[]>(() => {
    const search = query.trim().toLowerCase();

    if (!search) {
      return [];
    }

    /* =====================================================
       RIDDLES
    ===================================================== */

    const riddleResults: SearchResult[] = riddles
      .filter((riddle) => {
        const searchableText = [
          riddle.question || "",
          riddle.answer || "",

          riddle.tamil_question || "",
          riddle.tamil_answer || "",

          riddle.tanglish_question || "",
          riddle.tanglish_answer || "",

          riddle.category || "",
          riddle.difficulty || "",
        ]
          .join(" ")
          .toLowerCase();

        return searchableText.includes(search);
      })
      .map((riddle) => ({
        id: `riddle-${riddle.id}`,
        numericId: riddle.id,
        type: "Riddle",
        category: riddle.category || "Riddle",
        title:
          riddle.question ||
          riddle.tamil_question ||
          riddle.tanglish_question ||
          "Untitled Riddle",
        href: "/riddles",
      }));

    /* =====================================================
       KADI JOKES
    ===================================================== */

    const kadiResults: SearchResult[] = kadiJokes
      .filter((joke) => {
        const searchableText = [
          joke.tamil_question || "",
          joke.tanglish_question || "",
          joke.english_question || "",

          joke.tamil_answer || "",
          joke.tanglish_answer || "",
          joke.english_answer || "",

          joke.category || "",
        ]
          .join(" ")
          .toLowerCase();

        return searchableText.includes(search);
      })
      .map((joke) => ({
        id: `kadi-${joke.id}`,
        numericId: joke.id,
        type: "Kadi Joke",
        category: joke.category || "Kadi Joke",

        title:
          joke.english_question ||
          joke.tamil_question ||
          joke.tanglish_question ||
          "Untitled Kadi Joke",

        href: "/kadi-jokes",
      }));

    /* =====================================================
       FACTS
    ===================================================== */

    const factResults: SearchResult[] = facts
      .filter((fact) => {
        const searchableText = [
          fact.fact || "",
          fact.detail || "",

          fact.title || "",
          fact.description || "",

          fact.category || "",
        ]
          .join(" ")
          .toLowerCase();

        return searchableText.includes(search);
      })
      .map((fact) => ({
        id: `fact-${fact.id}`,
        numericId: fact.id,
        type: "Fact",
        category: fact.category || "Fact",

        title:
          fact.fact ||
          fact.title ||
          fact.description ||
          "Untitled Fact",

        href: "/facts",
      }));

    /* =====================================================
       COMBINE ALL RESULTS
    ===================================================== */

    return [
      ...riddleResults,
      ...kadiResults,
      ...factResults,
    ].slice(0, 6);
  }, [query, riddles, kadiJokes, facts]);

  /* =======================================================
     NAVIGATE TO RESULT
  ======================================================= */

  function goToResult(result: SearchResult) {
    const search = query.trim();

    if (!search) {
      return;
    }

    setFocused(false);
    setQuery("");

    router.push(
      `${result.href}?search=${encodeURIComponent(
        search
      )}&highlight=${result.numericId}`
    );
  }

  /* =======================================================
     SEARCH SUBMIT
  ======================================================= */

  function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    const search = query.trim();

    if (!search) {
      return;
    }

    if (results.length > 0) {
      goToResult(results[0]);
    }
  }

  /* =======================================================
     SUGGESTION CLICK
  ======================================================= */

  function handleSuggestionClick(
    result: SearchResult
  ) {
    goToResult(result);
  }

  /* =======================================================
     SEE ALL
  ======================================================= */

  function handleSeeAllResults() {
    const search = query.trim();

    if (!search || results.length === 0) {
      return;
    }

    const firstResult = results[0];

    setFocused(false);
    setQuery("");

    router.push(
      `${firstResult.href}?search=${encodeURIComponent(
        search
      )}&highlight=${firstResult.numericId}`
    );
  }

  /* =======================================================
     UI
  ======================================================= */

  return (
    <div className="relative w-full max-w-md">

      {/* SEARCH FORM */}

      <form onSubmit={handleSubmit}>
        <div className="flex items-center rounded-full border border-white/10 bg-white/10 px-4 py-2 transition focus-within:border-yellow-400/60 focus-within:bg-white/[0.12]">

          <span className="mr-2 text-lg">
            🔍
          </span>

          <input
            type="text"
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setFocused(true);
            }}
            onFocus={() => setFocused(true)}
            onBlur={() => {
              setTimeout(() => {
                setFocused(false);
              }, 200);
            }}
            placeholder="Search..."
            aria-label="Global Search"
            autoComplete="off"
            className="w-full bg-transparent py-1 text-sm text-white outline-none placeholder:text-white/40"
          />

        </div>
      </form>

      {/* ===================================================
          SEARCH RESULTS
      =================================================== */}

      {focused && query.trim() && (
        <div className="absolute left-0 right-0 top-full z-[100] mt-3 overflow-hidden rounded-2xl border border-white/10 bg-[#0b1030] shadow-2xl">

          {/* LOADING */}

          {loading ? (
            <div className="px-4 py-5 text-center">
              <div className="text-2xl">
                🔍
              </div>

              <p className="mt-2 text-sm font-bold text-white/70">
                Searching...
              </p>
            </div>
          ) : results.length > 0 ? (

            /* =================================================
               RESULTS
            ================================================= */

            <div className="p-2">

              {results.map((result) => (
                <button
                  key={result.id}
                  type="button"
                  onMouseDown={(event) => {
                    event.preventDefault();
                  }}
                  onClick={() =>
                    handleSuggestionClick(result)
                  }
                  className="block w-full rounded-xl px-4 py-3 text-left transition hover:bg-white/10"
                >

                  <div className="flex items-center gap-2">

                    <span className="rounded-full bg-yellow-400/15 px-2 py-1 text-[10px] font-bold text-yellow-300">
                      {result.type}
                    </span>

                    <span className="text-[10px] text-white/40">
                      {result.category}
                    </span>

                  </div>

                  <p className="mt-1 line-clamp-2 text-sm font-bold text-white">
                    {result.title}
                  </p>

                </button>
              ))}

              {/* SEE ALL */}

              <button
                type="button"
                onMouseDown={(event) => {
                  event.preventDefault();
                }}
                onClick={handleSeeAllResults}
                className="mt-1 w-full rounded-xl px-4 py-3 text-left text-sm font-bold text-yellow-400 transition hover:bg-white/10"
              >
                🔍 Go to first result →
              </button>

            </div>

          ) : (

            /* =================================================
               NO RESULTS
            ================================================= */

            <div className="px-4 py-5 text-center">

              <div className="text-2xl">
                🤔
              </div>

              <p className="mt-2 text-sm font-bold text-white/70">
                No matching results
              </p>

              <p className="mt-1 text-xs text-white/40">
                Try another word
              </p>

            </div>
          )}

        </div>
      )}

    </div>
  );
}