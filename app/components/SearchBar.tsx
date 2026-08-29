"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import { riddles } from "../data/riddles";
import { kadiJokes } from "../data/kadi-jokes";
import { facts } from "../data/facts";

type SearchResult = {
  id: string;
  type: "Riddle" | "Kadi Joke" | "Fact";
  category: string;
  title: string;
  href: string;
};

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const [focused, setFocused] = useState(false);

  const results = useMemo<SearchResult[]>(() => {
    const search = query.trim().toLowerCase();

    if (!search) return [];

    const riddleResults: SearchResult[] = riddles
      .filter((riddle) =>
        [
          riddle.question,
          riddle.answer,
          riddle.tanglishQuestion || "",
          riddle.tanglishAnswer || "",
          riddle.category,
          riddle.difficulty,
        ]
          .join(" ")
          .toLowerCase()
          .includes(search)
      )
      .map((riddle) => ({
        id: `riddle-${riddle.id}`,
        type: "Riddle",
        category: riddle.category,
        title: riddle.question,
        href: "/riddles",
      }));

    const kadiResults: SearchResult[] = kadiJokes
      .filter((joke) =>
        [
          joke.question,
          joke.answer,
          joke.tanglishQuestion || "",
          joke.tanglishAnswer || "",
          joke.category,
        ]
          .join(" ")
          .toLowerCase()
          .includes(search)
      )
      .map((joke) => ({
        id: `kadi-${joke.id}`,
        type: "Kadi Joke",
        category: joke.category,
        title: joke.question,
        href: "/kadi-jokes",
      }));

    const factResults: SearchResult[] = facts
      .filter((fact) =>
        [fact.fact, fact.detail, fact.category]
          .join(" ")
          .toLowerCase()
          .includes(search)
      )
      .map((fact) => ({
        id: `fact-${fact.id}`,
        type: "Fact",
        category: fact.category,
        title: fact.fact,
        href: "/facts",
      }));

    return [
      ...riddleResults,
      ...kadiResults,
      ...factResults,
    ].slice(0, 6);
  }, [query]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const search = query.trim();

    if (!search) return;

    window.location.href = `/search?q=${encodeURIComponent(search)}`;
  };

  return (
    <div className="relative w-full max-w-md">
      <form onSubmit={handleSubmit}>
        <div className="flex items-center rounded-full border border-white/10 bg-white/10 px-4 py-2 transition focus-within:border-yellow-400/60 focus-within:bg-white/[0.12]">

          <span className="mr-2 text-lg">
            🔍
          </span>

          <input
            type="text"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => {
              setTimeout(() => setFocused(false), 150);
            }}
            placeholder="Search..."
            aria-label="Search"
            autoComplete="off"
            className="w-full bg-transparent py-1 text-sm text-white outline-none placeholder:text-white/40"
          />

        </div>
      </form>

      {/* LIVE SEARCH SUGGESTIONS */}
      {focused && query.trim() && (
        <div className="absolute left-0 right-0 top-full z-[100] mt-3 overflow-hidden rounded-2xl border border-white/10 bg-[#0b1030] shadow-2xl">

          {results.length > 0 ? (
            <div className="p-2">

              {results.map((result) => (
                <Link
                  key={result.id}
                  href={`${result.href}?search=${encodeURIComponent(query)}`}
                  onClick={() => setFocused(false)}
                  className="block rounded-xl px-4 py-3 transition hover:bg-white/10"
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

                </Link>
              ))}

              <button
                type="submit"
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => {
                  window.location.href = `/search?q=${encodeURIComponent(
                    query.trim()
                  )}`;
                }}
                className="mt-1 w-full rounded-xl px-4 py-3 text-left text-sm font-bold text-yellow-400 transition hover:bg-white/10"
              >
                🔍 See all results →
              </button>

            </div>
          ) : (
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