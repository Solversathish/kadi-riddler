"use client";

import { useSearchParams } from "next/navigation";

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";

  return (
    <main className="min-h-screen bg-[#07091f] text-white">

      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-white/10 bg-[#07091f]/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5">

          {/* Logo */}
          <a
            href="/"
            className="text-2xl font-black tracking-tight"
          >
            <span className="text-white">KADI</span>{" "}
            <span className="text-yellow-400">RIDDLER</span>
          </a>

          {/* Navigation */}
          <nav className="hidden gap-8 text-sm font-bold md:flex">
            <a
              href="/"
              className="text-white/70 hover:text-yellow-400"
            >
              Home
            </a>

            <a
              href="/riddles"
              className="text-white/70 hover:text-yellow-400"
            >
              Riddles
            </a>

            <a
              href="/kadi-jokes"
              className="text-white/70 hover:text-orange-400"
            >
              Kadi Jokes
            </a>

            <a
              href="/facts"
              className="text-white/70 hover:text-green-400"
            >
              Amazing Facts
            </a>
          </nav>

          {/* Search */}
          <div className="rounded-full bg-white/10 px-4 py-2 text-lg">
            🔍
          </div>

        </div>
      </header>

      {/* Search Section */}
      <section className="mx-auto max-w-4xl px-5 py-20">

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
        <form
          action="/search"
          method="GET"
          className="mx-auto mt-10 flex max-w-2xl gap-3"
        >
          <input
            type="text"
            name="q"
            defaultValue={query}
            placeholder="Search riddles, jokes, facts..."
            className="min-w-0 flex-1 rounded-2xl border border-white/10 bg-white/10 px-5 py-4 text-white outline-none placeholder:text-white/40 focus:border-yellow-400"
          />

          <button
            type="submit"
            className="rounded-2xl bg-yellow-400 px-6 py-4 font-black text-black transition hover:scale-[1.02]"
          >
            Search
          </button>
        </form>

        {/* Current Search */}
        {query && (
          <div className="mt-12 text-center">

            <p className="text-sm uppercase tracking-widest text-white/40">
              Search results for
            </p>

            <h2 className="mt-2 text-2xl font-black text-yellow-400">
              "{query}"
            </h2>

            <div className="mt-8 rounded-3xl border border-white/10 bg-white/[0.06] p-8">
              <p className="text-white/60">
                Search results will appear here.
              </p>
            </div>

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