"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import SearchBar from "../components/SearchBar";

import { riddles } from "../data/riddles";
import { kadiJokes } from "../data/kadi-jokes";
import { facts } from "../data/facts";

type SearchResult = {
  id: string;
  type: "Riddle" | "Kadi Joke" | "Fact";
  category: string;
  title: string;
  text: string;
  detail?: string;
  href: string;
};

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q")?.trim() || "";

  const searchText = query.toLowerCase();

  const results: SearchResult[] = [
    ...riddles.map((riddle) => ({
      id: `riddle-${riddle.id}`,
      type: "Riddle" as const,
      category: riddle.category,
      title: riddle.question,
      text: [
        riddle.question,
        riddle.answer,
        riddle.tanglishQuestion || "",
        riddle.tanglishAnswer || "",
        riddle.category,
        riddle.difficulty,
      ].join(" "),
      href: "/riddles",
    })),

    ...kadiJokes.map((joke) => ({
      id: `kadi-${joke.id}`,
      type: "Kadi Joke" as const,
      category: joke.category,
      title: joke.question,
      text: [
        joke.question,
        joke.answer,
        joke.tanglishQuestion || "",
        joke.tanglishAnswer || "",
        joke.category,
      ].join(" "),
      href: "/kadi-jokes",
    })),

    ...facts.map((fact) => ({
      id: `fact-${fact.id}`,
      type: "Fact" as const,
      category: fact.category,
      title: fact.fact,
      text: [
        fact.fact,
        fact.detail,
        fact.category,
      ].join(" "),
      detail: fact.detail,
      href: "/facts",
    })),
  ];

  const filteredResults = query
    ? results.filter((result) =>
        result.text.toLowerCase().includes(searchText)
      )
    : [];

  return (
    <main className="min-h-screen bg-[#07091f] text-white">

      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-white/10 bg-[#07091f]/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5">

          {/* Logo */}
          <Link
            href="/"
            className="text-2xl font-black tracking-tight"
          >
            <span className="text-white">KADI</span>{" "}
            <span className="text-yellow-400">RIDDLER</span>
          </Link>

          {/* Navigation */}
          <nav className="hidden gap-8 text-sm font-bold md:flex">
            <Link
              href="/"
              className="text-white/70 transition hover:text-yellow-400"
            >
              Home
            </Link>

            <Link
              href="/riddles"
              className="text-white/70 transition hover:text-yellow-400"
            >
              Riddles
            </Link>

            <Link
              href="/kadi-jokes"
              className="text-white/70 transition hover:text-orange-400"
            >
              Kadi Jokes
            </Link>

            <Link
              href="/facts"
              className="text-white/70 transition hover:text-green-400"
            >
              Amazing Facts
            </Link>
          </nav>

          {/* Search Icon */}
          <div className="rounded-full bg-white/10 px-4 py-2 text-lg">
            🔍
          </div>

        </div>
      </header>

      {/* Search Section */}
      <section className="mx-auto max-w-5xl px-5 py-16">

        {/* Title */}
        <div className="text-center">

          <div className="mb-5 text-6xl">
            🔍
          </div>

          <h1 className="text-4xl font-black md:text-6xl">
            Search{" "}
            <span className="text-yellow-400">
              Kadi Riddler
            </span>
          </h1>

          <p className="mt-5 text-lg text-white/60">
            Find riddles, kadi jokes and amazing facts.
          </p>

        </div>

        {/* Search Box */}
        <div className="mx-auto mt-10 flex max-w-2xl justify-center">
  <SearchBar />
</div>

        {/* Results */}
        {query && (
          <section className="mt-14">

            <div className="mb-8 text-center">

              <p className="text-sm uppercase tracking-widest text-white/40">
                Search results for
              </p>

              <h2 className="mt-2 break-words text-2xl font-black text-yellow-400">
                "{query}"
              </h2>

              <p className="mt-3 text-white/50">
                {filteredResults.length}{" "}
                {filteredResults.length === 1 ? "result" : "results"} found
              </p>

            </div>

            {filteredResults.length === 0 ? (
              <div className="rounded-3xl border border-white/10 bg-white/[0.06] p-10 text-center">

                <div className="text-5xl">
                  🤔
                </div>

                <h3 className="mt-5 text-2xl font-black">
                  No results found
                </h3>

                <p className="mt-3 text-white/50">
                  Try another word or search for something else.
                </p>

              </div>
            ) : (
              <div className="grid gap-5">

                {filteredResults.map((result) => (
                  <Link
                    key={result.id}
                    href={result.href}
                    className="group rounded-3xl border border-white/10 bg-white/[0.06] p-6 transition hover:-translate-y-1 hover:bg-white/[0.09]"
                  >

                    <div className="flex flex-wrap items-center justify-between gap-3">

                      <div className="flex flex-wrap items-center gap-2">

                        <span className="rounded-full bg-yellow-400/15 px-3 py-1 text-xs font-bold text-yellow-300">
                          {result.type}
                        </span>

                        <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-bold text-white/60">
                          {result.category}
                        </span>

                      </div>

                      <span className="text-white/30 transition group-hover:text-yellow-400">
                        →
                      </span>

                    </div>

                    <h3 className="mt-5 text-xl font-black leading-relaxed md:text-2xl">
                      {result.title}
                    </h3>

                    {result.type === "Riddle" && (
                      <p className="mt-4 text-sm text-white/50">
                        Search result from Riddles
                      </p>
                    )}

                    {result.type === "Kadi Joke" && (
                      <p className="mt-4 text-sm text-white/50">
                        Search result from Kadi Jokes
                      </p>
                    )}

                    {result.type === "Fact" && result.detail && (
                      <p className="mt-4 line-clamp-2 text-sm leading-6 text-white/50">
                        {result.detail}
                      </p>
                    )}

                    <div className="mt-5 text-sm font-bold text-yellow-400 opacity-0 transition group-hover:opacity-100">
                      Open {result.type} →
                    </div>

                  </Link>
                ))}

              </div>
            )}

          </section>
        )}

        {/* No Search Yet */}
        {!query && (
          <div className="mx-auto mt-14 max-w-2xl rounded-3xl border border-white/10 bg-white/[0.06] p-8 text-center">

            <div className="text-4xl">
              🧩 😂 🤯
            </div>

            <h3 className="mt-4 text-xl font-black">
              What are you looking for?
            </h3>

            <p className="mt-3 text-white/50">
              Search for a riddle, joke, question, animal,
              space fact, science fact and more.
            </p>

          </div>
        )}

      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 px-5 py-8 text-center text-sm text-white/40">
        © 2026 Kadi Riddler. Think. Laugh. Get Tricked. 💜
      </footer>

    </main>
  );
}